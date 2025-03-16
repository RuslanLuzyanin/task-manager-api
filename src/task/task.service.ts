import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkTaskExists(
    id: number,
  ): Promise<Task & { assignedTo: { user: User }[] }> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          include: { user: true },
        },
      },
    });

    if (!task) throw new NotFoundException(`Задача с ID ${id} не найдена`);

    return task as Task & { assignedTo: { user: User }[] };
  }

  private async checkTaskAndResponsibility(
    id: number,
    userId: number,
  ): Promise<Task> {
    const task = await this.checkTaskExists(id);

    const isResponsible = task.assignedTo.some(
      (assignedUser) => assignedUser.user.id === userId,
    );

    if (!isResponsible) {
      throw new ForbiddenException(`Вы не ответственны за эту задачу`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        deadline: createTaskDto.deadline,
        project: { connect: { id: createTaskDto.projectId } },
        assignedTo: {
          create: [
            { userId: userId },
            ...createTaskDto.userIds.map((userId) => ({ userId })),
          ],
        },
      },
    });
  }

  async findAll({
    status,
    projectId,
    assignedTo,
    limit = 10,
    offset = 0,
  }: {
    status?: boolean;
    projectId?: number;
    assignedTo?: number;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {
      isArchived: false,
    };

    if (status !== undefined) {
      where.status = status;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (assignedTo) {
      where.assignedTo = {
        some: { userId: assignedTo },
      };
    }

    return this.prisma.task.findMany({
      where,
      include: { assignedTo: true, project: true },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    return this.checkTaskExists(id);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    await this.checkTaskAndResponsibility(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.checkTaskAndResponsibility(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async toggleStatus(id: number, userId: number) {
    const task = await this.checkTaskAndResponsibility(id, userId);

    const newStatus = !task.status;

    return this.prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async updateDeadline(id: number, deadline: Date, userId: number) {
    await this.checkTaskAndResponsibility(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: { deadline },
    });
  }

  async moveToProject(taskId: number, projectId: number, userId: number) {
    await this.checkTaskAndResponsibility(taskId, userId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: { projectId },
    });
  }

  async assignUsers(taskId: number, userIds: number[]) {
    await this.checkTaskExists(taskId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        assignedTo: {
          create: userIds.map((userId) => ({ userId })),
        },
      },
    });
  }
}

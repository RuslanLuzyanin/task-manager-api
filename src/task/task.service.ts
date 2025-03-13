import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        deadline: createTaskDto.deadline,
        status: createTaskDto.status ?? false,
        project: { connect: { id: createTaskDto.projectId } },
        user: { connect: { id: createTaskDto.userId } },
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        deadline: updateTaskDto.deadline,
        project: updateTaskDto.projectId ? { connect: { id: updateTaskDto.projectId } } : undefined,
        user: updateTaskDto.userId ? { connect: { id: updateTaskDto.userId } } : undefined,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}

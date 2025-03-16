import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return this.prisma.user.findMany({
      where: {
        isArchived: false,
      },
    });
  }

  async findArchived() {
    return this.prisma.user.findMany({
      where: {
        isArchived: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с ${id} не найден`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const dataToUpdate: Record<string, any> = { ...updateUserDto };

    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async setDeleteTimer(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ${id} не найден`);
    }

    const deleteAt = new Date();
    deleteAt.setDate(deleteAt.getDate() + 30);

    return this.prisma.user.update({
      where: { id },
      data: { deleteAt, isArchived: true },
    });
  }

  async restoreFromArchive(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        deleteAt: null,
        isArchived: false,
      },
    });
  }
}

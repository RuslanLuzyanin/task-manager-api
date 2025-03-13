import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        role: createUserDto.role as Role,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const dataToUpdate: Record<string, any> = {};

    if (updateUserDto.name) {
      dataToUpdate['name'] = updateUserDto.name;
    }
    if (updateUserDto.email) {
      dataToUpdate['email'] = updateUserDto.email;
    }
    if (updateUserDto.password) {
      dataToUpdate['password'] = updateUserDto.password;
    }
    if (updateUserDto.role) {
      dataToUpdate['role'] = updateUserDto.role;
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }


  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
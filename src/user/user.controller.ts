import { Controller, Get, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получить всех активных пользователей' })
  @ApiResponse({ status: 200, description: 'Список всех пользователей' })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Get('archived')
  @ApiOperation({ summary: 'Получить архивированных пользователей, только для Администрации' })
  @ApiResponse({ status: 200, description: 'Список архивированных пользователей' })
  findArchived() {
    return this.userService.findArchived();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Найти пользователя по id' })
  @ApiParam({ name: 'id', example: 1, description: 'id пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  @ApiResponse({ status: 400, description: 'Пользователь не найден' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен' })
  @ApiResponse({ status: 400, description: 'Пользователь не найден' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/delete-timer')
  @ApiOperation({ summary: 'Архивировать пользователя с таймером удаления, только для Администрации' })
  @ApiParam({ name: 'id', example: 1, description: 'id пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь помечен как архивный' })
  @ApiResponse({ status: 400, description: 'Пользователь не найден' })
  setDeleteTimer(@Param('id') id: string) {
    return this.userService.setDeleteTimer(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Восстановить пользователя из архива, только для Администрации' })
  @ApiParam({ name: 'id', example: 1, description: 'id пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь восстановлен' })
  @ApiResponse({ status: 400, description: 'Пользователь не найден' })
  restoreFromArchive(@Param('id') id: string) {
    return this.userService.restoreFromArchive(Number(id));
  }
}
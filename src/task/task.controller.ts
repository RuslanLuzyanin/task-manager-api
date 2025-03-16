import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateDeadlineDto } from './dto/update-deadline.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../auth/user.decorator';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Задача успешно создана' })
  create(@Body() createTaskDto: CreateTaskDto, @User() user: any) {
    return this.taskService.create(createTaskDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получить список задач с фильтрацией' })
  @ApiQuery({
    name: 'status',
    example: true,
    required: false,
    description: 'Фильтр по статусу задачи',
  })
  @ApiQuery({
    name: 'projectId',
    example: 1,
    required: false,
    description: 'Фильтр по проекту',
  })
  @ApiQuery({
    name: 'assignedTo',
    example: 2,
    required: false,
    description: 'Фильтр по исполнителю',
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: false,
    description: 'Количество задач на странице',
  })
  @ApiQuery({
    name: 'offset',
    example: 0,
    required: false,
    description: 'Смещение списка',
  })
  @ApiResponse({ status: 200, description: 'Список задач' })
  findAll(
    @Query('status') status?: boolean,
    @Query('projectId') projectId?: string,
    @Query('assignedTo') assignedTo?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.taskService.findAll({
      status,
      projectId: Number(projectId),
      assignedTo,
      limit,
      offset,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по id' })
  @ApiParam({ name: 'id', example: 1, description: 'id задачи' })
  @ApiResponse({ status: 200, description: 'Данные задачи' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить задачу' })
  @ApiParam({ name: 'id', example: 1, description: 'id задачи' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Задача обновлена' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() user: any,
  ) {
    return this.taskService.update(Number(id), updateTaskDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить задачу (архивирование)' })
  @ApiParam({ name: 'id', example: 1, description: 'id задачи' })
  @ApiResponse({ status: 200, description: 'Задача архивирована' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  remove(@Param('id') id: string, @User() user: any) {
    return this.taskService.remove(Number(id), user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/status')
  @ApiOperation({ summary: 'Переключить статус задачи' })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'id задачи',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Статус задачи обновлен' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  toggleStatus(@Param('taskId') taskId: string, @User() user: any) {
    return this.taskService.toggleStatus(Number(taskId), user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/update-deadline')
  @ApiOperation({ summary: 'Обновить дедлайн задачи' })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'id задачи',
    example: 1,
  })
  @ApiBody({ type: UpdateDeadlineDto })
  @ApiResponse({ status: 200, description: 'Дедлайн задачи обновлен' })
  @ApiResponse({ status: 400, description: 'Некорректная дата' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  updateDeadline(
    @Param('taskId') taskId: string,
    @Body() updateDeadlineDto: UpdateDeadlineDto,
    @User() user: any,
  ) {
    return this.taskService.updateDeadline(
      Number(taskId),
      new Date(updateDeadlineDto.deadline),
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/move-to-project/:projectId')
  @ApiOperation({ summary: 'Переместить задачу в другой проект' })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'id задачи',
    example: 1,
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'id проекта для перемещения задачи',
    example: 2,
  })
  @ApiResponse({ status: 200, description: 'Задача перемещена в новый проект' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  moveToProject(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: number,
    @User() user: any,
  ) {
    return this.taskService.moveToProject(Number(taskId), projectId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':taskId/assign-users')
  @ApiOperation({
    summary: 'Назначить пользователей на задачу, только для Администрации',
  })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'id задачи',
    example: 1,
  })
  @ApiQuery({
    name: 'userIds',
    type: [Number],
    description: 'Массив id пользователей для назначения на задачу',
    example: [2, 3],
  })
  @ApiResponse({ status: 200, description: 'Пользователи назначены на задачу' })
  assignUsers(
    @Param('taskId') taskId: string,
    @Query('userIds') userIds: number[],
  ) {
    return this.taskService.assignUsers(Number(taskId), userIds);
  }
}

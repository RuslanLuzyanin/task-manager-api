import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Создать проект, только для Администрации' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Проект успешно создан' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получить все активные проекты' })
  @ApiResponse({ status: 200, description: 'Список всех активных проектов' })
  findAll() {
    return this.projectService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Найти проект по id' })
  @ApiParam({ name: 'id', example: 1, description: 'id проекта' })
  @ApiResponse({ status: 200, description: 'Данные проекта' })
  @ApiResponse({ status: 400, description: 'Проект не найден' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить данные проекта, только для Администрации',
  })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Проект обновлен' })
  @ApiResponse({ status: 400, description: 'Проект не найден' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(Number(id), updateProjectDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Архивирование проекта, только для Администрации' })
  @ApiParam({ name: 'id', example: '1', description: 'id проекта' })
  @ApiResponse({ status: 200, description: 'Проект помечен как архивный' })
  @ApiResponse({ status: 400, description: 'Проект не найден' })
  remove(@Param('id') id: string) {
    return this.projectService.remove(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':projectId/add-user/:userId')
  @ApiOperation({
    summary: 'Добавить пользователя в проект, только для Администрации',
  })
  @ApiParam({ name: 'projectId', example: 1, description: 'ID проекта' })
  @ApiParam({ name: 'userId', example: 5, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь добавлен в проект' })
  @ApiResponse({
    status: 404,
    description: 'Проект или пользователь не найден',
  })
  addUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectService.updateUserToProject(
      Number(projectId),
      Number(userId),
      true,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':projectId/remove-user/:userId')
  @ApiOperation({
    summary: 'Удалить пользователя из проекта, только для Администрации',
  })
  @ApiParam({ name: 'projectId', example: 1, description: 'ID проекта' })
  @ApiParam({ name: 'userId', example: 5, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удален из проекта' })
  @ApiResponse({
    status: 404,
    description: 'Проект или пользователь не найден',
  })
  removeUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectService.updateUserToProject(
      Number(projectId),
      Number(userId),
      false,
    );
  }
}

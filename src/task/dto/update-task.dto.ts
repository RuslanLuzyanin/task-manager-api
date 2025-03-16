import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    example: 'Новый заголовок',
    description: 'Обновленный заголовок задачи',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 'Новое описание',
    description: 'Обновленное описание задачи',
  })
  description?: string;

  @ApiPropertyOptional({
    example: '2024-06-01T12:00:00.000Z',
    description: 'Обновленный дедлайн',
  })
  deadline?: string;

  @ApiPropertyOptional({ example: 2, description: 'Обновленный id проекта' })
  projectId?: number;

  @ApiPropertyOptional({
    example: [4, 5],
    description: 'Обновленный массив id пользователей',
  })
  userIds?: number[];
}

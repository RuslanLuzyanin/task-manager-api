import { IsString, IsOptional, IsDateString, IsInt, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Разработать API', description: 'Название задачи' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Создать API для проекта', description: 'Описание задачи', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-05-01T12:00:00.000Z', description: 'Дедлайн задачи', required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({example:1, description: 'id проекта, к которому относится задача'})
  @IsInt()
  projectId: number;

  @ApiProperty({ example: [2, 3], description: 'Массив id пользователей, которым назначена задача' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  userIds: number[];
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ example: 'Обновленное название проекта', required: false })
  name?: string;

  @ApiProperty({ example: 'Новое описание', required: false })
  description?: string;

  @ApiProperty({ example: 2, required: false })
  userId?: number;
}

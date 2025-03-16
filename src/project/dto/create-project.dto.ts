import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Проект №1', description: 'Название проекта' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Самый важный проект',
    description: 'Описание проекта',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '1', description: 'id участника проекта' })
  @IsInt()
  userId: number;
}

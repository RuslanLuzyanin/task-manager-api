import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class UpdateDeadlineDto {
  @ApiProperty({
    description: 'Новый дедлайн задачи',
    type: String,
    example: '2024-06-01T12:00:00.000Z',
  })
  @IsString()
  @IsDateString()
  deadline: string;
}

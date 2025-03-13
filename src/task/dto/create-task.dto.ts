import { IsString, IsBoolean, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  status: boolean;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsInt()
  projectId: number;

  @IsInt()
  userId: number;
}

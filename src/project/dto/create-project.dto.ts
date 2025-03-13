import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  userId: number;
}

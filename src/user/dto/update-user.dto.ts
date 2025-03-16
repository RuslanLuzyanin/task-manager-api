import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Иван Иванов',
    description: 'Имя пользователя',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'password',
    description: 'Пароль пользователя',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
    enum: Role,
    description: 'Роль пользователя (ADMIN / EMPLOYEE)',
  })
  @IsEnum(Role, { message: 'Role must be either ADMIN or EMPLOYEE' })
  @IsOptional()
  role?: Role;
}

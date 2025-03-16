import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 200, description: 'Пользователь зарегистрирован' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    schema: { example: { access_token: 'jwt_token' } },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

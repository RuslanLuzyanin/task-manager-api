import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let authController;
  let authService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(registerDto);

      const result = await authController.register(registerDto);
      expect(result).toEqual(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockRejectedValue(
        new ConflictException('Пользователь с таким email уже существует'),
      );

      try {
        await authController.register(registerDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('login', () => {
    it('should return a valid token if login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockToken = { access_token: 'jwt_token' };
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.login(loginDto);
      expect(result).toEqual(mockToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException if credentials are incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Неверные учетные данные'),
      );

      try {
        await authController.login(loginDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});

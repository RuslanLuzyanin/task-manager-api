import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ProjectModule,
    TaskModule,
    AuthModule],
  controllers: [],
  providers: [PrismaService, JwtStrategy, CronService],
})

export class AppModule implements OnModuleInit {
  constructor(private readonly cronService: CronService) {
  }

  onModuleInit() {
    this.cronService.startCronJob();
  }
}
import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly prisma: PrismaService) {}

  startCronJob() {
    cron.schedule('0 0 * * *', async () => {
      this.logger.log(
        'Запуск cron-задачи для удаления пользователей с истекшим сроком',
      );

      const usersToDelete = await this.prisma.user.findMany({
        where: {
          deleteAt: {
            lte: new Date(),
          },
        },
      });

      await Promise.all(
        usersToDelete.map(async (user) => {
          await this.prisma.user.delete({
            where: { id: user.id },
          });
          this.logger.log(`Пользователь с id ${user.id} был удалён`);
        }),
      );
    });
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AuthModule, JwtAuthGuard } from './auth';
import { CaslModule } from './casl';

@Module({
  imports: [
    // Загрузка переменных окружения из .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // CLS (Continuation Local Storage) для Multi-tenancy
    // Хранение tenant ID в контексте запроса
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),

    // Prisma ORM
    PrismaModule,

    // Authentication (JWT)
    AuthModule,

    // Authorization (CASL)
    CaslModule,

    // BullMQ - Очереди задач (Redis)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
    }),

    // Scheduler - Планировщик задач (cron jobs)
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Глобальный guard для JWT авторизации
    // Все роуты защищены по умолчанию, кроме помеченных @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

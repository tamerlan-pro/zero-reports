import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

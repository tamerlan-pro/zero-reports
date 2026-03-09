import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.report.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        slug: true,
        token: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByToken(token: string) {
    const report = await this.prisma.report.findUnique({
      where: { token, isPublished: true },
      select: {
        title: true,
        description: true,
        config: true,
        createdAt: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async create(dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        slug: dto.slug,
        title: dto.title as unknown as Prisma.InputJsonValue,
        description: dto.description as unknown as Prisma.InputJsonValue,
        config: dto.config as unknown as Prisma.InputJsonValue,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async update(slug: string, dto: UpdateReportDto) {
    const existing = await this.prisma.report.findUnique({ where: { slug } });
    if (!existing) {
      throw new NotFoundException(`Report with slug "${slug}" not found`);
    }

    const { config, title, description, ...rest } = dto;
    return this.prisma.report.update({
      where: { slug },
      data: {
        ...rest,
        ...(title !== undefined && {
          title: title as unknown as Prisma.InputJsonValue,
        }),
        ...(description !== undefined && {
          description: description as unknown as Prisma.InputJsonValue,
        }),
        ...(config !== undefined && {
          config: config as unknown as Prisma.InputJsonValue,
        }),
      },
    });
  }

  async remove(slug: string) {
    const existing = await this.prisma.report.findUnique({ where: { slug } });
    if (!existing) {
      throw new NotFoundException(`Report with slug "${slug}" not found`);
    }

    return this.prisma.report.delete({ where: { slug } });
  }
}

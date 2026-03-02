import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: 'q1-2026-revenue' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Выручка Q1 2026' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Квартальный отчет по выручке' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Report blocks configuration (JSON)' })
  @IsObject()
  config: Record<string, unknown>;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

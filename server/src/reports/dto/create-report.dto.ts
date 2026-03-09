import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: 'q1-2026-revenue' })
  @IsString()
  slug: string;

  @ApiProperty({
    example: { ru: 'Выручка Q1 2026', en: 'Revenue Q1 2026' },
    description: 'Report title — string or {locale: text} object',
  })
  @ValidateIf((o) => typeof o.title === 'string')
  @IsString()
  @ValidateIf((o) => typeof o.title !== 'string')
  @IsObject()
  title: string | Record<string, string>;

  @ApiPropertyOptional({
    example: {
      ru: 'Квартальный отчет по выручке',
      en: 'Quarterly revenue report',
    },
    description: 'Report description — string or {locale: text} object',
  })
  @IsOptional()
  @ValidateIf((o) => typeof o.description === 'string')
  @IsString()
  @ValidateIf((o) => o.description != null && typeof o.description !== 'string')
  @IsObject()
  description?: string | Record<string, string>;

  @ApiProperty({ description: 'Report blocks configuration (JSON)' })
  @IsObject()
  config: Record<string, unknown>;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

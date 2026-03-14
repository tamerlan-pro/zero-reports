import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  Matches,
  MaxLength,
  MinLength,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const MAX_CONFIG_BYTES = 1_000_000; // 1 MB

function IsLocalizedString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsLocalizedString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value === 'string') return true;
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).every((v) => typeof v === 'string');
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string or a record of locale -> string`;
        },
      },
    });
  };
}

function IsConfigSizeLimit(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsConfigSizeLimit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          try {
            const json = JSON.stringify(value);
            return json.length <= MAX_CONFIG_BYTES;
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return `config must not exceed ${MAX_CONFIG_BYTES / 1000}KB`;
        },
      },
    });
  };
}

export class CreateReportDto {
  @ApiProperty({ example: 'q1-2026-revenue', description: 'Unique slug (lowercase, digits, hyphens)' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^[a-z0-9-]+$/, { message: 'slug must contain only lowercase letters, digits and hyphens' })
  declare slug: string;

  @ApiProperty({
    example: { ru: 'Выручка Q1 2026', en: 'Revenue Q1 2026' },
    description: 'Report title — string or {locale: text} object',
  })
  @IsLocalizedString()
  declare title: string | Record<string, string>;

  @ApiPropertyOptional({
    example: { ru: 'Квартальный отчет по выручке', en: 'Quarterly revenue report' },
    description: 'Report description — string or {locale: text} object',
  })
  @IsOptional()
  @IsLocalizedString()
  description?: string | Record<string, string>;

  @ApiProperty({ description: 'Report blocks configuration (JSON, max 1MB)' })
  @IsObject()
  @IsConfigSizeLimit()
  declare config: Record<string, unknown>;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

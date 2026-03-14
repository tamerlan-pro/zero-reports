import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  ValidateNested,
  IsObject,
  IsUrl,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

class CloneReportDto {
  @ApiProperty({ example: 'q1-2026-revenue-copy' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^[a-z0-9-]+$/, { message: 'newSlug must contain only lowercase letters, digits and hyphens' })
  declare newSlug: string;
}

class ValidateConfigDto {
  @ApiProperty({ description: 'Report blocks configuration to validate' })
  @IsObject()
  declare config: Record<string, unknown>;
}

class LintConfigDto {
  @ApiProperty({ description: 'Report config to check for design quality issues' })
  @IsObject()
  declare config: Record<string, unknown>;
}

class BatchCreateDto {
  @ApiProperty({ type: [CreateReportDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportDto)
  declare reports: CreateReportDto[];
}

class RegisterWebhookDto {
  @ApiProperty({ example: 'https://your-service.example.com/callbacks/report' })
  @IsUrl({}, { message: 'callbackUrl must be a valid URL' })
  declare callbackUrl: string;

  @ApiProperty({ example: ['created', 'updated'], description: 'Events to subscribe to: created | updated | deleted' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  declare events: string[];
}

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('contract-schema')
  @ApiOperation({
    summary: 'Get contract schema',
    description: 'Returns the full block type reference and examples for external services to build valid report contracts. See also GET /reports/design-guidelines for layout rules and composition patterns.',
  })
  @ApiResponse({ status: 200, description: 'Contract schema returned successfully' })
  getContractSchema() {
    return this.reportsService.getContractSchema();
  }

  @Get('design-guidelines')
  @ApiOperation({
    summary: 'Get design guidelines',
    description: 'Returns layout rules, composition patterns, and an LLM-ready prompt for building well-designed reports. Complementary to GET /reports/contract-schema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Design guidelines returned successfully',
    schema: {
      properties: {
        guidelinesVersion: { type: 'number' },
        description: { type: 'string' },
        relatedEndpoints: { type: 'object' },
        llmPrompt: { type: 'string', description: 'Ready-to-use LLM system prompt containing all layout rules' },
        layoutGuidelines: { type: 'array', description: '12 layout rules with antiPattern / correctPattern examples' },
        compositionPatterns: { type: 'array', description: '4 ready-to-use JSON skeleton patterns' },
      },
    },
  })
  getDesignGuidelines() {
    return this.reportsService.getDesignGuidelines();
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate report config without saving (dry-run)',
    description: 'Checks structural validity of block types. Add ?lint=true to also run design quality checks against layout guidelines.',
  })
  @ApiQuery({ name: 'lint', required: false, type: Boolean, description: 'Also run design quality lint checks' })
  @ApiBody({ type: ValidateConfigDto })
  @ApiResponse({
    status: 200,
    description: 'Validation result',
    schema: {
      properties: {
        valid: { type: 'boolean' },
        errors: { type: 'array', items: { type: 'string' } },
        lint: {
          type: 'object',
          description: 'Present only when ?lint=true. Contains design quality issues.',
          properties: {
            issues: { type: 'array' },
            _links: { type: 'object' },
          },
        },
      },
    },
  })
  validateConfig(
    @Body() dto: ValidateConfigDto,
    @Query('lint') lint?: string,
  ) {
    return this.reportsService.validate(dto.config, lint === 'true');
  }

  @Post('lint')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lint report config for design quality issues',
    description: 'Checks a report config against 12 visual design rules (filters in grid, small charts grouped, tables full-width, etc.). Returns issues with severity and actionable suggestions. See GET /reports/design-guidelines for the full rule reference.',
  })
  @ApiBody({ type: LintConfigDto })
  @ApiResponse({
    status: 200,
    description: 'Lint result with design quality issues',
    schema: {
      properties: {
        issues: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ruleId: { type: 'string', example: 'FILTERS_NOT_IN_GRID' },
              severity: { type: 'string', enum: ['warning', 'suggestion'] },
              message: { type: 'string' },
              path: { type: 'string', example: 'blocks[3]' },
              suggestion: { type: 'string' },
            },
          },
        },
        _links: {
          type: 'object',
          properties: {
            guidelines: { type: 'string', example: 'GET /reports/design-guidelines' },
            schema: { type: 'string', example: 'GET /reports/contract-schema' },
          },
        },
      },
    },
  })
  lintConfig(@Body() dto: LintConfigDto) {
    return this.reportsService.lintConfig(dto.config);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Create multiple reports at once' })
  @ApiBody({ type: BatchCreateDto })
  @ApiResponse({ status: 201, description: 'Batch creation results with per-report success/failure' })
  createBatch(@Body() dto: BatchCreateDto) {
    return this.reportsService.createBatch(dto.reports);
  }

  @Get()
  @ApiOperation({ summary: 'List all published reports' })
  @ApiResponse({ status: 200, description: 'List of published reports' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':token')
  @ApiOperation({ summary: 'Get report by access token' })
  @ApiParam({ name: 'token', description: 'Unique report access token (UUID)' })
  @ApiResponse({ status: 200, description: 'Report found and returned' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  findByToken(@Param('token') token: string) {
    return this.reportsService.findByToken(token);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Report with this slug already exists' })
  create(@Body() dto: CreateReportDto) {
    return this.reportsService.create(dto);
  }

  @Post(':slug/clone')
  @ApiOperation({ summary: 'Clone an existing report with a new slug (creates as unpublished)' })
  @ApiParam({ name: 'slug', description: 'Source report slug' })
  @ApiBody({ type: CloneReportDto })
  @ApiResponse({ status: 201, description: 'Report cloned successfully' })
  @ApiResponse({ status: 404, description: 'Source report not found' })
  @ApiResponse({ status: 409, description: 'Report with new slug already exists' })
  clone(@Param('slug') slug: string, @Body() dto: CloneReportDto) {
    return this.reportsService.clone(slug, dto.newSlug);
  }

  @Post(':slug/share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get the shareable link for a report' })
  @ApiParam({ name: 'slug', description: 'Report slug' })
  @ApiResponse({ status: 200, description: 'Share link returned', schema: { properties: { url: { type: 'string' }, token: { type: 'string' } } } })
  @ApiResponse({ status: 404, description: 'Report not found' })
  getShareLink(@Param('slug') slug: string) {
    return this.reportsService.getShareLink(slug);
  }

  @Post(':slug/webhook')
  @ApiOperation({ summary: 'Register a webhook callback for report events' })
  @ApiParam({ name: 'slug', description: 'Report slug' })
  @ApiBody({ type: RegisterWebhookDto })
  @ApiResponse({ status: 201, description: 'Webhook registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid event types or URL' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  registerWebhook(@Param('slug') slug: string, @Body() dto: RegisterWebhookDto) {
    return this.reportsService.registerWebhook(slug, dto.callbackUrl, dto.events);
  }

  @Get(':slug/webhook')
  @ApiOperation({ summary: 'List registered webhooks for a report' })
  @ApiParam({ name: 'slug', description: 'Report slug' })
  @ApiResponse({ status: 200, description: 'List of webhooks' })
  getWebhooks(@Param('slug') slug: string) {
    return this.reportsService.getWebhooks(slug);
  }

  @Delete('webhook/:webhookId')
  @ApiOperation({ summary: 'Remove a registered webhook' })
  @ApiParam({ name: 'webhookId', description: 'Webhook ID' })
  @ApiResponse({ status: 200, description: 'Webhook removed' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  deleteWebhook(@Param('webhookId') webhookId: string) {
    return this.reportsService.deleteWebhook(webhookId);
  }

  @Put(':slug')
  @ApiOperation({ summary: 'Update report by slug' })
  @ApiParam({ name: 'slug', description: 'Report slug' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  update(@Param('slug') slug: string, @Body() dto: UpdateReportDto) {
    return this.reportsService.update(slug, dto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete report by slug' })
  @ApiParam({ name: 'slug', description: 'Report slug' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  remove(@Param('slug') slug: string) {
    return this.reportsService.remove(slug);
  }
}

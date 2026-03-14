import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

// ---------------------------------------------------------------------------
// Block tree traversal utilities
// ---------------------------------------------------------------------------

export type BlockVisitor = (
  block: Record<string, unknown>,
  path: string,
  depth: number,
  parentType: string | null,
) => void;

/**
 * Single source of truth for extracting child block groups from any container block.
 * When adding a new container block type, update ONLY this function —
 * walkBlocks and walkLevels will automatically handle the new type.
 */
export function getChildBlockGroups(
  block: Record<string, unknown>,
  path: string,
): Array<{ blocks: unknown[]; path: string; parentType: string }> {
  const groups: Array<{ blocks: unknown[]; path: string; parentType: string }> = [];
  const type = block.type as string;

  if ((type === 'grid' || type === 'dynamicData' || type === 'filterBar') && Array.isArray(block.blocks)) {
    groups.push({ blocks: block.blocks as unknown[], path: `${path}.blocks`, parentType: type });
  }
  if (type === 'tabs' && Array.isArray(block.tabs)) {
    for (const tab of block.tabs as Array<{ id?: string; blocks?: unknown[] }>) {
      groups.push({
        blocks: tab.blocks ?? [],
        path: `${path}.tabs[${tab.id ?? '?'}].blocks`,
        parentType: 'tabs',
      });
    }
  }
  return groups;
}

/**
 * Recursively visits every block in the report block tree.
 * Uses getChildBlockGroups() — add new container types there, not here.
 */
export function walkBlocks(
  blocks: unknown[],
  visitor: BlockVisitor,
  basePath = 'blocks',
  depth = 0,
  parentType: string | null = null,
): void {
  if (!Array.isArray(blocks)) return;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as Record<string, unknown>;
    const path = `${basePath}[${i}]`;
    visitor(block, path, depth, parentType);
    for (const group of getChildBlockGroups(block, path)) {
      walkBlocks(group.blocks, visitor, group.path, depth + 1, group.parentType);
    }
  }
}

/**
 * Visits each sibling array (level) in the report tree — useful for rules
 * that check sequences of adjacent blocks (e.g. two filters in a row).
 * The processor receives parentType so rules can opt-out for certain containers.
 * Uses getChildBlockGroups() — add new container types there, not here.
 */
export function walkLevels(
  blocks: unknown[],
  processor: (siblings: Record<string, unknown>[], basePath: string, depth: number, parentType: string | null) => void,
  basePath = 'blocks',
  depth = 0,
  parentType: string | null = null,
): void {
  if (!Array.isArray(blocks)) return;
  processor(blocks as Record<string, unknown>[], basePath, depth, parentType);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as Record<string, unknown>;
    const path = `${basePath}[${i}]`;
    for (const group of getChildBlockGroups(block, path)) {
      walkLevels(group.blocks, processor, group.path, depth + 1, group.parentType);
    }
  }
}

// ---------------------------------------------------------------------------
// Lint types
// ---------------------------------------------------------------------------

export type LintSeverity = 'warning' | 'suggestion';

export interface LintIssue {
  ruleId: string;
  severity: LintSeverity;
  message: string;
  path: string;
  suggestion: string;
}

export interface LintResult {
  issues: LintIssue[];
  _links: { guidelines: string; schema: string };
}

// ---------------------------------------------------------------------------
// Internal constants
// ---------------------------------------------------------------------------

const LINT_LINKS = {
  guidelines: 'GET /reports/design-guidelines',
  schema: 'GET /reports/contract-schema',
};

const SMALL_CHART_TYPES = new Set(['pie', 'gauge', 'sparkline']);

const KNOWN_BLOCK_TYPES = new Set([
  'heading', 'markdown', 'metrics', 'chart', 'table',
  'divider', 'callout', 'grid', 'uiShowcase', 'tabs', 'filter', 'dynamicData', 'filterBar',
]);

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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

  async findBySlug(slug: string) {
    const report = await this.prisma.report.findUnique({ where: { slug } });
    if (!report) {
      throw new NotFoundException(`Report with slug "${slug}" not found`);
    }
    return report;
  }

  async create(dto: CreateReportDto) {
    try {
      const report = await this.prisma.report.create({
        data: {
          slug: dto.slug,
          title: dto.title as Parameters<typeof this.prisma.report.create>[0]['data']['title'],
          description: dto.description as Parameters<typeof this.prisma.report.create>[0]['data']['description'],
          config: dto.config as Parameters<typeof this.prisma.report.create>[0]['data']['config'],
          isPublished: dto.isPublished ?? true,
        },
      });
      void this.notifyWebhooks(dto.slug, 'created');
      return report;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`Report with slug "${dto.slug}" already exists`);
      }
      this.logger.error('Failed to create report', err);
      throw new InternalServerErrorException('Failed to create report');
    }
  }

  async update(slug: string, dto: UpdateReportDto) {
    await this.findBySlug(slug);

    const { config, title, description, ...rest } = dto;
    try {
      const updated = await this.prisma.report.update({
        where: { slug },
        data: {
          ...rest,
          ...(title !== undefined && {
            title: title as Parameters<typeof this.prisma.report.update>[0]['data']['title'],
          }),
          ...(description !== undefined && {
            description: description as Parameters<typeof this.prisma.report.update>[0]['data']['description'],
          }),
          ...(config !== undefined && {
            config: config as Parameters<typeof this.prisma.report.update>[0]['data']['config'],
          }),
        },
      });
      void this.notifyWebhooks(slug, 'updated');
      return updated;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Report with slug "${slug}" not found`);
      }
      this.logger.error('Failed to update report', err);
      throw new InternalServerErrorException('Failed to update report');
    }
  }

  async remove(slug: string) {
    await this.findBySlug(slug);

    try {
      void this.notifyWebhooks(slug, 'deleted');
      return await this.prisma.report.delete({ where: { slug } });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Report with slug "${slug}" not found`);
      }
      this.logger.error('Failed to delete report', err);
      throw new InternalServerErrorException('Failed to delete report');
    }
  }

  async clone(slug: string, newSlug: string) {
    const existing = await this.findBySlug(slug);

    try {
      return await this.prisma.report.create({
        data: {
          slug: newSlug,
          title: existing.title as Parameters<typeof this.prisma.report.create>[0]['data']['title'],
          description: existing.description as Parameters<typeof this.prisma.report.create>[0]['data']['description'],
          config: existing.config as Parameters<typeof this.prisma.report.create>[0]['data']['config'],
          isPublished: false,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`Report with slug "${newSlug}" already exists`);
      }
      this.logger.error('Failed to clone report', err);
      throw new InternalServerErrorException('Failed to clone report');
    }
  }

  async createBatch(dtos: CreateReportDto[]) {
    const results = await Promise.allSettled(dtos.map((dto) => this.create(dto)));
    return results.map((r, i) => ({
      slug: dtos[i].slug,
      success: r.status === 'fulfilled',
      data: r.status === 'fulfilled' ? r.value : undefined,
      error: r.status === 'rejected' ? (r.reason as Error).message : undefined,
    }));
  }

  /**
   * Validates report config structure (block types recursively).
   * Pass lintEnabled=true to also run design-quality checks.
   */
  async validate(
    config: Record<string, unknown>,
    lintEnabled = false,
  ): Promise<{ valid: boolean; errors: string[]; lint?: LintResult }> {
    const errors: string[] = [];

    if (!config.blocks || !Array.isArray(config.blocks)) {
      errors.push('config.blocks must be an array');
      return { valid: false, errors };
    }

    walkBlocks(config.blocks, (block, path) => {
      if (!block || typeof block !== 'object') {
        errors.push(`${path}: must be an object`);
        return;
      }
      if (!block.type || !KNOWN_BLOCK_TYPES.has(block.type as string)) {
        errors.push(`${path}: unknown or missing type "${String(block.type)}"`);
      }
    });

    const result: { valid: boolean; errors: string[]; lint?: LintResult } = {
      valid: errors.length === 0,
      errors,
    };

    if (lintEnabled) {
      result.lint = this.lintConfig(config);
    }

    return result;
  }

  /**
   * Runs 12 design-quality rules against a report config and returns
   * a list of issues with severity and actionable suggestions.
   */
  lintConfig(config: Record<string, unknown>): LintResult {
    const issues: LintIssue[] = [];
    const blocks = Array.isArray(config.blocks) ? (config.blocks as unknown[]) : [];

    // --- Pass 1: collect all block IDs (global) ---
    const allIds: string[] = [];
    walkBlocks(blocks, (block) => {
      if (typeof block.id === 'string' && block.id) {
        allIds.push(block.id);
      }
    });
    const seenIds = new Set<string>();
    const duplicateIds = new Set<string>();
    for (const id of allIds) {
      if (seenIds.has(id)) duplicateIds.add(id);
      seenIds.add(id);
    }

    // DUPLICATE_BLOCK_ID
    if (duplicateIds.size > 0) {
      issues.push({
        ruleId: 'DUPLICATE_BLOCK_ID',
        severity: 'warning',
        message: `Duplicate block ids found: ${[...duplicateIds].map((id) => `"${id}"`).join(', ')}. Block ids must be unique across the entire report.`,
        path: 'blocks',
        suggestion: 'Ensure every block id is unique, including inside nested grid/tabs/dynamicData.',
      });
    }

    // --- Pass 2: per-block rules ---
    let lastHeadingLevel: number | null = null;

    // NO_HEADING — first top-level block should be h1
    if (blocks.length > 0) {
      const first = blocks[0] as Record<string, unknown>;
      if (first.type !== 'heading') {
        issues.push({
          ruleId: 'NO_HEADING',
          severity: 'suggestion',
          message: `Report does not start with a heading block (first block type is "${String(first.type)}").`,
          path: 'blocks[0]',
          suggestion: 'Add { "type": "heading", "level": 1, "content": "Report Title" } as the very first block.',
        });
      }
    }

    walkBlocks(blocks, (block, path, depth, parentType) => {
      // FILTER_TARGET_MISSING
      if (block.type === 'filter' && Array.isArray(block.targetBlockIds)) {
        for (const targetId of block.targetBlockIds as string[]) {
          if (!seenIds.has(targetId)) {
            issues.push({
              ruleId: 'FILTER_TARGET_MISSING',
              severity: 'warning',
              message: `Filter at ${path} references targetBlockId "${targetId}" but no block with that id exists.`,
              path,
              suggestion: `Add id: "${targetId}" to the target block, or fix targetBlockIds to reference existing block ids.`,
            });
          }
        }
      }

      // METRICS_COLUMNS_MISMATCH
      if (block.type === 'metrics') {
        const items = Array.isArray(block.items) ? block.items : [];
        const columns = typeof block.columns === 'number' ? block.columns : null;
        if (columns !== null && items.length > 0 && columns !== items.length && items.length <= 6) {
          issues.push({
            ruleId: 'METRICS_COLUMNS_MISMATCH',
            severity: 'suggestion',
            message: `Metrics block at ${path} has columns=${columns} but ${items.length} items. Mismatched columns cause uneven card widths.`,
            path,
            suggestion: `Set "columns": ${items.length} to match the number of metric items (max 6).`,
          });
        }
      }

      // SMALL_CHART_FULL_WIDTH
      if (block.type === 'chart' && SMALL_CHART_TYPES.has(block.chartType as string) && parentType !== 'grid') {
        issues.push({
          ruleId: 'SMALL_CHART_FULL_WIDTH',
          severity: 'suggestion',
          message: `"${String(block.chartType)}" chart at ${path} is full-width. Small charts (pie, gauge, sparkline) are too sparse at full width.`,
          path,
          suggestion: 'Group 2–3 small charts inside { "type": "grid", "columns": 2 } or { "columns": 3 } for a compact side-by-side layout.',
        });
      }

      // TABLE_IN_GRID
      if (block.type === 'table' && parentType === 'grid') {
        issues.push({
          ruleId: 'TABLE_IN_GRID',
          severity: 'warning',
          message: `Table at ${path} is inside a grid block. Tables require full width to display all columns properly.`,
          path,
          suggestion: 'Move the table outside the grid so it renders at full width.',
        });
      }

      // SINGLE_ITEM_GRID
      if (block.type === 'grid' && Array.isArray(block.blocks) && (block.blocks as unknown[]).length === 1) {
        issues.push({
          ruleId: 'SINGLE_ITEM_GRID',
          severity: 'warning',
          message: `Grid at ${path} contains only 1 child block. A single-item grid adds unnecessary nesting.`,
          path,
          suggestion: 'Remove the grid wrapper and place the child block directly in the parent.',
        });
      }

      // GRID_TOO_MANY_COLS
      if (block.type === 'grid' && typeof block.columns === 'number' && block.columns > 3) {
        const children = Array.isArray(block.blocks) ? (block.blocks as Record<string, unknown>[]) : [];
        const hasCharts = children.some((c) => c.type === 'chart');
        if (hasCharts) {
          issues.push({
            ruleId: 'GRID_TOO_MANY_COLS',
            severity: 'suggestion',
            message: `Grid at ${path} has ${block.columns} columns with chart children. More than 3 columns makes charts too narrow to read.`,
            path,
            suggestion: 'Use columns: 2 or columns: 3 for grids containing charts.',
          });
        }
      }

      // DEEP_NESTING
      if (depth > 3) {
        issues.push({
          ruleId: 'DEEP_NESTING',
          severity: 'suggestion',
          message: `Block at ${path} is nested at depth ${depth} (max recommended: 3).`,
          path,
          suggestion: 'Simplify the report structure. Consider using tabs to group content instead of deeply nested grids.',
        });
      }

      // HEADING_LEVEL_SKIP
      if (block.type === 'heading' && typeof block.level === 'number') {
        if (lastHeadingLevel !== null && block.level > lastHeadingLevel + 1) {
          issues.push({
            ruleId: 'HEADING_LEVEL_SKIP',
            severity: 'suggestion',
            message: `Heading at ${path} jumps from h${lastHeadingLevel} to h${block.level}, skipping level h${lastHeadingLevel + 1}.`,
            path,
            suggestion: `Use "level": ${lastHeadingLevel + 1} instead of "level": ${block.level} to maintain proper heading hierarchy.`,
          });
        }
        lastHeadingLevel = block.level;
      }
    });

    // --- Pass 3: sibling-sequence rules (level-by-level) ---
    walkLevels(blocks, (siblings, basePath, _depth, levelParentType) => {
      // FILTERS_NOT_IN_GRID — 2+ consecutive filter blocks NOT already inside a grid
      // Skip if this level is already a direct child of a grid (that's the correct pattern)
      let filterRunStart = -1;
      let filterRunCount = 0;
      for (let i = 0; i <= siblings.length; i++) {
        const block = siblings[i];
        if (block?.type === 'filter') {
          if (filterRunStart === -1) filterRunStart = i;
          filterRunCount++;
        } else {
          if (filterRunCount >= 2 && levelParentType !== 'grid' && levelParentType !== 'filterBar') {
            issues.push({
              ruleId: 'FILTERS_NOT_IN_GRID',
              severity: 'warning',
              message: `${filterRunCount} filter blocks at ${basePath}[${filterRunStart}]–[${filterRunStart + filterRunCount - 1}] are stacked vertically. Filters should sit side-by-side.`,
              path: `${basePath}[${filterRunStart}]`,
              suggestion: `Wrap these ${filterRunCount} filters in { "type": "filterBar", "blocks": [...filters] } for a compact horizontal layout.`,
            });
          }
          filterRunStart = -1;
          filterRunCount = 0;
        }
      }

      // CONSECUTIVE_CALLOUTS — 2+ callouts in a row
      let calloutRunStart = -1;
      let calloutRunCount = 0;
      for (let i = 0; i <= siblings.length; i++) {
        const block = siblings[i];
        if (block?.type === 'callout') {
          if (calloutRunStart === -1) calloutRunStart = i;
          calloutRunCount++;
        } else {
          if (calloutRunCount >= 2) {
            issues.push({
              ruleId: 'CONSECUTIVE_CALLOUTS',
              severity: 'warning',
              message: `${calloutRunCount} callout blocks at ${basePath}[${calloutRunStart}]–[${calloutRunStart + calloutRunCount - 1}] appear consecutively. Max 1–2 callouts per section.`,
              path: `${basePath}[${calloutRunStart}]`,
              suggestion: 'Merge callout content or replace additional callouts with a markdown block.',
            });
          }
          calloutRunStart = -1;
          calloutRunCount = 0;
        }
      }
    });

    return { issues, _links: LINT_LINKS };
  }

  async getShareLink(slug: string): Promise<{ url: string; token: string }> {
    const report = await this.findBySlug(slug);
    const baseUrl = this.configService.get<string>('APP_BASE_URL', 'http://localhost');
    return {
      token: report.token,
      url: `${baseUrl}/r/${report.token}`,
    };
  }

  async registerWebhook(slug: string, callbackUrl: string, events: string[]) {
    await this.findBySlug(slug);

    const validEvents = ['created', 'updated', 'deleted'];
    const invalidEvents = events.filter((e) => !validEvents.includes(e));
    if (invalidEvents.length > 0) {
      throw new BadRequestException(`Invalid events: ${invalidEvents.join(', ')}. Valid: ${validEvents.join(', ')}`);
    }

    return this.prisma.webhook.create({
      data: { reportSlug: slug, callbackUrl, events },
    });
  }

  async getWebhooks(slug: string) {
    await this.findBySlug(slug);
    return this.prisma.webhook.findMany({ where: { reportSlug: slug } });
  }

  async deleteWebhook(webhookId: string) {
    const webhook = await this.prisma.webhook.findUnique({ where: { id: webhookId } });
    if (!webhook) {
      throw new NotFoundException(`Webhook "${webhookId}" not found`);
    }
    return this.prisma.webhook.delete({ where: { id: webhookId } });
  }

  async notifyWebhooks(slug: string, event: 'created' | 'updated' | 'deleted') {
    const webhooks = await this.prisma.webhook.findMany({
      where: { reportSlug: slug, isActive: true, events: { has: event } },
    });

    await Promise.allSettled(
      webhooks.map(async (wh: { id: string; callbackUrl: string }) => {
        try {
          await fetch(wh.callbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, slug, timestamp: new Date().toISOString() }),
            signal: AbortSignal.timeout(10_000),
          });
        } catch (err) {
          this.logger.warn(`Webhook ${wh.id} failed: ${(err as Error).message}`);
        }
      }),
    );
  }

  getContractSchema() {
    return {
      schemaVersion: 1,
      description: 'ZeroReports contract schema. POST /reports with a body matching this schema to create a report. GET /reports/:token to view.',
      relatedEndpoints: {
        designGuidelines: 'GET /reports/design-guidelines — layout rules, composition patterns, LLM prompt for building well-designed reports',
        lint: 'POST /reports/lint — automated design quality check against layout guidelines',
        validate: 'POST /reports/validate?lint=true — structural validation + optional design lint in one call',
      },
      endpoints: {
        create: 'POST /reports',
        validate: 'POST /reports/validate',
        get: 'GET /reports/:token',
        list: 'GET /reports',
        update: 'PUT /reports/:slug',
        delete: 'DELETE /reports/:slug',
        clone: 'POST /reports/:slug/clone',
        batch: 'POST /reports/batch',
        schema: 'GET /reports/contract-schema',
        designGuidelines: 'GET /reports/design-guidelines',
        lint: 'POST /reports/lint',
      },
      reportShape: {
        slug: 'string — unique identifier (lowercase letters, digits, hyphens), e.g. "q1-2026-revenue"',
        title: 'string | { ru: string; en: string } — report title',
        description: '(optional) string | { ru: string; en: string }',
        config: 'ReportConfig — see below',
        isPublished: '(optional) boolean — default true',
      },
      reportConfig: {
        schemaVersion: '(optional) number — defaults to 1',
        blocks: 'ReportBlock[] — ordered array of blocks to render',
        dataBindings: '(optional) — cross-block interaction rules',
      },
      blockTypes: [
        {
          type: 'heading',
          description: 'Section heading',
          requiredFields: ['type', 'level', 'content'],
          fields: {
            level: '1 | 2 | 3 | 4 | 5 | 6',
            content: 'LocalizedString',
            subtitle: '(optional) LocalizedString',
          },
          example: { type: 'heading', level: 1, content: { ru: 'Заголовок', en: 'Heading' } },
        },
        {
          type: 'markdown',
          description: 'Markdown text content',
          requiredFields: ['type', 'content'],
          fields: { content: 'LocalizedString' },
          example: { type: 'markdown', content: { ru: '**Жирный** текст', en: '**Bold** text' } },
        },
        {
          type: 'metrics',
          description: 'KPI metric cards row',
          requiredFields: ['type', 'items'],
          fields: {
            columns: '(optional) number — cards per row, should match items.length (max 6)',
            items: 'MetricItem[]',
          },
          metricItem: {
            label: 'LocalizedString',
            value: 'string | number',
            delta: '(optional) LocalizedString — e.g. "+15%"',
            deltaType: '(optional) "positive" | "negative" | "neutral"',
            icon: '(optional) Iconify icon name (e.g. "solar:chart-2-bold-duotone")',
            color: '(optional) semantic token: "primary" | "success" | "danger" | "warning" | "info"',
          },
          example: {
            type: 'metrics',
            columns: 3,
            items: [{ label: { ru: 'Выручка', en: 'Revenue' }, value: '12.4M ₽', delta: '+15%', deltaType: 'positive', color: 'primary' }],
          },
        },
        {
          type: 'chart',
          description: 'Chart visualization. Small charts (pie, gauge, sparkline) should be grouped in a grid block.',
          requiredFields: ['type', 'chartType', 'series', 'data'],
          fields: {
            chartType: '"line" | "bar" | "pie" | "scatter" | "gauge" | "sparkline" | "radar" | "funnel" | "heatmap"',
            title: '(optional) LocalizedString',
            height: '(optional) number — px, default 300',
            xAxis: '(optional) { dataKey: string; label?: LocalizedString; scaleType?: "band" | "linear" | ... }',
            yAxis: '(optional) { dataKey: string; label?: LocalizedString }',
            series: 'ChartSeries[] — { dataKey: string; label?: LocalizedString; color?: string; area?: boolean }',
            data: 'Record<string, unknown>[]',
          },
          layoutNote: 'line/bar/scatter/heatmap → full width. pie/gauge/sparkline → wrap 2–3 in a grid block.',
          example: {
            type: 'chart',
            chartType: 'line',
            title: { ru: 'Выручка', en: 'Revenue' },
            xAxis: { dataKey: 'month', scaleType: 'band' },
            series: [{ dataKey: 'revenue', label: { ru: 'Выручка', en: 'Revenue' }, color: 'primary' }],
            data: [{ month: { ru: 'Январь', en: 'January' }, revenue: 4200000 }],
          },
        },
        {
          type: 'table',
          description: 'Interactive data table (DataGrid). Always render at full width — never place inside a grid.',
          requiredFields: ['type', 'columns', 'rows'],
          fields: {
            title: '(optional) LocalizedString',
            columns: 'TableColumn[]',
            rows: 'Record<string, unknown>[] — must have id field',
            pageSize: '(optional) number — default 10',
            density: '(optional) "compact" | "standard" | "comfortable"',
            headerFilters: '(optional) boolean',
            columnPinning: '(optional) { left?: string[]; right?: string[] }',
          },
          tableColumn: {
            field: 'string',
            headerName: 'LocalizedString',
            width: '(optional) number',
            flex: '(optional) number',
            type: '(optional) "string" | "number" | "date" | "boolean"',
            renderAs: '(optional) "chip" | "progress" | "link" | "badge"',
          },
          example: {
            type: 'table',
            columns: [{ field: 'name', headerName: { ru: 'Имя', en: 'Name' }, flex: 1 }, { field: 'value', headerName: { ru: 'Сумма', en: 'Amount' }, type: 'number' }],
            rows: [{ id: 1, name: 'Example', value: 1000 }],
          },
        },
        {
          type: 'tabs',
          description: 'Tabbed layout — each tab contains its own set of blocks. Use when report has more than 5 content blocks.',
          requiredFields: ['type', 'tabs'],
          fields: {
            tabs: 'Array<{ id: string; label: LocalizedString; icon?: string; blocks: ReportBlock[] }>',
            defaultTab: '(optional) string — tab id to show by default',
          },
          example: {
            type: 'tabs',
            defaultTab: 'q1',
            tabs: [
              { id: 'q1', label: { ru: 'Q1', en: 'Q1' }, blocks: [{ type: 'heading', level: 2, content: { ru: 'Q1', en: 'Q1' } }] },
              { id: 'q2', label: { ru: 'Q2', en: 'Q2' }, blocks: [{ type: 'heading', level: 2, content: { ru: 'Q2', en: 'Q2' } }] },
            ],
          },
        },
        {
          type: 'filter',
          description: 'Interactive filter that updates linked blocks. Multiple filters should be placed inside a filterBar block.',
          requiredFields: ['type', 'filterId', 'label', 'filterType', 'targetBlockIds'],
          fields: {
            filterId: 'string — unique filter identifier',
            label: 'LocalizedString',
            filterType: '"select" | "multiselect" | "dateRange" | "search"',
            options: '(optional) Array<{ value: string; label: LocalizedString }> — for select/multiselect',
            defaultValue: '(optional) string | string[]',
            targetBlockIds: 'string[] — id values of blocks that receive this filter (blocks must have id field)',
          },
          layoutNote: '2–4 filters → wrap in { type: "filterBar", blocks: [...filters] } for a compact horizontal layout',
          example: {
            type: 'filterBar',
            blocks: [
              {
                type: 'filter',
                id: 'period-filter',
                filterId: 'period',
                label: { ru: 'Период', en: 'Period' },
                filterType: 'select',
                defaultValue: 'q1',
                options: [
                  { value: 'q1', label: { ru: 'Q1 2026', en: 'Q1 2026' } },
                  { value: 'q2', label: { ru: 'Q2 2026', en: 'Q2 2026' } },
                ],
                targetBlockIds: ['revenue-chart', 'clients-table'],
              },
              {
                type: 'filter',
                filterId: 'category',
                label: { ru: 'Категория', en: 'Category' },
                filterType: 'multiselect',
                options: [{ value: 'a', label: { ru: 'A', en: 'A' } }],
                targetBlockIds: ['revenue-chart'],
              },
            ],
          },
        },
        {
          type: 'filterBar',
          description: 'Horizontal filter bar — groups multiple filter blocks side-by-side in a compact flex row. Preferred container for 2–4 filters.',
          requiredFields: ['type', 'blocks'],
          fields: {
            gap: '(optional) number — MUI spacing units between filter items, default 2',
            blocks: 'FilterBlock[] — at least 1 filter block',
          },
          layoutNote: 'filterBar renders filters in a flex row with flex-wrap. Each filter takes its natural width (min 160–240px). Filters never stretch to fill the full page width.',
          example: {
            type: 'filterBar',
            blocks: [
              {
                type: 'filter',
                filterId: 'period',
                label: { ru: 'Период', en: 'Period' },
                filterType: 'select',
                options: [{ value: 'q1', label: { ru: 'Q1', en: 'Q1' } }],
                targetBlockIds: ['main-chart'],
              },
              {
                type: 'filter',
                filterId: 'category',
                label: { ru: 'Категория', en: 'Category' },
                filterType: 'multiselect',
                options: [{ value: 'a', label: { ru: 'A', en: 'A' } }],
                targetBlockIds: ['main-chart'],
              },
            ],
          },
        },
        {
          type: 'grid',
          description: 'Multi-column grid layout for side-by-side blocks. Use columns: 2–3 for charts.',
          requiredFields: ['type', 'columns', 'blocks'],
          fields: {
            columns: 'number 1–12 — number of equal-width columns',
            gap: '(optional) number — MUI spacing units, default 3',
            blocks: 'ReportBlock[] — must not contain table blocks',
          },
          example: {
            type: 'grid',
            columns: 2,
            gap: 3,
            blocks: [
              { type: 'chart', chartType: 'pie', series: [{ dataKey: 'value' }], data: [], height: 300 },
              { type: 'chart', chartType: 'gauge', series: [], data: [], gaugeValue: 78, height: 300 },
            ],
          },
        },
        {
          type: 'callout',
          description: 'Alert / info box. Use max 1–2 per section.',
          requiredFields: ['type', 'severity', 'content'],
          fields: {
            severity: '"info" | "success" | "warning" | "error"',
            title: '(optional) LocalizedString',
            content: 'LocalizedString',
          },
          example: { type: 'callout', severity: 'info', title: { ru: 'Примечание', en: 'Note' }, content: { ru: 'Данные актуальны', en: 'Data is current' } },
        },
        {
          type: 'divider',
          description: 'Horizontal divider line. Use between logical sections, not between every block.',
          requiredFields: ['type'],
          fields: {},
          example: { type: 'divider' },
        },
        {
          type: 'dynamicData',
          description: 'Block that fetches data from an external URL and renders child blocks',
          requiredFields: ['type', 'dataSourceUrl', 'blocks'],
          fields: {
            dataSourceUrl: 'string — URL to fetch JSON data from',
            refreshInterval: '(optional) number — seconds between auto-refresh, 0 = no refresh',
            blocks: 'ReportBlock[] — template blocks; data from URL is merged into block data arrays',
          },
          example: {
            type: 'dynamicData',
            dataSourceUrl: 'https://api.example.com/reports/q1-data',
            refreshInterval: 60,
            blocks: [{ type: 'chart', chartType: 'line', series: [{ dataKey: 'value' }], data: [] }],
          },
        },
      ],
      localizedString: '"string" OR { ru: "string", en: "string" } — at least one locale key required',
      blockId: 'Add optional "id": "unique-string" to any block to reference it in dataBindings or filter.targetBlockIds',
      dataBindings: {
        description: 'Define cross-block interactions at ReportConfig level',
        shape: '{ sourceBlockId: string; sourceField: string; targetBlockId: string; targetFilter: string }[]',
        example: [{ sourceBlockId: 'clients-table', sourceField: 'clientId', targetBlockId: 'revenue-chart', targetFilter: 'clientId' }],
      },
    };
  }

  getDesignGuidelines() {
    return {
      guidelinesVersion: 1,
      description: 'ZeroReports visual design guidelines. Follow these rules to build well-structured, visually balanced reports.',
      relatedEndpoints: {
        contractSchema: 'GET /reports/contract-schema — block types, required fields, and examples',
        lint: 'POST /reports/lint — automated check of your config against these guidelines',
        validate: 'POST /reports/validate?lint=true — structural validation + lint in one call',
      },
      llmPrompt: [
        'When generating a ZeroReports config, strictly follow these layout rules:',
        '(1) Always start with { "type": "heading", "level": 1 } as the first block.',
        '(2) Place 2–4 filter blocks inside a filterBar: { "type": "filterBar", "blocks": [...filters] }. Never stack filters vertically.',
        '(3) Small charts (pie, gauge, sparkline) must be grouped 2–3 inside a grid (columns: 2 or 3). Do NOT place them full-width alone.',
        '(4) Large charts (line, bar, scatter, heatmap) go full-width — do NOT put them inside a grid.',
        '(5) Tables always go full-width — NEVER place a table inside a grid block.',
        '(6) Use tabs when the report has more than 5 content blocks to avoid vertical scrolling.',
        '(7) Set metrics.columns equal to the number of items (max 6): 4 items → columns: 4.',
        '(8) Use dividers between logical sections, not between every pair of blocks.',
        '(9) Max 1–2 callout blocks per section. Do not stack multiple callouts consecutively.',
        '(10) Heading hierarchy: h1 for the report title, h2 for sections, h3 for subsections. Never skip levels (h1 → h3 is invalid).',
        '(11) Grid columns for charts: use 2 or 3. Never use 4+ columns for chart grids.',
        '(12) Avoid nesting deeper than 3 levels (grid > tabs > grid > ... is too deep).',
        'PREFERRED STRUCTURE: heading(h1) → callout(info)? → metrics → filterBar → divider → [tabs or charts] → table → callout(success)',
      ].join(' '),
      layoutGuidelines: [
        {
          ruleId: 'WRAP_FILTERS_IN_FILTER_BAR',
          blockTypes: ['filter'],
          recommendation: 'Place 2–4 filter blocks inside a filterBar block. Filters render as a compact horizontal flex row, each taking only its natural width — not stretched across the page.',
          antiPattern: {
            description: 'Two filters stacked vertically — takes too much vertical space and looks unbalanced.',
            blocks: [
              { type: 'filter', filterId: 'period', label: 'Period', filterType: 'select', options: [], targetBlockIds: [] },
              { type: 'filter', filterId: 'category', label: 'Category', filterType: 'multiselect', options: [], targetBlockIds: [] },
            ],
          },
          correctPattern: {
            description: 'Two filters inside a filterBar — compact, horizontally grouped, each at its natural width.',
            blocks: [
              {
                type: 'filterBar',
                blocks: [
                  { type: 'filter', filterId: 'period', label: 'Period', filterType: 'select', options: [], targetBlockIds: [] },
                  { type: 'filter', filterId: 'category', label: 'Category', filterType: 'multiselect', options: [], targetBlockIds: [] },
                ],
              },
            ],
          },
        },
        {
          ruleId: 'METRICS_COLUMNS_MATCH_ITEMS',
          blockTypes: ['metrics'],
          recommendation: 'Set columns equal to the number of items (max 6). Mismatched columns create uneven card widths.',
          antiPattern: {
            description: '4 metric items with columns: 2 — cards are too wide and rows look empty.',
            blocks: [{ type: 'metrics', columns: 2, items: ['a', 'b', 'c', 'd'] }],
          },
          correctPattern: {
            description: '4 metric items with columns: 4 — even single-row layout.',
            blocks: [{ type: 'metrics', columns: 4, items: ['a', 'b', 'c', 'd'] }],
          },
        },
        {
          ruleId: 'SMALL_CHARTS_IN_GRID',
          blockTypes: ['chart'],
          chartTypes: ['pie', 'gauge', 'sparkline'],
          recommendation: 'Group 2–3 small charts (pie, gauge, sparkline) in a grid with 2–3 columns.',
          antiPattern: {
            description: 'A pie chart alone at full width — sparse and hard to read.',
            blocks: [{ type: 'chart', chartType: 'pie', series: [], data: [], height: 350 }],
          },
          correctPattern: {
            description: 'Pie, sparkline, and gauge grouped in a 3-column grid — compact and informative.',
            blocks: [
              {
                type: 'grid',
                columns: 3,
                blocks: [
                  { type: 'chart', chartType: 'pie', series: [], data: [], height: 280 },
                  { type: 'chart', chartType: 'sparkline', series: [], data: [], height: 280 },
                  { type: 'chart', chartType: 'gauge', series: [], data: [], gaugeValue: 78, height: 280 },
                ],
              },
            ],
          },
        },
        {
          ruleId: 'LARGE_CHARTS_FULL_WIDTH',
          blockTypes: ['chart'],
          chartTypes: ['line', 'bar', 'scatter', 'heatmap'],
          recommendation: 'Render line, bar, scatter, and heatmap charts at full width for maximum readability.',
          antiPattern: {
            description: 'A line chart squeezed into a 2-column grid — axis labels overlap and data is unreadable.',
            blocks: [{ type: 'grid', columns: 2, blocks: [{ type: 'chart', chartType: 'line', series: [], data: [] }] }],
          },
          correctPattern: {
            description: 'A line chart at full width — clear axes and readable data points.',
            blocks: [{ type: 'chart', chartType: 'line', series: [], data: [], height: 380 }],
          },
        },
        {
          ruleId: 'TABLES_FULL_WIDTH',
          blockTypes: ['table'],
          recommendation: 'Tables always go full-width. They need horizontal space for columns, sorting, and filtering.',
          antiPattern: {
            description: 'A table inside a 2-column grid — columns are clipped and the table is unusable.',
            blocks: [{ type: 'grid', columns: 2, blocks: [{ type: 'table', columns: [], rows: [] }] }],
          },
          correctPattern: {
            description: 'A table at full width with all columns visible.',
            blocks: [{ type: 'table', columns: [], rows: [], pageSize: 10 }],
          },
        },
        {
          ruleId: 'REPORT_STRUCTURE_ORDER',
          blockTypes: ['all'],
          recommendation: 'Follow the canonical report structure for the best reading experience.',
          correctPattern: {
            description: 'Canonical structure: heading → callout (optional) → metrics → filterBar → divider → content → table → callout (summary)',
            structure: [
              '{ type: "heading", level: 1 }',
              '{ type: "callout", severity: "info" }  ← optional context',
              '{ type: "metrics", columns: 4 }',
              '{ type: "filterBar", blocks: [filters] }',
              '{ type: "divider" }',
              '{ type: "tabs" } or charts',
              '{ type: "table" }',
              '{ type: "callout", severity: "success" }  ← optional summary',
            ],
          },
        },
        {
          ruleId: 'DIVIDER_BETWEEN_SECTIONS',
          blockTypes: ['divider'],
          recommendation: 'Use dividers to separate major logical sections, not between every pair of blocks.',
          antiPattern: {
            description: 'A divider between every block — clutters the layout and creates visual noise.',
          },
          correctPattern: {
            description: 'A single divider between the filter area and the main content area.',
          },
        },
        {
          ruleId: 'TABS_FOR_MANY_BLOCKS',
          blockTypes: ['tabs'],
          recommendation: 'Use tabs when a report section has more than 5 content blocks to reduce vertical scrolling.',
          correctPattern: {
            description: 'Overview / By Region / Analytics tabs each with 2–4 blocks instead of 12 blocks in a flat list.',
          },
        },
        {
          ruleId: 'HEADING_HIERARCHY',
          blockTypes: ['heading'],
          recommendation: 'Use h1 for the report title, h2 for major sections, h3 for subsections. Never skip levels.',
          antiPattern: {
            description: 'Jumping from h1 to h3 — screen readers and TOC tools misinterpret the document structure.',
            blocks: [
              { type: 'heading', level: 1, content: 'Report' },
              { type: 'heading', level: 3, content: 'Section' },
            ],
          },
          correctPattern: {
            description: 'h1 → h2 → h3 in order.',
            blocks: [
              { type: 'heading', level: 1, content: 'Report' },
              { type: 'heading', level: 2, content: 'Section' },
              { type: 'heading', level: 3, content: 'Subsection' },
            ],
          },
        },
        {
          ruleId: 'GRID_MAX_3_COLS',
          blockTypes: ['grid'],
          recommendation: 'Use at most 3 columns for grids containing charts. More columns make charts too narrow.',
          antiPattern: {
            description: '4 pie charts in a 4-column grid — each chart is ~250px wide and unreadable.',
            blocks: [{ type: 'grid', columns: 4, blocks: ['4 charts'] }],
          },
          correctPattern: {
            description: '3 small charts in a 3-column grid — minimum ~350px per chart on standard screens.',
            blocks: [{ type: 'grid', columns: 3, blocks: ['3 charts'] }],
          },
        },
        {
          ruleId: 'MAX_CALLOUTS_PER_SECTION',
          blockTypes: ['callout'],
          recommendation: 'Use max 1–2 callout blocks per section. Stacking callouts dilutes their emphasis.',
          antiPattern: {
            description: 'Three info callouts in a row — all feel equally important, none stand out.',
          },
          correctPattern: {
            description: 'One info callout at the top, one success callout at the bottom.',
          },
        },
        {
          ruleId: 'AVOID_SINGLE_ITEM_GRID',
          blockTypes: ['grid'],
          recommendation: 'A grid with only 1 child block adds unnecessary nesting with no visual benefit.',
          antiPattern: {
            description: '{ type: "grid", columns: 1, blocks: [chart] } — redundant wrapper.',
            blocks: [{ type: 'grid', columns: 1, blocks: [{ type: 'chart', chartType: 'line' }] }],
          },
          correctPattern: {
            description: 'Place the block directly without a grid wrapper.',
            blocks: [{ type: 'chart', chartType: 'line' }],
          },
        },
      ],
      compositionPatterns: [
        {
          id: 'dashboard',
          name: 'Dashboard',
          description: 'Full interactive dashboard with filters, tabs, and a detail table. Best for multi-dimensional data with many metrics.',
          structure: 'heading(h1) → metrics(4) → filterBar → divider → tabs(overview + details) → table → callout',
          skeleton: {
            schemaVersion: 1,
            blocks: [
              { type: 'heading', level: 1, content: { ru: 'Дашборд', en: 'Dashboard' }, subtitle: { ru: 'Описание', en: 'Description' } },
              { type: 'callout', severity: 'info', title: { ru: 'Как использовать', en: 'How to use' }, content: { ru: 'Используйте фильтры для уточнения данных.', en: 'Use filters to refine the data.' } },
              { type: 'metrics', columns: 4, items: [
                { label: { ru: 'Метрика 1', en: 'Metric 1' }, value: '—', deltaType: 'positive', icon: 'solar:chart-2-bold-duotone', color: 'primary' },
                { label: { ru: 'Метрика 2', en: 'Metric 2' }, value: '—', deltaType: 'negative', icon: 'solar:wallet-bold-duotone', color: 'danger' },
                { label: { ru: 'Метрика 3', en: 'Metric 3' }, value: '—', deltaType: 'positive', icon: 'solar:users-group-two-rounded-bold-duotone', color: 'success' },
                { label: { ru: 'Метрика 4', en: 'Metric 4' }, value: '—', deltaType: 'positive', icon: 'solar:target-bold-duotone', color: 'warning' },
              ]},
              { type: 'filterBar', blocks: [
                { type: 'filter', id: 'filter-1', filterId: 'period', label: { ru: 'Период', en: 'Period' }, filterType: 'select', defaultValue: 'all', options: [{ value: 'all', label: { ru: 'Все', en: 'All' } }], targetBlockIds: ['main-chart', 'detail-table'] },
                { type: 'filter', filterId: 'category', label: { ru: 'Категория', en: 'Category' }, filterType: 'multiselect', options: [], targetBlockIds: ['main-chart'] },
              ]},
              { type: 'divider' },
              { type: 'tabs', defaultTab: 'overview', tabs: [
                { id: 'overview', label: { ru: 'Обзор', en: 'Overview' }, icon: 'solar:chart-square-bold-duotone', blocks: [
                  { type: 'chart', id: 'main-chart', chartType: 'line', title: { ru: 'Динамика', en: 'Trend' }, height: 380, xAxis: { dataKey: 'x', scaleType: 'band' }, series: [{ dataKey: 'value', label: { ru: 'Значение', en: 'Value' }, color: 'primary', area: true }], data: [] },
                  { type: 'grid', columns: 3, blocks: [
                    { type: 'chart', chartType: 'pie', title: { ru: 'Распределение', en: 'Distribution' }, series: [{ dataKey: 'value' }], data: [], height: 280 },
                    { type: 'chart', chartType: 'sparkline', title: { ru: 'Тренд', en: 'Sparkline' }, series: [], data: [], sparklineData: [], height: 280 },
                    { type: 'chart', chartType: 'gauge', title: { ru: 'Выполнение', en: 'Performance' }, series: [], data: [], gaugeValue: 0, gaugeMin: 0, gaugeMax: 100, height: 280 },
                  ]},
                ]},
                { id: 'details', label: { ru: 'Детали', en: 'Details' }, icon: 'solar:graph-new-up-bold-duotone', blocks: [
                  { type: 'chart', chartType: 'bar', title: { ru: 'По категориям', en: 'By Category' }, height: 380, xAxis: { dataKey: 'label', scaleType: 'band' }, series: [{ dataKey: 'value', color: 'primary' }], data: [] },
                ]},
              ]},
              { type: 'divider' },
              { type: 'heading', level: 2, content: { ru: 'Детализация', en: 'Details' } },
              { type: 'table', id: 'detail-table', pageSize: 10, density: 'standard', striped: true, headerFilters: true, columns: [
                { field: 'name', headerName: { ru: 'Название', en: 'Name' }, flex: 1 },
                { field: 'value', headerName: { ru: 'Значение', en: 'Value' }, type: 'number', width: 150 },
                { field: 'status', headerName: { ru: 'Статус', en: 'Status' }, width: 130, renderAs: 'chip' },
              ], rows: [] },
              { type: 'callout', severity: 'success', title: { ru: 'Итог', en: 'Summary' }, content: { ru: 'Все показатели в норме.', en: 'All metrics are within targets.' } },
            ],
          },
        },
        {
          id: 'simple-report',
          name: 'Simple Report',
          description: 'Linear report with a single chart and a table. Best for straightforward KPI reporting.',
          structure: 'heading(h1) → callout(info) → metrics → chart(full-width) → grid(2, pie+bar) → table → callout(success)',
          skeleton: {
            schemaVersion: 1,
            blocks: [
              { type: 'heading', level: 1, content: { ru: 'Отчёт', en: 'Report' } },
              { type: 'callout', severity: 'info', content: { ru: 'Данные актуальны на сегодня.', en: 'Data is current as of today.' } },
              { type: 'metrics', columns: 3, items: [
                { label: { ru: 'Метрика 1', en: 'Metric 1' }, value: '—', color: 'primary' },
                { label: { ru: 'Метрика 2', en: 'Metric 2' }, value: '—', color: 'success' },
                { label: { ru: 'Метрика 3', en: 'Metric 3' }, value: '—', color: 'warning' },
              ]},
              { type: 'divider' },
              { type: 'chart', chartType: 'line', title: { ru: 'Динамика', en: 'Trend' }, height: 380, xAxis: { dataKey: 'x', scaleType: 'band' }, series: [{ dataKey: 'value', color: 'primary', area: true }], data: [] },
              { type: 'grid', columns: 2, blocks: [
                { type: 'chart', chartType: 'pie', title: { ru: 'Распределение', en: 'Distribution' }, series: [{ dataKey: 'value' }], data: [], height: 300 },
                { type: 'chart', chartType: 'bar', title: { ru: 'По категориям', en: 'By Category' }, xAxis: { dataKey: 'label', scaleType: 'band' }, series: [{ dataKey: 'value', color: 'success' }], data: [], height: 300 },
              ]},
              { type: 'divider' },
              { type: 'table', pageSize: 10, density: 'standard', columns: [
                { field: 'name', headerName: { ru: 'Имя', en: 'Name' }, flex: 1 },
                { field: 'value', headerName: { ru: 'Значение', en: 'Value' }, type: 'number', width: 150 },
              ], rows: [] },
              { type: 'callout', severity: 'success', content: { ru: 'Отчёт сформирован.', en: 'Report generated.' } },
            ],
          },
        },
        {
          id: 'comparison',
          name: 'Comparison',
          description: 'Side-by-side comparison of two datasets or time periods.',
          structure: 'heading(h1) → metrics → grid(2, chart + chart) → table',
          skeleton: {
            schemaVersion: 1,
            blocks: [
              { type: 'heading', level: 1, content: { ru: 'Сравнение', en: 'Comparison' } },
              { type: 'metrics', columns: 4, items: [
                { label: { ru: 'A', en: 'A' }, value: '—', color: 'primary' },
                { label: { ru: 'B', en: 'B' }, value: '—', color: 'success' },
                { label: { ru: 'Разница', en: 'Difference' }, value: '—', color: 'warning' },
                { label: { ru: 'Тренд', en: 'Trend' }, value: '—', color: 'info' },
              ]},
              { type: 'divider' },
              { type: 'grid', columns: 2, blocks: [
                { type: 'chart', chartType: 'bar', title: { ru: 'Вариант A', en: 'Variant A' }, xAxis: { dataKey: 'label', scaleType: 'band' }, series: [{ dataKey: 'value', color: 'primary' }], data: [], height: 320 },
                { type: 'chart', chartType: 'bar', title: { ru: 'Вариант B', en: 'Variant B' }, xAxis: { dataKey: 'label', scaleType: 'band' }, series: [{ dataKey: 'value', color: 'success' }], data: [], height: 320 },
              ]},
              { type: 'table', pageSize: 10, density: 'compact', columns: [
                { field: 'name', headerName: { ru: 'Параметр', en: 'Parameter' }, flex: 1 },
                { field: 'a', headerName: 'A', type: 'number', width: 120 },
                { field: 'b', headerName: 'B', type: 'number', width: 120 },
                { field: 'delta', headerName: { ru: 'Δ', en: 'Δ' }, width: 120, renderAs: 'badge' },
              ], rows: [] },
            ],
          },
        },
        {
          id: 'filtered-data-view',
          name: 'Filtered Data View',
          description: 'Data exploration report with prominent filters controlling charts and a table.',
          structure: 'heading(h1) → filterBar → divider → chart(full-width) → grid(2, small charts) → table',
          skeleton: {
            schemaVersion: 1,
            blocks: [
              { type: 'heading', level: 1, content: { ru: 'Анализ данных', en: 'Data Analysis' } },
              { type: 'filterBar', blocks: [
                { type: 'filter', filterId: 'period', label: { ru: 'Период', en: 'Period' }, filterType: 'select', defaultValue: 'all', options: [], targetBlockIds: ['main-chart', 'breakdown-table'] },
                { type: 'filter', filterId: 'region', label: { ru: 'Регион', en: 'Region' }, filterType: 'select', options: [], targetBlockIds: ['main-chart', 'breakdown-table'] },
                { type: 'filter', filterId: 'search', label: { ru: 'Поиск', en: 'Search' }, filterType: 'search', targetBlockIds: ['breakdown-table'] },
              ]},
              { type: 'divider' },
              { type: 'chart', id: 'main-chart', chartType: 'line', title: { ru: 'Динамика', en: 'Trend' }, height: 380, xAxis: { dataKey: 'x', scaleType: 'band' }, series: [{ dataKey: 'value', color: 'primary', area: true }], data: [] },
              { type: 'grid', columns: 2, blocks: [
                { type: 'chart', chartType: 'pie', title: { ru: 'Структура', en: 'Breakdown' }, series: [{ dataKey: 'value' }], data: [], height: 300 },
                { type: 'chart', chartType: 'gauge', title: { ru: 'Выполнение плана', en: 'Plan Completion' }, series: [], data: [], gaugeValue: 0, gaugeMin: 0, gaugeMax: 100, height: 300 },
              ]},
              { type: 'table', id: 'breakdown-table', pageSize: 15, density: 'compact', headerFilters: true, columns: [
                { field: 'name', headerName: { ru: 'Имя', en: 'Name' }, flex: 1 },
                { field: 'value', headerName: { ru: 'Значение', en: 'Value' }, type: 'number', width: 150 },
                { field: 'status', headerName: { ru: 'Статус', en: 'Status' }, width: 130, renderAs: 'chip' },
              ], rows: [] },
            ],
          },
        },
      ],
    };
  }
}

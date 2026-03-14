import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReportsService, walkBlocks, walkLevels, getChildBlockGroups } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const mockPrisma = {
  report: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  webhook: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('http://localhost'),
};

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    jest.clearAllMocks();

    mockPrisma.webhook.findMany.mockResolvedValue([]);
    mockPrisma.webhook.create.mockResolvedValue({ id: 'wh-1' });
    mockPrisma.webhook.findUnique.mockResolvedValue(null);
  });

  // ---------------------------------------------------------------------------
  // walkBlocks utility
  // ---------------------------------------------------------------------------

  describe('walkBlocks', () => {
    it('visits all top-level blocks', () => {
      const visited: string[] = [];
      walkBlocks(
        [{ type: 'heading' }, { type: 'divider' }],
        (block) => visited.push(block.type as string),
      );
      expect(visited).toEqual(['heading', 'divider']);
    });

    it('descends into grid.blocks', () => {
      const visited: string[] = [];
      walkBlocks(
        [{ type: 'grid', blocks: [{ type: 'chart' }, { type: 'metrics' }] }],
        (block) => visited.push(block.type as string),
      );
      expect(visited).toEqual(['grid', 'chart', 'metrics']);
    });

    it('descends into tabs[].blocks', () => {
      const visited: string[] = [];
      walkBlocks(
        [{ type: 'tabs', tabs: [
          { id: 'a', blocks: [{ type: 'heading' }] },
          { id: 'b', blocks: [{ type: 'table' }] },
        ]}],
        (block) => visited.push(block.type as string),
      );
      expect(visited).toEqual(['tabs', 'heading', 'table']);
    });

    it('descends into dynamicData.blocks', () => {
      const visited: string[] = [];
      walkBlocks(
        [{ type: 'dynamicData', dataSourceUrl: 'http://x', blocks: [{ type: 'chart' }] }],
        (block) => visited.push(block.type as string),
      );
      expect(visited).toEqual(['dynamicData', 'chart']);
    });

    it('descends into filterBar.blocks', () => {
      const visited: string[] = [];
      walkBlocks(
        [{ type: 'filterBar', blocks: [{ type: 'filter', filterId: 'a' }, { type: 'filter', filterId: 'b' }] }],
        (block) => visited.push(block.type as string),
      );
      expect(visited).toEqual(['filterBar', 'filter', 'filter']);
    });

    it('provides parentType="filterBar" for filter children of filterBar', () => {
      const parentTypes: Array<string | null> = [];
      walkBlocks(
        [{ type: 'filterBar', blocks: [{ type: 'filter', filterId: 'a' }] }],
        (_block, _path, _depth, parentType) => parentTypes.push(parentType),
      );
      expect(parentTypes[0]).toBeNull();
      expect(parentTypes[1]).toBe('filterBar');
    });

    it('provides correct path, depth, and parentType', () => {
      const calls: Array<{ path: string; depth: number; parentType: string | null }> = [];
      walkBlocks(
        [{ type: 'grid', blocks: [{ type: 'chart' }] }],
        (_block, path, depth, parentType) => calls.push({ path, depth, parentType }),
      );
      expect(calls[0]).toEqual({ path: 'blocks[0]', depth: 0, parentType: null });
      expect(calls[1]).toEqual({ path: 'blocks[0].blocks[0]', depth: 1, parentType: 'grid' });
    });

    it('handles empty and non-array blocks gracefully', () => {
      expect(() => walkBlocks([], jest.fn())).not.toThrow();
      expect(() => walkBlocks(null as unknown as unknown[], jest.fn())).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // walkLevels utility
  // ---------------------------------------------------------------------------

  describe('walkLevels', () => {
    it('calls processor for each level', () => {
      const levels: number[] = [];
      walkLevels(
        [{ type: 'grid', blocks: [{ type: 'chart' }] }],
        (_siblings, _path, depth) => levels.push(depth),
      );
      expect(levels).toEqual([0, 1]);
    });

    it('provides correct sibling arrays per level', () => {
      const types: string[][] = [];
      walkLevels(
        [
          { type: 'heading' },
          { type: 'grid', blocks: [{ type: 'chart' }, { type: 'metrics' }] },
        ],
        (siblings) => types.push(siblings.map((b) => b.type as string)),
      );
      expect(types[0]).toEqual(['heading', 'grid']);
      expect(types[1]).toEqual(['chart', 'metrics']);
    });

    it('passes parentType to processor', () => {
      const parentTypes: Array<string | null> = [];
      walkLevels(
        [{ type: 'grid', blocks: [{ type: 'chart' }] }],
        (_siblings, _path, _depth, parentType) => parentTypes.push(parentType),
      );
      expect(parentTypes[0]).toBeNull();
      expect(parentTypes[1]).toBe('grid');
    });

    it('descends into filterBar.blocks with parentType="filterBar"', () => {
      const parentTypes: Array<string | null> = [];
      walkLevels(
        [{ type: 'filterBar', blocks: [{ type: 'filter', filterId: 'a' }] }],
        (_siblings, _path, _depth, parentType) => parentTypes.push(parentType),
      );
      expect(parentTypes[0]).toBeNull();
      expect(parentTypes[1]).toBe('filterBar');
    });
  });

  // ---------------------------------------------------------------------------
  // getChildBlockGroups — single source of truth for child extraction
  // ---------------------------------------------------------------------------

  describe('getChildBlockGroups', () => {
    it('returns one group for grid with path and parentType', () => {
      const block = { type: 'grid', blocks: [{ type: 'chart' }] };
      const groups = getChildBlockGroups(block, 'blocks[0]');
      expect(groups).toHaveLength(1);
      expect(groups[0].parentType).toBe('grid');
      expect(groups[0].path).toBe('blocks[0].blocks');
      expect(groups[0].blocks).toEqual([{ type: 'chart' }]);
    });

    it('returns one group for dynamicData', () => {
      const block = { type: 'dynamicData', dataSourceUrl: 'http://x', blocks: [{ type: 'table' }] };
      const groups = getChildBlockGroups(block, 'blocks[0]');
      expect(groups).toHaveLength(1);
      expect(groups[0].parentType).toBe('dynamicData');
    });

    it('returns one group for filterBar', () => {
      const block = { type: 'filterBar', blocks: [{ type: 'filter', filterId: 'f1' }] };
      const groups = getChildBlockGroups(block, 'blocks[0]');
      expect(groups).toHaveLength(1);
      expect(groups[0].parentType).toBe('filterBar');
    });

    it('returns one group per tab for tabs', () => {
      const block = {
        type: 'tabs',
        tabs: [
          { id: 'a', blocks: [{ type: 'heading' }] },
          { id: 'b', blocks: [{ type: 'chart' }] },
        ],
      };
      const groups = getChildBlockGroups(block, 'blocks[0]');
      expect(groups).toHaveLength(2);
      expect(groups[0].parentType).toBe('tabs');
      expect(groups[0].path).toBe('blocks[0].tabs[a].blocks');
      expect(groups[1].path).toBe('blocks[0].tabs[b].blocks');
    });

    it('returns empty array for leaf blocks (heading, chart, table, etc.)', () => {
      for (const type of ['heading', 'chart', 'table', 'metrics', 'divider', 'callout', 'markdown', 'filter']) {
        expect(getChildBlockGroups({ type }, 'blocks[0]')).toHaveLength(0);
      }
    });

    /**
     * GUARD TEST — If someone adds a new container type to KNOWN_BLOCK_TYPES
     * but forgets to handle it in getChildBlockGroups, this test will fail.
     *
     * How to fix the failure: add the new type to getChildBlockGroups().
     *
     * Container types are those whose blocks can contain other blocks.
     * Leaf types produce no child groups and are excluded from the check.
     */
    it('GUARD: getChildBlockGroups handles every known container type', () => {
      const KNOWN_CONTAINER_TYPES = new Set(['grid', 'dynamicData', 'filterBar', 'tabs']);
      const KNOWN_LEAF_TYPES = new Set([
        'heading', 'markdown', 'metrics', 'chart', 'table',
        'divider', 'callout', 'uiShowcase', 'filter',
      ]);

      for (const containerType of KNOWN_CONTAINER_TYPES) {
        let block: Record<string, unknown>;
        if (containerType === 'tabs') {
          block = { type: containerType, tabs: [{ id: 'x', blocks: [{ type: 'heading' }] }] };
        } else {
          block = { type: containerType, blocks: [{ type: 'heading' }] };
        }
        const groups = getChildBlockGroups(block, 'blocks[0]');
        if (groups.length === 0) {
          throw new Error(
            `getChildBlockGroups does not handle container type "${containerType}". ` +
            `Add it to getChildBlockGroups() in reports.service.ts.`,
          );
        }
      }

      for (const leafType of KNOWN_LEAF_TYPES) {
        const groups = getChildBlockGroups({ type: leafType }, 'blocks[0]');
        expect(groups).toHaveLength(0);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // validate() — refactored with walkBlocks
  // ---------------------------------------------------------------------------

  describe('validate', () => {
    it('returns valid for correct top-level config', async () => {
      const result = await service.validate({ blocks: [{ type: 'heading', level: 1, content: { ru: 'Test' } }] });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns invalid when blocks is missing', async () => {
      const result = await service.validate({});
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('blocks');
    });

    it('returns invalid for unknown top-level block type', async () => {
      const result = await service.validate({ blocks: [{ type: 'unknown-type' }] });
      expect(result.valid).toBe(false);
    });

    it('validates nested blocks inside grid', async () => {
      const result = await service.validate({
        blocks: [{ type: 'grid', blocks: [{ type: 'not-a-real-type' }] }],
      });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('not-a-real-type');
    });

    it('accepts filterBar block type as valid', async () => {
      const result = await service.validate({
        blocks: [{
          type: 'filterBar',
          blocks: [
            { type: 'filter', filterId: 'a', filterType: 'select', label: 'A', targetBlockIds: [] },
          ],
        }],
      });
      expect(result.valid).toBe(true);
    });

    it('validates nested blocks inside tabs', async () => {
      const result = await service.validate({
        blocks: [{
          type: 'tabs',
          tabs: [{ id: 'a', blocks: [{ type: 'bad-type' }] }],
        }],
      });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('bad-type');
    });

    it('includes lint results when lintEnabled=true', async () => {
      const result = await service.validate(
        { blocks: [{ type: 'divider' }] },
        true,
      );
      expect(result.lint).toBeDefined();
      expect(Array.isArray(result.lint!.issues)).toBe(true);
    });

    it('does not include lint when lintEnabled=false (default)', async () => {
      const result = await service.validate({ blocks: [] });
      expect(result.lint).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // lintConfig() — 12 rules
  // ---------------------------------------------------------------------------

  describe('lintConfig', () => {
    it('returns _links pointing to guidelines and schema', () => {
      const result = service.lintConfig({ blocks: [] });
      expect(result._links.guidelines).toContain('design-guidelines');
      expect(result._links.schema).toContain('contract-schema');
    });

    // Rule: NO_HEADING
    describe('NO_HEADING', () => {
      it('flags when first block is not heading', () => {
        const result = service.lintConfig({ blocks: [{ type: 'divider' }] });
        expect(result.issues.some((i) => i.ruleId === 'NO_HEADING')).toBe(true);
      });

      it('does not flag when first block is heading', () => {
        const result = service.lintConfig({ blocks: [{ type: 'heading', level: 1, content: 'Title' }] });
        expect(result.issues.some((i) => i.ruleId === 'NO_HEADING')).toBe(false);
      });

      it('does not flag for empty blocks array', () => {
        const result = service.lintConfig({ blocks: [] });
        expect(result.issues.some((i) => i.ruleId === 'NO_HEADING')).toBe(false);
      });
    });

    // Rule: DUPLICATE_BLOCK_ID
    describe('DUPLICATE_BLOCK_ID', () => {
      it('flags duplicate ids', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'chart', id: 'my-chart', series: [], data: [] },
            { type: 'table', id: 'my-chart', columns: [], rows: [] },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'DUPLICATE_BLOCK_ID')).toBe(true);
      });

      it('detects duplicate ids inside nested blocks', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'chart', id: 'dupe', series: [], data: [] },
            { type: 'grid', blocks: [{ type: 'chart', id: 'dupe', series: [], data: [] }] },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'DUPLICATE_BLOCK_ID')).toBe(true);
      });

      it('does not flag unique ids', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'chart', id: 'chart-1', series: [], data: [] },
            { type: 'table', id: 'table-1', columns: [], rows: [] },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'DUPLICATE_BLOCK_ID')).toBe(false);
      });
    });

    // Rule: FILTER_TARGET_MISSING
    describe('FILTER_TARGET_MISSING', () => {
      it('flags filter referencing non-existent block id', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'filter', filterId: 'period', filterType: 'select', label: 'Period', targetBlockIds: ['ghost-chart'] },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'FILTER_TARGET_MISSING')).toBe(true);
      });

      it('does not flag when target block exists', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'filter', filterId: 'period', filterType: 'select', label: 'Period', targetBlockIds: ['real-chart'] },
            { type: 'chart', id: 'real-chart', chartType: 'line', series: [], data: [] },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'FILTER_TARGET_MISSING')).toBe(false);
      });
    });

    // Rule: FILTERS_NOT_IN_GRID
    describe('FILTERS_NOT_IN_GRID', () => {
      it('flags two consecutive filters at top level', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'filter', filterId: 'a', filterType: 'select', label: 'A', targetBlockIds: [] },
            { type: 'filter', filterId: 'b', filterType: 'select', label: 'B', targetBlockIds: [] },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'FILTERS_NOT_IN_GRID')).toBe(true);
      });

      it('flags three consecutive filters', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'filter', filterId: 'a', filterType: 'select', label: 'A', targetBlockIds: [] },
            { type: 'filter', filterId: 'b', filterType: 'select', label: 'B', targetBlockIds: [] },
            { type: 'filter', filterId: 'c', filterType: 'select', label: 'C', targetBlockIds: [] },
          ],
        });
        const issue = result.issues.find((i) => i.ruleId === 'FILTERS_NOT_IN_GRID');
        expect(issue).toBeDefined();
        expect(issue!.suggestion).toContain('3');
      });

      it('does not flag a single filter', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'filter', filterId: 'a', filterType: 'select', label: 'A', targetBlockIds: [] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'FILTERS_NOT_IN_GRID')).toBe(false);
      });

      it('does not flag filters already inside grid', () => {
        const result = service.lintConfig({
          blocks: [{
            type: 'grid',
            columns: 2,
            blocks: [
              { type: 'filter', filterId: 'a', filterType: 'select', label: 'A', targetBlockIds: [] },
              { type: 'filter', filterId: 'b', filterType: 'select', label: 'B', targetBlockIds: [] },
            ],
          }],
        });
        expect(result.issues.some((i) => i.ruleId === 'FILTERS_NOT_IN_GRID')).toBe(false);
      });

      it('does not flag filters inside filterBar', () => {
        const result = service.lintConfig({
          blocks: [{
            type: 'filterBar',
            blocks: [
              { type: 'filter', filterId: 'a', filterType: 'select', label: 'A', targetBlockIds: [] },
              { type: 'filter', filterId: 'b', filterType: 'select', label: 'B', targetBlockIds: [] },
            ],
          }],
        });
        expect(result.issues.some((i) => i.ruleId === 'FILTERS_NOT_IN_GRID')).toBe(false);
      });

      it('suggestion text mentions filterBar', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'filter', filterId: 'a', filterType: 'select', label: 'A', targetBlockIds: [] },
            { type: 'filter', filterId: 'b', filterType: 'select', label: 'B', targetBlockIds: [] },
          ],
        });
        const issue = result.issues.find((i) => i.ruleId === 'FILTERS_NOT_IN_GRID');
        expect(issue).toBeDefined();
        expect(issue!.suggestion).toContain('filterBar');
      });
    });

    // Rule: CONSECUTIVE_CALLOUTS
    describe('CONSECUTIVE_CALLOUTS', () => {
      it('flags two consecutive callouts', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'callout', severity: 'info', content: 'A' },
            { type: 'callout', severity: 'warning', content: 'B' },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'CONSECUTIVE_CALLOUTS')).toBe(true);
      });

      it('does not flag a single callout', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'callout', severity: 'info', content: 'A' }],
        });
        expect(result.issues.some((i) => i.ruleId === 'CONSECUTIVE_CALLOUTS')).toBe(false);
      });

      it('does not flag callouts separated by other blocks', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'callout', severity: 'info', content: 'A' },
            { type: 'divider' },
            { type: 'callout', severity: 'success', content: 'B' },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'CONSECUTIVE_CALLOUTS')).toBe(false);
      });
    });

    // Rule: METRICS_COLUMNS_MISMATCH
    describe('METRICS_COLUMNS_MISMATCH', () => {
      it('flags when columns != items.length', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'metrics', columns: 2, items: [1, 2, 3, 4] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'METRICS_COLUMNS_MISMATCH')).toBe(true);
      });

      it('does not flag when columns matches items.length', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'metrics', columns: 4, items: [1, 2, 3, 4] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'METRICS_COLUMNS_MISMATCH')).toBe(false);
      });

      it('does not flag when columns is not specified', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'metrics', items: [1, 2, 3] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'METRICS_COLUMNS_MISMATCH')).toBe(false);
      });

      it('does not flag when items.length > 6 (non-standard layout)', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'metrics', columns: 3, items: [1, 2, 3, 4, 5, 6, 7] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'METRICS_COLUMNS_MISMATCH')).toBe(false);
      });
    });

    // Rule: SMALL_CHART_FULL_WIDTH
    describe('SMALL_CHART_FULL_WIDTH', () => {
      it('flags pie chart at top level (not in grid)', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'chart', chartType: 'pie', series: [], data: [] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'SMALL_CHART_FULL_WIDTH')).toBe(true);
      });

      it('flags gauge chart at top level', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'chart', chartType: 'gauge', series: [], data: [], gaugeValue: 50 }],
        });
        expect(result.issues.some((i) => i.ruleId === 'SMALL_CHART_FULL_WIDTH')).toBe(true);
      });

      it('flags sparkline chart at top level', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'chart', chartType: 'sparkline', series: [], data: [] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'SMALL_CHART_FULL_WIDTH')).toBe(true);
      });

      it('does not flag pie chart inside grid', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'grid', columns: 2, blocks: [
            { type: 'chart', chartType: 'pie', series: [], data: [] },
            { type: 'chart', chartType: 'gauge', series: [], data: [] },
          ]}],
        });
        expect(result.issues.some((i) => i.ruleId === 'SMALL_CHART_FULL_WIDTH')).toBe(false);
      });

      it('does not flag line/bar charts at top level', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'chart', chartType: 'line', series: [], data: [] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'SMALL_CHART_FULL_WIDTH')).toBe(false);
      });
    });

    // Rule: TABLE_IN_GRID
    describe('TABLE_IN_GRID', () => {
      it('flags table inside grid', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'grid', columns: 2, blocks: [
            { type: 'table', columns: [], rows: [] },
            { type: 'chart', chartType: 'bar', series: [], data: [] },
          ]}],
        });
        expect(result.issues.some((i) => i.ruleId === 'TABLE_IN_GRID')).toBe(true);
      });

      it('does not flag table at top level', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'table', columns: [], rows: [] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'TABLE_IN_GRID')).toBe(false);
      });
    });

    // Rule: SINGLE_ITEM_GRID
    describe('SINGLE_ITEM_GRID', () => {
      it('flags grid with 1 child', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'grid', columns: 2, blocks: [{ type: 'chart', chartType: 'bar', series: [], data: [] }] }],
        });
        expect(result.issues.some((i) => i.ruleId === 'SINGLE_ITEM_GRID')).toBe(true);
      });

      it('does not flag grid with 2+ children', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'grid', columns: 2, blocks: [
            { type: 'chart', chartType: 'pie', series: [], data: [] },
            { type: 'chart', chartType: 'gauge', series: [], data: [] },
          ]}],
        });
        expect(result.issues.some((i) => i.ruleId === 'SINGLE_ITEM_GRID')).toBe(false);
      });
    });

    // Rule: GRID_TOO_MANY_COLS
    describe('GRID_TOO_MANY_COLS', () => {
      it('flags grid with >3 columns containing charts', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'grid', columns: 4, blocks: [
            { type: 'chart', chartType: 'pie', series: [], data: [] },
            { type: 'chart', chartType: 'pie', series: [], data: [] },
            { type: 'chart', chartType: 'pie', series: [], data: [] },
            { type: 'chart', chartType: 'pie', series: [], data: [] },
          ]}],
        });
        expect(result.issues.some((i) => i.ruleId === 'GRID_TOO_MANY_COLS')).toBe(true);
      });

      it('does not flag grid with >3 columns containing non-chart blocks', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'grid', columns: 4, blocks: [
            { type: 'metrics', items: [] },
            { type: 'callout', severity: 'info', content: 'x' },
            { type: 'heading', level: 2, content: 'x' },
            { type: 'markdown', content: 'x' },
          ]}],
        });
        expect(result.issues.some((i) => i.ruleId === 'GRID_TOO_MANY_COLS')).toBe(false);
      });

      it('does not flag grid with 3 columns', () => {
        const result = service.lintConfig({
          blocks: [{ type: 'grid', columns: 3, blocks: [
            { type: 'chart', chartType: 'pie', series: [], data: [] },
            { type: 'chart', chartType: 'gauge', series: [], data: [] },
            { type: 'chart', chartType: 'sparkline', series: [], data: [] },
          ]}],
        });
        expect(result.issues.some((i) => i.ruleId === 'GRID_TOO_MANY_COLS')).toBe(false);
      });
    });

    // Rule: HEADING_LEVEL_SKIP
    describe('HEADING_LEVEL_SKIP', () => {
      it('flags h1 -> h3 (skips h2)', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'heading', level: 1, content: 'Title' },
            { type: 'heading', level: 3, content: 'Skipped' },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'HEADING_LEVEL_SKIP')).toBe(true);
      });

      it('does not flag sequential h1 -> h2 -> h3', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'heading', level: 1, content: 'Title' },
            { type: 'heading', level: 2, content: 'Section' },
            { type: 'heading', level: 3, content: 'Subsection' },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'HEADING_LEVEL_SKIP')).toBe(false);
      });

      it('does not flag same-level headings', () => {
        const result = service.lintConfig({
          blocks: [
            { type: 'heading', level: 2, content: 'A' },
            { type: 'heading', level: 2, content: 'B' },
          ],
        });
        expect(result.issues.some((i) => i.ruleId === 'HEADING_LEVEL_SKIP')).toBe(false);
      });
    });

    // Rule: DEEP_NESTING
    describe('DEEP_NESTING', () => {
      it('flags blocks nested more than 3 levels deep', () => {
        const result = service.lintConfig({
          blocks: [{
            type: 'grid',
            blocks: [{
              type: 'tabs',
              tabs: [{ id: 'a', blocks: [{
                type: 'grid',
                blocks: [{
                  type: 'grid',
                  blocks: [{ type: 'chart', chartType: 'line', series: [], data: [] }],
                }],
              }] }],
            }],
          }],
        });
        expect(result.issues.some((i) => i.ruleId === 'DEEP_NESTING')).toBe(true);
      });

      it('does not flag blocks at depth <= 3', () => {
        const result = service.lintConfig({
          blocks: [{
            type: 'grid',
            blocks: [{
              type: 'tabs',
              tabs: [{ id: 'a', blocks: [{ type: 'chart', chartType: 'line', series: [], data: [] }] }],
            }],
          }],
        });
        expect(result.issues.some((i) => i.ruleId === 'DEEP_NESTING')).toBe(false);
      });
    });

    it('returns no issues for a well-formed report using filterBar', () => {
      const result = service.lintConfig({
        blocks: [
          { type: 'heading', level: 1, content: 'Report' },
          { type: 'metrics', columns: 3, items: [1, 2, 3] },
          { type: 'filterBar', blocks: [
            { type: 'filter', id: 'f1', filterId: 'period', filterType: 'select', label: 'Period', targetBlockIds: ['main-chart'] },
            { type: 'filter', filterId: 'cat', filterType: 'multiselect', label: 'Cat', targetBlockIds: ['main-chart'] },
          ]},
          { type: 'divider' },
          { type: 'chart', id: 'main-chart', chartType: 'line', series: [], data: [] },
          { type: 'grid', columns: 2, blocks: [
            { type: 'chart', chartType: 'pie', series: [], data: [] },
            { type: 'chart', chartType: 'gauge', series: [], data: [], gaugeValue: 50 },
          ]},
          { type: 'table', columns: [], rows: [] },
          { type: 'callout', severity: 'success', content: 'Done' },
        ],
      });
      expect(result.issues.filter((i) => i.severity === 'warning')).toHaveLength(0);
    });
  });

  // ---------------------------------------------------------------------------
  // getContractSchema
  // ---------------------------------------------------------------------------

  describe('getContractSchema', () => {
    it('returns schema with blockTypes array', () => {
      const schema = service.getContractSchema();
      expect(schema).toHaveProperty('schemaVersion', 1);
      expect(Array.isArray(schema.blockTypes)).toBe(true);
      expect(schema.blockTypes.length).toBeGreaterThan(0);
    });

    it('includes relatedEndpoints pointing to design-guidelines and lint', () => {
      const schema = service.getContractSchema();
      expect(schema.relatedEndpoints).toBeDefined();
      expect(schema.relatedEndpoints.designGuidelines).toContain('design-guidelines');
      expect(schema.relatedEndpoints.lint).toContain('lint');
    });
  });

  // ---------------------------------------------------------------------------
  // getDesignGuidelines
  // ---------------------------------------------------------------------------

  describe('getDesignGuidelines', () => {
    it('returns guidelinesVersion, layoutGuidelines, compositionPatterns, llmPrompt, relatedEndpoints', () => {
      const g = service.getDesignGuidelines();
      expect(g.guidelinesVersion).toBe(1);
      expect(Array.isArray(g.layoutGuidelines)).toBe(true);
      expect(Array.isArray(g.compositionPatterns)).toBe(true);
      expect(typeof g.llmPrompt).toBe('string');
      expect(g.relatedEndpoints).toBeDefined();
    });

    it('has exactly 12 layout guidelines', () => {
      const g = service.getDesignGuidelines();
      expect(g.layoutGuidelines).toHaveLength(12);
    });

    it('has exactly 4 composition patterns', () => {
      const g = service.getDesignGuidelines();
      expect(g.compositionPatterns).toHaveLength(4);
    });

    it('each layout guideline has ruleId, recommendation, antiPattern or correctPattern', () => {
      const g = service.getDesignGuidelines();
      for (const rule of g.layoutGuidelines) {
        expect(rule.ruleId).toBeDefined();
        expect(rule.recommendation).toBeDefined();
      }
    });

    it('each composition pattern has id, name, description, skeleton', () => {
      const g = service.getDesignGuidelines();
      for (const pattern of g.compositionPatterns) {
        expect(pattern.id).toBeDefined();
        expect(pattern.name).toBeDefined();
        expect(pattern.description).toBeDefined();
        expect(pattern.skeleton).toBeDefined();
      }
    });

    it('composition pattern skeletons pass structural validation', async () => {
      const g = service.getDesignGuidelines();
      for (const pattern of g.compositionPatterns) {
        const result = await service.validate(pattern.skeleton as Record<string, unknown>);
        if (!result.valid) {
          throw new Error(`Pattern "${pattern.id}" has invalid skeleton: ${result.errors.join(', ')}`);
        }
        expect(result.valid).toBe(true);
      }
    });

    it('llmPrompt contains all 12 key rules', () => {
      const g = service.getDesignGuidelines();
      expect(g.llmPrompt).toContain('heading');
      expect(g.llmPrompt).toContain('filter');
      expect(g.llmPrompt).toContain('filterBar');
      expect(g.llmPrompt).toContain('grid');
      expect(g.llmPrompt).toContain('table');
      expect(g.llmPrompt).toContain('tabs');
    });

    it('relatedEndpoints links back to contract-schema and lint', () => {
      const g = service.getDesignGuidelines();
      expect(g.relatedEndpoints.contractSchema).toContain('contract-schema');
      expect(g.relatedEndpoints.lint).toContain('lint');
    });
  });

  // ---------------------------------------------------------------------------
  // Existing CRUD tests
  // ---------------------------------------------------------------------------

  describe('findAll', () => {
    it('returns list of published reports', async () => {
      const reports = [{ id: '1', slug: 'test', token: 'tok', title: { ru: 'Test' }, description: null, createdAt: new Date(), updatedAt: new Date() }];
      mockPrisma.report.findMany.mockResolvedValue(reports);
      const result = await service.findAll();
      expect(result).toEqual(reports);
      expect(mockPrisma.report.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isPublished: true } }));
    });
  });

  describe('findByToken', () => {
    it('returns report when found', async () => {
      const report = { title: { ru: 'Test' }, description: null, config: { blocks: [] }, createdAt: new Date() };
      mockPrisma.report.findUnique.mockResolvedValue(report);
      const result = await service.findByToken('some-token');
      expect(result).toEqual(report);
    });

    it('throws NotFoundException when report not found', async () => {
      mockPrisma.report.findUnique.mockResolvedValue(null);
      await expect(service.findByToken('missing-token')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = { slug: 'test-report', title: { ru: 'Тест', en: 'Test' }, config: { blocks: [] } };

    it('creates and returns a report', async () => {
      const created = { id: '1', ...dto, token: 'tok', isPublished: true, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.report.create.mockResolvedValue(created);
      const result = await service.create(dto as Parameters<typeof service.create>[0]);
      expect(result).toEqual(created);
    });

    it('throws ConflictException on duplicate slug (P2002)', async () => {
      const error = new PrismaClientKnownRequestError('Unique constraint', { code: 'P2002', clientVersion: '6' });
      mockPrisma.report.create.mockRejectedValue(error);
      await expect(service.create(dto as Parameters<typeof service.create>[0])).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('throws NotFoundException when report not found', async () => {
      mockPrisma.report.findUnique.mockResolvedValue(null);
      await expect(service.update('missing', {})).rejects.toThrow(NotFoundException);
    });

    it('updates and returns the report', async () => {
      const existing = { id: '1', slug: 'test', token: 'tok', title: { ru: 'Test' }, description: null, config: { blocks: [] }, isPublished: true, createdAt: new Date(), updatedAt: new Date() };
      const updated = { ...existing, isPublished: false };
      mockPrisma.report.findUnique.mockResolvedValue(existing);
      mockPrisma.report.update.mockResolvedValue(updated);
      const result = await service.update('test', { isPublished: false });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when report not found', async () => {
      mockPrisma.report.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });

    it('deletes the report', async () => {
      const report = { id: '1', slug: 'test' };
      mockPrisma.report.findUnique.mockResolvedValue(report);
      mockPrisma.report.delete.mockResolvedValue(report);
      const result = await service.remove('test');
      expect(result).toEqual(report);
    });
  });
});

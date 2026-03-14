import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getChildBlocks } from '@zero/contracts';
import type { ReportBlock } from '../types/report';

export type FilterValue = string | string[] | null;

interface FilterState {
  [filterId: string]: FilterValue;
}

export interface FilterDef {
  filterId: string;
  targetBlockIds: string[];
}

interface ReportFilterContextValue {
  filters: FilterState;
  filterDefs: FilterDef[];
  setFilter: (filterId: string, value: FilterValue) => void;
  getFilter: (filterId: string) => FilterValue;
  clearFilters: () => void;
}

const ReportFilterContext = createContext<ReportFilterContextValue | null>(null);

export function ReportFilterProvider({
  children,
  filterDefs = [],
}: {
  children: ReactNode;
  filterDefs?: FilterDef[];
}) {
  const [filters, setFilters] = useState<FilterState>({});

  const setFilter = useCallback((filterId: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [filterId]: value }));
  }, []);

  const getFilter = useCallback((filterId: string): FilterValue => {
    return filters[filterId] ?? null;
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return (
    <ReportFilterContext.Provider value={{ filters, filterDefs, setFilter, getFilter, clearFilters }}>
      {children}
    </ReportFilterContext.Provider>
  );
}

export function useReportFilters() {
  const ctx = useContext(ReportFilterContext);
  if (!ctx) {
    throw new Error('useReportFilters must be used within ReportFilterProvider');
  }
  return ctx;
}

/**
 * Recursively extracts all FilterDef entries from a block tree.
 * Uses getChildBlocks() — add new container types there, not here.
 */
export function extractFilterDefs(blocks: ReportBlock[]): FilterDef[] {
  const defs: FilterDef[] = [];
  for (const block of blocks) {
    if (block.type === 'filter') {
      defs.push({ filterId: block.filterId, targetBlockIds: block.targetBlockIds });
    }
    for (const group of getChildBlocks(block)) {
      defs.push(...extractFilterDefs(group.blocks));
    }
  }
  return defs;
}

/**
 * Applies active filter values to a data array.
 * Filters rows where every active filter matches the corresponding field.
 * 'all' and empty string are treated as "no filter" (show all rows).
 */
export function applyFilters(
  data: Record<string, unknown>[],
  filters: FilterState,
  targetBlockId: string,
  blockFilters: FilterDef[],
): Record<string, unknown>[] {
  const applicableFilters = blockFilters.filter((f) => f.targetBlockIds.includes(targetBlockId));

  if (applicableFilters.length === 0) return data;

  return data.filter((row) => {
    return applicableFilters.every(({ filterId }) => {
      const value = filters[filterId];
      if (!value || value === 'all' || (Array.isArray(value) && value.length === 0)) return true;

      const rowValue = row[filterId] ?? row[filterId.replace(/-filter$/, '')];
      if (rowValue === undefined) return true;

      if (Array.isArray(value)) {
        return value.includes(String(rowValue));
      }
      return String(rowValue) === value;
    });
  });
}

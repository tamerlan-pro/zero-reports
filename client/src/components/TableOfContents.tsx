import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { Icon } from '@iconify/react';
import type { TreeViewBaseItem } from '@mui/x-tree-view/models';
import type { ReportBlock } from '../types/report';
import { resolveLocale } from '../utils/locale';

export interface TocItem {
  id: string;
  label: string;
  level: number;
}

export function extractTocItems(blocks: ReportBlock[], lang: string): TocItem[] {
  const items: TocItem[] = [];
  blocks.forEach((block, index) => {
    const id = `block-${index}`;
    if (block.type === 'heading') {
      items.push({ id, label: resolveLocale(block.content, lang), level: block.level });
    } else if (block.type === 'chart' && block.title) {
      items.push({ id, label: resolveLocale(block.title, lang), level: 3 });
    } else if (block.type === 'table' && block.title) {
      items.push({ id, label: resolveLocale(block.title, lang), level: 3 });
    } else if (block.type === 'callout' && block.title) {
      items.push({ id, label: resolveLocale(block.title, lang), level: 4 });
    }
  });
  return items;
}

function tocItemsToTree(items: TocItem[]): TreeViewBaseItem[] {
  const root: TreeViewBaseItem[] = [];
  const stack: { node: TreeViewBaseItem; level: number }[] = [];

  for (const item of items) {
    const node: TreeViewBaseItem = { id: item.id, label: item.label };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      const parent = stack[stack.length - 1].node;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }

    stack.push({ node, level: item.level });
  }

  return root;
}

function collectExpandableIds(items: TreeViewBaseItem[]): string[] {
  const ids: string[] = [];
  function walk(item: TreeViewBaseItem) {
    if (item.children?.length) {
      ids.push(item.id);
      item.children.forEach(walk);
    }
  }
  items.forEach(walk);
  return ids;
}

function ExpandIcon() {
  return <Icon icon="solar:alt-arrow-right-linear" width={14} />;
}

function CollapseIcon() {
  return <Icon icon="solar:alt-arrow-down-linear" width={14} />;
}

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    borderRadius: `${theme.heroui.radius.small}px`,
    padding: `${theme.heroui.spacing.xs}px 8px`,
    color: theme.heroui.default[500],
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: alpha(theme.heroui.default[200], 0.4),
      color: theme.heroui.default[600],
    },
    '&[data-selected]': {
      backgroundColor: `${alpha(theme.heroui.primary[400], 0.1)} !important`,
      color: `${theme.heroui.primary[400]} !important`,
      '&:hover': {
        backgroundColor: `${alpha(theme.heroui.primary[400], 0.14)} !important`,
      },
    },
    '&[data-focused]': {
      outline: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    '&[data-selected][data-focused]': {
      backgroundColor: `${alpha(theme.heroui.primary[400], 0.1)} !important`,
    },
  },
  [`& .${treeItemClasses.label}`]: {
    fontSize: theme.heroui.typography.small.fontSize,
    lineHeight: theme.heroui.typography.small.lineHeight,
    fontWeight: 500,
    wordBreak: 'break-word',
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    width: 20,
    minWidth: 20,
    color: theme.heroui.default[400],
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 6,
    paddingLeft: 12,
    borderLeft: `1px solid ${alpha(theme.heroui.default[300], 0.15)}`,
  },
}));

interface Props {
  items: TocItem[];
}

export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const clickLockRef = useRef(false);

  const treeItems = useMemo(() => tocItemsToTree(items), [items]);
  const expandedIds = useMemo(() => collectExpandableIds(treeItems), [treeItems]);

  const handleItemClick = useCallback(
    (_event: React.SyntheticEvent, itemId: string) => {
      const el = document.getElementById(itemId);
      if (el) {
        clickLockRef.current = true;
        setActiveId(itemId);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { clickLockRef.current = false; }, 850);
      }
    },
    [],
  );

  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLockRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-64px 0px -60% 0px', threshold: 0.1 },
    );

    observerRef.current = observer;

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <RichTreeView
      items={treeItems}
      selectedItems={activeId}
      defaultExpandedItems={expandedIds}
      onItemClick={handleItemClick}
      expansionTrigger="iconContainer"
      slots={{
        item: StyledTreeItem,
        expandIcon: ExpandIcon,
        collapseIcon: CollapseIcon,
      }}
      sx={{ px: 0.5 }}
    />
  );
}

export function TocDots({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const clickLockRef = useRef(false);

  const topLevel = useMemo(() => items.filter((i) => i.level <= 2), [items]);

  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    let currentParent = '';
    items.forEach((item) => {
      if (item.level <= 2) {
        currentParent = item.id;
      }
      if (currentParent) map.set(item.id, currentParent);
    });
    return map;
  }, [items]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      clickLockRef.current = true;
      setActiveId(id);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { clickLockRef.current = false; }, 850);
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLockRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-64px 0px -60% 0px', threshold: 0.1 },
    );

    observerRef.current = observer;

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const activeDotId = parentMap.get(activeId) ?? '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {topLevel.map((item) => {
        const isActive = activeDotId === item.id;
        return (
          <Tooltip key={item.id} title={item.label} placement="right" arrow>
            <Box
              onClick={() => handleClick(item.id)}
              sx={(theme) => ({
                width: 10,
                height: 10,
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: isActive
                  ? theme.heroui.primary[400]
                  : theme.heroui.default[300],
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: isActive
                    ? theme.heroui.primary[500]
                    : theme.heroui.default[400],
                  transform: 'scale(1.3)',
                },
              })}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}

import type { LocalizedString } from './locale';
import { resolveLocale } from './locale';
import type { ReportBlock } from '../types/report';

export interface SearchItem {
  id: string;
  label: LocalizedString;
  type: 'heading' | 'chart' | 'table' | 'text' | 'metric' | 'callout';
  section?: LocalizedString;
}

export function extractSearchItems(blocks: ReportBlock[]): SearchItem[] {
  const items: SearchItem[] = [];
  let currentSection: LocalizedString = '';

  function walk(block: ReportBlock, index: number) {
    const id = `block-${index}`;

    switch (block.type) {
      case 'heading': {
        if (block.level <= 2) currentSection = block.content;
        items.push({ id, label: block.content, type: 'heading', section: currentSection });
        if (block.subtitle) {
          items.push({ id, label: block.subtitle, type: 'heading', section: currentSection });
        }
        break;
      }
      case 'markdown': {
        const raw = resolveLocale(block.content, 'ru');
        const preview = raw
          .replace(/[#*_`>[\]()!|\\-]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 120);
        if (preview) {
          items.push({ id, label: block.content, type: 'text', section: currentSection });
        }
        break;
      }
      case 'chart': {
        if (block.title) {
          items.push({ id, label: block.title, type: 'chart', section: currentSection });
        }
        break;
      }
      case 'table': {
        if (block.title) {
          items.push({ id, label: block.title, type: 'table', section: currentSection });
        }
        break;
      }
      case 'callout': {
        if (block.title) {
          items.push({ id, label: block.title, type: 'callout', section: currentSection });
        }
        if (block.content) {
          items.push({ id, label: block.content, type: 'callout', section: currentSection });
        }
        break;
      }
      case 'metrics': {
        for (const m of block.items) {
          items.push({
            id,
            label: m.label,
            type: 'metric',
            section: currentSection,
          });
        }
        break;
      }
      case 'grid': {
        for (const child of block.blocks) {
          walk(child, index);
        }
        break;
      }
      default:
        break;
    }
  }

  blocks.forEach((block, i) => walk(block, i));
  return items;
}

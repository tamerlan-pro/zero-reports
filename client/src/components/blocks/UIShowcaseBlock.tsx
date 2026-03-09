import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BlockContainer } from './shared/BlockContainer';
import type { UIShowcaseBlock as UIShowcaseBlockType } from '../../types/report';
import { resolveLocale } from '../../utils/locale';

import { ButtonsSection } from './uishowcase/ButtonsSection';
import { InputsSection } from './uishowcase/InputsSection';
import { SelectionSection } from './uishowcase/SelectionSection';
import { ChipsSection } from './uishowcase/ChipsSection';
import { ProgressSection } from './uishowcase/ProgressSection';
import { NavigationSection } from './uishowcase/NavigationSection';
import { AvatarsSection } from './uishowcase/AvatarsSection';
import { AccordionSection } from './uishowcase/AccordionSection';
import { DatePickersSection } from './uishowcase/DatePickersSection';
import { TreeViewSection } from './uishowcase/TreeViewSection';
import { AlertsSection } from './uishowcase/AlertsSection';

interface Props {
  block: UIShowcaseBlockType;
}

const ALL_SECTIONS = [
  'buttons',
  'inputs',
  'selection',
  'chips',
  'progress',
  'navigation',
  'avatars',
  'accordion',
  'datePickers',
  'treeView',
  'alerts',
] as const;

type SectionKey = typeof ALL_SECTIONS[number];

const SECTION_MAP: Record<SectionKey, () => React.JSX.Element> = {
  buttons: ButtonsSection,
  inputs: InputsSection,
  selection: SelectionSection,
  chips: ChipsSection,
  progress: ProgressSection,
  navigation: NavigationSection,
  avatars: AvatarsSection,
  accordion: AccordionSection,
  datePickers: DatePickersSection,
  treeView: TreeViewSection,
  alerts: AlertsSection,
};

export function UIShowcaseBlock({ block }: Props) {
  const { i18n } = useTranslation();
  const sections = (block.sections?.length ? block.sections : ALL_SECTIONS) as SectionKey[];

  return (
    <BlockContainer>
      {block.title && (
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          {resolveLocale(block.title, i18n.language)}
        </Typography>
      )}
      {sections.map((key) => {
        const Section = SECTION_MAP[key];
        return Section ? <Section key={key} /> : null;
      })}
    </BlockContainer>
  );
}

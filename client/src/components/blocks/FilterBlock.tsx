import { memo, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { useTranslation } from 'react-i18next';
import { resolveLocale } from '../../utils/locale';
import type { FilterBlock as FilterBlockType } from '../../types/report';
import { useReportFilters } from '../../context/ReportFilterContext';

interface Props {
  block: FilterBlockType;
}

export const FilterBlock = memo(function FilterBlock({ block }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { setFilter, getFilter } = useReportFilters();

  const currentValue = getFilter(block.filterId);

  useEffect(() => {
    if (block.defaultValue !== undefined && currentValue === null) {
      setFilter(block.filterId, block.defaultValue);
    }
  }, [block.filterId, block.defaultValue, currentValue, setFilter]);

  const label = resolveLocale(block.label, lang);

  if (block.filterType === 'search') {
    return (
      <Box sx={{ minWidth: 240 }}>
        <TextField
          label={label}
          value={typeof currentValue === 'string' ? currentValue : ''}
          onChange={(e) => setFilter(block.filterId, e.target.value || null)}
          size="small"
          fullWidth
        />
      </Box>
    );
  }

  if (block.filterType === 'dateRange') {
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <DatePicker
          label={`${label} (от)`}
          slotProps={{ textField: { size: 'small' } }}
          onChange={() => {
            // Date range filtering handled via targetBlockIds
          }}
        />
        <DatePicker
          label={`${label} (до)`}
          slotProps={{ textField: { size: 'small' } }}
          onChange={() => {
            // Date range filtering handled via targetBlockIds
          }}
        />
      </Box>
    );
  }

  if (block.filterType === 'multiselect') {
    const selected = Array.isArray(currentValue) ? currentValue : [];
    return (
      <Box sx={{ minWidth: 240 }}>
        <FormControl size="small" fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            multiple
            value={selected}
            onChange={(e) => {
              const val = e.target.value;
              setFilter(block.filterId, Array.isArray(val) ? val : [val]);
            }}
            input={<OutlinedInput label={label} />}
            renderValue={(selected: string[]) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((v) => {
                  const opt = block.options?.find((o) => o.value === v);
                  const optLabel = opt ? resolveLocale(opt.label, lang) : v;
                  return <Chip key={v} label={optLabel} size="small" />;
                })}
              </Box>
            )}
          >
            {block.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {resolveLocale(opt.label, lang)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  // Default: select
  const selectedVal = typeof currentValue === 'string' ? currentValue : '';
  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl size="small" fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={selectedVal}
          label={label}
          onChange={(e) => setFilter(block.filterId, e.target.value || null)}
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          {block.options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {resolveLocale(opt.label, lang)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
});

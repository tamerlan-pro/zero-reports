import { Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { SectionTitle, SubTitle } from './shared';

export function DatePickersSection() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SectionTitle>Date & Time Pickers (MUI X Pro)</SectionTitle>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <DatePicker label="Date" defaultValue={dayjs()} slotProps={{ textField: { size: 'small' } }} />
        <TimePicker label="Time" defaultValue={dayjs()} slotProps={{ textField: { size: 'small' } }} />
        <DateTimePicker label="Date & Time" defaultValue={dayjs()} slotProps={{ textField: { size: 'small' } }} />
      </Stack>

      <SubTitle>Date Range</SubTitle>
      <DateRangePicker
        defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
        slotProps={{ textField: { size: 'small' } }}
        localeText={{ start: 'Start date', end: 'End date' }}
      />

      <SubTitle>States</SubTitle>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2, mt: 2 }}>
        <DatePicker label="Disabled" disabled slotProps={{ textField: { size: 'small' } }} />
        <DatePicker label="Read Only" readOnly defaultValue={dayjs()} slotProps={{ textField: { size: 'small' } }} />
      </Stack>
    </LocalizationProvider>
  );
}

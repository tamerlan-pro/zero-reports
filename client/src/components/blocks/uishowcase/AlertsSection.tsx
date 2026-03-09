import { Stack, Alert, AlertTitle, Button } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { SectionTitle, SubTitle } from './shared';

type AlertEntry = {
  label: string;
  severity: AlertColor;
  color?: AlertColor | 'default' | 'secondary';
};

const ALERT_CONFIGS: AlertEntry[] = [
  { label: 'Default', severity: 'info', color: 'default' },
  { label: 'Primary', severity: 'info' },
  { label: 'Secondary', severity: 'info', color: 'secondary' },
  { label: 'Success', severity: 'success' },
  { label: 'Warning', severity: 'warning' },
  { label: 'Danger', severity: 'error' },
];

export function AlertsSection() {
  return (
    <>
      <SectionTitle>Alerts & Feedback</SectionTitle>

      <SubTitle>Standard (flat)</SubTitle>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {ALERT_CONFIGS.map((a) => (
          <Alert key={a.label} severity={a.severity} color={a.color}>
            <AlertTitle>{a.label}</AlertTitle>
            This is a {a.label.toLowerCase()} alert — check it out!
          </Alert>
        ))}
      </Stack>

      <SubTitle>Outlined</SubTitle>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {ALERT_CONFIGS.map((a) => (
          <Alert key={a.label} severity={a.severity} color={a.color} variant="outlined">
            <AlertTitle>{a.label}</AlertTitle>
            This is an outlined {a.label.toLowerCase()} alert.
          </Alert>
        ))}
      </Stack>

      <SubTitle>Filled</SubTitle>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {ALERT_CONFIGS.map((a) => (
          <Alert key={a.label} severity={a.severity} color={a.color} variant="filled">
            <AlertTitle>{a.label}</AlertTitle>
            This is a filled {a.label.toLowerCase()} alert.
          </Alert>
        ))}
      </Stack>

      <SubTitle>With Actions</SubTitle>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Alert severity="info" onClose={() => {}}>
          Document saved to draft.
        </Alert>
        <Alert severity="success" action={<Button color="inherit" size="small">UNDO</Button>}>
          Changes have been applied successfully.
        </Alert>
      </Stack>
    </>
  );
}

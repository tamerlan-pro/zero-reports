import { Stack, LinearProgress, CircularProgress, Skeleton } from '@mui/material';
import { SectionTitle, SubTitle } from './shared';

const LINEAR_VALUES: Record<string, number> = {
  primary: 72, secondary: 45, success: 88, error: 31,
};
const CIRCULAR_VALUES: Record<string, number> = {
  primary: 65, secondary: 48, success: 82, error: 37, info: 55,
};

export function ProgressSection() {
  return (
    <>
      <SectionTitle>Progress</SectionTitle>

      <SubTitle>Linear — Determinate</SubTitle>
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {(['primary', 'secondary', 'success', 'error'] as const).map((c) => (
          <LinearProgress key={c} variant="determinate" value={LINEAR_VALUES[c]} color={c} />
        ))}
      </Stack>

      <SubTitle>Linear — Indeterminate & Buffer</SubTitle>
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <LinearProgress />
        <LinearProgress variant="buffer" value={55} valueBuffer={75} color="secondary" />
      </Stack>

      <SubTitle>Circular</SubTitle>
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
        {(['primary', 'secondary', 'success', 'error', 'info'] as const).map((c) => (
          <CircularProgress key={c} color={c} variant="determinate" value={CIRCULAR_VALUES[c]} />
        ))}
        <CircularProgress color="warning" />
      </Stack>

      <SubTitle>Skeleton</SubTitle>
      <Stack spacing={1} sx={{ maxWidth: 400, mb: 2 }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rounded" height={60} />
      </Stack>
    </>
  );
}

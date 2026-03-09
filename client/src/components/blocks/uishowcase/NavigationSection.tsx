import { useState } from 'react';
import { Stack, Box, Tabs, Tab, Breadcrumbs, Link, Typography, Pagination, Stepper, Step, StepLabel } from '@mui/material';
import { Icon } from '@iconify/react';
import { SectionTitle, SubTitle } from './shared';

export function NavigationSection() {
  const [tabVal, setTabVal] = useState(0);

  return (
    <>
      <SectionTitle>Navigation</SectionTitle>

      <SubTitle>Tabs</SubTitle>
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)}>
          <Tab label="Dashboard" icon={<Icon icon="solar:chart-2-bold-duotone" width={20} />} iconPosition="start" />
          <Tab label="Analytics" icon={<Icon icon="solar:graph-bold-duotone" width={20} />} iconPosition="start" />
          <Tab label="Settings" icon={<Icon icon="solar:settings-bold-duotone" width={20} />} iconPosition="start" />
          <Tab label="Disabled" disabled />
        </Tabs>
      </Box>

      <SubTitle>Breadcrumbs</SubTitle>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="#">Home</Link>
        <Link underline="hover" color="inherit" href="#">Reports</Link>
        <Typography color="text.primary">Current</Typography>
      </Breadcrumbs>

      <SubTitle>Pagination</SubTitle>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Pagination count={10} color="primary" />
        <Pagination count={10} variant="outlined" color="secondary" />
      </Stack>

      <SubTitle>Stepper</SubTitle>
      <Stepper activeStep={1} sx={{ mb: 2 }}>
        <Step completed><StepLabel>Data Source</StepLabel></Step>
        <Step><StepLabel>Configuration</StepLabel></Step>
        <Step><StepLabel>Review</StepLabel></Step>
        <Step><StepLabel>Publish</StepLabel></Step>
      </Stepper>
    </>
  );
}

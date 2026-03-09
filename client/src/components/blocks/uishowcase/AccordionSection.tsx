import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { SectionTitle } from './shared';

export function AccordionSection() {
  return (
    <>
      <SectionTitle>Accordion</SectionTitle>
      <Box sx={{ mb: 2 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />}>
            <Typography fontWeight={600}>Getting Started</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Configure your data sources and connect to your preferred database to begin generating reports.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />}>
            <Typography fontWeight={600}>Customization</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Adjust themes, colors, and layouts to match your brand identity across all report outputs.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion disabled>
          <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />}>
            <Typography fontWeight={600}>Advanced (Disabled)</Typography>
          </AccordionSummary>
        </Accordion>
      </Box>
    </>
  );
}

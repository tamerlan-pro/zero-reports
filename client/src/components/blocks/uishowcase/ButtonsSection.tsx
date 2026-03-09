import { useState } from 'react';
import { Stack, Button, IconButton, ButtonGroup, ToggleButton, ToggleButtonGroup, Fab, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { SectionTitle, SubTitle, COLORS } from './shared';

export function ButtonsSection() {
  const [toggleVal, setToggleVal] = useState('center');

  return (
    <>
      <SectionTitle>Buttons</SectionTitle>

      <SubTitle>Contained</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Button key={c} variant="contained" color={c}>{c}</Button>
        ))}
        <Button variant="contained" disabled>Disabled</Button>
      </Stack>

      <SubTitle>Outlined</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Button key={c} variant="outlined" color={c}>{c}</Button>
        ))}
      </Stack>

      <SubTitle>Text</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Button key={c} variant="text" color={c}>{c}</Button>
        ))}
      </Stack>

      <SubTitle>Sizes</SubTitle>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Button variant="contained" size="small">Small</Button>
        <Button variant="contained" size="medium">Medium</Button>
        <Button variant="contained" size="large">Large</Button>
      </Stack>

      <SubTitle>Icon Buttons</SubTitle>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <IconButton key={c} color={c} aria-label={c}>
            <Icon icon="solar:star-bold-duotone" />
          </IconButton>
        ))}
        <IconButton disabled aria-label="disabled">
          <Icon icon="solar:star-bold-duotone" />
        </IconButton>
      </Stack>

      <SubTitle>Button Group</SubTitle>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <ButtonGroup variant="contained">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup variant="outlined">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Stack>

      <SubTitle>Toggle Buttons</SubTitle>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={toggleVal}
          exclusive
          onChange={(_, v) => v && setToggleVal(v)}
          size="small"
        >
          <ToggleButton value="left">
            <Icon icon="solar:align-left-bold-duotone" width={20} />
          </ToggleButton>
          <ToggleButton value="center">
            <Icon icon="solar:align-horizontal-center-bold-duotone" width={20} />
          </ToggleButton>
          <ToggleButton value="right">
            <Icon icon="solar:align-right-bold-duotone" width={20} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <SubTitle>FAB</SubTitle>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {(['primary', 'secondary', 'success', 'error'] as const).map((c) => (
          <Fab key={c} color={c} size="small" aria-label={c}>
            <Icon icon="solar:add-circle-bold-duotone" width={24} />
          </Fab>
        ))}
        <Fab variant="extended" color="primary" size="medium" aria-label="navigate">
          <Box component="span" sx={{ mr: 1, display: 'flex' }}>
            <Icon icon="solar:navigation-bold-duotone" width={20} />
          </Box>
          Navigate
        </Fab>
      </Stack>
    </>
  );
}

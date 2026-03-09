import { Stack, Chip, Avatar } from '@mui/material';
import { Icon } from '@iconify/react';
import { SectionTitle, SubTitle, COLORS } from './shared';

export function ChipsSection() {
  return (
    <>
      <SectionTitle>Chips</SectionTitle>

      <SubTitle>Filled</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => <Chip key={c} label={c} color={c} />)}
        <Chip label="Deletable" color="primary" onDelete={() => {}} />
        <Chip label="Clickable" color="secondary" onClick={() => {}} />
        <Chip label="Disabled" disabled />
      </Stack>

      <SubTitle>Outlined</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => <Chip key={c} label={c} variant="outlined" color={c} />)}
      </Stack>

      <SubTitle>With Avatar / Icon</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Chip avatar={<Avatar>M</Avatar>} label="Avatar Chip" />
        <Chip icon={<Icon icon="solar:star-bold-duotone" />} label="Icon Chip" color="primary" />
        <Chip
          avatar={<Avatar src="https://i.pravatar.cc/40?img=3" />}
          label="Photo Chip"
          variant="outlined"
          onDelete={() => {}}
        />
      </Stack>

      <SubTitle>Sizes</SubTitle>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Chip label="Small" size="small" color="primary" />
        <Chip label="Medium" size="medium" color="primary" />
      </Stack>
    </>
  );
}

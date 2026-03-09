import { useState } from 'react';
import {
  Stack, Box, Checkbox, FormControlLabel, FormGroup,
  Radio, RadioGroup, Switch, Rating, Slider,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { SectionTitle, SubTitle, SwitchThumbIcon, COLORS } from './shared';

export function SelectionSection() {
  const [rating, setRating] = useState<number | null>(3);
  const [slider, setSlider] = useState<number>(40);

  return (
    <>
      <SectionTitle>Selection Controls</SectionTitle>

      <SubTitle>Checkboxes</SubTitle>
      <FormGroup row sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <FormControlLabel key={c} control={<Checkbox color={c} defaultChecked />} label={c} />
        ))}
        <FormControlLabel control={<Checkbox disabled />} label="Disabled" />
        <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
      </FormGroup>

      <SubTitle>Radio Buttons</SubTitle>
      <RadioGroup row defaultValue="primary" sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <FormControlLabel key={c} value={c} control={<Radio color={c} />} label={c} />
        ))}
      </RadioGroup>

      <SubTitle>Switches</SubTitle>
      <FormGroup row sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <FormControlLabel key={c} control={<Switch color={c} defaultChecked />} label={c} />
        ))}
        <FormControlLabel control={<Switch disabled />} label="Disabled" />
      </FormGroup>

      <SubTitle>Switches with Icons</SubTitle>
      <FormGroup row sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <FormControlLabel
            key={c}
            control={
              <Switch
                color={c}
                defaultChecked
                checkedIcon={<SwitchThumbIcon icon="solar:sun-bold-duotone" />}
                icon={<SwitchThumbIcon icon="solar:moon-bold-duotone" />}
              />
            }
            label={c}
          />
        ))}
      </FormGroup>

      <SubTitle>Rating</SubTitle>
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
        <Rating value={4} readOnly />
        <Rating value={2} disabled />
        <Rating
          value={3}
          icon={
            <Box component="span" sx={(t) => ({ color: t.heroui.danger[400], display: 'flex' })}>
              <Icon icon="solar:heart-bold" width={24} />
            </Box>
          }
          emptyIcon={<Icon icon="solar:heart-linear" width={24} />}
        />
      </Stack>

      <SubTitle>Slider</SubTitle>
      <Box sx={{ maxWidth: 400, mb: 2 }}>
        <Slider value={slider} onChange={(_, v) => setSlider(v as number)} valueLabelDisplay="auto" />
        <Slider defaultValue={[20, 60]} valueLabelDisplay="auto" color="secondary" />
        <Slider defaultValue={50} disabled />
        <Slider defaultValue={30} step={10} marks min={0} max={100} color="success" />
      </Box>
    </>
  );
}

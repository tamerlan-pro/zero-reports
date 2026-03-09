import { Stack, TextField, Select, MenuItem, InputLabel, FormControl, Autocomplete, InputAdornment } from '@mui/material';
import { Icon } from '@iconify/react';
import { SectionTitle, SubTitle } from './shared';

export function InputsSection() {
  return (
    <>
      <SectionTitle>Text Fields & Inputs</SectionTitle>

      <SubTitle>Variants</SubTitle>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <TextField label="Outlined" variant="outlined" size="small" />
        <TextField label="Filled" variant="filled" size="small" />
        <TextField label="Standard" variant="standard" size="small" />
      </Stack>

      <SubTitle>States</SubTitle>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <TextField label="Default" size="small" />
        <TextField label="Error" error helperText="Something went wrong" size="small" />
        <TextField label="Disabled" disabled size="small" />
        <TextField label="Read Only" size="small" slotProps={{ input: { readOnly: true } }} defaultValue="Read only" />
      </Stack>

      <SubTitle>With Adornments</SubTitle>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <TextField
          label="Search"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="solar:magnifer-bold-duotone" width={20} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Amount"
          size="small"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">.00</InputAdornment>,
            },
          }}
        />
      </Stack>

      <SubTitle>Multiline</SubTitle>
      <TextField
        label="Description"
        multiline
        rows={3}
        fullWidth
        defaultValue="This is a multiline text field for longer content..."
        sx={{ mb: 2 }}
      />

      <SubTitle>Select</SubTitle>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select label="Category" defaultValue="tech">
            <MenuItem value="tech">Technology</MenuItem>
            <MenuItem value="design">Design</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Disabled</InputLabel>
          <Select label="Disabled" disabled defaultValue="">
            <MenuItem value="">None</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <SubTitle>Autocomplete</SubTitle>
      <Autocomplete
        size="small"
        options={['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Preact']}
        renderInput={(params) => <TextField {...params} label="Framework" />}
        sx={{ maxWidth: 300, mb: 2 }}
      />
    </>
  );
}

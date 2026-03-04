import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Switch,
  Rating,
  Slider,
  Chip,
  Avatar,
  AvatarGroup,
  Badge,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Pagination,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  Skeleton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import dayjs from 'dayjs';
import type { UIShowcaseBlock as UIShowcaseBlockType } from '../../types/report';

interface Props {
  block: UIShowcaseBlockType;
}

const ALL_SECTIONS = [
  'buttons',
  'inputs',
  'selection',
  'chips',
  'progress',
  'navigation',
  'avatars',
  'accordion',
  'datePickers',
  'treeView',
  'alerts',
] as const;

const COLORS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
      {children}
    </Typography>
  );
}

function SubTitle({ children }: { children: string }) {
  return (
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
      {children}
    </Typography>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */
function ButtonsSection() {
  const [toggleVal, setToggleVal] = useState('center');

  return (
    <>
      <SectionTitle>Buttons</SectionTitle>

      <SubTitle>Contained</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Button key={c} variant="contained" color={c}>
            {c}
          </Button>
        ))}
        <Button variant="contained" disabled>
          Disabled
        </Button>
      </Stack>

      <SubTitle>Outlined</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Button key={c} variant="outlined" color={c}>
            {c}
          </Button>
        ))}
      </Stack>

      <SubTitle>Text</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Button key={c} variant="text" color={c}>
            {c}
          </Button>
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
          <IconButton key={c} color={c}>
            <Icon icon="solar:star-bold-duotone" />
          </IconButton>
        ))}
        <IconButton disabled>
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
          <Fab key={c} color={c} size="small">
            <Icon icon="solar:add-circle-bold-duotone" width={24} />
          </Fab>
        ))}
        <Fab variant="extended" color="primary" size="medium">
          <Icon icon="solar:navigation-bold-duotone" width={20} style={{ marginRight: 8 }} />
          Navigate
        </Fab>
      </Stack>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Inputs                                                             */
/* ------------------------------------------------------------------ */
function InputsSection() {
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

/* ------------------------------------------------------------------ */
/*  Selection Controls                                                 */
/* ------------------------------------------------------------------ */
function SelectionSection() {
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

      <SubTitle>Rating</SubTitle>
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
        <Rating value={4} readOnly />
        <Rating value={2} disabled />
        <Rating
          value={3}
          icon={<Icon icon="solar:heart-bold" width={24} style={{ color: '#F31260' }} />}
          emptyIcon={<Icon icon="solar:heart-linear" width={24} />}
        />
      </Stack>

      <SubTitle>Slider</SubTitle>
      <Box sx={{ maxWidth: 400, mb: 2 }}>
        <Slider value={slider} onChange={(_, v) => setSlider(v as number)} valueLabelDisplay="auto" />
        <Slider defaultValue={[20, 60]} valueLabelDisplay="auto" color="secondary" />
        <Slider defaultValue={50} disabled />
        <Slider
          defaultValue={30}
          step={10}
          marks
          min={0}
          max={100}
          color="success"
        />
      </Box>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Chips                                                              */
/* ------------------------------------------------------------------ */
function ChipsSection() {
  return (
    <>
      <SectionTitle>Chips</SectionTitle>

      <SubTitle>Filled</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Chip key={c} label={c} color={c} />
        ))}
        <Chip label="Deletable" color="primary" onDelete={() => {}} />
        <Chip label="Clickable" color="secondary" onClick={() => {}} />
        <Chip label="Disabled" disabled />
      </Stack>

      <SubTitle>Outlined</SubTitle>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {COLORS.map((c) => (
          <Chip key={c} label={c} variant="outlined" color={c} />
        ))}
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

/* ------------------------------------------------------------------ */
/*  Progress                                                           */
/* ------------------------------------------------------------------ */
function ProgressSection() {
  return (
    <>
      <SectionTitle>Progress</SectionTitle>

      <SubTitle>Linear — Determinate</SubTitle>
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {(['primary', 'secondary', 'success', 'error'] as const).map((c) => (
          <LinearProgress key={c} variant="determinate" value={Math.random() * 60 + 30} color={c} />
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
          <CircularProgress key={c} color={c} variant="determinate" value={Math.random() * 60 + 30} />
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

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
function NavigationSection() {
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

/* ------------------------------------------------------------------ */
/*  Avatars & Badges                                                   */
/* ------------------------------------------------------------------ */
function AvatarsSection() {
  return (
    <>
      <SectionTitle>Avatars & Badges</SectionTitle>

      <SubTitle>Avatars</SubTitle>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar>A</Avatar>
        <Avatar sx={{ bgcolor: 'primary.main' }}>B</Avatar>
        <Avatar sx={{ bgcolor: 'success.main' }}>C</Avatar>
        <Avatar src="https://i.pravatar.cc/40?img=5" />
        <Avatar src="https://i.pravatar.cc/40?img=12" />
        <Avatar variant="rounded" sx={{ bgcolor: 'warning.main' }}>
          <Icon icon="solar:user-bold-duotone" width={24} />
        </Avatar>
        <Avatar variant="square" sx={{ bgcolor: 'error.main' }}>
          <Icon icon="solar:shield-keyhole-bold-duotone" width={24} />
        </Avatar>
      </Stack>

      <SubTitle>Avatar Group</SubTitle>
      <AvatarGroup max={5} sx={{ mb: 2, justifyContent: 'flex-start' }}>
        <Avatar src="https://i.pravatar.cc/40?img=1" />
        <Avatar src="https://i.pravatar.cc/40?img=2" />
        <Avatar src="https://i.pravatar.cc/40?img=3" />
        <Avatar src="https://i.pravatar.cc/40?img=4" />
        <Avatar src="https://i.pravatar.cc/40?img=5" />
        <Avatar src="https://i.pravatar.cc/40?img=6" />
        <Avatar src="https://i.pravatar.cc/40?img=7" />
      </AvatarGroup>

      <SubTitle>Badges</SubTitle>
      <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
        <Badge badgeContent={4} color="primary">
          <Icon icon="solar:letter-bold-duotone" width={28} />
        </Badge>
        <Badge badgeContent={99} color="error">
          <Icon icon="solar:bell-bold-duotone" width={28} />
        </Badge>
        <Badge variant="dot" color="success">
          <Icon icon="solar:user-bold-duotone" width={28} />
        </Badge>
        <Badge badgeContent={0} showZero color="warning">
          <Icon icon="solar:cart-large-2-bold-duotone" width={28} />
        </Badge>
      </Stack>

      <SubTitle>Tooltips</SubTitle>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Tooltip title="Top tooltip" placement="top"><Button variant="outlined" size="small">Top</Button></Tooltip>
        <Tooltip title="Right tooltip" placement="right"><Button variant="outlined" size="small">Right</Button></Tooltip>
        <Tooltip title="Arrow tooltip" arrow><Button variant="outlined" size="small">Arrow</Button></Tooltip>
      </Stack>

      <SubTitle>List</SubTitle>
      <Paper variant="outlined" sx={{ maxWidth: 360, mb: 2 }}>
        <List dense>
          <ListItem>
            <ListItemAvatar><Avatar src="https://i.pravatar.cc/40?img=8" /></ListItemAvatar>
            <ListItemText primary="Alice Johnson" secondary="alice@example.com" />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemAvatar><Avatar src="https://i.pravatar.cc/40?img=9" /></ListItemAvatar>
            <ListItemText primary="Bob Smith" secondary="bob@example.com" />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon><Icon icon="solar:folder-bold-duotone" width={24} /></ListItemIcon>
            <ListItemText primary="Documents" secondary="48 files" />
          </ListItem>
        </List>
      </Paper>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Accordion                                                          */
/* ------------------------------------------------------------------ */
function AccordionSection() {
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

/* ------------------------------------------------------------------ */
/*  Date / Time Pickers (MUI X Pro)                                    */
/* ------------------------------------------------------------------ */
function DatePickersSection() {
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

/* ------------------------------------------------------------------ */
/*  Tree View (MUI X)                                                  */
/* ------------------------------------------------------------------ */
function TreeViewSection() {
  return (
    <>
      <SectionTitle>Tree View (MUI X)</SectionTitle>
      <Paper variant="outlined" sx={{ maxWidth: 360, p: 1, mb: 2 }}>
        <SimpleTreeView defaultExpandedItems={['1', '1.1']}>
          <TreeItem itemId="1" label="Reports">
            <TreeItem itemId="1.1" label="Q4 2025">
              <TreeItem itemId="1.1.1" label="Revenue Report" />
              <TreeItem itemId="1.1.2" label="Cost Analysis" />
              <TreeItem itemId="1.1.3" label="Profit Summary" />
            </TreeItem>
            <TreeItem itemId="1.2" label="Q1 2026">
              <TreeItem itemId="1.2.1" label="Revenue Report" />
              <TreeItem itemId="1.2.2" label="Forecast" />
            </TreeItem>
          </TreeItem>
          <TreeItem itemId="2" label="Settings">
            <TreeItem itemId="2.1" label="Theme" />
            <TreeItem itemId="2.2" label="Data Sources" />
          </TreeItem>
          <TreeItem itemId="3" label="Archive" disabled />
        </SimpleTreeView>
      </Paper>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Alerts / Feedback                                                  */
/* ------------------------------------------------------------------ */
function AlertsSection() {
  const alertColors: {
    label: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    color?: string;
  }[] = [
    { label: 'Default', severity: 'info', color: 'default' },
    { label: 'Primary', severity: 'info' },
    { label: 'Secondary', severity: 'info', color: 'secondary' },
    { label: 'Success', severity: 'success' },
    { label: 'Warning', severity: 'warning' },
    { label: 'Danger', severity: 'error' },
  ];

  return (
    <>
      <SectionTitle>Alerts & Feedback</SectionTitle>

      <SubTitle>Standard (flat)</SubTitle>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {alertColors.map((a) => (
          <Alert key={a.label} severity={a.severity} color={a.color as any}>
            <AlertTitle>{a.label}</AlertTitle>
            This is a {a.label.toLowerCase()} alert — check it out!
          </Alert>
        ))}
      </Stack>

      <SubTitle>Outlined</SubTitle>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {alertColors.map((a) => (
          <Alert key={a.label} severity={a.severity} color={a.color as any} variant="outlined">
            <AlertTitle>{a.label}</AlertTitle>
            This is an outlined {a.label.toLowerCase()} alert.
          </Alert>
        ))}
      </Stack>

      <SubTitle>Filled</SubTitle>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {alertColors.map((a) => (
          <Alert key={a.label} severity={a.severity} color={a.color as any} variant="filled">
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
        <Alert
          severity="success"
          action={<Button color="inherit" size="small">UNDO</Button>}
        >
          Changes have been applied successfully.
        </Alert>
      </Stack>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
const SECTION_MAP: Record<string, () => JSX.Element> = {
  buttons: ButtonsSection,
  inputs: InputsSection,
  selection: SelectionSection,
  chips: ChipsSection,
  progress: ProgressSection,
  navigation: NavigationSection,
  avatars: AvatarsSection,
  accordion: AccordionSection,
  datePickers: DatePickersSection,
  treeView: TreeViewSection,
  alerts: AlertsSection,
};

export function UIShowcaseBlock({ block }: Props) {
  const sections = block.sections?.length ? block.sections : ALL_SECTIONS;

  return (
    <Paper sx={{ p: 3, overflow: 'hidden' }}>
      {block.title && (
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          {block.title}
        </Typography>
      )}
      {sections.map((key) => {
        const Section = SECTION_MAP[key];
        return Section ? <Section key={key} /> : null;
      })}
    </Paper>
  );
}

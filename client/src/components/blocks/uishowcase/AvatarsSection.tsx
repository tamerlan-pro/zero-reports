import {
  Stack, Avatar, AvatarGroup, Badge, Tooltip, Button, Paper,
  List, ListItem, ListItemAvatar, ListItemText, ListItemIcon, Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { SectionTitle, SubTitle } from './shared';

export function AvatarsSection() {
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
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Avatar key={i} src={`https://i.pravatar.cc/40?img=${i}`} />
        ))}
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
        <Tooltip title="Top tooltip" placement="top">
          <Button variant="outlined" size="small">Top</Button>
        </Tooltip>
        <Tooltip title="Right tooltip" placement="right">
          <Button variant="outlined" size="small">Right</Button>
        </Tooltip>
        <Tooltip title="Arrow tooltip" arrow>
          <Button variant="outlined" size="small">Arrow</Button>
        </Tooltip>
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

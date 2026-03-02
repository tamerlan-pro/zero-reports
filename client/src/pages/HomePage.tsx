import { Box, Typography, Paper, Grid } from '@mui/material';
import { Person, MusicNote, Album, TrendingUp } from '@mui/icons-material';

const stats = [
  { label: 'Артисты', value: 24, icon: <Person fontSize="large" />, color: '#1976d2' },
  { label: 'Треки', value: 156, icon: <MusicNote fontSize="large" />, color: '#2e7d32' },
  { label: 'Релизы', value: 42, icon: <Album fontSize="large" />, color: '#ed6c02' },
  { label: 'Прослушивания', value: '1.2M', icon: <TrendingUp fontSize="large" />, color: '#9c27b0' },
];

export const HomePage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в ZeroApp
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Мульти-лейбловая ERP-система для управления музыкальными активами
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderTop: `4px solid ${stat.color}`,
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h4" component="div">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;

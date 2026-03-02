import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle, FiberNew, Archive } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

// Тестовые данные артистов
const mockArtists = [
  { id: 1, name: 'Артист Один', genre: 'Pop', tracks: 12, streams: 450000, status: 'Активен' },
  { id: 2, name: 'Группа Два', genre: 'Rock', tracks: 28, streams: 1200000, status: 'Активен' },
  { id: 3, name: 'DJ Три', genre: 'Electronic', tracks: 45, streams: 890000, status: 'Активен' },
  { id: 4, name: 'Исполнитель Четыре', genre: 'Hip-Hop', tracks: 8, streams: 230000, status: 'Новый' },
  { id: 5, name: 'Певица Пять', genre: 'R&B', tracks: 15, streams: 670000, status: 'Активен' },
  { id: 6, name: 'Бэнд Шесть', genre: 'Jazz', tracks: 22, streams: 180000, status: 'Архив' },
  { id: 7, name: 'Рэпер Семь', genre: 'Hip-Hop', tracks: 35, streams: 2100000, status: 'Активен' },
  { id: 8, name: 'Дуэт Восемь', genre: 'Pop', tracks: 10, streams: 340000, status: 'Новый' },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Активен':
      return {
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        color: 'success' as const,
        variant: 'filled' as const,
      };
    case 'Новый':
      return {
        icon: <FiberNew sx={{ fontSize: 16 }} />,
        color: 'info' as const,
        variant: 'filled' as const,
      };
    case 'Архив':
      return {
        icon: <Archive sx={{ fontSize: 16 }} />,
        color: 'default' as const,
        variant: 'outlined' as const,
      };
    default:
      return {
        icon: undefined,
        color: 'default' as const,
        variant: 'outlined' as const,
      };
  }
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Имя артиста', width: 200 },
  { field: 'genre', headerName: 'Жанр', width: 130 },
  { field: 'tracks', headerName: 'Треков', width: 100, type: 'number' },
  {
    field: 'streams',
    headerName: 'Прослушивания',
    width: 150,
    type: 'number',
    valueFormatter: (value: number) => value.toLocaleString('ru-RU'),
  },
  {
    field: 'status',
    headerName: 'Статус',
    width: 140,
    renderCell: (params) => {
      const config = getStatusConfig(params.value);
      return (
        <Chip
          icon={config.icon}
          label={params.value}
          color={config.color}
          variant={config.variant}
          size="small"
          sx={{
            fontWeight: 500,
            borderRadius: '8px',
            '& .MuiChip-icon': {
              marginLeft: '8px',
            },
          }}
        />
      );
    },
  },
];

export const ArtistsPage = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Артисты
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Каталог артистов лейбла (тестовые данные)
      </Typography>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={mockArtists}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default ArtistsPage;

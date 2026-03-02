import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

// Тестовые данные треков
const mockTracks = [
  { id: 1, title: 'Летний вечер', artist: 'Артист Один', isrc: 'RU-AB1-23-00001', duration: '3:24', streams: 125000, releaseDate: '2024-06-15' },
  { id: 2, title: 'Ночной город', artist: 'Группа Два', isrc: 'RU-AB1-23-00002', duration: '4:12', streams: 340000, releaseDate: '2024-05-20' },
  { id: 3, title: 'Танцуй со мной', artist: 'DJ Три', isrc: 'RU-AB1-23-00003', duration: '3:45', streams: 890000, releaseDate: '2024-07-01' },
  { id: 4, title: 'Первый снег', artist: 'Певица Пять', isrc: 'RU-AB1-23-00004', duration: '3:58', streams: 210000, releaseDate: '2024-04-10' },
  { id: 5, title: 'На волне', artist: 'Рэпер Семь', isrc: 'RU-AB1-23-00005', duration: '2:55', streams: 1500000, releaseDate: '2024-08-05' },
  { id: 6, title: 'Утренний кофе', artist: 'Дуэт Восемь', isrc: 'RU-AB1-23-00006', duration: '3:32', streams: 78000, releaseDate: '2024-03-22' },
  { id: 7, title: 'Звёзды', artist: 'Артист Один', isrc: 'RU-AB1-23-00007', duration: '4:05', streams: 95000, releaseDate: '2024-09-12' },
  { id: 8, title: 'Ритм улиц', artist: 'Исполнитель Четыре', isrc: 'RU-AB1-23-00008', duration: '3:18', streams: 180000, releaseDate: '2024-02-28' },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Название', width: 180 },
  { field: 'artist', headerName: 'Артист', width: 160 },
  { field: 'isrc', headerName: 'ISRC', width: 150 },
  { field: 'duration', headerName: 'Длительность', width: 120 },
  {
    field: 'streams',
    headerName: 'Прослушивания',
    width: 140,
    type: 'number',
    valueFormatter: (value: number) => value.toLocaleString('ru-RU'),
  },
  { field: 'releaseDate', headerName: 'Дата релиза', width: 130 },
];

export const TracksPage = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Треки
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Каталог треков с ISRC кодами (тестовые данные)
      </Typography>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={mockTracks}
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

export default TracksPage;

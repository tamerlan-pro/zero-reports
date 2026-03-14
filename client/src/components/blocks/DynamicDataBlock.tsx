import { useState, useEffect, memo } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import axios from 'axios';
import type { DynamicDataBlock as DynamicDataBlockType, ReportBlock } from '../../types/report';
import { BlockRenderer } from './BlockRenderer';

interface Props {
  block: DynamicDataBlockType;
}

export const DynamicDataBlock = memo(function DynamicDataBlock({ block }: Props) {
  const [resolvedBlocks, setResolvedBlocks] = useState<ReportBlock[]>(block.blocks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get<Record<string, unknown>>(block.dataSourceUrl, { timeout: 10_000 });

      const merged = block.blocks.map((b) => {
        if ('data' in b && Array.isArray(b.data)) {
          const key = Object.keys(data).find((k) => Array.isArray(data[k]));
          if (key) {
            return { ...b, data: data[key] as Record<string, unknown>[] };
          }
        }
        if ('rows' in b && Array.isArray(b.rows)) {
          const key = Object.keys(data).find((k) => Array.isArray(data[k]));
          if (key) {
            return { ...b, rows: data[key] as Record<string, unknown>[] };
          }
        }
        return b;
      });

      setResolvedBlocks(merged as ReportBlock[]);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? (err.message) : 'Failed to fetch data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    if (block.refreshInterval && block.refreshInterval > 0) {
      const id = setInterval(() => void fetchData(), block.refreshInterval * 1000);
      return () => clearInterval(id);
    }
    return undefined;
  }, [block.dataSourceUrl, block.refreshInterval]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning">
        <Typography variant="body2">Dynamic data unavailable: {error}</Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {resolvedBlocks.map((b, i) => (
        <BlockRenderer key={i} block={b} />
      ))}
    </Box>
  );
});

'use client';

import { Box, Button, Paper, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import { Chapter } from '@/types/content';
import { useLanguage } from '@/contexts/LanguageContext';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListIcon from '@mui/icons-material/List';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface Props {
  slug: string;
  current: Chapter;
  prev: Chapter | null;
  next: Chapter | null;
}

export function ReaderNav({ slug, current, prev, next }: Props) {
  const { t } = useLanguage();
  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        px: 2,
        py: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
      elevation={0}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Box display="flex" alignItems="center" gap={1} flex={1} minWidth={150}>
          <MenuBookIcon sx={{ fontSize: 20 }} />
          <Typography variant="body1" fontWeight={600} noWrap sx={{ fontSize: '0.95rem' }}>
            {current.title}
          </Typography>
        </Box>
        <Box display="flex" gap={0.5} alignItems="center">
          <Button
            component={Link}
            href={prev ? `/series/${slug}/chapter/${prev.slug || prev.id}` : '#'}
            disabled={!prev}
            startIcon={<ArrowBackIosIcon sx={{ fontSize: 16 }} />}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.85rem',
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              },
            }}
          >
            {t('chapter.prev')}
          </Button>
          <IconButton
            component={Link}
            href={`/series/${slug}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
            }}
            title={t('chapter.list')}
          >
            <ListIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Button
            component={Link}
            href={next ? `/series/${slug}/chapter/${next.slug || next.id}` : '#'}
            disabled={!next}
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.85rem',
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              },
            }}
          >
            {t('chapter.next')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

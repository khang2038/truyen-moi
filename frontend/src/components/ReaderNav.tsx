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
        px: 3,
        py: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
      elevation={0}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1.5} flex={1} minWidth={200}>
          <MenuBookIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} noWrap>
            {current.title}
          </Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Button
            component={Link}
            href={prev ? `/series/${slug}/chapter/${prev.slug || prev.id}` : '#'}
            disabled={!prev}
            startIcon={<ArrowBackIosIcon />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
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
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
            }}
            title={t('chapter.list')}
          >
            <ListIcon />
          </IconButton>
          <Button
            component={Link}
            href={next ? `/series/${slug}/chapter/${next.slug || next.id}` : '#'}
            disabled={!next}
            endIcon={<ArrowForwardIosIcon />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
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

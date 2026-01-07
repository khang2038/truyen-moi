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
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 1.5, md: 2 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
      elevation={0}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={{ xs: 1, sm: 1.5, md: 2 }}>
        <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1, md: 1.5 }} flex={1} minWidth={{ xs: 0, sm: 200 }}>
          <MenuBookIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
          <Typography 
            variant="h6" 
            fontWeight={700} 
            noWrap
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
            }}
          >
            {current.title}
          </Typography>
        </Box>
        <Box display="flex" gap={{ xs: 0.5, sm: 1 }} alignItems="center">
          <Button
            component={Link}
            href={prev ? `/series/${slug}/chapter/${prev.slug || prev.id}` : '#'}
            disabled={!prev}
            startIcon={<ArrowBackIosIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              minWidth: { xs: 'auto', sm: 64 },
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem' },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              },
              '& .MuiButton-startIcon': {
                marginRight: { xs: 0.5, sm: 1 },
              },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {t('chapter.prev')}
            </Box>
          </Button>
          <IconButton
            component={Link}
            href={`/series/${slug}`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              width: { xs: 32, sm: 40, md: 48 },
              height: { xs: 32, sm: 40, md: 48 },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              '& svg': {
                fontSize: { xs: 18, sm: 20, md: 24 },
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
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              minWidth: { xs: 'auto', sm: 64 },
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem' },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              },
              '& .MuiButton-endIcon': {
                marginLeft: { xs: 0.5, sm: 1 },
              },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {t('chapter.next')}
            </Box>
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

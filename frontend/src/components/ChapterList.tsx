'use client';

import { List, ListItem, ListItemButton, ListItemText, Paper, Typography, Box, Chip } from '@mui/material';
import Link from 'next/link';
import { Chapter } from '@/types/content';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  chapters: Chapter[];
  seriesSlug: string;
}

export function ChapterList({ chapters, seriesSlug }: Props) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <MenuBookIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Danh sách chương
        </Typography>
        <Chip
          label={chapters.length}
          size="small"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Box>
      <List sx={{ bgcolor: 'white', borderRadius: 2, p: 1 }}>
        {chapters.map((chapter, index) => (
          <ListItem
            key={chapter.id}
            disablePadding
            sx={{
              mb: 0.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'primary.light',
                '& .MuiListItemText-primary': {
                  color: 'white',
                },
                '& .MuiListItemText-secondary': {
                  color: 'rgba(255,255,255,0.8)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemButton
              component={Link}
              href={`/series/${seriesSlug}/chapter/${chapter.slug || chapter.id}`}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  mr: 2,
                  fontSize: '0.9rem',
                }}
              >
                {chapter.index}
              </Box>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={600}>
                    {chapter.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <VisibilityIcon fontSize="small" />
                    {chapter.viewCount.toLocaleString()} lượt xem
                  </Typography>
                }
              />
              <ArrowForwardIosIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

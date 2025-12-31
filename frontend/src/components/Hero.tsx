'use client';

import { Box, Button, Card, CardContent, CardMedia, Typography, Chip, Stack } from '@mui/material';
import Link from 'next/link';
import { Series } from '@/types/content';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';

interface Props {
  featured: Series;
}

export function Hero({ featured }: Props) {
  return (
    <Card
      sx={{
        mb: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3a5 100%)',
        color: '#2c3e50',
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(168, 230, 207, 0.2)',
        border: 'none',
      }}
    >
      {featured.coverImage && (
        <Box
          sx={{
            width: { xs: '100%', md: 150 },
            height: { xs: 200, md: 150 },
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden',
            borderRadius: { xs: '8px 8px 0 0', md: '8px 0 0 8px' },
            m: 0,
            p: 0,
            lineHeight: 0,
          }}
        >
          <Box
            component="img"
            src={featured.coverImage}
            alt={featured.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              m: 0,
              p: 0,
              verticalAlign: 'bottom',
            }}
          />
        </Box>
      )}
      <CardContent
        sx={{
          flex: 1,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          '&:last-child': {
            pb: 1.5,
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={0.5} mb={0.75}>
          <StarIcon sx={{ color: '#4a90e2', fontSize: 14 }} />
          <Chip
            icon={<TrendingUpIcon sx={{ fontSize: 12 }} />}
            label="Nổi bật"
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.65rem',
              height: 20,
            }}
            size="small"
          />
        </Box>
        <Typography
          variant="subtitle1"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            mb: 0.5,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.3,
          }}
        >
          {featured.title}
        </Typography>
        {featured.author && (
          <Box display="flex" alignItems="center" gap={0.5} mb={0.75}>
            <PersonIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              {featured.author}
            </Typography>
          </Box>
        )}
        {featured.description && (
          <Typography
            variant="caption"
            sx={{
              mb: 1,
              opacity: 0.95,
              lineHeight: 1.4,
              fontSize: '0.7rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {featured.description}
          </Typography>
        )}
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} mb={1}>
          {featured.categories?.slice(0, 2).map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              sx={{
                bgcolor: 'rgba(255,255,255,0.8)',
                color: '#2c3e50',
                fontWeight: 500,
                fontSize: '0.65rem',
                height: 18,
              }}
              size="small"
            />
          ))}
        </Stack>
        <Button
          variant="contained"
          size="small"
          component={Link}
          href={`/series/${featured.slug}`}
          startIcon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
          sx={{
            bgcolor: 'white',
            color: '#4a90e2',
            fontWeight: 700,
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
            '&:hover': {
              bgcolor: '#f0f8ff',
              transform: 'scale(1.02)',
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.2)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Đọc ngay
        </Button>
      </CardContent>
    </Card>
  );
}

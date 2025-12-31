'use client';

import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip, Stack } from '@mui/material';
import Link from 'next/link';
import { Series } from '@/types/content';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useState } from 'react';

interface Props {
  series: Series;
}

export function SeriesCard({ series }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardActionArea
        component={Link}
        href={`/series/${series.slug}`}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          p: 0,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            height: 200,
            bgcolor: 'grey.100',
          }}
        >
          {series.coverImage ? (
            <CardMedia
              component="img"
              image={series.coverImage}
              alt={series.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                m: 0,
                p: 0,
                transition: 'transform 0.5s ease',
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuBookIcon sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />
            </Box>
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1,
            }}
          >
            {series.viewCount > 1000 && (
              <Chip
                icon={<TrendingUpIcon />}
                label="Hot"
                size="small"
                sx={{
                  bgcolor: 'rgba(236, 72, 153, 0.9)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
              p: 2,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 600,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {series.description?.substring(0, 100)}...
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            variant="body2"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: '0.85rem',
              lineHeight: 1.3,
            }}
          >
            {series.title}
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} mb={1}>
            {series.categories?.slice(0, 1).map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                sx={{
                  bgcolor: 'primary.light',
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            ))}
          </Stack>
          <Box display="flex" gap={1} alignItems="center" mt={0.5}>
            <Box display="flex" alignItems="center" gap={0.25}>
              <VisibilityIcon sx={{ fontSize: 14, color: 'primary.main' }} />
              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                {series.viewCount > 999 ? `${(series.viewCount / 1000).toFixed(1)}k` : series.viewCount}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.25}>
              <FavoriteIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                {series.readCount > 999 ? `${(series.readCount / 1000).toFixed(1)}k` : series.readCount}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { fetchRanking } from '@/lib/api';
import { Series } from '@/types/content';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

type Period = 'day' | 'week' | 'month';

export function RankingSection() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<Period>('day');
  const [ranking, setRanking] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, [period]);

  const loadRanking = async () => {
    try {
      setLoading(true);
      const data = await fetchRanking(period);
      setRanking(data.ranking || []);
    } catch (error) {
      console.error('Failed to load ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return 'primary.main';
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#e74c3c' }} />
        <Typography variant="h6" fontWeight={700} color="#e74c3c" fontSize="1rem">
          {t('ranking.title')} 🔥
        </Typography>
      </Box>

      <Tabs
        value={period}
        onChange={(_, v) => setPeriod(v)}
        sx={{
          mb: 2,
          minHeight: 36,
          '& .MuiTab-root': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'none',
            minHeight: 36,
            px: 1,
          },
          '& .Mui-selected': {
            color: '#e74c3c',
          },
        }}
      >
        <Tab label={t('ranking.day')} value="day" />
        <Tab label={t('ranking.week')} value="week" />
        <Tab label={t('ranking.month')} value="month" />
      </Tabs>

      {loading ? (
        <Typography textAlign="center" py={2} fontSize="0.875rem">
          {t('common.loading')}...
        </Typography>
      ) : ranking.length === 0 ? (
        <Typography textAlign="center" py={2} color="text.secondary" fontSize="0.875rem">
          {t('ranking.noData')}
        </Typography>
      ) : (
        <Stack spacing={1}>
          {ranking.slice(0, 10).map((series, index) => {
            const rank = index + 1;
            return (
              <Card
                key={series.id}
                component={Link}
                href={`/series/${series.slug}`}
                sx={{
                  display: 'flex',
                  textDecoration: 'none',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  bgcolor: 'white',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 60,
                    height: 80,
                    flexShrink: 0,
                  }}
                >
                  {series.coverImage ? (
                    <CardMedia
                      component="img"
                      image={series.coverImage}
                      alt={series.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <EmojiEventsIcon sx={{ fontSize: 24, color: 'grey.400' }} />
                    </Box>
                  )}
                  <Avatar
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      width: 20,
                      height: 20,
                      bgcolor: getRankColor(rank),
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {rank <= 3 ? getRankIcon(rank) : rank}
                  </Avatar>
                </Box>
                <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                      mb: 0.5,
                      fontSize: '0.8rem',
                    }}
                  >
                    {series.title}
                  </Typography>
                  <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap" mt={0.5}>
                    <Chip
                      icon={<FavoriteIcon sx={{ fontSize: 12 }} />}
                      label={series.readCount > 999 ? `${(series.readCount / 1000).toFixed(1)}k` : series.readCount}
                      size="small"
                      sx={{
                        bgcolor: 'secondary.light',
                        color: 'white',
                        height: 20,
                        fontSize: '0.65rem',
                        '& .MuiChip-icon': {
                          fontSize: 12,
                        },
                      }}
                    />
                    <Chip
                      icon={<VisibilityIcon sx={{ fontSize: 12 }} />}
                      label={series.viewCount > 999 ? `${(series.viewCount / 1000).toFixed(1)}k` : series.viewCount}
                      size="small"
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'white',
                        height: 20,
                        fontSize: '0.65rem',
                        '& .MuiChip-icon': {
                          fontSize: 12,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}



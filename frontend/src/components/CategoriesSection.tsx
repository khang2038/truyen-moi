'use client';

import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import Link from 'next/link';
import CategoryIcon from '@mui/icons-material/Category';
import { Category } from '@/types/content';
import { fetchPublicCategories } from '@/lib/api';
import { slugify } from '@/lib/slugify';
import { useEffect, useState } from 'react';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchPublicCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || categories.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        borderRadius: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <CategoryIcon sx={{ fontSize: 24, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight={700} color="primary.main" fontSize="1.1rem">
          Thể loại
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {categories.map((cat) => {
          const slug = cat.slug || slugify(cat.name);
          return (
            <Chip
              key={cat.id}
              label={cat.name}
              component={Link}
              href={`/category/${slug}`}
              clickable
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.85rem',
                height: 32,
                border: '2px solid transparent',
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'white',
                  border: '2px solid white',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            />
          );
        })}
      </Stack>
    </Paper>
  );
}





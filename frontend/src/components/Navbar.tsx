'use client';

import { AppBar, Box, Container, Toolbar, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Link from 'next/link';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <AppBar
      position="static"
      component="nav"
      suppressHydrationWarning
      sx={{
        mb: 2,
        background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3a5 100%)',
        boxShadow: '0 2px 12px rgba(168, 230, 207, 0.2)',
        color: '#2c3e50',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box display="flex" alignItems="center" gap={0.5} sx={{ flexGrow: 1 }}>
            <AutoStoriesIcon sx={{ fontSize: 24, color: '#2c3e50' }} />
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: '#2c3e50',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              {t('home.title')}
            </Typography>
          </Box>
          <Box display="flex" gap={0.5} alignItems="center">
            <Button
              component={Link}
              href="/"
              startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
              size="small"
              sx={{
                color: '#2c3e50',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              {t('nav.home')}
            </Button>
            <Button
              component={Link}
              href="/admin"
              startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 18 }} />}
              size="small"
              sx={{
                color: '#2c3e50',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              {t('nav.admin')}
            </Button>
            <ToggleButtonGroup
              value={language}
              exclusive
              onChange={(_, value) => value && setLanguage(value)}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.4)',
                ml: 0.5,
                '& .MuiToggleButton-root': {
                  color: '#2c3e50',
                  borderColor: 'rgba(44,62,80,0.2)',
                  px: 1,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.8)',
                    color: '#2c3e50',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="vi">🇻🇳</ToggleButton>
              <ToggleButton value="en">🇬🇧</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

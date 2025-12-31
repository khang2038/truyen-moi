'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Card,
} from '@mui/material';
import { login } from '@/lib/api';
import { AdminLayout } from '@/components/AdminLayout';
import { RankingSection } from '@/components/RankingSection';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import { fetchAllSeries, fetchAllUsers } from '@/lib/api';

export default function AdminPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ series: 0, users: 0 });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      setIsLoggedIn(true);
      loadStats();
    }
  }, [isLoggedIn]);

  const loadStats = async () => {
    try {
      const [series, users] = await Promise.all([fetchAllSeries(), fetchAllUsers()]);
      setStats({ series: series.length, users: users.length });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      setIsLoggedIn(true);
      setError('');
      loadStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <DashboardIcon sx={{ fontSize: 40 }} />
            <Typography variant="h4" fontWeight={700}>
              {t('admin.login')}
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('admin.email')}
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            />
            <TextField
              label={t('admin.password')}
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              fullWidth
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                fontWeight: 700,
                py: 1.5,
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
            >
              {t('common.login')}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700}>
            {t('admin.dashboard')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                  {t('admin.totalSeries')}
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {stats.series}
                </Typography>
              </Box>
              <AutoStoriesIcon sx={{ fontSize: 60, opacity: 0.3 }} />
            </Box>
          </Card>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 8px 24px rgba(240,147,251,0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                  {t('admin.totalUsers')}
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {stats.users}
                </Typography>
              </Box>
              <PersonIcon sx={{ fontSize: 60, opacity: 0.3 }} />
            </Box>
          </Card>
        </Box>

        <RankingSection />
      </Box>
    </AdminLayout>
  );
}

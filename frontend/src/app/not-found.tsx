'use client';

import { Box, Button, Typography, Container } from '@mui/material';
import Link from 'next/link';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import HomeIcon from '@mui/icons-material/Home';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Box
          sx={{
            fontSize: '120px',
            mb: 2,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'translateY(0)',
              },
              '50%': {
                transform: 'translateY(-20px)',
              },
            },
          }}
        >
          😢
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', sm: '6rem' },
            fontWeight: 900,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h5" fontWeight={600} color="text.primary" mb={1}>
          Trang không tìm thấy!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4} sx={{ maxWidth: 400 }}>
          Oops! Trang bạn đang tìm kiếm có vẻ như đã biến mất hoặc không tồn tại. Hãy quay lại
          trang chủ để khám phá thêm nhiều truyện hay nhé! 📚✨
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/"
            startIcon={<HomeIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(102,126,234,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Về trang chủ
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/admin"
            startIcon={<AutoStoriesIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Admin
          </Button>
        </Box>
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: '3rem',
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0px)',
                },
                '50%': {
                  transform: 'translateY(-20px)',
                },
              },
            }}
          >
            📖
          </Box>
          <Box
            sx={{
              fontSize: '3rem',
              animation: 'float 3s ease-in-out infinite 0.5s',
            }}
          >
            🎨
          </Box>
          <Box
            sx={{
              fontSize: '3rem',
              animation: 'float 3s ease-in-out infinite 1s',
            }}
          >
            ✨
          </Box>
        </Box>
      </Box>
    </Container>
  );
}





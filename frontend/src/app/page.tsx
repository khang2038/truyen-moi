import { Box, Chip, Container, Stack, Typography, Paper } from '@mui/material';
import { Hero } from '@/components/Hero';
import { SeriesCard } from '@/components/SeriesCard';
import { RankingSection } from '@/components/RankingSection';
import { CategoriesSection } from '@/components/CategoriesSection';
import { fetchHomeData } from '@/lib/api';
import UpdateIcon from '@mui/icons-material/Update';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export const revalidate = 0; // Disable caching for this page

export default async function Home() {
  const data = await fetchHomeData();
  const featured = data.featured ?? data.series[0] ?? data.trending[0];

  return (
    <main>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '1fr 320px',
            },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <Box>
            {featured && <Hero featured={featured} />}

            <CategoriesSection />

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                spacing={1}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <UpdateIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={700} color="primary.main" fontSize="1.1rem">
                    Mới cập nhật
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  {featured?.categories?.slice(0, 2).map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      size="small"
                      sx={{
                        bgcolor: 'white',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 24,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </Stack>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 1.5,
                }}
              >
                {data.series.map((item) => (
                  <SeriesCard key={item.id} series={item} />
                ))}
              </Box>
            </Paper>

            {data.trending.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#e74c3c' }} />
                  <Typography variant="h6" fontWeight={700} color="#e74c3c" fontSize="1.1rem">
                    Đang hot 🔥
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(4, 1fr)',
                    },
                    gap: 1.5,
                  }}
                >
                  {data.trending.map((item) => (
                    <SeriesCard key={`tr-${item.id}`} series={item} />
                  ))}
                </Box>
              </Paper>
            )}
          </Box>

          <Box
            sx={{
              position: { lg: 'sticky' },
              top: { lg: 16 },
              maxHeight: { lg: 'calc(100vh - 32px)' },
              overflowY: { lg: 'auto' },
            }}
          >
            <RankingSection />
          </Box>
        </Box>
      </Container>
    </main>
  );
}

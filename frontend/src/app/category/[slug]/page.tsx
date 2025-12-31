import { Container, Typography, Box, Paper } from '@mui/material';
import { fetchSeriesByCategory } from '@/lib/api';
import { SeriesCard } from '@/components/SeriesCard';
import CategoryIcon from '@mui/icons-material/Category';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Next.js 15+ requires await for params
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  console.log('[CategoryPage] Params:', { slug, resolvedParams });
  const data = await fetchSeriesByCategory(slug);

  // Nếu API lỗi nặng, hiển thị fallback đơn giản
  if (!data) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Không tải được dữ liệu thể loại
        </Typography>
        <Typography color="text.secondary">
          Vui lòng thử lại sau.
        </Typography>
      </Container>
    );
  }

  const category = data.category;
  const series = data.series ?? [];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CategoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {category ? category.name : 'Thể loại không tồn tại'}
            </Typography>
            {category?.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {category.description}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {category
            ? `Tìm thấy ${series.length} truyện`
            : 'Không tìm thấy thể loại, hiển thị rỗng'}
        </Typography>
      </Paper>

      {series.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Chưa có truyện nào trong thể loại này
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 2,
          }}
        >
          {series.map((item) => (
            <SeriesCard key={item.id} series={item} />
          ))}
        </Box>
      )}
    </Container>
  );
}

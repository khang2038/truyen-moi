import { Container, Typography, Box, Chip, Stack } from '@mui/material';
import { ChapterList } from '@/components/ChapterList';
import { SeriesCard } from '@/components/SeriesCard';
import { fetchChapters } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const data = await fetchChapters(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  const { series, chapters } = data;

  return (
    <Container sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {series.title}
        </Typography>
        {series.author && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Tác giả: {series.author}
          </Typography>
        )}
        {series.description && (
          <Typography variant="body1" sx={{ mt: 2, mb: 2 }} paragraph>
            {series.description}
          </Typography>
        )}
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {series.categories?.map((cat) => (
            <Chip key={cat.id} label={cat.name} variant="outlined" size="small" />
          ))}
        </Stack>
        <Box mt={2} display="flex" gap={2}>
          <Typography variant="body2" color="text.secondary">
            {series.viewCount} lượt xem
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {series.readCount} lượt đọc
          </Typography>
        </Box>
      </Box>

      <ChapterList chapters={chapters} seriesSlug={series.slug} />
    </Container>
  );
}

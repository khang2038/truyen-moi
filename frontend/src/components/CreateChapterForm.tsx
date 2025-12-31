'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { uploadImage, createChapter, fetchAllSeries } from '@/lib/api';
import { Series } from '@/types/content';
import { useRouter } from 'next/navigation';

export function CreateChapterForm() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);

  const [title, setTitle] = useState('');
  const [index, setIndex] = useState(1);
  const [summary, setSummary] = useState('');
  const [pages, setPages] = useState<string[]>([]);
  const [pageUrls, setPageUrls] = useState('');

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      const data = await fetchAllSeries();
      setSeriesList(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải danh sách truyện' });
    }
  };

  const handleUploadPages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setLoading(true);
      const urls = await Promise.all(files.map((f) => uploadImage(f)));
      setPages((prev) => [...prev, ...urls]);
      setPageUrls((prev) => (prev ? prev + '\n' + urls.join('\n') : urls.join('\n')));
      setMessage({ type: 'success', text: `Upload ${urls.length} ảnh thành công!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload ảnh thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const handlePageUrlsChange = (value: string) => {
    setPageUrls(value);
    const urlArray = value.split('\n').map((p) => p.trim()).filter(Boolean);
    setPages(urlArray);
  };

  const handleRemovePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    setPageUrls(newPages.join('\n'));
  };

  const handleSubmit = async () => {
    if (!selectedSeries) {
      setMessage({ type: 'error', text: 'Vui lòng chọn truyện' });
      return;
    }
    if (!title) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên chương' });
      return;
    }
    if (pages.length === 0) {
      setMessage({ type: 'error', text: 'Vui lòng thêm ít nhất 1 ảnh' });
      return;
    }
    try {
      setLoading(true);
      await createChapter(selectedSeries.id, {
        title,
        index,
        summary,
        pages,
      });
      setMessage({ type: 'success', text: 'Tạo chương thành công!' });
      setTimeout(() => {
        router.push(`/series/${selectedSeries.slug}`);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Tạo chương thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          Tạo chương mới
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Chọn truyện *
            </Typography>
            <Autocomplete
              options={seriesList}
              getOptionLabel={(option) => option.title}
              value={selectedSeries}
              onChange={(_, newValue) => setSelectedSeries(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Tìm và chọn truyện" placeholder="Nhập tên truyện..." />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box key={key} component="li" {...otherProps} sx={{ display: 'flex', gap: 2, py: 2 }}>
                    {option.coverImage ? (
                      <CardMedia
                        component="img"
                        image={option.coverImage}
                        alt={option.title}
                        sx={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 1 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 80,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AutoStoriesIcon sx={{ color: 'grey.400' }} />
                      </Box>
                    )}
                    <Box>
                      <Typography fontWeight={600}>{option.title}</Typography>
                      {option.author && (
                        <Typography variant="caption" color="text.secondary">
                          {option.author}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              }}
            />
            {selectedSeries && (
              <Card sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'white' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  {selectedSeries.coverImage && (
                    <CardMedia
                      component="img"
                      image={selectedSeries.coverImage}
                      alt={selectedSeries.title}
                      sx={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 1 }}
                    />
                  )}
                  <Box>
                    <Typography fontWeight={700} variant="h6">
                      {selectedSeries.title}
                    </Typography>
                    {selectedSeries.author && (
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Tác giả: {selectedSeries.author}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            )}
          </Box>

          <TextField
            label="Tên chương *"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Số thứ tự"
            type="number"
            fullWidth
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
          />
          <TextField
            label="Tóm tắt (tùy chọn)"
            fullWidth
            multiline
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Ảnh chương ({pages.length} ảnh) *
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
              disabled={loading}
            >
              Upload nhiều ảnh
              <input type="file" accept="image/*" multiple hidden onChange={handleUploadPages} />
            </Button>

            {pages.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Xem trước ({pages.length} ảnh):
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(4, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  {pages.map((url, idx) => (
                    <Card key={idx}>
                      <CardMedia
                        component="img"
                        image={url}
                        alt={`Page ${idx + 1}`}
                        sx={{ height: 200, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Chip label={`Trang ${idx + 1}`} size="small" />
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemovePage(idx)}
                          >
                            Xóa
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              label="URL ảnh (mỗi dòng 1 URL)"
              fullWidth
              multiline
              rows={6}
              value={pageUrls}
              onChange={(e) => handlePageUrlsChange(e.target.value)}
              helperText="Nhập URL ảnh, mỗi dòng một URL. Hoặc upload nhiều ảnh cùng lúc."
            />
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin')}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!selectedSeries || !title || pages.length === 0 || loading}
              sx={{ flex: 1 }}
            >
              {loading ? 'Đang tạo...' : 'Tạo chương'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}


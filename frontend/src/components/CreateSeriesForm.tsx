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
  CardMedia,
  Autocomplete,
  Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadImage, createSeries, fetchCategories } from '@/lib/api';
import { Category } from '@/types/content';
import { useRouter } from 'next/navigation';

export function CreateSeriesForm() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const url = await uploadImage(file);
      setCoverImage(url);
      setMessage({ type: 'success', text: 'Upload ảnh bìa thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload ảnh bìa thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên truyện' });
      return;
    }
    try {
      setLoading(true);
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const categoryIds = selectedCategories.map((cat) => cat.id);
      await createSeries({
        title,
        description,
        author,
        coverImage,
        tags: tagArray,
        categoryIds,
      });
      setMessage({ type: 'success', text: 'Tạo truyện thành công!' });
      setTimeout(() => {
        router.push('/admin/series');
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Tạo truyện thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          Tạo truyện mới
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            label="Tên truyện *"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Tác giả"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
              disabled={loading}
            >
              Upload ảnh bìa
              <input type="file" accept="image/*" hidden onChange={handleUploadCover} />
            </Button>
            {coverImage && (
              <Box sx={{ mt: 2 }}>
                <CardMedia
                  component="img"
                  image={coverImage}
                  alt="Cover"
                  sx={{ maxWidth: 300, maxHeight: 400, objectFit: 'contain', borderRadius: 2 }}
                />
              </Box>
            )}
            <TextField
              label="URL ảnh bìa (hoặc upload)"
              fullWidth
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
          <Autocomplete
            multiple
            options={categories}
            getOptionLabel={(option) => option.name}
            value={selectedCategories}
            onChange={(_, newValue) => setSelectedCategories(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Thể loại" placeholder="Chọn thể loại..." />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  size="small"
                />
              ))
            }
          />
          <TextField
            label="Tags (phân cách bằng dấu phẩy)"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Ví dụ: action, comedy, romance"
          />
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin/series')}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!title || loading}
              sx={{ flex: 1 }}
            >
              {loading ? 'Đang tạo...' : 'Tạo truyện'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}


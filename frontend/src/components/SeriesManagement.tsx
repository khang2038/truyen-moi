'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Autocomplete,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { fetchAllSeries, deleteSeries, updateSeries, fetchCategories, uploadImage } from '@/lib/api';
import { Series, Category } from '@/types/content';

export function SeriesManagement() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit form
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadSeries();
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

  const loadSeries = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSeries();
      setSeries(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải danh sách truyện' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Series) => {
    setSelectedSeries(s);
    setEditTitle(s.title);
    setEditDescription(s.description || '');
    setEditAuthor(s.author || '');
    setEditCoverImage(s.coverImage || '');
    setSelectedCategories(s.categories || []);
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedSeries) return;
    try {
      await updateSeries(selectedSeries.id, {
        title: editTitle,
        description: editDescription,
        author: editAuthor,
        coverImage: editCoverImage,
        categoryIds: selectedCategories.map((cat) => cat.id),
      });
      setMessage({ type: 'success', text: 'Cập nhật truyện thành công!' });
      setEditDialog(false);
      loadSeries();
    } catch (error) {
      setMessage({ type: 'error', text: 'Cập nhật thất bại' });
    }
  };

  const handleDelete = (s: Series) => {
    setSelectedSeries(s);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSeries) return;
    try {
      await deleteSeries(selectedSeries.id);
      setMessage({ type: 'success', text: 'Xóa truyện thành công!' });
      setDeleteDialog(false);
      loadSeries();
    } catch (error) {
      setMessage({ type: 'error', text: 'Xóa thất bại' });
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          Quản lý truyện ({series.length})
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ảnh bìa</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tên truyện</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Thể loại</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tác giả</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Lượt xem</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Lượt đọc</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {series.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>
                  {s.coverImage ? (
                    <CardMedia
                      component="img"
                      image={s.coverImage}
                      alt={s.title}
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
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{s.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.description?.substring(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {s.categories?.slice(0, 2).map((cat) => (
                      <Chip key={cat.id} label={cat.name} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                    ))}
                    {s.categories && s.categories.length > 2 && (
                      <Chip label={`+${s.categories.length - 2}`} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>{s.author || '-'}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <VisibilityIcon fontSize="small" color="action" />
                    {s.viewCount.toLocaleString()}
                  </Box>
                </TableCell>
                <TableCell>{s.readCount.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(s)}
                    sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(s)}
                    sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chỉnh sửa truyện
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên truyện"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Tác giả"
              fullWidth
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Ảnh bìa
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingImage}
                  size="small"
                >
                  {uploadingImage ? 'Đang upload...' : 'Upload ảnh'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingImage(true);
                        const url = await uploadImage(file);
                        setEditCoverImage(url);
                        setMessage({ type: 'success', text: 'Upload ảnh thành công!' });
                      } catch (error) {
                        const msg = error instanceof Error ? error.message : 'Upload ảnh thất bại';
                        setMessage({ type: 'error', text: msg });
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                  />
                </Button>
                {editCoverImage && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setEditCoverImage('')}
                  >
                    Xóa ảnh
                  </Button>
                )}
              </Stack>
              <TextField
                label="URL ảnh bìa (hoặc upload ảnh ở trên)"
                fullWidth
                value={editCoverImage}
                onChange={(e) => setEditCoverImage(e.target.value)}
                placeholder="Nhập URL ảnh hoặc upload ảnh"
                size="small"
              />
              {editCoverImage && (
                <Box sx={{ mt: 2 }}>
                  <CardMedia
                    component="img"
                    image={editCoverImage}
                    alt="Cover preview"
                    sx={{
                      maxHeight: 300,
                      width: '100%',
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                </Box>
              )}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa truyện "{selectedSeries?.title}"? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


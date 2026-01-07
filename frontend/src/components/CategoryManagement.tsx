'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import EditIcon from '@mui/icons-material/Edit';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export function CategoryManagement() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
   const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Tên thể loại không được để trống');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await createCategory(name.trim(), description.trim() || undefined);
      setSuccess('Tạo thể loại thành công!');
      setName('');
      setDescription('');
      setOpenDialog(false);
      await loadCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Tạo thể loại thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setError('');
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCategory) return;
    if (!name.trim()) {
      setError('Tên thể loại không được để trống');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await updateCategory(selectedCategory.id, { name: name.trim(), description: description.trim() || undefined });
      setSuccess('Cập nhật thể loại thành công!');
      setOpenEditDialog(false);
      setSelectedCategory(null);
      setTimeout(() => setSuccess(''), 3000);
      await loadCategories();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Cập nhật thể loại thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (cat: Category) => {
    setSelectedCategory(cat);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      setSaving(true);
      await deleteCategory(selectedCategory.id);
      setSuccess('Xóa thể loại thành công!');
      setOpenDeleteDialog(false);
      setSelectedCategory(null);
      setTimeout(() => setSuccess(''), 3000);
      await loadCategories();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Xóa thể loại thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <CategoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700}>
            Quản lý thể loại
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Tạo thể loại mới
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {loading ? (
          <Typography textAlign="center" py={4}>
            Đang tải...
          </Typography>
        ) : categories.length === 0 ? (
          <Box textAlign="center" py={4}>
            <CategoryIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
            <Typography color="text.secondary" mb={2}>
              Chưa có thể loại nào
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
              Tạo thể loại đầu tiên
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Tên thể loại</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Mô tả</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 100 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{cat.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {cat.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        {cat.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDelete(cat)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo thể loại mới</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Tên thể loại *"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ví dụ: Hành động, Lãng mạn, Hài..."
            />
            <TextField
              label="Mô tả (tùy chọn)"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về thể loại này..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa thể loại</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Tên thể loại *"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Mô tả (tùy chọn)"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={saving}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thể loại "{selectedCategory?.name}"? Hành động này không thể hoàn tác.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={saving}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


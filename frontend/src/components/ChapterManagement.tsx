'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  TextField,
  Stack,
  Alert,
  Button,
  Chip,
  Link as MuiLink,
  CardMedia,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from 'next/link';
import { fetchAllSeries, deleteChapter, updateChapter, fetchChapters } from '@/lib/api';
import { Series, Chapter } from '@/types/content';

export function ChapterManagement() {
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit form
  const [editTitle, setEditTitle] = useState('');
  const [editIndex, setEditIndex] = useState(0);
  const [editSummary, setEditSummary] = useState('');

  useEffect(() => {
    loadSeries();
  }, []);

  useEffect(() => {
    if (selectedSeries) {
      loadChapters(selectedSeries.id);
    }
  }, [selectedSeries]);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSeries();
      setSeries(data);
      if (data.length > 0 && !selectedSeries) {
        setSelectedSeries(data[0]);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải danh sách truyện' });
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async (seriesId: string) => {
    try {
      const seriesData = series.find((s) => s.id === seriesId);
      if (!seriesData) {
        setChapters([]);
        return;
      }
      const data = await fetchChapters(seriesData.slug);
      if (data && data.chapters) {
        setChapters(data.chapters);
      } else {
        setChapters([]);
      }
    } catch (error) {
      console.error('Failed to load chapters:', error);
      setChapters([]);
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setEditTitle(chapter.title);
    setEditIndex(chapter.index);
    setEditSummary(chapter.summary || '');
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedChapter) return;
    try {
      await updateChapter(selectedChapter.id, {
        title: editTitle,
        index: editIndex,
        summary: editSummary,
      });
      setMessage({ type: 'success', text: 'Cập nhật chương thành công!' });
      setEditDialog(false);
      if (selectedSeries) {
        loadChapters(selectedSeries.id);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Cập nhật thất bại' });
    }
  };

  const handleDelete = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedChapter) return;
    try {
      await deleteChapter(selectedChapter.id);
      setMessage({ type: 'success', text: 'Xóa chương thành công!' });
      setDeleteDialog(false);
      if (selectedSeries) {
        loadChapters(selectedSeries.id);
      }
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
        <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          Quản lý chương
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Chọn truyện
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {series.map((s) => (
            <Chip
              key={s.id}
              label={s.title}
              onClick={() => setSelectedSeries(s)}
              color={selectedSeries?.id === s.id ? 'primary' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>
      </Paper>

      {selectedSeries && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Chương của: {selectedSeries.title}
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/admin/chapters/new"
              startIcon={<MenuBookIcon />}
            >
              Thêm chương mới
            </Button>
          </Box>
        </Paper>
      )}

      {selectedSeries && chapters.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>STT</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tên chương</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ảnh</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Số trang</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Lượt xem</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ngày tạo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chapters.map((chapter) => (
                <TableRow key={chapter.id} hover>
                  <TableCell>{chapter.index}</TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>{chapter.title}</Typography>
                    {chapter.summary && (
                      <Typography variant="caption" color="text.secondary">
                        {chapter.summary.substring(0, 50)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {chapter.pages && chapter.pages.length > 0 ? (
                      <CardMedia
                        component="img"
                        image={chapter.pages[0]}
                        alt={chapter.title}
                        sx={{
                          width: 60,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
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
                        <MenuBookIcon sx={{ color: 'grey.400', fontSize: 24 }} />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{chapter.pages?.length || 0}</TableCell>
                  <TableCell>{chapter.viewCount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    {chapter.createdAt
                      ? new Date(chapter.createdAt).toLocaleDateString('vi-VN')
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(chapter)}
                      sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(chapter)}
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
      )}

      {selectedSeries && chapters.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Chưa có chương nào trong truyện này
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/admin/chapters/new"
            startIcon={<MenuBookIcon />}
          >
            Thêm chương đầu tiên
          </Button>
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chỉnh sửa chương
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên chương"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Số thứ tự"
              type="number"
              fullWidth
              value={editIndex}
              onChange={(e) => setEditIndex(Number(e.target.value))}
            />
            <TextField
              label="Tóm tắt"
              fullWidth
              multiline
              rows={4}
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
            />
            {selectedChapter && selectedChapter.pages && selectedChapter.pages.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Ảnh trong chương ({selectedChapter.pages.length} ảnh):
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 1,
                    maxHeight: 300,
                    overflowY: 'auto',
                  }}
                >
                  {selectedChapter.pages.map((url, idx) => (
                    <CardMedia
                      key={idx}
                      component="img"
                      image={url}
                      alt={`Page ${idx + 1}`}
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
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
            Bạn có chắc chắn muốn xóa chương "{selectedChapter?.title}"? Hành động này không thể hoàn tác.
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


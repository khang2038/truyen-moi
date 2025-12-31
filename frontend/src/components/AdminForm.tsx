'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Container,
} from '@mui/material';
import { uploadImage, createSeries, createChapter, fetchAllSeries, updateSeries, deleteSeries, updateChapter, deleteChapter } from '@/lib/api';
import { Series, Chapter } from '@/types/content';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function AdminForm() {
  const [tab, setTab] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>('');

  // Series form
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seriesDescription, setSeriesDescription] = useState('');
  const [seriesAuthor, setSeriesAuthor] = useState('');
  const [seriesCoverImage, setSeriesCoverImage] = useState('');
  const [seriesTags, setSeriesTags] = useState('');

  // Chapter form
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterIndex, setChapterIndex] = useState(1);
  const [chapterSummary, setChapterSummary] = useState('');
  const [chapterPages, setChapterPages] = useState('');

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    const list = await fetchAllSeries();
    setSeriesList(list);
  };

  const uploadSingle = async (file: File): Promise<string> => {
    return uploadImage(file);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadSingle(file);
      setSeriesCoverImage(url);
      setMessage({ type: 'success', text: 'Upload ảnh bìa thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload ảnh bìa thất bại' });
    }
  };

  const handleUploadPages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const urls = await Promise.all(files.map((f) => uploadSingle(f)));
      setChapterPages(urls.join('\n'));
      setMessage({ type: 'success', text: `Upload ${urls.length} ảnh thành công!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload ảnh chương thất bại' });
    }
  };

  const handleCreateSeries = async () => {
    try {
      const tags = seriesTags.split(',').map((t) => t.trim()).filter(Boolean);
      await createSeries({
        title: seriesTitle,
        description: seriesDescription,
        author: seriesAuthor,
        coverImage: seriesCoverImage,
        tags,
      });
      setMessage({ type: 'success', text: 'Tạo truyện thành công!' });
      setSeriesTitle('');
      setSeriesDescription('');
      setSeriesAuthor('');
      setSeriesCoverImage('');
      setSeriesTags('');
      loadSeries();
    } catch (error) {
      setMessage({ type: 'error', text: 'Tạo truyện thất bại' });
    }
  };

  const handleCreateChapter = async () => {
    if (!selectedSeries) {
      setMessage({ type: 'error', text: 'Vui lòng chọn truyện' });
      return;
    }
    try {
      const pages = chapterPages.split('\n').map((p) => p.trim()).filter(Boolean);
      await createChapter(selectedSeries, {
        title: chapterTitle,
        index: chapterIndex,
        summary: chapterSummary,
        pages,
      });
      setMessage({ type: 'success', text: 'Tạo chương thành công!' });
      setChapterTitle('');
      setChapterIndex((prev) => prev + 1);
      setChapterSummary('');
      setChapterPages('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Tạo chương thất bại' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Tạo truyện mới" />
          <Tab label="Tạo chương mới" />
        </Tabs>

        {message && (
          <Alert severity={message.type} sx={{ m: 2 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <TabPanel value={tab} index={0}>
          <Stack spacing={2}>
            <TextField
              label="Tên truyện"
              fullWidth
              value={seriesTitle}
              onChange={(e) => setSeriesTitle(e.target.value)}
              required
            />
            <TextField
              label="Tác giả"
              fullWidth
              value={seriesAuthor}
              onChange={(e) => setSeriesAuthor(e.target.value)}
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={4}
              value={seriesDescription}
              onChange={(e) => setSeriesDescription(e.target.value)}
            />
            <Box>
              <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                Upload ảnh bìa
                <input type="file" accept="image/*" hidden onChange={handleUploadCover} />
              </Button>
              {seriesCoverImage && (
                <Box sx={{ mt: 1 }}>
                  <img src={seriesCoverImage} alt="Cover" style={{ maxWidth: 200, maxHeight: 200 }} />
                </Box>
              )}
              <TextField
                label="URL ảnh bìa (hoặc upload)"
                fullWidth
                value={seriesCoverImage}
                onChange={(e) => setSeriesCoverImage(e.target.value)}
                sx={{ mt: 1 }}
              />
            </Box>
            <TextField
              label="Tags (phân cách bằng dấu phẩy)"
              fullWidth
              value={seriesTags}
              onChange={(e) => setSeriesTags(e.target.value)}
            />
            <Button variant="contained" onClick={handleCreateSeries} disabled={!seriesTitle}>
              Tạo truyện
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Chọn truyện</InputLabel>
              <Select value={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)}>
                {seriesList.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Tên chương"
              fullWidth
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              required
            />
            <TextField
              label="Số thứ tự"
              type="number"
              fullWidth
              value={chapterIndex}
              onChange={(e) => setChapterIndex(Number(e.target.value))}
            />
            <TextField
              label="Tóm tắt (tùy chọn)"
              fullWidth
              multiline
              rows={2}
              value={chapterSummary}
              onChange={(e) => setChapterSummary(e.target.value)}
            />
            <Box>
              <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                Upload ảnh chương (nhiều ảnh)
                <input type="file" accept="image/*" multiple hidden onChange={handleUploadPages} />
              </Button>
              <TextField
                label="Các trang (mỗi dòng 1 url ảnh)"
                fullWidth
                multiline
                rows={6}
                value={chapterPages}
                onChange={(e) => setChapterPages(e.target.value)}
                helperText="Mỗi dòng là 1 URL ảnh, hoặc upload nhiều ảnh cùng lúc"
              />
            </Box>
            <Button variant="contained" onClick={handleCreateChapter} disabled={!selectedSeries || !chapterTitle}>
              Tạo chương
            </Button>
          </Stack>
        </TabPanel>
      </Paper>
    </Container>
  );
}

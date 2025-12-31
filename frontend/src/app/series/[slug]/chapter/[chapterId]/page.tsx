'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { ReaderNav } from '@/components/ReaderNav';
import { fetchChapter, fetchComments, createComment, getAdInserts } from '@/lib/api';
import { Chapter, Comment } from '@/types/content';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

export default function ChapterPage({ params }: { params: Promise<{ slug: string; chapterId: string }> | { slug: string; chapterId: string } }) {
  const { t, language } = useLanguage();
  const [resolvedParams, setResolvedParams] = useState<{ slug: string; chapterId: string } | null>(null);
  const [data, setData] = useState<{
    series: any;
    chapter: Chapter;
    prev: Chapter | null;
    next: Chapter | null;
  } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [adInserts, setAdInserts] = useState<Array<{ position: number; code: string }>>([]);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setResolvedParams(resolved);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    async function load() {
      const chapterData = await fetchChapter(resolvedParams.slug, resolvedParams.chapterId);
      setData(chapterData);
      if (chapterData?.chapter?.id) {
        const [commentsData, adInsertsData] = await Promise.all([
          fetchComments(chapterData.chapter.id),
          getAdInserts(),
        ]);
        setComments(commentsData);
        setAdInserts(adInsertsData);
      }
      setLoading(false);
    }
    load();
  }, [resolvedParams]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !data?.chapter?.id) return;
    try {
      const newComment = await createComment(data.chapter.id, commentText, authorName || undefined);
      setComments([newComment, ...comments]);
      setCommentText('');
      setAuthorName('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  if (loading || !data) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h6" color="text.secondary">
            {t('common.loading')}...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ReaderNav slug={resolvedParams?.slug || ''} current={data.chapter} prev={data.prev} next={data.next} />
      <Container sx={{ py: 3, maxWidth: '100%', px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          {data.chapter.pages.flatMap((url, idx) => {
            // Check if we should insert ad before this page
            const adBefore = adInserts.find((ad) => ad.position === idx);
            const elements = [];
            
            if (adBefore) {
              elements.push(
                <Box
                  key={`ad-before-${idx}`}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    mb: 2,
                    '& > *': {
                      width: '100%',
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: adBefore.code }}
                />
              );
            }
            
            elements.push(
              <Box
                key={`page-${idx}`}
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  mb: 2,
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.01)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      bgcolor: 'grey.100',
                      minHeight: 400,
                    }}
                  >
                    <Image
                      src={url}
                      alt={`${t('chapter.title')} ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                      unoptimized
                      priority={idx < 3}
                    />
                  </Box>
                </Card>
                <Chip
                  label={`${idx + 1} / ${data.chapter.pages.length}`}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                  size="small"
                />
              </Box>
            );
            
            return elements;
          })}
        </Box>

        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <CommentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={700}>
              {t('chapter.comments')} ({comments.length})
            </Typography>
          </Box>

          <Card
            sx={{
              mb: 3,
              p: 3,
              bgcolor: 'primary.light',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                label={t('chapter.authorName')}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                size="small"
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('chapter.writeComment')}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmitComment}
                endIcon={<SendIcon />}
                disabled={!commentText.trim()}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                  },
                }}
              >
                {t('chapter.submit')}
              </Button>
            </Stack>
          </Card>

          <List sx={{ bgcolor: 'transparent' }}>
            {comments.length === 0 ? (
              <Box textAlign="center" py={4}>
                <EmojiEmotionsIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                <Typography color="text.secondary">
                  {t('chapter.comments')} đầu tiên nào!
                </Typography>
              </Box>
            ) : (
              comments.map((comment) => (
                <ListItem
                  key={comment.id}
                  alignItems="flex-start"
                  sx={{
                    mb: 2,
                    bgcolor: 'white',
                    borderRadius: 3,
                    p: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                    }}
                  >
                    {comment.authorName?.[0]?.toUpperCase() || '😊'}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography fontWeight={600}>
                          {comment.authorName || t('chapter.anonymous')}
                        </Typography>
                        <Chip
                          icon={<FavoriteIcon />}
                          label="❤️"
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ display: 'block', mb: 1 }}
                        >
                          {comment.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString(
                            language === 'vi' ? 'vi-VN' : 'en-US',
                          )}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}

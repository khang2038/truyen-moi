import axios from 'axios';
import { HomeData, Series, Chapter, Comment } from '@/types/content';

// Backend default port is 8080 (from .env PORT=8080), fallback to 3001
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle ECONNRESET and other connection errors
    if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.message?.includes('ECONNRESET')) {
      console.error('[API] Connection error:', {
        code: error.code,
        message: error.message,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  }
);

export async function fetchHomeData(): Promise<HomeData> {
  try {
    const { data } = await api.get('/series');
    return data;
  } catch (error: any) {
    console.error('Failed to fetch home data:', {
      message: error.message,
      code: error.code,
      response: error.response?.status,
    });
    // Return empty data instead of crashing
    return { series: [], trending: [], featured: null };
  }
}

export async function fetchSeries(slug: string): Promise<Series | null> {
  try {
    const { data } = await api.get(`/series/${slug}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch series:', error);
    return null;
  }
}

export async function fetchChapters(slug: string): Promise<{ series: Series; chapters: Chapter[] } | null> {
  if (!slug) {
    console.error('[API] fetchChapters: slug is empty');
    return null;
  }
  try {
    console.log(`[API] Fetching chapters for series slug: "${slug}"`);
    const url = `/series/${encodeURIComponent(slug)}/chapters`;
    console.log(`[API] Request URL: ${url}`);
    const { data } = await api.get(url);
    console.log(`[API] Received chapters data:`, { 
      series: data?.series?.title, 
      chaptersCount: data?.chapters?.length || 0 
    });
    return data;
  } catch (error: any) {
    console.error('[API] Failed to fetch chapters:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      slug
    });
    return null;
  }
}

export async function fetchChapter(
  slug: string,
  chapterSlug: string,
): Promise<{ series: Series; chapter: Chapter; prev: Chapter | null; next: Chapter | null } | null> {
  if (!slug || !chapterSlug) {
    console.error('[API] fetchChapter: slug or chapterSlug is empty');
    return null;
  }
  try {
    console.log(`[API] Fetching chapter: series="${slug}", chapter="${chapterSlug}"`);
    const url = `/series/${encodeURIComponent(slug)}/chapters/${encodeURIComponent(chapterSlug)}`;
    const { data } = await api.get(url);
    console.log(`[API] Received chapter data:`, { 
      series: data?.series?.title, 
      chapter: data?.chapter?.title 
    });
    return data;
  } catch (error: any) {
    console.error('[API] Failed to fetch chapter:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      slug,
      chapterSlug
    });
    return null;
  }
}

export async function fetchComments(chapterId: string): Promise<Comment[]> {
  try {
    const { data } = await api.get(`/comments/chapter/${chapterId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return [];
  }
}

export async function createComment(chapterId: string, content: string, authorName?: string): Promise<Comment> {
  const { data } = await api.post(`/comments/chapter/${chapterId}`, { content, authorName });
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
}

export async function createSeries(payload: any) {
  const { data } = await api.post('/admin/series', payload);
  return data;
}

export async function updateSeries(seriesId: string, payload: any) {
  const { data } = await api.patch(`/admin/series/${seriesId}`, payload);
  return data;
}

export async function deleteSeries(seriesId: string) {
  const { data } = await api.delete(`/admin/series/${seriesId}`);
  return data;
}

export async function createChapter(seriesId: string, payload: any) {
  const { data } = await api.post(`/admin/series/${seriesId}/chapters`, payload);
  return data;
}

export async function updateChapter(chapterId: string, payload: any) {
  const { data } = await api.patch(`/admin/chapters/${chapterId}`, payload);
  return data;
}

export async function deleteChapter(chapterId: string) {
  const { data } = await api.delete(`/admin/chapters/${chapterId}`);
  return data;
}

export async function fetchAllSeries(): Promise<Series[]> {
  try {
    const { data } = await api.get('/admin/series');
    return data;
  } catch (error) {
    return [];
  }
}

export async function fetchRanking(period: 'day' | 'week' | 'month') {
  try {
    const { data } = await api.get(`/series/ranking/${period}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch ranking:', error);
    return { period, ranking: [] };
  }
}

export async function fetchCategories() {
  try {
    const { data } = await api.get('/admin/categories');
    return data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function fetchPublicCategories() {
  try {
    const { data } = await api.get('/categories');
    return data;
  } catch (error) {
    console.error('Failed to fetch public categories:', error);
    return [];
  }
}

export async function fetchSeriesByCategory(slug: string): Promise<{ category: any; series: Series[] } | null> {
  if (!slug) {
    console.error('[API] fetchSeriesByCategory: slug is empty');
    return { category: null, series: [] };
  }
  try {
    console.log(`[API] Fetching series for category slug: "${slug}"`);
    const url = `/categories/${encodeURIComponent(slug)}/series`;
    console.log(`[API] Request URL: ${url}`);
    const { data } = await api.get(url);
    console.log(`[API] Received data:`, { 
      category: data?.category ? { name: data.category.name, slug: data.category.slug } : null, 
      seriesCount: data?.series?.length || 0 
    });
    return data;
  } catch (error: any) {
    console.error('[API] Failed to fetch series by category:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      slug
    });
    return { category: null, series: [] };
  }
}

export async function createCategory(name: string, description?: string) {
  try {
    const { data } = await api.post('/admin/categories', { name, description });
    return data;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
}

// User management APIs
export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'publisher' | 'reader';
  isActive: boolean;
  createdAt: string;
}

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const { data } = await api.get('/admin/users');
    return data;
  } catch (error) {
    return [];
  }
}

export async function createUser(payload: any) {
  const { data } = await api.post('/admin/users', payload);
  return data;
}

export async function updateUser(userId: string, payload: any) {
  const { data } = await api.patch(`/admin/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId: string) {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
}

// Ads management APIs
export async function getAdsConfig() {
  try {
    const { data } = await api.get('/admin/ads');
    return data;
  } catch (error) {
    console.error('Failed to fetch ads config:', error);
    return null;
  }
}

export async function updateAdsConfig(payload: { adsTxt?: string; headerScript?: string; adInserts?: any[] }) {
  const { data } = await api.put('/admin/ads', payload);
  return data;
}

export async function getHeaderScript() {
  try {
    const { data } = await api.get('/admin/ads');
    return data?.headerScript || '';
  } catch (error) {
    return '';
  }
}

export async function getAdsTxt() {
  try {
    const response = await api.get('/ads/ads.txt', { responseType: 'text' });
    return response.data;
  } catch (error) {
    return '';
  }
}

export async function getAdInserts() {
  try {
    const { data } = await api.get('/ads/inserts');
    return data.inserts || [];
  } catch (error) {
    return [];
  }
}

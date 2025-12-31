export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  author?: string;
  status: string;
  tags: string[];
  categories?: Category[];
  viewCount: number;
  readCount: number;
  createdAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  slug?: string;
  index: number;
  summary?: string;
  pages: string[];
  viewCount: number;
  readCount: number;
  createdAt: string;
  seriesId: string;
}

export interface Comment {
  id: string;
  content: string;
  authorName?: string;
  userId?: string;
  chapterId: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    displayName?: string;
  };
}

export interface HomeData {
  series: Series[];
  trending: Series[];
  featured: Series | null;
}

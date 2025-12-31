'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, any>> = {
  vi: {
    common: {
      home: 'Trang chủ',
      admin: 'Admin',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Sửa',
      create: 'Tạo mới',
      search: 'Tìm kiếm',
      loading: 'Đang tải...',
      error: 'Lỗi',
      success: 'Thành công',
    },
    nav: {
      home: 'Trang chủ',
      admin: 'Admin',
      trending: 'Đang hot',
      new: 'Mới cập nhật',
    },
    home: {
      title: 'Taptap comics',
      subtitle: 'Đọc truyện tranh online miễn phí',
      newUpdates: 'Mới cập nhật',
      trending: 'Đang hot',
      readNow: 'Đọc ngay',
      author: 'Tác giả',
      viewCount: 'lượt xem',
      readCount: 'lượt đọc',
      featured: 'Nổi bật',
    },
    ranking: {
      title: 'Bảng xếp hạng',
      day: 'Hôm nay',
      week: 'Tuần này',
      month: 'Tháng này',
      readCount: 'Lượt đọc',
      viewCount: 'Lượt xem',
      rank: 'Hạng',
      noData: 'Chưa có dữ liệu',
    },
    chapter: {
      title: 'Đọc truyện',
      prev: 'Chương trước',
      next: 'Chương tiếp',
      list: 'Danh sách',
      comments: 'Bình luận',
      writeComment: 'Viết bình luận...',
      authorName: 'Tên của bạn (tùy chọn)',
      submit: 'Gửi bình luận',
      anonymous: 'Ẩn danh',
    },
    admin: {
      title: 'Quản trị hệ thống',
      dashboard: 'Tổng quan',
      series: 'Quản lý truyện',
      createSeries: 'Tạo truyện mới',
      createChapter: 'Tạo chương mới',
      users: 'Quản lý người dùng',
      totalSeries: 'Tổng số truyện',
      totalUsers: 'Tổng số người dùng',
      login: 'Đăng nhập Admin',
      email: 'Email',
      password: 'Mật khẩu',
    },
  },
  en: {
    common: {
      home: 'Home',
      admin: 'Admin',
      login: 'Login',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    nav: {
      home: 'Home',
      admin: 'Admin',
      trending: 'Trending',
      new: 'New Updates',
    },
    home: {
      title: 'Taptap comics',
      subtitle: 'Read comics online for free',
      newUpdates: 'New Updates',
      trending: 'Trending',
      readNow: 'Read Now',
      author: 'Author',
      viewCount: 'views',
      readCount: 'reads',
      featured: 'Featured',
    },
    ranking: {
      title: 'Ranking',
      day: 'Today',
      week: 'This Week',
      month: 'This Month',
      readCount: 'Reads',
      viewCount: 'Views',
      rank: 'Rank',
      noData: 'No data available',
    },
    chapter: {
      title: 'Read Chapter',
      prev: 'Previous',
      next: 'Next',
      list: 'List',
      comments: 'Comments',
      writeComment: 'Write a comment...',
      authorName: 'Your name (optional)',
      submit: 'Submit',
      anonymous: 'Anonymous',
    },
    admin: {
      title: 'Admin Panel',
      dashboard: 'Dashboard',
      series: 'Manage Series',
      createSeries: 'Create New Series',
      createChapter: 'Create New Chapter',
      users: 'Manage Users',
      totalSeries: 'Total Series',
      totalUsers: 'Total Users',
      login: 'Admin Login',
      email: 'Email',
      password: 'Password',
    },
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'vi' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Prevent hydration mismatch by using default language until mounted
  const displayLanguage = mounted ? language : 'vi';

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[displayLanguage];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language: displayLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}


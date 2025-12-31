'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { ChapterManagement } from '@/components/ChapterManagement';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChaptersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <ChapterManagement />
    </AdminLayout>
  );
}


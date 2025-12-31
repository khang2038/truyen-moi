'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { CategoryManagement } from '@/components/CategoryManagement';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/admin');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <CategoryManagement />
    </AdminLayout>
  );
}


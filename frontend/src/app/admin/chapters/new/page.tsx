'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { CreateChapterForm } from '@/components/CreateChapterForm';

export default function CreateChapterPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin';
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <CreateChapterForm />
    </AdminLayout>
  );
}


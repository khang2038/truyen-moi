'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { CreateSeriesForm } from '@/components/CreateSeriesForm';

export default function CreateSeriesPage() {
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
      <CreateSeriesForm />
    </AdminLayout>
  );
}


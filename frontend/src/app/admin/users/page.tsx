'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { UserManagement } from '@/components/UserManagement';

export default function UserManagementPage() {
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
      <UserManagement />
    </AdminLayout>
  );
}


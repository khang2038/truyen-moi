'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';

export function NavbarWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render on client to prevent hydration mismatch
  // This ensures server and client render the same thing (null)
  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  return <Navbar />;
}


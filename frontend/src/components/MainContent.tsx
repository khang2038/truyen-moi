'use client';

export function MainContent({ children }: { children: React.ReactNode }) {
  return <main suppressHydrationWarning>{children}</main>;
}



'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function ParStudLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  return <DashboardLayout isGuest={isGuest}>{children}</DashboardLayout>;
}


'use client';
import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';

function ParStudLayoutClient({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  return (
      <DashboardLayout isGuest={isGuest}>{children}</DashboardLayout>
  );
}

export default function ParStudLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>
            <ParStudLayoutClient>{children}</ParStudLayoutClient>
        </Suspense>
    )
}

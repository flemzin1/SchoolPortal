
import * as React from 'react';
import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}

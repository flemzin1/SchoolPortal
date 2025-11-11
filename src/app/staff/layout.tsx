
import * as React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

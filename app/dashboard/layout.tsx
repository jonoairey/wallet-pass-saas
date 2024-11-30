import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Dashboard | PassPort',
  description: 'Manage your digital wallet passes',
}
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}


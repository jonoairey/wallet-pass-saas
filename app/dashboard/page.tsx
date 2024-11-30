import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import DashboardOverview from "@/components/dashboard/DashboardOverview"

export default async function DashboardPage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="p-6">
      <DashboardOverview />
    </div>
  )
}
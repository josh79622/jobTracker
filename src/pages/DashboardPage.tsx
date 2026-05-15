import { AppLayout } from '@/components/layout/AppLayout'
import { StatCard } from '@/components/analytics/StatCard'
import { StatusChart } from '@/components/analytics/StatusChart'
import { TimelineChart } from '@/components/analytics/TimelineChart'
import { FunnelChart } from '@/components/analytics/FunnelChart'

import { useApplications } from '@/hooks/useApplications'
import { DashboardSkeleton } from "@/components/analytics/DashboardSkeleton"

export default function DashboardPage() {
  const { data: applications = [], isLoading } = useApplications()

  const total = applications.length || 0
  const active = applications.filter(app => !['rejected', 'withdrawn'].includes(app.status)).length
  const interviews = applications.filter(app => app.status === 'interview').length
  const offers = applications.filter(app => app.status === 'offer').length

  if (isLoading) {
    return <AppLayout><DashboardSkeleton /></AppLayout>
  }

  if (applications.length === 0) {
  return (
    <AppLayout>
      <div className="text-muted-foreground py-12 text-center">
        <p>No data to display yet.</p>
        <p className="text-sm mt-2">
          Create your first application to see analytics.
        </p>
      </div>
    </AppLayout>
  )
}

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total" value={String(total)} />
          <StatCard label="Active" value={String(active)} />
          <StatCard label="Interviews" value={String(interviews)} />
          <StatCard label="Offers" value={String(offers)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <StatusChart />
          <TimelineChart />
        </div>
        <FunnelChart />
      </div>
    </AppLayout>
  )
}

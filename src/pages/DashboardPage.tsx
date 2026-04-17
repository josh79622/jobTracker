import { AppLayout } from '@/components/layout/AppLayout'
import { StatCard } from '@/components/analytics/StatCard'
import { StatusChart } from '@/components/analytics/StatusChart'
import { TimelineChart } from '@/components/analytics/TimelineChart'
import { FunnelChart } from '@/components/analytics/FunnelChart'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total" value="0" />
          <StatCard label="Active" value="0" />
          <StatCard label="Interviews" value="0" />
          <StatCard label="Offers" value="0" />
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

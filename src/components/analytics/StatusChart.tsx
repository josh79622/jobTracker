import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useApplications } from '@/hooks/useApplications'
import { useStatusLabel } from '@/hooks/useStatusLabel'
import type { ApplicationStatus } from '@/types/database'

const COLOURS = ['#6366f1', '#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#94a3b8']

export function StatusChart() {
  const getStatusLabel = useStatusLabel()
  const { data: applications = [] } = useApplications()

    const data = Object.entries(
      applications.reduce<Record<string, number>>((acc, app) => {
        acc[app.status] = (acc[app.status] ?? 0) + 1
        return acc
      }, {})
    ).map(([status, count]) => ({
      name: getStatusLabel(status as ApplicationStatus),
      value: count,
    }))

    if (data.length === 0) return <div className="text-sm text-muted-foreground">No data yet.</div>


  return <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-medium">Applications by Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLOURS[i % COLOURS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useApplications } from "@/hooks/useApplications"

export function TimelineChart() {
  const { data: applications = [] } = useApplications()

  const data = Object.entries(
    applications.reduce<Record<string, number>>((acc, app) => {
      const month = app.applied_date.slice(0, 7) // Get YYYY-MM
      acc[month] = (acc[month] ?? 0) + 1
      return acc
    }, {})
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))

  if (data.length === 0) return <div className="text-sm text-muted-foreground">No data yet.</div>
  
  return <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-medium">Applications per Month</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
}

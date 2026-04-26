import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useApplications } from "@/hooks/useApplications"

const FUNNEL_STAGES = [
  { status: 'applied', label: 'Applied', color: '#6366f1' },
  { status: 'phone_screen', label: 'Phone Screen', color: '#f59e0b' },
  { status: 'interview', label: 'Interview', color: '#3b82f6' },
  { status: 'offer', label: 'Offer', color: '#22c55e' },
]


export function FunnelChart() {
  const { data: applications = [] } = useApplications()

  const data = FUNNEL_STAGES.map(({ status, label, color }) => ({
    label,
    color,
    count: applications.filter(app => app.status === status).length,
  }))
  return <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-medium">Hiring Funnel</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="label" width={100} />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
}

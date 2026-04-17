import type { Application } from '@/types/database'

interface KanbanCardProps {
  application: Application
}

export function KanbanCard({ application }: KanbanCardProps) {
  return (
    <div className="rounded-md border bg-background p-3 shadow-sm">
      <div className="font-bold">{application.company}</div>
      <div className="text-sm text-muted-foreground">{application.role}</div>
    </div>
  )
}

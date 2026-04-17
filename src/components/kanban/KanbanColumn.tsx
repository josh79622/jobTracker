import type { ApplicationStatus } from '@/types/database'
import { STATUS_LABEL } from '@/lib/utils'

interface KanbanColumnProps {
  status: ApplicationStatus
}

export function KanbanColumn({ status }: KanbanColumnProps) {
  return (
    <div className="min-w-72 rounded-lg border bg-card p-3">
      <h3 className="font-medium">{STATUS_LABEL[status]}</h3>
    </div>
  )
}

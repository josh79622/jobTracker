import type { ApplicationStatus, Application } from '@/types/database'
import { useStatusLabel } from '@/hooks/useStatusLabel'
import { KanbanCard } from "./KanbanCard"

import { useDroppable } from "@dnd-kit/core"

interface KanbanColumnProps {
  applications: Application[]
  status: ApplicationStatus
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const getStatusLabel = useStatusLabel()
  const { setNodeRef } = useDroppable({
    id: status
  })

  return (
    <div className="min-w-50 rounded-lg border bg-card p-3 space-y-2">
      <h2 className="font-medium">{getStatusLabel(status)}</h2>
      <div ref={setNodeRef} className="space-y-2 min-h-20">
        {applications.map((application) => (
          <KanbanCard key={application.id} application={application} />
        ))}
      </div>
    </div>
  )
}

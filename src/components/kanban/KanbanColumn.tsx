import type { ApplicationStatus, Application } from '@/types/database'
import { STATUS_LABEL } from '@/lib/utils'
import { KanbanCard } from "./KanbanCard"

import { useDroppable } from "@dnd-kit/core"

interface KanbanColumnProps {
  applications: Application[]
  status: ApplicationStatus
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status
  })

  console.log(status, applications)
  return (
    <div className="min-w-50 rounded-lg border bg-card p-3 space-y-2">
      <h3 className="font-medium">{STATUS_LABEL[status]}</h3>
      <div ref={setNodeRef} className="space-y-2 min-h-20">
        {applications.map((application) => (
          <KanbanCard key={application.id} application={application} />
        ))}
      </div>
    </div>
  )
}

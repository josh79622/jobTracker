
import { KANBAN_COLUMN_ORDER } from '@/lib/utils'
import { KanbanColumn } from './KanbanColumn'
import { useFilteredApplications } from '@/hooks/useFilteredApplications'

import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { useUpdateApplication } from "@/hooks/useUpdateApplication"
import type { ApplicationStatus } from '@/types/database'

export function KanbanBoard() {
  const { data: applications, isLoading } = useFilteredApplications()
  const updateApplication = useUpdateApplication()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id === over?.id) return
    
    updateApplication.mutate({
      id: active.id as string,
      status: over?.id as ApplicationStatus,
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
console.log(KANBAN_COLUMN_ORDER)
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {KANBAN_COLUMN_ORDER.map((status) => (
          <KanbanColumn key={status} status={status} 
            applications={applications?.filter((app) => app.status === status) || []}
          />
        ))}
      </div>
    </DndContext>
  )
}

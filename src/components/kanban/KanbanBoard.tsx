
import { KANBAN_COLUMN_ORDER } from '@/lib/utils'
import { KanbanColumn } from './KanbanColumn'
import { useFilteredApplications } from '@/hooks/useFilteredApplications'

import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { useUpdateApplication } from "@/hooks/useUpdateApplication"
import type { ApplicationStatus } from '@/types/database'
import { KanbanBoardSkeleton } from "./KanbanBoardSkeleton"
import { useUIStore } from "@/stores/uiStore"

export function KanbanBoard() {
  const { data: applications, isLoading } = useFilteredApplications()
  const updateApplication = useUpdateApplication()
  const filters = useUIStore((s) => s.filters)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id === over?.id) return
    
    updateApplication.mutate({
      id: active.id as string,
      status: over?.id as ApplicationStatus,
    })
  }

  if (isLoading) {
    return <KanbanBoardSkeleton />
  }
  
  const hasFilter = filters.search !== '' || (filters.status?.length ?? 0) > 0
  if (applications.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        {hasFilter ? (
          <p>No applications match your filters.</p>
        ) : (
          <>
            <p>No applications yet.</p>
            <p className="text-sm mt-2">Click "Create New Application" to get started.</p>
          </>
        )}
      </div>
    )
  }

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

import { AppLayout } from '@/components/layout/AppLayout'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { ApplicationTable } from '@/components/applications/ApplicationTable'
import { useUIStore } from '@/stores/uiStore'

export default function ApplicationsPage() {
  const currentView = useUIStore((s) => s.currentView)

  return (
    <AppLayout>
      <h1 className="mb-4  text-2xl font-semibold">Applications</h1>
      {currentView === 'kanban' ? <KanbanBoard /> : <ApplicationTable />}
    </AppLayout>
  )
}

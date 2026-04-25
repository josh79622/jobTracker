import { AppLayout } from '@/components/layout/AppLayout'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { ApplicationTable } from '@/components/applications/ApplicationTable'
import { useUIStore } from '@/stores/uiStore'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ApplicationForm } from '@/components/applications/ApplicationForm'

export default function ApplicationsPage() {
  const currentView = useUIStore((s) => s.currentView)
  const [isApplicationDialogOpen, setApplicationDialogOpen] = useState(false)

  return (
    <AppLayout>
    
      <Button variant="outline" size="sm" className="mb-4" onClick={() => setApplicationDialogOpen(!isApplicationDialogOpen)}>Create New Application</Button>
      <h1 className="mb-4  text-2xl font-semibold">Applications</h1>
      {currentView === 'kanban' ? <KanbanBoard /> : <ApplicationTable />}

      <Dialog open={isApplicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Application</DialogTitle>
          </DialogHeader>
          <ApplicationForm onSubmit={() => setApplicationDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

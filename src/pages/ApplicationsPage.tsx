import { AppLayout } from '@/components/layout/AppLayout'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { ApplicationTable } from '@/components/applications/ApplicationTable'
import { useUIStore } from '@/stores/uiStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { Application } from '@/types/database'
import { ApplicationForm } from '@/components/applications/ApplicationForm'

import { Input } from '@/components/ui/input'
import { APPLICATION_STATUSES } from "@/types/database"
import { STATUS_LABEL } from "@/lib/utils"

export default function ApplicationsPage() {
  const currentView = useUIStore((s) => s.currentView)
  const setView = useUIStore((s) => s.setView)
  const filters = useUIStore((s) => s.filters)
  const updateFilters = useUIStore((s) => s.updateFilters)
  const [isApplicationDialogOpen, setApplicationDialogOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)


  return (
    <AppLayout>
    
      <div className="mb-4 flex items-center justify-between">
        <Button onClick={() => setApplicationDialogOpen(true)}>
          Create New Application
        </Button>

        <div className="flex rounded-md border overflow-hidden">
          <Button
            variant={currentView === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
            onClick={() => setView('kanban')}
          >
            Kanban
          </Button>
          <Button
            variant={currentView === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
            onClick={() => setView('table')}
          >
            Table
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex gap-3">
        <Input
          aria-label="Search applications"
          placeholder="Search company or role..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="max-w-xs"
        />
        <select
          aria-label="Filter by status"
          value={filters.status?.[0] ?? ''}
          onChange={(e) => updateFilters({ status: e.target.value ? [e.target.value as any] : null })}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm"
        >
          <option value="">All Status</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>


      <h1 className="mb-4  text-2xl font-semibold">Applications</h1>
      {currentView === 'kanban' ? <KanbanBoard /> : <ApplicationTable onEdit={(app) => {
          setEditingApp(app)
          setApplicationDialogOpen(true)
        }} />}

      <Dialog open={isApplicationDialogOpen} onOpenChange={(open) => {
        setApplicationDialogOpen(open)
        if (!open) setEditingApp(null)
      }}>
        <DialogContent>
          <DialogHeader>
          <DialogTitle>{editingApp ? 'Edit Application' : 'Create Application'}</DialogTitle>
          </DialogHeader>
          <ApplicationForm
            application={editingApp ?? undefined}
            onSubmit={() => {
              setApplicationDialogOpen(false)
              setEditingApp(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

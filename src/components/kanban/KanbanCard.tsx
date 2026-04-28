import type { Application } from '@/types/database'
import { useDeleteApplication } from "@/hooks/useDeleteApplication"
import { toast } from "sonner"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ApplicationForm } from "@/components/applications/ApplicationForm"

import { GripVertical } from "lucide-react"

import { ApplicationDetail } from '@/components/applications/ApplicationDetail'


interface KanbanCardProps {
  application: Application
}

export function KanbanCard({ application }: KanbanCardProps) {
  const [isApplicationDialogOpen, setApplicationDialogOpen] = useState(false)
  const [isDetailOpen, setDetailOpen] = useState(false)

  const deleteApp = useDeleteApplication()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: application.id })
  const style = {
    transform: CSS.Translate.toString(transform),
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteApp.mutate(application.id, {
        onSuccess: () => toast.success('Application deleted successfully!'),
        onError: () => toast.error('Failed to delete application.')
      })
    }
  }
  
  function setEditOpen(open: boolean) {
    setApplicationDialogOpen(open)
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-md border bg-background p-3 shadow-sm" {...attributes}>
  <div className="flex items-start gap-1 mb-2">
    <div {...listeners} className="cursor-grab mt-0.5 text-muted-foreground shrink-0">
      <GripVertical size={16} />
    </div>
    <div className="min-w-0">
      <button onClick={() => setDetailOpen(true)} className="font-bold hover:underline text-left text-sm truncate w-full block">
        {application.company}
      </button>
      <div className="text-xs text-muted-foreground truncate">{application.role}</div>
    </div>
  </div>

  <div className="flex gap-2 border-t pt-2 mt-1 justify-end">
    <button onClick={() => setEditOpen(true)} className="text-xs text-blue-500 hover:text-blue-950">Edit</button>
    <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-900">Delete</button>
  </div>

  <Dialog open={isApplicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Application</DialogTitle>
      </DialogHeader>
      <ApplicationForm onSubmit={() => setApplicationDialogOpen(false)} application={application}/>
    </DialogContent>
  </Dialog>

  <ApplicationDetail applicationId={application.id} open={isDetailOpen} onOpenChange={setDetailOpen} />
</div>

  )
}



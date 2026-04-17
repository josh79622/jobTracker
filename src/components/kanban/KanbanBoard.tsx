import { KANBAN_COLUMN_ORDER } from '@/lib/utils'
import { KanbanColumn } from './KanbanColumn'

export function KanbanBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {KANBAN_COLUMN_ORDER.map((status) => (
        <KanbanColumn key={status} status={status} />
      ))}
    </div>
  )
}

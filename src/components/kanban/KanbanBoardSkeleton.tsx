import { Skeleton } from "@/components/ui/skeleton";
import { KANBAN_COLUMN_ORDER, STATUS_LABEL } from "@/lib/utils";

export function KanbanBoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {KANBAN_COLUMN_ORDER.map((status) => (
        <div key={status} className="min-w-50 rounded-lg border bg-card p-3 space-y-2">
          {/* column 標題：保留真的文字 or 用 Skeleton */}
          <h3 className="font-medium">{STATUS_LABEL[status]}</h3>
          
          {/* 2~3 張 card skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-md border bg-background p-3 shadow-sm space-y-2">
                <Skeleton className="h-4 w-24" />  {/* company */}
                <Skeleton className="h-3 w-32" />  {/* role */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
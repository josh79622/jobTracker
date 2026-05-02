import { Skeleton } from "@/components/ui/skeleton";
import { COLUMNS } from "./ApplicationTable";

export function ApplicationTableSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {COLUMNS.map(({ label }) => (
              <th key={label} className="px-4 py-3 text-left font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3 font-medium"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3 text-muted-foreground"><Skeleton className="h-4 w-40"/></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full"/></td>
                  <td className="px-4 py-3 text-muted-foreground"><Skeleton className="h-4 w-24"/></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20"/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-14" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </td>
                </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
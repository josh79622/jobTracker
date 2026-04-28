import { useFilteredApplications } from '@/hooks/useFilteredApplications'
import { useDeleteApplication } from '@/hooks/useDeleteApplication'
import { useUIStore } from '@/stores/uiStore'
import { StatusBadge } from './StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { SortField } from '@/stores/uiStore'
import type { Application } from '@/types/database'

import { useState, useEffect } from 'react'
import { Pagination } from '@/components/ui/Pagination'

interface ApplicationTableProps {
  onEdit: (app: Application) => void
}

const COLUMNS: { label: string; field: SortField | null }[] = [
  { label: 'Company', field: 'company' },
  { label: 'Role', field: null },
  { label: 'Status', field: 'status' },
  { label: 'Location', field: null },
  { label: 'Applied Date', field: 'applied_date' },
  { label: 'Actions', field: null },
]

export function ApplicationTable({ onEdit }: ApplicationTableProps) {
  const { data: applications, isLoading } = useFilteredApplications()
  const deleteApplication = useDeleteApplication()
  const sortBy = useUIStore((s) => s.sortBy)
  const sortOrder = useUIStore((s) => s.sortOrder)
  const updateSort = useUIStore((s) => s.updateSort)

  const filters = useUIStore((s) => s.filters)

  const PAGE_SIZE = 10
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(applications.length / PAGE_SIZE)
  const paginated = applications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [filters])

  function handleSort(field: SortField | null) {
    if (!field) return
    if (sortBy === field) {
      updateSort(field, sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      updateSort(field, 'asc')
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (applications.length === 0)
    return <div className="text-muted-foreground py-12 text-center">No applications found.</div>

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {COLUMNS.map(({ label, field }) => (
              <th
                key={label}
                className={`px-4 py-3 text-left font-medium ${field ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                onClick={() => handleSort(field)}
              >
                {label}
                {field && sortBy === field && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((app) => (
            <tr key={app.id} className="border-t hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-medium">{app.company}</td>
              <td className="px-4 py-3 text-muted-foreground">{app.role}</td>
              <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
              <td className="px-4 py-3 text-muted-foreground">{app.location ?? '—'}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(app.applied_date)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(app)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteApplication.mutate(app.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={applications.length}
        onPageChange={setPage}
      />
    </div>
  )
}

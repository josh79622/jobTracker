import { useMemo } from 'react'
import { useApplications } from './useApplications'
import { useUIStore } from "@/stores/uiStore"
import type { Application } from '@/types/database'
import type { SortField, SortOrder } from '@/stores/uiStore'

function sortApplications(apps: Application[], sortBy: SortField, sortOrder: SortOrder) {
  return [...apps].sort((a, b) => {
    let cmp = 0
    if (sortBy === 'company') {
      cmp = a.company.localeCompare(b.company)
    } else if (sortBy === 'status') {
      cmp = a.status.localeCompare(b.status)
    } else {
      // applied_date
      cmp = a.applied_date.localeCompare(b.applied_date)
    }
    return sortOrder === 'asc' ? cmp : -cmp
  })
}

export function useFilteredApplications() {
  const { data: applications = [], isLoading, error } = useApplications()
  const filters = useUIStore((s) => s.filters)
  const sortBy = useUIStore((s) => s.sortBy)
  const sortOrder = useUIStore((s) => s.sortOrder)

  const filtered = useMemo(() => {
    let result = applications

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.role.toLowerCase().includes(q),
      )
    }

    if (filters.status && filters.status.length > 0) {
      result = result.filter((app) => filters.status!.includes(app.status))
    }

    if (filters.dateRange.from) {
      result = result.filter((app) => app.applied_date >= filters.dateRange.from!)
    }
    if (filters.dateRange.to) {
      result = result.filter((app) => app.applied_date <= filters.dateRange.to!)
    }

    return sortApplications(result, sortBy, sortOrder)
  }, [applications, filters, sortBy, sortOrder])

  return { data: filtered, isLoading, error }
}
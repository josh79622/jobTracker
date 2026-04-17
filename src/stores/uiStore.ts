import { create } from 'zustand'
import type { ApplicationStatus } from '@/types/database'

export type ViewMode = 'kanban' | 'table'
export type SortField = 'applied_date' | 'company' | 'status'
export type SortOrder = 'asc' | 'desc'

export interface Filters {
  status: ApplicationStatus[] | null
  search: string
  dateRange: { from: string | null; to: string | null }
}

interface UIState {
  sidebarOpen: boolean
  currentView: ViewMode
  filters: Filters
  sortBy: SortField
  sortOrder: SortOrder
  toggleSidebar: () => void
  setView: (view: ViewMode) => void
  updateFilters: (patch: Partial<Filters>) => void
  updateSort: (sortBy: SortField, sortOrder?: SortOrder) => void
}

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: isDesktop(),
  currentView: 'kanban',
  filters: {
    status: null,
    search: '',
    dateRange: { from: null, to: null },
  },
  sortBy: 'applied_date',
  sortOrder: 'desc',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setView: (view) => set({ currentView: view }),
  updateFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  updateSort: (sortBy, sortOrder) =>
    set((s) => ({ sortBy, sortOrder: sortOrder ?? s.sortOrder })),
}))

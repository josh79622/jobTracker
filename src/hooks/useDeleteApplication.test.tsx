import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useDeleteApplication } from './useDeleteApplication'
import { applicationsKey } from './useApplications'
import type { Application } from '@/types/database'

// Mock supabase client
const deleteEq = vi.fn()
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      delete: () => ({
        eq: deleteEq,
      }),
    }),
  },
}))

// Mock toast
const toastSuccess = vi.fn()
const toastError = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return { wrapper, queryClient }
}

const sampleApp: Application = {
  id: 'app-1',
  user_id: 'user-1',
  company: 'Acme',
  role: 'Engineer',
  url: null,
  status: 'applied',
  salary_min: null,
  salary_max: null,
  location: null,
  notes: null,
  applied_date: '2026-05-01',
  updated_at: '2026-05-01T00:00:00Z',
}

describe('useDeleteApplication', () => {
  beforeEach(() => {
    deleteEq.mockClear()
    toastSuccess.mockClear()
    toastError.mockClear()
  })

  it('shows a success toast when delete succeeds', async () => {
    deleteEq.mockResolvedValueOnce({ error: null })

    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useDeleteApplication(), { wrapper })

    result.current.mutate('app-1')

    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith('Application deleted'))
  })

  it('shows an error toast when delete fails', async () => {
    deleteEq.mockResolvedValueOnce({ error: new Error('DB exploded') })

    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useDeleteApplication(), { wrapper })

    result.current.mutate('app-1')

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Failed to delete application'))
  })

  it('rolls back the cache when delete fails', async () => {
    deleteEq.mockResolvedValueOnce({ error: new Error('boom') })

    const { wrapper, queryClient } = createWrapper()
    queryClient.setQueryData<Application[]>(applicationsKey, [sampleApp])

    const { result } = renderHook(() => useDeleteApplication(), { wrapper })

    result.current.mutate('app-1')

    await waitFor(() => {
      expect(queryClient.getQueryData<Application[]>(applicationsKey)).toEqual([sampleApp])
    })
  })
})
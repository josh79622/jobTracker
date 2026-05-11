import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'  
import { axe } from 'vitest-axe'
import { QueryClient } from '@tanstack/react-query'
import { renderWithProviders } from '@/test/utils'
import { applicationsKey } from '@/hooks/useApplications'
import type { Application } from '@/types/database'
import ApplicationsPage from './ApplicationsPage'

vi.mock('@/hooks/useCreateApplication', () => ({
  useCreateApplication: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@/hooks/useUpdateApplication', () => ({
  useUpdateApplication: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@/hooks/useDeleteApplication', () => ({
  useDeleteApplication: () => ({ mutate: vi.fn(), isPending: false, variables: undefined }),
}))

const apps: Application[] = [
  {
    id: 'app-1',
    user_id: 'u',
    company: 'Acme',
    role: 'Frontend Engineer',
    url: null,
    status: 'applied',
    salary_min: null,
    salary_max: null,
    location: 'Sydney',
    notes: null,
    applied_date: '2026-05-01',
    updated_at: '2026-05-01T00:00:00Z',
  },
]

describe('ApplicationsPage a11y', () => {
  it('has no detectable accessibility violations (table view)', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    queryClient.setQueryData<Application[]>(applicationsKey, apps)

    const { container } = renderWithProviders(<ApplicationsPage />, { queryClient })

    // Switch to table view before running axe — avoids dnd-kit's nested-interactive issue
    await user.click(screen.getByRole('button', { name: /table/i }))

    expect(await axe(container)).toHaveNoViolations()
  })
})
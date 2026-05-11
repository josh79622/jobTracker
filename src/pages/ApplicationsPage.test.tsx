import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderWithProviders } from "@/test/utils"
import { applicationsKey } from "@/hooks/useApplications"
import type { Application } from '@/types/database'
import ApplicationsPage from './ApplicationsPage'

const mutateCreate = vi.fn()
const mutateDelete = vi.fn()
const mutateUpdate = vi.fn()

vi.mock('@/hooks/useCreateApplication', () => ({
  useCreateApplication: () => ({ mutate: mutateCreate, isPending: false }),
}))
vi.mock('@/hooks/useUpdateApplication', () => ({
  useUpdateApplication: () => ({ mutate: mutateUpdate, isPending: false }),
}))
vi.mock('@/hooks/useDeleteApplication', () => ({
  useDeleteApplication: () => ({ mutate: mutateDelete, isPending: false, variables: undefined }),
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
  {
    id: 'app-2',
    user_id: 'u',
    company: 'Globex',
    role: 'Backend Engineer',
    url: null,
    status: 'interview',
    salary_min: null,
    salary_max: null,
    location: 'Melbourne',
    notes: null,
    applied_date: '2026-04-20',
    updated_at: '2026-04-20T00:00:00Z',
  },
]

function setupClientWithApps() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  queryClient.setQueryData<Application[]>(applicationsKey, apps)
  return queryClient
}

describe('ApplicationsPage', () => {
  beforeEach(() => {
    mutateCreate.mockClear()
    mutateDelete.mockClear()
    mutateUpdate.mockClear()
  })

  it('lists existing applications in the table view', async () => {
    const user = userEvent.setup()
    const queryClient = setupClientWithApps()
    renderWithProviders(<ApplicationsPage />, { queryClient })

    // Switch to table view (default is kanban)
    await user.click(screen.getByRole('button', { name: /table/i }))

    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('opens an edit dialog with the application pre-filled when Edit is clicked', async () => {
    const user = userEvent.setup()
    const queryClient = setupClientWithApps()
    renderWithProviders(<ApplicationsPage />, { queryClient })

    await user.click(screen.getByRole('button', { name: /table/i }))

    // Click Edit on the first row
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await user.click(editButtons[0])

    // Dialog opens with title
    expect(await screen.findByText(/edit application/i)).toBeInTheDocument()

    // Form pre-filled with first app's data
    expect(screen.getByLabelText(/company/i)).toHaveValue('Acme')
    expect(screen.getByLabelText(/^role$/i)).toHaveValue('Frontend Engineer')
  })
})
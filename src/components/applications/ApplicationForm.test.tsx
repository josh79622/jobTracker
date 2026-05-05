import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationForm } from "./ApplicationForm"

const mutateCreate = vi.fn()
const mutateUpdate = vi.fn()

vi.mock('@/hooks/useCreateApplication', () => ({
  useCreateApplication: () => ({
    mutate: mutateCreate,
    isPending: false,
  })
}))

vi.mock('@/hooks/useUpdateApplication', () => ({
  useUpdateApplication: () => ({
    mutate: mutateUpdate,
    isPending: false,
  })
}))

describe('ApplicationForm', () => {

  beforeEach(() => {
    mutateCreate.mockReset()
    mutateUpdate.mockReset()
  })
  
  it ('shows a validation error when company is empty', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm />)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText('Company name is required.')).toBeInTheDocument()
  })

  it ('shows a validation error when role is empty', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText('Role is required.')).toBeInTheDocument()
  })

  it ('calls Application.mutate when the form is valid', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm />)

    await user.type(screen.getByLabelText(/company/i), 'Acme Corp')
    await user.type(screen.getByLabelText(/^role$/i), 'Frontend Engineer')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(mutateCreate).toHaveBeenCalled()
  })
})
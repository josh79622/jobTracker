import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ApplicationForm } from './ApplicationForm'

vi.mock('@/hooks/useCreateApplication', () => ({
  useCreateApplication: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@/hooks/useUpdateApplication', () => ({
  useUpdateApplication: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('ApplicationForm a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<ApplicationForm />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

// StatusBadge now resolves its label via useStatusLabel (React Query under the
// hood). Mock it to the real default resolver so these stay pure unit tests.
vi.mock('@/hooks/useStatusLabel', async () => {
  const { getStatusLabel } = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils')
  return { useStatusLabel: () => getStatusLabel }
})

describe('StatusBadge', () => {
  it('renders the label for the given status', () => {
    render(<StatusBadge status="applied" />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('renders different labels for different statuses', () => {
    render(<StatusBadge status="interview" />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    render(<StatusBadge status="applied" className="custom-class"/>)
    const badge = screen.getByText('Applied')
    expect(badge).toHaveClass('custom-class')
  })

})

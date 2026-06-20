import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { StatusBadge } from './StatusBadge'

vi.mock('@/hooks/useStatusLabel', async () => {
  const { getStatusLabel } = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils')
  return { useStatusLabel: () => getStatusLabel }
})

describe('StatusBadge a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<StatusBadge status="applied" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge a11y', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = render(<StatusBadge status="applied" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { KpiGrid } from '../kpi-grid'

afterEach(cleanup)

describe('KpiGrid (React)', () => {
  it('renders container with data-slot="kpi-grid"', () => {
    const { container } = render(<KpiGrid />)
    expect(container.querySelector('[data-slot="kpi-grid"]')).toBeTruthy()
  })

  it('applies columns layout variant', () => {
    const { container } = render(
      <KpiGrid columns={3}>
        <div>Item 1</div>
      </KpiGrid>,
    )
    const el = container.querySelector('[data-slot="kpi-grid"]')
    expect(el?.className).toContain('lg:grid-cols-3')
    expect(container.textContent).toContain('Item 1')
  })
})

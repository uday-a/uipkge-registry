import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Grid } from '../grid'

afterEach(cleanup)

describe('Grid (React)', () => {
  it('renders container with data-slot="grid"', () => {
    const { container } = render(<Grid />)
    expect(container.querySelector('[data-slot="grid"]')).toBeTruthy()
  })

  it('applies column and gap layout classes', () => {
    const { container } = render(
      <Grid cols={3} gap={6}>
        <div>Item</div>
      </Grid>,
    )
    const el = container.querySelector('[data-slot="grid"]')
    expect(el?.className).toContain('grid-cols-3')
    expect(el?.className).toContain('gap-6')
    expect(container.textContent).toContain('Item')
  })
})

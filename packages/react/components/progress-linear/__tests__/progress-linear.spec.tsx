import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProgressLinear } from '../ProgressLinear'

describe('ProgressLinear', () => {
  it('renders with data-slot="progress-linear"', () => {
    const { container } = render(<ProgressLinear value={50} />)
    expect(container.querySelector('[data-slot="progress-linear"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<ProgressLinear value={50} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('has role="progressbar"', () => {
    const { container } = render(<ProgressLinear value={50} />)
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy()
  })

  it('sets aria-valuenow based on value', () => {
    const { container } = render(<ProgressLinear value={60} />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('60')
  })

  it('does not set aria-valuenow when indeterminate', () => {
    const { container } = render(<ProgressLinear value={60} indeterminate />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBeNull()
  })

  it('applies rounded variant class', () => {
    const { container } = render(<ProgressLinear value={50} rounded="none" />)
    expect(container.querySelector('[data-slot="progress-linear"]')?.className).toContain('rounded-none')
  })

  it('clamps value to 0-100 range (above)', () => {
    const { container } = render(<ProgressLinear value={150} />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('100')
  })

  it('clamps value to 0-100 range (below)', () => {
    const { container } = render(<ProgressLinear value={-10} />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('0')
  })
})

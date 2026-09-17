import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CircularProgress } from '../index'

describe('CircularProgress', () => {
  it('renders a container with data-slot="circular-progress"', () => {
    const { container } = render(<CircularProgress />)
    expect(container.querySelector('[data-slot="circular-progress"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<CircularProgress />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders an svg element', () => {
    const { container } = render(<CircularProgress />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('renders a track circle (first circle)', () => {
    const { container } = render(<CircularProgress />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
    expect(circles[0].getAttribute('stroke')).toBe('var(--muted)')
  })

  it('renders a progress circle (second circle)', () => {
    const { container } = render(<CircularProgress value={50} />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
    expect(circles[1].getAttribute('stroke')).toBe('var(--primary)')
    expect(circles[1].getAttribute('stroke-linecap')).toBe('round')
  })

  it('sets data-indeterminate="true" when indeterminate', () => {
    const { container } = render(<CircularProgress indeterminate />)
    expect(container.querySelector('[data-slot="circular-progress"]')?.getAttribute('data-indeterminate')).toBe('true')
  })

  it('sets data-complete="true" when value reaches 100', () => {
    const { container } = render(<CircularProgress value={100} />)
    expect(container.querySelector('[data-slot="circular-progress"]')?.getAttribute('data-complete')).toBe('true')
  })

  it('shows numeric value when showValue is true', () => {
    const { container } = render(<CircularProgress value={42} showValue />)
    expect(container.textContent).toContain('42')
  })
})

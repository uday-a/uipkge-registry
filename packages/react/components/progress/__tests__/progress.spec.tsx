import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Progress } from '../Progress'

describe('Progress', () => {
  it('renders with data-slot="progress"', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-slot="progress"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('has role="progressbar"', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy()
  })

  it('ProgressIndicator renders with data-slot="progress-indicator"', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-slot="progress-indicator"]')).toBeTruthy()
  })

  it('sets aria-valuenow based on value', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('50')
  })

  it('sets aria-valuemin to 0', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuemin')).toBe('0')
  })

  it('sets aria-valuemax to 100', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuemax')).toBe('100')
  })

  it('clamps value to 0-100 range', () => {
    const { container } = render(<Progress value={150} />)
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('100')
  })

  it('renders indicator element', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-slot="progress-indicator"]')).toBeTruthy()
  })
})

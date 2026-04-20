import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RangeCalendar } from '../RangeCalendar'

describe('RangeCalendar', () => {
  it('renders without crashing', () => {
    const { container } = render(<RangeCalendar />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders with data-slot="range-calendar"', () => {
    const { container } = render(<RangeCalendar />)
    expect(container.querySelector('[data-slot="range-calendar"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<RangeCalendar />)
    expect(container.querySelector('[data-slot="range-calendar"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders a grid', () => {
    const { container } = render(<RangeCalendar />)
    expect(container.querySelector('[role="grid"]')).toBeTruthy()
  })

  it('renders weekday headers', () => {
    const { container } = render(<RangeCalendar />)
    const headers = container.querySelectorAll('[role="grid"] thead th')
    expect(headers.length).toBeGreaterThan(0)
  })

  it('has navigation buttons', () => {
    const { container } = render(<RangeCalendar />)
    const prev = container.querySelector('button[aria-label*="Previous"]')
    const next = container.querySelector('button[aria-label*="Next"]')
    expect(prev).toBeTruthy()
    expect(next).toBeTruthy()
  })

  it('renders seven weekday headers', () => {
    const { container } = render(<RangeCalendar />)
    const headers = container.querySelectorAll('[role="grid"] thead th')
    expect(headers.length).toBe(7)
  })

  it('renders day buttons in the grid', () => {
    const { container } = render(<RangeCalendar />)
    const grid = container.querySelector('[role="grid"]')
    expect(grid?.querySelectorAll('button').length).toBeGreaterThan(0)
  })
})

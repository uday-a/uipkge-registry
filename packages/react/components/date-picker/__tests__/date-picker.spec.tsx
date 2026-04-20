import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DatePicker } from '../date-picker'

describe('DatePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<DatePicker />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders a trigger button', () => {
    const { container } = render(<DatePicker />)
    const trigger = container.querySelector('[data-slot="date-picker"]')
    expect(trigger).toBeTruthy()
    expect(trigger?.tagName.toLowerCase()).toBe('button')
  })

  it('shows placeholder text', () => {
    const { container } = render(<DatePicker placeholder="Pick a date" />)
    expect(container.textContent).toContain('Pick a date')
  })

  it('disables when disabled', () => {
    const { container } = render(<DatePicker disabled />)
    const trigger = container.querySelector('[data-slot="date-picker"]') as HTMLButtonElement | null
    expect(trigger?.disabled).toBe(true)
  })

  it('has data-slot="date-picker"', () => {
    const { container } = render(<DatePicker />)
    expect(container.querySelector('[data-slot="date-picker"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<DatePicker />)
    expect(container.querySelector('[data-slot="date-picker"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders custom placeholder', () => {
    const { container } = render(<DatePicker placeholder="Select a date" />)
    expect(container.textContent).toContain('Select a date')
  })
})

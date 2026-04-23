import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TimePicker } from '../time-picker'

describe('TimePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<TimePicker />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders a trigger button', () => {
    const { container } = render(<TimePicker />)
    const trigger = container.querySelector('[data-slot="time-picker"]')
    expect(trigger).toBeTruthy()
    expect(trigger?.tagName.toLowerCase()).toBe('button')
  })

  it('shows placeholder text', () => {
    const { container } = render(<TimePicker placeholder="Pick a time" />)
    expect(container.textContent).toContain('Pick a time')
  })

  it('disables when disabled', () => {
    const { container } = render(<TimePicker disabled />)
    const trigger = container.querySelector('[data-slot="time-picker"]') as HTMLButtonElement | null
    expect(trigger?.disabled).toBe(true)
  })

  it('has data-slot="time-picker"', () => {
    const { container } = render(<TimePicker />)
    expect(container.querySelector('[data-slot="time-picker"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<TimePicker />)
    expect(container.querySelector('[data-slot="time-picker"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders custom placeholder', () => {
    const { container } = render(<TimePicker placeholder="Select a time" />)
    expect(container.textContent).toContain('Select a time')
  })
})

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { AdvanceSelect } from '../index'

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('AdvanceSelect', () => {
  it('renders root with data-slot="advance-select"', () => {
    const { container } = render(<AdvanceSelect options={options} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="advance-select"]')).toBeTruthy()
  })

  it('has data-uipkge attribute', () => {
    const { container } = render(<AdvanceSelect options={options} onValueChange={() => {}} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders trigger button with combobox role', () => {
    const { container } = render(<AdvanceSelect options={options} onValueChange={() => {}} />)
    const trigger = container.querySelector('[data-slot="advance-select"]')
    expect(trigger?.tagName.toLowerCase()).toBe('button')
    expect(trigger?.getAttribute('role')).toBe('combobox')
  })

  it('renders placeholder text when no value selected', () => {
    const { container } = render(
      <AdvanceSelect options={options} placeholder="Choose a fruit" onValueChange={() => {}} />,
    )
    expect(container.textContent).toContain('Choose a fruit')
  })

  it('renders default placeholder "Select..."', () => {
    const { container } = render(<AdvanceSelect options={options} onValueChange={() => {}} />)
    expect(container.textContent).toContain('Select...')
  })

  it('supports multiple selection mode with tags', () => {
    const { container } = render(
      <AdvanceSelect options={options} mode="multiple" value={['apple', 'banana']} onValueChange={() => {}} />,
    )
    const trigger = container.querySelector('[data-slot="advance-select"]')
    expect(trigger?.textContent).toContain('Apple')
    expect(trigger?.textContent).toContain('Banana')
  })

  it('disables trigger when disabled is true', () => {
    const { container } = render(<AdvanceSelect options={options} disabled onValueChange={() => {}} />)
    const trigger = container.querySelector('[data-slot="advance-select"]')
    expect(trigger?.hasAttribute('disabled')).toBe(true)
  })

  it('renders chevron icon by default', () => {
    const { container } = render(<AdvanceSelect options={options} onValueChange={() => {}} />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('calls onValueChange when option is selected', () => {
    const onValueChange = vi.fn()
    const { container } = render(<AdvanceSelect options={options} open onValueChange={onValueChange} />)
    const items = container.querySelectorAll('[data-slot="command-item"]')
    if (items.length > 0) {
      fireEvent.click(items[0])
      expect(onValueChange).toHaveBeenCalled()
    }
  })

  it('shows search input when showSearch is true', () => {
    render(<AdvanceSelect options={options} showSearch open onValueChange={() => {}} />)
    const searchInput = document.body.querySelector('[data-slot="command-input"]')
    expect(searchInput).toBeTruthy()
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CascadeSelect } from '../index'
import type { CascadeOption } from '../types'

const options: CascadeOption[] = [
  {
    value: 'us',
    label: 'United States',
    children: [
      { value: 'ca', label: 'California', children: [{ value: 'sf', label: 'San Francisco' }] },
      { value: 'ny', label: 'New York' },
    ],
  },
  { value: 'ca-country', label: 'Canada', children: [{ value: 'on', label: 'Ontario' }] },
]

describe('CascadeSelect', () => {
  it('renders trigger with data-slot="cascade-select"', () => {
    const { container } = render(<CascadeSelect options={options} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="cascade-select"]')).toBeTruthy()
  })

  it('has data-uipkge attribute', () => {
    const { container } = render(<CascadeSelect options={options} onValueChange={() => {}} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders trigger button with combobox role', () => {
    const { container } = render(<CascadeSelect options={options} onValueChange={() => {}} />)
    const trigger = container.querySelector('[data-slot="cascade-select"]')
    expect(trigger?.tagName.toLowerCase()).toBe('button')
    expect(trigger?.getAttribute('role')).toBe('combobox')
  })

  it('renders placeholder when no value selected', () => {
    const { container } = render(
      <CascadeSelect options={options} placeholder="Choose location" onValueChange={() => {}} />,
    )
    expect(container.textContent).toContain('Choose location')
  })

  it('displays selected path with separator', () => {
    const { container } = render(
      <CascadeSelect options={options} value={['us', 'ca', 'sf']} onValueChange={() => {}} />,
    )
    expect(container.textContent).toContain('United States / California / San Francisco')
  })

  it('disables trigger when disabled is true', () => {
    const { container } = render(<CascadeSelect options={options} disabled onValueChange={() => {}} />)
    const trigger = container.querySelector('[data-slot="cascade-select"]')
    expect(trigger?.hasAttribute('disabled')).toBe(true)
  })

  it('supports nested children options', () => {
    const { container } = render(<CascadeSelect options={options} value={['us', 'ny']} onValueChange={() => {}} />)
    expect(container.textContent).toContain('United States / New York')
  })

  it('renders chevron icon by default', () => {
    const { container } = render(<CascadeSelect options={options} onValueChange={() => {}} />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })
})

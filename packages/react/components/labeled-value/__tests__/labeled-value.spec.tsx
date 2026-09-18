import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LabeledValue } from '../index'

describe('LabeledValue', () => {
  it('renders with data-slot="labeled-value"', () => {
    const { container } = render(<LabeledValue label="Name" />)
    expect(container.querySelector('[data-slot="labeled-value"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<LabeledValue label="Name" />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders as a div container', () => {
    const { container } = render(<LabeledValue label="Name" />)
    expect(container.querySelector('[data-slot="labeled-value"]')?.tagName.toLowerCase()).toBe('div')
  })

  it('renders the label in data-slot="labeled-value-label"', () => {
    const { container } = render(<LabeledValue label="Status" />)
    const label = container.querySelector('[data-slot="labeled-value-label"]')
    expect(label).toBeTruthy()
    expect(label?.textContent).toBe('Status')
  })

  it('renders the value in data-slot="labeled-value-value"', () => {
    const { container } = render(<LabeledValue label="Status" value="Active" />)
    const value = container.querySelector('[data-slot="labeled-value-value"]')
    expect(value).toBeTruthy()
    expect(value?.textContent).toBe('Active')
  })

  it('renders children instead of value when children are provided', () => {
    const { container } = render(
      <LabeledValue label="Status" value="Active">
        <span data-slot="custom">Custom</span>
      </LabeledValue>,
    )
    expect(container.querySelector('[data-slot="custom"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="labeled-value-value"]')).toBeFalsy()
  })
})

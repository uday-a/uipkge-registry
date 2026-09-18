import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select'

describe('Select', () => {
  it('renders trigger with data-slot="select-trigger"', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')).toBeTruthy()
  })

  it('renders placeholder text', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.textContent).toContain('Choose...')
  })

  it('applies size data attribute', () => {
    const { container } = render(
      <Select>
        <SelectTrigger size="lg">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('data-size')).toBe('lg')
  })

  it('applies state data attribute', () => {
    const { container } = render(
      <Select>
        <SelectTrigger state="error">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('data-state-value')).toBe('error')
  })

  it('shows loading state (aria-busy)', () => {
    const { container } = render(
      <Select>
        <SelectTrigger loading>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    const trigger = container.querySelector('[data-slot="select-trigger"]')!
    expect(trigger.getAttribute('aria-busy')).toBe('true')
  })

  it('disables trigger when disabled', () => {
    const { container } = render(
      <Select>
        <SelectTrigger disabled>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('disables trigger when loading', () => {
    const { container } = render(
      <Select>
        <SelectTrigger loading>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('renders chevron icon (svg) when not loading', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"] svg')).toBeTruthy()
  })

  it('renders loader icon (svg) when loading', () => {
    const { container } = render(
      <Select>
        <SelectTrigger loading>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"] svg')).toBeTruthy()
  })

  it('renders SelectValue with data-slot="select-value"', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-value"]')).toBeTruthy()
  })

  it('renders a button trigger element', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('applies sm size data attribute', () => {
    const { container } = render(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('data-size')).toBe('sm')
  })

  it('applies success state data attribute', () => {
    const { container } = render(
      <Select>
        <SelectTrigger state="success">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('data-state-value')).toBe('success')
  })
})

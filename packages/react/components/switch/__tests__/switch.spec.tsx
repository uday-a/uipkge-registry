import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Switch } from '../Switch'

describe('Switch', () => {
  it('renders with data-slot="switch"', () => {
    const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch"]')).toBeTruthy()
  })

  it('renders switch role', () => {
    const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)
    expect(container.querySelector('[role="switch"]')).toBeTruthy()
  })

  it('shows unchecked state (data-state="unchecked")', () => {
    const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('unchecked')
  })

  it('shows checked state (data-state="checked")', () => {
    const { container } = render(<Switch checked={true} onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('checked')
  })

  it('renders thumb with data-slot="switch-thumb"', () => {
    const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch-thumb"]')).toBeTruthy()
  })

  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn()
    const { container } = render(<Switch checked={false} onCheckedChange={onCheckedChange} />)
    const sw = container.querySelector('[data-slot="switch"]')!
    fireEvent.click(sw)
    expect(onCheckedChange).toHaveBeenCalled()
  })

  it('disables when disabled', () => {
    const { container } = render(<Switch checked={false} disabled onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('disables when loading', () => {
    const { container } = render(<Switch checked={false} loading onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('renders checkedChildren text when checked', () => {
    const { getByText } = render(<Switch checked={true} checkedChildren="ON" onCheckedChange={() => {}} />)
    expect(getByText('ON')).toBeTruthy()
  })

  it('renders unCheckedChildren text when unchecked', () => {
    const { getByText } = render(<Switch checked={false} unCheckedChildren="OFF" onCheckedChange={() => {}} />)
    expect(getByText('OFF')).toBeTruthy()
  })

  it('uses defaultChecked when uncontrolled', () => {
    const { container } = render(<Switch defaultChecked />)
    expect(container.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('checked')
  })

  it('renders a button element', () => {
    const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('shows loading spinner svg when loading', () => {
    const { container } = render(<Switch checked={false} loading onCheckedChange={() => {}} />)
    expect(container.querySelector('[data-slot="switch-thumb"] svg')).toBeTruthy()
  })
})

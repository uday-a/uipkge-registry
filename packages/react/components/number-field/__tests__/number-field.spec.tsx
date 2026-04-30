import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { NumberField } from '../number-field'

describe('NumberField', () => {
  it('renders with data-slot="number-field"', () => {
    const { container } = render(<NumberField value={5} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="number-field"]')).toBeTruthy()
  })

  it('renders input', () => {
    const { container } = render(<NumberField value={5} onValueChange={() => {}} />)
    expect(container.querySelector('input')).toBeTruthy()
  })

  it('renders increment button with data-slot="increment"', () => {
    const { container } = render(<NumberField value={5} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="increment"]')).toBeTruthy()
  })

  it('renders decrement button with data-slot="decrement"', () => {
    const { container } = render(<NumberField value={5} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="decrement"]')).toBeTruthy()
  })

  it('shows current value', () => {
    const { container } = render(<NumberField value={5} onValueChange={() => {}} />)
    expect(container.querySelector('input')?.getAttribute('value')).toBe('5')
  })

  it('increments when button clicked', () => {
    const onValueChange = vi.fn()
    const { container } = render(<NumberField value={5} onValueChange={onValueChange} />)
    const increment = container.querySelector('[data-slot="increment"]')!
    fireEvent.click(increment)
    expect(onValueChange).toHaveBeenCalledWith(6)
  })

  it('decrements when button clicked', () => {
    const onValueChange = vi.fn()
    const { container } = render(<NumberField value={5} onValueChange={onValueChange} />)
    const decrement = container.querySelector('[data-slot="decrement"]')!
    fireEvent.click(decrement)
    expect(onValueChange).toHaveBeenCalledWith(4)
  })

  it('respects min', () => {
    const onValueChange = vi.fn()
    const { container } = render(<NumberField value={1} min={0} onValueChange={onValueChange} />)
    const decrement = container.querySelector('[data-slot="decrement"]')!
    fireEvent.click(decrement)
    expect(onValueChange).toHaveBeenCalledWith(0)
  })

  it('disables decrement button at min', () => {
    const { container } = render(<NumberField value={0} min={0} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="decrement"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('respects max', () => {
    const onValueChange = vi.fn()
    const { container } = render(<NumberField value={9} max={10} onValueChange={onValueChange} />)
    const increment = container.querySelector('[data-slot="increment"]')!
    fireEvent.click(increment)
    expect(onValueChange).toHaveBeenCalledWith(10)
  })

  it('disables increment button at max', () => {
    const { container } = render(<NumberField value={10} max={10} onValueChange={() => {}} />)
    expect(container.querySelector('[data-slot="increment"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('respects step', () => {
    const onValueChange = vi.fn()
    const { container } = render(<NumberField value={5} step={5} onValueChange={onValueChange} />)
    const increment = container.querySelector('[data-slot="increment"]')!
    fireEvent.click(increment)
    expect(onValueChange).toHaveBeenCalledWith(10)
  })

  it('disables when disabled', () => {
    const { container } = render(<NumberField value={5} disabled onValueChange={() => {}} />)
    expect(container.querySelector('input')?.hasAttribute('disabled')).toBe(true)
  })

  it('renders prefix', () => {
    const { getByText } = render(<NumberField value={5} prefix="$" onValueChange={() => {}} />)
    expect(getByText('$')).toBeTruthy()
  })

  it('renders suffix', () => {
    const { getByText } = render(<NumberField value={5} suffix="kg" onValueChange={() => {}} />)
    expect(getByText('kg')).toBeTruthy()
  })

  it('sets aria-valuenow', () => {
    const { container } = render(<NumberField value={7} onValueChange={() => {}} />)
    expect(container.querySelector('input')?.getAttribute('aria-valuenow')).toBe('7')
  })

  it('calls onValueChange when typing and committing', () => {
    const onValueChange = vi.fn()
    const { container } = render(<NumberField value={5} onValueChange={onValueChange} />)
    const input = container.querySelector('input')!
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '12' } })
    fireEvent.blur(input)
    expect(onValueChange).toHaveBeenCalledWith(12)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { PasswordInput } from '../PasswordInput'

describe('PasswordInput', () => {
  it('renders with data-slot="password-input"', () => {
    const { container } = render(<PasswordInput value="" onChange={() => {}} />)
    expect(container.querySelector('[data-slot="password-input"]')).toBeTruthy()
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders a native input of type password by default', () => {
    const { container } = render(<PasswordInput value="" onChange={() => {}} />)
    const input = container.querySelector('input')!
    expect(input).toBeTruthy()
    expect(input.getAttribute('type')).toBe('password')
  })

  it('binds value to the input element', () => {
    const { container } = render(<PasswordInput value="secret123" onChange={() => {}} />)
    expect(container.querySelector('input')?.value).toBe('secret123')
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    const { container } = render(<PasswordInput value="" onChange={onChange} />)
    fireEvent.change(container.querySelector('input')!, { target: { value: 'pass' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('toggles password visibility when toggle button is clicked', () => {
    const { container } = render(<PasswordInput value="secret" onChange={() => {}} />)
    expect(container.querySelector('input')?.getAttribute('type')).toBe('password')
    const toggleBtn = container.querySelector('button')!
    expect(toggleBtn).toBeTruthy()
    fireEvent.click(toggleBtn)
    expect(container.querySelector('input')?.getAttribute('type')).toBe('text')
  })

  it('hides toggle button when showToggle is false', () => {
    const { container } = render(<PasswordInput value="" showToggle={false} onChange={() => {}} />)
    expect(container.querySelector('button')).toBeNull()
  })

  it('shows strength meter when showStrength is true and value exists', () => {
    const { container } = render(<PasswordInput value="weak" showStrength onChange={() => {}} />)
    expect(container.querySelector('[role="status"]')).toBeTruthy()
  })

  it('does not show strength meter when value is empty', () => {
    const { container } = render(<PasswordInput value="" showStrength onChange={() => {}} />)
    expect(container.querySelector('[role="status"]')).toBeNull()
  })

  it('renders placeholder', () => {
    const { container } = render(<PasswordInput value="" placeholder="Enter password" onChange={() => {}} />)
    expect(container.querySelector('input')?.getAttribute('placeholder')).toBe('Enter password')
  })

  it('disables input when disabled prop is true', () => {
    const { container } = render(<PasswordInput value="" disabled onChange={() => {}} />)
    expect(container.querySelector('input')?.hasAttribute('disabled')).toBe(true)
  })

  it('uses defaultValue when uncontrolled', () => {
    const { container } = render(<PasswordInput defaultValue="default-pass" />)
    expect(container.querySelector('input')?.value).toBe('default-pass')
  })
})

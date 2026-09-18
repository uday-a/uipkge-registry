import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Separator } from '../Separator'

describe('Separator', () => {
  it('renders with data-slot="separator"', () => {
    const { container } = render(<Separator />)
    expect(container.querySelector('[data-slot="separator"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Separator />)
    expect(container.querySelector('[data-slot="separator"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('has role="separator" when not decorative', () => {
    const { container } = render(<Separator decorative={false} />)
    expect(container.querySelector('[data-slot="separator"]')?.getAttribute('role')).toBe('separator')
  })

  it('has data-orientation="horizontal" by default', () => {
    const { container } = render(<Separator />)
    expect(container.querySelector('[data-slot="separator"]')?.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('has data-orientation="vertical" when orientation prop is vertical', () => {
    const { container } = render(<Separator orientation="vertical" />)
    expect(container.querySelector('[data-slot="separator"]')?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('is decorative by default (role="none")', () => {
    const { container } = render(<Separator />)
    const el = container.querySelector('[data-slot="separator"]')
    expect(el?.getAttribute('role')).toBe('none')
    expect(el?.getAttribute('aria-orientation')).toBe(null)
  })
})

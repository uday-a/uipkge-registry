import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { BackTop } from '../index'

describe('BackTop', () => {
  it('renders button with data-slot="back-top"', () => {
    const { container } = render(<BackTop threshold={0} />)
    expect(container.querySelector('[data-slot="back-top"]')).toBeTruthy()
  })

  it('has data-uipkge attribute', () => {
    const { container } = render(<BackTop threshold={0} />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders a button element', () => {
    const { container } = render(<BackTop threshold={0} />)
    const btn = container.querySelector('[data-slot="back-top"]')
    expect(btn?.tagName.toLowerCase()).toBe('button')
  })

  it('applies data-state="open" when visible', () => {
    const { container } = render(<BackTop threshold={0} />)
    expect(container.querySelector('[data-slot="back-top"]')?.getAttribute('data-state')).toBe('open')
  })

  it('applies data-size attribute', () => {
    const { container } = render(<BackTop threshold={0} size="lg" />)
    expect(container.querySelector('[data-slot="back-top"]')?.getAttribute('data-size')).toBe('lg')
  })

  it('applies data-position attribute', () => {
    const { container } = render(<BackTop threshold={0} position="top-left" />)
    expect(container.querySelector('[data-slot="back-top"]')?.getAttribute('data-position')).toBe('top-left')
  })

  it('renders arrow icon by default', () => {
    const { container } = render(<BackTop threshold={0} />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('has accessible aria-label', () => {
    const { container } = render(<BackTop threshold={0} ariaLabel="Back to top" />)
    expect(container.querySelector('[data-slot="back-top"]')?.getAttribute('aria-label')).toBe('Back to top')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const { container } = render(<BackTop threshold={0} onClick={onClick} />)
    const btn = container.querySelector('[data-slot="back-top"]')
    if (btn) {
      fireEvent.click(btn)
      expect(onClick).toHaveBeenCalled()
    }
  })
})

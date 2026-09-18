import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Marquee } from '../index'

describe('Marquee', () => {
  it('renders a container with data-slot="marquee"', () => {
    const { container } = render(<Marquee />)
    expect(container.querySelector('[data-slot="marquee"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Marquee />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders children content inside tracks', () => {
    const { container } = render(<Marquee>Item</Marquee>)
    expect(container.textContent).toContain('Item')
  })

  it('applies data-direction prop', () => {
    const { container } = render(<Marquee direction="right" />)
    expect(container.querySelector('[data-slot="marquee"]')?.getAttribute('data-direction')).toBe('right')
  })

  it('applies data-orientation prop', () => {
    const { container } = render(<Marquee orientation="vertical" />)
    expect(container.querySelector('[data-slot="marquee"]')?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('renders multiple tracks based on repeat prop', () => {
    const { container } = render(<Marquee repeat={3} />)
    expect(container.querySelectorAll('[data-slot="marquee-track"]')).toHaveLength(3)
  })

  it('has role="region" and aria-roledescription="marquee"', () => {
    const { container } = render(<Marquee />)
    const el = container.querySelector('[data-slot="marquee"]')
    expect(el?.getAttribute('role')).toBe('region')
    expect(el?.getAttribute('aria-roledescription')).toBe('marquee')
  })
})

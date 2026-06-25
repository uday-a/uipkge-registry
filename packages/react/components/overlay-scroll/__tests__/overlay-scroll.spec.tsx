import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { OverlayScroll } from '../overlay-scroll'

describe('OverlayScroll', () => {
  it('renders with data-slot="overlay-scroll"', () => {
    const { container } = render(<OverlayScroll />)
    expect(container.querySelector('[data-slot="overlay-scroll"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<OverlayScroll />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders viewport with data-slot="overlay-scroll-viewport"', () => {
    const { container } = render(<OverlayScroll />)
    expect(container.querySelector('[data-slot="overlay-scroll-viewport"]')).toBeTruthy()
  })

  it('renders thumb with data-slot="overlay-scroll-thumb"', () => {
    const { container } = render(<OverlayScroll />)
    expect(container.querySelector('[data-slot="overlay-scroll-thumb"]')).toBeTruthy()
  })

  it('renders children inside the viewport', () => {
    const { container } = render(
      <OverlayScroll>
        <p>Content</p>
      </OverlayScroll>,
    )
    expect(container.querySelector('[data-slot="overlay-scroll-viewport"]')?.textContent).toContain('Content')
  })

  it('applies custom className to the container', () => {
    const { container } = render(<OverlayScroll className="h-64" />)
    expect(container.querySelector('[data-slot="overlay-scroll"]')?.className).toContain('h-64')
  })
})

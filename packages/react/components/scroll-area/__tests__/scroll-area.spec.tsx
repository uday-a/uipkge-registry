import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ScrollArea } from '../scroll-area'

describe('ScrollArea', () => {
  it('renders with data-slot="scroll-area"', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>,
    )
    expect(container.querySelector('[data-slot="scroll-area"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>,
    )
    expect(container.querySelector('[data-slot="scroll-area"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders viewport', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>,
    )
    expect(container.querySelector('[data-slot="scroll-area-viewport"]')).toBeTruthy()
  })

  it('renders children', () => {
    const { container } = render(
      <ScrollArea>
        <div>Scrollable content</div>
      </ScrollArea>,
    )
    expect(container.querySelector('[data-slot="scroll-area-viewport"]')?.textContent).toContain('Scrollable content')
  })

  it('renders without crashing with content', () => {
    const { container } = render(
      <ScrollArea className="custom">
        <div>
          <p>Line 1</p>
          <p>Line 2</p>
        </div>
      </ScrollArea>,
    )
    expect(container.querySelector('[data-slot="scroll-area"]')).toBeTruthy()
    expect(container.querySelectorAll('p').length).toBe(2)
  })

  it('viewport has overflow style set (scroll behavior initialized)', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>,
    )
    const viewport = container.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement
    expect(viewport).toBeTruthy()
    expect(viewport.style.overflowY).toBeTruthy()
  })
})

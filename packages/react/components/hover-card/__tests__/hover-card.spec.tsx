import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../hover-card'

afterEach(cleanup)

describe('HoverCard', () => {
  it('HoverCardTrigger renders with data-slot="hover-card-trigger"', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>,
    )
    expect(container.querySelector('[data-slot="hover-card-trigger"]')).toBeTruthy()
  })

  it('HoverCardContent has data-slot="hover-card-content" when open', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>,
    )
    expect(document.body.querySelector('[data-slot="hover-card-content"]')).toBeTruthy()
  })

  it('HoverCardContent has data-uipkge', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>,
    )
    expect(document.body.querySelector('[data-slot="hover-card-content"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('HoverCardContent has data-state="open" when open', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>,
    )
    expect(document.body.querySelector('[data-slot="hover-card-content"]')?.getAttribute('data-state')).toBe('open')
  })

  it('HoverCardContent renders children', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>My Hover Content</HoverCardContent>
      </HoverCard>,
    )
    expect(document.body.querySelector('[data-slot="hover-card-content"]')?.textContent).toContain('My Hover Content')
  })

  it('HoverCardTrigger renders children', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>Hover Me</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>,
    )
    expect(container.textContent).toContain('Hover Me')
  })
})

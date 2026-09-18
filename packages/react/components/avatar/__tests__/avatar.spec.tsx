import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { render } from '@testing-library/react'

// Radix Avatar.Image only renders the <img> after the browser fires onload,
// which jsdom never does. Mock the module so Image always renders.
vi.mock('@radix-ui/react-avatar', () => ({
  Root: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) =>
    React.createElement('span', { ref, ...props }, children),
  ),
  Image: React.forwardRef<HTMLImageElement, any>((props, ref) => React.createElement('img', { ref, ...props })),
  Fallback: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) =>
    React.createElement('span', { ref, ...props }, children),
  ),
}))

import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '../avatar'

describe('Avatar', () => {
  it('renders with data-slot="avatar"', () => {
    const { container } = render(<Avatar />)
    expect(container.querySelector('[data-slot="avatar"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Avatar />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('AvatarImage renders with data-slot="avatar-image"', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/img.png" alt="User" />
      </Avatar>,
    )
    expect(container.querySelector('[data-slot="avatar-image"]')).toBeTruthy()
  })

  it('AvatarImage renders an img element with src', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/img.png" alt="User" />
      </Avatar>,
    )
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('src')).toBe('https://example.com/img.png')
  })

  it('AvatarFallback renders with data-slot="avatar-fallback"', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    expect(container.querySelector('[data-slot="avatar-fallback"]')).toBeTruthy()
  })

  it('AvatarFallback renders text prop', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback text="JD" />
      </Avatar>,
    )
    expect(container.textContent).toContain('JD')
  })

  it('AvatarFallback renders children', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>XY</AvatarFallback>
      </Avatar>,
    )
    expect(container.textContent).toContain('XY')
  })

  it('AvatarGroup renders with data-slot="avatar-group"', () => {
    const { container } = render(<AvatarGroup />)
    expect(container.querySelector('[data-slot="avatar-group"]')).toBeTruthy()
  })

  it('AvatarGroup has data-uipkge', () => {
    const { container } = render(<AvatarGroup />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('AvatarGroup renders as a div', () => {
    const { container } = render(<AvatarGroup />)
    expect(container.querySelector('[data-slot="avatar-group"]')?.tagName.toLowerCase()).toBe('div')
  })

  it('renders children', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    expect(container.textContent).toContain('AB')
  })

  it('applies size classes', () => {
    const { container } = render(<Avatar size="lg" />)
    expect(container.querySelector('[data-slot="avatar"]')?.className).toContain('size-12')
  })

  it('AvatarImage has alt text', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/img.png" alt="Profile picture" />
      </Avatar>,
    )
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('Profile picture')
  })
})

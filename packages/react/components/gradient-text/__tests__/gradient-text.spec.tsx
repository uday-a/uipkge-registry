import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GradientText } from '../index'

describe('GradientText', () => {
  it('renders with data-slot="gradient-text"', () => {
    const { container } = render(<GradientText />)
    expect(container.querySelector('[data-slot="gradient-text"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<GradientText />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders as a span by default', () => {
    const { container } = render(<GradientText />)
    expect(container.querySelector('[data-slot="gradient-text"]')?.tagName.toLowerCase()).toBe('span')
  })

  it('renders children text content', () => {
    const { container } = render(<GradientText>Hello gradient</GradientText>)
    expect(container.textContent).toContain('Hello gradient')
  })

  it('applies data-preset when preset prop is set', () => {
    const { container } = render(<GradientText preset="sunset" />)
    expect(container.querySelector('[data-slot="gradient-text"]')?.getAttribute('data-preset')).toBe('sunset')
  })

  it('applies data-animated="true" when animated prop is set', () => {
    const { container } = render(<GradientText animated />)
    expect(container.querySelector('[data-slot="gradient-text"]')?.getAttribute('data-animated')).toBe('true')
  })

  it('does not set data-animated by default', () => {
    const { container } = render(<GradientText />)
    expect(container.querySelector('[data-slot="gradient-text"]')?.getAttribute('data-animated')).toBe(null)
  })
})

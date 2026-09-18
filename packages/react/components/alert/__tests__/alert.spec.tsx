import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '../alert'

describe('Alert', () => {
  it('renders with data-slot="alert"', () => {
    const { container } = render(<Alert />)
    expect(container.querySelector('[data-slot="alert"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Alert />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('has role="alert"', () => {
    const { container } = render(<Alert />)
    expect(container.querySelector('[role="alert"]')).toBeTruthy()
  })

  it('renders title text when title prop is set', () => {
    const { container } = render(<Alert title="Heads up" />)
    expect(container.textContent).toContain('Heads up')
  })

  it('renders text prop content', () => {
    const { container } = render(<Alert text="Something happened" />)
    expect(container.textContent).toContain('Something happened')
  })

  it('renders children', () => {
    const { container } = render(<Alert>Child content</Alert>)
    expect(container.textContent).toContain('Child content')
  })

  it('AlertTitle renders with data-slot="alert-title"', () => {
    const { container } = render(<AlertTitle>Title</AlertTitle>)
    expect(container.querySelector('[data-slot="alert-title"]')).toBeTruthy()
  })

  it('AlertTitle renders as h5 by default', () => {
    const { container } = render(<AlertTitle>Title</AlertTitle>)
    expect(container.querySelector('h5')).toBeTruthy()
  })

  it('AlertDescription renders with data-slot="alert-description"', () => {
    const { container } = render(<AlertDescription>Description</AlertDescription>)
    expect(container.querySelector('[data-slot="alert-description"]')).toBeTruthy()
  })

  it('AlertDescription renders as a div', () => {
    const { container } = render(<AlertDescription>Description</AlertDescription>)
    expect(container.querySelector('[data-slot="alert-description"]')?.tagName.toLowerCase()).toBe('div')
  })

  it('applies variant classes (destructive)', () => {
    const { container } = render(<Alert variant="destructive" />)
    const el = container.querySelector('[data-slot="alert"]')
    expect(el?.className).toContain('destructive')
  })

  it('renders icon based on icon prop', () => {
    const { container } = render(<Alert icon="info" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})

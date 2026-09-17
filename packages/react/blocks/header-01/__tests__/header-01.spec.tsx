import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Header01 } from '../Header01'

describe('Header01', () => {
  it('renders without crashing', () => {
    const { container } = render(<Header01 />)
    expect(container.querySelector('header')).toBeTruthy()
  })

  it('renders the brand/logo with name Acme', () => {
    const { container } = render(<Header01 />)
    expect(container.textContent).toContain('Acme')
  })

  it('renders primary navigation links', () => {
    const { container } = render(<Header01 />)
    const nav = container.querySelector('nav[aria-label="Primary"]')
    expect(nav).toBeTruthy()
    expect(nav?.textContent).toContain('Features')
    expect(nav?.textContent).toContain('Pricing')
    expect(nav?.textContent).toContain('Docs')
  })

  it('renders a Sign in button', () => {
    const { container } = render(<Header01 />)
    const buttons = container.querySelectorAll('button')
    const signIn = Array.from(buttons).find((b) => b.textContent?.trim() === 'Sign in')
    expect(signIn).toBeTruthy()
  })

  it('renders a Start free trial button', () => {
    const { container } = render(<Header01 />)
    const buttons = container.querySelectorAll('button')
    const startTrial = Array.from(buttons).find((b) => b.textContent?.includes('Start free trial'))
    expect(startTrial).toBeTruthy()
  })
})

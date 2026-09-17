import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LoadingBar } from '../LoadingBar'

describe('LoadingBar', () => {
  it('renders container with data-slot="loading-bar"', () => {
    const { container } = render(<LoadingBar value={50} />)
    expect(container.querySelector('[data-slot="loading-bar"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<LoadingBar value={50} />)
    expect(container.querySelector('[data-slot="loading-bar"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders progress bar fill with data-slot="loading-bar-fill"', () => {
    const { container } = render(<LoadingBar value={50} />)
    expect(container.querySelector('[data-slot="loading-bar-fill"]')).toBeTruthy()
  })

  it('applies data-state="determinate" by default', () => {
    const { container } = render(<LoadingBar value={50} />)
    expect(container.querySelector('[data-slot="loading-bar"]')?.getAttribute('data-state')).toBe('determinate')
  })

  it('applies data-state="indeterminate" when indeterminate', () => {
    const { container } = render(<LoadingBar indeterminate />)
    expect(container.querySelector('[data-slot="loading-bar"]')?.getAttribute('data-state')).toBe('indeterminate')
  })

  it('applies data-state="error" when error prop is true', () => {
    const { container } = render(<LoadingBar value={50} error />)
    expect(container.querySelector('[data-slot="loading-bar"]')?.getAttribute('data-state')).toBe('error')
  })

  it('applies data-position="top" by default', () => {
    const { container } = render(<LoadingBar value={50} />)
    expect(container.querySelector('[data-slot="loading-bar"]')?.getAttribute('data-position')).toBe('top')
  })

  it('applies data-position="bottom" when position prop is set', () => {
    const { container } = render(<LoadingBar value={50} position="bottom" />)
    expect(container.querySelector('[data-slot="loading-bar"]')?.getAttribute('data-position')).toBe('bottom')
  })

  it('renders indeterminate bar with data-slot="loading-bar-indeterminate"', () => {
    const { container } = render(<LoadingBar indeterminate />)
    expect(container.querySelector('[data-slot="loading-bar-indeterminate"]')).toBeTruthy()
  })

  it('has role="progressbar"', () => {
    const { container } = render(<LoadingBar value={50} />)
    expect(container.querySelector('[data-slot="loading-bar"]')?.getAttribute('role')).toBe('progressbar')
  })
})

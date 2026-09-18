import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BlockUi } from '../index'

describe('BlockUi', () => {
  it('renders a container with data-slot="block-ui"', () => {
    const { container } = render(<BlockUi />)
    expect(container.querySelector('[data-slot="block-ui"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<BlockUi />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('does not render overlay when blocking is false', () => {
    const { container } = render(<BlockUi blocking={false} />)
    expect(container.querySelector('[role="status"]')).toBeFalsy()
  })

  it('renders overlay with spinner when blocking is true', () => {
    const { container } = render(<BlockUi blocking />)
    expect(container.querySelector('[role="status"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="spinner"]')).toBeTruthy()
  })

  it('sets data-blocked attribute when blocking is true', () => {
    const { container } = render(<BlockUi blocking />)
    expect(container.querySelector('[data-slot="block-ui"]')?.getAttribute('data-blocked')).toBeDefined()
  })

  it('renders default message text when blocking is true', () => {
    const { container } = render(<BlockUi blocking message="Please wait" />)
    expect(container.textContent).toContain('Please wait')
  })

  it('renders children content regardless of blocking state', () => {
    const { container } = render(<BlockUi blocking={false}>Content</BlockUi>)
    expect(container.textContent).toContain('Content')
  })
})

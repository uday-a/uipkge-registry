import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Highlight } from '../index'

describe('Highlight', () => {
  it('renders with data-slot="highlight"', () => {
    const { container } = render(<Highlight text="hello world" query="world" />)
    expect(container.querySelector('[data-slot="highlight"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Highlight text="hello" query="ell" />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders as a span', () => {
    const { container } = render(<Highlight text="hello" query="ell" />)
    expect(container.querySelector('[data-slot="highlight"]')?.tagName.toLowerCase()).toBe('span')
  })

  it('renders the full text content', () => {
    const { container } = render(<Highlight text="hello world" query="xyz" />)
    expect(container.textContent).toContain('hello world')
  })

  it('wraps matched substring in a mark with data-slot="highlight-match"', () => {
    const { container } = render(<Highlight text="hello world" query="world" />)
    const match = container.querySelector('[data-slot="highlight-match"]')
    expect(match).toBeTruthy()
    expect(match?.tagName.toLowerCase()).toBe('mark')
    expect(match?.textContent).toBe('world')
  })

  it('uses span tag when highlightTag is "span"', () => {
    const { container } = render(<Highlight text="hello world" query="world" highlightTag="span" />)
    const match = container.querySelector('[data-slot="highlight-match"]')
    expect(match?.tagName.toLowerCase()).toBe('span')
  })

  it('caps highlights at maxHighlights', () => {
    const { container } = render(<Highlight text="a a a" query="a" maxHighlights={2} />)
    expect(container.querySelectorAll('[data-slot="highlight-match"]').length).toBe(2)
  })
})

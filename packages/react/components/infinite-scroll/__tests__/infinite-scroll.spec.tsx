import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { InfiniteScroll } from '../index'

describe('InfiniteScroll', () => {
  it('renders container with data-slot="infinite-scroll"', () => {
    const { container } = render(<InfiniteScroll />)
    expect(container.querySelector('[data-slot="infinite-scroll"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = render(<InfiniteScroll />)
    expect(container.querySelector('[data-slot="infinite-scroll"][data-uipkge]')).toBeTruthy()
  })

  it('renders a sentinel element', () => {
    const { container } = render(<InfiniteScroll />)
    expect(container.querySelector('[data-slot="infinite-scroll-sentinel"]')).toBeTruthy()
  })

  it('renders loader when loading is true', () => {
    const { container } = render(<InfiniteScroll loading />)
    expect(container.querySelector('[data-slot="infinite-scroll-loading"]')).toBeTruthy()
  })

  it('does not render loader when loading is false', () => {
    const { container } = render(<InfiniteScroll loading={false} />)
    expect(container.querySelector('[data-slot="infinite-scroll-loading"]')).toBeNull()
  })

  it('renders end message when hasMore is false and not loading', () => {
    const { container } = render(<InfiniteScroll hasMore={false} loading={false} />)
    const end = container.querySelector('[data-slot="infinite-scroll-end"]')
    expect(end).toBeTruthy()
    expect(end?.textContent).toContain('No more items')
  })

  it('renders children content', () => {
    const { container } = render(<InfiniteScroll>Item 1</InfiniteScroll>)
    expect(container.textContent).toContain('Item 1')
  })
})

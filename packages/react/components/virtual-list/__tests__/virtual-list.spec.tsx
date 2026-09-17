import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { VirtualList } from '../index'

const items = Array.from({ length: 100 }, (_, i) => ({ id: i, label: `Item ${i}` }))

function renderList(props: { direction?: 'vertical' | 'horizontal'; height?: number | string } = {}) {
  return render(
    <VirtualList items={items} itemSize={40} height={props.height ?? 200} direction={props.direction ?? 'vertical'}>
      {(item) => <div>{item.label}</div>}
    </VirtualList>,
  )
}

describe('VirtualList', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 300 })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 300 })
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 300 })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 300 })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 300,
      top: 0,
      left: 0,
      bottom: 300,
      right: 300,
      x: 0,
      y: 0,
      toJSON: () => {},
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders container with data-slot="virtual-list"', () => {
    const { container } = renderList()
    expect(container.querySelector('[data-slot="virtual-list"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = renderList()
    expect(container.querySelector('[data-slot="virtual-list"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders visible items (not all 100)', () => {
    const { container } = renderList()
    const rendered = container.querySelectorAll('[data-slot="virtual-list"] > div > div')
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(100)
  })

  it('applies vertical styles by default (height set)', () => {
    const { container } = renderList({ height: 300 })
    const el = container.querySelector('[data-slot="virtual-list"]') as HTMLElement
    expect(el.style.height).toBe('300px')
  })

  it('applies horizontal styles when direction is horizontal', () => {
    const { container } = renderList({ direction: 'horizontal', height: 400 })
    const el = container.querySelector('[data-slot="virtual-list"]') as HTMLElement
    expect(el.style.width).toBe('400px')
  })

  it('renders item content via children render-prop', () => {
    const { container } = renderList()
    expect(container.textContent).toContain('Item 0')
  })

  it('calls onScroll when scroll event fires', () => {
    const onScroll = vi.fn()
    const { container } = render(
      <VirtualList items={items} itemSize={40} height={200} onScroll={onScroll}>
        {(item) => <div>{item.label}</div>}
      </VirtualList>,
    )
    fireEvent.scroll(container.querySelector('[data-slot="virtual-list"]')!)
    expect(onScroll).toHaveBeenCalled()
  })
})

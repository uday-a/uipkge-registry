import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InfiniteScroll from '../InfiniteScroll.vue'

describe('InfiniteScroll', () => {
  it('renders container with data-slot="infinite-scroll"', () => {
    const w = mount(InfiniteScroll, { attachTo: document.body })
    expect(w.find('[data-slot="infinite-scroll"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on container', () => {
    const w = mount(InfiniteScroll, { attachTo: document.body })
    expect(w.find('[data-slot="infinite-scroll"][data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a sentinel element', () => {
    const w = mount(InfiniteScroll, { attachTo: document.body })
    expect(w.find('[data-slot="infinite-scroll-sentinel"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders loader when loading is true', () => {
    const w = mount(InfiniteScroll, { props: { loading: true }, attachTo: document.body })
    expect(w.find('[data-slot="infinite-scroll-loading"]').exists()).toBe(true)
    w.unmount()
  })

  it('does not render loader when loading is false', () => {
    const w = mount(InfiniteScroll, { props: { loading: false }, attachTo: document.body })
    expect(w.find('[data-slot="infinite-scroll-loading"]').exists()).toBe(false)
    w.unmount()
  })

  it('renders end message when hasMore is false and not loading', () => {
    const w = mount(InfiniteScroll, {
      props: { hasMore: false, loading: false },
      attachTo: document.body,
    })
    expect(w.find('[data-slot="infinite-scroll-end"]').exists()).toBe(true)
    expect(w.text()).toContain('No more items')
    w.unmount()
  })

  it('renders default slot content', () => {
    const w = mount(InfiniteScroll, {
      slots: { default: '<div>Item 1</div>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Item 1')
    w.unmount()
  })
})

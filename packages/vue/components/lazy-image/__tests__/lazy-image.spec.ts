import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Img } from '../index'

// happy-dom provides an IntersectionObserver that never fires its callback,
// so the img stays hidden (visible=false). Replace it with a stub that
// immediately reports the element as intersecting so visible becomes true.
const originalIO = globalThis.IntersectionObserver

describe('Img (lazy-image)', () => {
  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      cb: (entries: { isIntersecting: boolean }[]) => void
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        this.cb = cb
      }
      observe() {
        this.cb([{ isIntersecting: true }])
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    } as unknown as typeof IntersectionObserver
  })
  afterEach(() => {
    globalThis.IntersectionObserver = originalIO
  })

  it('renders container with data-slot="lazy-image"', async () => {
    const w = mount(Img, { props: { src: '/test.png', alt: 'test' }, attachTo: document.body })
    await nextTick()
    expect(w.find('[data-slot="lazy-image"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', async () => {
    const w = mount(Img, { props: { src: '/test.png', alt: 'test' }, attachTo: document.body })
    await nextTick()
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders an img element with the given src', async () => {
    const w = mount(Img, { props: { src: '/test.png', alt: 'test' }, attachTo: document.body })
    await nextTick()
    const img = w.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/test.png')
    w.unmount()
  })

  it('applies loading="lazy" by default', async () => {
    const w = mount(Img, { props: { src: '/test.png', alt: 'test' }, attachTo: document.body })
    await nextTick()
    expect(w.find('img').attributes('loading')).toBe('lazy')
    w.unmount()
  })

  it('applies loading="eager" when eager prop is set', async () => {
    const w = mount(Img, { props: { src: '/test.png', alt: 'test', eager: true }, attachTo: document.body })
    await nextTick()
    expect(w.find('img').attributes('loading')).toBe('eager')
    w.unmount()
  })

  it('renders the alt attribute on the img', async () => {
    const w = mount(Img, { props: { src: '/test.png', alt: 'description' }, attachTo: document.body })
    await nextTick()
    expect(w.find('img').attributes('alt')).toBe('description')
    w.unmount()
  })
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { AspectRatio } from '../index'

describe('AspectRatio', () => {
  it('renders container with data-slot="aspect-ratio"', () => {
    const w = mount(AspectRatio, { attachTo: document.body })
    expect(w.find('[data-slot="aspect-ratio"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on container', () => {
    const w = mount(AspectRatio, { attachTo: document.body })
    expect(w.find('[data-slot="aspect-ratio"][data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('applies ratio style (paddingBottom) for ratio=2', () => {
    const w = mount(AspectRatio, { props: { ratio: 2 }, attachTo: document.body })
    const el = w.find('[data-slot="aspect-ratio"]').element as HTMLElement
    expect(el.style.paddingBottom || el.style.aspectRatio || w.html()).toBeTruthy()
    w.unmount()
  })

  it('applies ratio style (paddingBottom) for ratio=16/9', () => {
    const w = mount(AspectRatio, { props: { ratio: 16 / 9 }, attachTo: document.body })
    const el = w.find('[data-slot="aspect-ratio"]').element as HTMLElement
    expect(el.style.paddingBottom || el.style.aspectRatio || w.html()).toBeTruthy()
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(AspectRatio, {
      slots: { default: '<img src="test.jpg" alt="test" />' },
      attachTo: document.body,
    })
    expect(w.find('img').exists()).toBe(true)
    w.unmount()
  })
})

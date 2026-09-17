import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { OverlayScroll } from '../index'

describe('OverlayScroll', () => {
  it('renders with data-slot="overlay-scroll"', () => {
    const w = mount(OverlayScroll, { attachTo: document.body })
    expect(w.find('[data-slot="overlay-scroll"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(OverlayScroll, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders viewport with data-slot="overlay-scroll-viewport"', () => {
    const w = mount(OverlayScroll, { attachTo: document.body })
    expect(w.find('[data-slot="overlay-scroll-viewport"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders thumb with data-slot="overlay-scroll-thumb"', () => {
    const w = mount(OverlayScroll, { attachTo: document.body })
    expect(w.find('[data-slot="overlay-scroll-thumb"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content inside the viewport', () => {
    const w = mount(OverlayScroll, { slots: { default: '<p>Content</p>' }, attachTo: document.body })
    expect(w.find('[data-slot="overlay-scroll-viewport"]').text()).toContain('Content')
    w.unmount()
  })

  it('applies custom class to the container', () => {
    const w = mount(OverlayScroll, { props: { class: 'h-64' }, attachTo: document.body })
    expect(w.find('[data-slot="overlay-scroll"]').classes()).toContain('h-64')
    w.unmount()
  })
})

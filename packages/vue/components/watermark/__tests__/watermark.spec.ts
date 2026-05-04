import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Watermark } from '../index'

describe('Watermark', () => {
  it('renders container with data-slot="watermark"', () => {
    const w = mount(Watermark, { props: { content: 'CONFIDENTIAL' }, attachTo: document.body })
    expect(w.find('[data-slot="watermark"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on container', () => {
    const w = mount(Watermark, { props: { content: 'CONFIDENTIAL' }, attachTo: document.body })
    expect(w.find('[data-slot="watermark"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders watermark overlay with data-slot="watermark-overlay"', () => {
    const w = mount(Watermark, { props: { content: 'CONFIDENTIAL' }, attachTo: document.body })
    expect(w.find('[data-slot="watermark-overlay"]').exists()).toBe(true)
    w.unmount()
  })

  it('overlay has data-uipkge', () => {
    const w = mount(Watermark, { props: { content: 'CONFIDENTIAL' }, attachTo: document.body })
    expect(w.find('[data-slot="watermark-overlay"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(Watermark, {
      props: { content: 'CONFIDENTIAL' },
      slots: { default: '<p>Protected content</p>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Protected content')
    w.unmount()
  })

  it('overlay has aria-hidden="true"', () => {
    const w = mount(Watermark, { props: { content: 'CONFIDENTIAL' }, attachTo: document.body })
    expect(w.find('[data-slot="watermark-overlay"]').attributes('aria-hidden')).toBe('true')
    w.unmount()
  })

  it('overlay has pointer-events:none by default', () => {
    const w = mount(Watermark, { props: { content: 'CONFIDENTIAL' }, attachTo: document.body })
    const overlay = w.find('[data-slot="watermark-overlay"]')
    expect(overlay.element.style.pointerEvents).toBe('none')
    w.unmount()
  })
})

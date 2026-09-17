import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Marquee } from '../index'

describe('Marquee', () => {
  it('renders a container with data-slot="marquee"', () => {
    const w = mount(Marquee, { attachTo: document.body })
    expect(w.find('[data-slot="marquee"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Marquee, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content inside tracks', () => {
    const w = mount(Marquee, { slots: { default: '<span>Item</span>' }, attachTo: document.body })
    expect(w.text()).toContain('Item')
    w.unmount()
  })

  it('applies data-direction prop', () => {
    const w = mount(Marquee, { props: { direction: 'right' }, attachTo: document.body })
    expect(w.find('[data-slot="marquee"]').attributes('data-direction')).toBe('right')
    w.unmount()
  })

  it('applies data-orientation prop', () => {
    const w = mount(Marquee, { props: { orientation: 'vertical' }, attachTo: document.body })
    expect(w.find('[data-slot="marquee"]').attributes('data-orientation')).toBe('vertical')
    w.unmount()
  })

  it('renders multiple tracks based on repeat prop', () => {
    const w = mount(Marquee, { props: { repeat: 3 }, attachTo: document.body })
    expect(w.findAll('[data-slot="marquee-track"]')).toHaveLength(3)
    w.unmount()
  })

  it('has role="region" and aria-roledescription="marquee"', () => {
    const w = mount(Marquee, { attachTo: document.body })
    const el = w.find('[data-slot="marquee"]')
    expect(el.attributes('role')).toBe('region')
    expect(el.attributes('aria-roledescription')).toBe('marquee')
    w.unmount()
  })
})

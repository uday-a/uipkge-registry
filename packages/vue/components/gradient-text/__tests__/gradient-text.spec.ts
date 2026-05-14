import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { GradientText } from '../index'

describe('GradientText', () => {
  it('renders with data-slot="gradient-text"', () => {
    const w = mount(GradientText, { attachTo: document.body })
    expect(w.find('[data-slot="gradient-text"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(GradientText, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a span by default', () => {
    const w = mount(GradientText, { attachTo: document.body })
    expect(w.find('[data-slot="gradient-text"]').element.tagName.toLowerCase()).toBe('span')
    w.unmount()
  })

  it('renders slot text content', () => {
    const w = mount(GradientText, { slots: { default: 'Hello gradient' }, attachTo: document.body })
    expect(w.text()).toContain('Hello gradient')
    w.unmount()
  })

  it('applies data-preset when preset prop is set', () => {
    const w = mount(GradientText, { props: { preset: 'sunset' }, attachTo: document.body })
    expect(w.find('[data-slot="gradient-text"]').attributes('data-preset')).toBe('sunset')
    w.unmount()
  })

  it('applies data-animated="true" when animated prop is set', () => {
    const w = mount(GradientText, { props: { animated: true }, attachTo: document.body })
    expect(w.find('[data-slot="gradient-text"]').attributes('data-animated')).toBe('true')
    w.unmount()
  })

  it('does not set data-animated by default', () => {
    const w = mount(GradientText, { attachTo: document.body })
    expect(w.find('[data-slot="gradient-text"]').attributes('data-animated')).toBeUndefined()
    w.unmount()
  })
})

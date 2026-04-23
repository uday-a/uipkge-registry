import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Knob } from '../index'

function mountKnob(overrides: Record<string, unknown> = {}) {
  return mount(Knob, {
    props: { modelValue: 50, ...overrides },
    attachTo: document.body,
  })
}

describe('Knob', () => {
  it('renders an svg container', () => {
    const w = mountKnob()
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })

  it('has data-slot="knob"', () => {
    const w = mountKnob()
    expect(w.find('[data-slot="knob"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mountKnob()
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders two path elements (range and value arcs)', () => {
    const w = mountKnob()
    expect(w.findAll('path').length).toBe(2)
    w.unmount()
  })

  it('renders value text when showValue is true', () => {
    const w = mountKnob({ modelValue: 42 })
    expect(w.find('text').text()).toContain('42')
    w.unmount()
  })

  it('does not render value text when showValue is false', () => {
    const w = mountKnob({ showValue: false })
    expect(w.find('text').exists()).toBe(false)
    w.unmount()
  })

  it('sets aria-valuenow to the clamped value', () => {
    const w = mountKnob({ modelValue: 75 })
    expect(w.find('svg').attributes('aria-valuenow')).toBe('75')
    w.unmount()
  })

  it('applies aria-disabled when disabled', () => {
    const w = mountKnob({ disabled: true })
    expect(w.find('svg').attributes('aria-disabled')).toBeDefined()
    w.unmount()
  })
})

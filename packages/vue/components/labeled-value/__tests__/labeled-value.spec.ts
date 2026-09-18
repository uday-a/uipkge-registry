import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { LabeledValue } from '../index'

describe('LabeledValue', () => {
  it('renders with data-slot="labeled-value"', () => {
    const w = mount(LabeledValue, { props: { label: 'Name' }, attachTo: document.body })
    expect(w.find('[data-slot="labeled-value"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(LabeledValue, { props: { label: 'Name' }, attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a div container', () => {
    const w = mount(LabeledValue, { props: { label: 'Name' }, attachTo: document.body })
    expect(w.find('[data-slot="labeled-value"]').element.tagName.toLowerCase()).toBe('div')
    w.unmount()
  })

  it('renders the label in data-slot="labeled-value-label"', () => {
    const w = mount(LabeledValue, { props: { label: 'Status' }, attachTo: document.body })
    const label = w.find('[data-slot="labeled-value-label"]')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Status')
    w.unmount()
  })

  it('renders the value in data-slot="labeled-value-value"', () => {
    const w = mount(LabeledValue, { props: { label: 'Status', value: 'Active' }, attachTo: document.body })
    const value = w.find('[data-slot="labeled-value-value"]')
    expect(value.exists()).toBe(true)
    expect(value.text()).toBe('Active')
    w.unmount()
  })

  it('renders slot content instead of value when default slot is provided', () => {
    const w = mount(LabeledValue, {
      props: { label: 'Status', value: 'Active' },
      slots: { default: '<span data-slot="custom">Custom</span>' },
      attachTo: document.body,
    })
    expect(w.find('[data-slot="custom"]').exists()).toBe(true)
    expect(w.find('[data-slot="labeled-value-value"]').exists()).toBe(false)
    w.unmount()
  })
})

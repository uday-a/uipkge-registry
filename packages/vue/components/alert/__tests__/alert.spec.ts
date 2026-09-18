import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Alert, AlertTitle, AlertDescription } from '../index'

describe('Alert', () => {
  it('renders with data-slot="alert"', () => {
    const w = mount(Alert, { attachTo: document.body })
    expect(w.find('[data-slot="alert"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Alert, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('has role="alert"', () => {
    const w = mount(Alert, { attachTo: document.body })
    expect(w.find('[data-slot="alert"]').attributes('role')).toBe('alert')
    w.unmount()
  })

  it('renders title text when title prop is set', () => {
    const w = mount(Alert, { props: { title: 'Heads up' }, attachTo: document.body })
    expect(w.find('[data-slot="alert-title"]').text()).toBe('Heads up')
    w.unmount()
  })

  it('renders text prop content', () => {
    const w = mount(Alert, { props: { text: 'Something happened' }, attachTo: document.body })
    expect(w.find('[data-slot="alert-description"]').text()).toBe('Something happened')
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(Alert, { slots: { default: '<p>Slotted</p>' }, attachTo: document.body })
    expect(w.text()).toContain('Slotted')
    w.unmount()
  })

  it('applies destructive variant classes', () => {
    const w = mount(Alert, { props: { variant: 'destructive' }, attachTo: document.body })
    expect(w.find('[data-slot="alert"]').classes()).toContain('border-destructive/20')
    w.unmount()
  })

  it('renders icon based on icon prop', () => {
    const w = mount(Alert, { props: { icon: 'error' }, attachTo: document.body })
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })

  it('renders success icon when icon prop is success', () => {
    const w = mount(Alert, { props: { icon: 'success' }, attachTo: document.body })
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })
})

describe('AlertTitle', () => {
  it('renders with data-slot="alert-title"', () => {
    const w = mount(AlertTitle, { slots: { default: 'Title' }, attachTo: document.body })
    expect(w.find('[data-slot="alert-title"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as h5 by default', () => {
    const w = mount(AlertTitle, { slots: { default: 'Title' }, attachTo: document.body })
    expect(w.find('h5').exists()).toBe(true)
    w.unmount()
  })
})

describe('AlertDescription', () => {
  it('renders with data-slot="alert-description"', () => {
    const w = mount(AlertDescription, { slots: { default: 'Desc' }, attachTo: document.body })
    expect(w.find('[data-slot="alert-description"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a div', () => {
    const w = mount(AlertDescription, { slots: { default: 'Desc' }, attachTo: document.body })
    expect(w.find('div[data-slot="alert-description"]').exists()).toBe(true)
    w.unmount()
  })
})

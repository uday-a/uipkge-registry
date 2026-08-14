import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Spinner } from '../index'

describe('Spinner', () => {
  it('renders with data-slot="spinner"', () => {
    const w = mount(Spinner, { attachTo: document.body })
    expect(w.find('[data-slot="spinner"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Spinner, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders an svg element', () => {
    const w = mount(Spinner, { attachTo: document.body })
    expect(w.find('svg[data-slot="spinner"]').exists()).toBe(true)
    w.unmount()
  })

  it('has role="status"', () => {
    const w = mount(Spinner, { attachTo: document.body })
    expect(w.find('[data-slot="spinner"]').attributes('role')).toBe('status')
    w.unmount()
  })

  it('has aria-label="Loading"', () => {
    const w = mount(Spinner, { attachTo: document.body })
    expect(w.find('[data-slot="spinner"]').attributes('aria-label')).toBe('Loading')
    w.unmount()
  })

  it('applies default size classes', () => {
    const w = mount(Spinner, { attachTo: document.body })
    expect(w.find('[data-slot="spinner"]').classes()).toContain('size-6')
    w.unmount()
  })

  it('applies sm size classes', () => {
    const w = mount(Spinner, { props: { size: 'sm' }, attachTo: document.body })
    expect(w.find('[data-slot="spinner"]').classes()).toContain('size-4')
    w.unmount()
  })

  it('applies spin animation class', () => {
    const w = mount(Spinner, { attachTo: document.body })
    expect(w.find('[data-slot="spinner"]').classes()).toContain('motion-safe:animate-spin')
    w.unmount()
  })
})

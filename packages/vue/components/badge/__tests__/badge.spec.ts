import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Badge } from '../index'

describe('Badge', () => {
  it('renders with data-slot="badge"', () => {
    const w = mount(Badge, { attachTo: document.body })
    expect(w.find('[data-slot="badge"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Badge, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a span by default', () => {
    const w = mount(Badge, { slots: { default: 'New' }, attachTo: document.body })
    expect(w.find('span[data-slot="badge"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(Badge, { slots: { default: 'Badge text' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').text()).toBe('Badge text')
    w.unmount()
  })

  it('applies default variant classes', () => {
    const w = mount(Badge, { props: { variant: 'default' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('bg-primary')
    w.unmount()
  })

  it('applies secondary variant classes', () => {
    const w = mount(Badge, { props: { variant: 'secondary' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('bg-secondary')
    w.unmount()
  })

  it('applies destructive variant classes', () => {
    const w = mount(Badge, { props: { variant: 'destructive' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('bg-destructive')
    w.unmount()
  })

  it('applies outline variant classes', () => {
    const w = mount(Badge, { props: { variant: 'outline' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('text-foreground')
    w.unmount()
  })

  it('applies success variant classes', () => {
    const w = mount(Badge, { props: { variant: 'success' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('text-success')
    w.unmount()
  })

  it('applies warning variant classes', () => {
    const w = mount(Badge, { props: { variant: 'warning' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('text-warning')
    w.unmount()
  })

  it('applies info variant classes', () => {
    const w = mount(Badge, { props: { variant: 'info' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('text-info')
    w.unmount()
  })

  it('accepts asChild prop', () => {
    const w = mount(Badge, { props: { asChild: true }, slots: { default: '<a>Link</a>' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').exists()).toBe(true)
    w.unmount()
  })

  it('accepts custom className', () => {
    const w = mount(Badge, { props: { class: 'custom-class' }, attachTo: document.body })
    expect(w.find('[data-slot="badge"]').classes()).toContain('custom-class')
    w.unmount()
  })

  it('allows wrapping with the wrap prop', () => {
    const w = mount(Badge, { props: { wrap: true }, slots: { default: 'Long label' }, attachTo: document.body })
    const classes = w.find('[data-slot="badge"]').classes()
    expect(classes).toContain('whitespace-normal')
    expect(classes).not.toContain('whitespace-nowrap')
    w.unmount()
  })
})

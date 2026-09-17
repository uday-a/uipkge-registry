import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button } from '../index'

describe('Button', () => {
  it('renders with data-slot="button"', () => {
    const w = mount(Button, { attachTo: document.body })
    expect(w.find('[data-slot="button"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Button, { attachTo: document.body })
    expect(w.find('[data-slot="button"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders as a button element', () => {
    const w = mount(Button, { attachTo: document.body })
    expect(w.find('button[data-slot="button"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mount(Button, { slots: { default: 'Click me' }, attachTo: document.body })
    expect(w.text()).toContain('Click me')
    w.unmount()
  })

  it.each(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const)(
    'applies data-variant="%s"',
    (variant) => {
      const w = mount(Button, { props: { variant }, attachTo: document.body })
      expect(w.find('[data-slot="button"]').attributes('data-variant')).toBe(variant)
      w.unmount()
    },
  )

  it.each(['default', 'sm', 'lg', 'xs', 'icon'] as const)('applies data-size="%s"', (size) => {
    const w = mount(Button, { props: { size }, attachTo: document.body })
    expect(w.find('[data-slot="button"]').attributes('data-size')).toBe(size)
    w.unmount()
  })

  it.each(['button', 'submit', 'reset'] as const)('sets type="%s" attribute', (type) => {
    const w = mount(Button, { props: { type }, attachTo: document.body })
    expect(w.find('[data-slot="button"]').attributes('type')).toBe(type)
    w.unmount()
  })

  it('calls onClick when clicked', async () => {
    const w = mount(Button, { slots: { default: 'Click' }, attachTo: document.body })
    await w.find('[data-slot="button"]').trigger('click')
    expect(w.emitted('click')).toBeTruthy()
    w.unmount()
  })

  it('supports asChild prop', () => {
    const w = mount(Button, {
      props: { asChild: true },
      slots: { default: '<a href="#">Link</a>' },
      attachTo: document.body,
    })
    expect(w.find('a[data-slot="button"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders as a link when as="a"', () => {
    const w = mount(Button, { props: { as: 'a' }, slots: { default: 'Link' }, attachTo: document.body })
    expect(w.find('a[data-slot="button"]').exists()).toBe(true)
    w.unmount()
  })

  it('applies custom className', () => {
    const w = mount(Button, { props: { class: 'custom-class' }, attachTo: document.body })
    expect(w.find('[data-slot="button"]').classes()).toContain('custom-class')
    w.unmount()
  })
})

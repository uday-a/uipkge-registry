import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Chip } from '../index'

describe('Chip', () => {
  it('renders a span with data-slot="chip"', () => {
    const w = mount(Chip, { attachTo: document.body })
    expect(w.find('[data-slot="chip"]').exists()).toBe(true)
    expect(w.find('[data-slot="chip"]').element.tagName.toLowerCase()).toBe('span')
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(Chip, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders label text via slot', () => {
    const w = mount(Chip, { slots: { default: 'Vue' }, attachTo: document.body })
    expect(w.text()).toContain('Vue')
    w.unmount()
  })

  it('applies data-variant via variant prop', () => {
    const w = mount(Chip, { props: { variant: 'success' }, attachTo: document.body })
    expect(w.find('[data-slot="chip"]').classes()).toContain('bg-success/10')
    w.unmount()
  })

  it('does not show close button when closable is false', () => {
    const w = mount(Chip, { attachTo: document.body })
    expect(w.find('button[aria-label="Remove item"]').exists()).toBe(false)
    w.unmount()
  })

  it('shows close button when closable is true', () => {
    const w = mount(Chip, { props: { closable: true }, attachTo: document.body })
    expect(w.find('button[aria-label="Remove item"]').exists()).toBe(true)
    w.unmount()
  })

  it('sets data-leaving when close button is clicked', async () => {
    const w = mount(Chip, { props: { closable: true }, attachTo: document.body })
    await w.find('button[aria-label="Remove item"]').trigger('click')
    // The button click sets leaving=true, which adds data-leaving attribute.
    expect(w.find('[data-slot="chip"]').attributes('data-leaving')).toBeDefined()
    w.unmount()
  })

  it('allows wrapping with the wrap prop', () => {
    const w = mount(Chip, { props: { wrap: true }, slots: { default: 'Long label' }, attachTo: document.body })
    const classes = w.find('[data-slot="chip"]').classes()
    expect(classes).toContain('whitespace-normal')
    expect(classes).not.toContain('whitespace-nowrap')
    w.unmount()
  })
})

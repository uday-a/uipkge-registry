import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ThemeSwitch } from '../index'

describe('ThemeSwitch', () => {
  it('renders buttons in cards variant', () => {
    const w = mount(ThemeSwitch, { props: { modelValue: 'light' }, attachTo: document.body })
    expect(w.findAll('button[role="radio"]').length).toBe(3)
    w.unmount()
  })

  it('cards variant has data-slot via SectionCard (data-slot="card")', () => {
    const w = mount(ThemeSwitch, { props: { modelValue: 'light' }, attachTo: document.body })
    expect(w.find('[data-slot="card"]').exists()).toBe(true)
    w.unmount()
  })

  it('cards variant has data-uipkge via SectionCard', () => {
    const w = mount(ThemeSwitch, { props: { modelValue: 'light' }, attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders icons (SVG) for each theme option', () => {
    const w = mount(ThemeSwitch, { props: { modelValue: 'light' }, attachTo: document.body })
    expect(w.findAll('svg').length).toBeGreaterThanOrEqual(3)
    w.unmount()
  })

  it('emits update:modelValue when a theme button is clicked', async () => {
    const w = mount(ThemeSwitch, { props: { modelValue: 'light' }, attachTo: document.body })
    const buttons = w.findAll('button[role="radio"]')
    await buttons[1].trigger('click') // Dark
    expect(w.emitted('update:modelValue')).toBeTruthy()
    expect(w.emitted('update:modelValue')![0]).toEqual(['dark'])
    w.unmount()
  })

  it('renders label text for theme options', () => {
    const w = mount(ThemeSwitch, { props: { modelValue: 'light' }, attachTo: document.body })
    expect(w.text()).toContain('Light')
    expect(w.text()).toContain('Dark')
    expect(w.text()).toContain('System')
    w.unmount()
  })

  it('icon-only variant renders a single button with an icon', () => {
    const w = mount(ThemeSwitch, {
      props: { modelValue: 'light', variant: 'icon-only' },
      attachTo: document.body,
    })
    expect(w.find('button').exists()).toBe(true)
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })
})

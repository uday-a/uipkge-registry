import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ProgressItem } from '../index'

describe('ProgressItem', () => {
  it('renders with data-slot="progress-item"', () => {
    const w = mount(ProgressItem, { props: { label: 'CPU', value: 50 }, attachTo: document.body })
    expect(w.find('[data-slot="progress-item"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(ProgressItem, { props: { label: 'CPU', value: 50 }, attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders the label text', () => {
    const w = mount(ProgressItem, { props: { label: 'CPU Usage', value: 50 }, attachTo: document.body })
    expect(w.text()).toContain('CPU Usage')
    w.unmount()
  })

  it('renders the value as percentage by default', () => {
    const w = mount(ProgressItem, { props: { label: 'CPU', value: 75 }, attachTo: document.body })
    expect(w.text()).toContain('75%')
    w.unmount()
  })

  it('renders secondaryLabel when provided', () => {
    const w = mount(ProgressItem, {
      props: { label: 'CPU', value: 75, secondaryLabel: '3.2 GHz' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('3.2 GHz')
    w.unmount()
  })

  it('renders a progress bar element', () => {
    const w = mount(ProgressItem, { props: { label: 'CPU', value: 50 }, attachTo: document.body })
    expect(w.find('[data-slot="progress"]').exists()).toBe(true)
    w.unmount()
  })
})

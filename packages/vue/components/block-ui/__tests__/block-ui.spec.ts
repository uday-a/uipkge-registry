import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { BlockUi } from '../index'

describe('BlockUi', () => {
  it('renders a container with data-slot="block-ui"', () => {
    const w = mount(BlockUi, { attachTo: document.body })
    expect(w.find('[data-slot="block-ui"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mount(BlockUi, { attachTo: document.body })
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('does not render overlay when modelValue is false', () => {
    const w = mount(BlockUi, { props: { modelValue: false }, attachTo: document.body })
    expect(w.find('[role="status"]').exists()).toBe(false)
    w.unmount()
  })

  it('renders overlay with spinner when modelValue is true', () => {
    const w = mount(BlockUi, { props: { modelValue: true }, attachTo: document.body })
    expect(w.find('[role="status"]').exists()).toBe(true)
    expect(w.find('[data-slot="spinner"]').exists()).toBe(true)
    w.unmount()
  })

  it('sets data-blocked attribute when modelValue is true', () => {
    const w = mount(BlockUi, { props: { modelValue: true }, attachTo: document.body })
    expect(w.find('[data-slot="block-ui"]').attributes('data-blocked')).toBeDefined()
    w.unmount()
  })

  it('renders default message text when modelValue is true', () => {
    const w = mount(BlockUi, { props: { modelValue: true, message: 'Please wait' }, attachTo: document.body })
    expect(w.text()).toContain('Please wait')
    w.unmount()
  })

  it('renders slot content (wrapped content) regardless of blocking state', () => {
    const w = mount(BlockUi, {
      props: { modelValue: false },
      slots: { default: '<p>Content</p>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Content')
    w.unmount()
  })
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { TimePicker } from '../index'

function mountTimePicker(props: Record<string, unknown> = {}) {
  return mount(TimePicker, {
    props: { placeholder: 'Pick a time', ...props },
    attachTo: document.body,
  })
}

describe('TimePicker', () => {
  it('renders without crashing', () => {
    const w = mountTimePicker()
    expect(w.find('[data-slot="time-picker"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a trigger button', () => {
    const w = mountTimePicker()
    expect(w.find('button[data-slot="time-picker"]').exists()).toBe(true)
    w.unmount()
  })

  it('shows placeholder text', () => {
    const w = mountTimePicker({ placeholder: 'Pick a time' })
    expect(w.text()).toContain('Pick a time')
    w.unmount()
  })

  it('disables trigger when disabled prop is true', () => {
    const w = mountTimePicker({ disabled: true })
    expect(w.find('button[data-slot="time-picker"]').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('renders clear button when clearable and has value', () => {
    const w = mountTimePicker({ modelValue: '12:30', clearable: true })
    expect(w.find('[aria-label="Clear time"]').exists()).toBe(true)
    w.unmount()
  })

  it('does not render clear button when no value', () => {
    const w = mountTimePicker({ clearable: true })
    expect(w.find('[aria-label="Clear time"]').exists()).toBe(false)
    w.unmount()
  })

  it('does not render clear button when not clearable', () => {
    const w = mountTimePicker({ modelValue: '12:30', clearable: false })
    expect(w.find('[aria-label="Clear time"]').exists()).toBe(false)
    w.unmount()
  })

  it('has data-uipkge on trigger', () => {
    const w = mountTimePicker()
    expect(w.find('[data-slot="time-picker"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '../Input.vue'

describe('Input', () => {
  it('renders with data-slot="input"', () => {
    const w = mount(Input, { props: { modelValue: '' } })
    expect(w.find('[data-slot="input"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a native input element', () => {
    const w = mount(Input, { props: { modelValue: '' } })
    expect(w.find('input').exists()).toBe(true)
    w.unmount()
  })

  it('binds modelValue to the input element', () => {
    const w = mount(Input, { props: { modelValue: 'hello' } })
    expect(w.find('input').element.value).toBe('hello')
    w.unmount()
  })

  it('emits update:modelValue when typing', async () => {
    const w = mount(Input, { props: { modelValue: '' } })
    const input = w.find('input')
    await input.setValue('test')
    expect(w.emitted('update:modelValue')).toBeTruthy()
    expect(w.emitted('update:modelValue')![0]).toEqual(['test'])
    w.unmount()
  })

  it('renders placeholder', () => {
    const w = mount(Input, { props: { modelValue: '', placeholder: 'Enter text' } })
    expect(w.find('input').attributes('placeholder')).toBe('Enter text')
    w.unmount()
  })

  it('applies size data attributes', () => {
    const w = mount(Input, { props: { modelValue: '', size: 'large' } })
    expect(w.html()).toContain('h-11')
    w.unmount()
  })

  it('applies variant classes', () => {
    const w = mount(Input, { props: { modelValue: '', variant: 'filled' } })
    expect(w.html()).toContain('bg-muted')
    w.unmount()
  })

  it('sets aria-invalid when status is error', () => {
    const w = mount(Input, { props: { modelValue: '', status: 'error' } })
    expect(w.find('[data-slot="input"]').attributes('aria-invalid')).toBe('true')
    w.unmount()
  })

  it('disables input when disabled prop is true', () => {
    const w = mount(Input, { props: { modelValue: '', disabled: true } })
    expect(w.find('input').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('sets input as readonly when readonly prop is true', () => {
    const w = mount(Input, { props: { modelValue: '', readonly: true } })
    expect(w.find('input').attributes('readonly')).toBeDefined()
    w.unmount()
  })

  it('renders prefix text', () => {
    const w = mount(Input, { props: { modelValue: '', prefix: '$' } })
    expect(w.text()).toContain('$')
    w.unmount()
  })

  it('renders suffix text', () => {
    const w = mount(Input, { props: { modelValue: '', suffix: 'kg' } })
    expect(w.text()).toContain('kg')
    w.unmount()
  })

  it('renders addonBefore', () => {
    const w = mount(Input, { props: { modelValue: '', addonBefore: 'https://' } })
    expect(w.text()).toContain('https://')
    w.unmount()
  })

  it('renders addonAfter', () => {
    const w = mount(Input, { props: { modelValue: '', addonAfter: '.com' } })
    expect(w.text()).toContain('.com')
    w.unmount()
  })

  it('uses defaultValue when modelValue is not provided', () => {
    const w = mount(Input, { props: { defaultValue: 'default text' } })
    expect(w.find('input').element.value).toBe('default text')
    w.unmount()
  })

  it('sets maxlength on the input element', () => {
    const w = mount(Input, { props: { modelValue: '', maxlength: 10 } })
    expect(w.find('input').attributes('maxlength')).toBe('10')
    w.unmount()
  })

  it('sets type on the input element', () => {
    const w = mount(Input, { props: { modelValue: '', type: 'email' } })
    expect(w.find('input').attributes('type')).toBe('email')
    w.unmount()
  })

  it('toggles password visibility when showPasswordToggle is set', async () => {
    const w = mount(Input, { props: { modelValue: 'secret', type: 'password', showPasswordToggle: true } })
    const input = w.find('input')
    expect(input.attributes('type')).toBe('password')
    const toggleBtn = w.find('button')
    expect(toggleBtn.exists()).toBe(true)
    await toggleBtn.trigger('click')
    expect(w.find('input').attributes('type')).toBe('text')
    w.unmount()
  })

  it('clears value when allowClear button is clicked', async () => {
    const w = mount(Input, { props: { modelValue: 'text', allowClear: true } })
    // Focus first to show clear button
    await w.find('input').trigger('focus')
    const clearBtn = w.find('button')
    expect(clearBtn.exists()).toBe(true)
    await clearBtn.trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual([''])
    w.unmount()
  })

  it('shows count when showCount and maxlength are set', () => {
    const w = mount(Input, { props: { modelValue: 'abc', showCount: true, maxlength: 10 } })
    expect(w.text()).toContain('3')
    expect(w.text()).toContain('10')
    w.unmount()
  })
})

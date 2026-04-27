import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordInput from '../PasswordInput.vue'

describe('PasswordInput', () => {
  it('renders with data-slot="password-input"', () => {
    const w = mount(PasswordInput, { props: { modelValue: '' } })
    expect(w.find('[data-slot="password-input"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a native input of type password by default', () => {
    const w = mount(PasswordInput, { props: { modelValue: '' } })
    const input = w.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('password')
    w.unmount()
  })

  it('binds modelValue to the input element', () => {
    const w = mount(PasswordInput, { props: { modelValue: 'secret123' } })
    expect(w.find('input').element.value).toBe('secret123')
    w.unmount()
  })

  it('emits update:modelValue when typing', async () => {
    const w = mount(PasswordInput, { props: { modelValue: '' } })
    await w.find('input').setValue('pass')
    expect(w.emitted('update:modelValue')).toBeTruthy()
    expect(w.emitted('update:modelValue')![0]).toEqual(['pass'])
    w.unmount()
  })

  it('toggles password visibility when toggle button is clicked', async () => {
    const w = mount(PasswordInput, { props: { modelValue: 'secret' } })
    expect(w.find('input').attributes('type')).toBe('password')
    const toggleBtn = w.find('button')
    expect(toggleBtn.exists()).toBe(true)
    await toggleBtn.trigger('click')
    expect(w.find('input').attributes('type')).toBe('text')
    w.unmount()
  })

  it('hides toggle button when showToggle is false', () => {
    const w = mount(PasswordInput, { props: { modelValue: '', showToggle: false } })
    expect(w.find('button').exists()).toBe(false)
    w.unmount()
  })

  it('shows strength meter when showStrength is true and value exists', () => {
    const w = mount(PasswordInput, { props: { modelValue: 'weak', showStrength: true } })
    expect(w.text()).toMatch(/weak|fair|good|strong|very strong/i)
    w.unmount()
  })

  it('does not show strength meter when showStrength is true but value is empty', () => {
    const w = mount(PasswordInput, { props: { modelValue: '', showStrength: true } })
    expect(w.find('[role="status"]').exists()).toBe(false)
    w.unmount()
  })

  it('renders placeholder', () => {
    const w = mount(PasswordInput, { props: { modelValue: '', placeholder: 'Enter password' } })
    expect(w.find('input').attributes('placeholder')).toBe('Enter password')
    w.unmount()
  })

  it('disables input when disabled prop is true', () => {
    const w = mount(PasswordInput, { props: { modelValue: '', disabled: true } })
    expect(w.find('input').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('sets input as readonly when readonly prop is true', () => {
    const w = mount(PasswordInput, { props: { modelValue: '', readonly: true } })
    expect(w.find('input').attributes('readonly')).toBeDefined()
    w.unmount()
  })

  it('uses defaultValue when modelValue is not provided', () => {
    const w = mount(PasswordInput, { props: { defaultValue: 'default-pass' } })
    expect(w.find('input').element.value).toBe('default-pass')
    w.unmount()
  })

  it('emits focus event', async () => {
    const w = mount(PasswordInput, { props: { modelValue: '' } })
    await w.find('input').trigger('focus')
    expect(w.emitted('focus')).toBeTruthy()
    w.unmount()
  })

  it('emits blur event', async () => {
    const w = mount(PasswordInput, { props: { modelValue: '' } })
    await w.find('input').trigger('blur')
    expect(w.emitted('blur')).toBeTruthy()
    w.unmount()
  })

  it('shows minimum length hint when minLength is set and value is shorter', () => {
    const w = mount(PasswordInput, { props: { modelValue: 'ab', minLength: 8 } })
    expect(w.text()).toContain('8')
    w.unmount()
  })
})

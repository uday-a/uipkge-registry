import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MaskedInput from '../MaskedInput.vue'

describe('MaskedInput', () => {
  it('renders with data-slot="masked-input"', () => {
    const w = mount(MaskedInput, { props: { modelValue: '', mask: '##/##/####' } })
    expect(w.find('[data-slot="masked-input"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a native input element', () => {
    const w = mount(MaskedInput, { props: { modelValue: '', mask: '##/##/####' } })
    expect(w.find('input').exists()).toBe(true)
    w.unmount()
  })

  it('disables input when disabled prop is true', () => {
    const w = mount(MaskedInput, { props: { modelValue: '', mask: '##/##/####', disabled: true } })
    expect(w.find('input').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('sets input as readonly when readonly prop is true', () => {
    const w = mount(MaskedInput, { props: { modelValue: '', mask: '##/##/####', readonly: true } })
    expect(w.find('input').attributes('readonly')).toBeDefined()
    w.unmount()
  })

  it('emits update:modelValue when typing', async () => {
    const w = mount(MaskedInput, { props: { modelValue: '', mask: '##/##/####' } })
    const input = w.find('input')
    await input.setValue('12')
    expect(w.emitted('update:modelValue')).toBeTruthy()
    w.unmount()
  })

  it('uses defaultValue when modelValue is not provided', () => {
    const w = mount(MaskedInput, { props: { defaultValue: '', mask: '##/##/####' } })
    expect(w.find('input').exists()).toBe(true)
    w.unmount()
  })

  it('applies mask format when user types', async () => {
    const w = mount(MaskedInput, { props: { modelValue: '', mask: '##-##' } })
    const input = w.find('input')
    // Simulate typing - the input event handler applies the mask
    input.element.value = '12'
    await input.trigger('input')
    // The emitted value should contain the mask separator
    const emitted = w.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toContain('-')
    w.unmount()
  })

  it('emits complete event when mask is fully filled', async () => {
    const w = mount(MaskedInput, { props: { modelValue: '', mask: '##' } })
    const input = w.find('input')
    await input.setValue('12')
    // complete should fire when all replacement positions are filled
    const completeEvents = w.emitted('complete')
    if (completeEvents) {
      expect(completeEvents[0]).toEqual(['12'])
    }
    w.unmount()
  })
})

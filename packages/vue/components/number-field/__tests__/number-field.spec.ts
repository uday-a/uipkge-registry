import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberField from '../NumberField.vue'
import NumberFieldInput from '../NumberFieldInput.vue'
import NumberFieldIncrement from '../NumberFieldIncrement.vue'
import NumberFieldDecrement from '../NumberFieldDecrement.vue'

function mountNumberField(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { NumberField, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement },
      data() {
        return { val: props.modelValue ?? 0, ...props }
      },
      template: `
        <NumberField
          :model-value="val"
          :default-value="defaultValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :size="size"
          :status="status"
          :controls-position="controlsPosition"
          :prefix="prefix"
          :suffix="suffix"
          :precision="precision"
          @update:model-value="val = $event"
        >
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberField>`,
      computed: {
        defaultValue: () => props.defaultValue,
        min: () => props.min,
        max: () => props.max,
        step: () => props.step,
        disabled: () => props.disabled,
        size: () => props.size,
        status: () => props.status,
        controlsPosition: () => props.controlsPosition,
        prefix: () => props.prefix,
        suffix: () => props.suffix,
        precision: () => props.precision,
      },
    },
    { attachTo: document.body },
  )
}

describe('NumberField', () => {
  it('renders with data-slot="number-field"', () => {
    const w = mountNumberField({ modelValue: 5 })
    expect(w.find('[data-slot="number-field"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders input with data-slot="input"', () => {
    const w = mountNumberField({ modelValue: 5 })
    expect(w.find('[data-slot="input"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a native input element', () => {
    const w = mountNumberField({ modelValue: 5 })
    expect(w.find('input').exists()).toBe(true)
    w.unmount()
  })

  it('renders increment button with data-slot="increment"', () => {
    const w = mountNumberField({ modelValue: 5 })
    expect(w.find('[data-slot="increment"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders decrement button with data-slot="decrement"', () => {
    const w = mountNumberField({ modelValue: 5 })
    expect(w.find('[data-slot="decrement"]').exists()).toBe(true)
    w.unmount()
  })

  it('shows the current value in the input', () => {
    const w = mountNumberField({ modelValue: 42 })
    expect(w.find('input').element.value).toBe('42')
    w.unmount()
  })

  it('renders increment and decrement buttons', () => {
    const w = mountNumberField({ modelValue: 5 })
    expect(w.find('[data-slot="increment"]').exists()).toBe(true)
    expect(w.find('[data-slot="decrement"]').exists()).toBe(true)
    w.unmount()
  })

  it('disables input when disabled prop is true', () => {
    const w = mountNumberField({ modelValue: 5, disabled: true })
    expect(w.find('input').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('renders prefix text', () => {
    const w = mountNumberField({ modelValue: 5, prefix: '$' })
    expect(w.text()).toContain('$')
    w.unmount()
  })

  it('renders suffix text', () => {
    const w = mountNumberField({ modelValue: 5, suffix: 'kg' })
    expect(w.text()).toContain('kg')
    w.unmount()
  })

  it('sets aria-valuenow on input', () => {
    const w = mountNumberField({ modelValue: 7 })
    expect(w.find('input').attributes('aria-valuenow')).toBe('7')
    w.unmount()
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    const w = mountNumberField({ modelValue: 5, min: 0, max: 100 })
    expect(w.find('input').attributes('aria-valuemin')).toBe('0')
    expect(w.find('input').attributes('aria-valuemax')).toBe('100')
    w.unmount()
  })

  it('emits update:modelValue when typing', async () => {
    const w = mountNumberField({ modelValue: 0 })
    const input = w.find('input')
    await input.setValue('25')
    // Value commits on blur
    await input.trigger('blur')
    expect((w.vm as any).val).toBe(25)
    w.unmount()
  })
})

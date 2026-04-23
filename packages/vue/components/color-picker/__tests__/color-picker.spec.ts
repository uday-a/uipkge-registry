import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ColorPicker } from '../index'

function mountPicker(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { ColorPicker },
      data() {
        return { val: props.modelValue ?? '#ff0000', ...props }
      },
      template: `
        <ColorPicker
          :model-value="val"
          :disabled="disabled"
          :presets="presets"
          :hide-hex-input="hideHexInput"
          @update:model-value="val = $event"
        />`,
      computed: {
        disabled: () => props.disabled ?? false,
        presets: () => props.presets,
        hideHexInput: () => props.hideHexInput ?? false,
      },
    },
    { attachTo: document.body },
  )
}

describe('ColorPicker', () => {
  it('renders root with data-slot="color-picker"', () => {
    const w = mountPicker()
    expect(w.find('[data-slot="color-picker"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge attribute', () => {
    const w = mountPicker()
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders color preview trigger', () => {
    const w = mountPicker()
    const colorInput = w.find('input[type="color"]')
    expect(colorInput.exists()).toBe(true)
    w.unmount()
  })

  it('renders hex text input by default', () => {
    const w = mountPicker()
    const textInput = w.find('input[type="text"]')
    expect(textInput.exists()).toBe(true)
    w.unmount()
  })

  it('hides hex input when hideHexInput is true', () => {
    const w = mountPicker({ hideHexInput: true })
    expect(w.find('input[type="text"]').exists()).toBe(false)
    w.unmount()
  })

  it('renders default preset swatches', () => {
    const w = mountPicker()
    const swatches = w.findAll('button[aria-label^="Select"]')
    expect(swatches.length).toBe(12)
    w.unmount()
  })

  it('renders custom presets when provided', () => {
    const w = mountPicker({ presets: ['#ff0000', '#00ff00', '#0000ff'] })
    const swatches = w.findAll('button[aria-label^="Select"]')
    expect(swatches.length).toBe(3)
    w.unmount()
  })

  it('disables inputs when disabled is true', () => {
    const w = mountPicker({ disabled: true })
    const colorInput = w.find('input[type="color"]')
    const textInput = w.find('input[type="text"]')
    expect(colorInput.attributes('disabled')).toBeDefined()
    expect(textInput.attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('emits update:modelValue when a swatch is clicked', async () => {
    const w = mountPicker()
    const swatches = w.findAll('button[aria-label^="Select"]')
    await swatches[0].trigger('click')
    expect((w.vm as any).val).toBe('#ef4444')
    w.unmount()
  })
})

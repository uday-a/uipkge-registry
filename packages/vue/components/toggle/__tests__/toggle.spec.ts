import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Toggle from '../Toggle.vue'

function mountToggle(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { Toggle },
      data() {
        return { val: props.modelValue ?? false, ...props }
      },
      template: `
        <Toggle
          :model-value="val"
          :default-value="defaultValue"
          :variant="variant"
          :size="size"
          :disabled="disabled"
          @update:model-value="val = $event"
        >Toggle</Toggle>`,
      computed: {
        defaultValue: () => props.defaultValue,
        variant: () => props.variant,
        size: () => props.size,
        disabled: () => props.disabled,
      },
    },
    { attachTo: document.body },
  )
}

describe('Toggle', () => {
  it('renders with data-slot="toggle"', () => {
    const w = mountToggle({ modelValue: false })
    expect(w.find('[data-slot="toggle"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders a button element', () => {
    const w = mountToggle({ modelValue: false })
    expect(w.find('button').exists()).toBe(true)
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mountToggle({ modelValue: false })
    expect(w.text()).toContain('Toggle')
    w.unmount()
  })

  it('shows off state when modelValue is false', () => {
    const w = mountToggle({ modelValue: false })
    expect(w.find('[data-slot="toggle"]').attributes('data-state')).toBe('off')
    w.unmount()
  })

  it('shows on state when modelValue is true', () => {
    const w = mountToggle({ modelValue: true })
    expect(w.find('[data-slot="toggle"]').attributes('data-state')).toBe('on')
    w.unmount()
  })

  it('toggles when clicked', async () => {
    const w = mountToggle({ modelValue: false })
    await w.find('button').trigger('click')
    expect((w.vm as any).val).toBe(true)
    w.unmount()
  })

  it('disables toggle when disabled prop is true', () => {
    const w = mountToggle({ modelValue: false, disabled: true })
    expect(w.find('button').attributes('disabled')).toBeDefined()
    w.unmount()
  })

  it('renders without crashing in uncontrolled mode', () => {
    const w = mount(
      {
        components: { Toggle },
        template: '<Toggle>Default</Toggle>',
      },
      { attachTo: document.body },
    )
    expect(w.find('[data-slot="toggle"]').exists()).toBe(true)
    w.unmount()
  })
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Rating from '../Rating.vue'

function mountRating(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { Rating },
      data() {
        return { val: props.modelValue ?? 0, ...props }
      },
      template: `
        <Rating
          :model-value="val"
          :max="max"
          :readonly="readonly"
          :disabled="disabled"
          :size="size"
          :density="density"
          :variant="variant"
          :color="color"
          :clearable="clearable"
          :hover="hover"
          :show-value="showValue"
          :half-increments="halfIncrements"
          @update:model-value="val = $event"
        />`,
      computed: {
        max: () => props.max,
        readonly: () => props.readonly,
        disabled: () => props.disabled,
        size: () => props.size,
        density: () => props.density,
        variant: () => props.variant,
        color: () => props.color,
        clearable: () => props.clearable,
        hover: () => props.hover,
        showValue: () => props.showValue,
        halfIncrements: () => props.halfIncrements,
      },
    },
    { attachTo: document.body },
  )
}

describe('Rating', () => {
  it('renders with data-slot="rating"', () => {
    const w = mountRating({ modelValue: 3 })
    expect(w.find('[data-slot="rating"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders the correct number of star buttons', () => {
    const w = mountRating({ modelValue: 3, max: 5 })
    expect(w.findAll('button').length).toBe(5)
    w.unmount()
  })

  it('renders 10 stars when max is 10', () => {
    const w = mountRating({ modelValue: 5, max: 10 })
    expect(w.findAll('button').length).toBe(10)
    w.unmount()
  })

  it('renders SVG icons for stars', () => {
    const w = mountRating({ modelValue: 3 })
    expect(w.findAll('svg').length).toBe(5)
    w.unmount()
  })

  it('emits update:modelValue when a star is clicked', async () => {
    const w = mountRating({ modelValue: 0 })
    const buttons = w.findAll('button')
    await buttons[2].trigger('click')
    expect((w.vm as any).val).toBe(3)
    w.unmount()
  })

  it('shows value when showValue is true', () => {
    const w = mountRating({ modelValue: 4, showValue: true })
    expect(w.text()).toContain('4')
    w.unmount()
  })

  it('disables buttons when disabled is true', () => {
    const w = mountRating({ modelValue: 3, disabled: true })
    const buttons = w.findAll('button')
    buttons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined()
    })
    w.unmount()
  })

  it('sets aria-valuenow on the root', () => {
    const w = mountRating({ modelValue: 3 })
    expect(w.find('[data-slot="rating"]').attributes('aria-valuenow')).toBe('3')
    w.unmount()
  })

  it('sets aria-valuemax on the root', () => {
    const w = mountRating({ modelValue: 3, max: 5 })
    expect(w.find('[data-slot="rating"]').attributes('aria-valuemax')).toBe('5')
    w.unmount()
  })

  it('clears value when clearable and same star is clicked', async () => {
    const w = mountRating({ modelValue: 3, clearable: true })
    const buttons = w.findAll('button')
    await buttons[2].trigger('click')
    expect((w.vm as any).val).toBe(0)
    w.unmount()
  })

  it('renders with radiogroup role', () => {
    const w = mountRating({ modelValue: 3 })
    expect(w.find('[role="radiogroup"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders radio role for each star', () => {
    const w = mountRating({ modelValue: 3, max: 5 })
    expect(w.findAll('[role="radio"]').length).toBe(5)
    w.unmount()
  })

  it('renders without crashing in uncontrolled mode', () => {
    const w = mount(
      {
        components: { Rating },
        template: '<Rating />',
      },
      { attachTo: document.body },
    )
    expect(w.find('[data-slot="rating"]').exists()).toBe(true)
    w.unmount()
  })
})

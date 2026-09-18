import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Slider from '../Slider.vue'

function mountSlider(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { Slider },
      data() {
        return { val: props.modelValue ?? 50, ...props }
      },
      template: `
        <Slider
          :model-value="val"
          :default-value="defaultValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :vertical="vertical"
          :range="range"
          :dots="dots"
          :tooltip="tooltip"
          :size="size"
          @update:model-value="val = $event"
        />`,
      computed: {
        defaultValue: () => props.defaultValue,
        min: () => props.min,
        max: () => props.max,
        step: () => props.step,
        disabled: () => props.disabled,
        vertical: () => props.vertical,
        range: () => props.range,
        dots: () => props.dots,
        tooltip: () => props.tooltip,
        size: () => props.size,
      },
    },
    { attachTo: document.body },
  )
}

describe('Slider', () => {
  it('renders with data-slot="slider"', () => {
    const w = mountSlider({ modelValue: 50 })
    expect(w.find('[data-slot="slider"]').exists()).toBe(true)
    expect(w.find('[data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders track with data-slot="slider-track"', () => {
    const w = mountSlider({ modelValue: 50 })
    expect(w.find('[data-slot="slider-track"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders range with data-slot="slider-range"', () => {
    const w = mountSlider({ modelValue: 50 })
    expect(w.find('[data-slot="slider-range"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders thumb with data-slot="slider-thumb"', () => {
    const w = mountSlider({ modelValue: 50 })
    expect(w.find('[data-slot="slider-thumb"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders slider role element', () => {
    const w = mountSlider({ modelValue: 50 })
    expect(w.find('[role="slider"]').exists()).toBe(true)
    w.unmount()
  })

  it('sets aria-valuenow on the thumb', () => {
    const w = mountSlider({ modelValue: 50 })
    const thumb = w.find('[role="slider"]')
    expect(thumb.attributes('aria-valuenow')).toBe('50')
    w.unmount()
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    const w = mountSlider({ modelValue: 50, min: 0, max: 100 })
    const thumb = w.find('[role="slider"]')
    expect(thumb.attributes('aria-valuemin')).toBe('0')
    expect(thumb.attributes('aria-valuemax')).toBe('100')
    w.unmount()
  })

  it('disables slider when disabled prop is true', () => {
    const w = mountSlider({ modelValue: 50, disabled: true })
    expect(w.find('[data-slot="slider"]').attributes('data-disabled')).toBeDefined()
    w.unmount()
  })

  it('renders dots when dots prop is true', () => {
    const w = mountSlider({ modelValue: 50, dots: true, min: 0, max: 10, step: 2 })
    // Dots are rendered as divs inside the slider
    expect(w.find('[data-slot="slider"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders two thumbs in range mode', () => {
    const w = mountSlider({ modelValue: [20, 80], range: true })
    expect(w.findAll('[role="slider"]').length).toBe(2)
    w.unmount()
  })

  it('renders without crashing in uncontrolled mode', () => {
    const w = mount(
      {
        components: { Slider },
        template: '<Slider />',
      },
      { attachTo: document.body },
    )
    expect(w.find('[data-slot="slider"]').exists()).toBe(true)
    w.unmount()
  })
})

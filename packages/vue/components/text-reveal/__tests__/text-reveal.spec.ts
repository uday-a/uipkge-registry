import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextReveal from '../TextReveal.vue'

describe('TextReveal (Vue)', () => {
  it('renders container with data-slot="text-reveal"', () => {
    const wrapper = mount(TextReveal, {
      props: { text: 'Crafting interfaces' },
    })
    expect(wrapper.find('[data-slot="text-reveal"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders segmented words with text content', () => {
    const wrapper = mount(TextReveal, {
      props: { text: 'Fluid tactile motion' },
    })
    expect(wrapper.text()).toContain('Fluid')
    expect(wrapper.text()).toContain('tactile')
    expect(wrapper.text()).toContain('motion')
    wrapper.unmount()
  })
})

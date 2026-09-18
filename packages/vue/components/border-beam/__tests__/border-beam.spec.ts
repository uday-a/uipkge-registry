import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BorderBeam from '../BorderBeam.vue'

describe('BorderBeam (Vue)', () => {
  it('renders container with data-slot="border-beam"', () => {
    const wrapper = mount(BorderBeam)
    expect(wrapper.find('[data-slot="border-beam"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies custom class and style size', () => {
    const wrapper = mount(BorderBeam, {
      props: { size: 4, class: 'custom-beam' },
    })
    expect(wrapper.classes()).toContain('custom-beam')
    expect(wrapper.attributes('style')).toContain('padding: 4px')
    wrapper.unmount()
  })
})

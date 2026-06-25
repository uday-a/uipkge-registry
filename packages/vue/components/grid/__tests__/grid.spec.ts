import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Grid from '../Grid.vue'

describe('Grid (Vue)', () => {
  it('renders container with data-slot="grid"', () => {
    const wrapper = mount(Grid)
    expect(wrapper.find('[data-slot="grid"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies column and gap layout classes', () => {
    const wrapper = mount(Grid, {
      props: { cols: 3, gap: 6 },
      slots: { default: '<div>Item</div>' },
    })
    expect(wrapper.classes()).toContain('grid-cols-3')
    expect(wrapper.classes()).toContain('gap-6')
    expect(wrapper.text()).toContain('Item')
    wrapper.unmount()
  })
})

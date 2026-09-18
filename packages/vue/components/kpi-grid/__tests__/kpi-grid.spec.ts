import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KpiGrid from '../KpiGrid.vue'

describe('KpiGrid (Vue)', () => {
  it('renders container with data-slot="kpi-grid"', () => {
    const wrapper = mount(KpiGrid)
    expect(wrapper.find('[data-slot="kpi-grid"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies columns layout variant', () => {
    const wrapper = mount(KpiGrid, {
      props: { columns: 3 },
      slots: { default: '<div>Item 1</div>' },
    })
    expect(wrapper.classes()).toContain('lg:grid-cols-3')
    expect(wrapper.text()).toContain('Item 1')
    wrapper.unmount()
  })
})

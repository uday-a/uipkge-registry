import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ComboChart } from '../index'

describe('ComboChart', () => {
  const sampleProps = {
    data: [{ m: 'Jan', orders: 10, conversion: 5 }],
    xField: 'm',
    barField: 'orders',
    lineField: 'conversion',
  }

  it('renders without crashing', () => {
    const wrapper = mount(ComboChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(ComboChart, {
      props: {
        ...sampleProps,
        class: 'custom-chart-test',
        height: 380,
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('custom-chart-test')
    wrapper.unmount()
  })
})

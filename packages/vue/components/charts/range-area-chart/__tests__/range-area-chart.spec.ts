import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { RangeAreaChart } from '../index'

describe('RangeAreaChart', () => {
  const sampleProps = { data: [{ d: 'Mon', min: 10, max: 20, avg: 15 }], xField: 'd' }

  it('renders without crashing', () => {
    const wrapper = mount(RangeAreaChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(RangeAreaChart, {
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

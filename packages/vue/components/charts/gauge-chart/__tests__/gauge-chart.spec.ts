import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { GaugeChart } from '../index'

describe('GaugeChart', () => {
  const sampleProps = { value: 65, unit: '%', label: 'Usage' }

  it('renders without crashing', () => {
    const wrapper = mount(GaugeChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(GaugeChart, {
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

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { RangeBarChart } from '../index'

describe('RangeBarChart', () => {
  const sampleProps = { data: [{ category: 'A', min: 10, max: 20 }] }

  it('renders without crashing', () => {
    const wrapper = mount(RangeBarChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(RangeBarChart, {
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

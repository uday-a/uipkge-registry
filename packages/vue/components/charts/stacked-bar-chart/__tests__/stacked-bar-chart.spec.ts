import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { StackedBarChart } from '../index'

describe('StackedBarChart', () => {
  const sampleProps = { data: [{ q: 'Q1', a: 10, b: 20 }], xField: 'q', yFields: ['a', 'b'] }

  it('renders without crashing', () => {
    const wrapper = mount(StackedBarChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(StackedBarChart, {
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

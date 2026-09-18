import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { BarChart } from '../index'

describe('BarChart', () => {
  const sampleProps = { data: [{ x: 'A', y: 10 }], xField: 'x', yField: 'y' }

  it('renders without crashing', () => {
    const wrapper = mount(BarChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(BarChart, {
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

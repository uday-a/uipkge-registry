import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ControlChart } from '../index'

describe('ControlChart', () => {
  const sampleProps = { data: [{ b: '1', mins: 10 }], xField: 'b', yField: 'mins' }

  it('renders without crashing', () => {
    const wrapper = mount(ControlChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(ControlChart, {
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

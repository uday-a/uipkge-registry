import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PopulationPyramidChart } from '../index'

describe('PopulationPyramidChart', () => {
  const sampleProps = { data: [{ band: '0-9', left: 10, right: 12 }] }

  it('renders without crashing', () => {
    const wrapper = mount(PopulationPyramidChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(PopulationPyramidChart, {
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

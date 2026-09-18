import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { HistogramChart } from '../index'

describe('HistogramChart', () => {
  const sampleProps = { values: [1, 2, 3, 4, 5], bins: 3 }

  it('renders without crashing', () => {
    const wrapper = mount(HistogramChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(HistogramChart, {
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

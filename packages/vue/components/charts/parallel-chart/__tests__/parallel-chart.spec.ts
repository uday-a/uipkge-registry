import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ParallelChart } from '../index'

describe('ParallelChart', () => {
  const sampleProps = {
    axes: [
      { dim: 0, name: 'A' },
      { dim: 1, name: 'B' },
    ],
    data: [[1, 2]],
  }

  it('renders without crashing', () => {
    const wrapper = mount(ParallelChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(ParallelChart, {
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

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { BoxplotChart } from '../index'

describe('BoxplotChart', () => {
  const sampleProps = { data: [[1, 2, 3, 4, 5]] }

  it('renders without crashing', () => {
    const wrapper = mount(BoxplotChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(BoxplotChart, {
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

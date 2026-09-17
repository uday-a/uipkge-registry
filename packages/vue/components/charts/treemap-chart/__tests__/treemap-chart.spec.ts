import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { TreemapChart } from '../index'

describe('TreemapChart', () => {
  const sampleProps = { data: [{ name: 'Root', value: 10, children: [{ name: 'Leaf', value: 10 }] }] }

  it('renders without crashing', () => {
    const wrapper = mount(TreemapChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(TreemapChart, {
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

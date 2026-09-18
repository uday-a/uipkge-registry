import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { QuadrantChart } from '../index'

describe('QuadrantChart', () => {
  const sampleProps = { data: [{ x: 10, y: 20, label: 'Item' }] }

  it('renders without crashing', () => {
    const wrapper = mount(QuadrantChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(QuadrantChart, {
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

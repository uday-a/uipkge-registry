import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { LiquidFillChart } from '../index'

describe('LiquidFillChart', () => {
  const sampleProps = { value: 60, unit: '%' }

  it('renders without crashing', () => {
    const wrapper = mount(LiquidFillChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(LiquidFillChart, {
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

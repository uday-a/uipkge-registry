import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { CandlestickChart } from '../index'

describe('CandlestickChart', () => {
  const sampleProps = { data: [{ date: '2024-01-01', open: 10, close: 20, lowest: 5, highest: 25 }] }

  it('renders without crashing', () => {
    const wrapper = mount(CandlestickChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(CandlestickChart, {
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

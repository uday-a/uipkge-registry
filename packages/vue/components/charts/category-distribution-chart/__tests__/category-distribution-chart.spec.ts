import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { CategoryDistributionChart } from '../index'

describe('CategoryDistributionChart', () => {
  const sampleProps = { primaryValue: '100', primaryLabel: 'Total', categories: [{ name: 'A', percentage: 50 }] }

  it('renders without crashing', () => {
    const wrapper = mount(CategoryDistributionChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(CategoryDistributionChart, {
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

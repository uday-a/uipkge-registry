import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { BulletChart } from '../index'

describe('BulletChart', () => {
  const sampleProps = { data: [{ title: 'KPI', actual: 80, target: 100, ranges: [50, 80, 100] }] }

  it('renders without crashing', () => {
    const wrapper = mount(BulletChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(BulletChart, {
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

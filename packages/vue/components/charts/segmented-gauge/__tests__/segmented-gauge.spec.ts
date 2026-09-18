import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { SegmentedGauge } from '../index'

describe('SegmentedGauge', () => {
  const sampleProps = { segments: [{ label: 'A', value: 50 }] }

  it('renders without crashing', () => {
    const wrapper = mount(SegmentedGauge, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(SegmentedGauge, {
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

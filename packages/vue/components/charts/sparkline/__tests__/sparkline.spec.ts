import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Sparkline } from '../index'

describe('Sparkline', () => {
  const sampleProps = { data: [1, 2, 3] }

  it('renders without crashing', () => {
    const wrapper = mount(Sparkline, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(Sparkline, {
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

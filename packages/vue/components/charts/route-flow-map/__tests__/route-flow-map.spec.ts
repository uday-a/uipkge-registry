import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { RouteFlowMap } from '../index'

describe('RouteFlowMap', () => {
  const sampleProps = { hubs: [{ id: '1', name: 'Hub', lat: 0, lng: 0 }], routes: [] }

  it('renders without crashing', () => {
    const wrapper = mount(RouteFlowMap, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(RouteFlowMap, {
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

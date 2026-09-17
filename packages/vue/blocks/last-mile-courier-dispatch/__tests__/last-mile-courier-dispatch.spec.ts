import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LastMileCourierDispatch from '../LastMileCourierDispatch.vue'

describe('LastMileCourierDispatch (Vue)', () => {
  it('renders route id and POD manifest table', () => {
    const wrapper = mount(LastMileCourierDispatch, {
      props: {
        routeId: 'RTE-TEST-VUE',
      },
    })
    expect(wrapper.text()).toContain('RTE-TEST-VUE')
    expect(wrapper.text()).toContain('Last-Mile Courier Dispatch')
    expect(wrapper.text()).toContain('Delivery Manifest')
  })
  it('renders without crashing', () => {
    const wrapper = mount(LastMileCourierDispatch)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

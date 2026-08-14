import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BackorderSplitShipmentManager from '../BackorderSplitShipmentManager.vue'

describe('BackorderSplitShipmentManager (Vue)', () => {
  it('renders order ID and split packages cards', () => {
    const wrapper = mount(BackorderSplitShipmentManager, {
      props: {
        orderId: 'ORD-SPLIT-TEST',
      },
    })
    expect(wrapper.text()).toContain('ORD-SPLIT-TEST')
    expect(wrapper.text()).toContain('Split Shipment & Backorder Triage')
    expect(wrapper.text()).toContain('READY SHIPMENT VALUE')
  })
  it('renders without crashing', () => {
    const wrapper = mount(BackorderSplitShipmentManager)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

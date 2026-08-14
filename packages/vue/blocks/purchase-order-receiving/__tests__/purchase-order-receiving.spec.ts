import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PurchaseOrderReceiving from '../PurchaseOrderReceiving.vue'

describe('PurchaseOrderReceiving (Vue)', () => {
  it('renders purchase order number and line item table', () => {
    const wrapper = mount(PurchaseOrderReceiving, {
      props: {
        poNumber: 'PO-2026-TEST',
      },
    })
    expect(wrapper.text()).toContain('PO-2026-TEST')
    expect(wrapper.text()).toContain('Inbound Goods Receipt')
    expect(wrapper.text()).toContain('Purchase Order Line Verification')
  })
  it('renders without crashing', () => {
    const wrapper = mount(PurchaseOrderReceiving)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

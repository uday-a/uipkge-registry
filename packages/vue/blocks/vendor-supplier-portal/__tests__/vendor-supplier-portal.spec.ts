import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VendorSupplierPortal from '../VendorSupplierPortal.vue'

describe('VendorSupplierPortal (Vue)', () => {
  it('renders vendor name, id and active purchase orders table', () => {
    const wrapper = mount(VendorSupplierPortal, {
      props: {
        vendorName: 'Acme Test Supplies',
        vendorId: 'VND-TEST-01',
      },
    })
    expect(wrapper.text()).toContain('Acme Test Supplies')
    expect(wrapper.text()).toContain('VND-TEST-01')
    expect(wrapper.text()).toContain('ON-TIME DELIVERY (OTD)')
    expect(wrapper.text()).toContain('Active Purchase Orders')
  })
  it('renders without crashing', () => {
    const wrapper = mount(VendorSupplierPortal)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommercialInvoiceGenerator from '../CommercialInvoiceGenerator.vue'

describe('CommercialInvoiceGenerator (Vue)', () => {
  it('renders invoice number and customs line items', () => {
    const wrapper = mount(CommercialInvoiceGenerator, {
      props: {
        invoiceNumber: 'INV-TEST-VUE',
      },
    })
    expect(wrapper.text()).toContain('INV-TEST-VUE')
    expect(wrapper.text()).toContain('International Commercial Customs Invoice')
    expect(wrapper.text()).toContain('Customs Line Item Breakdown')
  })
  it('renders without crashing', () => {
    const wrapper = mount(CommercialInvoiceGenerator)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

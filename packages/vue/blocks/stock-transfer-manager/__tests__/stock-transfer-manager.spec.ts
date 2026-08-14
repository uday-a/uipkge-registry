import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StockTransferManager from '../StockTransferManager.vue'

describe('StockTransferManager (Vue)', () => {
  it('renders transfer ID and table', () => {
    const wrapper = mount(StockTransferManager, {
      props: {
        transferId: 'TRF-TEST-001',
      },
    })
    expect(wrapper.text()).toContain('TRF-TEST-001')
    expect(wrapper.text()).toContain('Inter-Warehouse Stock Transfer')
    expect(wrapper.text()).toContain('Manifest Line Items')
  })
  it('renders without crashing', () => {
    const wrapper = mount(StockTransferManager)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

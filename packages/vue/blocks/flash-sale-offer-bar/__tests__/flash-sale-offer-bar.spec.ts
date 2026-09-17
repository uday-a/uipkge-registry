import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlashSaleOfferBar from '../FlashSaleOfferBar.vue'

describe('FlashSaleOfferBar (Vue)', () => {
  it('renders sale title, countdown, and tier multi-buy options', () => {
    const wrapper = mount(FlashSaleOfferBar, {
      props: {
        saleTitle: 'Special Launch Deal',
        claimedPercent: 85,
        itemsLeft: 6,
      },
    })
    expect(wrapper.text()).toContain('Special Launch Deal')
    expect(wrapper.text()).toContain('85% Claimed')
    expect(wrapper.text()).toContain('Only 6 units remaining in stock')
    expect(wrapper.text()).toContain('Duo Studio Bundle')
  })
  it('renders without crashing', () => {
    const wrapper = mount(FlashSaleOfferBar)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

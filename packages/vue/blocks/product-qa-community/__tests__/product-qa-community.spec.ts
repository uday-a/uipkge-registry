import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductQaCommunity from '../ProductQaCommunity.vue'

describe('ProductQaCommunity (Vue)', () => {
  it('renders Q&A items and answers', () => {
    const wrapper = mount(ProductQaCommunity, {
      props: {
        productName: 'Apex Studio Monitor',
      },
    })
    expect(wrapper.text()).toContain('Questions & Answers')
    expect(wrapper.text()).toContain('Apex Studio Monitor')
    expect(wrapper.text()).toContain('Ask a Question')
  })
  it('renders without crashing', () => {
    const wrapper = mount(ProductQaCommunity)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

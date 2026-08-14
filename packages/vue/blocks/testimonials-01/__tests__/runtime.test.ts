import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import Testimonials from '../Testimonials01.vue'
import Pricing from '../../pricing-enterprise-sla-card/PricingEnterpriseSlaCard.vue'

it('starts testimonial autoplay and releases its timer on navigation', () => {
  vi.useFakeTimers()
  try {
    const wrapper = mount(Testimonials)
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    vi.advanceTimersByTime(6500)
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    vi.useRealTimers()
  }
})

it('renders SLA guarantees without relying on Nuxt auto-imports', () => {
  const wrapper = mount(Pricing)
  expect(wrapper.text()).toContain('99.99')
  wrapper.unmount()
})

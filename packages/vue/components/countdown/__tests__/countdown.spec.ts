import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Countdown from '../Countdown.vue'

describe('Countdown (Vue)', () => {
  it('renders container with data-slot="countdown"', () => {
    const wrapper = mount(Countdown, {
      props: { target: Date.now() + 60000 },
    })
    expect(wrapper.find('[data-slot="countdown"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders custom label and unit separator', () => {
    const wrapper = mount(Countdown, {
      props: {
        target: Date.now() + 60000,
        label: 'Sale Ends In',
        separator: ':',
      },
    })
    expect(wrapper.text()).toContain('Sale Ends In')
    expect(wrapper.text()).toContain(':')
    wrapper.unmount()
  })
})

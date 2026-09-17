import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TechnicalSpecsSheet from '../TechnicalSpecsSheet.vue'

describe('TechnicalSpecsSheet (Vue)', () => {
  it('renders technical specifications and parameters', () => {
    const wrapper = mount(TechnicalSpecsSheet, {
      props: {
        modelNumber: 'APX-950-PRO',
      },
    })
    expect(wrapper.text()).toContain('APX-950-PRO')
    expect(wrapper.text()).toContain('Frequency Response')
    expect(wrapper.text()).toContain('5 Hz – 52,000 Hz')
    expect(wrapper.text()).toContain('Metric (SI)')
    expect(wrapper.text()).toContain('Imperial (US)')
  })
  it('renders without crashing', () => {
    const wrapper = mount(TechnicalSpecsSheet)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

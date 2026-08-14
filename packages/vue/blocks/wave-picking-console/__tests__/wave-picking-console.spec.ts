import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WavePickingConsole from '../WavePickingConsole.vue'

describe('WavePickingConsole (Vue)', () => {
  it('renders wave ID and route sequence table', () => {
    const wrapper = mount(WavePickingConsole, {
      props: {
        waveId: 'WAVE-TEST-VUE',
      },
    })
    expect(wrapper.text()).toContain('WAVE-TEST-VUE')
    expect(wrapper.text()).toContain('Batch Order Wave Picking Console')
    expect(wrapper.text()).toContain('Optimized Pick Route Sequence')
  })
  it('renders without crashing', () => {
    const wrapper = mount(WavePickingConsole)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

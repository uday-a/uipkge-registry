import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { GanttChart } from '../index'

describe('GanttChart', () => {
  const sampleProps = { tasks: [{ id: '1', name: 'Task 1', start: '2024-01-01', end: '2024-01-05' }] }

  it('renders without crashing', () => {
    const wrapper = mount(GanttChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(GanttChart, {
      props: {
        ...sampleProps,
        class: 'custom-chart-test',
        height: 380,
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('custom-chart-test')
    wrapper.unmount()
  })
})

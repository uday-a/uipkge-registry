import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { BarChart } from '../index'

describe('BarChart', () => {
  const sampleProps = { data: [{ x: 'A', y: 10 }], xField: 'x', yField: 'y' }

  it('renders without crashing', () => {
    const wrapper = mount(BarChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(BarChart, {
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

  it('blanks the series name for single-series (tooltip shows no raw field key) but keeps field names for multi-series', () => {
    const single = mount(BarChart, { props: sampleProps })
    expect((single.vm as any).mergedOption.series[0].name).toBe('')
    single.unmount()

    const multi = mount(BarChart, { props: { data: [{ x: 'A', y: 10, z: 5 }], xField: 'x', yField: ['y', 'z'] } })
    expect((multi.vm as any).mergedOption.series.map((s: any) => s.name)).toEqual(['y', 'z'])
    multi.unmount()
  })
})

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { FunnelChart } from '../index'

describe('FunnelChart', () => {
  const sampleProps = { data: [{ name: 'A', value: 10 }] }

  it('renders without crashing', () => {
    const wrapper = mount(FunnelChart, {
      props: sampleProps,
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element).toBeDefined()
    wrapper.unmount()
  })

  it('renders expected content or unique feature', () => {
    const wrapper = mount(FunnelChart, {
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

  it('strokes each stage in its own fill colour with round joins to soften corners', () => {
    const wrapper = mount(FunnelChart, {
      props: {
        data: [
          { name: 'A', value: 10 },
          { name: 'B', value: 5, itemStyle: { color: '#123456', opacity: 0.5 } },
        ],
      },
    })
    const option = (wrapper.vm as any).mergedOption
    const [series] = option.series
    expect(series.itemStyle).toMatchObject({ borderWidth: 6, borderJoin: 'round' })
    expect(series.data[0].itemStyle.borderColor).toBe(option.color[0])
    expect(series.data[1].itemStyle).toEqual({ color: '#123456', opacity: 0.5, borderColor: '#123456' })
    wrapper.unmount()
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBarChartComponent } from './bar-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './bar-chart.component.ts'), 'utf8')

describe('BarChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (stacked false, gap 1, radius 6, height 300)', () => {
    const c = new UiBarChartComponent()
    expect(c.stacked).toBe(false)
    expect(c.stackGap).toBe(1)
    expect(c.radius).toBe(6)
    expect(c.height).toBe(300)
    expect(c.valueLabels).toBe(false)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiBarChartComponent().hostClass).toContain('w-full')
  })
  it('4: option maps x categories + bar series values', () => {
    const c = new UiBarChartComponent()
    c.data = [
      { x: 'Jan', y: 10 },
      { x: 'Feb', y: 20 },
    ]
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['Jan', 'Feb'])
    expect(opt.series[0].type).toBe('bar')
    expect(opt.series[0].data).toEqual([10, 20])
  })
  it('5: radius drives corner rounding', () => {
    const c = new UiBarChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.radius = 8
    expect((c.getOption() as any).series[0].itemStyle.borderRadius).toEqual([8, 8, 8, 8])
  })
  it('6: stacked=true stacks bars on one baseline', () => {
    const c = new UiBarChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.stacked = true
    expect((c.getOption() as any).series[0].stack).toBe('bars')
  })
  it('7: valueLabels=true shows top labels', () => {
    const c = new UiBarChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.valueLabels = true
    expect((c.getOption() as any).series[0].label).toMatchObject({ show: true, position: 'top' })
  })
  it('8: multi-series honored via yField array', () => {
    const c = new UiBarChartComponent()
    c.data = [{ x: 'a', y: 1, z: 2 }]
    c.yField = ['y', 'z']
    const opt = c.getOption() as any
    expect(opt.series.map((s: any) => s.name)).toEqual(['y', 'z'])
    expect(opt.series[1].data).toEqual([2])
  })
  it('8b: single series has blank name so the tooltip omits the raw field key', () => {
    const c = new UiBarChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    expect((c.getOption() as any).series[0].name).toBe('')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiBarChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.option = { series: [{ barMaxWidth: 12 }], title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
    expect(opt.series[0].barMaxWidth).toBe(12)
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: data-slot bar-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"bar-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiBarChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

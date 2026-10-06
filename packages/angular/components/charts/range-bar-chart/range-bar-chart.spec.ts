import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiRangeBarChartComponent } from './range-bar-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './range-bar-chart.component.ts'), 'utf8')

describe('RangeBarChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (orientation=vertical height=300)', () => {
    const c = new UiRangeBarChartComponent()
    expect(c.orientation).toBe('vertical')
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiRangeBarChartComponent().hostClass).toContain('w-full')
  })
  it('4: base + span reconstruct the band', () => {
    const c = new UiRangeBarChartComponent()
    c.data = [{ label: 'A', low: 10, high: 25 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([10])
    expect(opt.series[1].data).toEqual([15])
  })
  it('5: key series type is bar', () => {
    const c = new UiRangeBarChartComponent()
    c.data = [{ label: 'A', low: 10, high: 25 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: labels print the low–high band', () => {
    const c = new UiRangeBarChartComponent()
    c.data = [{ label: 'A', low: 10, high: 25 }]
    const opt = c.getOption() as any
    expect(opt.series[1].label.formatter({ dataIndex: 0 })).toBe('10–25')
  })
  it('7: horizontal orientation swaps the axes', () => {
    const c = new UiRangeBarChartComponent()
    c.data = [{ label: 'A', low: 1, high: 2 }]
    c.orientation = 'horizontal'
    const opt = c.getOption() as any
    expect(opt.xAxis.type).toBe('value')
    expect(opt.yAxis.data).toEqual(['A'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiRangeBarChartComponent()
    c.data = [{ label: 'A', low: 10, high: 25 }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('bar')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"range-bar-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiRangeBarChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiRangeBarChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[1].data).toEqual([])
  })
})

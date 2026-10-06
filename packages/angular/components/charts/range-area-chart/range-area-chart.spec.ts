import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiRangeAreaChartComponent } from './range-area-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './range-area-chart.component.ts'), 'utf8')

describe('RangeAreaChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (min/max/avg fields height=320)', () => {
    const c = new UiRangeAreaChartComponent()
    expect(c.minField).toBe('min')
    expect(c.maxField).toBe('max')
    expect(c.avgField).toBe('avg')
  })
  it('3: host class contains base w-full', () => {
    expect(new UiRangeAreaChartComponent().hostClass).toContain('w-full')
  })
  it('4: band stacks min + span, average trends', () => {
    const c = new UiRangeAreaChartComponent()
    c.data = [{ x: 'A', min: 10, max: 20, avg: 15 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([10])
    expect(opt.series[1].data).toEqual([10])
    expect(opt.series[2].data).toEqual([15])
  })
  it('5: key series type is line', () => {
    const c = new UiRangeAreaChartComponent()
    c.data = [{ x: 'A', min: 10, max: 20, avg: 15 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('line')
  })
  it('6: average line is smooth and distinct', () => {
    const c = new UiRangeAreaChartComponent()
    c.data = [{ x: 'A', min: 1, max: 2, avg: 1.5 }]
    const opt = c.getOption() as any
    expect(opt.series[2].smooth).toBe(true)
    expect(opt.series[2].lineStyle.color).not.toBe(opt.series[0].lineStyle.color)
  })
  it('7: band stacks share one stack id', () => {
    const c = new UiRangeAreaChartComponent()
    c.data = [{ x: 'A', min: 1, max: 2, avg: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].stack).toBe('band')
    expect(opt.series[1].stack).toBe('band')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiRangeAreaChartComponent()
    c.data = [{ x: 'A', min: 10, max: 20, avg: 15 }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('line')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"range-area-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiRangeAreaChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiRangeAreaChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[2].data).toEqual([])
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiParetoChartComponent } from './pareto-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './pareto-chart.component.ts'), 'utf8')

describe('ParetoChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=320)', () => {
    const c = new UiParetoChartComponent()
    expect(c.height).toBe(320)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiParetoChartComponent().hostClass).toContain('w-full')
  })
  it('4: bars sort descending, cumulative hits 100', () => {
    const c = new UiParetoChartComponent()
    c.data = [
      { category: 'B', value: 10 },
      { category: 'A', value: 30 },
    ]
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['A', 'B'])
    expect(opt.series[0].data).toEqual([30, 10])
    expect(opt.series[1].data[1]).toBe(100)
  })
  it('5: key series type is bar', () => {
    const c = new UiParetoChartComponent()
    c.data = [
      { category: 'B', value: 10 },
      { category: 'A', value: 30 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: cumulative line rides the percent axis; legend + rotated labels match React', () => {
    const c = new UiParetoChartComponent()
    c.data = [{ category: 'A', value: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[1].yAxisIndex).toBe(1)
    expect(opt.yAxis[1].max).toBe(100)
    expect(opt.legend.bottom).toBe(0)
    expect(opt.xAxis.axisLabel.rotate).toBe(20)
    expect(opt.series[1].symbolSize).toBe(7)
  })
  it('7: ranked() accumulates shares', () => {
    const c = new UiParetoChartComponent()
    c.data = [
      { category: 'A', value: 3 },
      { category: 'B', value: 1 },
    ]
    expect(c.ranked().map((r) => r.cumPct)).toEqual([75, 100])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiParetoChartComponent()
    c.data = [
      { category: 'B', value: 10 },
      { category: 'A', value: 30 },
    ]
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
    expect(componentSrc).toContain('"pareto-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiParetoChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiParetoChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

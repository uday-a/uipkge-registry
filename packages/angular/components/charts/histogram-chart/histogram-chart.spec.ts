import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiHistogramChartComponent } from './histogram-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './histogram-chart.component.ts'), 'utf8')

describe('HistogramChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (bins=12 height=300)', () => {
    const c = new UiHistogramChartComponent()
    expect(c.bins).toBe(12)
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiHistogramChartComponent().hostClass).toContain('w-full')
  })
  it('4: pre-binned counts wire to zero-gap bars', () => {
    const c = new UiHistogramChartComponent()
    c.data = [
      { bin: '0–10', count: 4 },
      { bin: '10–20', count: 9 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([4, 9])
    expect(opt.xAxis.data).toEqual(['0–10', '10–20'])
  })
  it('5: key series type is bar', () => {
    const c = new UiHistogramChartComponent()
    c.data = [
      { bin: '0–10', count: 4 },
      { bin: '10–20', count: 9 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: auto-binning covers every value exactly once', () => {
    const c = new UiHistogramChartComponent()
    c.values = [1, 2, 3, 4, 5, 6, 7, 8]
    c.bins = 4
    const rows = c.binned()
    expect(rows).toHaveLength(4)
    expect(rows.reduce((s, r) => s + r.count, 0)).toBe(8)
  })
  it('7: peak bin gets the accent color (matches React/Vue)', () => {
    const c = new UiHistogramChartComponent()
    c.data = [
      { bin: 'a', count: 2 },
      { bin: 'b', count: 5 },
    ]
    const opt = c.getOption() as any
    const color = opt.series[0].itemStyle.color
    expect(typeof color).toBe('function')
    expect(color({ dataIndex: 1 })).toBe(opt.color[0])
    expect(color({ dataIndex: 0 })).toBe(opt.color[2])
    expect(opt.series[0].barCategoryGap).toBe('2%')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiHistogramChartComponent()
    c.data = [
      { bin: '0–10', count: 4 },
      { bin: '10–20', count: 9 },
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
    expect(componentSrc).toContain('"histogram-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiHistogramChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiHistogramChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

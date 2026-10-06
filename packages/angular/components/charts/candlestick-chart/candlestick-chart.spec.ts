import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiCandlestickChartComponent } from './candlestick-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './candlestick-chart.component.ts'), 'utf8')

describe('CandlestickChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (zoom=false height=320)', () => {
    const c = new UiCandlestickChartComponent()
    expect(c.zoom).toBe(false)
    expect(c.height).toBe(320)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiCandlestickChartComponent().hostClass).toContain('w-full')
  })
  it('4: OHLC maps to [open, close, low, high] tuples', () => {
    const c = new UiCandlestickChartComponent()
    c.data = [{ date: 'd1', open: 10, close: 12, low: 9, high: 13 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([[10, 12, 9, 13]])
    expect(opt.xAxis.data).toEqual(['d1'])
  })
  it('5: key series type is candlestick', () => {
    const c = new UiCandlestickChartComponent()
    c.data = [{ date: 'd1', open: 10, close: 12, low: 9, high: 13 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('candlestick')
  })
  it('6: zoom toggles the data-zoom slider', () => {
    const c = new UiCandlestickChartComponent()
    c.data = [{ date: 'd1', open: 1, close: 1, low: 1, high: 1 }]
    expect((c.getOption() as any).dataZoom).toBeUndefined()
    c.zoom = true
    const opt = c.getOption() as any
    expect(opt.dataZoom).toHaveLength(2)
  })
  it('7: bullish/bearish token colors', () => {
    const c = new UiCandlestickChartComponent()
    c.data = [{ date: 'd1', open: 1, close: 2, low: 1, high: 2 }]
    const opt = c.getOption() as any
    expect(opt.series[0].itemStyle.color).toBeTruthy()
    expect(opt.series[0].itemStyle.color0).toBeTruthy()
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiCandlestickChartComponent()
    c.data = [{ date: 'd1', open: 10, close: 12, low: 9, high: 13 }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('candlestick')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"candlestick-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiCandlestickChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiCandlestickChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

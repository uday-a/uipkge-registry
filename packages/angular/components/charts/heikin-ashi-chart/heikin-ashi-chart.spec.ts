import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiHeikinAshiChartComponent } from './heikin-ashi-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './heikin-ashi-chart.component.ts'), 'utf8')

describe('HeikinAshiChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (zoom=false height=320)', () => {
    const c = new UiHeikinAshiChartComponent()
    expect(c.zoom).toBe(false)
    expect(c.height).toBe(320)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiHeikinAshiChartComponent().hostClass).toContain('w-full')
  })
  it('4: first candle averages to (o+h+l+c)/4 close', () => {
    const c = new UiHeikinAshiChartComponent()
    c.data = [{ date: 'd1', open: 10, high: 12, low: 9, close: 11 }]
    const opt = c.getOption() as any
    expect(c.ha()[0]!.close).toBe(10.5)
    expect(opt.series[0].data[0]).toEqual([c.ha()[0]!.open, 10.5, c.ha()[0]!.low, c.ha()[0]!.high])
  })
  it('5: key series type is candlestick', () => {
    const c = new UiHeikinAshiChartComponent()
    c.data = [{ date: 'd1', open: 10, high: 12, low: 9, close: 11 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('candlestick')
  })
  it('6: averaging chains candle-over-candle', () => {
    const c = new UiHeikinAshiChartComponent()
    c.data = [
      { date: 'd1', open: 10, high: 12, low: 9, close: 11 },
      { date: 'd2', open: 11, high: 13, low: 10, close: 12 },
    ]
    const rows = c.ha()
    expect(rows).toHaveLength(2)
    expect(rows[1]!.open).not.toBe(11)
  })
  it('7: zoom toggles the data-zoom slider', () => {
    const c = new UiHeikinAshiChartComponent()
    c.data = [{ date: 'd1', open: 1, high: 1, low: 1, close: 1 }]
    expect((c.getOption() as any).dataZoom).toBeUndefined()
    c.zoom = true
    expect((c.getOption() as any).dataZoom).toHaveLength(2)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiHeikinAshiChartComponent()
    c.data = [{ date: 'd1', open: 10, high: 12, low: 9, close: 11 }]
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
    expect(componentSrc).toContain('"heikin-ashi-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiHeikinAshiChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiHeikinAshiChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

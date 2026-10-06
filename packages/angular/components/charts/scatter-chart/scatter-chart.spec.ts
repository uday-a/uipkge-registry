import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiScatterChartComponent } from './scatter-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './scatter-chart.component.ts'), 'utf8')

describe('ScatterChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (x/y fields, size 10, circle, 300)', () => {
    const c = new UiScatterChartComponent()
    expect(c.xField).toBe('x')
    expect(c.yField).toBe('y')
    expect(c.sizeField).toBeUndefined()
    expect(c.categoryField).toBeUndefined()
    expect(c.symbolSize).toBe(10)
    expect(c.symbol).toBe('circle')
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiScatterChartComponent().hostClass).toContain('w-full')
  })
  it('4: option maps rows to [x, y, size] triples', () => {
    const c = new UiScatterChartComponent()
    c.data = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]
    const opt = c.getOption() as any
    expect(opt.series).toHaveLength(1)
    expect(opt.series[0].type).toBe('scatter')
    expect(opt.series[0].name).toBe('default')
    expect(opt.series[0].data).toEqual([
      [1, 2, 0],
      [3, 4, 0],
    ])
  })
  it('5: symbol size + shape flow into series', () => {
    const c = new UiScatterChartComponent()
    c.data = [{ x: 1, y: 1 }]
    c.symbolSize = 16
    c.symbol = 'rect'
    const s = (c.getOption() as any).series[0]
    expect(s.symbolSize).toBe(16)
    expect(s.symbol).toBe('rect')
  })
  it('6: sizeField encodes bubble size like React/Vue', () => {
    const c = new UiScatterChartComponent()
    c.data = [
      { x: 1, y: 1, size: 25 },
      { x: 2, y: 2, size: 36 },
    ]
    c.sizeField = 'size'
    const s = (c.getOption() as any).series[0]
    expect(s.data).toEqual([
      [1, 1, 25],
      [2, 2, 36],
    ])
    expect(typeof s.symbolSize).toBe('function')
    expect(s.symbolSize([1, 1, 25])).toBe(Math.sqrt(25) * 3 + 4)
  })
  it('7: categoryField splits one series per value + legend', () => {
    const c = new UiScatterChartComponent()
    c.data = [
      { x: 1, y: 1, category: 'A' },
      { x: 2, y: 2, category: 'B' },
      { x: 3, y: 3, category: 'A' },
    ]
    c.categoryField = 'category'
    const opt = c.getOption() as any
    expect(c.categories()).toEqual(['A', 'B'])
    expect(opt.series.map((s: any) => s.name)).toEqual(['A', 'B'])
    expect(opt.series[0].data).toEqual([
      [1, 1, 0],
      [3, 3, 0],
    ])
    expect(opt.legend.bottom).toBe(0)
    expect(opt.grid.bottom).toBe(32)
  })
  it('8: custom fields remap points', () => {
    const c = new UiScatterChartComponent()
    c.data = [{ lat: 1, lng: 2 }]
    c.xField = 'lng'
    c.yField = 'lat'
    expect(c.points()).toEqual([[2, 1]])
  })
  it('9: user series merge per-index without dropping the computed scatter', () => {
    const c = new UiScatterChartComponent()
    c.data = [{ x: 1, y: 1 }]
    c.option = { series: [{ markLine: { silent: true } }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('scatter')
    expect(opt.series[0].markLine).toEqual({ silent: true })
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: data-slot scatter-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"scatter-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiScatterChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

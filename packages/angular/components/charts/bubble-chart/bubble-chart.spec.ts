import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBubbleChartComponent } from './bubble-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './bubble-chart.component.ts'), 'utf8')

describe('BubbleChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (x/y/size fields opacity min/max height=320)', () => {
    const c = new UiBubbleChartComponent()
    expect(c.xField).toBe('x')
    expect(c.yField).toBe('y')
    expect(c.sizeField).toBe('size')
    expect(c.opacity).toBe(0.75)
    expect(c.minSize).toBe(8)
    expect(c.maxSize).toBe(42)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiBubbleChartComponent().hostClass).toContain('w-full')
  })
  it('4: third dimension wires into [x, y, size] tuples', () => {
    const c = new UiBubbleChartComponent()
    c.data = [
      { x: 1, y: 2, size: 4 },
      { x: 3, y: 4, size: 16 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].slice(0, 3)).toEqual([1, 2, 4])
    expect(opt.series[0].data[1].slice(0, 3)).toEqual([3, 4, 16])
  })
  it('5: key series type is scatter', () => {
    const c = new UiBubbleChartComponent()
    c.data = [
      { x: 1, y: 2, size: 4 },
      { x: 3, y: 4, size: 16 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('scatter')
  })
  it('6: area scales with square root (4x value = 2x radius span)', () => {
    const c = new UiBubbleChartComponent()
    const span = c.maxSize - c.minSize
    expect(c.scaleSize(16, 16) - c.minSize).toBeCloseTo(span, 8)
    expect(c.scaleSize(4, 16) - c.minSize).toBeCloseTo(span / 2, 8)
  })
  it('7: categoryField splits series', () => {
    const c = new UiBubbleChartComponent()
    c.data = [
      { x: 1, y: 1, size: 1, k: 'a' },
      { x: 2, y: 2, size: 1, k: 'b' },
    ]
    c.categoryField = 'k'
    const opt = c.getOption() as any
    expect(opt.series).toHaveLength(2)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiBubbleChartComponent()
    c.data = [
      { x: 1, y: 2, size: 4 },
      { x: 3, y: 4, size: 16 },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('scatter')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"bubble-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiBubbleChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiBubbleChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

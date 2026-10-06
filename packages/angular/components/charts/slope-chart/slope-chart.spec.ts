import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiSlopeChartComponent } from './slope-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './slope-chart.component.ts'), 'utf8')

describe('SlopeChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=320)', () => {
    const c = new UiSlopeChartComponent()
    expect(c.height).toBe(320)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiSlopeChartComponent().hostClass).toContain('w-full')
  })
  it('4: one line per entry across shared points', () => {
    const c = new UiSlopeChartComponent()
    c.data = [
      { label: 'A', values: [3, 1] },
      { label: 'B', values: [1, 2] },
    ]
    c.points = ['2024', '2025']
    const opt = c.getOption() as any
    expect(opt.series).toHaveLength(2)
    expect(opt.series[0].data).toEqual([3, 1])
    expect(opt.xAxis.data).toEqual(['2024', '2025'])
    const fallback = new UiSlopeChartComponent()
    fallback.data = [
      { label: 'A', values: [3, 1] },
      { label: 'B', values: [1, 2] },
    ]
    expect((fallback.getOption() as any).xAxis.data).toEqual(['P1', 'P2'])
  })
  it('5: key series type is line', () => {
    const c = new UiSlopeChartComponent()
    c.data = [
      { label: 'A', values: [3, 1] },
      { label: 'B', values: [1, 2] },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('line')
  })
  it('6: end labels alternate sides to avoid collisions', () => {
    const c = new UiSlopeChartComponent()
    c.data = [
      { label: 'A', values: [1, 2] },
      { label: 'B', values: [2, 1] },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].label.position).not.toBe(opt.series[1].label.position)
  })
  it('7: series carry their own palette color', () => {
    const c = new UiSlopeChartComponent()
    c.data = [
      { label: 'A', values: [1] },
      { label: 'B', values: [2] },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].lineStyle.color).not.toBe(opt.series[1].lineStyle.color)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiSlopeChartComponent()
    c.data = [
      { label: 'A', values: [3, 1] },
      { label: 'B', values: [1, 2] },
    ]
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
    expect(componentSrc).toContain('"slope-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiSlopeChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiSlopeChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series).toEqual([])
  })
})

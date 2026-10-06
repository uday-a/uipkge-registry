import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiComboChartComponent } from './combo-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './combo-chart.component.ts'), 'utf8')

describe('ComboChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (x/bar/line fields height=320)', () => {
    const c = new UiComboChartComponent()
    expect(c.xField).toBe('x')
    expect(c.barField).toBe('bar')
    expect(c.lineField).toBe('line')
  })
  it('3: host class contains base w-full', () => {
    expect(new UiComboChartComponent().hostClass).toContain('w-full')
  })
  it('4: bars + lines share categories', () => {
    const c = new UiComboChartComponent()
    c.data = [
      { x: 'Q1', bar: 10, line: 20 },
      { x: 'Q2', bar: 15, line: 25 },
    ]
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['Q1', 'Q2'])
    expect(opt.series[0].data).toEqual([10, 15])
    expect(opt.series[1].data).toEqual([20, 25])
  })
  it('5: key series type is bar', () => {
    const c = new UiComboChartComponent()
    c.data = [
      { x: 'Q1', bar: 10, line: 20 },
      { x: 'Q2', bar: 15, line: 25 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: lines ride the right axis, bars the left', () => {
    const c = new UiComboChartComponent()
    c.data = [{ x: 'a', bar: 1, line: 2 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
    expect(opt.series[1].type).toBe('line')
    expect(opt.series[1].yAxisIndex).toBe(1)
  })
  it('7: array fields fan out to multi-series', () => {
    const c = new UiComboChartComponent()
    c.data = [{ x: 'a', b1: 1, b2: 2, line: 3 }]
    c.barField = ['b1', 'b2']
    const opt = c.getOption() as any
    expect(opt.series.map((s: any) => s.type)).toEqual(['bar', 'bar', 'line'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiComboChartComponent()
    c.data = [
      { x: 'Q1', bar: 10, line: 20 },
      { x: 'Q2', bar: 15, line: 25 },
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
    expect(componentSrc).toContain('"combo-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiComboChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiComboChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

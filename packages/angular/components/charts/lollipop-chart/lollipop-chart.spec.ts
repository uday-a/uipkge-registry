import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiLollipopChartComponent } from './lollipop-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './lollipop-chart.component.ts'), 'utf8')

describe('LollipopChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (data=[], height=300, no x/y fields)', () => {
    const c = new UiLollipopChartComponent()
    expect(c.data).toEqual([])
    expect(c.height).toBe(300)
    expect('xField' in c).toBe(false)
    expect('yField' in c).toBe(false)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiLollipopChartComponent().hostClass).toContain('w-full')
  })
  it('4: stems + dots share values', () => {
    const c = new UiLollipopChartComponent()
    c.data = [
      { category: 'A', value: 5 },
      { category: 'B', value: 9 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([5, 9])
    expect(opt.series[1].data).toEqual([
      ['A', 5],
      ['B', 9],
    ])
  })
  it('5: key series type is bar', () => {
    const c = new UiLollipopChartComponent()
    c.data = [
      { category: 'A', value: 5 },
      { category: 'B', value: 9 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: series match React/Vue (stem barWidth 3, dot symbolSize 14, hidden legend)', () => {
    const c = new UiLollipopChartComponent()
    c.data = [{ category: 'A', value: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].name).toBe('stem')
    expect(opt.series[0].barWidth).toBe(3)
    expect(opt.series[0].silent).toBe(true)
    expect(opt.series[1].name).toBe('value')
    expect(opt.series[1].symbolSize).toBe(14)
    expect(opt.series[1].label.show).toBe(true)
    expect(opt.legend).toEqual({ show: false })
    expect(opt.tooltip.axisPointer).toEqual({ type: 'shadow' })
    expect((opt.xAxis as any).data).toEqual(['A'])
  })
  it('7: category/value data drives both series', () => {
    const c = new UiLollipopChartComponent()
    c.data = [{ category: 'K', value: 7 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([7])
    expect(opt.series[1].data).toEqual([['K', 7]])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiLollipopChartComponent()
    c.data = [
      { category: 'A', value: 5 },
      { category: 'B', value: 9 },
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
    expect(componentSrc).toContain('"lollipop-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiLollipopChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiLollipopChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

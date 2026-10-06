import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiStackedAreaChartComponent } from './stacked-area-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './stacked-area-chart.component.ts'), 'utf8')

describe('StackedAreaChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults match React/Vue (percent=false height=320)', () => {
    const c = new UiStackedAreaChartComponent()
    expect(c.percent).toBe(false)
    expect(c.height).toBe(320)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiStackedAreaChartComponent().hostClass).toContain('w-full')
  })
  it('4: fields stack with area fills', () => {
    const c = new UiStackedAreaChartComponent()
    c.data = [{ x: 'A', a: 10, b: 20 }]
    c.yField = ['a', 'b']
    const opt = c.getOption() as any
    expect(opt.series.map((s: any) => s.stack)).toEqual(['areas', 'areas'])
    expect(opt.series[0].data).toEqual([10])
    expect(opt.series[0].areaStyle).toBeTruthy()
  })
  it('5: key series type is line', () => {
    const c = new UiStackedAreaChartComponent()
    c.data = [{ x: 'A', a: 10, b: 20 }]
    c.yField = ['a', 'b']
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('line')
  })
  it('6: percent mode normalizes each x to 100', () => {
    const c = new UiStackedAreaChartComponent()
    c.data = [{ x: 'A', a: 1, b: 3 }]
    c.yField = ['a', 'b']
    c.percent = true
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([25])
    expect(opt.series[1].data).toEqual([75])
    expect(opt.yAxis.max).toBe(100)
  })
  it('7: curves are smooth with no point markers (React/Vue styling)', () => {
    const c = new UiStackedAreaChartComponent()
    c.data = [{ x: 'A', a: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].smooth).toBe(true)
    expect(opt.series[0].symbol).toBe('none')
    expect(opt.series[0].lineStyle.width).toBe(1.5)
    expect(opt.series[0].emphasis).toEqual({ focus: 'series' })
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiStackedAreaChartComponent()
    c.data = [{ x: 'A', a: 10, b: 20 }]
    c.yField = ['a', 'b']
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
    expect(componentSrc).toContain('"stacked-area-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiStackedAreaChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiStackedAreaChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

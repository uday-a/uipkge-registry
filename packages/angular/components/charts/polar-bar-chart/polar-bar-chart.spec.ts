import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiPolarBarChartComponent } from './polar-bar-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './polar-bar-chart.component.ts'), 'utf8')

describe('PolarBarChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=320)', () => {
    const c = new UiPolarBarChartComponent()
    expect(c.height).toBe(320)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiPolarBarChartComponent().hostClass).toContain('w-full')
  })
  it('4: spokes wire with per-spoke colors', () => {
    const c = new UiPolarBarChartComponent()
    c.data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([10, 20])
    expect(opt.radiusAxis.data).toEqual(['A', 'B'])
  })
  it('5: key series type is bar', () => {
    const c = new UiPolarBarChartComponent()
    c.data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: bars ride the polar coordinate system', () => {
    const c = new UiPolarBarChartComponent()
    c.data = [{ category: 'A', value: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].coordinateSystem).toBe('polar')
    expect(opt.polar.radius).toEqual(['18%', '78%'])
  })
  it('7: caps are rounded (radius 6, React parity)', () => {
    const c = new UiPolarBarChartComponent()
    c.data = [{ category: 'A', value: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].itemStyle.borderRadius).toBe(6)
    expect(opt.series[0].data).toEqual([1])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiPolarBarChartComponent()
    c.data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
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
    expect(componentSrc).toContain('"polar-bar-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiPolarBarChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiPolarBarChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

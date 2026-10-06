import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiNightingaleChartComponent } from './nightingale-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './nightingale-chart.component.ts'), 'utf8')

describe('NightingaleChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=340)', () => {
    const c = new UiNightingaleChartComponent()
    expect(c.height).toBe(340)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiNightingaleChartComponent().hostClass).toContain('w-full')
  })
  it('4: petals wire through with palette colors', () => {
    const c = new UiNightingaleChartComponent()
    c.data = [
      { name: 'A', value: 10 },
      { name: 'B', value: 40 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data.map((d: any) => d.value)).toEqual([10, 40])
    expect(opt.color.length).toBeGreaterThan(0)
    expect(opt.series[0].itemStyle.borderWidth).toBe(2)
  })
  it('5: key series type is pie', () => {
    const c = new UiNightingaleChartComponent()
    c.data = [
      { name: 'A', value: 10 },
      { name: 'B', value: 40 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('pie')
  })
  it('6: radius encodes value (roseType radius)', () => {
    const c = new UiNightingaleChartComponent()
    c.data = [{ name: 'A', value: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].roseType).toBe('radius')
    expect(opt.series[0].itemStyle.borderRadius).toBe(6)
  })
  it('7: outer radius leaves room for the legend', () => {
    const c = new UiNightingaleChartComponent()
    const opt = c.getOption() as any
    expect(opt.series[0].radius).toEqual(['18%', '72%'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiNightingaleChartComponent()
    c.data = [
      { name: 'A', value: 10 },
      { name: 'B', value: 40 },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('pie')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"nightingale-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiNightingaleChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiNightingaleChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

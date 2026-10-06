import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiSunburstChartComponent } from './sunburst-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './sunburst-chart.component.ts'), 'utf8')

describe('SunburstChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults match React/Vue (height=360 radius=12%/90%)', () => {
    const c = new UiSunburstChartComponent()
    expect(c.height).toBe(360)
    expect(c.radius).toEqual(['12%', '90%'])
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiSunburstChartComponent().hostClass).toContain('w-full')
  })
  it('4: hierarchy wires through with painted levels', () => {
    const c = new UiSunburstChartComponent()
    c.data = [{ name: 'A', children: [{ name: 'A1', value: 10 }] }]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].name).toBe('A')
    expect(opt.series[0].data[0].children[0].value).toBe(10)
    expect(opt.series[0].data[0].itemStyle.color).toBeTruthy()
  })
  it('5: key series type is sunburst', () => {
    const c = new UiSunburstChartComponent()
    c.data = [{ name: 'A', children: [{ name: 'A1', value: 10 }] }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('sunburst')
  })
  it('6: sibling order is preserved (no auto-sort)', () => {
    const c = new UiSunburstChartComponent()
    c.data = [
      { name: 'B', value: 1 },
      { name: 'A', value: 99 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].sort).toBeUndefined()
    expect(opt.series[0].data[0].name).toBe('B')
  })
  it('7: radius input wires through (default 12% to 90%)', () => {
    const c = new UiSunburstChartComponent()
    expect((c.getOption() as any).series[0].radius).toEqual(['12%', '90%'])
    c.radius = ['0%', '90%']
    expect((c.getOption() as any).series[0].radius).toEqual(['0%', '90%'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiSunburstChartComponent()
    c.data = [{ name: 'A', children: [{ name: 'A1', value: 10 }] }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('sunburst')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"sunburst-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiSunburstChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiSunburstChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

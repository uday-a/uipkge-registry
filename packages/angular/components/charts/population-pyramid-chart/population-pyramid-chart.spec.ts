import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiPopulationPyramidChartComponent } from './population-pyramid-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './population-pyramid-chart.component.ts'), 'utf8')

describe('PopulationPyramidChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=340)', () => {
    const c = new UiPopulationPyramidChartComponent()
    expect(c.height).toBe(340)
    expect(c.names).toEqual(['Male', 'Female'])
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiPopulationPyramidChartComponent().hostClass).toContain('w-full')
  })
  it('4: left negates, right extends, bands on yAxis', () => {
    const c = new UiPopulationPyramidChartComponent()
    c.data = [{ band: '0–9', left: 50, right: 48 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([-50])
    expect(opt.series[1].data).toEqual([48])
    expect(opt.yAxis.data).toEqual(['0–9'])
    expect(opt.series.map((s: any) => s.name)).toEqual(['Male', 'Female'])
    c.names = ['Control', 'Variant']
    expect((c.getOption() as any).series.map((s: any) => s.name)).toEqual(['Control', 'Variant'])
  })
  it('5: key series type is bar', () => {
    const c = new UiPopulationPyramidChartComponent()
    c.data = [{ band: '0–9', left: 50, right: 48 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: axis + tooltip show absolute values', () => {
    const c = new UiPopulationPyramidChartComponent()
    c.data = [{ band: 'a', left: 1, right: 1 }]
    const opt = c.getOption() as any
    expect(opt.xAxis.axisLabel.formatter(-42)).toBe(42)
    expect(opt.tooltip.valueFormatter(-7)).toBe(7)
  })
  it('7: sides share one stack', () => {
    const c = new UiPopulationPyramidChartComponent()
    c.data = [{ band: 'a', left: 1, right: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].stack).toBe('pop')
    expect(opt.series[1].stack).toBe('pop')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiPopulationPyramidChartComponent()
    c.data = [{ band: '0–9', left: 50, right: 48 }]
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
    expect(componentSrc).toContain('"population-pyramid-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiPopulationPyramidChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiPopulationPyramidChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

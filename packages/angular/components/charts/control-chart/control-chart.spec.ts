import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiControlChartComponent } from './control-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './control-chart.component.ts'), 'utf8')

describe('ControlChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (x/value fields height=300)', () => {
    const c = new UiControlChartComponent()
    expect(c.xField).toBe('x')
    expect(c.yField).toBe('value')
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiControlChartComponent().hostClass).toContain('w-full')
  })
  it('4: run values wire to the lead series', () => {
    const c = new UiControlChartComponent()
    c.data = [
      { x: '1', value: 10 },
      { x: '2', value: 12 },
      { x: '3', value: 11 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([10, 12, 11])
    expect(opt.xAxis.data).toEqual(['1', '2', '3'])
  })
  it('5: key series type is line', () => {
    const c = new UiControlChartComponent()
    c.data = [
      { x: '1', value: 10 },
      { x: '2', value: 12 },
      { x: '3', value: 11 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('line')
  })
  it('6: limits auto-compute to mean ± 2σ', () => {
    const c = new UiControlChartComponent()
    c.data = [
      { x: '1', value: 10 },
      { x: '2', value: 12 },
      { x: '3', value: 11 },
    ]
    const { mean, ucl, lcl } = c.limits()
    expect(mean).toBeCloseTo(11, 8)
    expect(ucl).toBeGreaterThan(mean)
    expect(lcl).toBeLessThan(mean)
  })
  it('7: out-of-spec points resolve the danger color', () => {
    const c = new UiControlChartComponent()
    c.data = [{ x: '1', value: 10 }]
    const opt = c.getOption() as any
    const colorFor = opt.series[0].itemStyle.color
    const { ucl } = c.limits()
    expect(colorFor({ value: ucl + 5 })).toBeTruthy()
    expect(colorFor({ value: ucl + 5 })).not.toBe(colorFor({ value: 10 }))
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiControlChartComponent()
    c.data = [
      { x: '1', value: 10 },
      { x: '2', value: 12 },
      { x: '3', value: 11 },
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
    expect(componentSrc).toContain('"control-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiControlChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiControlChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

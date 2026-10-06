import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBulletChartComponent } from './bullet-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './bullet-chart.component.ts'), 'utf8')

describe('BulletChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=300)', () => {
    const c = new UiBulletChartComponent()
    expect(c.height).toBe(300)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiBulletChartComponent().hostClass).toContain('w-full')
  })
  it('4: bands stack to the good-range ceiling, actual + target wire through', () => {
    const c = new UiBulletChartComponent()
    c.data = [{ label: 'Revenue', actual: 75, target: 80, ranges: [50, 70, 100] }]
    const opt = c.getOption() as any
    const band = opt.series[0].data[0] + opt.series[1].data[0] + opt.series[2].data[0]
    expect(band).toBe(100)
    expect(opt.series[3].data).toEqual([75])
    expect(opt.series[4].data).toEqual([[80, 0]])
  })
  it('5: key series type is bar', () => {
    const c = new UiBulletChartComponent()
    c.data = [{ label: 'Revenue', actual: 75, target: 80, ranges: [50, 70, 100] }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: target marker is a vertical tick', () => {
    const c = new UiBulletChartComponent()
    c.data = [{ label: 'A', actual: 1, target: 2, ranges: [1, 2, 3] }]
    const opt = c.getOption() as any
    expect(opt.series[4].type).toBe('scatter')
    expect(opt.series[4].symbol).toBe('rect')
    expect(opt.series[4].symbolSize).toEqual([3, 24])
    expect(opt.series[4].z).toBe(4)
    expect(opt.series[3].barGap).toBe('-90%')
    expect(opt.series[3].label).toMatchObject({ show: true, position: 'right' })
  })
  it('7: five series per row set (3 bands + actual + target)', () => {
    const c = new UiBulletChartComponent()
    c.data = [{ label: 'A', actual: 1, target: 2, ranges: [1, 2, 3] }]
    const opt = c.getOption() as any
    expect(opt.series.map((s: any) => s.type)).toEqual(['bar', 'bar', 'bar', 'bar', 'scatter'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiBulletChartComponent()
    c.data = [{ label: 'Revenue', actual: 75, target: 80, ranges: [50, 70, 100] }]
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
    expect(componentSrc).toContain('"bullet-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiBulletChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiBulletChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[3].data).toEqual([])
  })
})

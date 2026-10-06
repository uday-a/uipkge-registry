import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiViolinChartComponent } from './violin-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './violin-chart.component.ts'), 'utf8')

describe('ViolinChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=340)', () => {
    const c = new UiViolinChartComponent()
    expect(c.height).toBe(340)
    expect(c.groups).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiViolinChartComponent().hostClass).toContain('w-full')
  })
  it('4: one violin + shared quartile box', () => {
    const c = new UiViolinChartComponent()
    c.groups = [{ group: 'G', values: [1, 2, 3, 4, 5] }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('custom')
    expect(opt.series[1].type).toBe('boxplot')
    expect(opt.series[1].data[0]).toEqual([1, 2, 3, 4, 5])
  })
  it('5: key series type is custom', () => {
    const c = new UiViolinChartComponent()
    c.groups = [{ group: 'G', values: [1, 2, 3, 4, 5] }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('custom')
  })
  it('6: KDE peaks near the sample centre', () => {
    const c = new UiViolinChartComponent()
    const pts = c.kde([1, 2, 3, 4, 5])
    expect(pts).toHaveLength(40)
    const peak = pts.reduce((a, b) => (b.y > a.y ? b : a))
    expect(Math.abs(peak.x - 3)).toBeLessThan(0.6)
  })
  it('7: quartiles interpolate medians', () => {
    const c = new UiViolinChartComponent()
    expect(c.quartiles([1, 2, 3, 4]).median).toBe(2.5)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiViolinChartComponent()
    c.groups = [{ group: 'G', values: [1, 2, 3, 4, 5] }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('custom')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"violin-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiViolinChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiViolinChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series).toHaveLength(1)
  })
})

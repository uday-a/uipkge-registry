import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiChordChartComponent } from './chord-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './chord-chart.component.ts'), 'utf8')

describe('ChordChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=380)', () => {
    const c = new UiChordChartComponent()
    expect(c.height).toBe(380)
    expect(c.nodes).toEqual([])
    expect(c.links).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiChordChartComponent().hostClass).toContain('w-full')
  })
  it('4: nodes + links wire through', () => {
    const c = new UiChordChartComponent()
    c.nodes = [{ name: 'A' }, { name: 'B' }]
    c.links = [{ source: 'A', target: 'B', value: 4 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toHaveLength(2)
    expect(opt.series[0].links).toEqual([{ source: 'A', target: 'B', value: 4 }])
  })
  it('5: key series type is chord', () => {
    const c = new UiChordChartComponent()
    c.nodes = [{ name: 'A' }, { name: 'B' }]
    c.links = [{ source: 'A', target: 'B', value: 4 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('chord')
  })
  it('6: adjacency focus with readable ribbons', () => {
    const c = new UiChordChartComponent()
    const opt = c.getOption() as any
    expect(opt.series[0].emphasis.focus).toBe('adjacency')
    expect(opt.series[0].padAngle).toBe(4)
  })
  it('7: labels use the chart text token', () => {
    const c = new UiChordChartComponent()
    const opt = c.getOption() as any
    expect(opt.series[0].label.fontSize).toBe(11)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiChordChartComponent()
    c.nodes = [{ name: 'A' }, { name: 'B' }]
    c.links = [{ source: 'A', target: 'B', value: 4 }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('chord')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"chord-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiChordChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiChordChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

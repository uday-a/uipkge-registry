import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiQuadrantChartComponent } from './quadrant-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './quadrant-chart.component.ts'), 'utf8')

describe('QuadrantChart (angular parity, 11 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (quadrant titles height=340)', () => {
    const c = new UiQuadrantChartComponent()
    expect(c.quadrantLabels).toEqual(['Stars', 'Question marks', 'Dogs', 'Cash cows'])
    expect(c.height).toBe(340)
    expect(c.xMid).toBeUndefined()
    expect(c.yMid).toBeUndefined()
  })
  it('3: host class contains base w-full', () => {
    expect(new UiQuadrantChartComponent().hostClass).toContain('w-full')
  })
  it('4: points wire to [x, y] values', () => {
    const c = new UiQuadrantChartComponent()
    c.data = [
      { x: 1, y: 5, label: 'A' },
      { x: 9, y: 2, label: 'B' },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([
      [1, 5, 'A'],
      [9, 2, 'B'],
    ])
  })
  it('5: key series type is scatter', () => {
    const c = new UiQuadrantChartComponent()
    c.data = [
      { x: 1, y: 5, label: 'A' },
      { x: 9, y: 2, label: 'B' },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('scatter')
  })
  it('6: median split drives the crosshairs (xMid/yMid override)', () => {
    const c = new UiQuadrantChartComponent()
    c.data = [
      { x: 1, y: 1 },
      { x: 3, y: 3 },
      { x: 9, y: 9 },
    ]
    expect(c.medians()).toEqual({ mx: 3, my: 3 })
    const opt = c.getOption() as any
    expect(opt.series[0].markLine.data).toEqual([{ xAxis: 3 }, { yAxis: 3 }])
    const even = new UiQuadrantChartComponent()
    even.data = [
      { x: 1, y: 2 },
      { x: 5, y: 8 },
    ]
    expect(even.medians()).toEqual({ mx: 3, my: 5 })
    c.xMid = 4
    c.yMid = 6
    expect((c.getOption() as any).series[0].markLine.data).toEqual([{ xAxis: 4 }, { yAxis: 6 }])
  })
  it('7: quadrant titles render as shaded markAreas', () => {
    const c = new UiQuadrantChartComponent()
    c.data = [{ x: 1, y: 1 }]
    c.quadrantLabels = ['A', 'B', 'C', 'D']
    const opt = c.getOption() as any
    expect(opt.series[0].markArea.data.map((q: any) => q[0].label.formatter)).toEqual(['A', 'B', 'C', 'D'])
    expect(opt.series[0].markArea.silent).toBe(true)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiQuadrantChartComponent()
    c.data = [
      { x: 1, y: 5, label: 'A' },
      { x: 9, y: 2, label: 'B' },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('scatter')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"quadrant-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiQuadrantChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiQuadrantChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })

  it('11: registers the mark-area component its quadrant labels use', () => {
    // Without it ECharts logs "Component markArea is used but not imported" and the labels never draw.
    expect(componentSrc).toContain('comps.MarkAreaComponent')
    expect(componentSrc).toContain('comps.MarkLineComponent')
  })
})

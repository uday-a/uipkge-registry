import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiParallelChartComponent } from './parallel-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './parallel-chart.component.ts'), 'utf8')

function grouped() {
  const c = new UiParallelChartComponent()
  c.axes = [
    { name: 'a', min: 0, max: 10 },
    { name: 'b' },
    { name: 'c' },
  ]
  c.data = [
    { name: 'r1', values: [1, 2, 3], group: 0 },
    { name: 'r2', values: [4, 5, 6], group: 1 },
    { name: 'r3', values: [7, 8, 9] },
  ]
  c.groups = ['g0', 'g1']
  return c
}

describe('ParallelChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=360, empty axes/data)', () => {
    const c = new UiParallelChartComponent()
    expect(c.height).toBe(360)
    expect(c.axes).toEqual([])
    expect(c.data).toEqual([])
    expect(c.groups).toBeUndefined()
  })
  it('3: host class contains base w-full', () => {
    expect(new UiParallelChartComponent().hostClass).toContain('w-full')
  })
  it('4: rows wire to polylines across N axes', () => {
    const opt = grouped().getOption() as any
    expect(opt.series[0].data).toEqual([
      { value: [1, 2, 3], name: 'r1' },
      { value: [7, 8, 9], name: 'r3' },
    ])
    expect(opt.series[1].data).toEqual([{ value: [4, 5, 6], name: 'r2' }])
    expect(opt.parallelAxis.map((a: any) => a.name)).toEqual(['a', 'b', 'c'])
  })
  it('5: key series type is parallel', () => {
    const opt = grouped().getOption() as any
    expect(opt.series).toHaveLength(2)
    expect(opt.series[0].type).toBe('parallel')
    expect(opt.series.map((s: any) => s.name)).toEqual(['g0', 'g1'])
  })
  it('6: one axis per entry, explicit scales pass through', () => {
    const c = new UiParallelChartComponent()
    c.axes = [
      { name: 'x', min: 0, max: 5 },
      { name: 'y' },
    ]
    const opt = c.getOption() as any
    expect(opt.parallelAxis).toHaveLength(2)
    expect(opt.parallelAxis[0].dim).toBe(0)
    expect(opt.parallelAxis[0].min).toBe(0)
    expect(opt.parallelAxis[0].max).toBe(5)
    expect(opt.parallelAxis[1].max).toBeUndefined()
  })
  it('7: legend appears only with groups; polylines stay translucent', () => {
    const opt = grouped().getOption() as any
    expect(opt.legend.bottom).toBe(0)
    expect(opt.series[0].lineStyle).toEqual({ width: 1, opacity: 0.6 })
    const solo = new UiParallelChartComponent()
    solo.axes = [{ name: 'a' }]
    solo.data = [{ values: [1] }]
    const soloOpt = solo.getOption() as any
    expect(soloOpt.legend).toBeUndefined()
    expect(soloOpt.series).toHaveLength(1)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = grouped()
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('parallel')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"parallel-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiParallelChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiParallelChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

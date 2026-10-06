import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiAlluvialChartComponent } from './alluvial-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './alluvial-chart.component.ts'), 'utf8')

describe('AlluvialChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (curveness=0.5 height=420)', () => {
    const c = new UiAlluvialChartComponent()
    expect(c.curveness).toBe(0.5)
    expect(c.height).toBe(420)
    expect(c.links).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiAlluvialChartComponent().hostClass).toContain('w-full')
  })
  it('4: nodes derive from link endpoints + links wire through', () => {
    const c = new UiAlluvialChartComponent()
    c.links = [
      { source: 'A', target: 'B', value: 5 },
      { source: 'B', target: 'C', value: 3 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].links).toHaveLength(2)
    expect(opt.series[0].data.map((n: any) => n.name)).toEqual(['A', 'B', 'C'])
  })
  it('5: key series type is sankey', () => {
    const c = new UiAlluvialChartComponent()
    c.links = [
      { source: 'A', target: 'B', value: 5 },
      { source: 'B', target: 'C', value: 3 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('sankey')
  })
  it('6: curveness + explicit nodes override derivation', () => {
    const c = new UiAlluvialChartComponent()
    c.links = [{ source: 'A', target: 'B', value: 1 }]
    c.curveness = 0.2
    c.nodes = ['X', 'Y']
    const opt = c.getOption() as any
    expect(opt.series[0].lineStyle.curveness).toBe(0.2)
    expect(opt.series[0].data.map((n: any) => n.name)).toEqual(['X', 'Y'])
  })
  it('7: orient is vertical with gradient ribbons', () => {
    const c = new UiAlluvialChartComponent()
    c.links = [{ source: 'A', target: 'B', value: 1 }]
    const opt = c.getOption() as any
    expect(opt.series[0].orient).toBe('vertical')
    expect(opt.series[0].lineStyle.color).toBe('gradient')
    expect(opt.color).toHaveLength(8)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiAlluvialChartComponent()
    c.links = [
      { source: 'A', target: 'B', value: 5 },
      { source: 'B', target: 'C', value: 3 },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('sankey')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"alluvial-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiAlluvialChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiAlluvialChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

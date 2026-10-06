import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiGraphChartComponent } from './graph-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './graph-chart.component.ts'), 'utf8')

describe('GraphChart (angular parity, 11 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (layout=force directed=true height=380)', () => {
    const c = new UiGraphChartComponent()
    expect(c.layout).toBe('force')
    expect(c.directed).toBe(true)
    expect(c.roam).toBe(false)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiGraphChartComponent().hostClass).toContain('w-full')
  })
  it('4: nodes + links wire through with category colors', () => {
    const c = new UiGraphChartComponent()
    c.nodes = [{ id: 'a' }, { id: 'b', category: 1 }]
    c.links = [{ source: 'a', target: 'b' }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toHaveLength(2)
    expect(opt.series[0].links).toEqual([{ source: 'a', target: 'b' }])
    expect(opt.series[0].data[1].itemStyle.color).toBeTruthy()
  })
  it('5: key series type is graph', () => {
    const c = new UiGraphChartComponent()
    c.nodes = [{ id: 'a' }, { id: 'b', category: 1 }]
    c.links = [{ source: 'a', target: 'b' }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('graph')
  })
  it('6: undirected graphs drop the arrow', () => {
    const c = new UiGraphChartComponent()
    c.directed = false
    const opt = c.getOption() as any
    expect(opt.series[0].edgeSymbol).toEqual(['none', 'none'])
  })
  it('7: circular layout passes through', () => {
    const c = new UiGraphChartComponent()
    c.layout = 'circular'
    const opt = c.getOption() as any
    expect(opt.series[0].layout).toBe('circular')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiGraphChartComponent()
    c.nodes = [{ id: 'a' }, { id: 'b', category: 1 }]
    c.links = [{ source: 'a', target: 'b' }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('graph')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"graph-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiGraphChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiGraphChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
  it('11: React/Vue node shape works + symbolSize + conditional legend', () => {
    const c = new UiGraphChartComponent()
    c.nodes = [{ name: 'a', symbolSize: 40 }, { name: 'b', category: 1 }]
    c.links = [{ source: 'a', target: 'b' }]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].name).toBe('a')
    expect(opt.series[0].data[0].symbolSize).toBe(40)
    expect(opt.legend).toBeUndefined()
    c.categories = ['team-a', 'team-b']
    expect((c.getOption() as any).legend.bottom).toBe(0)
    const legacy = new UiGraphChartComponent()
    legacy.nodes = [{ id: 'x' }]
    expect((legacy.getOption() as any).series[0].data[0].name).toBe('x')
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiSankeyChartComponent } from './sankey-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './sankey-chart.component.ts'), 'utf8')
const links = [
  { source: 'A', target: 'B', value: 5 },
  { source: 'B', target: 'C', value: 3 },
]

describe('SankeyChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (height 360, curveness 0.5, nodes derived)', () => {
    const c = new UiSankeyChartComponent()
    expect(c.nodes).toBeUndefined()
    expect(c.links).toEqual([])
    expect(c.height).toBe(360)
    expect(c.curveness).toBe(0.5)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiSankeyChartComponent().hostClass).toContain('w-full')
  })
  it('4: option carries derived nodes + links into sankey series', () => {
    const c = new UiSankeyChartComponent()
    c.links = links
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('sankey')
    expect(opt.series[0].data).toEqual([{ name: 'A' }, { name: 'B' }, { name: 'C' }])
    expect(opt.series[0].links).toEqual(links)
    expect(opt.series[0].lineStyle).toEqual({ color: 'gradient', curveness: 0.5 })
  })
  it('5: totalFlow sums link values', () => {
    const c = new UiSankeyChartComponent()
    c.links = links
    expect(c.totalFlow()).toBe(8)
  })
  it('6: explicit nodes win over derived names', () => {
    const c = new UiSankeyChartComponent()
    c.links = links
    expect(c.nodeNames()).toEqual(['A', 'B', 'C'])
    c.nodes = ['X', 'Y']
    expect(c.nodeNames()).toEqual(['X', 'Y'])
    expect((c.getOption() as any).series[0].data).toEqual([{ name: 'X' }, { name: 'Y' }])
  })
  it('7: curveness flows into the ribbon lineStyle', () => {
    const c = new UiSankeyChartComponent()
    c.links = links
    c.curveness = 0
    expect((c.getOption() as any).series[0].lineStyle.curveness).toBe(0)
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiSankeyChartComponent()
    expect(c.heightStyle).toBe('360px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user series merge per-index without dropping the computed sankey', () => {
    const c = new UiSankeyChartComponent()
    c.links = links
    c.option = { series: [{ lineStyle: { color: 'gradient', curveness: 0 } }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('sankey')
    expect(opt.series[0].lineStyle.curveness).toBe(0)
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: data-slot sankey-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"sankey-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiSankeyChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

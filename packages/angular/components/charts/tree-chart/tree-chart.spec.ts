import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiTreeChartComponent } from './tree-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './tree-chart.component.ts'), 'utf8')

describe('TreeChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (orthogonal/LR height=380)', () => {
    const c = new UiTreeChartComponent()
    expect(c.layout).toBe('orthogonal')
    expect(c.orient).toBe('LR')
    expect(c.roam).toBe(false)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiTreeChartComponent().hostClass).toContain('w-full')
  })
  it('4: hierarchy wires through', () => {
    const c = new UiTreeChartComponent()
    c.data = { name: 'root', children: [{ name: 'leaf', value: 1 }] }
    const opt = c.getOption() as any
    expect(opt.series[0].data[0].name).toBe('root')
    expect(opt.series[0].data[0].children).toHaveLength(1)
  })
  it('5: key series type is tree', () => {
    const c = new UiTreeChartComponent()
    c.data = { name: 'root', children: [{ name: 'leaf', value: 1 }] }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('tree')
  })
  it('6: radial layout drops the orientation', () => {
    const c = new UiTreeChartComponent()
    c.data = { name: 'root', children: [{ name: 'leaf', value: 1 }] }
    c.layout = 'radial'
    const opt = c.getOption() as any
    expect(opt.series[0].layout).toBe('radial')
    expect(opt.series[0].orient).toBeUndefined()
    // React/Vue alias: orient="radial" also selects the radial layout.
    const d = new UiTreeChartComponent()
    d.data = { name: 'root' }
    d.orient = 'radial'
    const opt2 = d.getOption() as any
    expect(opt2.series[0].layout).toBe('radial')
    expect(opt2.series[0].orient).toBeUndefined()
  })
  it('7: hover focuses descendants', () => {
    const c = new UiTreeChartComponent()
    c.data = { name: 'root', children: [{ name: 'leaf', value: 1 }] }
    const opt = c.getOption() as any
    expect(opt.series[0].emphasis.focus).toBe('descendant')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiTreeChartComponent()
    c.data = { name: 'root', children: [{ name: 'leaf', value: 1 }] }
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('tree')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"tree-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiTreeChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiTreeChartComponent()
    expect(() => e.getOption()).not.toThrow()
    // No series until there is data: ECharts' tree series throws without a root node,
    // which crashed charts rendered before their data loaded.
    expect((e.getOption() as any).series).toEqual([])
  })
})

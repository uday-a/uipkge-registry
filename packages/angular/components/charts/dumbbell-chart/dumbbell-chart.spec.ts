import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiDumbbellChartComponent } from './dumbbell-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './dumbbell-chart.component.ts'), 'utf8')

describe('DumbbellChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (names=[Before, After] height=300)', () => {
    const c = new UiDumbbellChartComponent()
    expect(c.names).toEqual(['Before', 'After'])
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiDumbbellChartComponent().hostClass).toContain('w-full')
  })
  it('4: a/b pairs wire to custom data; labels land on an inverted category axis', () => {
    const c = new UiDumbbellChartComponent()
    c.data = [{ label: 'A', a: 20, b: 45 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([[20, 45]])
    expect(opt.yAxis.data).toEqual(['A'])
    expect(opt.yAxis.inverse).toBe(true)
    expect(opt.legend.data.map((d: any) => d.name)).toEqual(['Before', 'After'])
    expect(opt.tooltip.trigger).toBe('item')
  })
  it('5: key series type is custom', () => {
    const c = new UiDumbbellChartComponent()
    c.data = [{ label: 'A', a: 20, b: 45 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('custom')
  })
  it('6: renderItem joins endpoints with a connector', () => {
    const c = new UiDumbbellChartComponent()
    c.data = [{ label: 'A', a: 1, b: 2 }]
    const opt = c.getOption() as any
    expect(typeof opt.series[0].renderItem).toBe('function')
    const api = { coord: (p: number[]) => p, value: (i: number) => [1, 2][i]! }
    const node = opt.series[0].renderItem({ dataIndex: 0 }, api)
    expect(node.type).toBe('group')
    expect(node.children).toHaveLength(3)
  })
  it('7: endpoint names are configurable', () => {
    const c = new UiDumbbellChartComponent()
    c.names = ['Q1', 'Q2']
    expect(c.names).toEqual(['Q1', 'Q2'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiDumbbellChartComponent()
    c.data = [{ label: 'A', a: 20, b: 45 }]
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
    expect(componentSrc).toContain('"dumbbell-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiDumbbellChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiDumbbellChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

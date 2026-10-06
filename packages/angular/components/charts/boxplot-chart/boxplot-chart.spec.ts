import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBoxplotChartComponent } from './boxplot-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './boxplot-chart.component.ts'), 'utf8')

describe('BoxplotChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (horizontal=false height=320)', () => {
    const c = new UiBoxplotChartComponent()
    expect(c.horizontal).toBe(false)
    expect(c.height).toBe(320)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiBoxplotChartComponent().hostClass).toContain('w-full')
  })
  it('4: precomputed tuples pass through per category (React/Vue parity)', () => {
    const c = new UiBoxplotChartComponent()
    c.data = [{ category: 'A', values: [1, 2, 3, 4, 5] }]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0]).toEqual([1, 2, 3, 4, 5])
    expect(opt.xAxis.data).toEqual(['A'])
    expect(opt.series[0].itemStyle.borderColor).toBe(opt.color[1])
  })
  it('5: key series type is boxplot', () => {
    const c = new UiBoxplotChartComponent()
    c.data = [{ category: 'A', values: [1, 2, 3, 4, 5] }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('boxplot')
  })
  it('6: horizontal swaps the axes', () => {
    const c = new UiBoxplotChartComponent()
    c.data = [{ category: 'A', values: [1, 2, 3, 4, 5] }]
    c.horizontal = true
    const opt = c.getOption() as any
    expect(opt.xAxis.type).toBe('value')
    expect(opt.yAxis.data).toEqual(['A'])
  })
  it('7: bare w-full frame with no tabindex (React focusable=false / Vue parity)', () => {
    expect(componentSrc).not.toContain('[attr.tabindex]')
    expect(new UiBoxplotChartComponent().hostClass).not.toContain('focus-visible')
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiBoxplotChartComponent()
    c.data = [{ category: 'A', values: [1, 2, 3, 4, 5] }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('boxplot')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"boxplot-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiBoxplotChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiBoxplotChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiErrorBarChartComponent } from './error-bar-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './error-bar-chart.component.ts'), 'utf8')

describe('ErrorBarChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (height=300)', () => {
    const c = new UiErrorBarChartComponent()
    expect(c.height).toBe(300)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiErrorBarChartComponent().hostClass).toContain('w-full')
  })
  it('4: means wire to bars, intervals to whiskers', () => {
    const c = new UiErrorBarChartComponent()
    c.data = [{ category: 'A', value: 10, low: 8, high: 12 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toEqual([10])
    expect(opt.series[1].data).toEqual([[8, 12]])
  })
  it('5: key series type is bar; legend hidden like React/Vue', () => {
    const c = new UiErrorBarChartComponent()
    c.data = [{ category: 'A', value: 10, low: 8, high: 12 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
    expect(opt.legend).toEqual({ show: false })
    expect(opt.tooltip.axisPointer).toEqual({ type: 'shadow' })
    expect(opt.tooltip.formatter([{ dataIndex: 0 }])).toBe('A<br/>10 (CI 8–12)')
  })
  it('6: whisker renderItem draws stem + two caps', () => {
    const c = new UiErrorBarChartComponent()
    c.data = [{ category: 'A', value: 10, low: 8, high: 12 }]
    const opt = c.getOption() as any
    expect(opt.series[1].type).toBe('custom')
    const api = { coord: (p: number[]) => [p[0]! * 10, p[1]! * 10] }
    const node = opt.series[1].renderItem({ dataIndex: 0 }, api)
    expect(node.children).toHaveLength(3)
  })
  it('7: categories land on the category axis', () => {
    const c = new UiErrorBarChartComponent()
    c.data = [{ category: 'Q1', value: 1, low: 0, high: 2 }]
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['Q1'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiErrorBarChartComponent()
    c.data = [{ category: 'A', value: 10, low: 8, high: 12 }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('bar')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"error-bar-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiErrorBarChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiErrorBarChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

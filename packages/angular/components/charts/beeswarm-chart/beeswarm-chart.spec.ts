import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBeeswarmChartComponent } from './beeswarm-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './beeswarm-chart.component.ts'), 'utf8')

describe('BeeswarmChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (value/group fields height=300)', () => {
    const c = new UiBeeswarmChartComponent()
    expect(c.valueField).toBe('value')
    expect(c.groupField).toBe('group')
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiBeeswarmChartComponent().hostClass).toContain('w-full')
  })
  it('4: groups split into one series each with jittered rows', () => {
    const c = new UiBeeswarmChartComponent()
    c.data = [
      { value: 3, group: 'g1' },
      { value: 7, group: 'g1' },
      { value: 5, group: 'g2' },
    ]
    const opt = c.getOption() as any
    expect(opt.series).toHaveLength(2)
    expect(opt.series[0].data).toHaveLength(2)
    expect(opt.series[1].data).toHaveLength(1)
    expect(opt.series[0].data[0][0]).toBe(3)
    expect(opt.yAxis.type).toBe('value')
    expect(opt.yAxis.min).toBe(-0.6)
    expect(opt.yAxis.max).toBe(1.6)
    expect(opt.yAxis.axisLabel.formatter(1)).toBe('g2')
    expect(opt.xAxis.scale).toBe(true)
  })
  it('5: key series type is scatter', () => {
    const c = new UiBeeswarmChartComponent()
    c.data = [
      { value: 3, group: 'g1' },
      { value: 7, group: 'g1' },
      { value: 5, group: 'g2' },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('scatter')
  })
  it('6: jitter is deterministic per index', () => {
    const c = new UiBeeswarmChartComponent()
    expect(c.jitter(4, 1)).toBe(c.jitter(4, 1))
    expect(c.jitter(4, 1)).not.toBe(c.jitter(5, 1))
  })
  it('7: custom fields rewire grouping', () => {
    const c = new UiBeeswarmChartComponent()
    c.data = [
      { v: 1, k: 'a' },
      { v: 2, k: 'b' },
    ]
    c.valueField = 'v'
    c.groupField = 'k'
    const opt = c.getOption() as any
    expect(opt.series).toHaveLength(2)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiBeeswarmChartComponent()
    c.data = [
      { value: 3, group: 'g1' },
      { value: 7, group: 'g1' },
      { value: 5, group: 'g2' },
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
    expect(componentSrc).toContain('"beeswarm-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiBeeswarmChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiBeeswarmChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series).toEqual([])
  })
})

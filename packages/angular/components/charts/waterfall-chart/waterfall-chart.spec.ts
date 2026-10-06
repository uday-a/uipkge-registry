import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiWaterfallChartComponent } from './waterfall-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './waterfall-chart.component.ts'), 'utf8')

describe('WaterfallChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (showTotal=true height=320)', () => {
    const c = new UiWaterfallChartComponent()
    expect(c.showTotal).toBe(true)
    expect(c.height).toBe(320)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiWaterfallChartComponent().hostClass).toContain('w-full')
  })
  it('4: deltas accumulate with a computed total', () => {
    const c = new UiWaterfallChartComponent()
    c.data = [
      { label: 'Start', value: 100 },
      { label: 'Dip', value: -30 },
    ]
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['Start', 'Dip', 'Total'])
    expect(opt.series[1].data.map((d: any) => d.value)).toEqual([100, 30, 70])
  })
  it('5: key series type is bar', () => {
    const c = new UiWaterfallChartComponent()
    c.data = [
      { label: 'Start', value: 100 },
      { label: 'Dip', value: -30 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('bar')
  })
  it('6: negatives hang below the cursor', () => {
    const c = new UiWaterfallChartComponent()
    c.data = [
      { label: 'A', value: 100 },
      { label: 'B', value: -30 },
    ]
    const rows = c.rows()
    expect(rows[1]).toMatchObject({ base: 70, uplift: 30, total: false })
  })
  it('7: showTotal=false drops the total bar', () => {
    const c = new UiWaterfallChartComponent()
    c.data = [{ label: 'A', value: 5 }]
    c.showTotal = false
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['A'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiWaterfallChartComponent()
    c.data = [
      { label: 'Start', value: 100 },
      { label: 'Dip', value: -30 },
    ]
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
    expect(componentSrc).toContain('"waterfall-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiWaterfallChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiWaterfallChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[1].data).toEqual([])
  })
})

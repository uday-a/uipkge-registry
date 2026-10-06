import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiWaffleChartComponent } from './waffle-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './waffle-chart.component.ts'), 'utf8')

describe('WaffleChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=260)', () => {
    const c = new UiWaffleChartComponent()
    expect(c.height).toBe(260)
    expect(c.data).toEqual([])
    expect(c.size).toBe(10)
    expect(c.radius).toBe(2)
    expect(c.showLegend).toBe(true)
    expect(c.colors).toBeUndefined()
  })
  it('3: host class contains base w-full', () => {
    expect(new UiWaffleChartComponent().hostClass).toContain('w-full')
  })
  it('4: cells split 30/70 across the 100 grid', () => {
    const c = new UiWaffleChartComponent()
    c.data = [
      { name: 'A', value: 30 },
      { name: 'B', value: 70 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toHaveLength(100)
    const counts = [0, 0]
    for (const [, , item] of opt.series[0].data as [number, number, number][]) counts[item]!++
    expect(counts).toEqual([30, 70])
  })
  it('5: key series type is heatmap', () => {
    const c = new UiWaffleChartComponent()
    c.data = [
      { name: 'A', value: 30 },
      { name: 'B', value: 70 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('heatmap')
  })
  it('6: cell colors resolve per item', () => {
    const c = new UiWaffleChartComponent()
    c.data = [
      { name: 'A', value: 50, color: '#abcdef' },
      { name: 'B', value: 50 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].itemStyle.color({ data: [0, 0, 0] })).toBe('#abcdef')
    expect(opt.series[0].itemStyle.color({ data: [0, 0, 1] })).toBeTruthy()
  })
  it('7: rounding always fills exactly 100 cells', () => {
    const c = new UiWaffleChartComponent()
    c.data = [
      { name: 'A', value: 1 },
      { name: 'B', value: 1 },
      { name: 'C', value: 1 },
    ]
    expect(c.cells()).toHaveLength(100)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiWaffleChartComponent()
    c.data = [
      { name: 'A', value: 30 },
      { name: 'B', value: 70 },
    ]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('heatmap')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"waffle-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiWaffleChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiWaffleChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })

  it('11: size=5 yields a 25-cell grid with radius + palette override applied', () => {
    const c = new UiWaffleChartComponent()
    c.size = 5
    c.radius = 4
    c.colors = ['#111111', '#222222']
    c.data = [
      { name: 'A', value: 12 },
      { name: 'B', value: 13 },
    ]
    expect(c.cells()).toHaveLength(25)
    const opt = c.getOption() as any
    expect(opt.series[0].itemStyle.borderRadius).toBe(4)
    expect(opt.series[0].itemStyle.color({ data: [0, 0, 1] })).toBe('#222222')
    expect(opt.color).toEqual(['#111111', '#222222'])
  })
  it('12: legend template + generated aria-label mirror React', () => {
    expect(componentSrc).toContain('showLegend')
    const c = new UiWaffleChartComponent()
    c.data = [
      { name: 'Yes', value: 72 },
      { name: 'No', value: 28 },
    ]
    expect(c.effectiveAriaLabel).toBe('Waffle chart: Yes 72%, No 28%')
    c.ariaLabel = 'Custom'
    expect(c.effectiveAriaLabel).toBe('Custom')
    expect(c.pct(72)).toBe(72)
  })
  it('ships a hidden visualMap on the heatmap series, keeping cell colours', () => {
    // Outside production builds ECharts throws "Heatmap must use with visualMap", so every
    // `ng serve` of a page with a waffle chart crashed.
    const vm = (new UiWaffleChartComponent().getOption() as any).visualMap
    expect(vm).toMatchObject({ show: false, seriesIndex: 0 })
    expect(vm.inRange).toEqual({ opacity: 1 })
  })
})

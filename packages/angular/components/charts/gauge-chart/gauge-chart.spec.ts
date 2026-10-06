import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiGaugeChartComponent } from './gauge-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './gauge-chart.component.ts'), 'utf8')

describe('GaugeChart (angular parity, 11 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (0/0-100, Score, progress, unit, thresholds, 220)', () => {
    const c = new UiGaugeChartComponent()
    expect(c.value).toBe(0)
    expect(c.min).toBe(0)
    expect(c.max).toBe(100)
    expect(c.name).toBe('Score')
    expect(c.progress).toBe(true)
    expect(c.unit).toBe('')
    expect(c.label).toBeUndefined()
    expect(c.thresholds).toEqual([
      [0.6, '#14b8a6'],
      [0.85, '#f59e0b'],
      [1, '#dc2626'],
    ])
    expect(c.height).toBe(220)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiGaugeChartComponent().hostClass).toContain('w-full')
  })
  it('4: option carries value + scale into gauge series', () => {
    const c = new UiGaugeChartComponent()
    c.value = 72
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('gauge')
    expect(opt.series[0].data).toEqual([{ value: 72, name: 'Score' }])
  })
  it('5: ratio normalizes 0..1', () => {
    const c = new UiGaugeChartComponent()
    c.value = 25
    expect(c.ratio()).toBe(0.25)
    c.value = 200
    expect(c.ratio()).toBe(1)
    c.value = -5
    expect(c.ratio()).toBe(0)
  })
  it('6: progress=false hides the arc', () => {
    const c = new UiGaugeChartComponent()
    c.progress = false
    expect((c.getOption() as any).series[0].progress.show).toBe(false)
  })
  it('7: custom scale flows into series', () => {
    const c = new UiGaugeChartComponent()
    c.min = 50
    c.max = 150
    const s = (c.getOption() as any).series[0]
    expect(s.min).toBe(50)
    expect(s.max).toBe(150)
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiGaugeChartComponent()
    expect(c.heightStyle).toBe('220px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiGaugeChartComponent()
    c.option = { backgroundColor: 'transparent' } as any
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('gauge')
    expect(opt.backgroundColor).toBe('transparent')
  })
  it('10: unit/label/thresholds flow into the gauge series', () => {
    const c = new UiGaugeChartComponent()
    c.value = 72
    c.unit = '%'
    c.label = 'Coverage'
    c.thresholds = [[1, '#000000']]
    const s = (c.getOption() as any).series[0]
    expect(s.data).toEqual([{ value: 72, name: 'Coverage' }])
    expect(s.detail.formatter).toBe('{value} %')
    expect(s.axisLine.lineStyle.color).toEqual([[1, '#000000']])
    const d = new UiGaugeChartComponent()
    expect((d.getOption() as any).series[0].data[0].name).toBe('Score')
    expect((d.getOption() as any).series[0].detail.formatter).toBe('{value}')
  })
  it('11: data-slot gauge-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"gauge-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiGaugeChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

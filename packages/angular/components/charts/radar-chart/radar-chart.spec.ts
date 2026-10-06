import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiRadarChartComponent } from './radar-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './radar-chart.component.ts'), 'utf8')

describe('RadarChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (empty data, fill 0.15, height 300)', () => {
    const c = new UiRadarChartComponent()
    expect(c.data).toEqual([])
    expect(c.indicators).toEqual([])
    expect(c.fillOpacity).toBe(0.15)
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiRadarChartComponent().hostClass).toContain('w-full')
  })
  it('4: indicators flow into radar coordinate', () => {
    const c = new UiRadarChartComponent()
    c.indicators = [
      { name: 'Speed', max: 100 },
      { name: 'Power', max: 100 },
    ]
    expect((c.getOption() as any).radar.indicator.length).toBe(2)
  })
  it('5: series carry named value arrays', () => {
    const c = new UiRadarChartComponent()
    c.data = [{ name: 'A', value: [80, 60] }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('radar')
    expect(opt.series[0].data).toEqual([{ name: 'A', value: [80, 60] }])
  })
  it('6: fill opacity flows into area style', () => {
    const c = new UiRadarChartComponent()
    c.fillOpacity = 0.4
    expect((c.getOption() as any).series[0].areaStyle.opacity).toBe(0.4)
  })
  it('7: seriesData maps names + values', () => {
    const c = new UiRadarChartComponent()
    c.data = [{ name: 'A', value: [1, 2] }]
    expect(c.seriesData()).toEqual([{ name: 'A', value: [1, 2] }])
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiRadarChartComponent()
    expect(c.heightStyle).toBe('300px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiRadarChartComponent()
    c.data = [{ name: 'A', value: [80, 60] }]
    c.option = { title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('radar')
    expect(opt.title).toEqual({ text: 'Hi' })
    // Per-index merge (React/Vue): a partial series override keeps computed type + data.
    c.option = { series: [{ symbolSize: 9 }] }
    const merged = c.getOption() as any
    expect(merged.series[0].type).toBe('radar')
    expect(merged.series[0].symbolSize).toBe(9)
    expect(merged.series[0].data).toEqual([{ name: 'A', value: [80, 60] }])
  })
  it('10: data-slot radar-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"radar-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiRadarChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

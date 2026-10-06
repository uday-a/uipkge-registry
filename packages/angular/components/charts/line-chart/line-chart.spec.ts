import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiLineChartComponent } from './line-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './line-chart.component.ts'), 'utf8')

describe('LineChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (x/y fields, smooth, markers, height 300)', () => {
    const c = new UiLineChartComponent()
    expect(c.xField).toBe('x')
    expect(c.yField).toBe('y')
    expect(c.curve).toBe('smooth')
    expect(c.markers).toBe(true)
    expect(c.dashed).toBe(false)
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiLineChartComponent().hostClass).toContain('w-full')
  })
  it('4: option maps x categories + y values', () => {
    const c = new UiLineChartComponent()
    c.data = [
      { x: 'Jan', y: 10 },
      { x: 'Feb', y: 20 },
    ]
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['Jan', 'Feb'])
    expect(opt.series[0].data).toEqual([10, 20])
    expect(opt.series[0].type).toBe('line')
  })
  it('5: smooth curve by default, linear disables smoothing', () => {
    const c = new UiLineChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    expect((c.getOption() as any).series[0].smooth).toBe(true)
    c.curve = 'linear'
    expect((c.getOption() as any).series[0].smooth).toBe(false)
  })
  it('6: markers=false hides point symbols', () => {
    const c = new UiLineChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.markers = false
    expect((c.getOption() as any).series[0].symbol).toBe('none')
  })
  it('7: dashed=true switches the stroke to dashed', () => {
    const c = new UiLineChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.dashed = true
    expect((c.getOption() as any).series[0].lineStyle.type).toBe('dashed')
  })
  it('8: stacked=true stacks series cumulatively', () => {
    const c = new UiLineChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.stacked = true
    expect((c.getOption() as any).series[0].stack).toBe('lines')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiLineChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.option = { series: [{ lineStyle: { width: 5 } }], title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('line')
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: data-slot line-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"line-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiLineChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

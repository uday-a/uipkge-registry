import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiAreaChartComponent } from './area-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './area-chart.component.ts'), 'utf8')

describe('AreaChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (x/y fields, smooth curve, no markers, no dash, height 300)', () => {
    const c = new UiAreaChartComponent()
    expect(c.xField).toBe('x')
    expect(c.yField).toBe('y')
    expect(c.curve).toBe('smooth')
    expect(c.markers).toBe(false)
    expect(c.stacked).toBe(false)
    expect(c.dashed).toBe(false)
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiAreaChartComponent().hostClass).toContain('w-full')
  })
  it('4: option maps x categories + y values with area fill', () => {
    const c = new UiAreaChartComponent()
    c.data = [
      { x: 'Jan', y: 10 },
      { x: 'Feb', y: 20 },
    ]
    const opt = c.getOption() as any
    expect(opt.xAxis.data).toEqual(['Jan', 'Feb'])
    expect(opt.series[0].data).toEqual([10, 20])
    expect(opt.series[0].type).toBe('line')
    expect(opt.series[0].areaStyle.opacity).toBe(0.15)
  })
  it('5: curve maps to smooth/step, dashed maps to line type', () => {
    const c = new UiAreaChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    expect((c.getOption() as any).series[0].smooth).toBe(true)
    c.curve = 'linear'
    expect((c.getOption() as any).series[0].smooth).toBe(false)
    expect((c.getOption() as any).series[0].step).toBe(false)
    c.curve = 'stepEnd'
    expect((c.getOption() as any).series[0].step).toBe('end')
    expect((c.getOption() as any).series[0].lineStyle.type).toBe('solid')
    c.dashed = true
    expect((c.getOption() as any).series[0].lineStyle.type).toBe('dashed')
  })
  it('6: stacked=true stacks series cumulatively', () => {
    const c = new UiAreaChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.stacked = true
    expect((c.getOption() as any).series[0].stack).toBe('areas')
  })
  it('7: multi-field yField fans out series', () => {
    const c = new UiAreaChartComponent()
    c.data = [{ x: 'a', y: 1, z: 2 }]
    c.yField = ['y', 'z']
    expect((c.getOption() as any).series.length).toBe(2)
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiAreaChartComponent()
    expect(c.heightStyle).toBe('300px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiAreaChartComponent()
    c.data = [{ x: 'a', y: 1 }]
    c.option = { title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('line')
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: data-slot area-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"area-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiAreaChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

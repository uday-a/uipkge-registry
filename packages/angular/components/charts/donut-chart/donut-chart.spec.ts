import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiDonutChartComponent } from './donut-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './donut-chart.component.ts'), 'utf8')

describe('DonutChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (full, 0.32, 6, 2, total shown, 300)', () => {
    const c = new UiDonutChartComponent()
    expect(c.type).toBe('full')
    expect(c.thickness).toBe(0.32)
    expect(c.rounded).toBe(6)
    expect(c.gap).toBe(2)
    expect(c.showTotal).toBe(true)
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiDonutChartComponent().hostClass).toContain('w-full')
  })
  it('4: option renders pie series with thickness-derived ring radius', () => {
    const c = new UiDonutChartComponent()
    c.data = [{ name: 'A', value: 40 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('pie')
    expect(opt.series[0].radius).toEqual(['53%', '78%'])
    expect(opt.series[0].padAngle).toBe(2)
    expect(opt.series[0].itemStyle.borderRadius).toBe(6)
  })
  it('5: center title shows the total, or centerLabel when set', () => {
    const c = new UiDonutChartComponent()
    c.data = [
      { name: 'A', value: 40 },
      { name: 'B', value: 60 },
    ]
    expect((c.getOption() as any).title.text).toBe('100')
    c.centerLabel = '68%'
    expect((c.getOption() as any).title.text).toBe('68%')
  })
  it('6: showTotal=false drops the center title', () => {
    const c = new UiDonutChartComponent()
    c.data = [{ name: 'A', value: 1 }]
    c.showTotal = false
    expect((c.getOption() as any).title).toBeUndefined()
  })
  it('7: thickness 0 fills the pie; half type renders a semicircle gauge', () => {
    const c = new UiDonutChartComponent()
    c.thickness = 0
    expect((c.getOption() as any).series[0].radius).toEqual(['78%', '78%'])
    c.thickness = 0.32
    c.type = 'half'
    const opt = c.getOption() as any
    expect(opt.series[0].center).toEqual(['50%', '68%'])
    expect(opt.series[0].startAngle).toBe(180)
    expect(opt.series[0].endAngle).toBe(360)
    expect(opt.title.top).toBe('62%')
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiDonutChartComponent()
    expect(c.heightStyle).toBe('300px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiDonutChartComponent()
    c.data = [{ name: 'A', value: 1 }]
    c.option = { backgroundColor: 'transparent' } as any
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('pie')
    expect(opt.backgroundColor).toBe('transparent')
  })
  it('10: data-slot donut-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"donut-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiDonutChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

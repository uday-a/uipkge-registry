import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiPieChartComponent } from './pie-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './pie-chart.component.ts'), 'utf8')

describe('PieChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (name/value fields, solid pie, 300)', () => {
    const c = new UiPieChartComponent()
    expect(c.nameField).toBe('name')
    expect(c.valueField).toBe('value')
    expect(c.donut).toBe(false)
    expect(c.height).toBe(300)
    expect((c.getOption() as any).series[0].radius).toBe('65%')
  })
  it('3: host class contains base w-full', () => {
    expect(new UiPieChartComponent().hostClass).toContain('w-full')
  })
  it('4: option maps names + values to pie series', () => {
    const c = new UiPieChartComponent()
    c.data = [
      { name: 'A', value: 30 },
      { name: 'B', value: 70 },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('pie')
    expect(opt.series[0].data).toEqual([
      { name: 'A', value: 30 },
      { name: 'B', value: 70 },
    ])
  })
  it('5: total sums slice values', () => {
    const c = new UiPieChartComponent()
    c.data = [
      { name: 'A', value: 30 },
      { name: 'B', value: 70 },
    ]
    expect(c.total()).toBe(100)
  })
  it('6: donut hollows the center; labels stay hidden like React', () => {
    const c = new UiPieChartComponent()
    c.data = [{ name: 'A', value: 1 }]
    c.donut = true
    const s = (c.getOption() as any).series[0]
    expect(s.radius).toEqual(['45%', '70%'])
    expect(s.label.show).toBe(false)
  })
  it('7: tooltip triggers on item', () => {
    const c = new UiPieChartComponent()
    expect((c.getOption() as any).tooltip.trigger).toBe('item')
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiPieChartComponent()
    expect(c.heightStyle).toBe('300px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiPieChartComponent()
    c.data = [{ name: 'A', value: 1 }]
    c.option = { title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('pie')
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: data-slot pie-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"pie-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiPieChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

describe('PieChart option.series override', () => {
  // Blocks pass partial series tweaks ({ radius, label }) the way React's PieChart merges them.
  // Replacing the whole series dropped the data, so the chart rendered empty.
  it('merges a partial series override into the computed series, keeping the data', () => {
    const c = new UiPieChartComponent()
    c.data = [
      { name: 'A', value: 3 },
      { name: 'B', value: 1 },
    ]
    c.option = { series: [{ radius: ['50%', '70%'] }] }
    const s = (c.getOption() as any).series
    expect(s).toHaveLength(1)
    expect(s[0].radius).toEqual(['50%', '70%'])
    expect(s[0].type).toBe('pie')
    expect(s[0].data).toEqual([
      { name: 'A', value: 3 },
      { name: 'B', value: 1 },
    ])
  })
})

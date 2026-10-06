import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiFunnelChartComponent } from './funnel-chart.component'
import { getChartBgColor } from '../use-chart-theme'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './funnel-chart.component.ts'), 'utf8')

describe('FunnelChart (angular parity, 11 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (descending, vertical, gap 2, 300)', () => {
    const c = new UiFunnelChartComponent()
    expect(c.sort).toBe('descending')
    expect(c.orient).toBe('vertical')
    expect(c.gap).toBe(2)
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiFunnelChartComponent().hostClass).toContain('w-full')
  })
  it('4: stages sort descending by default', () => {
    const c = new UiFunnelChartComponent()
    c.data = [
      { name: 'B', value: 30 },
      { name: 'A', value: 100 },
    ]
    expect(c.sorted().map((d) => d.name)).toEqual(['A', 'B'])
    expect((c.getOption() as any).series[0].type).toBe('funnel')
  })
  it('5: ascending + none orders respected', () => {
    const c = new UiFunnelChartComponent()
    c.data = [
      { name: 'B', value: 30 },
      { name: 'A', value: 100 },
    ]
    c.sort = 'ascending'
    expect(c.sorted()[0]!.name).toBe('B')
    c.sort = 'none'
    expect(c.sorted()[0]!.name).toBe('B')
  })
  it('6: horizontal orientation flows into series', () => {
    const c = new UiFunnelChartComponent()
    c.orient = 'horizontal'
    expect((c.getOption() as any).series[0].orient).toBe('horizontal')
  })
  it('7: gap flows into series', () => {
    const c = new UiFunnelChartComponent()
    c.gap = 6
    // +6 absorbs the outer half of the 6px corner-softening stroke
    expect((c.getOption() as any).series[0].gap).toBe(12)
  })
  it('7b: each stage strokes in its own fill colour with round joins (soft corners)', () => {
    const c = new UiFunnelChartComponent()
    c.data = [
      { name: 'A', value: 100 },
      { name: 'B', value: 30, itemStyle: { color: '#123456', opacity: 0.5 } },
    ]
    const s = (c.getOption() as any).series[0]
    const colors = (c.getOption() as any).color
    expect(s.itemStyle).toEqual({ borderWidth: 6, borderJoin: 'round' })
    expect(s.data[0].itemStyle.borderColor).toBe(colors[0])
    expect(s.data[1].itemStyle).toEqual({ color: '#123456', opacity: 0.5, borderColor: '#123456' })
  })
  it('7c: inside label shows name + value · share of top stage in the card-surface ink', () => {
    const c = new UiFunnelChartComponent()
    c.data = [
      { name: 'Visits', value: 24850 },
      { name: 'Signups', value: 1790 },
    ]
    const label = (c.getOption() as any).series[0].label
    expect(label.position).toBe('inside')
    expect(label.color).toBe(getChartBgColor())
    expect(label.formatter({ name: 'Visits', value: 24850 })).toBe('{t|Visits}\n{v|24,850 · 100%}')
    expect(label.formatter({ name: 'Signups', value: 1790 })).toBe('{t|Signups}\n{v|1,790 · 7.2%}')
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiFunnelChartComponent()
    expect(c.heightStyle).toBe('300px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiFunnelChartComponent()
    c.data = [{ name: 'A', value: 1 }]
    c.option = { title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('funnel')
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: showLabels/showLegend mirror React+Vue (true/false)', () => {
    const c = new UiFunnelChartComponent()
    expect(c.showLabels).toBe(true)
    expect(c.showLegend).toBe(false)
    expect((c.getOption() as any).series[0].label.show).toBe(true)
    expect((c.getOption() as any).legend).toBeUndefined()
    c.showLabels = false
    c.showLegend = true
    expect((c.getOption() as any).series[0].label.show).toBe(false)
    expect((c.getOption() as any).legend.bottom).toBe(0)
    expect((c.getOption() as any).series[0].bottom).toBe(32)
  })
  it('11: data-slot funnel-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"funnel-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiFunnelChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

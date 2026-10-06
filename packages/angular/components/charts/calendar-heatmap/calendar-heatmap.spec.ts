import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiCalendarHeatmapComponent } from './calendar-heatmap.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './calendar-heatmap.component.ts'), 'utf8')

describe('CalendarHeatmap (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=200)', () => {
    const c = new UiCalendarHeatmapComponent()
    expect(c.height).toBe(200)
    expect(c.data).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiCalendarHeatmapComponent().hostClass).toContain('w-full')
  })
  it('4: tuples wire through with visual max', () => {
    const c = new UiCalendarHeatmapComponent()
    c.data = [
      ['2024-01-01', 5],
      ['2024-01-02', 10],
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].data).toHaveLength(2)
    expect(opt.visualMap.max).toBe(10)
  })
  it('5: key series type is heatmap', () => {
    const c = new UiCalendarHeatmapComponent()
    c.data = [
      ['2024-01-01', 5],
      ['2024-01-02', 10],
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('heatmap')
  })
  it('6: range wins; year alias and first datum are fallbacks', () => {
    const c = new UiCalendarHeatmapComponent()
    c.data = [['2024-05-01', 1]]
    expect((c.getOption() as any).calendar.range).toBe('2024')
    c.year = '2023'
    expect((c.getOption() as any).calendar.range).toBe('2023')
    c.range = '2022'
    expect((c.getOption() as any).calendar.range).toBe('2022')
    c.range = ['2024-03-01', '2024-05-15']
    expect((c.getOption() as any).calendar.range).toEqual(['2024-03-01', '2024-05-15'])
  })
  it('7: default ramp runs chart-1 to chart-4', () => {
    const c = new UiCalendarHeatmapComponent()
    c.data = [['2024-01-01', 1]]
    const opt = c.getOption() as any
    expect(opt.visualMap.inRange.color).toHaveLength(2)
    c.colorRange = ['#000000', '#ffffff']
    expect((c.getOption() as any).visualMap.inRange.color).toEqual(['#000000', '#ffffff'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiCalendarHeatmapComponent()
    c.data = [
      ['2024-01-01', 5],
      ['2024-01-02', 10],
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
    expect(componentSrc).toContain('"calendar-heatmap"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiCalendarHeatmapComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiCalendarHeatmapComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

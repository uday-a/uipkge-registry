import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiGanttChartComponent } from './gantt-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './gantt-chart.component.ts'), 'utf8')

describe('GanttChart (angular parity, 12 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=320)', () => {
    const c = new UiGanttChartComponent()
    expect(c.height).toBe(320)
    expect(c.tasks).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiGanttChartComponent().hostClass).toContain('w-full')
  })
  it('4: tasks map to epoch ranges on a time axis', () => {
    const c = new UiGanttChartComponent()
    c.tasks = [{ label: 'Design', start: '2024-01-01', end: '2024-01-10', progress: 0.5 }]
    const opt = c.getOption() as any
    expect(opt.series[0].data[0][0]).toBe(+new Date('2024-01-01'))
    expect(opt.series[0].data[0][1]).toBe(+new Date('2024-01-10'))
    expect(opt.xAxis.type).toBe('time')
  })
  it('5: key series type is custom', () => {
    const c = new UiGanttChartComponent()
    c.tasks = [{ label: 'Design', start: '2024-01-01', end: '2024-01-10', progress: 0.5 }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('custom')
  })
  it('6: progress shades the filled portion', () => {
    const c = new UiGanttChartComponent()
    c.tasks = [{ label: 'T', start: 0, end: 100, progress: 0.5 }]
    const opt = c.getOption() as any
    const api = { coord: (p: number[]) => [p[0], p[1]! * 20], value: (i: number) => [0, 100][i]!, size: () => [0, 20] }
    const node = opt.series[0].renderItem({ dataIndex: 0 }, api)
    const [track, fill] = node.children
    expect(fill.shape.width).toBeCloseTo(track.shape.width * 0.5, 8)
  })
  it('7: groups rotate the palette', () => {
    const c = new UiGanttChartComponent()
    c.tasks = [
      { label: 'A', start: 0, end: 1, group: 'g1' },
      { label: 'B', start: 0, end: 1, group: 'g2' },
    ]
    const opt = c.getOption() as any
    expect(opt.yAxis.data).toEqual(['A', 'B'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiGanttChartComponent()
    c.tasks = [{ label: 'Design', start: '2024-01-01', end: '2024-01-10', progress: 0.5 }]
    c.option = { series: [{ name: 'override' }], title: { text: 'Hi' } } as any
    const opt = c.getOption() as any
    expect(opt.title).toEqual({ text: 'Hi' })
    const types = (Array.isArray(opt.series) ? opt.series : [opt.series]).map((x: any) => x?.type)
    expect(types).toContain('custom')
  })
  it('9: type-only echarts import + lazy init + data-slot contract', () => {
    const runtimeEcharts = componentSrc
      .split('\n')
      .filter((l) => l.includes("from 'echarts") && !l.trim().startsWith('import type'))
    expect(runtimeEcharts).toEqual([])
    expect(componentSrc).toContain('import(')
    expect(componentSrc).toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"gantt-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiGanttChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiGanttChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
  it('11: milestones pin diamonds to tasks like React/Vue', () => {
    const c = new UiGanttChartComponent()
    c.tasks = [
      { label: 'Design', start: '2024-01-01', end: '2024-01-10' },
      { label: 'Build', start: '2024-01-11', end: '2024-01-20' },
    ]
    expect((c.getOption() as any).series[0].markPoint).toBeUndefined()
    c.milestones = [{ task: 'Build', date: '2024-01-15', label: 'Beta' }]
    const opt = c.getOption() as any
    expect(opt.series[0].markPoint.symbol).toBe('diamond')
    expect(opt.series[0].markPoint.data).toEqual([{ name: 'Beta', coord: ['2024-01-15', 1] }])
    expect(componentSrc).toContain('MarkPointComponent')
  })
  it('12: today draws a dashed markLine + tooltip names the task', () => {
    const c = new UiGanttChartComponent()
    c.tasks = [{ label: 'Design', start: '2024-01-01', end: '2024-01-10' }]
    expect((c.getOption() as any).series[0].markLine).toBeUndefined()
    c.today = '2024-01-05'
    const opt = c.getOption() as any
    expect(opt.series[0].markLine.data).toEqual([{ xAxis: '2024-01-05' }])
    expect(opt.series[0].markLine.lineStyle.type).toBe('dashed')
    expect(componentSrc).toContain('MarkLineComponent')
    expect(opt.tooltip.formatter({ dataIndex: 0 })).toContain('Design')
  })
})

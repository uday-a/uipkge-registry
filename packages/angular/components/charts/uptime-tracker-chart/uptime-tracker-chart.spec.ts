import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiUptimeTrackerChartComponent } from './uptime-tracker-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './uptime-tracker-chart.component.ts'), 'utf8')

const days = [
  { date: 'a', status: 'up' },
  { date: 'b', status: 'down' },
  { date: 'c', status: 'degraded' },
  { date: 'd', status: 'up' },
] as { date: string; status: 'up' | 'degraded' | 'down' | 'unknown' }[]

describe('UptimeTrackerChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (height 48, gap 2, rounded 2, legend on)', () => {
    const c = new UiUptimeTrackerChartComponent()
    expect(c.height).toBe(48)
    expect(c.gap).toBe(2)
    expect(c.rounded).toBe(2)
    expect(c.showLegend).toBe(true)
    expect(c.days).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiUptimeTrackerChartComponent().hostClass).toContain('w-full')
  })
  it('4: uptime counts only fully-up days', () => {
    const c = new UiUptimeTrackerChartComponent()
    c.days = days
    expect(c.uptime).toBe('50.0%')
  })
  it('5: uptime is an em dash with no data', () => {
    expect(new UiUptimeTrackerChartComponent().uptime).toBe('—')
  })
  it('6: summary counts each status', () => {
    const c = new UiUptimeTrackerChartComponent()
    c.days = days
    expect(c.summary).toBe('2 up, 1 degraded, 1 down days')
  })
  it('7: aria-label defaults to the summary, override wins', () => {
    const c = new UiUptimeTrackerChartComponent()
    c.days = days
    expect(c.resolvedAriaLabel).toBe('Uptime tracker: 2 up, 1 degraded, 1 down days')
    c.ariaLabel = 'Custom'
    expect(c.resolvedAriaLabel).toBe('Custom')
  })
  it('8: statuses map to distinct token colors incl. unknown', () => {
    const c = new UiUptimeTrackerChartComponent()
    expect(c.barColor('up')).toBe('var(--chart-2)')
    expect(c.barColor('degraded')).toBe('var(--chart-4)')
    expect(c.barColor('down')).toBe('var(--destructive)')
    expect(c.barColor('unknown')).toBe('var(--border)')
    expect(c.barTitle({ date: '2026-01-01', status: 'down' })).toBe('2026-01-01 — down')
  })
  it('9: dependency-free markup — no echarts import + data-slot contract', () => {
    expect(componentSrc).not.toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"uptime-tracker-chart"')
    expect(componentSrc).toContain('role')
  })
  it('10: heightStyle normalizes numbers + custom class merges', () => {
    const c = new UiUptimeTrackerChartComponent()
    expect(c.heightStyle).toBe('48px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

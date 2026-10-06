import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiCategoryDistributionChartComponent } from './category-distribution-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './category-distribution-chart.component.ts'), 'utf8')

describe('CategoryDistributionChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (height=220, showLegend, palette)', () => {
    const c = new UiCategoryDistributionChartComponent()
    expect(c.height).toBe(220)
    expect(c.categories).toEqual([])
    expect(c.showLegend).toBe(true)
    expect(c.colors).toContain('var(--chart-1)')
  })
  it('3: host class contains base flex-col justify-center', () => {
    const hostClass = new UiCategoryDistributionChartComponent().hostClass
    expect(hostClass).toContain('flex-col')
    expect(hostClass).toContain('justify-center')
  })
  it('4: shares auto-normalise to 100', () => {
    const c = new UiCategoryDistributionChartComponent()
    c.categories = [
      { label: 'A', percentage: 1 },
      { label: 'B', percentage: 3 },
    ]
    const slices = c.slices
    expect(slices[0]!.share).toBe(25)
    expect(slices[1]!.share).toBe(75)
  })
  it('5: explicit slice color wins over the palette', () => {
    const c = new UiCategoryDistributionChartComponent()
    c.categories = [{ label: 'A', percentage: 100, color: '#123456' }]
    expect(c.slices[0]!.color).toBe('#123456')
  })
  it('6: palette color falls back by index', () => {
    const c = new UiCategoryDistributionChartComponent()
    c.categories = [{ label: 'A', percentage: 100 }]
    expect(c.slices[0]!.color).toBe('var(--chart-1)')
  })
  it('7: display value prefers value, else rounded share', () => {
    const c = new UiCategoryDistributionChartComponent()
    c.categories = [
      { label: 'A', percentage: 40, value: 4000 },
      { label: 'B', percentage: 60 },
    ]
    expect(c.slices[0]!.displayValue).toBe(4000)
    expect(c.slices[1]!.displayValue).toBe('60%')
  })
  it('8: trend color and sign follow direction', () => {
    const c = new UiCategoryDistributionChartComponent()
    c.trend = { value: '8.2%', direction: 'up' }
    expect(c.trendColor).toBe('var(--chart-2)')
    expect(c.trendSign).toBe('+')
    c.trend = { value: '3.1%', direction: 'down' }
    expect(c.trendColor).toBe('var(--destructive)')
    expect(c.trendSign).toBe('−')
  })
  it('9: dependency-free markup + data-slot contract', () => {
    expect(componentSrc).not.toContain('echarts')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"category-distribution-chart"')
    expect(componentSrc).toContain('role="presentation"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiCategoryDistributionChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiCategoryDistributionChartComponent()
    expect(e.slices).toEqual([])
  })
})

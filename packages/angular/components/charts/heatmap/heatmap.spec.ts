import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiHeatmapComponent } from './heatmap.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './heatmap.component.ts'), 'utf8')
const tuples: [number, number, number][] = [
  [0, 0, 5],
  [1, 1, 9],
]
const objects = [
  { x: 'Mon', y: 'AM', value: 5 },
  { x: 'Tue', y: 'PM', value: 9 },
]

describe('Heatmap (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (auto categories, height 300)', () => {
    const c = new UiHeatmapComponent()
    expect(c.xLabels).toEqual([])
    expect(c.yLabels).toEqual([])
    expect(c.xCategories).toEqual([])
    expect(c.yCategories).toEqual([])
    expect(c.height).toBe(300)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiHeatmapComponent().hostClass).toContain('w-full')
  })
  it('4: categories derive from object-form data', () => {
    const c = new UiHeatmapComponent()
    c.data = objects
    expect(c.resolvedX()).toEqual(['Mon', 'Tue'])
    expect(c.resolvedY()).toEqual(['AM', 'PM'])
  })
  it('5: option maps tuples to heatmap series', () => {
    const c = new UiHeatmapComponent()
    c.data = tuples
    c.xLabels = ['Mon', 'Tue']
    c.yLabels = ['AM', 'PM']
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('heatmap')
    expect(opt.series[0].data).toEqual([
      [0, 0, 5],
      [1, 1, 9],
    ])
  })
  it('6: visual map spans data extent', () => {
    const c = new UiHeatmapComponent()
    c.data = tuples
    expect(c.extent()).toEqual([5, 9])
    expect((c.getOption() as any).visualMap.min).toBe(5)
    expect((c.getOption() as any).visualMap.max).toBe(9)
  })
  it('7: explicit min/max override extent', () => {
    const c = new UiHeatmapComponent()
    c.data = tuples
    c.min = 0
    c.max = 10
    expect(c.extent()).toEqual([0, 10])
  })
  it('8: explicit labels pin axis order; deprecated categories alias still works', () => {
    const c = new UiHeatmapComponent()
    c.data = objects
    c.xLabels = ['Tue', 'Mon']
    expect((c.getOption() as any).xAxis.data).toEqual(['Tue', 'Mon'])
    const legacy = new UiHeatmapComponent()
    legacy.data = objects
    legacy.xCategories = ['Tue', 'Mon']
    expect((legacy.getOption() as any).xAxis.data).toEqual(['Tue', 'Mon'])
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiHeatmapComponent()
    c.data = tuples
    c.option = { title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('heatmap')
    expect(opt.title).toEqual({ text: 'Hi' })
  })
  it('10: data-slot heatmap contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"heatmap"')
    expect(componentSrc).toContain('echarts')
    const c = new UiHeatmapComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

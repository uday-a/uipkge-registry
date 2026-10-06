import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiTreemapChartComponent } from './treemap-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './treemap-chart.component.ts'), 'utf8')

describe('TreemapChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (no breadcrumb, radius 4, height 320)', () => {
    const c = new UiTreemapChartComponent()
    expect(c.showBreadcrumb).toBe(false)
    expect(c.radius).toBe(4)
    expect(c.height).toBe(320)
  })
  it('3: host class contains base w-full', () => {
    expect(new UiTreemapChartComponent().hostClass).toContain('w-full')
  })
  it('4: option passes hierarchy to treemap series', () => {
    const c = new UiTreemapChartComponent()
    c.data = [{ name: 'A', children: [{ name: 'A1', value: 5 }] }]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('treemap')
    expect(opt.series[0].data[0].children.length).toBe(1)
  })
  it('5: leafCount counts value nodes', () => {
    const c = new UiTreemapChartComponent()
    c.data = [
      {
        name: 'A',
        children: [
          { name: 'A1', value: 5 },
          { name: 'A2', value: 3 },
        ],
      },
    ]
    expect(c.leafCount()).toBe(2)
  })
  it('6: breadcrumb toggles navigation', () => {
    const c = new UiTreemapChartComponent()
    c.showBreadcrumb = true
    expect((c.getOption() as any).series[0].breadcrumb.show).toBe(true)
  })
  it('7: radius flows into item style', () => {
    const c = new UiTreemapChartComponent()
    c.radius = 8
    expect((c.getOption() as any).series[0].itemStyle.borderRadius).toBe(8)
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiTreemapChartComponent()
    expect(c.heightStyle).toBe('320px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: user option merges without dropping computed series', () => {
    const c = new UiTreemapChartComponent()
    c.option = { title: { text: 'Hi' } }
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('treemap')
    expect(opt.title).toEqual({ text: 'Hi' })
    // Partial series overrides merge per-index (React/Vue parity): the demo's
    // colorByValue/drill options keep computed type/data instead of replacing them.
    const d = new UiTreemapChartComponent()
    d.data = [{ name: 'A', value: 1 }]
    d.option = { series: [{ nodeClick: 'zoomToNode' }] }
    const opt2 = d.getOption() as any
    expect(opt2.series[0].type).toBe('treemap')
    expect(opt2.series[0].data).toEqual([{ name: 'A', value: 1 }])
    expect(opt2.series[0].nodeClick).toBe('zoomToNode')
  })
  it('10: data-slot treemap-chart contract + echarts retained + custom class', () => {
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"treemap-chart"')
    expect(componentSrc).toContain('echarts')
    const c = new UiTreemapChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})

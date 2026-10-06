import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiSegmentedGaugeComponent } from './segmented-gauge.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './segmented-gauge.component.ts'), 'utf8')

describe('SegmentedGauge (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (height 200, stroke 18, gap 4, track on)', () => {
    const c = new UiSegmentedGaugeComponent()
    expect(c.segments).toEqual([])
    expect(c.height).toBe(200)
    expect(c.stroke).toBe(18)
    expect(c.gap).toBe(4)
    expect(c.showTrack).toBe(true)
    expect(c.colors).toEqual(['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'])
  })
  it('3: host class contains base relative w-full', () => {
    const hostClass = new UiSegmentedGaugeComponent().hostClass
    expect(hostClass).toContain('relative')
    expect(hostClass).toContain('w-full')
  })
  it('4: arcs normalise segments by their sum', () => {
    const c = new UiSegmentedGaugeComponent()
    c.segments = [{ value: 1 }, { value: 3 }]
    const arcs = c.arcs()
    expect(arcs).toHaveLength(2)
    for (const a of arcs) expect(a.d).toMatch(/^M -?\d+\.\d\d -?\d+\.\d\d A 100 100/)
  })
  it('5: per-segment color wins, palette fills the rest', () => {
    const c = new UiSegmentedGaugeComponent()
    c.segments = [{ value: 1, color: '#34d399' }, { value: 1 }]
    const arcs = c.arcs()
    expect(arcs[0]!.color).toBe('#34d399')
    expect(arcs[1]!.color).toBe('var(--chart-2)')
  })
  it('6: track path spans the full semicircle', () => {
    const c = new UiSegmentedGaugeComponent()
    expect(c.trackPath()).toBe('M 140.00 224.00 A 100 100 0 0 1 140.00 24.00')
  })
  it('7: viewBox grows with the stroke width', () => {
    const c = new UiSegmentedGaugeComponent()
    expect(c.viewBox()).toBe('0 0 280 142')
    c.stroke = 28
    expect(c.viewBox()).toBe('0 0 280 152')
  })
  it('8: heightStyle normalizes numbers', () => {
    const c = new UiSegmentedGaugeComponent()
    expect(c.heightStyle).toBe('200px')
    c.height = '90'
    expect(c.heightStyle).toBe('90px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('9: pure SVG — no echarts import + data-slot contract', () => {
    expect(componentSrc).not.toContain('echarts')
    expect(componentSrc).toContain('standalone: true')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"segmented-gauge"')
    expect(componentSrc).toContain('role="img"')
  })
  it('10: custom class merges + empty segments render track only', () => {
    const c = new UiSegmentedGaugeComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    expect(c.arcs()).toEqual([])
    expect(() => c.trackPath()).not.toThrow()
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiProgressRingChartComponent } from './progress-ring-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './progress-ring-chart.component.ts'), 'utf8')
const C = 2 * Math.PI * 80

describe('ProgressRingChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=220 stroke=14 label on)', () => {
    const c = new UiProgressRingChartComponent()
    expect(c.height).toBe(220)
    expect(c.stroke).toBe(14)
    expect(c.showLabel).toBe(true)
    expect(c.rings).toEqual([])
    expect(c.colors).toEqual([
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
    ])
  })
  it('3: host class centers the gauge', () => {
    const cls = new UiProgressRingChartComponent().hostClass
    for (const t of ['flex', 'items-center', 'justify-center', 'w-full']) expect(cls).toContain(t)
  })
  it('4: arcs encode progress as dash length', () => {
    const c = new UiProgressRingChartComponent()
    c.rings = [{ value: 50 }]
    expect(c.arcs[0]?.dash).toBe(`${((0.5 * C).toFixed(1))} ${C.toFixed(1)}`)
    expect(c.arcs[0]?.r).toBe(80)
  })
  it('5: values clamp to 0..100', () => {
    const c = new UiProgressRingChartComponent()
    c.rings = [{ value: 140 }, { value: -5 }]
    expect(c.arcs[0]?.dash.startsWith(`${C.toFixed(1)} `)).toBe(true)
    expect(c.arcs[1]?.dash.startsWith('0.0 ')).toBe(true)
  })
  it('6: rings fan out concentrically with default + override colors', () => {
    const c = new UiProgressRingChartComponent()
    c.rings = [{ value: 82 }, { value: 64, color: '#ff0000' }, { value: 45 }]
    expect(c.arcs.map((a) => a.r)).toEqual([80, 60, 40])
    expect(c.arcs[0]?.color).toBe('var(--chart-1)')
    expect(c.arcs[1]?.color).toBe('#ff0000')
    expect(c.view).toBe(200 + 2 * 20 * 2)
  })
  it('7: centre summary mirrors Vue (percent / count / override)', () => {
    const single = new UiProgressRingChartComponent()
    single.rings = [{ value: 68 }]
    expect(single.summary).toBe('68%')
    const multi = new UiProgressRingChartComponent()
    multi.rings = [{ value: 82 }, { value: 64 }]
    expect(multi.summary).toBe('2 rings')
    multi.centerLabel = 'Goals'
    expect(multi.summary).toBe('Goals')
  })
  it('8: accessible name defaults to the per-ring summary', () => {
    const c = new UiProgressRingChartComponent()
    c.rings = [
      { value: 68, label: 'Quota' },
      { value: 40 },
    ]
    expect(c.resolvedAriaLabel).toBe('Progress ring chart: Quota 68%, value 40%')
    c.ariaLabel = 'Custom'
    expect(c.resolvedAriaLabel).toBe('Custom')
  })
  it('9: dependency-free SVG (no echarts) + data-slot contract', () => {
    expect(componentSrc).not.toContain('echarts')
    expect(componentSrc).toContain('<svg')
    expect(componentSrc).toContain('role="presentation"')
    expect(componentSrc).toContain('data-slot')
    expect(componentSrc).toContain('"progress-ring-chart"')
  })
  it('10: custom class merges + empty-rings edge case', () => {
    const c = new UiProgressRingChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiProgressRingChartComponent()
    expect(e.arcs).toEqual([])
    expect(e.view).toBe(160)
    expect(e.summary).toBe('0 rings')
  })
})

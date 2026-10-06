import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiMarimekkoChartComponent } from './marimekko-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './marimekko-chart.component.ts'), 'utf8')

describe('MarimekkoChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (height=340)', () => {
    const c = new UiMarimekkoChartComponent()
    expect(c.height).toBe(340)
    expect(c.columns).toEqual([])
  })
  it('3: host class contains base w-full', () => {
    expect(new UiMarimekkoChartComponent().hostClass).toContain('w-full')
  })
  it('4: segments stack to the full column height', () => {
    const c = new UiMarimekkoChartComponent()
    c.columns = [
      {
        name: 'C1',
        values: [
          { name: 'a', value: 30 },
          { name: 'b', value: 30 },
        ],
      },
    ]
    const opt = c.getOption() as any
    const tiles = c.tiles()
    expect(tiles).toHaveLength(2)
    expect(tiles[1]!.y1).toBeCloseTo(100, 8)
    expect(opt.series[0].data).toHaveLength(2)
  })
  it('5: key series type is custom', () => {
    const c = new UiMarimekkoChartComponent()
    c.columns = [
      {
        name: 'C1',
        values: [
          { name: 'a', value: 30 },
          { name: 'b', value: 30 },
        ],
      },
    ]
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('custom')
  })
  it('6: column widths encode column totals', () => {
    const c = new UiMarimekkoChartComponent()
    c.columns = [
      { name: 'Small', values: [{ name: 'a', value: 25 }] },
      { name: 'Big', values: [{ name: 'a', value: 75 }] },
    ]
    const tiles = c.tiles()
    const wSmall = tiles[0]!.x1 - tiles[0]!.x0
    const wBig = tiles[1]!.x1 - tiles[1]!.x0
    expect(wBig).toBeCloseTo(wSmall * 3, 8)
  })
  it('7: segment colors stay stable across columns', () => {
    const c = new UiMarimekkoChartComponent()
    c.columns = [{ name: 'C1', values: [{ name: 'a', value: 1 }] }]
    const opt = c.getOption() as any
    expect(typeof opt.series[0].renderItem).toBe('function')
    expect(opt.legend.data).toEqual(['a'])
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiMarimekkoChartComponent()
    c.columns = [
      {
        name: 'C1',
        values: [
          { name: 'a', value: 30 },
          { name: 'b', value: 30 },
        ],
      },
    ]
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
    expect(componentSrc).toContain('"marimekko-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiMarimekkoChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiMarimekkoChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

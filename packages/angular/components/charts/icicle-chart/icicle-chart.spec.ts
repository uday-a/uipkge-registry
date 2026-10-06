import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiIcicleChartComponent, type IcicleNode } from './icicle-chart.component'

const here = dirname(fileURLToPath(import.meta.url))
const componentSrc = readFileSync(resolve(here, './icicle-chart.component.ts'), 'utf8')

const root: IcicleNode = {
  name: 'R',
  children: [
    { name: 'A', value: 30 },
    { name: 'B', value: 70 },
  ],
}

describe('IcicleChart (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(componentSrc).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (height=340, no data)', () => {
    const c = new UiIcicleChartComponent()
    expect(c.height).toBe(340)
    expect(c.data).toBeUndefined()
  })
  it('3: host class contains base w-full', () => {
    expect(new UiIcicleChartComponent().hostClass).toContain('w-full')
  })
  it('4: siblings split unit width by share', () => {
    const c = new UiIcicleChartComponent()
    c.data = root
    const opt = c.getOption() as any
    const flat = c.flatten()
    expect(flat).toHaveLength(3)
    expect(flat[0]!.depth).toBe(0)
    expect(flat[1]!.x1 - flat[1]!.x0).toBeCloseTo(30, 8)
    expect(flat[2]!.x1 - flat[2]!.x0).toBeCloseTo(70, 8)
    expect(opt.series[0].data).toHaveLength(3)
  })
  it('5: key series type is custom', () => {
    const c = new UiIcicleChartComponent()
    c.data = root
    const opt = c.getOption() as any
    expect(opt.series[0].type).toBe('custom')
  })
  it('6: children nest inside the parent band', () => {
    const c = new UiIcicleChartComponent()
    c.data = {
      name: 'P',
      children: [
        { name: 'C1', value: 1 },
        { name: 'C2', value: 1 },
      ],
    }
    const flat = c.flatten()
    expect(flat[0]!.depth).toBe(0)
    expect(flat[1]!.depth).toBe(1)
    expect(flat[1]!.x0).toBeGreaterThanOrEqual(flat[0]!.x0)
    expect(flat[1]!.x1).toBeLessThanOrEqual(flat[0]!.x1)
  })
  it('7: valueless siblings split into equal shares', () => {
    const c = new UiIcicleChartComponent()
    c.data = { name: 'P', children: [{ name: 'C1' }, { name: 'C2' }] }
    const flat = c.flatten()
    expect(flat[1]!.x1 - flat[1]!.x0).toBeCloseTo(50, 8)
    expect(flat[2]!.x1 - flat[2]!.x0).toBeCloseTo(50, 8)
  })
  it('8: user option merges without dropping computed series', () => {
    const c = new UiIcicleChartComponent()
    c.data = root
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
    expect(componentSrc).toContain('"icicle-chart"')
  })
  it('10: custom class merges + empty-data edge case', () => {
    const c = new UiIcicleChartComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const e = new UiIcicleChartComponent()
    expect(() => e.getOption()).not.toThrow()
    expect((e.getOption() as any).series[0].data).toEqual([])
  })
})

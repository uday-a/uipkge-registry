import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import chartsItem from './charts.registry'
import {
  CHART_FALLBACK,
  gaugeThresholds,
  getChartColors,
  getChartTextColor,
  mergeOptionBlock,
  toCanvasColor,
  toRgba,
} from './use-chart-theme'

const here = dirname(fileURLToPath(import.meta.url))
const themeSrc = readFileSync(resolve(here, './use-chart-theme.ts'), 'utf8')

describe('Charts meta-bundle (angular, 10 checks)', () => {
  it('1: registry framework is angular', () => {
    expect(chartsItem.framework).toBe('angular')
  })
  it('2: registryDependencies list angular chart URLs (line, bar, sparkline)', () => {
    const deps = chartsItem.registryDependencies ?? []
    expect(deps).toContain('https://uipkge.dev/r/line-chart.json')
    expect(deps).toContain('https://uipkge.dev/r/bar-chart.json')
    expect(deps).toContain('https://uipkge.dev/r/sparkline.json')
  })
  it('3: meta-bundle ships no files of its own', () => {
    expect(chartsItem.files).toEqual([])
  })
  it('4: theme module has no Vue import (framework-free port)', () => {
    expect(themeSrc).not.toContain("from 'vue'")
    expect(themeSrc).not.toContain('ComputedRef')
  })
  it('5: chart colors fall back to 5-entry palette outside the DOM', () => {
    expect(getChartColors()).toEqual(CHART_FALLBACK)
  })
  it('6: oklch white converts to canvas-safe rgb', () => {
    expect(toCanvasColor('oklch(1 0 0)')).toContain('255')
  })
  it('7: toRgba maps hex + alpha to rgba()', () => {
    expect(toRgba('#14b8a6', 0.18)).toBe('rgba(20,184,166,0.18)')
  })
  it('8: mergeOptionBlock deep-merges one nested level', () => {
    const out = mergeOptionBlock(
      { axisLabel: { color: 'red', fontSize: 11 }, show: true },
      { axisLabel: { color: 'blue', fontSize: 9 } },
    )
    expect(out).toEqual({ axisLabel: { color: 'blue', fontSize: 9 }, show: true })
  })
  it('9: gauge thresholds keep the teal/amber/red stoplight', () => {
    expect(gaugeThresholds).toEqual([
      [0.6, '#14b8a6'],
      [0.85, '#f59e0b'],
      [1, '#dc2626'],
    ])
  })
  it('10: text color falls back outside the DOM', () => {
    expect(getChartTextColor()).toBe('#888888')
  })
})

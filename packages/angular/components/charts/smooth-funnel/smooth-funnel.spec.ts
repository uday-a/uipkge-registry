// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiSmoothFunnelComponent, buildSmoothFunnelSegments, SF_H, type FunnelStage } from './smooth-funnel.component'

// SmoothFunnel is the React primitive 1:1: a horizontal pure-SVG funnel whose band heights and
// pills are a share of the LARGEST stage (not of the sum). If these break, a conversion funnel
// shows the top stage at something other than 100%, or tail stages vanish at tiny percents.

const here = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(here, './smooth-funnel.component.ts'), 'utf8')
const PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const STAGES: FunnelStage[] = [
  { name: 'Views', value: 72000 },
  { name: 'Cart', value: 38200 },
  { name: 'Checkout', value: 16800 },
  { name: 'Purchase', value: 5600 },
]

/** Band height at the start (x0) of a path, read back from its M/C/L/C commands. */
function startHeight(d: string): number {
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  const yTop0 = nums[1]!
  const yBot0 = nums[nums.length - 1]!
  return +(yBot0 - yTop0).toFixed(1)
}

@Component({
  standalone: true,
  imports: [UiSmoothFunnelComponent],
  template: `<ui-smooth-funnel
    [data]="data"
    [height]="height"
    [showLabels]="showLabels"
    [colors]="colors"
    class="custom-x"
    ariaLabel="Signup flow"
  />`,
})
class Host {
  data: FunnelStage[] = STAGES
  height: number | string = 180
  showLabels = true
  colors: string[] = PALETTE
}

function render(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, patch)
  fixture.detectChanges()
  return fixture.nativeElement.querySelector('[data-slot="smooth-funnel"]') as HTMLElement
}

describe('SmoothFunnel geometry (matches React)', () => {
  it('percent is a share of the largest stage, so the top stage reads 100%', () => {
    const segs = buildSmoothFunnelSegments(STAGES, 18, PALETTE)
    expect(segs.map((s) => Math.round(s.percent * 10) / 10)).toEqual([100, 53.1, 23.3, 7.8])
  })

  it('each band tapers from its own share to the next stage share; the last band stays flat', () => {
    const [a, b, c, last] = buildSmoothFunnelSegments(STAGES, 18, PALETTE)
    expect(startHeight(a!.d)).toBe(SF_H)
    expect(a!.d).toContain(`L 180.0 ${(90 + (38200 / 72000) * 90).toFixed(1)}`)
    expect(startHeight(b!.d)).toBe(+((38200 / 72000) * SF_H).toFixed(1))
    expect(startHeight(c!.d)).toBe(+((16800 / 72000) * SF_H).toFixed(1))
    // last band: next = itself, so start and end heights match
    expect(last!.d).toMatch(/^M 540\.0 (\S+) C .* 720\.0 \1 L 720\.0/)
  })

  it('stages are laid out left to right in equal columns with S-curve control points at 38%/62%', () => {
    const segs = buildSmoothFunnelSegments(STAGES, 18, PALETTE)
    expect(segs[1]!.d.startsWith('M 180.0')).toBe(true)
    expect(segs[1]!.d).toContain('C 248.4 ')
    expect(segs[1]!.d).toContain(', 291.6 ')
    expect(segs.map((s) => +s.labelX.toFixed(1))).toEqual([75.6, 255.6, 435.6, 615.6])
  })

  it('minHeight floors tiny tail stages so they stay visible', () => {
    const segs = buildSmoothFunnelSegments(
      [
        { name: 'A', value: 1000 },
        { name: 'B', value: 1 },
      ],
      18,
      PALETTE,
    )
    expect(startHeight(segs[1]!.d)).toBe(18)
    expect(
      startHeight(
        buildSmoothFunnelSegments(
          [
            { name: 'A', value: 1000 },
            { name: 'B', value: 1 },
          ],
          40,
          PALETTE,
        )[1]!.d,
      ),
    ).toBe(40)
  })

  it('stage color overrides the palette; otherwise palette cycles', () => {
    const six: FunnelStage[] = Array.from({ length: 6 }, (_, i) => ({ name: `S${i}`, value: 60 - i }))
    six[2] = { ...six[2]!, color: '#ff0000' }
    expect(buildSmoothFunnelSegments(six, 18, PALETTE).map((s) => s.color)).toEqual([
      'var(--chart-1)',
      'var(--chart-2)',
      '#ff0000',
      'var(--chart-4)',
      'var(--chart-5)',
      'var(--chart-1)',
    ])
  })

  it('empty data and all-zero data do not throw', () => {
    expect(buildSmoothFunnelSegments([], 18, PALETTE)).toEqual([])
    const zero = buildSmoothFunnelSegments([{ name: 'A', value: 0 }], 18, PALETTE)
    expect(zero[0]!.percent).toBe(0)
    expect(startHeight(zero[0]!.d)).toBe(18)
  })
})

describe('SmoothFunnel rendering (matches React markup)', () => {
  it('defaults mirror React', () => {
    const c = new UiSmoothFunnelComponent()
    expect(c.height).toBe(240)
    expect(c.showLabels).toBe(true)
    expect(c.minHeight).toBe(18)
    expect(c.colors).toEqual(PALETTE)
    expect(c.data).toEqual([])
  })

  it('root carries slot, focus ring classes, tabindex, and height (numeric -> px)', () => {
    const root = render()
    expect(root.getAttribute('data-uipkge')).toBe('')
    expect(root.getAttribute('tabindex')).toBe('0')
    expect(root.style.height).toBe('180px')
    for (const c of ['w-full', 'focus-visible:ring-2', 'focus-visible:outline-none', 'custom-x']) {
      expect(root.classList.contains(c)).toBe(true)
    }
    expect(render({ height: '50vh' }).style.height).toBe('50vh')
  })

  it('renders one SVG path per stage in a stretched 720x180 viewBox, labelled as an image', () => {
    const root = render()
    const svg = root.querySelector('svg')!
    expect(svg.getAttribute('viewBox')).toBe('0 0 720 180')
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none')
    expect(svg.getAttribute('role')).toBe('img')
    expect(svg.getAttribute('aria-label')).toBe('Signup flow')
    const paths = [...svg.querySelectorAll('path')]
    expect(paths).toHaveLength(4)
    expect(paths.map((p) => p.getAttribute('fill'))).toEqual(PALETTE.slice(0, 4))
  })

  it('percent pills read share-of-top rounded to one decimal', () => {
    const root = render()
    const pills = [...root.querySelectorAll('foreignObject > div')].map((d) => d.textContent!.trim())
    expect(pills).toEqual(['100%', '53.1%', '23.3%', '7.8%'])
    const fo = root.querySelector('foreignObject')!
    const box = ['x', 'y', 'width', 'height'].map((a) => +Number(fo.getAttribute(a)).toFixed(1))
    expect(box).toEqual([47.6, 78, 56, 24])
  })

  it('showLabels=false hides the pills', () => {
    expect(render({ showLabels: false }).querySelectorAll('foreignObject')).toHaveLength(0)
  })

  it('no ECharts, eager change detection', () => {
    expect(source).not.toContain("'echarts")
    expect(source).toContain('ChangeDetectionStrategy.Eager')
  })
})

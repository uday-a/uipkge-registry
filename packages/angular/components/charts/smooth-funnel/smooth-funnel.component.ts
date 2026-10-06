import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────
// SmoothFunnel — pure SVG, no ECharts
// ─────────────────────────────────────────────────────────────────────────

export interface FunnelStage {
  name: string
  value: number
  /** Optional override; defaults to chart-1..N from the registry palette. */
  color?: string
}

export interface SmoothFunnelSegment {
  d: string
  color: string
  percent: number
  name: string
  value: number
  labelX: number
  labelY: number
}

// SVG geometry. Width/height are virtual (the SVG fits to container
// via viewBox). The aspect ratio (W:H ≈ 4:1) matches the horizontal
// "flow" layout consumers typically want for a 4-6 stage funnel; if
// you need taller bands, override `height` and the curves stretch
// vertically without distorting horizontally.
export const SF_W = 720
export const SF_H = 180
const SF_CY = SF_H / 2

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

/** Pure geometry: one S-curved band per stage, sized by share of the LARGEST stage. */
export function buildSmoothFunnelSegments(
  stages: FunnelStage[],
  minHeight: number,
  colors: string[],
): SmoothFunnelSegment[] {
  const n = stages.length
  if (n === 0) return []
  const segW = SF_W / n
  const max = Math.max(...stages.map((s) => s.value))
  const pctOf = (v: number) => (max > 0 ? (v / max) * 100 : 0)
  const heightFor = (pct: number) => Math.max((pct / 100) * SF_H, minHeight)

  return stages.map((s, i) => {
    const next = stages[i + 1] ?? s
    const startPct = pctOf(s.value)
    const endPct = pctOf(next.value)
    const h0 = heightFor(startPct)
    const h1 = heightFor(endPct)
    const x0 = i * segW
    const x1 = x0 + segW
    const yTop0 = SF_CY - h0 / 2
    const yTop1 = SF_CY - h1 / 2
    const yBot0 = SF_CY + h0 / 2
    const yBot1 = SF_CY + h1 / 2

    // Cubic bezier control points at 38% / 62% of segment width produce
    // a soft S-curve transition between stages rather than the
    // trapezoidal default of an ECharts funnel.
    const cx1 = x0 + segW * 0.38
    const cx2 = x0 + segW * 0.62

    const d = [
      `M ${x0.toFixed(1)} ${yTop0.toFixed(1)}`,
      `C ${cx1.toFixed(1)} ${yTop0.toFixed(1)}, ${cx2.toFixed(1)} ${yTop1.toFixed(1)}, ${x1.toFixed(1)} ${yTop1.toFixed(1)}`,
      `L ${x1.toFixed(1)} ${yBot1.toFixed(1)}`,
      `C ${cx2.toFixed(1)} ${yBot1.toFixed(1)}, ${cx1.toFixed(1)} ${yBot0.toFixed(1)}, ${x0.toFixed(1)} ${yBot0.toFixed(1)}`,
      'Z',
    ].join(' ')

    return {
      d,
      color: s.color ?? colors[i % colors.length]!,
      percent: startPct,
      name: s.name,
      value: s.value,
      labelX: x0 + segW * 0.42,
      labelY: SF_CY,
    }
  })
}

/**
 * Angular port of the UIPKGE SmoothFunnel: a horizontal, smoothly tapering
 * pure-SVG funnel. Each stage is a cubic-bezier band whose height is its
 * share of the largest stage, with a percent pill (share of the top stage).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-smooth-funnel, [ui-smooth-funnel]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"smooth-funnel"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
    '[class]': 'hostClass',
  },
  template: `
    <svg
      [attr.viewBox]="viewBox"
      class="block h-full w-full"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="ariaLabel || 'Chart'"
    >
      @for (seg of segments; track $index) {
        <g>
          <path [attr.d]="seg.d" [attr.fill]="seg.color" />
          @if (showLabels) {
            <foreignObject [attr.x]="seg.labelX - 28" [attr.y]="seg.labelY - 12" width="56" height="24">
              <div
                class="bg-background text-foreground inline-flex h-6 items-center rounded-full border px-2 text-xs font-semibold shadow-sm"
              >
                {{ pillText(seg.percent) }}%
              </div>
            </foreignObject>
          }
        </g>
      }
    </svg>
  `,
})
export class UiSmoothFunnelComponent implements OnChanges {
  @Input() data: FunnelStage[] = []
  /** Container height (px when numeric, raw CSS when string). Defaults to 240. */
  @Input() height: number | string = 240
  /** Show the percent pill on each stage. Defaults to true. */
  @Input() showLabels = true
  /** Minimum segment height in px so tail stages stay visible at tiny percents. Default 18. */
  @Input() minHeight = 18
  /** Optional fallback palette when `color` is omitted on a stage. */
  @Input() colors: string[] = DEFAULT_COLORS
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  readonly viewBox = `0 0 ${SF_W} ${SF_H}`

  segments: SmoothFunnelSegment[] = []

  get hostClass(): string {
    // `block` stands in for the React root <div>'s default display.
    return cn('block focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  ngOnChanges(): void {
    this.segments = buildSmoothFunnelSegments(this.data ?? [], this.minHeight, this.colors ?? DEFAULT_COLORS)
  }

  pillText(percent: number): number {
    return Math.round(percent * 10) / 10
  }
}

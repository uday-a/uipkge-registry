import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export interface GaugeSegment {
  /** Relative size of the segment. Segments are normalised by their sum. */
  value: number
  /** Optional override; defaults to chart-1..N from the registry palette. */
  color?: string
  /** Optional label, surfaced for consumers that want to render their own legend. */
  label?: string
}

// SVG geometry mirrors React/Vue 1:1. The viewBox uses the centre + radius +
// stroke so the canvas grows with the stroke width and the centre content can
// sit underneath without overlapping the arc.
const SG_CX = 140
const SG_CY = 124
const SG_R = 100
const SG_START = 180
const SG_SWEEP = 180

function sgPolar(angleDeg: number): readonly [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [SG_CX + SG_R * Math.cos(a), SG_CY + SG_R * Math.sin(a)] as const
}

function sgArcPath(startA: number, endA: number): string {
  const [sx, sy] = sgPolar(startA)
  const [ex, ey] = sgPolar(endA)
  const largeArc = endA - startA > 180 ? 1 : 0
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${SG_R} ${SG_R} 0 ${largeArc} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`
}

/**
 * Angular port of the UIPKGE SegmentedGauge — pure SVG, no ECharts.
 * Semicircular gauge split into colored pill segments by relative value;
 * projected content lands in the dish centre (the Vue `center` slot).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-segmented-gauge, [ui-segmented-gauge]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"segmented-gauge"',
    '[attr.data-uipkge]': '""',
    '[attr.tabindex]': '0',
    '[class]': 'hostClass',
    '[style.height]': 'heightStyle',
  },
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      class="block h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      [attr.aria-label]="ariaLabel || 'Chart'"
    >
      @if (showTrack) {
        <path
          [attr.d]="trackPath()"
          fill="none"
          stroke="currentColor"
          [attr.stroke-width]="stroke"
          stroke-linecap="round"
          class="text-muted/40"
          opacity="0.35"
        />
      }
      @for (arc of arcs(); track $index) {
        <path [attr.d]="arc.d" fill="none" [attr.stroke]="arc.color" [attr.stroke-width]="stroke" stroke-linecap="round" />
      }
    </svg>
    <div class="pointer-events-none absolute inset-x-0 bottom-[8%] flex flex-col items-center">
      <ng-content />
    </div>
  `,
})
export class UiSegmentedGaugeComponent {
  @Input() segments: GaugeSegment[] = []
  /** Container height (px when numeric, raw CSS when string). Default 200. */
  @Input() height: number | string = 200
  /** Stroke width of the arc in SVG units. Default 18. */
  @Input() stroke = 18
  /** Angular gap between segments, in degrees. Default 4. */
  @Input() gap = 4
  /** Fallback palette when `color` is omitted on a segment. */
  @Input() colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
  /** Show a faint background track behind the arc. Default true. */
  @Input({ transform: booleanAttribute }) showTrack = true
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn('focus-visible:ring-ring relative w-full focus-visible:ring-2 focus-visible:outline-none', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  viewBox(): string {
    return `0 0 ${SG_CX * 2} ${SG_CY + this.stroke}`
  }

  trackPath(): string {
    return sgArcPath(SG_START, SG_START + SG_SWEEP)
  }

  /** Segment arcs normalised by the value sum, with the gap cut between them. Pure. */
  arcs(): { d: string; color: string }[] {
    const total = this.segments.reduce((acc, s) => acc + s.value, 0) || 1
    let cursor = SG_START
    return this.segments.map((s, i) => {
      const span = (s.value / total) * SG_SWEEP
      const isLast = i === this.segments.length - 1
      const segEnd = cursor + span - (isLast ? 0 : this.gap)
      const arc = { d: sgArcPath(cursor, segEnd), color: s.color ?? this.colors[i % this.colors.length]! }
      cursor = cursor + span
      return arc
    })
  }
}

import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export interface ProgressRing {
  /** 0..100. */
  value: number
  /** Defaults to chart-1..N tokens. */
  color?: string
  label?: string
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
const CIRCUMFERENCE = 2 * Math.PI * 80

/**
 * Angular port of the UIPKGE ProgressRingChart — dependency-free SVG gauge. Same inputs as the Vue `ProgressRingChart` (`rings`, `height`, `stroke`, `showLabel`, `centerLabel`, `colors`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-progress-ring-chart, [ui-progress-ring-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"progress-ring-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'resolvedAriaLabel',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `
    <svg [attr.viewBox]="'0 0 ' + view + ' ' + view" class="aspect-square h-full max-h-full" role="presentation">
      <g [attr.transform]="'rotate(-90 ' + center + ' ' + center + ')'">
        @for (a of arcs; track $index) {
          <circle
            [attr.cx]="center"
            [attr.cy]="center"
            [attr.r]="a.r"
            fill="none"
            stroke="currentColor"
            [attr.stroke-width]="stroke"
            class="text-border"
            opacity="0.35"
          />
        }
        @for (a of arcs; track $index) {
          <circle
            [attr.cx]="center"
            [attr.cy]="center"
            [attr.r]="a.r"
            fill="none"
            [attr.stroke]="a.color"
            [attr.stroke-width]="stroke"
            stroke-linecap="round"
            [attr.stroke-dasharray]="a.dash"
          />
        }
      </g>
      @if (showLabel) {
        <text
          [attr.x]="center"
          [attr.y]="center"
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-foreground"
          font-size="26"
          font-weight="700"
        >
          {{ summary }}
        </text>
      }
    </svg>
  `,
})
export class UiProgressRingChartComponent {
  @Input() rings: ProgressRing[] = []
  @Input() height: number | string = 220
  /** Ring thickness in SVG units. Default 14. */
  @Input() stroke = 14
  /** Show the centre label (first ring value or custom). Default true. */
  @Input({ transform: booleanAttribute }) showLabel = true
  /** Centre label override. */
  @Input() centerLabel?: string
  @Input() colors: string[] = DEFAULT_COLORS
  /** Accessible name announced for the chart image. Defaults to a per-ring summary. */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  get arcs(): { dash: string; color: string | undefined; r: number; value: number }[] {
    return this.rings.map((r, i) => {
      const pct = Math.max(0, Math.min(100, r.value)) / 100
      return {
        dash: `${(pct * CIRCUMFERENCE).toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`,
        color: r.color ?? this.colors[i % this.colors.length],
        r: 80 - i * (this.stroke + 6),
        value: r.value,
      }
    })
  }

  get view(): number {
    return 200 + (this.rings.length - 1) * (this.stroke + 6) * 2
  }

  get center(): number {
    return this.view / 2
  }

  get summary(): string {
    return (
      this.centerLabel ??
      (this.rings.length === 1 ? `${Math.round(this.rings[0]?.value ?? 0)}%` : `${this.rings.length} rings`)
    )
  }

  get resolvedAriaLabel(): string {
    return (
      this.ariaLabel ||
      `Progress ring chart: ${this.rings.map((r) => `${r.label ?? 'value'} ${Math.round(r.value)}%`).join(', ')}`
    )
  }

  get hostClass(): string {
    return cn(
      'focus-visible:ring-ring flex w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none',
      this.className,
    )
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }
}

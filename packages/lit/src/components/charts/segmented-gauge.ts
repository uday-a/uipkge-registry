import { LitElement, css, html, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { defaultTrue } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

export interface GaugeSegment {
  /** Relative size of the segment. Segments are normalised by their sum. */
  value: number
  /** Optional override; defaults to chart-1..N from the registry palette. */
  color?: string
  /** Optional label, for consumers that render their own legend. */
  label?: string
}

// SVG geometry, verbatim from React (SG_CX/SG_CY/SG_R, sgPolar, sgArcPath).
// The viewBox uses the centre + radius + stroke so the canvas grows with the
// stroke width and the centre content can sit underneath without overlapping
// the arc.
const SG_CX = 140
const SG_CY = 124
const SG_R = 100

function sgPolar(angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [SG_CX + SG_R * Math.cos(a), SG_CY + SG_R * Math.sin(a)] as const
}

function sgArcPath(startA: number, endA: number) {
  const [sx, sy] = sgPolar(startA)
  const [ex, ey] = sgPolar(endA)
  const largeArc = endA - startA > 180 ? 1 : 0
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${SG_R} ${SG_R} 0 ${largeArc} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`
}

const START_ANGLE = 180
const SWEEP = 180
const TRACK_PATH = sgArcPath(START_ANGLE, START_ANGLE + SWEEP)

/**
 * <uip-segmented-gauge> — the registry SegmentedGauge (React's
 * `SegmentedGauge` in charts/raw-chart as well as charts/segmented-gauge):
 * pure SVG, no ECharts. Same arcs, track, classes and centre slot as React.
 *
 * Like <uip-smooth-funnel> (the other pure-SVG chart) this is a standalone
 * element, not a `ChartElement`: that base lazily imports the whole ECharts
 * bundle and manages an instance, which an SVG chart would pay for and never
 * use. The shared API (`height`, `aria-label`) and helpers (`heightToStyle`,
 * `defaultTrue`) still come from the chart-element lib.
 *
 * Properties (React props): `segments` ({ value, color?, label? }[]; property
 * or JSON attribute), `height` (default 200), `stroke` (default 18), `gap`
 * (default 4), `colors` (default var(--chart-1..5) — the standalone React
 * component's palette; the copy embedded in RawChart.tsx uses hex), `show-track`
 * (default true; `show-track="false"` hides it), `aria-label` (React
 * `ariaLabel`). React's `children` → the default slot, rendered in the dish
 * centre. React's `className` → host classes. Colours are CSS variables, so
 * the theme flips without any JS.
 */
export class UipSegmentedGauge extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    segments: { type: Array },
    height: {},
    stroke: { type: Number },
    gap: { type: Number },
    colors: { type: Array },
    showTrack: { attribute: 'show-track', converter: defaultTrue },
    accessibleLabel: { attribute: 'aria-label' },
    hasCenter: { state: true },
  }

  segments: GaugeSegment[] = []
  height: number | string = 200
  stroke = 18
  gap = 4
  colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
  showTrack = true
  accessibleLabel?: string
  private hasCenter = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'segmented-gauge')
  }

  private arcs() {
    const segments = this.segments ?? []
    const total = segments.reduce((acc, s) => acc + s.value, 0) || 1
    let cursor = START_ANGLE
    return segments.map((s, i) => {
      const span = (s.value / total) * SWEEP
      const isLast = i === segments.length - 1
      const segEnd = cursor + span - (isLast ? 0 : this.gap)
      const arc = { d: sgArcPath(cursor, segEnd), color: s.color ?? this.colors[i % this.colors.length] }
      cursor = cursor + span
      return arc
    })
  }

  private onCenterSlotChange(e: Event) {
    this.hasCenter = (e.target as HTMLSlotElement)
      .assignedNodes()
      .some((n) => n.nodeType === 1 || n.textContent?.trim())
  }

  render() {
    return html`<div
      part="base"
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring relative w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <svg
        viewBox=${`0 0 ${SG_CX * 2} ${SG_CY + this.stroke}`}
        class="block h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label=${this.accessibleLabel || 'Chart'}
      >
        ${this.showTrack
          ? svg`<path
              d=${TRACK_PATH}
              fill="none"
              stroke="currentColor"
              stroke-width=${this.stroke}
              stroke-linecap="round"
              class="text-muted/40"
              opacity="0.35"
            />`
          : null}
        ${this.arcs().map(
          (a) =>
            svg`<path d=${a.d} fill="none" stroke=${a.color ?? ''} stroke-width=${this.stroke} stroke-linecap="round" />`,
        )}
      </svg>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-[8%] flex flex-col items-center"
        ?hidden=${!this.hasCenter}
      >
        <slot @slotchange=${this.onCenterSlotChange}></slot>
      </div>
    </div>`
  }
}

customElements.get('uip-segmented-gauge') || customElements.define('uip-segmented-gauge', UipSegmentedGauge)

declare global {
  interface HTMLElementTagNameMap {
    'uip-segmented-gauge': UipSegmentedGauge
  }
}

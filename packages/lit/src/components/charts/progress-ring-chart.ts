import { LitElement, css, html, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { defaultTrue } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

export interface ProgressRing {
  /** 0..100. */
  value: number
  /** Defaults to chart-1..N tokens. */
  color?: string
  label?: string
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
const C = 2 * Math.PI * 80

/**
 * <uip-progress-ring-chart> — the registry ProgressRingChart (React
 * `ProgressRingChart`): pure SVG, no ECharts. Same arcs, classes and centre
 * label as React.
 *
 * Like <uip-smooth-funnel> (the other pure-SVG chart) this is a standalone
 * element, not a `ChartElement`: that base lazily imports the whole ECharts
 * bundle and manages an instance, which an SVG chart would pay for and never
 * use. The shared API (`height`, `aria-label`) and helpers (`heightToStyle`,
 * `defaultTrue`) still come from the chart-element lib.
 *
 * Properties (React props): `rings` ({ value, color?, label? }[]; property
 * or JSON attribute), `height` (default 220), `stroke` (default 14),
 * `show-label` (default true; `show-label="false"` hides it),
 * `center-label`, `colors` (default var(--chart-1..5)), `aria-label` (React
 * `ariaLabel`; defaults to "Progress ring chart: …" like React). React's
 * `className` → host classes. Colours are CSS variables, so the theme flips
 * without any JS.
 */
export class UipProgressRingChart extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    rings: { type: Array },
    height: {},
    stroke: { type: Number },
    showLabel: { attribute: 'show-label', converter: defaultTrue },
    centerLabel: { attribute: 'center-label' },
    colors: { type: Array },
    accessibleLabel: { attribute: 'aria-label' },
  }

  rings: ProgressRing[] = []
  height: number | string = 220
  stroke = 14
  showLabel = true
  centerLabel?: string
  colors = DEFAULT_COLORS
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'progress-ring-chart')
  }

  render() {
    const rings = this.rings ?? []
    const stroke = this.stroke
    const arcs = rings.map((r, i) => {
      const pct = Math.max(0, Math.min(100, r.value)) / 100
      return {
        dash: `${(pct * C).toFixed(1)} ${C.toFixed(1)}`,
        color: r.color ?? this.colors[i % this.colors.length],
        r: 80 - i * (stroke + 6),
        value: r.value,
      }
    })
    const view = 200 + (rings.length - 1) * (stroke + 6) * 2
    const center = view / 2
    const summary =
      this.centerLabel ?? (rings.length === 1 ? `${Math.round(rings[0]?.value ?? 0)}%` : `${rings.length} rings`)
    const defaultAria = `Progress ring chart: ${rings.map((r) => `${r.label ?? 'value'} ${Math.round(r.value)}%`).join(', ')}`

    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || defaultAria}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring flex w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
    >
      <svg viewBox=${`0 0 ${view} ${view}`} class="aspect-square h-full max-h-full" role="presentation">
        <g transform=${`rotate(-90 ${center} ${center})`}>
          ${arcs.map(
            (a) =>
              svg`<circle
                cx=${center}
                cy=${center}
                r=${a.r}
                fill="none"
                stroke="currentColor"
                stroke-width=${stroke}
                class="text-border"
                opacity="0.35"
              />`,
          )}
          ${arcs.map(
            (a) =>
              svg`<circle
                cx=${center}
                cy=${center}
                r=${a.r}
                fill="none"
                stroke=${a.color ?? ''}
                stroke-width=${stroke}
                stroke-linecap="round"
                stroke-dasharray=${a.dash}
              />`,
          )}
        </g>
        ${this.showLabel
          ? svg`<text
              x=${center}
              y=${center}
              text-anchor="middle"
              dominant-baseline="middle"
              class="fill-foreground"
              font-size="26"
              font-weight="700"
            >
              ${summary}
            </text>`
          : null}
      </svg>
    </div>`
  }
}

customElements.get('uip-progress-ring-chart') || customElements.define('uip-progress-ring-chart', UipProgressRingChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-progress-ring-chart': UipProgressRingChart
  }
}

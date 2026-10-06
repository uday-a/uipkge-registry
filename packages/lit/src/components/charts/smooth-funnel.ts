import { LitElement, css, html, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { defaultTrue } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

interface FunnelStage {
  name: string
  value: number
  /** Optional override; defaults to chart-1..N from the registry palette. */
  color?: string
}

// SVG geometry (verbatim from React). Width/height are virtual (the SVG fits
// to its container via viewBox, preserveAspectRatio="none").
const SF_W = 720
const SF_H = 180
const SF_CY = SF_H / 2

/**
 * <uip-smooth-funnel> — the registry SmoothFunnel (React `SmoothFunnel`):
 * pure SVG, no ECharts. Same paths, pills and classes as React.
 *
 * Properties (React props): `data` ({ name, value, color? }[]; JSON attribute
 * or property), `height` (default 240), `show-labels` (default true;
 * `show-labels="false"` hides the pills), `min-height` (default 18),
 * `colors` (default var(--chart-1..5)), `aria-label` (React `ariaLabel`).
 * React's `className` → host classes. Colours are CSS variables, so the theme
 * flips without any JS.
 */
export class UipSmoothFunnel extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    data: { type: Array },
    height: {},
    showLabels: { attribute: 'show-labels', converter: defaultTrue },
    minHeight: { attribute: 'min-height', type: Number },
    colors: { type: Array },
    accessibleLabel: { attribute: 'aria-label' },
  }

  data: FunnelStage[] = []
  height: number | string = 240
  showLabels = true
  minHeight = 18
  colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'smooth-funnel')
  }

  private segments() {
    const stages = this.data ?? []
    const n = stages.length
    if (n === 0) return []
    const segW = SF_W / n
    const max = Math.max(...stages.map((s) => s.value))
    const pctOf = (v: number) => (max > 0 ? (v / max) * 100 : 0)
    const heightFor = (pct: number) => Math.max((pct / 100) * SF_H, this.minHeight)

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
      // a soft S-curve transition between stages.
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
        color: s.color ?? this.colors[i % this.colors.length],
        percent: startPct,
        labelX: x0 + segW * 0.42,
        labelY: SF_CY,
      }
    })
  }

  render() {
    return html`<div
      part="base"
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <svg
        viewBox=${`0 0 ${SF_W} ${SF_H}`}
        class="block h-full w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label=${this.accessibleLabel || 'Chart'}
      >
        ${this.segments().map(
          (seg) =>
            svg`<g>
              <path d=${seg.d} fill=${seg.color ?? ''} />
              ${
                this.showLabels
                  ? svg`<foreignObject x=${seg.labelX - 28} y=${seg.labelY - 12} width="56" height="24">${html`<div
                      class="bg-background text-foreground inline-flex h-6 items-center rounded-full border px-2 text-xs font-semibold shadow-sm"
                    >
                      ${Math.round(seg.percent * 10) / 10}%
                    </div>`}</foreignObject>`
                  : null
              }
            </g>`,
        )}
      </svg>
    </div>`
  }
}

customElements.get('uip-smooth-funnel') || customElements.define('uip-smooth-funnel', UipSmoothFunnel)

declare global {
  interface HTMLElementTagNameMap {
    'uip-smooth-funnel': UipSmoothFunnel
  }
}

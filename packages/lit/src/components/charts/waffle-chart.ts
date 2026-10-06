import { LitElement, css, html, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { defaultTrue } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

export interface WaffleSlice {
  name: string
  value: number
  color?: string
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

/**
 * <uip-waffle-chart> — the registry WaffleChart (React `WaffleChart`): pure
 * SVG, no ECharts. Same cells, legend and classes as React.
 *
 * Like <uip-smooth-funnel> (the other pure-SVG chart) this is a standalone
 * element, not a `ChartElement`: that base lazily imports the whole ECharts
 * bundle and manages an instance, which an SVG chart would pay for and never
 * use. The shared API (`height`, `aria-label`) and helpers (`heightToStyle`,
 * `defaultTrue`) still come from the chart-element lib.
 *
 * Properties (React props): `data` ({ name, value, color? }[]; JSON
 * attribute or property), `height` (default 260), `size` (cells per side;
 * default 10), `radius` (cell corner radius; default 2), `show-legend`
 * (default true; `show-legend="false"` hides it), `colors` (default
 * var(--chart-1..5)), `aria-label` (React `ariaLabel`; default describes the
 * shares like React). React's `className` → host classes.
 */
export class UipWaffleChart extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    data: { type: Array },
    height: {},
    size: { type: Number },
    radius: { type: Number },
    showLegend: { attribute: 'show-legend', converter: defaultTrue },
    colors: { type: Array },
    accessibleLabel: { attribute: 'aria-label' },
  }

  data: WaffleSlice[] = []
  height: number | string = 260
  size = 10
  radius = 2
  showLegend = true
  colors: string[] = DEFAULT_COLORS
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'waffle-chart')
  }

  private get total() {
    return (this.data ?? []).reduce((s, d) => s + d.value, 0) || 1
  }

  private cells() {
    const data = this.data ?? []
    const total = this.total
    const n = this.size * this.size
    const counts = data.map((d) => Math.floor((d.value / total) * n))
    let rest = n - counts.reduce((s, c) => s + c, 0)
    const remainders = data.map((d, i) => ({ i, r: (d.value / total) * n - counts[i]! })).sort((a, b) => b.r - a.r)
    for (const { i } of remainders) {
      if (rest <= 0) break
      counts[i]!++
      rest--
    }
    const out: { color: string; name: string }[] = []
    data.forEach((d, i) => {
      for (let k = 0; k < counts[i]!; k++) out.push({ color: d.color ?? this.colors[i % this.colors.length]!, name: d.name })
    })
    return out.reverse()
  }

  private defaultLabel() {
    const data = this.data ?? []
    const total = this.total
    return `Waffle chart: ${data.map((d) => `${d.name} ${Math.round((d.value / total) * 100)}%`).join(', ')}`
  }

  render() {
    const data = this.data ?? []
    const total = this.total
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || this.defaultLabel()}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring flex w-full items-center justify-center gap-5 focus-visible:ring-2 focus-visible:outline-none"
    >
      <svg
        viewBox=${`0 0 ${this.size * 12} ${this.size * 12}`}
        class="aspect-square h-full max-h-full"
        role="presentation"
      >
        ${this.cells().map(
          (c, i) =>
            svg`<rect
              x=${(i % this.size) * 12 + 1}
              y=${Math.floor(i / this.size) * 12 + 1}
              width="10"
              height="10"
              rx=${this.radius}
              fill=${c.color}
            ><title>${c.name}</title></rect>`,
        )}
      </svg>
      ${this.showLegend
        ? html`<ul class="space-y-1.5 text-xs">
            ${data.map(
              (d, i) => html`<li class="flex items-center gap-2">
                <span
                  class="size-2.5 rounded-[3px]"
                  style=${styleMap({ background: d.color ?? this.colors[i % this.colors.length]! })}
                ></span>
                <span class="text-foreground font-medium">${d.name}</span>
                <span class="text-muted-foreground tabular-nums">${Math.round((d.value / total) * 100)}%</span>
              </li>`,
            )}
          </ul>`
        : null}
    </div>`
  }
}

customElements.get('uip-waffle-chart') || customElements.define('uip-waffle-chart', UipWaffleChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-waffle-chart': UipWaffleChart
  }
}

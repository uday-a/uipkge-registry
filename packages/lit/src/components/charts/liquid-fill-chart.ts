import { LitElement, css, html, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { defaultTrue } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

// SSR-safe unique clip-path id per instance (module counter, no document).
let liquidUid = 0

/**
 * <uip-liquid-fill-chart> — the registry LiquidFillChart (React
 * `LiquidFillChart`): pure SVG, no ECharts. Same waves, ring, classes and
 * centre label as React (including the SMIL wave animation).
 *
 * Like <uip-smooth-funnel> (the other pure-SVG chart) this is a standalone
 * element, not a `ChartElement`: that base lazily imports the whole ECharts
 * bundle and manages an instance, which an SVG chart would pay for and never
 * use. The shared API (`height`, `aria-label`) and helpers (`heightToStyle`,
 * `defaultTrue`) still come from the chart-element lib.
 *
 * Properties (React props): `value` (fill 0..100), `height` (default 220),
 * `color` (default var(--chart-1)), `show-label` (default true;
 * `show-label="false"` hides it), `unit` (default '%'), `aria-label`
 * (React `ariaLabel`; defaults to "Liquid fill chart at N%" like React).
 * React's `className` → host classes. Colours are CSS variables, so the
 * theme flips without any JS.
 */
export class UipLiquidFillChart extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { type: Number },
    height: {},
    color: {},
    showLabel: { attribute: 'show-label', converter: defaultTrue },
    unit: {},
    accessibleLabel: { attribute: 'aria-label' },
  }

  value = 0
  height: number | string = 220
  color = 'var(--chart-1)'
  showLabel = true
  unit = '%'
  accessibleLabel?: string
  private readonly uid = `uiplf${++liquidUid}`

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'liquid-fill-chart')
  }

  render() {
    const pct = Math.max(0, Math.min(100, this.value))
    const level = 100 - pct * 0.72
    const uid = this.uid

    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || `Liquid fill chart at ${Math.round(pct)}${this.unit}`}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring flex w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
    >
      <svg viewBox="0 0 200 200" class="aspect-square h-full max-h-full" role="presentation">
        <defs>
          <clipPath id=${uid}>
            <circle cx="100" cy="100" r="84" />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="3" class="text-border" />
        <g clip-path=${`url(#${uid})`}>
          <rect x="0" y="0" width="200" height="200" class="fill-muted/40" />
          ${svg`<path
            d=${`M 0 ${level} Q 25 ${level - 10}, 50 ${level} T 100 ${level} T 150 ${level} T 200 ${level} V 200 H 0 Z`}
            fill=${this.color}
            opacity="0.55"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-100 0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>`}
          ${svg`<path
            d=${`M 0 ${level + 6} Q 25 ${level - 4}, 50 ${level + 6} T 100 ${level + 6} T 150 ${level + 6} T 200 ${level + 6} V 200 H 0 Z`}
            fill=${this.color}
            opacity="0.85"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="-100 0"
              to="0 0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>`}
        </g>
        ${this.showLabel
          ? svg`<text
              x="100"
              y="104"
              text-anchor="middle"
              dominant-baseline="middle"
              class="fill-foreground"
              font-size="30"
              font-weight="700"
            >
              ${Math.round(pct)}${this.unit}
            </text>`
          : null}
      </svg>
    </div>`
  }
}

customElements.get('uip-liquid-fill-chart') || customElements.define('uip-liquid-fill-chart', UipLiquidFillChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-liquid-fill-chart': UipLiquidFillChart
  }
}

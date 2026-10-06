import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { heightToStyle } from './lib/chart-theme'

export interface WordDatum {
  name: string
  value: number
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

/**
 * <uip-word-cloud-chart> — the registry WordCloudChart (React
 * `WordCloudChart`): dependency-free frequency-sized words, no ECharts. Same
 * sizing, palette, classes and titles as React.
 *
 * Like <uip-segmented-gauge> (the other non-ECharts chart) this is a
 * standalone element, not a `ChartElement`: that base lazily imports the
 * whole ECharts bundle and manages an instance, which a DOM chart would pay
 * for and never use. The shared API (`height`, `aria-label`) and helper
 * (`heightToStyle`) still come from the chart-element lib.
 *
 * Properties (React props): `data` ({ name, value }[]; property or JSON
 * attribute), `height` (default 280), `colors` (default chart-1..5 tokens),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipWordCloudChart extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
      }
    `,
  ]

  static properties = {
    data: { type: Array },
    height: {},
    colors: { type: Array },
    accessibleLabel: { attribute: 'aria-label' },
  }

  data: WordDatum[] = []
  height: number | string = 280
  colors: string[] = DEFAULT_COLORS
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'word-cloud-chart')
  }

  render() {
    const data = this.data ?? []
    const colors = this.colors ?? DEFAULT_COLORS
    // Frequency sizing verbatim from React.
    const words = (() => {
      if (!data.length) return []
      const vals = data.map((d) => d.value)
      const min = Math.min(...vals)
      const max = Math.max(...vals)
      const span = Math.max(1, max - min)
      return [...data]
        .sort((a, b) => b.value - a.value)
        .map((d, i) => ({
          ...d,
          size: 14 + ((d.value - min) / span) * 30,
          color: colors[i % colors.length],
          weight: d.value === max ? 700 : d.value >= min + span * 0.66 ? 600 : 500,
          opacity: 0.55 + ((d.value - min) / span) * 0.45,
        }))
    })()
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Chart'}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full overflow-hidden focus-visible:ring-2 focus-visible:outline-none"
    >
      <div class="flex h-full w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 p-4">
        ${words.map(
          (w) =>
            html`<span
              title=${`${w.name}: ${w.value}`}
              style=${styleMap({
                fontSize: `${Math.round(w.size)}px`,
                color: w.color,
                fontWeight: String(w.weight),
                opacity: String(w.opacity),
                lineHeight: '1.15',
              })}
              class="cursor-default transition-transform duration-150 hover:scale-110"
              >${w.name}</span
            >`,
        )}
      </div>
    </div>`
  }
}

customElements.get('uip-word-cloud-chart') || customElements.define('uip-word-cloud-chart', UipWordCloudChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-word-cloud-chart': UipWordCloudChart
  }
}

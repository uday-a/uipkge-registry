import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { defaultTrue } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

export interface DistributionSlice {
  label: string
  /** Share of the whole; auto-normalised when the sum is not 100. */
  percentage: number
  value?: string | number
  color?: string
}

export interface DistributionTrend {
  value: string
  direction: 'up' | 'down'
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

/**
 * <uip-category-distribution-chart> — the registry CategoryDistributionChart
 * (React `CategoryDistributionChart`): dependency-free KPI + share bar, no
 * ECharts. Same KPI row, share bar, legend, classes and titles as React.
 *
 * Like <uip-segmented-gauge> (the other non-ECharts chart) this is a
 * standalone element, not a `ChartElement`: that base lazily imports the
 * whole ECharts bundle and manages an instance, which a DOM chart would pay
 * for and never use. The shared API (`height`, `aria-label`) and helpers
 * (`heightToStyle`, `defaultTrue`) still come from the chart-element lib.
 *
 * Properties (React props): `primary-value`, `primary-label`, `trend`
 * ({ value, direction } via property), `categories` ({ label, percentage,
 * value?, color? }[]; property or JSON attribute), `show-legend` (default
 * true; `show-legend="false"` hides it), `colors` (default chart-1..5 tokens),
 * `height` (default 220), `aria-label` (React `ariaLabel`). React's
 * `className` → host classes.
 */
export class UipCategoryDistributionChart extends LitElement {
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
    primaryValue: { attribute: 'primary-value' },
    primaryLabel: { attribute: 'primary-label' },
    trend: { type: Object },
    categories: { type: Array },
    showLegend: { attribute: 'show-legend', converter: defaultTrue },
    colors: { type: Array },
    height: {},
    accessibleLabel: { attribute: 'aria-label' },
  }

  primaryValue: string | number = ''
  primaryLabel?: string
  trend?: DistributionTrend
  categories: DistributionSlice[] = []
  showLegend = true
  colors: string[] = DEFAULT_COLORS
  height: number | string = 220
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'category-distribution-chart')
  }

  render() {
    const categories = this.categories ?? []
    const colors = this.colors ?? DEFAULT_COLORS
    const total = categories.reduce((s, c) => s + c.percentage, 0) || 1
    const slices = categories.map((c, i) => ({
      ...c,
      share: (c.percentage / total) * 100,
      color: c.color ?? colors[i % colors.length],
    }))
    // React passes focusable={false}: w-full frame, no tabindex / focus ring.
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Chart'}
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="flex w-full flex-col justify-center"
    >
      <div class="flex items-baseline gap-2">
        <span class="text-foreground text-3xl font-bold tabular-nums">${this.primaryValue}</span>
        ${
          this.trend
            ? html`<span
                class="text-xs font-semibold tabular-nums"
                style=${styleMap({ color: this.trend.direction === 'up' ? 'var(--chart-2)' : 'var(--destructive)' })}
                >${this.trend.direction === 'up' ? '+' : '−'}${this.trend.value}</span
              >`
            : null
        }
        ${this.primaryLabel ? html`<span class="text-muted-foreground text-xs">${this.primaryLabel}</span>` : null}
      </div>
      <div class="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="presentation">
        ${slices.map(
          (s) =>
            html`<div
              class="h-full"
              style=${styleMap({ width: `${s.share}%`, background: s.color })}
              title=${`${s.label} — ${Math.round(s.share)}%`}
            ></div>`,
        )}
      </div>
      ${
        this.showLegend
          ? html`<ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              ${slices.map(
                (s) =>
                  html`<li class="flex min-w-0 items-center gap-2">
                    <span class="size-2.5 shrink-0 rounded-[3px]" style=${styleMap({ background: s.color })}></span>
                    <span class="text-foreground truncate font-medium">${s.label}</span>
                    <span class="text-muted-foreground ml-auto shrink-0 tabular-nums"
                      >${s.value ?? `${Math.round(s.share)}%`}</span
                    >
                  </li>`,
              )}
            </ul>`
          : null
      }
    </div>`
  }
}

customElements.get('uip-category-distribution-chart') ||
  customElements.define('uip-category-distribution-chart', UipCategoryDistributionChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-category-distribution-chart': UipCategoryDistributionChart
  }
}

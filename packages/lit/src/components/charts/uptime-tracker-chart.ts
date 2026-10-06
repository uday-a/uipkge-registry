import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { defaultTrue } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

export type DayStatus = 'up' | 'degraded' | 'down' | 'unknown'

export interface StatusDay {
  date: string
  status: DayStatus
}

const COLORS: Record<DayStatus, string> = {
  up: 'var(--chart-2)',
  degraded: 'var(--chart-4)',
  down: 'var(--destructive)',
  unknown: 'var(--border)',
}

/**
 * <uip-uptime-tracker-chart> — the registry UptimeTrackerChart (React
 * `UptimeTrackerChart`): dependency-free status bars, no ECharts. Same bars,
 * legend, classes and computed labels as React.
 *
 * Like <uip-segmented-gauge> (the other non-ECharts chart) this is a
 * standalone element, not a `ChartElement`: that base lazily imports the
 * whole ECharts bundle and manages an instance, which a DOM chart would pay
 * for and never use. The shared API (`height`, `aria-label`) and helpers
 * (`heightToStyle`, `defaultTrue`) still come from the chart-element lib.
 *
 * Properties (React props): `days` ({ date, status }[]; property or JSON
 * attribute), `height` (default 48), `gap` (default 2), `rounded` (default 2),
 * `show-legend` (default true; `show-legend="false"` hides it), `aria-label`
 * (React `ariaLabel`, default 'Uptime tracker: …'). React's `className` →
 * host classes.
 */
export class UipUptimeTrackerChart extends LitElement {
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
    days: { type: Array },
    height: {},
    gap: { type: Number },
    rounded: { type: Number },
    showLegend: { attribute: 'show-legend', converter: defaultTrue },
    accessibleLabel: { attribute: 'aria-label' },
  }

  days: StatusDay[] = []
  height: number | string = 48
  gap = 2
  rounded = 2
  showLegend = true
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'uptime-tracker-chart')
  }

  render() {
    const days = this.days ?? []
    const uptime = days.length
      ? `${((days.filter((d) => d.status === 'up').length / days.length) * 100).toFixed(1)}%`
      : '—'
    const summary = `${days.filter((d) => d.status === 'up').length} up, ${days.filter((d) => d.status === 'degraded').length} degraded, ${days.filter((d) => d.status === 'down').length} down days`
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || `Uptime tracker: ${summary}`}
      tabindex="0"
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <div
        class="flex min-h-6 w-full items-stretch"
        style=${styleMap({ height: heightToStyle(this.height), gap: `${this.gap}px` })}
      >
        ${days.map(
          (d, i) =>
            html`<div
              class="min-w-0 flex-1"
              style=${styleMap({ background: COLORS[d.status], borderRadius: `${this.rounded}px` })}
              title=${`${d.date} — ${d.status}`}
            ></div>`,
        )}
      </div>
      ${
        this.showLegend
          ? html`<div class="mt-2 flex items-center gap-3 text-xs">
              <span class="text-foreground font-semibold tabular-nums">${uptime} uptime</span>
              <span class="text-muted-foreground">${days.length} days</span>
              <span class="ml-auto flex items-center gap-2">
                <span class="flex items-center gap-1">
                  <span class="size-2 rounded-[2px]" style=${styleMap({ background: COLORS.up })}></span>
                  Up
                </span>
                <span class="flex items-center gap-1">
                  <span class="size-2 rounded-[2px]" style=${styleMap({ background: COLORS.degraded })}></span>
                  Degraded
                </span>
                <span class="flex items-center gap-1">
                  <span class="size-2 rounded-[2px]" style=${styleMap({ background: COLORS.down })}></span>
                  Down
                </span>
              </span>
            </div>`
          : null
      }
    </div>`
  }
}

customElements.get('uip-uptime-tracker-chart') ||
  customElements.define('uip-uptime-tracker-chart', UipUptimeTrackerChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-uptime-tracker-chart': UipUptimeTrackerChart
  }
}

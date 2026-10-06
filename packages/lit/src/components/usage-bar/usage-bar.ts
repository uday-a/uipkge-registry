import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-usage-bar> — the registry UsageBar: one usage meter for billing and
 * limits. Colour follows a single threshold rule: < 70% neutral (primary),
 * 70–89% warning, >= 90% destructive.
 *
 *   <uip-usage-bar label="API calls" scope="this month" used="8420" limit="10000"></uip-usage-bar>
 *
 * Properties: `label`, `used`, `limit` (numbers), `value-text` (pre-formatted
 * "used / limit" text; defaults to locale numbers), `scope` (muted qualifier
 * next to the label, e.g. "workspace total"). The bar is a `progressbar`
 * named by `label`, with `aria-valuenow` = the clamped percentage.
 *
 * Parts: `base`, `label`, `scope`, `value`, `percent`, `track`, `indicator`
 * (the indicator also carries `data-tone`: `neutral` | `warning` | `destructive`).
 */
export class UipUsageBar extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    label: {},
    used: { type: Number },
    limit: { type: Number },
    valueText: { attribute: 'value-text' },
    scope: {},
  }

  label = ''
  used = 0
  limit = 0
  valueText?: string
  scope?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'usage-bar')
  }

  private get pct() {
    return this.limit > 0 ? Math.min(100, Math.round((this.used / this.limit) * 100)) : 0
  }

  render() {
    const pct = this.pct
    const tone = pct >= 90 ? 'destructive' : pct >= 70 ? 'warning' : 'neutral'
    const text = this.valueText ?? `${this.used.toLocaleString()} / ${this.limit.toLocaleString()}`
    return html`<div part="base" data-slot="usage-bar" class="flex flex-col gap-1.5">
      <div class="flex items-baseline justify-between gap-3 text-sm">
        <span part="label" class="font-medium">
          ${this.label}
          ${this.scope
            ? html`<span part="scope" class="text-muted-foreground ml-1 text-xs font-normal">${this.scope}</span>`
            : nothing}
        </span>
        <span part="value" class="text-muted-foreground text-xs tabular-nums">
          ${text}
          <span
            part="percent"
            class=${cn(tone === 'destructive' && 'text-destructive font-medium', tone === 'warning' && 'text-warning font-medium')}
            >(${pct}%)</span
          >
        </span>
      </div>
      <div
        part="track"
        class="bg-muted h-1.5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-label=${this.label || nothing}
        aria-valuenow=${pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          part="indicator"
          data-tone=${tone}
          class=${cn(
            'h-full rounded-full transition-[width] duration-200',
            tone === 'destructive' ? 'bg-destructive' : tone === 'warning' ? 'bg-warning' : 'bg-primary',
          )}
          style=${styleMap({ width: `${pct}%` })}
        ></div>
      </div>
    </div>`
  }
}

customElements.get('uip-usage-bar') || customElements.define('uip-usage-bar', UipUsageBar)

declare global {
  interface HTMLElementTagNameMap {
    'uip-usage-bar': UipUsageBar
  }
}

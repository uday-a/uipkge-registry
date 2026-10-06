import { LitElement, css, html } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-kpi-grid columns="2|3|4"> — React's KpiGrid: a responsive grid
 * container (`md:` 2 columns, `lg:` 2 / 3 / 4). Tiles are slotted children
 * (any markup — cards, charts, custom tiles); the <slot> is display:contents,
 * so each slotted tile is a grid item of the inner div.
 *
 * React's `className` on the grid → `part="base"`: style it from the page with
 * `class="[&::part(base)]:…"` on the host.
 */
export class UipKpiGrid extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    columns: { type: Number, reflect: true },
  }

  columns: 2 | 3 | 4 = 4

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    // React spreads props after data-slot="kpi-grid", so a consumer's data-slot wins
    // (the DashboardKpis block renders <KpiGrid data-slot="dashboard-kpis">).
    if (!this.hasAttribute('data-slot')) this.setAttribute('data-slot', 'kpi-grid')
  }

  render() {
    return html`<div
      part="base"
      class=${cn(
        'grid gap-4 md:grid-cols-2',
        this.columns === 3 ? 'lg:grid-cols-3' : this.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4',
      )}
    >
      <slot></slot>
    </div>`
  }
}

customElements.get('uip-kpi-grid') || customElements.define('uip-kpi-grid', UipKpiGrid)

declare global {
  interface HTMLElementTagNameMap {
    'uip-kpi-grid': UipKpiGrid
  }
}

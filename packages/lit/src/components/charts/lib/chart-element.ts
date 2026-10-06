import { LitElement, css, html, type PropertyDeclarations, type PropertyValues } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import type { ECharts } from 'echarts/core'
import { tailwind } from '../../../lib/styles'
import { ThemeController } from '../../../lib/theme'
import { heightToStyle, resolveChartTheme, subscribeChartTheme, type ChartTheme } from './chart-theme'

/**
 * Attribute converter for booleans whose React default is `true`
 * (`showLabels`, `autoresize`): Lit's `type: Boolean` can't be switched off
 * from markup, so `show-labels="false"` turns it off and anything else
 * (including removing the attribute) means true.
 */
export const defaultTrue = {
  fromAttribute: (v: string | null) => v !== 'false',
  toAttribute: (v: boolean) => (v ? '' : 'false'),
}

/**
 * `yField="value"` from markup, `yField=['north', 'south']` from markup as a
 * JSON array or from JS as a property.
 */
export const stringOrArray = {
  fromAttribute: (v: string | null) => (v?.trim().startsWith('[') ? (JSON.parse(v) as string[]) : v),
}

/**
 * Shared base for every ECharts-backed element — the Lit stand-in for React's
 * `ChartFrame` + `EChart` + `useChartTheme()`:
 *
 *  - renders React's ChartFrame chrome (role="img", tabindex, focus ring,
 *    `height`) with a full-size inner container for the canvas;
 *  - resolves the chart theme from the CSS tokens and re-resolves it (and
 *    re-sets the option) whenever <html> class/style/data-theme changes;
 *  - lazily `import()`s echarts in firstUpdated (SSR-safe: nothing runs on the
 *    server), resizes with a ResizeObserver and disposes on disconnect;
 *  - applies `buildOption()` with `{ notMerge: true, lazyUpdate: true }`,
 *    exactly like React's EChart.
 *
 * Subclasses implement `buildOption()` (React's `mergedOption` useMemo) and
 * set `chartSlot` (the host's data-slot). `instance` exposes the ECharts
 * instance (undefined until initialised) for getOption()/dispatchAction().
 */
export abstract class ChartElement extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties: PropertyDeclarations = {
    height: {},
    // role="img" lives on the inner frame, so the host's aria-label is forwarded.
    accessibleLabel: { attribute: 'aria-label' },
    chartTheme: { state: true },
  }

  height: number | string = 300
  accessibleLabel?: string
  protected chartTheme: ChartTheme = resolveChartTheme()
  /** Resize with the container. Only RawChart exposes it as a property. */
  protected autoresize = true

  protected abstract readonly chartSlot: string
  protected abstract buildOption(): any

  private chart?: ECharts
  private resizeObserver?: ResizeObserver
  private unsubscribeTheme?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  /** The ECharts instance, once initialised in the browser. */
  get instance(): ECharts | undefined {
    return this.chart
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', this.chartSlot)
    this.chartTheme = resolveChartTheme()
    this.unsubscribeTheme = subscribeChartTheme(() => {
      this.chartTheme = resolveChartTheme()
    })
    // Re-attached after a move: firstUpdated won't run again.
    if (this.hasUpdated) void this.initChart()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unsubscribeTheme?.()
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    this.chart?.dispose()
    this.chart = undefined
  }

  protected firstUpdated() {
    void this.initChart()
  }

  protected updated(changed: PropertyValues) {
    if (!this.chart) return
    if (changed.has('autoresize')) this.observeResize()
    this.chart.setOption(this.buildOption(), { notMerge: true, lazyUpdate: true })
  }

  private get container() {
    return this.renderRoot.querySelector<HTMLDivElement>('[data-chart]')
  }

  private async initChart() {
    const { echarts } = await import('./echarts')
    const el = this.container
    if (!this.isConnected || this.chart || !el) return
    this.chart = echarts.init(el)
    this.chart.setOption(this.buildOption(), { notMerge: true, lazyUpdate: true })
    this.observeResize()
  }

  private observeResize() {
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    const el = this.container
    if (!this.autoresize || !el) return
    this.resizeObserver = new ResizeObserver(() => this.chart?.resize())
    this.resizeObserver.observe(el)
  }

  render() {
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Chart'}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

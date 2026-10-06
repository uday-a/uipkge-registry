import { ChartElement, defaultTrue } from './lib/chart-element'

/**
 * <uip-raw-chart> — the registry RawChart (React `RawChart`): the raw
 * escape hatch. Pass a complete ECharts `option`; it is applied as-is
 * (notMerge). Every chart type / component the React wrappers register is
 * registered here too (sankey, sunburst, candlestick, graph, boxplot, …).
 *
 * Properties (React props): `option` (JSON attribute or property), `height`
 * (default 300), `autoresize` (default true; `autoresize="false"` opts out),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 * Theme helpers for weaving tokens into an option: `resolveChartTheme`,
 * `toRgba`, `mergeOptionBlock` from `./lib/chart-theme`.
 */
export class UipRawChart extends ChartElement {
  static properties = {
    option: { type: Object },
    autoresize: { converter: defaultTrue },
  }

  option: any = {}
  autoresize = true
  protected readonly chartSlot = 'raw-chart'

  protected buildOption() {
    return this.option ?? {}
  }
}

customElements.get('uip-raw-chart') || customElements.define('uip-raw-chart', UipRawChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-raw-chart': UipRawChart
  }
}

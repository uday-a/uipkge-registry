import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChartElement } from './lib/chart-element'
import { heightToStyle, mergeOptionBlock } from './lib/chart-theme'

export interface Candle {
  date: string
  open: number
  close: number
  low: number
  high: number
}

/**
 * <uip-candlestick-chart> — the registry CandlestickChart (React
 * `CandlestickChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` (Candle[] via property / JSON
 * attribute), `zoom` (bottom data-zoom slider), `height` (default 300),
 * `option` (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`). React's `className` → host classes. Like React
 * (`focusable={false}`), the frame is a bare `w-full` div without tabindex
 * or focus ring.
 */
export class UipCandlestickChart extends ChartElement {
  static properties = {
    data: { type: Array },
    zoom: { type: Boolean },
    option: { type: Object },
  }

  data: Candle[] = []
  zoom = false
  option?: any
  protected readonly chartSlot = 'candlestick-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const { zoom } = this
    // ECharts candle data shape: [open, close, low, high].
    const candleData = data.map((c) => [c.open, c.close, c.low, c.high])
    const dates = data.map((c) => c.date)

    const series = [
      {
        type: 'candlestick',
        data: candleData,
        itemStyle: {
          // Bullish (close >= open) -> teal (chart-2). Bearish -> orange (chart-4).
          color: theme.colors[1],
          color0: theme.colors[3],
          borderColor: theme.colors[1],
          borderColor0: theme.colors[3],
        },
      },
    ]

    const userOption: any = this.option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: zoom ? 60 : 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: dates,
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      dataZoom: zoom ? [{ type: 'slider', bottom: 8, height: 18 }, { type: 'inside' }] : undefined,
      series: mergedSeries,
      ...userRest,
    }
  }

  // React passes focusable={false}: bare w-full frame, no tabindex.
  render() {
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Chart'}
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="w-full"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

customElements.get('uip-candlestick-chart') || customElements.define('uip-candlestick-chart', UipCandlestickChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-candlestick-chart': UipCandlestickChart
  }
}

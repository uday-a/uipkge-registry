import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChartElement } from './lib/chart-element'
import { heightToStyle, mergeOptionBlock } from './lib/chart-theme'

export interface HACandle {
  date: string
  open: number
  close: number
  low: number
  high: number
}

/**
 * <uip-heikin-ashi-chart> — the registry HeikinAshiChart (React
 * `HeikinAshiChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` (HACandle[] via property / JSON
 * attribute), `zoom` (bottom data-zoom slider), `height` (default 300),
 * `option` (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`; defaults to "Heikin-Ashi chart"). React's `className` → host
 * classes.
 */
export class UipHeikinAshiChart extends ChartElement {
  static properties = {
    data: { type: Array },
    zoom: { type: Boolean },
    option: { type: Object },
  }

  data: HACandle[] = []
  zoom = false
  option?: any
  protected readonly chartSlot = 'heikin-ashi-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const { zoom } = this
    // Heikin-Ashi: each candle averages the previous one, filtering market
    // noise so trends read as uninterrupted bull/bear runs.
    let prevOpen = data[0]?.open ?? 0
    let prevClose = data[0]?.close ?? 0
    const ha = data.map((c) => {
      const haClose = (c.open + c.high + c.low + c.close) / 4
      const haOpen = (prevOpen + prevClose) / 2
      const haHigh = Math.max(c.high, haOpen, haClose)
      const haLow = Math.min(c.low, haOpen, haClose)
      prevOpen = haOpen
      prevClose = haClose
      return {
        date: c.date,
        open: +haOpen.toFixed(2),
        close: +haClose.toFixed(2),
        low: +haLow.toFixed(2),
        high: +haHigh.toFixed(2),
      }
    })

    const series = [
      {
        type: 'candlestick',
        data: ha.map((c) => [c.open, c.close, c.low, c.high]),
        itemStyle: {
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
          data: ha.map((c) => c.date),
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
        },
        userYAxis,
      ),
      dataZoom: zoom ? [{ type: 'slider', bottom: 8, height: 18 }, { type: 'inside' }] : undefined,
      series: mergedSeries,
      ...userRest,
    }
  }

  // React defaults ariaLabel to 'Heikin-Ashi chart'.
  render() {
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Heikin-Ashi chart'}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

customElements.get('uip-heikin-ashi-chart') || customElements.define('uip-heikin-ashi-chart', UipHeikinAshiChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-heikin-ashi-chart': UipHeikinAshiChart
  }
}

import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChartElement } from './lib/chart-element'
import { heightToStyle, mergeOptionBlock } from './lib/chart-theme'

export interface RangeDatum {
  label: string
  low: number
  high: number
}

/**
 * <uip-range-bar-chart> — the registry RangeBarChart (React `RangeBarChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` (RangeDatum[] via property / JSON
 * attribute), `orientation` ('vertical' | 'horizontal'; default 'vertical'),
 * `height` (default 300), `option` (ECharts escape hatch, merged like
 * React), `aria-label` (React `ariaLabel`; defaults to "Range bar chart").
 * React's `className` → host classes.
 */
export class UipRangeBarChart extends ChartElement {
  static properties = {
    data: { type: Array },
    orientation: {},
    option: { type: Object },
  }

  data: RangeDatum[] = []
  orientation: 'vertical' | 'horizontal' = 'vertical'
  option?: any
  protected readonly chartSlot = 'range-bar-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const horizontal = this.orientation === 'horizontal'
    const series = [
      {
        name: 'base',
        type: 'bar',
        stack: 'range',
        itemStyle: { borderColor: 'transparent', color: 'transparent' },
        emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
        data: data.map((d) => d.low),
      },
      {
        name: 'range',
        type: 'bar',
        stack: 'range',
        barMaxWidth: 30,
        itemStyle: { color: theme.colors[0], borderRadius: 5 },
        label: {
          show: true,
          position: horizontal ? 'right' : 'top',
          color: theme.textColor,
          fontSize: 10,
          formatter: (p: any) => {
            const d = data[p.dataIndex]
            return d ? `${d.low}–${d.high}` : ''
          },
        },
        data: data.map((d) => d.high - d.low),
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
    const catAxis = {
      type: 'category' as const,
      data: data.map((d) => d.label),
      axisLine: { lineStyle: { color: theme.axisColor } },
      axisLabel: { color: theme.textColor, fontSize: 11 },
      axisTick: { show: false },
    }
    const valAxis = {
      type: 'value' as const,
      splitLine: { lineStyle: { color: theme.splitLineColor } },
      axisLabel: { color: theme.textColor, fontSize: 11 },
    }
    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 32, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (ps: any[]) => {
            const d = data[ps[0]?.dataIndex]
            return d ? `${d.label}<br/>${d.low} – ${d.high}` : ''
          },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(horizontal ? valAxis : catAxis, userXAxis),
      yAxis: mergeOptionBlock(horizontal ? catAxis : valAxis, userYAxis),
      series: mergedSeries,
      ...userRest,
    }
  }

  // React defaults ariaLabel to 'Range bar chart'.
  render() {
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Range bar chart'}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

customElements.get('uip-range-bar-chart') || customElements.define('uip-range-bar-chart', UipRangeBarChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-range-bar-chart': UipRangeBarChart
  }
}

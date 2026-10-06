import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface HistogramBin {
  bin: string
  count: number
}

/**
 * <uip-histogram-chart> — the registry HistogramChart (React `HistogramChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props (same auto-binning + peak highlight).
 *
 * Properties (React props): `data` (pre-binned { bin, count }[]; property or
 * JSON attribute), `values` (raw numbers auto-binned when `data` is unset),
 * `bins` (default 12), `height` (default 300), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className` →
 * host classes.
 */
export class UipHistogramChart extends ChartElement {
  static properties = {
    data: { type: Array },
    values: { type: Array },
    bins: { type: Number },
    option: { type: Object },
  }

  data?: HistogramBin[]
  values: number[] = []
  bins = 12
  option?: any
  protected readonly chartSlot = 'histogram-chart'

  protected buildOption() {
    const theme = this.chartTheme
    // Auto-binning verbatim from React.
    const binned: HistogramBin[] = (() => {
      if (this.data?.length) return this.data
      const vals = this.values ?? []
      if (!vals.length) return []
      const min = Math.min(...vals)
      const max = Math.max(...vals)
      const span = max - min || 1
      const n = Math.max(1, this.bins)
      const counts: number[] = Array(n).fill(0)
      for (const v of vals) counts[Math.min(n - 1, Math.floor(((v - min) / span) * n))]++
      return counts.map((count, i) => ({
        bin: `${(min + (span * i) / n).toFixed(1)}–${(min + (span * (i + 1)) / n).toFixed(1)}`,
        count,
      }))
    })()

    const peak = binned.reduce((m, d, i) => (d.count > (binned[m]?.count ?? -1) ? i : m), 0)
    const series = [
      {
        type: 'bar',
        barCategoryGap: '2%',
        itemStyle: {
          color: (p: any) => (p.dataIndex === peak ? theme.colors[0] : theme.colors[2]),
          borderRadius: [3, 3, 3, 3],
        },
        data: binned.map((d) => d.count),
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
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: binned.map((d) => d.bin),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 10, rotate: 30 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-histogram-chart') || customElements.define('uip-histogram-chart', UipHistogramChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-histogram-chart': UipHistogramChart
  }
}

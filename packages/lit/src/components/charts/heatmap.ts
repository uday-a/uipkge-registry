import { ChartElement } from './lib/chart-element'

/**
 * <uip-heatmap> — the registry Heatmap (React `Heatmap`) as a web component.
 * Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` ([xIndex, yIndex, value][]; property or
 * JSON attribute), `x-labels`, `y-labels` (string[]), `min`, `max`, `height`
 * (default 300), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipHeatmap extends ChartElement {
  static properties = {
    data: { type: Array },
    xLabels: { attribute: 'x-labels', type: Array },
    yLabels: { attribute: 'y-labels', type: Array },
    min: { type: Number },
    max: { type: Number },
    option: { type: Object },
  }

  data: [number, number, number][] = []
  xLabels: string[] = []
  yLabels: string[] = []
  min?: number
  max?: number
  option?: any
  protected readonly chartSlot = 'heatmap'

  protected buildOption() {
    const theme = this.chartTheme
    const { data, xLabels, yLabels, min, max, option } = this
    const values = (data ?? []).map((d) => d[2])
    const computedMin = min ?? Math.min(...values)
    const computedMax = max ?? Math.max(...values)

    return {
      grid: { left: 16, right: 16, top: 16, bottom: 16, containLabel: true },
      tooltip: {
        position: 'top',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
        formatter: (params: any) => `${yLabels[params.value[1]]} / ${xLabels[params.value[0]]}: ${params.value[2]}`,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 11 },
        axisTick: { show: false },
      },
      visualMap: {
        min: computedMin,
        max: computedMax,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 12,
        itemHeight: 80,
        inRange: {
          color: [theme.colors[0]!, theme.colors[1]!, theme.colors[2]!],
        },
        textStyle: { fontSize: 11, color: theme.textColor },
      },
      series: (() => {
        const series = [
          {
            type: 'heatmap',
            data,
            label: { show: false },
            itemStyle: { borderRadius: 2, borderWidth: 0 },
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
            },
          },
        ]
        const userSeries = (option as any)?.series
        return Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
      })(),
      // visualMap / tooltip / axes overrides still spread on top -- strip
      // `series` so it doesn't clobber the merged result above.
      ...(() => {
        const { series: _, ...rest } = (option as any) ?? {}
        return rest
      })(),
    }
  }
}

customElements.get('uip-heatmap') || customElements.define('uip-heatmap', UipHeatmap)

declare global {
  interface HTMLElementTagNameMap {
    'uip-heatmap': UipHeatmap
  }
}

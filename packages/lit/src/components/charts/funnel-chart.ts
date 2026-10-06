import { ChartElement, defaultTrue } from './lib/chart-element'

/**
 * <uip-funnel-chart> — the registry FunnelChart (React `FunnelChart`) as a
 * web component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` ({ name, value }[]; JSON attribute or
 * property), `height` (default 300), `show-labels` (default true;
 * `show-labels="false"` hides them), `show-legend` (default false),
 * `option` (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`). React's `className` → host classes.
 */
export class UipFunnelChart extends ChartElement {
  static properties = {
    data: { type: Array },
    showLabels: { attribute: 'show-labels', converter: defaultTrue },
    showLegend: { attribute: 'show-legend', type: Boolean },
    option: { type: Object },
  }

  data: { name: string; value: number }[] = []
  showLabels = true
  showLegend = false
  option?: any
  protected readonly chartSlot = 'funnel-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { showLabels, showLegend } = this
    const series = [
      {
        type: 'funnel',
        left: '8%',
        right: '8%',
        top: 12,
        bottom: showLegend ? 32 : 12,
        sort: 'descending',
        // Keep the last stage wide enough to hold its label.
        minSize: '24%',
        maxSize: '100%',
        funnelAlign: 'center',
        gap: 2,
        label: {
          show: showLabels,
          position: 'inside',
          color: theme.surfaceColor,
          fontSize: 12,
          fontWeight: 600,
        },
        labelLine: { length: 8, lineStyle: { width: 1, type: 'solid' } },
        itemStyle: { borderWidth: 0 },
        emphasis: { label: { fontSize: 12, fontWeight: 600 } },
        data: this.data ?? [],
      },
    ]

    const userOption: any = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: showLegend
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : undefined,
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-funnel-chart') || customElements.define('uip-funnel-chart', UipFunnelChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-funnel-chart': UipFunnelChart
  }
}

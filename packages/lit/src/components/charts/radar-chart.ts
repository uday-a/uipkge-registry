import { ChartElement } from './lib/chart-element'

export interface RadarIndicator {
  name: string
  max: number
}

export interface RadarDatum {
  name: string
  value: number[]
}

/**
 * <uip-radar-chart> — the registry RadarChart (React `RadarChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `indicators` ({ name, max }[]), `data`
 * ({ name, value }[]), `height` (default 300), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className` →
 * host classes.
 */
export class UipRadarChart extends ChartElement {
  static properties = {
    indicators: { type: Array },
    data: { type: Array },
    option: { type: Object },
  }

  indicators: RadarIndicator[] = []
  data: RadarDatum[] = []
  option?: any
  protected readonly chartSlot = 'radar-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { indicators, data, option } = this
    const series = [
      {
        type: 'radar',
        data: (data ?? []).map((d, i) => ({
          ...d,
          itemStyle: { color: theme.colors[i % theme.colors.length] },
          areaStyle: { opacity: 0.15 },
          lineStyle: { width: 2 },
        })),
      },
    ]

    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11 },
      },
      radar: {
        indicator: indicators,
        radius: '60%',
        center: ['50%', '45%'],
        axisName: { fontSize: 11 },
        splitArea: { areaStyle: { color: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)'] } },
      },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-radar-chart') || customElements.define('uip-radar-chart', UipRadarChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-radar-chart': UipRadarChart
  }
}

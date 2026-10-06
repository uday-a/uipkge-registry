import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

function jitter(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return (x - Math.floor(x) - 0.5) * 0.72
}

/**
 * <uip-beeswarm-chart> — the registry BeeswarmChart (React `BeeswarmChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `value-field` (default 'value'), `group-field` (default 'group'),
 * `height` (default 300), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipBeeswarmChart extends ChartElement {
  static properties = {
    data: { type: Array },
    valueField: { attribute: 'value-field' },
    groupField: { attribute: 'group-field' },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  valueField = 'value'
  groupField = 'group'
  option?: any
  protected readonly chartSlot = 'beeswarm-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const { valueField, groupField } = this
    const groups = [...new Set(data.map((d) => String(d[groupField])))]
    const series = groups.map((g, gi) => ({
      name: g,
      type: 'scatter',
      symbolSize: 9,
      itemStyle: { color: theme.colors[gi % theme.colors.length], opacity: 0.8 },
      data: data
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => String(d[groupField]) === g)
        .map(({ d, i }) => [d[valueField], gi + jitter(i, gi)]),
    }))
    const userOption: any = this.option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    return {
      color: theme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: groups.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend:
        groups.length > 1
          ? mergeOptionBlock(
              {
                bottom: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { fontSize: 11, color: theme.textColor },
              },
              userLegend,
            )
          : undefined,
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: theme.axisColor } },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          min: -0.6,
          max: groups.length - 0.4,
          interval: 1,
          axisLabel: { color: theme.textColor, fontSize: 11, formatter: (v: number) => groups[Math.round(v)] ?? '' },
          splitLine: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-beeswarm-chart') || customElements.define('uip-beeswarm-chart', UipBeeswarmChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-beeswarm-chart': UipBeeswarmChart
  }
}

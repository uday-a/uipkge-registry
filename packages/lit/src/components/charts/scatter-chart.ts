import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-scatter-chart> — the registry ScatterChart (React `ScatterChart`) as
 * a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-field` (default 'y'), `size-field`,
 * `category-field`, `height` (default 300), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className`
 * → host classes.
 */
export class UipScatterChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yField: { attribute: 'y-field' },
    sizeField: { attribute: 'size-field' },
    categoryField: { attribute: 'category-field' },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yField = 'y'
  sizeField?: string
  categoryField?: string
  option?: any
  protected readonly chartSlot = 'scatter-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yField, sizeField, categoryField } = this
    const data = this.data ?? []
    const categories = categoryField ? [...new Set(data.map((d) => d[categoryField]))] : ['default']

    const series = categories.map((cat, i) => ({
      name: cat,
      type: 'scatter',
      symbolSize: (val: any[]) => (sizeField ? Math.sqrt(val[2]) * 3 + 4 : 10),
      itemStyle: { color: theme.colors[i % theme.colors.length] },
      data: categoryField
        ? data
            .filter((d) => d[categoryField] === cat)
            .map((d) => [d[xField], d[yField], sizeField ? d[sizeField] : 0])
        : data.map((d) => [d[xField], d[yField], sizeField ? d[sizeField] : 0]),
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
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    const baseLegend =
      categories.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : undefined

    return {
      color: theme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: categories.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (params: any) =>
            `${params.seriesName}<br/>${xField}: ${params.value[0]}<br/>${yField}: ${params.value[1]}`,
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend ?? {}, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisTick: { show: false },
          scale: true,
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-scatter-chart') || customElements.define('uip-scatter-chart', UipScatterChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-scatter-chart': UipScatterChart
  }
}

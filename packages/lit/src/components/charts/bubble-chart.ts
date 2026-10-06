import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-bubble-chart> — the registry BubbleChart (React `BubbleChart`) as a
 * web component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-field` (default 'y'), `size-field` (default
 * 'size'), `category-field`, `opacity` (default 0.75), `min-size` (default
 * 8), `max-size` (default 42), `height` (default 300), `option` (ECharts
 * escape hatch, merged like React), `aria-label` (React `ariaLabel`).
 * React's `className` → host classes.
 */
export class UipBubbleChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yField: { attribute: 'y-field' },
    sizeField: { attribute: 'size-field' },
    categoryField: { attribute: 'category-field' },
    opacity: { type: Number },
    minSize: { attribute: 'min-size', type: Number },
    maxSize: { attribute: 'max-size', type: Number },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yField = 'y'
  sizeField = 'size'
  categoryField?: string
  opacity = 0.75
  minSize = 8
  maxSize = 42
  option?: any
  protected readonly chartSlot = 'bubble-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yField, sizeField, categoryField, opacity, minSize, maxSize } = this
    const data = this.data ?? []
    const cats = categoryField ? [...new Set(data.map((d) => String(d[categoryField])))] : ['default']
    const maxSizeVal = Math.max(...data.map((d) => +d[sizeField] || 0), 1)
    const scale = (v: number) => minSize + Math.sqrt(v / maxSizeVal) * (maxSize - minSize)
    const series = cats.map((cat, i) => ({
      name: String(cat),
      type: 'scatter',
      symbolSize: (val: any[]) => scale(val[2]),
      itemStyle: { color: theme.colors[i % theme.colors.length], opacity },
      data: (categoryField ? data.filter((d) => String(d[categoryField]) === cat) : data).map((d) => [
        d[xField],
        d[yField],
        +d[sizeField] || 0,
        d,
      ]),
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
    return {
      color: theme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: cats.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (p: any) =>
            `${p.seriesName}<br/>${xField}: ${p.value[0]}<br/>${yField}: ${p.value[1]}<br/>${sizeField}: ${p.value[2]}`,
        },
        userTooltip,
      ),
      legend:
        cats.length > 1
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
          scale: true,
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

customElements.get('uip-bubble-chart') || customElements.define('uip-bubble-chart', UipBubbleChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-bubble-chart': UipBubbleChart
  }
}

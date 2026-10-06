import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface ChordNode {
  name: string
}

export interface ChordLink {
  source: string
  target: string
  value: number
}

/**
 * <uip-chord-chart> — the registry ChordChart (React `ChordChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `nodes` ({ name }[]), `links`
 * ({ source, target, value }[]), `height` (default 380), `option` (ECharts
 * escape hatch, merged like React), `aria-label` (React `ariaLabel`).
 * React's `className` → host classes.
 */
export class UipChordChart extends ChartElement {
  static properties = {
    nodes: { type: Array },
    links: { type: Array },
    option: { type: Object },
  }

  nodes: ChordNode[] = []
  links: ChordLink[] = []
  option?: any
  height: number | string = 380
  protected readonly chartSlot = 'chord-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { nodes, links, option } = this
    const series = [
      {
        type: 'chord',
        data: nodes,
        links,
        padAngle: 4,
        minAngle: 3,
        label: { color: theme.textColor, fontSize: 11 },
        lineStyle: { opacity: 0.5 },
        emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.9 } },
      },
    ]
    const userOption: any = option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: theme.colors,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: theme.textColor },
        },
        userLegend,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-chord-chart') || customElements.define('uip-chord-chart', UipChordChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-chord-chart': UipChordChart
  }
}

import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChartElement, defaultTrue } from './lib/chart-element'
import { heightToStyle, mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-donut-chart> — the registry DonutChart (React `DonutChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` ({ name, value }[]; JSON attribute or
 * property), `type` ('full' or 'half'; default 'full'), `thickness`
 * (default 0.32), `rounded` (default 6), `gap` (default 2), `show-total`
 * (default true; `show-total="false"` hides the centre total),
 * `center-label`, `height` (default 300), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`; defaults to
 * "Donut chart, total N" like React). React's `className` → host classes.
 */
export class UipDonutChart extends ChartElement {
  static properties = {
    data: { type: Array },
    type: {},
    thickness: { type: Number },
    rounded: { type: Number },
    gap: { type: Number },
    showTotal: { attribute: 'show-total', converter: defaultTrue },
    centerLabel: { attribute: 'center-label' },
    option: { type: Object },
  }

  data: { name: string; value: number }[] = []
  type: 'full' | 'half' = 'full'
  thickness = 0.32
  rounded = 6
  gap = 2
  showTotal = true
  centerLabel?: string
  option?: any
  protected readonly chartSlot = 'donut-chart'

  private total() {
    return (this.data ?? []).reduce((s, d) => s + d.value, 0)
  }

  protected buildOption() {
    const theme = this.chartTheme
    const { type, thickness, rounded, gap, showTotal, centerLabel } = this
    const data = this.data ?? []
    const total = this.total()
    const summary = centerLabel ?? String(total)

    const half = type === 'half'
    const outer = half ? 82 : 78
    const inner = Math.max(0, +(outer * (1 - Math.max(0, Math.min(0.95, thickness)))).toFixed(1))
    const series = [
      {
        type: 'pie',
        radius: [`${inner}%`, `${outer}%`],
        center: half ? ['50%', '68%'] : ['50%', '46%'],
        startAngle: half ? 180 : 90,
        endAngle: half ? 360 : undefined,
        padAngle: gap,
        itemStyle: { borderRadius: rounded, borderColor: theme.tooltipBg, borderWidth: 2 },
        label: { show: !half, color: theme.textColor, fontSize: 11 },
        labelLine: { show: !half, lineStyle: { color: theme.textColor } },
        emphasis: { scale: true, scaleSize: 3 },
        data,
      },
    ]
    const userOption: any = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, title: userTitle, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: theme.colors,
      title: showTotal
        ? mergeOptionBlock(
            {
              text: summary,
              left: 'center',
              top: half ? '62%' : '42%',
              textStyle: { fontSize: 26, fontWeight: 700, color: theme.textColor },
            },
            userTitle,
          )
        : undefined,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          valueFormatter: (v: any) => `${v} (${((v / (total || 1)) * 100).toFixed(1)}%)`,
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

  // React defaults ariaLabel to `Donut chart, total ${total}`; ChartElement's
  // render only knows the generic 'Chart', so mirror React's default here.
  render() {
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || `Donut chart, total ${this.total()}`}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

customElements.get('uip-donut-chart') || customElements.define('uip-donut-chart', UipDonutChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-donut-chart': UipDonutChart
  }
}

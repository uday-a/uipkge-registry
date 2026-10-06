import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-theme-river> — the registry ThemeRiver (React `ThemeRiver`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` ([time, value, series][]; property or JSON
 * attribute), `height` (default 320), `option` (ECharts escape hatch, merged
 * like React), `aria-label` (React `ariaLabel`). React's `className` → host
 * classes.
 */
export class UipThemeRiver extends ChartElement {
  static properties = {
    data: { type: Array },
    option: { type: Object },
  }

  data: [string | number, number, string][] = []
  option?: any
  height: number | string = 320
  protected readonly chartSlot = 'theme-river'

  protected buildOption() {
    const theme = this.chartTheme
    const { data, option } = this
    const series = [
      {
        type: 'themeRiver',
        data,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' } },
      },
    ]

    const userOption: any = option ?? {}
    const {
      series: userSeries,
      singleAxis: userSingleAxis,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'line', lineStyle: { color: theme.axisColor, opacity: 0.8 } },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend:
        userLegend?.show === false
          ? undefined
          : mergeOptionBlock(
              {
                bottom: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { fontSize: 11, color: theme.textColor },
              },
              userLegend,
            ),
      singleAxis: mergeOptionBlock(
        {
          top: 12,
          bottom: 40,
          type: 'time',
          axisTick: { show: false },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: theme.axisColor } },
        },
        userSingleAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-theme-river') || customElements.define('uip-theme-river', UipThemeRiver)

declare global {
  interface HTMLElementTagNameMap {
    'uip-theme-river': UipThemeRiver
  }
}

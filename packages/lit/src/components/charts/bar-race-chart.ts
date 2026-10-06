import { html, type PropertyValues } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChartElement, defaultTrue } from './lib/chart-element'
import { heightToStyle, mergeOptionBlock } from './lib/chart-theme'

export interface RaceFrame {
  /** Frame caption, e.g. a year. */
  label: string
  values: { category: string; value: number }[]
}

/**
 * <uip-bar-race-chart> — the registry BarRaceChart (React `BarRaceChart`) as
 * a web component. Builds the same ECharts option as React for the same
 * props, auto-advancing frames on React's timer.
 *
 * Properties (React props): `frames` (RaceFrame[] via property / JSON
 * attribute), `top-n` (default 8), `auto-play` (default true;
 * `auto-play="false"` to freeze), `interval` ms per frame (default 1400),
 * `height` (default 300), `option` (ECharts escape hatch, merged like
 * React), `aria-label` (React `ariaLabel`; defaults to
 * "Bar race chart, frame <label>"). React's `className` → host classes.
 */
export class UipBarRaceChart extends ChartElement {
  static properties = {
    frames: { type: Array },
    topN: { attribute: 'top-n', type: Number },
    autoPlay: { attribute: 'auto-play', type: Boolean, converter: defaultTrue },
    interval: { type: Number },
    option: { type: Object },
    cursor: { state: true },
  }

  frames: RaceFrame[] = []
  topN = 8
  autoPlay = true
  interval = 1400
  option?: any
  protected cursor = 0
  protected readonly chartSlot = 'bar-race-chart'

  private timer?: ReturnType<typeof setInterval>

  connectedCallback() {
    super.connectedCallback()
    this.startRace()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.stopRace()
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed)
    if (changed.has('autoPlay') || changed.has('interval') || changed.has('frames')) this.startRace()
  }

  private startRace() {
    this.stopRace()
    const frames = this.frames ?? []
    if (!this.autoPlay || frames.length < 2) return
    this.timer = setInterval(() => {
      this.cursor = (this.cursor + 1) % frames.length
    }, this.interval)
  }

  private stopRace() {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = undefined
  }

  protected buildOption() {
    const theme = this.chartTheme
    const { topN } = this
    const frames = this.frames ?? []
    const frame = frames[Math.min(this.cursor, frames.length - 1)] ?? { label: '', values: [] }
    const rows = [...frame.values]
      .sort((a, b) => b.value - a.value)
      .slice(0, topN)
      .reverse()
    const max = Math.max(...rows.map((r) => r.value), 1)
    const series = [
      {
        type: 'bar',
        barWidth: 16,
        realtimeSort: true,
        itemStyle: { color: theme.colors[0], borderRadius: [6, 6, 6, 6] },
        label: { show: true, position: 'right', color: theme.textColor, fontSize: 11, fontWeight: 600 },
        data: rows.map((r) => r.value),
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
      animationDurationUpdate: 900,
      animationEasingUpdate: 'quinticInOut',
      graphic: {
        elements: [
          {
            type: 'text',
            right: 16,
            bottom: 8,
            style: { text: frame.label, fontSize: 44, fontWeight: 800, fill: theme.axisColor },
          },
        ],
      },
      grid: mergeOptionBlock({ left: 16, right: 64, top: 16, bottom: 24, containLabel: true }, userGrid),
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
          type: 'value',
          max: max * 1.25,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: rows.map((r) => r.category),
          axisLine: { show: false },
          axisLabel: { color: theme.textColor, fontSize: 11, fontWeight: 600 },
          axisTick: { show: false },
          animationDuration: 300,
          animationDurationUpdate: 300,
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  // React defaults ariaLabel to `Bar race chart, frame <label>`.
  render() {
    const frames = this.frames ?? []
    const frame = frames[Math.min(this.cursor, frames.length - 1)] ?? { label: '' }
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || `Bar race chart, frame ${frame.label}`}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

customElements.get('uip-bar-race-chart') || customElements.define('uip-bar-race-chart', UipBarRaceChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-bar-race-chart': UipBarRaceChart
  }
}

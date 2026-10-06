import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChartElement } from './lib/chart-element'
import { heightToStyle, mergeOptionBlock } from './lib/chart-theme'

export interface IcicleNode {
  name: string
  value?: number
  children?: IcicleNode[]
}

interface FlatNode {
  x0: number
  x1: number
  depth: number
  name: string
  value: number
  color: number
}

// Partition layout: each level fills 0..100, children subdivide their
// parent proportionally (equal shares when values are absent). Apache
// ECharts has no icicle series, so this renders one custom rect per node.
// Verbatim from React's IcicleChart.
function flatten(root: IcicleNode): FlatNode[] {
  const out: FlatNode[] = []
  const walk = (node: IcicleNode, x0: number, x1: number, depth: number, color: number) => {
    if (!node || typeof node !== 'object') return
    const kids = node.children ?? []
    const value =
      node.value ?? kids.reduce((s, k) => s + (k.value ?? k.children?.reduce((a, c) => a + (c.value ?? 0), 0) ?? 0), 0)
    out.push({ x0, x1, depth, name: node.name, value, color })
    if (!kids.length) return
    const total = kids.reduce((s, k) => s + (k.value ?? 0), 0)
    let x = x0
    kids.forEach((k, i) => {
      const w = total > 0 ? ((k.value ?? 0) / total) * (x1 - x0) : (x1 - x0) / kids.length
      walk(k, x, x + w, depth + 1, depth === 0 ? i : color)
      x += w
    })
  }
  walk(root, 0, 100, 0, 0)
  return out
}

/**
 * <uip-icicle-chart> — the registry IcicleChart (React `IcicleChart`) as a
 * web component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (root node; property or JSON attribute),
 * `height` (default 340), `option` (ECharts escape hatch, merged like
 * React), `aria-label` (React `ariaLabel`; defaults to "Icicle chart" like
 * React). React's `className` → host classes.
 */
export class UipIcicleChart extends ChartElement {
  static properties = {
    data: { type: Object },
    option: { type: Object },
  }

  data: IcicleNode = { name: '', children: [] }
  option?: any
  protected readonly chartSlot = 'icicle-chart'

  constructor() {
    super()
    this.height = 340
  }

  protected buildOption() {
    const theme = this.chartTheme
    const flat = flatten(this.data ?? { name: '', children: [] })
    const maxDepth = Math.max(...flat.map((n) => n.depth), 0)
    const grand = flat[0]?.value ?? 1
    const series = [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const n: FlatNode = flat[params.dataIndex]
          const [px0, py0] = api.coord([n.x0, n.depth + 0.08])
          const [px1, py1] = api.coord([n.x1, n.depth + 0.92])
          const wide = Math.abs(px1 - px0) > 48
          const children: any[] = [
            {
              type: 'rect',
              shape: {
                x: Math.min(px0, px1),
                y: Math.min(py0, py1),
                width: Math.max(1, Math.abs(px1 - px0)),
                height: Math.abs(py1 - py0),
                r: 3,
              },
              style: { fill: theme.colors[n.color % theme.colors.length], opacity: n.depth === 0 ? 0.35 : 0.85 },
            },
          ]
          if (wide) {
            children.push({
              type: 'text',
              style: {
                x: (px0 + px1) / 2,
                y: (py0 + py1) / 2,
                text: n.depth === 0 ? n.name : `${n.name} ${n.value}`,
                fill: n.depth === 0 ? theme.textColor : '#fff',
                fontSize: 11,
                fontWeight: n.depth === 0 ? 700 : 600,
                align: 'center',
                verticalAlign: 'middle',
                overflow: 'truncate',
                width: Math.abs(px1 - px0) - 12,
              },
            })
          }
          return { type: 'group', children }
        },
        data: flat.map((n) => [n.x0, n.depth, n.x1]),
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
      grid: mergeOptionBlock({ left: 8, right: 8, top: 12, bottom: 12, containLabel: false }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (p: any) => {
            const n: FlatNode | undefined = flat[p.dataIndex]
            return n
              ? `${n.name}<br/>${n.value.toLocaleString()} t (${((n.value / (grand || 1)) * 100).toFixed(1)}%)`
              : ''
          },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock({ type: 'value', min: 0, max: 100, show: false }, userXAxis),
      yAxis: mergeOptionBlock(
        { type: 'value', min: -0.2, max: maxDepth + 1.1, inverse: true, show: false },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  // React defaults ariaLabel to 'Icicle chart'; ChartElement's render only
  // knows the generic 'Chart', so mirror React's default here.
  render() {
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Icicle chart'}
      tabindex="0"
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

customElements.get('uip-icicle-chart') || customElements.define('uip-icicle-chart', UipIcicleChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-icicle-chart': UipIcicleChart
  }
}

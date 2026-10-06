import { isServer } from 'lit'

// Port of packages/registry-react/components/charts/useChartTheme.ts.
//
// The chart palette is driven by the design tokens (`--chart-1`..`--chart-5`,
// `--muted-foreground`, `--border`, `--popover`, …). They are resolved with
// getComputedStyle on <html> and re-resolved whenever <html> class / style /
// data-theme changes, so a light/dark flip re-colours every chart. Instead of
// React's useChartTheme() hook, elements call subscribeChartTheme().

const listeners = new Set<() => void>()
let observing = false

function bump() {
  listeners.forEach((l) => l())
}

/** Call `cb` whenever the page theme changes. Returns the unsubscribe fn. */
export function subscribeChartTheme(cb: () => void): () => void {
  listeners.add(cb)
  if (!observing && !isServer) {
    observing = true
    // Same as React: one bump on the first frame (tokens resolved after the
    // stylesheet applies), then on every <html> class/style/data-theme change.
    requestAnimationFrame(bump)
    new MutationObserver(bump).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    })
  }
  return () => listeners.delete(cb)
}

// ECharts' canvas renderer does not accept OKLCH in every browser. Assigning
// one of our Tailwind tokens to `fillStyle` can silently leave the sentinel
// colour in place, turning a whole chart black. Convert OKLCH ourselves and
// let the canvas normalize older CSS colour formats.
let _hexCanvas: CanvasRenderingContext2D | null = null

export function toCanvasColor(cssColor: string): string {
  const value = cssColor.trim()
  const match = value.match(
    /^oklch\(\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?)\s+([+-]?(?:\d+\.?\d*|\.\d+))\s+([+-]?(?:\d+\.?\d*|\.\d+))(?:deg)?(?:\s*\/\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?))?\s*\)$/i,
  )

  if (match) {
    const lightness = Number(match[1]) / (match[2] === '%' ? 100 : 1)
    const chroma = Number(match[3])
    const hue = (Number(match[4]) * Math.PI) / 180
    const alpha = match[5] == null ? 1 : Number(match[5]) / (match[6] === '%' ? 100 : 1)
    const a = chroma * Math.cos(hue)
    const b = chroma * Math.sin(hue)

    const l = Math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3)
    const m = Math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3)
    const s = Math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3)
    const linear = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
    const rgb = linear.map((channel) => {
      const encoded = channel <= 0.0031308 ? 12.92 * channel : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055
      return Math.round(Math.min(1, Math.max(0, encoded)) * 255)
    })

    return alpha < 1 ? `rgba(${rgb.join(', ')}, ${alpha})` : `rgb(${rgb.join(', ')})`
  }

  if (isServer) return cssColor
  if (!_hexCanvas) {
    _hexCanvas = document.createElement('canvas').getContext('2d')
  }
  if (!_hexCanvas) return cssColor
  _hexCanvas.fillStyle = '#010203'
  _hexCanvas.fillStyle = value
  const normalized = _hexCanvas.fillStyle as string
  return normalized === '#010203' && value.toLowerCase() !== '#010203' ? value : normalized
}

// Convert any CSS color (hex, rgb, oklch, color()) + alpha 0..1 to a
// canvas-safe rgba(r,g,b,a).
export function toRgba(cssColor: string, alpha: number): string {
  const normalized = toCanvasColor(cssColor)
  if (normalized.startsWith('#') && normalized.length === 7) {
    const r = parseInt(normalized.slice(1, 3), 16)
    const g = parseInt(normalized.slice(3, 5), 16)
    const b = parseInt(normalized.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  if (normalized.startsWith('rgba(')) {
    return normalized.replace(/,\s*[\d.]+\s*\)$/, `,${alpha})`)
  }
  if (normalized.startsWith('rgb(')) {
    return normalized.replace(/^rgb\(/, 'rgba(').replace(/\)$/, `,${alpha})`)
  }
  return cssColor
}

export function resolveVar(name: string, fallback: string): string {
  if (isServer) return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!v) return fallback
  return toCanvasColor(v)
}

// SSR / pre-hydration fallback palette (same values as React).
const CHART_FALLBACK = ['#f59e0b', '#14b8a6', '#3b82f6', '#f97316', '#eab308']

/** The resolved chart theme tokens. All values are canvas-safe hex/rgba. */
export interface ChartTheme {
  colors: string[]
  textColor: string
  axisColor: string
  splitLineColor: string
  tooltipBg: string
  tooltipBorder: string
  tooltipText: string
  bgColor: string
  accentColor: string
  dangerColor: string
  /** `--card`: cell borders and inside-label text, so they read as gaps /
   *  contrast on light and dark surfaces (never '#fff'). */
  surfaceColor: string
  /** `--foreground`: primary numbers drawn on the canvas (gauge value). */
  foregroundColor: string
  /** Gauge stoplight from the status tokens, same rule as <uip-usage-bar>:
   *  < 70% success, 70-89% warning, >= 90% destructive. */
  semanticGaugeThresholds: [number, string][]
}

export function resolveChartTheme(): ChartTheme {
  return {
    colors: Array.from({ length: 5 }, (_, i) => resolveVar(`--chart-${i + 1}`, CHART_FALLBACK[i]!)),
    textColor: resolveVar('--muted-foreground', '#888888'),
    axisColor: resolveVar('--border', '#e5e5e5'),
    splitLineColor: resolveVar('--border', '#f0f0f0'),
    tooltipBg: resolveVar('--popover', 'rgba(255,255,255,0.96)'),
    tooltipBorder: resolveVar('--border', '#e5e5e5'),
    tooltipText: resolveVar('--popover-foreground', '#333333'),
    bgColor: resolveVar('--card', resolveVar('--background', '#ffffff')),
    accentColor: resolveVar('--primary', '#38bdf8'),
    dangerColor: resolveVar('--destructive', '#dc2626'),
    surfaceColor: resolveVar('--card', '#ffffff'),
    foregroundColor: resolveVar('--foreground', '#171717'),
    semanticGaugeThresholds: [
      [0.7, resolveVar('--success', '#14b8a6')],
      [0.9, resolveVar('--warning', '#f59e0b')],
      [1, resolveVar('--destructive', '#dc2626')],
    ],
  }
}

// Two-level deep merge for ECharts option blocks (verbatim from React): top-level
// keys merge shallowly, and one nested level (axisLabel, splitLine, …) merges
// shallowly too. Arrays + primitives replace outright — including a whole
// block given as an array (e.g. `xAxis: [a, b]` for two axes).
export function mergeOptionBlock<T extends Record<string, any>>(base: T, user: Partial<T> | undefined): T {
  if (!user) return base
  if (Array.isArray(user)) return user as unknown as T
  const out: any = { ...base }
  for (const k of Object.keys(user)) {
    const bv = (base as any)[k]
    const uv = (user as any)[k]
    if (
      bv != null &&
      uv != null &&
      typeof bv === 'object' &&
      typeof uv === 'object' &&
      !Array.isArray(bv) &&
      !Array.isArray(uv)
    ) {
      out[k] = { ...bv, ...uv }
    } else {
      out[k] = uv
    }
  }
  return out
}

/** `height` prop → CSS: bare digits are px, anything else is raw CSS. */
export function heightToStyle(height: number | string): string {
  return /^\d+$/.test(String(height)) ? `${height}px` : String(height)
}

// Self-contained chart theme helpers (the Vue twin reads these from the shared
// `components/ui/charts/useChartTheme.ts`; each Svelte chart ships its own copy
// so the install unit stays dependency-free apart from `echarts`).
//
// The palette is driven by Tailwind v4 CSS variables (`--chart-1..5`,
// `--muted-foreground`, `--border`, `--popover`, etc.) so dark/light flips
// happen automatically when the consumer toggles their theme class. Values
// resolve at runtime via `getComputedStyle`. The component bumps a local
// `themeKey` whenever `<html>` class/style changes so its derived option
// re-resolves and the chart re-paints.

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

  if (typeof document === 'undefined') return cssColor
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
// canvas-safe rgba(r,g,b,a). `colorString + '40'` (8-digit hex alpha)
// only works when `colorString` is `#rrggbb`; once tokens resolve to
// oklch() post-hydration the gradient stops break and the canvas paint
// throws every frame. Stay defensive and always return rgba.
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
  // Canvas refused to parse this color -- ship the original string and
  // let ECharts complain (better than crashing the paint loop).
  return cssColor
}

function resolveVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!v) return fallback
  return toCanvasColor(v)
}

// SSR / pre-hydration fallback palette. Hex values picked to roughly
// match the shadcn Neutral defaults in `tailwind.css` so the first paint
// doesn't flicker.
const CHART_FALLBACK = ['#f59e0b', '#14b8a6', '#3b82f6', '#f97316', '#eab308']

export function getChartColors(): string[] {
  return Array.from({ length: 5 }, (_, i) => resolveVar(`--chart-${i + 1}`, CHART_FALLBACK[i]!))
}

export function getChartTextColor(): string {
  return resolveVar('--muted-foreground', '#888888')
}

export function getChartAxisColor(): string {
  return resolveVar('--border', '#e5e5e5')
}

export function getChartTooltipBg(): string {
  return resolveVar('--popover', 'rgba(255,255,255,0.96)')
}

export function getChartTooltipBorder(): string {
  return resolveVar('--border', '#e5e5e5')
}

export function getChartTooltipText(): string {
  return resolveVar('--popover-foreground', '#333333')
}

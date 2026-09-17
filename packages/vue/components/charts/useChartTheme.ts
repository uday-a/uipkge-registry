import { computed, ref, type ComputedRef } from "vue";

// Chart palette is driven by Tailwind v4 CSS variables (`--chart-1`..`--chart-5`,
// `--muted-foreground`, `--border`, `--popover`, etc.) so dark/light flips
// happen automatically when the consumer toggles their theme class. The
// values resolve at runtime via `getComputedStyle`, so they pick up whatever
// the consumer set in their own `tailwind.css` -- no fork required.
//
// We bump `themeKey` whenever `<html>` class/style changes (the typical
// shadcn dark-mode pivot) so every consuming `computed` re-resolves and
// downstream ECharts options re-paint.

const themeKey = ref(0);

if (typeof window !== "undefined") {
  // Bump once on the first paint so post-hydration getComputedStyle reads
  // the *resolved* CSS values (during SSR-built bundles the very first
  // computed pass returns the fallbacks below).
  requestAnimationFrame(() => themeKey.value++);
  new MutationObserver(() => themeKey.value++).observe(
    document.documentElement,
    {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    },
  );
}

// ECharts' canvas renderer does not accept OKLCH in every browser. Assigning
// one of our Tailwind tokens to `fillStyle` can silently leave the sentinel
// colour in place, turning a whole chart black. Convert OKLCH ourselves and
// let the canvas normalize older CSS colour formats.
let _hexCanvas: CanvasRenderingContext2D | null = null;

export function toCanvasColor(cssColor: string): string {
  const value = cssColor.trim();
  const match = value.match(
    /^oklch\(\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?)\s+([+-]?(?:\d+\.?\d*|\.\d+))\s+([+-]?(?:\d+\.?\d*|\.\d+))(?:deg)?(?:\s*\/\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?))?\s*\)$/i,
  );

  if (match) {
    const lightness = Number(match[1]) / (match[2] === "%" ? 100 : 1);
    const chroma = Number(match[3]);
    const hue = (Number(match[4]) * Math.PI) / 180;
    const alpha =
      match[5] == null ? 1 : Number(match[5]) / (match[6] === "%" ? 100 : 1);
    const a = chroma * Math.cos(hue);
    const b = chroma * Math.sin(hue);

    const l = Math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = Math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = Math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3);
    const linear = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
    const rgb = linear.map((channel) => {
      const encoded =
        channel <= 0.0031308
          ? 12.92 * channel
          : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
      return Math.round(Math.min(1, Math.max(0, encoded)) * 255);
    });

    return alpha < 1
      ? `rgba(${rgb.join(", ")}, ${alpha})`
      : `rgb(${rgb.join(", ")})`;
  }

  if (typeof document === "undefined") return cssColor;
  if (!_hexCanvas) {
    _hexCanvas = document.createElement("canvas").getContext("2d");
  }
  if (!_hexCanvas) return cssColor;
  _hexCanvas.fillStyle = "#010203";
  _hexCanvas.fillStyle = value;
  const normalized = _hexCanvas.fillStyle as string;
  return normalized === "#010203" && value.toLowerCase() !== "#010203"
    ? value
    : normalized;
}

// Convert any CSS color (hex, rgb, oklch, color()) + alpha 0..1 to a
// canvas-safe rgba(r,g,b,a). `colorString + '40'` (8-digit hex alpha)
// only works when `colorString` is `#rrggbb`; once tokens resolve to
// oklch() post-hydration the gradient stops break and the canvas paint
// throws every frame. Stay defensive and always return rgba.
export function toRgba(cssColor: string, alpha: number): string {
  const normalized = toCanvasColor(cssColor);
  if (normalized.startsWith("#") && normalized.length === 7) {
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (normalized.startsWith("rgba(")) {
    return normalized.replace(/,\s*[\d.]+\s*\)$/, `,${alpha})`);
  }
  if (normalized.startsWith("rgb(")) {
    return normalized.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${alpha})`);
  }
  // Canvas refused to parse this color -- ship the original string and
  // let ECharts complain (better than crashing the paint loop).
  return cssColor;
}

function resolveVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!v) return fallback;
  return toCanvasColor(v);
}

// SSR / pre-hydration fallback palette. Hex values picked to roughly
// match the shadcn Neutral defaults in `tailwind.css` so the first paint
// doesn't flicker.
const CHART_FALLBACK = ["#f59e0b", "#14b8a6", "#3b82f6", "#f97316", "#eab308"];

export const chartColors: ComputedRef<string[]> = computed(() => {
  themeKey.value;
  return Array.from({ length: 5 }, (_, i) =>
    resolveVar(`--chart-${i + 1}`, CHART_FALLBACK[i]!),
  );
});

export const chartTextColor: ComputedRef<string> = computed(() => {
  themeKey.value;
  return resolveVar("--muted-foreground", "#888888");
});

export const chartAxisColor: ComputedRef<string> = computed(() => {
  themeKey.value;
  return resolveVar("--border", "#e5e5e5");
});

export const chartSplitLineColor: ComputedRef<string> = computed(() => {
  themeKey.value;
  return resolveVar("--border", "#f0f0f0");
});

export const chartTooltipBg: ComputedRef<string> = computed(() => {
  themeKey.value;
  return resolveVar("--popover", "rgba(255,255,255,0.96)");
});

export const chartTooltipBorder: ComputedRef<string> = computed(() => {
  themeKey.value;
  return resolveVar("--border", "#e5e5e5");
});

export const chartTooltipText: ComputedRef<string> = computed(() => {
  themeKey.value;
  return resolveVar("--popover-foreground", "#333333");
});

export const chartBgColor: ComputedRef<string> = computed(() => {
  themeKey.value;
  return resolveVar("--card", resolveVar("--background", "#ffffff"));
});

// Two-level deep merge for ECharts option blocks (xAxis, yAxis, grid,
// tooltip, legend, singleAxis, parallel, etc.). The top-level keys merge
// shallowly, but one nested level (axisLabel, axisLine, splitLine, etc.)
// merges shallowly too so a consumer passing `xAxis: { axisLabel: { fontSize: 9 } }`
// doesn't blow away the wrapper's `color` + base font defaults on the same
// axisLabel block. Arrays + primitives replace outright.
//
// This is the merge strategy the chart wrappers use to fold `props.option`
// onto their computed base option without forcing consumers to spell out
// every default they want to preserve.
export function mergeOptionBlock<T extends Record<string, any>>(
  base: T,
  user: Partial<T> | undefined,
): T {
  if (!user) return base;
  const out: any = { ...base };
  for (const k of Object.keys(user)) {
    const bv = (base as any)[k];
    const uv = (user as any)[k];
    if (
      bv != null &&
      uv != null &&
      typeof bv === "object" &&
      typeof uv === "object" &&
      !Array.isArray(bv) &&
      !Array.isArray(uv)
    ) {
      out[k] = { ...bv, ...uv };
    } else {
      out[k] = uv;
    }
  }
  return out;
}

// Default gauge stoplight: teal (safe) -> amber (warning) -> red (danger).
// Pulled off saturated green and onto teal so the gauge ties back to the
// dashboard palette; red is kept as the universal "limit reached" cue.
// GaugeChart consumes this via its `thresholds` prop default; consumers
// pass their own array to override. Static because gauges have semantic
// meaning (green safe / red danger) that we deliberately don't theme-flip.
export const gaugeThresholds: [number, string][] = [
  [0.6, "#14b8a6"],
  [0.85, "#f59e0b"],
  [1, "#dc2626"],
];

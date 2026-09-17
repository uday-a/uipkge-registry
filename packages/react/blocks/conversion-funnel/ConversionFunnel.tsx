/**
 * Conversion funnel: SmoothFunnel chart with count strip above and
 * stage-name + retention-from-previous strip below.
 *
 * Works for any drop-off flow with 3-6 stages: hiring (applied ->
 * hired), e-commerce (sessions -> purchases), onboarding (signed up
 * -> activated), etc. Reads as a single horizontal "flow":
 *
 *   72K        38.2K       16.8K       5.6K
 *   ╔══════╗╔════════╗╔══════════╗╔══════════╗
 *   ║ 100% ║║  53%   ║║   23%    ║║    8%    ║
 *   ╚══════╝╚════════╝╚══════════╝╚══════════╝
 *   Views      Cart        Checkout    Purchase
 *              -> 53%       -> 44%      -> 33%
 *
 * The middle pill (inside each band) shows the share OF THE TOP
 * stage (100%, 53%, 23%, ...). The bottom retention number shows the
 * stage-to-stage conversion -- usually the more actionable signal.
 */
import * as React from 'react'
import { cn } from '@/lib/utils'
import { SmoothFunnel } from '@/components/ui/charts/smooth-funnel'

interface Stage {
  name: string
  value: number
}

export interface ConversionFunnelProps {
  data: Stage[]
  /** SmoothFunnel container height. Defaults to 180. */
  height?: number | string
  /** Override colour palette. Defaults to the registry's chart-1..N
   *  OKLCH tokens via CSS variables (so light/dark + theme-customizer
   *  flips ripple through without any JS). Pass a literal hex array to
   *  override. */
  colors?: string[]
  /** Compact number formatter for the count strip (default toLocaleString). */
  format?: (n: number) => string
  /** Hide the retention-from-previous footer on each non-first stage. */
  hideRetention?: boolean
  className?: string
}

const DEFAULT_PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-1)',
]

export function ConversionFunnel({
  data,
  height = 180,
  colors,
  format,
  hideRetention = false,
  className,
}: ConversionFunnelProps) {
  const palette = colors ?? DEFAULT_PALETTE
  const fmt = (v: number) => (format ? format(v) : v.toLocaleString())
  const retention = (i: number) => {
    if (i === 0) return null
    const prev = data[i - 1]?.value ?? 1
    return Math.round((data[i]!.value / prev) * 100)
  }

  return (
    <div data-uipkge="" data-slot="conversion-funnel" className={cn('space-y-2', className)}>
      {/* Top: per-stage count */}
      <div className="grid px-2 text-center" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((stage) => (
          <div key={`top-${stage.name}`} className="text-foreground text-base font-bold tabular-nums">
            {fmt(stage.value)}
          </div>
        ))}
      </div>

      {/* Funnel SVG */}
      <SmoothFunnel data={data} height={height} colors={palette} />

      {/* Bottom: stage name + retention from previous */}
      <div className="grid px-2 text-center" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((stage, i) => (
          <div key={`bot-${stage.name}`} className="space-y-0.5">
            <p className="text-muted-foreground text-xs">{stage.name}</p>
            {!hideRetention && retention(i) !== null && (
              <p className="text-info text-xs font-semibold tabular-nums">→ {retention(i)}% retained</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

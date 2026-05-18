'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll axis. */
  orientation?: 'horizontal' | 'vertical'
  /** Travel direction. */
  direction?: 'left' | 'right' | 'up' | 'down'
  /** Animation duration in seconds. Lower = faster. */
  speed?: number
  /** Pause the animation on hover. */
  pauseOnHover?: boolean
  /** Gap between repeated content groups (px). */
  gap?: number
  /** Number of times the slot content is duplicated for a seamless loop. */
  repeat?: number
  /** Hard pause the animation. */
  paused?: boolean
}

/* ------------------------------------------------------------------ */
/* Marquee keyframes                                                   */
/* Ported from Marquee.vue's non-scoped <style> block. Injected as a   */
/* global <style> so the inline animationName can resolve the          */
/* @keyframes (scoped hashes would break the name lookup).             */
/* ------------------------------------------------------------------ */
const marqueeCss = `
@keyframes uipkge-marquee-x {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes uipkge-marquee-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='marquee-track'] {
    animation: none !important;
  }
}
`

function MarqueeStyle() {
  return <style dangerouslySetInnerHTML={{ __html: marqueeCss }} />
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      orientation = 'horizontal',
      direction = 'left',
      speed = 20,
      pauseOnHover = false,
      gap = 16,
      repeat = 2,
      paused = false,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isVertical = orientation === 'vertical'
    const reverse = direction === 'right' || direction === 'down'

    const containerClass = React.useMemo(
      () =>
        cn(
          'group flex overflow-hidden',
          isVertical ? 'flex-col' : 'flex-row',
          pauseOnHover ? 'hover:[&>[data-slot=marquee-track]]:[animation-play-state:paused]' : '',
          className,
        ),
      [isVertical, pauseOnHover, className],
    )

    const trackClass = React.useMemo(
      () => cn('flex shrink-0', isVertical ? 'flex-col' : 'flex-row', paused ? '![animation-play-state:paused]' : ''),
      [isVertical, paused],
    )

    const trackStyle = React.useMemo<React.CSSProperties>(
      () => ({
        gap: 'var(--marquee-gap)',
        animationName: isVertical ? 'uipkge-marquee-y' : 'uipkge-marquee-x',
        animationDuration: `${speed}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationDirection: reverse ? 'reverse' : 'normal',
      }),
      [isVertical, speed, reverse],
    )

    const containerStyle = React.useMemo<React.CSSProperties>(
      () => ({ '--marquee-gap': `${gap}px`, ...style }) as React.CSSProperties,
      [gap, style],
    )

    return (
      <>
        <MarqueeStyle />
        <div
          ref={ref}
          data-uipkge=""
          data-slot="marquee"
          data-orientation={orientation}
          data-direction={direction}
          className={containerClass}
          style={containerStyle}
          role="region"
          aria-roledescription="marquee"
          {...props}
        >
          {Array.from({ length: repeat }, (_, i) => (
            <div
              key={i}
              data-slot="marquee-track"
              className={trackClass}
              style={trackStyle}
              aria-hidden={i > 0 ? true : undefined}
            >
              {children}
            </div>
          ))}
        </div>
      </>
    )
  },
)
Marquee.displayName = 'Marquee'

export { Marquee }

'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { gradientTextPresets, type GradientPreset } from './gradient-text.variants'

type Direction =
  | 'to right'
  | 'to left'
  | 'to top'
  | 'to bottom'
  | 'to top right'
  | 'to top left'
  | 'to bottom right'
  | 'to bottom left'

export interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Rendered element / component. */
  as?: React.ElementType
  /** Render the child element as the gradient text (merging props/styles)
   *  instead of emitting the `as` tag — the React equivalent of reka-ui's
   *  as-child. */
  asChild?: boolean
  /** Preset gradient name. Overrides from/to when set. */
  preset?: GradientPreset
  /** Start color of a custom two-stop gradient. */
  from?: string
  /** End color of a custom two-stop gradient. */
  to?: string
  /** Gradient direction. */
  direction?: Direction
  /** Fully custom CSS gradient (e.g. 'linear-gradient(45deg, #f00, #00f, #0f0)'). Overrides preset/from/to. */
  gradient?: string
  /** Animate the gradient (subtle background-position shift). */
  animated?: boolean
  /** Animation duration in seconds. Default 4. */
  animationDuration?: number
}

/* ------------------------------------------------------------------ */
/* Animation keyframes                                                 */
/* Ported from GradientText.vue's <style scoped> block. Injected once  */
/* so the component ships self-contained.                              */
/* ------------------------------------------------------------------ */
const gradientTextCss = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes gradient-text-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
}
`

function GradientTextStyle() {
  return <style dangerouslySetInnerHTML={{ __html: gradientTextCss }} />
}

const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(
  (
    {
      className,
      as: asProp = 'span',
      asChild = false,
      preset,
      from,
      to,
      direction = 'to right',
      gradient,
      animated = false,
      animationDuration = 4,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = (asChild ? Slot : asProp) as React.ElementType

    const gradientValue = React.useMemo(() => {
      if (gradient) return gradient
      if (preset) return gradientTextPresets[preset] ?? ''
      if (from && to) {
        return `linear-gradient(${direction}, ${from}, ${to})`
      }
      // Default fallback: primary token gradient.
      return 'linear-gradient(to right, var(--primary), var(--primary))'
    }, [gradient, preset, from, to, direction])

    const computedStyle = React.useMemo<React.CSSProperties>(
      () => ({
        backgroundImage: gradientValue,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        backgroundSize: animated ? '200% 200%' : undefined,
        ...style,
      }),
      [gradientValue, animated, style],
    )

    return (
      <>
        <GradientTextStyle />
        <Comp
          data-uipkge=""
          data-slot="gradient-text"
          data-preset={preset ?? undefined}
          data-animated={animated ? 'true' : undefined}
          className={cn(
            'inline-block',
            animated ? `motion-safe:animate-[gradient-text-shift_${animationDuration}s_ease_infinite]` : '',
            className,
          )}
          style={computedStyle}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      </>
    )
  },
)
GradientText.displayName = 'GradientText'

export { GradientText }

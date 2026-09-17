'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BorderBeamProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Ring thickness in px. */
  size?: number
  /** Seconds per revolution. */
  duration?: number
  /** Seconds; negative values offset the beam's starting position around the ring. */
  delay?: number
  /** Any CSS color for the beam highlight. */
  color?: string
  /** Freeze the beam in place (animation-play-state: paused). */
  paused?: boolean
}

const BorderBeam = React.forwardRef<HTMLSpanElement, BorderBeamProps>(
  (
    { className, size = 2, duration = 6, delay = 0, color = 'var(--primary)', paused = false, style, ...props },
    ref,
  ) => {
    // Honor prefers-reduced-motion by rendering a static beam at a fixed angle.
    const [reducedMotion, setReducedMotion] = React.useState(false)

    React.useEffect(() => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(query.matches)
      const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    }, [])

    return (
      <span
        ref={ref}
        data-uipkge=""
        data-slot="border-beam"
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
        style={{
          padding: `${size}px`,
          background: reducedMotion
            ? `conic-gradient(from 45deg, transparent 0deg, transparent 290deg, ${color} 330deg, transparent 360deg)`
            : `conic-gradient(from var(--uipkge-border-angle), transparent 0deg, transparent 290deg, ${color} 330deg, transparent 360deg)`,
          animation: reducedMotion ? 'none' : `uipkge-border-beam ${duration}s linear infinite ${delay}s`,
          animationPlayState: !reducedMotion && paused ? 'paused' : undefined,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          ...style,
        }}
        {...props}
      />
    )
  },
)
BorderBeam.displayName = 'BorderBeam'

export { BorderBeam }

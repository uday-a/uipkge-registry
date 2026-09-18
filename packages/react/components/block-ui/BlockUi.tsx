'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { blockUiVariants } from './block-ui.variants'
import { Spinner } from '@/components/ui/spinner'

export interface BlockUiProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, the overlay is shown and the wrapped content is blocked. */
  blocking?: boolean
  /** Plain-text or rich message shown under the icon. Ignored when a message
   *  render prop is supplied via children. */
  message?: React.ReactNode
  opacity?: number
  overlayColor?: string
  blur?: boolean
  showSpinner?: boolean
  /** Custom icon node replacing the default Spinner (Vue #icon slot). */
  icon?: React.ReactNode
  /** Custom message node replacing the `message` string (Vue #message slot). */
  messageSlot?: React.ReactNode
}

const BlockUi = React.forwardRef<HTMLDivElement, BlockUiProps>(
  (
    {
      className,
      children,
      blocking = false,
      message = 'Loading...',
      opacity = 0.6,
      overlayColor = '',
      blur = false,
      showSpinner = true,
      icon,
      messageSlot,
      ...props
    },
    ref,
  ) => {
    const overlayStyle: React.CSSProperties = React.useMemo(() => {
      const style: React.CSSProperties = { opacity }
      if (overlayColor) style.backgroundColor = overlayColor
      return style
    }, [opacity, overlayColor])

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="block-ui"
        data-blocked={blocking ? '' : undefined}
        className={cn(blockUiVariants(), className)}
        {...props}
      >
        {/* Wrapped content — always non-interactive while blocked (not only when blur is on). */}
        <div
          className={cn(
            'block-ui-content',
            blocking && 'pointer-events-none',
            blur && blocking && 'blur-[2px] transition-[filter]',
          )}
          aria-hidden={blocking || undefined}
          {...(blocking ? { inert: true } : {})}
        >
          {children}
        </div>

        {/* Blocking overlay */}
        {blocking && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            {/* Background layer (opacity only affects this layer) */}
            <div className={cn('absolute inset-0', !overlayColor && 'bg-background')} style={overlayStyle} />
            {/* Content layer (spinner + message stay fully opaque) */}
            {icon ?? (showSpinner && <Spinner size="lg" />)}
            {messageSlot ? (
              <div className="text-foreground text-sm font-medium">{messageSlot}</div>
            ) : (
              message && <p className="text-foreground text-sm font-medium">{message}</p>
            )}
          </div>
        )}
      </div>
    )
  },
)
BlockUi.displayName = 'BlockUi'

export { BlockUi }

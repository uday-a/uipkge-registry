'use client'

import * as React from 'react'
import { MoveHorizontal, MoveVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { imageCompareVariants, type ImageCompareVariants } from './image-compare.variants'

export interface ImageCompareProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, ImageCompareVariants {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  /** Controlled slider position (0–100). */
  value?: number
  /** Uncontrolled initial position (0–100). */
  defaultValue?: number
  /** Fired with the new position (0–100) on drag / keyboard move. */
  onValueChange?: (value: number) => void
  disabled?: boolean
  showLabels?: boolean
  showHandle?: boolean
  /** Custom handle content — replaces the default arrow icon. */
  handle?: React.ReactNode
}

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v))
}

const ImageCompare = React.forwardRef<HTMLDivElement, ImageCompareProps>(
  (
    {
      beforeSrc,
      afterSrc,
      beforeAlt = 'Before',
      afterAlt = 'After',
      beforeLabel = 'Before',
      afterLabel = 'After',
      value: controlledValue,
      defaultValue = 50,
      onValueChange,
      orientation = 'horizontal',
      disabled = false,
      showLabels = true,
      showHandle = true,
      handle,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined
    const [internal, setInternal] = React.useState(defaultValue)
    const position = isControlled ? controlledValue! : internal

    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const draggingRef = React.useRef(false)

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref],
    )

    function setPosition(next: number) {
      const clamped = clamp(next)
      if (!isControlled) setInternal(clamped)
      onValueChange?.(clamped)
    }

    function updateFromPointer(clientX: number, clientY: number) {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (orientation === 'horizontal') {
        setPosition(((clientX - rect.left) / rect.width) * 100)
      } else {
        setPosition(((clientY - rect.top) / rect.height) * 100)
      }
    }

    function onPointerDown(e: React.PointerEvent) {
      if (disabled) return
      draggingRef.current = true
      const el = e.currentTarget as HTMLElement
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        // pointer capture can fail on synthetic / non-active pointers
      }
      updateFromPointer(e.clientX, e.clientY)
    }

    function onPointerMove(e: React.PointerEvent) {
      if (!draggingRef.current || disabled) return
      updateFromPointer(e.clientX, e.clientY)
    }

    function onPointerUp(e: React.PointerEvent) {
      if (!draggingRef.current) return
      draggingRef.current = false
      const el = e.currentTarget as HTMLElement
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        // pointer already released
      }
    }

    // Keyboard support: arrow keys move the slider by 1% (Shift = 10%)
    function onKeyDown(e: React.KeyboardEvent) {
      if (disabled) return
      const isH = orientation === 'horizontal'
      const step = e.shiftKey ? 10 : 1
      let next = position
      if (isH) {
        if (e.key === 'ArrowLeft') next -= step
        else if (e.key === 'ArrowRight') next += step
        else return
      } else {
        if (e.key === 'ArrowUp') next -= step
        else if (e.key === 'ArrowDown') next += step
        else return
      }
      e.preventDefault()
      setPosition(next)
    }

    // "After" image is clipped to show only the right portion.
    // Dragging right (higher %) reveals more of "before" on the left.
    const pct = position
    const clipStyle =
      orientation === 'horizontal' ? { clipPath: `inset(0 0 0 ${pct}%)` } : { clipPath: `inset(${pct}% 0 0 0)` }
    const dividerStyle = orientation === 'horizontal' ? { left: `${pct}%` } : { top: `${pct}%` }

    React.useEffect(() => {
      return () => {
        draggingRef.current = false
      }
    }, [])

    return (
      <div
        ref={setRefs}
        data-uipkge=""
        data-slot="image-compare"
        data-orientation={orientation}
        data-disabled={disabled ? '' : undefined}
        className={cn(imageCompareVariants({ orientation }), className)}
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        {...props}
      >
        {/* Before (base layer, full) */}
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="pointer-events-none absolute inset-0 size-full object-cover select-none"
          draggable={false}
        />
        {showLabels && (
          <span className="bg-background/80 text-foreground absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            {beforeLabel}
          </span>
        )}

        {/* After (clipped overlay — visible on the right side) */}
        <div className="absolute inset-0 size-full" style={clipStyle}>
          <img
            src={afterSrc}
            alt={afterAlt}
            className="pointer-events-none absolute inset-0 size-full object-cover select-none"
            draggable={false}
          />
          {showLabels && (
            <span className="bg-background/80 text-foreground absolute right-2 bottom-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
              {afterLabel}
            </span>
          )}
        </div>

        {/* Divider + handle */}
        {!disabled && (
          <div
            className={cn(
              'bg-border absolute z-10',
              orientation === 'horizontal' ? 'top-0 h-full w-0.5' : 'left-0 h-0.5 w-full',
            )}
            style={dividerStyle}
          >
            {showHandle && (
              <button
                type="button"
                role="slider"
                aria-valuenow={Math.round(position)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Image comparison slider, ${Math.round(position)} percent`}
                aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
                tabIndex={0}
                className={cn(
                  'bg-background border-border focus-visible:ring-ring absolute flex size-9 cursor-ew-resize items-center justify-center rounded-full border shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none',
                  'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  orientation === 'vertical' && 'cursor-ns-resize',
                )}
                onKeyDown={onKeyDown}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  onPointerDown(e)
                }}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {handle !== undefined ? (
                  handle
                ) : orientation === 'horizontal' ? (
                  <MoveHorizontal className="text-foreground size-4" />
                ) : (
                  <MoveVertical className="text-foreground size-4" />
                )}
              </button>
            )}
          </div>
        )}

        {disabled && <div className="bg-background/40 absolute inset-0" />}
      </div>
    )
  },
)
ImageCompare.displayName = 'ImageCompare'

export { ImageCompare }

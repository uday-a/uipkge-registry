'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

/** Injected once — mirrors Vue Slider.vue motion styles (range ease, press scale, reduced-motion). */
const STYLE_ID = 'slider-motion-styles'
const STYLE_CONTENT = `
@media (prefers-reduced-motion: no-preference) {
  [data-slot='slider-range'] {
    transition-property: left, right, top, bottom;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  [data-slot='slider-thumb'] {
    scale: 1;
    transition-property: color, box-shadow, border-color, scale, left, right, top, bottom;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  [data-slot='slider-thumb']:active:not([data-disabled]) {
    scale: 0.94;
    transition-duration: 100ms;
  }
  [data-slot='slider']:active [data-slot='slider-range'],
  [data-slot='slider']:active [data-slot='slider-thumb'] {
    transition-property: color, box-shadow, border-color, scale;
    transition-duration: 100ms;
  }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='slider-range'],
  [data-slot='slider-thumb'] {
    transition: none !important;
    scale: 1 !important;
  }
}
`

export interface SliderMark {
  label: string
  style?: React.CSSProperties
}

export interface SliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'value' | 'defaultValue' | 'inverted' | 'orientation' | 'onValueChange' | 'onValueCommit'
> {
  className?: string
  /** Controlled value (Radix uses number[]). */
  value?: number[]
  /** Uncontrolled initial value. */
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  /** Enable dual-thumb range selection (affects default value when uncontrolled). */
  range?: boolean
  /** Vertical orientation */
  vertical?: boolean
  /** Height when vertical (px or css value) */
  height?: string | number
  /** Tick marks with labels */
  marks?: Record<number, string | SliderMark>
  /** Show tooltip on drag/focus. Boolean or formatter function */
  tooltip?: boolean | ((value: number) => string)
  /** Show dots at each step */
  dots?: boolean
  /** Reverse direction (right-to-left or bottom-to-top) */
  reverse?: boolean
  /** Highlight the track between thumbs/min (default true) */
  included?: boolean
  /** Size variant */
  size?: 'small' | 'default'
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onValueCommit,
      min = 0,
      max = 100,
      step = 1,
      range = false,
      vertical = false,
      height,
      marks,
      tooltip = true,
      dots = false,
      reverse = false,
      included = true,
      size = 'default',
      ...props
    },
    ref,
  ) => {
    /* ── normalize value to number[] ── */
    const resolvedDefault = React.useMemo<number[]>(() => {
      if (defaultValue != null) return defaultValue
      return range ? [min, max] : [min]
    }, [defaultValue, range, min, max])

    // Track current values so tooltips/marks can read them in both controlled
    // and uncontrolled usage (Radix doesn't surface the value to children).
    const [internalValue, setInternalValue] = React.useState<number[]>(resolvedDefault)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value! : internalValue

    const handleChange = React.useCallback(
      (next: number[]) => {
        if (!isControlled) setInternalValue(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange],
    )

    /* ── layout helpers ── */
    const orientation = vertical ? 'vertical' : 'horizontal'
    const isHorizontal = orientation === 'horizontal'

    const trackSize = size === 'small' ? (isHorizontal ? 'h-1' : 'w-1') : isHorizontal ? 'h-1.5' : 'w-1.5'

    const thumbSize = size === 'small' ? 'size-3' : 'size-4'

    /* ── marks ── */
    const markList = React.useMemo(() => {
      if (!marks) return []
      const entries = Object.entries(marks).map(([key, val]) => {
        const num = Number(key)
        const label = typeof val === 'string' ? val : val.label
        const style = typeof val === 'string' ? undefined : val.style
        const pct = ((num - min) / (max - min)) * 100
        return { value: num, label, style, pct }
      })
      entries.sort((a, b) => a.value - b.value)
      return entries
    }, [marks, min, max])

    /* ── step dots ── */
    const dotList = React.useMemo(() => {
      if (!dots) return []
      const list: number[] = []
      const count = Math.floor((max - min) / step)
      for (let i = 0; i <= count; i++) {
        list.push(min + i * step)
      }
      return list
    }, [dots, max, min, step])

    /* ── tooltip ── */
    const showTooltip = tooltip !== false
    const formatTooltip = (v: number) => (typeof tooltip === 'function' ? tooltip(v) : String(v))

    React.useLayoutEffect(() => {
      if (typeof document === 'undefined') return
      let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
      if (!el) {
        el = document.createElement('style')
        el.id = STYLE_ID
        document.head.appendChild(el)
      }
      if (el.textContent !== STYLE_CONTENT) el.textContent = STYLE_CONTENT
    }, [])

    const thumbClass = cn(
      'border-primary bg-background ring-ring/50 block shrink-0 rounded-full border shadow-sm touch-manipulation hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none',
      thumbSize,
    )

    return (
      <TooltipPrimitive.Provider>
        <div
          className={cn('relative w-full', !isHorizontal && 'flex flex-col items-center')}
          style={!isHorizontal && height ? { height: typeof height === 'number' ? `${height}px` : height } : undefined}
        >
          <SliderPrimitive.Root
            ref={ref}
            data-uipkge=""
            data-slot="slider"
            min={min}
            max={max}
            step={step}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : resolvedDefault}
            orientation={orientation}
            inverted={reverse}
            onValueChange={handleChange}
            onValueCommit={onValueCommit}
            className={cn(
              'relative flex touch-none select-none data-[disabled]:opacity-50',
              isHorizontal ? 'w-full items-center' : 'h-full min-h-44 flex-col justify-center',
              className,
            )}
            {...props}
          >
            {/* Track */}
            <SliderPrimitive.Track
              data-uipkge=""
              data-slot="slider-track"
              className={cn('bg-muted relative grow overflow-hidden rounded-full', trackSize)}
            >
              {included && (
                <SliderPrimitive.Range
                  data-uipkge=""
                  data-slot="slider-range"
                  className={cn('bg-primary absolute', isHorizontal ? 'h-full' : 'w-full')}
                />
              )}
            </SliderPrimitive.Track>

            {/* Step dots */}
            {dotList.map((dot) => (
              <div
                key={dot}
                className={cn(
                  'border-primary/40 bg-background absolute rounded-full border',
                  isHorizontal ? 'top-1/2 size-1.5 -translate-y-1/2' : 'left-1/2 size-1.5 -translate-x-1/2',
                  size === 'small' && 'size-1',
                )}
                style={
                  isHorizontal
                    ? {
                        left: `${((dot - min) / (max - min)) * 100}%`,
                        transform: 'translateX(-50%) translateY(-50%)',
                      }
                    : {
                        bottom: `${((dot - min) / (max - min)) * 100}%`,
                        transform: 'translateX(-50%) translateY(50%)',
                      }
                }
              />
            ))}

            {/* Marks */}
            {markList.length > 0 && (
              <div
                className={cn(
                  'pointer-events-none absolute',
                  isHorizontal ? 'top-full mt-2.5 h-5 w-full' : 'top-0 left-full ml-3 h-full w-20',
                )}
              >
                {markList.map((mark) => (
                  <span
                    key={mark.value}
                    className="text-muted-foreground absolute text-xs whitespace-nowrap"
                    style={{
                      ...mark.style,
                      ...(isHorizontal
                        ? { left: `${mark.pct}%`, transform: 'translateX(-50%)' }
                        : { bottom: `${mark.pct}%`, transform: 'translateY(50%)' }),
                    }}
                  >
                    {mark.label}
                  </span>
                ))}
              </div>
            )}

            {/* Thumbs (with tooltips) */}
            {currentValue.map((thumbValue, idx) =>
              showTooltip ? (
                <TooltipPrimitive.Root key={idx} delayDuration={0}>
                  <TooltipPrimitive.Trigger asChild>
                    <SliderPrimitive.Thumb data-uipkge="" data-slot="slider-thumb" className={thumbClass} />
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      side={isHorizontal ? 'top' : 'right'}
                      sideOffset={4}
                      className="bg-foreground text-background z-50 w-fit rounded-md px-2 py-1 text-xs"
                    >
                      {formatTooltip(thumbValue ?? 0)}
                      <TooltipPrimitive.Arrow className="bg-foreground fill-foreground size-2.5 rotate-45 rounded-[2px]" />
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
              ) : (
                <SliderPrimitive.Thumb key={idx} data-uipkge="" data-slot="slider-thumb" className={thumbClass} />
              ),
            )}
          </SliderPrimitive.Root>
        </div>
      </TooltipPrimitive.Provider>
    )
  },
)
Slider.displayName = 'Slider'

export { Slider }

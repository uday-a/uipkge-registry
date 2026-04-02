'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

export interface RangeSliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'value' | 'defaultValue' | 'onValueChange' | 'min' | 'max' | 'step'
> {
  className?: string
  /** The controlled value of the range slider. */
  value?: [number, number]
  /** The value of the range slider when initially rendered. */
  defaultValue?: [number, number]
  onValueChange?: (value: [number, number]) => void
  /** When `true`, prevents the user from interacting with the range slider */
  disabled?: boolean
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step value */
  step?: number
  /** Label for the range slider */
  label?: string
  /** Hint text for the range slider */
  hint?: string
  /** Error messages to display */
  errorMessages?: string | string[]
  /** Whether to show error state */
  error?: boolean
  /** Custom color for the track fill */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string
  /** Thumb size */
  thumbSize?: 'sm' | 'md' | 'lg'
  /** Track height */
  trackHeight?: 'sm' | 'md' | 'lg'
  /** Show ticks */
  showTicks?: boolean
  /** Tick interval */
  tickInterval?: number
  /** Show thumb labels */
  thumbLabel?: boolean
  /** Format thumb label */
  thumbLabelFormat?: (value: number) => string
}

// Color classes
const colorClasses: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info',
}

// Track height classes
const trackHeightClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

// Thumb size classes
const thumbSizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
}

const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      disabled,
      min = 0,
      max = 100,
      step = 1,
      label,
      hint,
      errorMessages,
      error,
      color = 'primary',
      thumbSize = 'md',
      trackHeight = 'md',
      showTicks,
      tickInterval,
      thumbLabel,
      thumbLabelFormat,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<[number, number]>(defaultValue ?? [min, max])
    const currentValue = isControlled ? value! : internalValue
    const fieldId = React.useId()

    const handleChange = React.useCallback(
      (next: number[]) => {
        const tuple = [next[0], next[1]] as [number, number]
        if (!isControlled) setInternalValue(tuple)
        onValueChange?.(tuple)
      },
      [isControlled, onValueChange],
    )

    // Generate ticks
    const ticks = React.useMemo(() => {
      if (!showTicks || !tickInterval) return []
      const result: number[] = []
      for (let i = min; i <= max; i += tickInterval) {
        result.push(i)
      }
      return result
    }, [showTicks, tickInterval, min, max])

    // Build error state
    const hasError = React.useMemo(() => {
      if (error) return true
      if (errorMessages && (typeof errorMessages === 'string' ? errorMessages : errorMessages.length > 0)) return true
      return false
    }, [error, errorMessages])

    const thumbClass = cn(
      'border-primary ring-ring/50 bg-background block rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
      thumbSizeClasses[thumbSize],
      hasError && 'border-destructive',
    )

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium">
            {label}
          </label>
        )}

        {hint && !hasError && (
          <p id={`${fieldId}-hint`} className="text-muted-foreground text-xs">
            {hint}
          </p>
        )}

        <div className="flex items-center gap-4">
          {/* Min value display */}
          <div className="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
            {currentValue?.[0] ?? min}
          </div>

          <SliderPrimitive.Root
            ref={ref}
            id={fieldId}
            data-slot="range-slider"
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : (defaultValue ?? [min, max])}
            onValueChange={handleChange}
            aria-describedby={hint && !hasError ? `${fieldId}-hint` : hasError ? `${fieldId}-error` : undefined}
            aria-invalid={hasError || undefined}
            className={cn('relative flex w-full touch-none items-center select-none', className)}
            {...props}
          >
            <SliderPrimitive.Track
              data-uipkge=""
              data-slot="slider-track"
              className={cn('bg-muted relative w-full overflow-hidden rounded-full', trackHeightClasses[trackHeight])}
            >
              <SliderPrimitive.Range
                data-uipkge=""
                data-slot="slider-range"
                className={cn('absolute h-full', colorClasses[color as string] || colorClasses.primary)}
              />
            </SliderPrimitive.Track>

            {/* Ticks */}
            {showTicks && ticks.length > 0 && (
              <div
                className="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-between"
                aria-hidden="true"
              >
                {ticks.map((tick) => (
                  <div key={tick} className="bg-muted-foreground/30 h-2 w-0.5 rounded-full" />
                ))}
              </div>
            )}

            {/* Start Thumb (Min) */}
            <SliderPrimitive.Thumb
              data-uipkge=""
              data-slot="slider-thumb"
              aria-label={label ? `${label} minimum` : 'Minimum value'}
              className={thumbClass}
            >
              {thumbLabel && (
                <span className="bg-background absolute -top-6 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap">
                  {thumbLabelFormat ? thumbLabelFormat(currentValue?.[0] ?? 0) : (currentValue?.[0] ?? 0)}
                </span>
              )}
            </SliderPrimitive.Thumb>

            {/* End Thumb (Max) */}
            <SliderPrimitive.Thumb
              data-uipkge=""
              data-slot="slider-thumb"
              aria-label={label ? `${label} maximum` : 'Maximum value'}
              className={thumbClass}
            >
              {thumbLabel && (
                <span className="bg-background absolute -top-6 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap">
                  {thumbLabelFormat ? thumbLabelFormat(currentValue?.[1] ?? 0) : (currentValue?.[1] ?? 0)}
                </span>
              )}
            </SliderPrimitive.Thumb>
          </SliderPrimitive.Root>

          {/* Max value display */}
          <div className="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
            {currentValue?.[1] ?? max}
          </div>
        </div>

        {/* Tick labels */}
        {showTicks && ticks.length > 0 && (
          <div className="text-muted-foreground flex justify-between px-1 text-xs" aria-hidden="true">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        )}

        {hasError && (
          <div id={`${fieldId}-error`} className="flex flex-col gap-0.5" role="alert">
            {typeof errorMessages === 'string' ? (
              <p className="text-destructive text-xs">{errorMessages}</p>
            ) : (
              errorMessages?.map((msg, i) => (
                <p key={i} className="text-destructive text-xs">
                  {msg}
                </p>
              ))
            )}
          </div>
        )}
      </div>
    )
  },
)
RangeSlider.displayName = 'RangeSlider'

export { RangeSlider }

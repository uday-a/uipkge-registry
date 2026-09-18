'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NumberFieldSize = 'small' | 'middle' | 'large'
export type NumberFieldStatus = 'error' | 'warning'
export type NumberFieldControlsPosition = 'default' | 'right'

export interface NumberFieldProps {
  /** Controlled value. `undefined` renders an empty field. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  /** Fixed number of decimal digits in the formatted display. */
  precision?: number
  disabled?: boolean
  readOnly?: boolean
  size?: NumberFieldSize
  status?: NumberFieldStatus
  controlsPosition?: NumberFieldControlsPosition
  /** Enable Arrow/Page/Home/End keyboard stepping. */
  keyboard?: boolean
  /** Intl number-format options merged into the display formatter. */
  formatOptions?: Intl.NumberFormatOptions
  /** Custom display formatter — wins over `formatOptions`/`precision`. */
  formatter?: (value: number | undefined) => string
  /** Custom parser from the typed text back to a number. */
  parser?: (displayValue: string) => number | undefined
  prefix?: string
  suffix?: string
  placeholder?: string
  id?: string
  className?: string
  'aria-label'?: string
}

const decrementIncrementBase =
  'focus-visible:ring-ring inline-flex shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30'

function clamp(value: number, min?: number, max?: number) {
  let next = value
  if (min !== undefined) next = Math.max(min, next)
  if (max !== undefined) next = Math.min(max, next)
  return next
}

const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      disabled,
      readOnly,
      size = 'middle',
      status,
      controlsPosition = 'default',
      keyboard = true,
      formatOptions,
      formatter,
      parser,
      prefix,
      suffix,
      placeholder,
      id,
      className,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref],
    )

    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState<number | undefined>(defaultValue)
    const currentValue = isControlled ? value : internal

    const isRight = controlsPosition === 'right'

    const intlOptions = React.useMemo<Intl.NumberFormatOptions | undefined>(() => {
      if (precision !== undefined) {
        return { ...formatOptions, minimumFractionDigits: precision, maximumFractionDigits: precision }
      }
      return formatOptions
    }, [formatOptions, precision])

    const formatValue = React.useCallback(
      (val: number | undefined): string => {
        if (formatter) return formatter(val)
        if (val === undefined || Number.isNaN(val)) return ''
        if (intlOptions) return new Intl.NumberFormat(undefined, intlOptions).format(val)
        return String(val)
      },
      [formatter, intlOptions],
    )

    const [displayValue, setDisplayValue] = React.useState<string>(() => formatValue(currentValue))
    const [isUserTyping, setIsUserTyping] = React.useState(false)

    // Keep the display in sync with the value whenever the user isn't typing.
    React.useEffect(() => {
      if (!isUserTyping) setDisplayValue(formatValue(currentValue))
    }, [currentValue, formatValue, isUserTyping])

    const emit = React.useCallback(
      (next: number | undefined) => {
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange],
    )

    const stepBy = React.useCallback(
      (delta: number) => {
        if (disabled || readOnly) return
        const base = currentValue ?? 0
        const next = clamp(base + delta, min, max)
        emit(next)
        setIsUserTyping(false)
        setDisplayValue(formatValue(next))
      },
      [currentValue, disabled, readOnly, min, max, emit, formatValue],
    )

    const handleIncrease = (mult = 1) => stepBy(step * mult)
    const handleDecrease = (mult = 1) => stepBy(-step * mult)

    function commitValue() {
      setIsUserTyping(false)
      const raw = displayValue.trim()
      if (raw === '') {
        emit(undefined)
        setDisplayValue('')
        return
      }
      let num: number | undefined
      if (parser) num = parser(raw)
      else num = Number(raw)

      if (num !== undefined && !Number.isNaN(num)) {
        const next = clamp(num, min, max)
        emit(next)
        setDisplayValue(formatValue(next))
      } else {
        setDisplayValue(formatValue(currentValue))
      }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'ArrowUp') {
        if (keyboard) {
          event.preventDefault()
          handleIncrease()
        }
      } else if (event.key === 'ArrowDown') {
        if (keyboard) {
          event.preventDefault()
          handleDecrease()
        }
      } else if (event.key === 'PageUp') {
        if (keyboard) {
          event.preventDefault()
          handleIncrease(10)
        }
      } else if (event.key === 'PageDown') {
        if (keyboard) {
          event.preventDefault()
          handleDecrease(10)
        }
      } else if (event.key === 'Home') {
        if (keyboard && min !== undefined) {
          event.preventDefault()
          emit(min)
          setIsUserTyping(false)
          setDisplayValue(formatValue(min))
        }
      } else if (event.key === 'End') {
        if (keyboard && max !== undefined) {
          event.preventDefault()
          emit(max)
          setIsUserTyping(false)
          setDisplayValue(formatValue(max))
        }
      } else if (event.key === 'Enter') {
        commitValue()
      }
    }

    function handleWheel(event: React.WheelEvent<HTMLInputElement>) {
      if (event.currentTarget !== document.activeElement) return
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      if (event.deltaY > 0) handleDecrease()
      else handleIncrease()
    }

    const iconSize = size === 'small' ? 'h-3 w-3' : size === 'large' ? 'h-5 w-5' : 'h-4 w-4'

    const buttonPadding = !isRight ? (size === 'small' ? 'p-1.5' : size === 'large' ? 'p-4' : 'p-3') : ''

    const inputSizeClasses =
      size === 'small'
        ? 'h-7 text-xs px-2 py-0.5'
        : size === 'large'
          ? 'h-11 text-base px-4 py-2'
          : 'h-9 text-sm px-3 py-1'

    const inputStatusClasses = !isRight
      ? status === 'error'
        ? 'border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive'
        : status === 'warning'
          ? 'border-warning focus-visible:ring-warning/20'
          : ''
      : ''

    const contentClasses = cn(
      'relative',
      isRight &&
        'border-input focus-within:ring-ring inline-grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr] items-stretch overflow-hidden rounded-md border focus-within:ring-1',
    )

    const decrement = (
      <button
        type="button"
        data-uipkge=""
        data-slot="decrement"
        tabIndex={-1}
        aria-label="Decrease"
        disabled={disabled || readOnly || (min !== undefined && (currentValue ?? 0) <= min)}
        onClick={() => handleDecrease()}
        className={cn(
          decrementIncrementBase,
          !isRight && 'absolute top-1/2 left-0 z-10 -translate-y-1/2',
          buttonPadding,
          isRight && 'hover:bg-accent col-start-2 row-start-2 h-full w-auto rounded-none border-t border-l p-0 px-2',
        )}
      >
        <Minus className={iconSize} aria-hidden="true" />
      </button>
    )

    const increment = (
      <button
        type="button"
        data-uipkge=""
        data-slot="increment"
        tabIndex={-1}
        aria-label="Increase"
        disabled={disabled || readOnly || (max !== undefined && (currentValue ?? 0) >= max)}
        onClick={() => handleIncrease()}
        className={cn(
          decrementIncrementBase,
          !isRight && 'absolute top-1/2 right-0 z-10 -translate-y-1/2',
          buttonPadding,
          isRight && 'hover:bg-accent col-start-2 row-start-1 h-full w-auto rounded-none border-l p-0 px-2',
        )}
      >
        <Plus className={iconSize} aria-hidden="true" />
      </button>
    )

    const inputBlock = (
      <div
        data-uipkge=""
        data-slot="input"
        className={cn(
          'relative flex-1',
          isRight && 'col-span-1 row-span-2',
          // Non-right layout: pad the input to clear the overlaid steppers.
          !isRight && '[&>input]:pr-9 [&>input]:pl-9',
        )}
      >
        {prefix && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm">
            {prefix}
          </span>
        )}
        <input
          id={id}
          ref={setRefs}
          value={displayValue}
          type="text"
          role="spinbutton"
          aria-label={ariaLabel}
          aria-valuenow={currentValue !== undefined && !Number.isNaN(currentValue) ? currentValue : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={status === 'error' ? true : undefined}
          inputMode={precision !== undefined ? 'decimal' : 'numeric'}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-roledescription="Number field"
          onFocus={() => setIsUserTyping(true)}
          onChange={(e) => setDisplayValue(e.target.value)}
          onBlur={commitValue}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          className={cn(
            'placeholder:text-muted-foreground w-full bg-transparent text-center shadow-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
            !isRight && 'border-input focus-visible:ring-ring rounded-md border focus-visible:ring-1',
            isRight && 'rounded-none border-0 focus-visible:ring-0',
            prefix && 'pl-6',
            suffix && 'pr-6',
            inputSizeClasses,
            inputStatusClasses,
          )}
        />
        {suffix && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-sm">
            {suffix}
          </span>
        )}
      </div>
    )

    return (
      <div data-uipkge="" data-slot="number-field" className={cn('inline-flex', className)}>
        <div className={contentClasses}>
          {decrement}
          {inputBlock}
          {increment}
        </div>
      </div>
    )
  },
)
NumberField.displayName = 'NumberField'

export { NumberField }

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { NumberFieldControlsPosition, NumberFieldSize, NumberFieldStatus } from './NumberFieldContext'

  export type { NumberFieldControlsPosition, NumberFieldSize, NumberFieldStatus }

  export interface NumberFieldProps extends HTMLAttributes<HTMLDivElement> {
    value?: number | undefined
    defaultValue?: number | undefined
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    /** Primary readonly API (React `readOnly` parity). Wins over `readonly` when both are set. */
    readOnly?: boolean
    /** @deprecated Use `readOnly`. Kept as an alias — both stay functional. */
    readonly?: boolean
    required?: boolean
    name?: string
    /** Forwarded to the inner input (React parity). To style or anchor the root container, wrap in a styled element. */
    id?: string
    /** Forwarded to the inner input (React parity). */
    placeholder?: string
    inputMode?: 'decimal' | 'numeric'
    formatOptions?: Intl.NumberFormatOptions
    disableWheelChange?: boolean
    invertWheelChange?: boolean
    size?: NumberFieldSize
    status?: NumberFieldStatus
    controlsPosition?: NumberFieldControlsPosition
    keyboard?: boolean
    precision?: number
    formatter?: (value: number | undefined) => string
    parser?: (displayValue: string) => number | undefined
    prefix?: string
    suffix?: string
    ref?: HTMLDivElement | null
    onValueChange?: (value: number | undefined) => void
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { setNumberFieldContext } from './NumberFieldContext'

  let {
    class: className,
    value = $bindable(),
    defaultValue,
    min,
    max,
    step = 1,
    disabled = false,
    readOnly,
    readonly = false,
    required = false,
    name,
    id,
    placeholder,
    inputMode = 'decimal',
    formatOptions,
    disableWheelChange = false,
    invertWheelChange = false,
    size = 'middle',
    status,
    controlsPosition = 'default',
    keyboard = true,
    precision,
    formatter,
    parser,
    prefix,
    suffix,
    children,
    ref = $bindable(null),
    onValueChange,
    ...restProps
  }: NumberFieldProps = $props()

  const effectiveReadonly = $derived(readOnly ?? readonly ?? false)

  // Uncontrolled mode: seed the bindable from defaultValue on first read.
  // ($bindable() with no parent binding is local state; assigning the default
  // once mirrors reka's defaultValue without fighting a controlled parent —
  // the guard only runs while the parent hasn't provided a value.)
  let seeded = false
  $effect.pre(() => {
    if (!seeded && value === undefined && defaultValue !== undefined) {
      value = defaultValue
    }
    seeded = true
  })

  const resolvedFormatOptions = $derived.by((): Intl.NumberFormatOptions | undefined => {
    if (precision !== undefined) {
      return { ...formatOptions, minimumFractionDigits: precision, maximumFractionDigits: precision }
    }
    return formatOptions
  })

  function clamp(v: number): number {
    let out = v
    if (min !== undefined) out = Math.max(min, out)
    if (max !== undefined) out = Math.min(max, out)
    return out
  }

  function roundToStepPrecision(v: number): number {
    // Avoid 0.1 + 0.2 style float drift on stepped changes.
    const decimals = Math.max(
      (String(step).split('.')[1] ?? '').length,
      precision ?? 0,
      (String(min ?? '').split('.')[1] ?? '').length,
    )
    if (decimals === 0) return Math.round(v)
    const f = 10 ** decimals
    return Math.round(v * f) / f
  }

  function setValue(v: number | undefined) {
    if (disabled || effectiveReadonly) return
    const next = v === undefined ? undefined : clamp(v)
    value = next
    onValueChange?.(next)
  }

  function handleIncrease(times = 1) {
    if (disabled || effectiveReadonly) return
    const base = value ?? (min !== undefined ? min - step * times : 0)
    setValue(roundToStepPrecision(clamp(base + step * times)))
  }

  function handleDecrease(times = 1) {
    if (disabled || effectiveReadonly) return
    const base = value ?? (max !== undefined ? max + step * times : 0)
    setValue(roundToStepPrecision(clamp(base - step * times)))
  }

  function handleMinMaxValue(which: 'min' | 'max') {
    if (disabled || effectiveReadonly) return
    if (which === 'min' && min !== undefined) setValue(min)
    if (which === 'max' && max !== undefined) setValue(max)
  }

  function applyInputValue(displayValue: string) {
    if (disabled || effectiveReadonly) return
    const num = Number(displayValue)
    if (displayValue.trim() === '') setValue(undefined)
    else if (!Number.isNaN(num)) setValue(roundToStepPrecision(num))
  }

  function formatValue(v: number | undefined): string {
    if (v === undefined || Number.isNaN(v)) return ''
    if (formatter) return formatter(v)
    if (resolvedFormatOptions) {
      try {
        return new Intl.NumberFormat(undefined, resolvedFormatOptions).format(v)
      } catch {
        return String(v)
      }
    }
    return String(v)
  }

  setNumberFieldContext({
    getValue: () => value,
    setValue,
    handleIncrease,
    handleDecrease,
    handleMinMaxValue,
    applyInputValue,
    formatValue,
    getMin: () => min,
    getMax: () => max,
    isDisabled: () => disabled,
    isReadonly: () => effectiveReadonly,
    getInputMode: () => inputMode,
    isWheelChangeDisabled: () => disableWheelChange,
    isWheelChangeInverted: () => invertWheelChange,
    getSize: () => size,
    getStatus: () => status,
    getControlsPosition: () => controlsPosition,
    isKeyboardEnabled: () => keyboard,
    getFormatter: () => formatter,
    getParser: () => parser,
    getPrefix: () => prefix,
    getSuffix: () => suffix,
    getId: () => id,
    getPlaceholder: () => placeholder,
  })
</script>

<div bind:this={ref} data-uipkge="" data-slot="number-field" class={cn('inline-flex', className)} {...restProps}>
  {@render children?.()}
  {#if name}
    <input type="hidden" {name} value={value ?? ''} {required} {disabled} />
  {/if}
</div>

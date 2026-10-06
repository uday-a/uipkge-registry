<script lang="ts" module>
  import type { TimeFormat } from './TimeColumns.svelte'

  export interface TimePreset {
    label: string
    value: string
  }

  export type TimePickerSize = 'small' | 'middle' | 'large'
  export type TimePickerStatus = 'error' | 'warning'

  export interface TimePickerProps {
    /** Controlled value as 24h HH:mm or HH:mm:ss. Empty string = no selection. */
    value?: string
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    clearable?: boolean
    allowClear?: boolean
    minuteStep?: number
    hourStep?: number
    secondStep?: number
    /** Backward-compat: when true, render 24-hour selector. */
    use24Hour?: boolean
    /** When true, show AM/PM selector. */
    use12Hours?: boolean
    minTime?: string
    maxTime?: string
    format?: TimeFormat
    disabledHours?: () => number[]
    disabledMinutes?: (selectedHour: number) => number[]
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
    hideDisabledOptions?: boolean
    presets?: TimePreset[]
    size?: TimePickerSize
    status?: TimePickerStatus
    triggerClass?: string
    class?: string
    /** Called with the new 24h time string after every change. */
    onValueChange?: (value: string) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { buttonVariants } from '$lib/components/ui/button/button.variants'
  import { Clock, X } from '@lucide/svelte'
  import TimeColumns from './TimeColumns.svelte'

  let {
    value = $bindable(''),
    placeholder = 'Pick a time',
    disabled = false,
    readOnly = false,
    clearable = true,
    allowClear,
    minuteStep = 5,
    hourStep = 1,
    secondStep = 1,
    use24Hour = false,
    use12Hours = false,
    minTime,
    maxTime,
    format = 'HH:mm',
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    hideDisabledOptions = false,
    presets = [],
    size = 'middle',
    status,
    triggerClass,
    class: className,
    onValueChange,
    ref = $bindable(null),
  }: TimePickerProps = $props()

  let open = $state(false)

  const effectiveAllowClear = $derived(allowClear !== undefined ? allowClear : clearable)

  function parse(v: string) {
    if (!v) return null
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim())
    if (!m) return null
    return { hour24: Number(m[1]), minute: Number(m[2]), second: m[3] ? Number(m[3]) : 0 }
  }

  const parsed = $derived(parse(value))

  function formatDisplay(h: number, m: number, s: number) {
    if (format === 'hh:mm A') {
      const h12 = h % 12 === 0 ? 12 : h % 12
      const period = h >= 12 ? 'PM' : 'AM'
      return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
    }
    if (format === 'HH:mm:ss') {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  const display = $derived.by(() => {
    if (!parsed) return ''
    return formatDisplay(parsed.hour24, parsed.minute, parsed.second)
  })

  function emitTime(v: string) {
    value = v
    onValueChange?.(v)
  }

  function pickNow() {
    if (readOnly) return
    const d = new Date()
    const sStep = Math.max(1, secondStep)
    const rawS = d.getSeconds()
    const snappedS = Math.round(rawS / sStep) * sStep
    const secCarry = Math.floor(snappedS / 60)
    const s = snappedS % 60

    const mStep = Math.max(1, minuteStep)
    const rawM = d.getMinutes() + secCarry
    const snappedM = Math.round(rawM / mStep) * mStep
    const minCarry = Math.floor(snappedM / 60)
    const min = snappedM % 60

    const h = (d.getHours() + minCarry) % 24
    const hourStr = String(h).padStart(2, '0')
    const minStr = String(min).padStart(2, '0')
    const secStr = String(s).padStart(2, '0')
    emitTime(format === 'HH:mm:ss' ? `${hourStr}:${minStr}:${secStr}` : `${hourStr}:${minStr}`)
  }

  function applyPreset(preset: TimePreset) {
    if (readOnly) return
    emitTime(preset.value)
    open = false
  }

  function clear(event: Event) {
    event.stopPropagation()
    if (disabled || readOnly) return
    emitTime('')
  }

  const sizeClasses: Record<TimePickerSize, string> = {
    small: 'h-8 text-xs px-2.5 py-1',
    middle: 'h-9 text-sm px-3 py-1.5',
    large: 'h-11 text-base px-4 py-2',
  }

  const statusClasses: Record<string, string> = {
    error: 'border-destructive focus-visible:ring-destructive',
    warning: 'border-warning focus-visible:ring-warning',
  }

  const triggerClasses = $derived(
    cn(
      buttonVariants({ variant: 'outline' }),
      'min-w-40 justify-start gap-2 text-left font-normal',
      !parsed && 'text-muted-foreground',
      sizeClasses[size],
      status && statusClasses[status],
      triggerClass,
      className,
    ),
  )

  // Pulse the columns when reopen happens (passes via prop reactivity).
  let columnsVisible = $state(false)
  $effect(() => {
    columnsVisible = open
  })

  /** Close on outside pointer-down or Escape. Hand-rolled popover behavior (no bits-ui). */
  function dismissable(node: HTMLElement) {
    function onPointerDown(e: PointerEvent) {
      if (!node.contains(e.target as Node)) open = false
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') open = false
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return {
      destroy() {
        document.removeEventListener('pointerdown', onPointerDown)
        document.removeEventListener('keydown', onKeyDown)
      },
    }
  }
</script>

<div bind:this={ref} use:dismissable data-uipkge="" data-slot="time-picker" class="relative inline-block">
  <button
    type="button"
    {disabled}
    class={triggerClasses}
    aria-haspopup="dialog"
    aria-expanded={open}
    onclick={() => {
      if (!disabled) open = !open
    }}
  >
    <Clock class="size-4 shrink-0" aria-hidden="true" />
    <span class="flex-1 truncate">{display || placeholder}</span>
    <!-- span (not button): nested interactive elements inside a button are invalid HTML -->
    {#if effectiveAllowClear && parsed && !disabled && !readOnly}
      <span
        role="button"
        tabindex="-1"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Clear time"
        onclick={clear}
        onmousedown={(e) => e.preventDefault()}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') clear(e)
        }}
      >
        <X class="size-3.5" aria-hidden="true" />
      </span>
    {/if}
  </button>
  {#if open}
    <div
      role="dialog"
      aria-label="Choose time"
      data-slot="time-picker-content"
      class="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 w-auto rounded-md border p-0 shadow-md"
    >
      {#if presets.length}
        <div class="flex flex-col gap-0.5 border-b p-2">
          {#each presets as p (p.label)}
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              onclick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          {/each}
        </div>
      {/if}
      <div class="flex items-center justify-between border-b px-3 py-2">
        <span class="text-muted-foreground text-xs tracking-widest uppercase">Time</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
          onclick={pickNow}
        >
          Now
        </button>
      </div>
      <TimeColumns
        bind:value
        {use24Hour}
        {use12Hours}
        {minuteStep}
        {hourStep}
        {secondStep}
        {minTime}
        {maxTime}
        {format}
        {disabledHours}
        {disabledMinutes}
        {disabledSeconds}
        {hideDisabledOptions}
        visible={columnsVisible}
        onValueChange={(v) => onValueChange?.(v)}
      />
    </div>
  {/if}
</div>

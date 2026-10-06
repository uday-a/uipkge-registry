<script lang="ts" module>
  import type { TimeFormat } from './TimeColumns.svelte'

  export interface TimeRangePreset {
    label: string
    value: [string, string]
  }

  export type TimeRangePickerSize = 'small' | 'middle' | 'large'
  export type TimeRangePickerStatus = 'error' | 'warning'

  export interface TimeRangePickerProps {
    /** Controlled value as [startTime, endTime] in 24h format. */
    value?: [string, string] | null
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    clearable?: boolean
    allowClear?: boolean
    minuteStep?: number
    hourStep?: number
    secondStep?: number
    use24Hour?: boolean
    use12Hours?: boolean
    minTime?: string
    maxTime?: string
    format?: TimeFormat
    disabledHours?: () => number[]
    disabledMinutes?: (selectedHour: number) => number[]
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
    hideDisabledOptions?: boolean
    presets?: TimeRangePreset[]
    size?: TimeRangePickerSize
    status?: TimeRangePickerStatus
    triggerClass?: string
    class?: string
    /** Called with the new [start, end] range after every change. */
    onValueChange?: (value: [string, string] | null) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { buttonVariants } from '$lib/components/ui/button/button.variants'
  import { Clock, X } from '@lucide/svelte'
  import TimeColumns from './TimeColumns.svelte'

  let {
    value = $bindable(null),
    placeholder = 'Pick a time range',
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
  }: TimeRangePickerProps = $props()

  let open = $state(false)

  const effectiveAllowClear = $derived(allowClear !== undefined ? allowClear : clearable)

  function parse(v: string) {
    if (!v) return null
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim())
    if (!m) return null
    return { hour24: Number(m[1]), minute: Number(m[2]), second: m[3] ? Number(m[3]) : 0 }
  }

  const startValue = $derived(value?.[0] ?? '')
  const endValue = $derived(value?.[1] ?? '')

  const startParsed = $derived(parse(startValue))
  const endParsed = $derived(parse(endValue))

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
    const hasStart = startParsed !== null
    const hasEnd = endParsed !== null
    if (!hasStart && !hasEnd) return ''
    const startStr = hasStart ? formatDisplay(startParsed!.hour24, startParsed!.minute, startParsed!.second) : ''
    const endStr = hasEnd ? formatDisplay(endParsed!.hour24, endParsed!.minute, endParsed!.second) : ''
    if (hasStart && hasEnd) return `${startStr} ~ ${endStr}`
    return startStr || endStr
  })

  function emitRange(start: string, end: string) {
    value = [start, end]
    onValueChange?.([start, end])
  }

  function emitStart(v: string) {
    emitRange(v, endValue || v)
  }

  function emitEnd(v: string) {
    emitRange(startValue || v, v)
  }

  function pickNow(which: 'start' | 'end') {
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
    const v = format === 'HH:mm:ss' ? `${hourStr}:${minStr}:${secStr}` : `${hourStr}:${minStr}`
    if (which === 'start') emitStart(v)
    else emitEnd(v)
  }

  function applyPreset(preset: TimeRangePreset) {
    if (readOnly) return
    value = preset.value
    onValueChange?.(preset.value)
    open = false
  }

  function clear(event: Event) {
    event.stopPropagation()
    if (disabled || readOnly) return
    value = null
    onValueChange?.(null)
  }

  const sizeClasses: Record<TimeRangePickerSize, string> = {
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
      'min-w-48 justify-start gap-2 text-left font-normal',
      !display && 'text-muted-foreground',
      sizeClasses[size],
      status && statusClasses[status],
      triggerClass,
      className,
    ),
  )

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

<div bind:this={ref} use:dismissable data-uipkge="" data-slot="time-range-picker" class="relative inline-block">
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
    {#if effectiveAllowClear && display && !disabled && !readOnly}
      <span
        role="button"
        tabindex="-1"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Clear time range"
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
      aria-label="Choose time range"
      data-slot="time-range-picker-content"
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
        <span class="text-muted-foreground text-xs tracking-widest uppercase">Time Range</span>
        <div class="flex gap-2">
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
            onclick={() => pickNow('start')}
          >
            Now (Start)
          </button>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
            onclick={() => pickNow('end')}
          >
            Now (End)
          </button>
        </div>
      </div>
      <div class="flex">
        <div class="flex flex-col">
          <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">Start</div>
          <TimeColumns
            value={startValue}
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
            onValueChange={emitStart}
          />
        </div>
        <div class="bg-border w-px"></div>
        <div class="flex flex-col">
          <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">End</div>
          <TimeColumns
            value={endValue}
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
            onValueChange={emitEnd}
          />
        </div>
      </div>
    </div>
  {/if}
</div>

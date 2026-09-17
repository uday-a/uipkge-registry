'use client'

import * as React from 'react'
import { Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm A'

export interface TimeParts {
  hour24: number
  minute: number
  second: number
}

export interface TimePreset {
  label: string
  value: string
}

export type TimePickerSize = 'small' | 'middle' | 'large'
export type TimePickerStatus = 'error' | 'warning'

function parse(v: string): TimeParts | null {
  if (!v) return null
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  const s = m[3] ? Number(m[3]) : 0
  if (
    Number.isNaN(h) ||
    Number.isNaN(min) ||
    Number.isNaN(s) ||
    h < 0 ||
    h > 23 ||
    min < 0 ||
    min > 59 ||
    s < 0 ||
    s > 59
  )
    return null
  return { hour24: h, minute: min, second: s }
}

function toMinutes(p: TimeParts) {
  return p.hour24 * 60 + p.minute + p.second / 60
}

// ---- TimeColumns ----

export interface TimeColumnsProps {
  /** Time value. HH:mm or HH:mm:ss depending on format. Empty = no selection. */
  value?: string
  onValueChange?: (value: string) => void
  use24Hour?: boolean
  use12Hours?: boolean
  minuteStep?: number
  hourStep?: number
  secondStep?: number
  /** 24h HH:mm or HH:mm:ss. */
  minTime?: string
  /** 24h HH:mm or HH:mm:ss. */
  maxTime?: string
  format?: TimeFormat
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  hideDisabledOptions?: boolean
  /** Auto-scroll active rows into view when this becomes true. */
  visible?: boolean
}

function TimeColumns({
  value = '',
  onValueChange,
  use24Hour = false,
  use12Hours = false,
  minuteStep = 5,
  hourStep = 1,
  secondStep = 1,
  minTime,
  maxTime,
  format = 'HH:mm',
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  hideDisabledOptions = false,
  visible = true,
}: TimeColumnsProps) {
  const parts = parse(value)

  function format24(p: TimeParts) {
    if (format === 'HH:mm:ss') {
      return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}:${String(p.second).padStart(2, '0')}`
    }
    return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
  }

  const showSeconds = format === 'HH:mm:ss'

  // Default to 24h columns. Opt into 12h via format="hh:mm A" or use12Hours.
  // use24Hour:false no longer inverts to 12h (that mismatched HH:mm demos).
  const effective12Hour = format === 'hh:mm A' ? true : use12Hours ? true : use24Hour ? false : false

  const hour12 = parts ? (parts.hour24 % 12 === 0 ? 12 : parts.hour24 % 12) : null
  const period = parts && parts.hour24 >= 12 ? 'PM' : 'AM'

  const minBound = parse(minTime ?? '') ?? null
  const maxBound = parse(maxTime ?? '') ?? null

  function withinBounds(p: TimeParts) {
    const m = toMinutes(p)
    if (minBound && m < toMinutes(minBound)) return false
    if (maxBound && m > toMinutes(maxBound)) return false
    return true
  }

  const disabledHoursSet = new Set(disabledHours ? disabledHours() : [])
  const disabledMinutesSet = new Set(disabledMinutes ? disabledMinutes(parts?.hour24 ?? 0) : [])
  const disabledSecondsSet = new Set(disabledSeconds ? disabledSeconds(parts?.hour24 ?? 0, parts?.minute ?? 0) : [])

  function isHourDisabledItem(h: number) {
    if (disabledHoursSet.has(h)) return true
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    if (effective12Hour) {
      const isPM = period === 'PM'
      return !withinBounds({ hour24: (h % 12) + (isPM ? 12 : 0), minute: cur.minute, second: cur.second })
    }
    return !withinBounds({ hour24: h, minute: cur.minute, second: cur.second })
  }

  function isMinuteDisabledItem(m: number) {
    if (disabledMinutesSet.has(m)) return true
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    return !withinBounds({ hour24: cur.hour24, minute: m, second: cur.second })
  }

  function isSecondDisabledItem(s: number) {
    if (disabledSecondsSet.has(s)) return true
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    return !withinBounds({ hour24: cur.hour24, minute: cur.minute, second: s })
  }

  const hourStepN = Math.max(1, hourStep)
  const hours12List = Array.from({ length: 12 }, (_, i) => i + 1)
    .filter((h) => (h - 1) % hourStepN === 0)
    .filter((h) => !hideDisabledOptions || !isHourDisabledItem(h))

  const hours24List = Array.from({ length: 24 }, (_, i) => i)
    .filter((h) => h % hourStepN === 0)
    .filter((h) => !hideDisabledOptions || !isHourDisabledItem(h))

  const minStepN = Math.max(1, Math.min(60, minuteStep))
  const minutesList = Array.from({ length: Math.ceil(60 / minStepN) }, (_, i) => i * minStepN).filter(
    (m) => !hideDisabledOptions || !isMinuteDisabledItem(m),
  )

  const secStepN = Math.max(1, Math.min(60, secondStep))
  const secondsList = Array.from({ length: Math.ceil(60 / secStepN) }, (_, i) => i * secStepN).filter(
    (s) => !hideDisabledOptions || !isSecondDisabledItem(s),
  )

  function commit(p: TimeParts) {
    if (!withinBounds(p)) return
    onValueChange?.(format24(p))
  }

  function pickHour12(h: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    const isPM = period === 'PM'
    commit({ hour24: (h % 12) + (isPM ? 12 : 0), minute: cur.minute, second: cur.second })
  }

  function pickHour24(h: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    commit({ hour24: h, minute: cur.minute, second: cur.second })
  }

  function pickMinute(m: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    commit({ hour24: cur.hour24, minute: m, second: cur.second })
  }

  function pickSecond(s: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    commit({ hour24: cur.hour24, minute: cur.minute, second: s })
  }

  function pickPeriod(p: 'AM' | 'PM') {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    const h12 = cur.hour24 % 12
    commit({ hour24: h12 + (p === 'PM' ? 12 : 0), minute: cur.minute, second: cur.second })
  }

  const hourCol = React.useRef<HTMLDivElement | null>(null)
  const minCol = React.useRef<HTMLDivElement | null>(null)
  const secCol = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!visible) return
    const raf = requestAnimationFrame(() => {
      hourCol.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'center' })
      minCol.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'center' })
      secCol.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'center' })
    })
    return () => cancelAnimationFrame(raf)
  }, [visible, value])

  function isHourActive(h: number) {
    if (!parts) return false
    return effective12Hour ? hour12 === h : parts.hour24 === h
  }

  function isHourDisabled(h: number) {
    if (!hideDisabledOptions) return isHourDisabledItem(h)
    return false
  }

  function isMinuteDisabled(m: number) {
    if (!hideDisabledOptions) return isMinuteDisabledItem(m)
    return false
  }

  function isSecondDisabled(s: number) {
    if (!hideDisabledOptions) return isSecondDisabledItem(s)
    return false
  }

  return (
    <div className="flex divide-x" data-uipkge="" data-slot="time-columns">
      <ScrollArea ref={hourCol} className="h-56">
        <div className="flex w-14 flex-col p-1">
          {(effective12Hour ? hours12List : hours24List).map((h) => (
            <button
              key={h}
              type="button"
              data-active={isHourActive(h)}
              disabled={isHourDisabled(h)}
              className={cn(
                'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                isHourActive(h) ? 'bg-primary text-primary-foreground hover:bg-primary' : '',
              )}
              onClick={() => (effective12Hour ? pickHour12(h) : pickHour24(h))}
            >
              {String(h).padStart(2, '0')}
            </button>
          ))}
        </div>
      </ScrollArea>

      <ScrollArea ref={minCol} className="h-56">
        <div className="flex w-14 flex-col p-1">
          {minutesList.map((m) => (
            <button
              key={m}
              type="button"
              data-active={parts?.minute === m}
              disabled={isMinuteDisabled(m)}
              className={cn(
                'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                parts?.minute === m ? 'bg-primary text-primary-foreground hover:bg-primary' : '',
              )}
              onClick={() => pickMinute(m)}
            >
              {String(m).padStart(2, '0')}
            </button>
          ))}
        </div>
      </ScrollArea>

      {showSeconds && (
        <ScrollArea ref={secCol} className="h-56">
          <div className="flex w-14 flex-col p-1">
            {secondsList.map((s) => (
              <button
                key={s}
                type="button"
                data-active={parts?.second === s}
                disabled={isSecondDisabled(s)}
                className={cn(
                  'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                  parts?.second === s ? 'bg-primary text-primary-foreground hover:bg-primary' : '',
                )}
                onClick={() => pickSecond(s)}
              >
                {String(s).padStart(2, '0')}
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      {effective12Hour && (
        <div className="flex w-12 flex-col p-1">
          {(['AM', 'PM'] as const).map((p) => (
            <button
              key={p}
              type="button"
              className={cn(
                'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
                period === p ? 'bg-primary text-primary-foreground hover:bg-primary' : '',
              )}
              onClick={() => pickPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- TimePicker ----

export interface TimePickerProps {
  /** Controlled value as 24h HH:mm or HH:mm:ss. Empty string = no selection. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  onValueChange?: (value: string) => void
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
  triggerClassName?: string
  className?: string
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

const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
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
      triggerClassName,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false)

    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState<string>(defaultValue)
    const currentValue = isControlled ? value : internal

    const effectiveAllowClear = allowClear !== undefined ? allowClear : clearable

    const parsed = parse(currentValue)

    function formatDisplay(h: number, m: number, s: number) {
      if (format === 'hh:mm A') {
        const h12 = h % 12 === 0 ? 12 : h % 12
        const p = h >= 12 ? 'PM' : 'AM'
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`
      }
      if (format === 'HH:mm:ss') {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      }
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }

    const display = parsed ? formatDisplay(parsed.hour24, parsed.minute, parsed.second) : ''

    function emitTime(v: string) {
      if (!isControlled) setInternal(v)
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
      setOpen(false)
    }

    function clear(event: React.MouseEvent | React.KeyboardEvent) {
      event.stopPropagation()
      if (disabled || readOnly) return
      emitTime('')
    }

    const triggerClasses = cn(
      'min-w-[160px] justify-start gap-2 text-left font-normal',
      !parsed && 'text-muted-foreground',
      sizeClasses[size],
      status && statusClasses[status],
      triggerClassName,
      className,
    )

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            className={triggerClasses}
            data-uipkge=""
            data-slot="time-picker"
          >
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">{display || placeholder}</span>
            {/* span (not button): nested interactive elements inside Button are invalid HTML */}
            {effectiveAllowClear && parsed && !disabled && !readOnly && (
              <span
                role="button"
                tabIndex={-1}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Clear time"
                onClick={clear}
                onMouseDown={(e) => e.preventDefault()}
              >
                <X className="size-3.5" aria-hidden="true" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {presets.length > 0 && (
            <div className="flex flex-col gap-0.5 border-b p-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-muted-foreground text-xs tracking-widest uppercase">Time</span>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
              onClick={pickNow}
            >
              Now
            </button>
          </div>
          <TimeColumns
            value={currentValue}
            use24Hour={use24Hour}
            use12Hours={use12Hours}
            minuteStep={minuteStep}
            hourStep={hourStep}
            secondStep={secondStep}
            minTime={minTime}
            maxTime={maxTime}
            format={format}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            hideDisabledOptions={hideDisabledOptions}
            visible={open}
            onValueChange={emitTime}
          />
        </PopoverContent>
      </Popover>
    )
  },
)
TimePicker.displayName = 'TimePicker'

// ---- TimeRangePicker ----

export interface TimeRangePreset {
  label: string
  value: [string, string]
}

export interface TimeRangePickerProps {
  value?: [string, string] | null
  onValueChange?: (value: [string, string] | null) => void
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
  size?: TimePickerSize
  status?: TimePickerStatus
  triggerClassName?: string
  className?: string
}

const TimeRangePicker = React.forwardRef<HTMLButtonElement, TimeRangePickerProps>(
  (
    {
      value: valueProp,
      onValueChange,
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
      triggerClassName,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false)
    const isControlled = valueProp !== undefined
    const [internal, setInternal] = React.useState<[string, string] | null>(null)
    const currentValue = isControlled ? valueProp : internal

    const effectiveAllowClear = allowClear !== undefined ? allowClear : clearable

    const startValue = currentValue?.[0] ?? ''
    const endValue = currentValue?.[1] ?? ''
    const startParsed = parse(startValue)
    const endParsed = parse(endValue)

    function formatDisplay(h: number, m: number, s: number) {
      if (format === 'hh:mm A') {
        const h12 = h % 12 === 0 ? 12 : h % 12
        const p = h >= 12 ? 'PM' : 'AM'
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`
      }
      if (format === 'HH:mm:ss') {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      }
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }

    const display = (() => {
      const hasStart = startParsed !== null
      const hasEnd = endParsed !== null
      if (!hasStart && !hasEnd) return ''
      const startStr = hasStart ? formatDisplay(startParsed.hour24, startParsed.minute, startParsed.second) : ''
      const endStr = hasEnd ? formatDisplay(endParsed.hour24, endParsed.minute, endParsed.second) : ''
      if (hasStart && hasEnd) return `${startStr} ~ ${endStr}`
      return startStr || endStr
    })()

    function emitRange(start: string, end: string) {
      const next: [string, string] = [start, end]
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
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
      if (!isControlled) setInternal(preset.value)
      onValueChange?.(preset.value)
      setOpen(false)
    }

    function clear(event: React.MouseEvent | React.KeyboardEvent) {
      event.stopPropagation()
      if (disabled || readOnly) return
      if (!isControlled) setInternal(null)
      onValueChange?.(null)
    }

    const triggerClasses = cn(
      'min-w-[200px] justify-start gap-2 text-left font-normal',
      !display && 'text-muted-foreground',
      sizeClasses[size],
      status && statusClasses[status],
      triggerClassName,
      className,
    )

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            className={triggerClasses}
            data-uipkge=""
            data-slot="time-range-picker"
          >
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">{display || placeholder}</span>
            {/* span (not button): nested interactive elements inside Button are invalid HTML */}
            {effectiveAllowClear && display && !disabled && !readOnly && (
              <span
                role="button"
                tabIndex={-1}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Clear time range"
                onClick={clear}
                onMouseDown={(e) => e.preventDefault()}
              >
                <X className="size-3.5" aria-hidden="true" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {presets.length > 0 && (
            <div className="flex flex-col gap-0.5 border-b p-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-muted-foreground text-xs tracking-widest uppercase">Time Range</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
                onClick={() => pickNow('start')}
              >
                Now (Start)
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
                onClick={() => pickNow('end')}
              >
                Now (End)
              </button>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col">
              <div className="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">Start</div>
              <TimeColumns
                value={startValue}
                use24Hour={use24Hour}
                use12Hours={use12Hours}
                minuteStep={minuteStep}
                hourStep={hourStep}
                secondStep={secondStep}
                minTime={minTime}
                maxTime={maxTime}
                format={format}
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
                disabledSeconds={disabledSeconds}
                hideDisabledOptions={hideDisabledOptions}
                visible={open}
                onValueChange={emitStart}
              />
            </div>
            <div className="bg-border w-px" />
            <div className="flex flex-col">
              <div className="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">End</div>
              <TimeColumns
                value={endValue}
                use24Hour={use24Hour}
                use12Hours={use12Hours}
                minuteStep={minuteStep}
                hourStep={hourStep}
                secondStep={secondStep}
                minTime={minTime}
                maxTime={maxTime}
                format={format}
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
                disabledSeconds={disabledSeconds}
                hideDisabledOptions={hideDisabledOptions}
                visible={open}
                onValueChange={emitEnd}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  },
)
TimeRangePicker.displayName = 'TimeRangePicker'

export { TimePicker, TimeColumns, TimeRangePicker }

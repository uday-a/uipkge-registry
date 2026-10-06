import { LitElement, css, html, nothing } from 'lit'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { autoUpdate, computePosition } from '../../lib/position'
import {
  coerceDate,
  coerceShape,
  defaultRangePresets,
  fmtDate,
  fmtMonth,
  fmtTime,
  stripTime,
  toISODate,
  toISODateTime,
  weekStart,
  type DatePickerLayout,
  type DatePickerPicker,
  type DatePickerPlacement,
  type DatePickerPreset,
  type DatePickerSize,
  type DatePickerStatus,
  type DatePickerType,
  type DisabledTimeResult,
  type FormatValue,
  type InternalMultiple,
  type InternalRange,
  type InternalSingle,
  type MultipleValue,
  type RangeValue,
  type SingleValue,
} from './date-picker-utils'

export type {
  DatePickerType,
  DatePickerLayout,
  DatePickerPicker,
  DatePickerStatus,
  DatePickerSize,
  DatePickerPlacement,
  FormatValue,
  SingleValue,
  MultipleValue,
  RangeValue,
  DatePickerPreset,
  DisabledTimeResult,
} from './date-picker-utils'

/**
 * <uip-date-picker> — Rich date/range/time picker with presets, validation states,
 * custom formatting, granularity pickers (day, week, month, quarter, year), and popover.
 */
export class UipDatePicker extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-block;
        position: relative;
        width: 100%;
      }
    `,
  ]

  static properties = {
    value: { attribute: false },
    defaultValue: { attribute: false },
    type: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
    readOnly: { type: Boolean, attribute: 'read-only' },
    clearable: { type: Boolean },
    format: { attribute: false },
    dateFormat: { attribute: false },
    locale: { type: String },
    numberOfMonths: { type: Number, attribute: 'number-of-months' },
    weekStartsOn: { type: Number, attribute: 'week-starts-on' },
    minValue: { attribute: 'min-value' },
    maxValue: { attribute: 'max-value' },
    layout: { type: String },
    picker: { type: String },
    showCurrentDate: { type: Boolean, attribute: 'show-current-date' },
    needConfirm: { type: Boolean, attribute: 'need-confirm' },
    status: { type: String },
    size: { type: String },
    placement: { type: String },
    separator: { type: String },
    showTime: { type: Boolean, attribute: 'show-time' },
    use24Hour: { type: Boolean, attribute: 'use-24-hour' },
    showSeconds: { type: Boolean, attribute: 'show-seconds' },
    presets: { type: Array, attribute: false },
    disabledDate: { attribute: false },
    disabledTime: { attribute: false },
    renderCell: { attribute: false },
    open: { state: true },
    viewMonth: { state: true },
    internalSelected: { state: true },
    tempHour: { state: true },
    tempMinute: { state: true },
    tempSecond: { state: true },
  }

  value?: SingleValue | MultipleValue | RangeValue
  defaultValue?: SingleValue | MultipleValue | RangeValue
  type: DatePickerType = 'single'
  placeholder?: string
  disabled = false
  readOnly = false
  clearable = true
  format: FormatValue = 'medium'
  dateFormat?: FormatValue
  locale = 'en-US'
  numberOfMonths = 1
  weekStartsOn: 0 | 1 = 0
  minValue?: string | Date
  maxValue?: string | Date
  layout: DatePickerLayout = 'default'
  picker: DatePickerPicker = 'day'
  showCurrentDate = false
  needConfirm = false
  status?: DatePickerStatus
  size: DatePickerSize = 'middle'
  placement: DatePickerPlacement = 'bottomLeft'
  separator = '—'
  showTime = false
  use24Hour = false
  showSeconds = false
  presets?: DatePickerPreset[]
  disabledDate?: (date: Date) => boolean
  disabledTime?: () => DisabledTimeResult
  renderCell?: (date: Date) => unknown

  open = false
  viewMonth: Date = stripTime(new Date())
  internalSelected: Date | Date[] | { start?: Date; end?: Date } | null = null
  tempHour = 12
  tempMinute = 0
  tempSecond = 0

  private cleanupAutoUpdate: (() => void) | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'date-picker')
    const initial = this.value ?? this.defaultValue
    if (initial !== undefined) {
      this.initValue(initial)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.cleanupPositioning()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value')) {
      if (this.value !== undefined) {
        this.initValue(this.value)
      }
    }
    if (changedProperties.has('open')) {
      if (this.open) {
        this.setupPositioning()
      } else {
        this.cleanupPositioning()
      }
      this.dispatchEvent(
        new CustomEvent('open-change', {
          detail: { open: this.open },
          bubbles: true,
          composed: true,
        }),
      )
    }
  }

  private initValue(val: SingleValue | MultipleValue | RangeValue) {
    if (this.type === 'multiple') {
      if (Array.isArray(val)) {
        this.internalSelected = val.map((x) => coerceDate(x)).filter((d): d is Date => d !== null)
      }
    } else if (this.type === 'range') {
      if (val && typeof val === 'object' && 'start' in val) {
        const start = coerceDate((val as any).start) ?? undefined
        const end = coerceDate((val as any).end) ?? undefined
        this.internalSelected = { start, end }
        if (start) this.viewMonth = new Date(start.getFullYear(), start.getMonth(), 1)
      }
    } else {
      const d = coerceDate(val as SingleValue)
      this.internalSelected = d
      if (d) {
        this.viewMonth = new Date(d.getFullYear(), d.getMonth(), 1)
        this.tempHour = d.getHours()
        this.tempMinute = d.getMinutes()
        this.tempSecond = d.getSeconds()
      }
    }
  }

  private setupPositioning() {
    const trigger = this.renderRoot.querySelector('[part=trigger]') as HTMLElement | null
    const popover = this.renderRoot.querySelector('[part=popover]') as HTMLElement | null
    if (!trigger || !popover) return

    const side = this.placement.startsWith('top') ? 'top' : this.placement.startsWith('left') ? 'left' : this.placement.startsWith('right') ? 'right' : 'bottom'
    const align = this.placement.endsWith('Left') || this.placement.endsWith('Start') ? 'start' : this.placement.endsWith('Right') || this.placement.endsWith('End') ? 'end' : 'center'

    this.cleanupPositioning()
    this.cleanupAutoUpdate = autoUpdate(trigger, popover, () => {
      const pos = computePosition(trigger, popover, { side, align, sideOffset: 4 })
      Object.assign(popover.style, pos.style)
    })
  }

  private cleanupPositioning() {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate()
      this.cleanupAutoUpdate = null
    }
  }

  private toggleOpen() {
    if (this.disabled || this.readOnly) return
    this.open = !this.open
  }

  private closePopover() {
    this.open = false
  }

  private selectDate(d: Date) {
    if (this.isDateDisabled(d)) return

    if (this.picker === 'week') {
      const start = weekStart(d, this.weekStartsOn)
      d = start
    } else if (this.picker === 'month') {
      d = new Date(d.getFullYear(), d.getMonth(), 1)
    } else if (this.picker === 'quarter') {
      const q = Math.floor(d.getMonth() / 3)
      d = new Date(d.getFullYear(), q * 3, 1)
    } else if (this.picker === 'year') {
      d = new Date(d.getFullYear(), 0, 1)
    }

    if (this.showTime) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), this.tempHour, this.tempMinute, this.tempSecond)
    }

    if (this.type === 'multiple') {
      const list = Array.isArray(this.internalSelected) ? [...this.internalSelected] : []
      const idx = list.findIndex((item) => stripTime(item).getTime() === stripTime(d).getTime())
      if (idx >= 0) list.splice(idx, 1)
      else list.push(d)
      this.internalSelected = list
      if (!this.needConfirm) this.emitValue(list.map((item) => toISODate(item)))
    } else if (this.type === 'range') {
      const r = (this.internalSelected as { start?: Date; end?: Date } | null) ?? {}
      if (!r.start || (r.start && r.end)) {
        this.internalSelected = { start: d, end: undefined }
      } else {
        const start = r.start
        if (d < start) {
          this.internalSelected = { start: d, end: start }
        } else {
          this.internalSelected = { start, end: d }
        }
        if (!this.needConfirm) {
          const finalRange = this.internalSelected as { start: Date; end: Date }
          this.emitValue({
            start: this.showTime ? toISODateTime(finalRange.start, this.showSeconds) : toISODate(finalRange.start),
            end: this.showTime ? toISODateTime(finalRange.end, this.showSeconds) : toISODate(finalRange.end),
          })
          this.closePopover()
        }
      }
    } else {
      this.internalSelected = d
      if (!this.needConfirm) {
        this.emitValue(this.showTime ? toISODateTime(d, this.showSeconds) : toISODate(d))
        this.closePopover()
      }
    }
    this.requestUpdate()
  }

  private confirmSelection() {
    if (this.type === 'range') {
      const r = this.internalSelected as { start?: Date; end?: Date } | null
      if (r?.start && r?.end) {
        this.emitValue({
          start: this.showTime ? toISODateTime(r.start, this.showSeconds) : toISODate(r.start),
          end: this.showTime ? toISODateTime(r.end, this.showSeconds) : toISODate(r.end),
        })
      }
    } else if (this.type === 'multiple') {
      const list = Array.isArray(this.internalSelected) ? this.internalSelected : []
      this.emitValue(list.map((item) => toISODate(item)))
    } else if (this.internalSelected instanceof Date) {
      this.emitValue(
        this.showTime
          ? toISODateTime(this.internalSelected, this.showSeconds)
          : toISODate(this.internalSelected),
      )
    }
    this.closePopover()
  }

  private emitValue(val: any) {
    this.value = val
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: val },
        bubbles: true,
        composed: true,
      }),
    )
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: val },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private isDateDisabled(d: Date): boolean {
    if (this.minValue) {
      const min = coerceDate(this.minValue)
      if (min && stripTime(d) < stripTime(min)) return true
    }
    if (this.maxValue) {
      const max = coerceDate(this.maxValue)
      if (max && stripTime(d) > stripTime(max)) return true
    }
    if (this.disabledDate && this.disabledDate(d)) return true
    return false
  }

  private handleClear(e: Event) {
    e.stopPropagation()
    this.internalSelected = null
    this.emitValue(null)
  }

  private applyPreset(preset: DatePickerPreset) {
    this.initValue(preset.value)
    if (!this.needConfirm) {
      const v = preset.value
      this.emitValue(v)
      this.closePopover()
    }
    this.requestUpdate()
  }

  private renderCalendarDays(baseMonth: Date) {
    const year = baseMonth.getFullYear()
    const month = baseMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const offset = (firstDay.getDay() - this.weekStartsOn + 7) % 7
    const days: Date[] = []

    // Previous month filler
    for (let i = offset; i > 0; i--) {
      days.push(new Date(year, month, 1 - i))
    }
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    // Trailing days
    const totalCells = Math.ceil(days.length / 7) * 7
    while (days.length < totalCells) {
      days.push(new Date(year, month + 1, days.length - totalCells + 1))
    }

    const todayTime = stripTime(new Date()).getTime()

    return html`
      <div class="space-y-2">
        <!-- Month Header -->
        <div class="flex items-center justify-between px-1">
          <button
            type="button"
            class="hover:bg-accent text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors"
            @click=${() => (this.viewMonth = new Date(year, month - 1, 1))}
          >
            ${icon(ChevronLeft, 'chevron-left', 'size-4')}
          </button>
          <span class="text-sm font-medium">${fmtMonth(baseMonth, this.locale)}</span>
          <button
            type="button"
            class="hover:bg-accent text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors"
            @click=${() => (this.viewMonth = new Date(year, month + 1, 1))}
          >
            ${icon(ChevronRight, 'chevron-right', 'size-4')}
          </button>
        </div>

        <!-- Weekdays -->
        <div class="grid grid-cols-7 text-center text-xs text-muted-foreground">
          ${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            .slice(this.weekStartsOn)
            .concat(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].slice(0, this.weekStartsOn))
            .map((wd) => html`<span class="py-1">${wd}</span>`)}
        </div>

        <!-- Day Cells Grid -->
        <div class="grid grid-cols-7 gap-1 text-xs">
          ${days.map((d) => {
            const isOutside = d.getMonth() !== month
            const isToday = stripTime(d).getTime() === todayTime
            const isDisabled = this.isDateDisabled(d)

            let isSelected = false
            let isInRange = false

            if (this.type === 'multiple' && Array.isArray(this.internalSelected)) {
              isSelected = this.internalSelected.some(
                (item) => stripTime(item).getTime() === stripTime(d).getTime(),
              )
            } else if (this.type === 'range' && this.internalSelected && 'start' in this.internalSelected) {
              const r = this.internalSelected as { start?: Date; end?: Date }
              if (r.start && stripTime(r.start).getTime() === stripTime(d).getTime()) isSelected = true
              if (r.end && stripTime(r.end).getTime() === stripTime(d).getTime()) isSelected = true
              if (r.start && r.end && d > r.start && d < r.end) isInRange = true
            } else if (this.internalSelected instanceof Date) {
              isSelected = stripTime(this.internalSelected).getTime() === stripTime(d).getTime()
            }

            return html`
              <button
                type="button"
                class=${cn(
                  'relative flex size-8 items-center justify-center rounded-md transition-colors',
                  isOutside && 'text-muted-foreground/40',
                  isToday && !isSelected && 'border border-primary text-primary font-medium',
                  isInRange && 'bg-primary/10 text-primary rounded-none',
                  isSelected && 'bg-primary text-primary-foreground font-semibold shadow-xs',
                  !isSelected && !isInRange && !isDisabled && 'hover:bg-accent hover:text-accent-foreground',
                  isDisabled && 'cursor-not-allowed opacity-40',
                )}
                ?disabled=${isDisabled}
                @click=${() => this.selectDate(d)}
              >
                ${this.renderCell ? this.renderCell(d) : d.getDate()}
              </button>
            `
          })}
        </div>
      </div>
    `
  }

  render() {
    const effectiveFormat = this.dateFormat ?? this.format

    const triggerLabel = (() => {
      if (!this.internalSelected) return this.placeholder ?? (this.type === 'range' ? 'Select date range' : 'Pick a date')
      if (this.type === 'multiple' && Array.isArray(this.internalSelected)) {
        return this.internalSelected.length
          ? `${this.internalSelected.length} dates selected`
          : this.placeholder ?? 'Select dates'
      }
      if (this.type === 'range' && 'start' in this.internalSelected) {
        const r = this.internalSelected as { start?: Date; end?: Date }
        if (!r.start) return this.placeholder ?? 'Select date range'
        const s = fmtDate(r.start, this.locale, effectiveFormat)
        const e = r.end ? fmtDate(r.end, this.locale, effectiveFormat) : ''
        return e ? `${s} ${this.separator} ${e}` : s
      }
      if (this.internalSelected instanceof Date) {
        const dt = fmtDate(this.internalSelected, this.locale, effectiveFormat)
        if (this.showTime) {
          const tm = fmtTime(this.internalSelected, this.showSeconds, this.use24Hour)
          return `${dt} ${tm}`
        }
        return dt
      }
      return this.placeholder ?? 'Pick a date'
    })()

    const sizeClass =
      this.size === 'small'
        ? 'h-8 px-2.5 text-xs'
        : this.size === 'large'
          ? 'h-10 px-3.5 text-base'
          : 'h-9 px-3 text-sm'

    const statusClass =
      this.status === 'error'
        ? 'border-destructive text-destructive focus-visible:ring-destructive'
        : this.status === 'warning'
          ? 'border-amber-500 text-amber-600 focus-visible:ring-amber-500'
          : 'border-input hover:border-accent-foreground/50'

    const activePresets = this.presets ?? (this.type === 'range' ? defaultRangePresets() : undefined)

    return html`
      <div part="base" class="relative inline-block w-full">
        <!-- Trigger button -->
        <button
          type="button"
          part="trigger"
          class=${cn(
            'bg-background focus-visible:ring-ring flex w-full items-center justify-between rounded-md border text-left font-normal transition-colors focus-visible:ring-2 focus-visible:outline-none select-none',
            sizeClass,
            statusClass,
            !this.internalSelected && 'text-muted-foreground',
            this.disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
          )}
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-haspopup="dialog"
          @click=${this.toggleOpen}
        >
          <div class="flex items-center gap-2 truncate">
            ${icon(CalendarIcon, 'calendar', 'text-muted-foreground size-4 shrink-0')}
            <span class="truncate">${triggerLabel}</span>
          </div>

          <div class="flex items-center gap-1">
            ${this.clearable && this.internalSelected
              ? html`
                  <span
                    role="button"
                    class="hover:bg-accent text-muted-foreground hover:text-foreground inline-flex size-5 items-center justify-center rounded p-0.5"
                    aria-label="Clear date"
                    @click=${this.handleClear}
                  >
                    ${icon(X, 'x', 'size-3.5')}
                  </span>
                `
              : nothing}
          </div>
        </button>

        <!-- Popover Content -->
        ${this.open
          ? html`
              <div
                part="popover"
                class="border-border bg-popover text-popover-foreground absolute z-50 mt-1 flex flex-col rounded-lg border p-3 shadow-lg outline-none animate-in fade-in-0 zoom-in-95"
              >
                <div class="flex gap-3">
                  <!-- Optional Presets Sidebar -->
                  ${activePresets && activePresets.length > 0
                    ? html`
                        <div class="border-border flex w-28 flex-col gap-1 border-r pr-3 text-xs">
                          ${activePresets.map(
                            (p) => html`
                              <button
                                type="button"
                                class="hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 text-left transition-colors"
                                @click=${() => this.applyPreset(p)}
                              >
                                ${p.label}
                              </button>
                            `,
                          )}
                        </div>
                      `
                    : nothing}

                  <!-- Month Calendar(s) -->
                  <div class="flex gap-4">
                    ${this.renderCalendarDays(this.viewMonth)}
                    ${this.numberOfMonths > 1
                      ? this.renderCalendarDays(
                          new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + 1, 1),
                        )
                      : nothing}
                  </div>
                </div>

                <!-- Footer (Time, Today shortcut, OK button) -->
                ${this.showTime || this.showCurrentDate || this.needConfirm
                  ? html`
                      <div class="border-border mt-3 flex items-center justify-between border-t pt-2 text-xs">
                        <div>
                          ${this.showCurrentDate
                            ? html`
                                <button
                                  type="button"
                                  class="text-primary hover:underline font-medium"
                                  @click=${() => this.selectDate(stripTime(new Date()))}
                                >
                                  Today
                                </button>
                              `
                            : nothing}
                        </div>
                        <div class="flex items-center gap-2">
                          ${this.needConfirm
                            ? html`
                                <button
                                  type="button"
                                  class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring rounded-md px-3 py-1 font-medium shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                  @click=${this.confirmSelection}
                                >
                                  OK
                                </button>
                              `
                            : nothing}
                        </div>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-date-picker') || customElements.define('uip-date-picker', UipDatePicker)

declare global {
  interface HTMLElementTagNameMap {
    'uip-date-picker': UipDatePicker
  }
}

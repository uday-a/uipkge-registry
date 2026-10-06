import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Clock, X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { autoUpdate, computePosition, type Align, type Side } from '../../lib/position'
import { buttonVariants } from '../button/button.variants'

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

export interface TimeRangePreset {
  label: string
  value: [string, string]
}

export type TimePickerSize = 'small' | 'middle' | 'large'
export type TimePickerStatus = 'error' | 'warning'

// Boolean props whose React default is `true`: `attr="false"` turns them off.
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }
// Optional booleans: absent → undefined (so `allowClear` can fall back to `clearable`, like React).
const optBoolean = {
  fromAttribute: (v: string | null) => (v === null ? undefined : v !== 'false'),
  toAttribute: () => null,
}

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

function format24(p: TimeParts, format: TimeFormat) {
  if (format === 'HH:mm:ss') {
    return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}:${String(p.second).padStart(2, '0')}`
  }
  return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

function formatDisplay(h: number, m: number, s: number, format: TimeFormat) {
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

const sizeClasses: Record<TimePickerSize, string> = {
  small: 'h-8 text-xs px-2.5 py-1',
  middle: 'h-9 text-sm px-3 py-1.5',
  large: 'h-11 text-base px-4 py-2',
}

const statusClasses: Record<string, string> = {
  error: 'border-destructive focus-visible:ring-destructive',
  warning: 'border-warning focus-visible:ring-warning',
}

// React wraps each column in a ScrollArea (h-56); the Lit columns scroll
// natively with the same height and a thin overlay-style scrollbar.
const columnScrollClasses =
  'h-56 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border'

const optionClasses =
  'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent'
const optionActiveClasses = 'bg-primary text-primary-foreground hover:bg-primary'
const periodClasses =
  'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none'

// React's PopoverContent classes with the picker's `w-auto p-0` overrides
// merged in (what cn() produces), plus the native-popover positioning set.
const panelClasses = cn(
  'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-auto origin-(--radix-popover-content-transform-origin) rounded-md border p-0 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
  'fixed inset-auto m-0 text-start',
)

// Radix's --radix-popover-content-transform-origin, from the placed side/align.
const alignPct: Record<Align, string> = { start: '0%', center: '50%', end: '100%' }
function transformOrigin(side: Side, align: Align) {
  const a = alignPct[align]
  return { top: `${a} 100%`, bottom: `${a} 0%`, left: `100% ${a}`, right: `0% ${a}` }[side]
}

/**
 * <uip-time-columns> — the registry TimeColumns (the hour/minute/second/
 * AM-PM option grid) as a web component. Also nested inside the pickers.
 *
 * Option classes are React's verbatim. `value` is 24h `HH:mm` or `HH:mm:ss`
 * (empty = no selection). 12-hour columns opt in via `format="hh:mm A"` or
 * `use-12-hours`. `disabled-hours` / `disabled-minutes` / `disabled-seconds`
 * are function properties (no attribute form). React's `visible` scrolls the
 * active rows into view when true.
 *
 * Events (bubble, composed): `value-change` (detail: { value }), `input` +
 * `change` (value on `.value`). Parts: `base`, `column`, `option`.
 */
export class UipTimeColumns extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: {},
    use24Hour: { type: Boolean, attribute: 'use-24-hour' },
    use12Hours: { type: Boolean, attribute: 'use-12-hours' },
    minuteStep: { type: Number, attribute: 'minute-step' },
    hourStep: { type: Number, attribute: 'hour-step' },
    secondStep: { type: Number, attribute: 'second-step' },
    minTime: { attribute: 'min-time' },
    maxTime: { attribute: 'max-time' },
    format: {},
    disabledHours: { attribute: false },
    disabledMinutes: { attribute: false },
    disabledSeconds: { attribute: false },
    hideDisabledOptions: { type: Boolean, attribute: 'hide-disabled-options' },
    visible: { type: Boolean, converter: trueByDefault },
  }

  value = ''
  use24Hour = false
  use12Hours = false
  minuteStep = 5
  hourStep = 1
  secondStep = 1
  minTime?: string
  maxTime?: string
  format: TimeFormat = 'HH:mm'
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  hideDisabledOptions = false
  visible = true

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'time-columns')
  }

  protected updated(changed: Map<string, unknown>) {
    if (isServer) return
    if ((changed.has('visible') || changed.has('value')) && this.visible) {
      // Auto-scroll active rows into view (React's visible effect).
      requestAnimationFrame(() => {
        this.renderRoot.querySelectorAll('[data-column]').forEach((col) => {
          col.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'center' })
        })
      })
    }
  }

  private emit(v: string) {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: v }, bubbles: true, composed: true }))
  }

  render() {
    const parts = parse(this.value)
    const showSeconds = this.format === 'HH:mm:ss'
    // Default to 24h columns. Opt into 12h via format="hh:mm A" or use12Hours.
    const effective12Hour = this.format === 'hh:mm A' ? true : this.use12Hours ? true : this.use24Hour ? false : false
    const hour12 = parts ? (parts.hour24 % 12 === 0 ? 12 : parts.hour24 % 12) : null
    const period = parts && parts.hour24 >= 12 ? 'PM' : 'AM'
    const minBound = parse(this.minTime ?? '') ?? null
    const maxBound = parse(this.maxTime ?? '') ?? null
    const withinBounds = (p: TimeParts) => {
      const m = toMinutes(p)
      if (minBound && m < toMinutes(minBound)) return false
      if (maxBound && m > toMinutes(maxBound)) return false
      return true
    }
    const disabledHoursSet = new Set(this.disabledHours ? this.disabledHours() : [])
    const disabledMinutesSet = new Set(this.disabledMinutes ? this.disabledMinutes(parts?.hour24 ?? 0) : [])
    const disabledSecondsSet = new Set(
      this.disabledSeconds ? this.disabledSeconds(parts?.hour24 ?? 0, parts?.minute ?? 0) : [],
    )
    const cur = () => parts ?? { hour24: 0, minute: 0, second: 0 }
    const isHourDisabledItem = (h: number) => {
      if (disabledHoursSet.has(h)) return true
      const c = cur()
      if (effective12Hour) {
        const isPM = period === 'PM'
        return !withinBounds({ hour24: (h % 12) + (isPM ? 12 : 0), minute: c.minute, second: c.second })
      }
      return !withinBounds({ hour24: h, minute: c.minute, second: c.second })
    }
    const isMinuteDisabledItem = (m: number) => {
      if (disabledMinutesSet.has(m)) return true
      const c = cur()
      return !withinBounds({ hour24: c.hour24, minute: m, second: c.second })
    }
    const isSecondDisabledItem = (s: number) => {
      if (disabledSecondsSet.has(s)) return true
      const c = cur()
      return !withinBounds({ hour24: c.hour24, minute: c.minute, second: s })
    }
    const hourStepN = Math.max(1, this.hourStep)
    const hours12List = Array.from({ length: 12 }, (_, i) => i + 1)
      .filter((h) => (h - 1) % hourStepN === 0)
      .filter((h) => !this.hideDisabledOptions || !isHourDisabledItem(h))
    const hours24List = Array.from({ length: 24 }, (_, i) => i)
      .filter((h) => h % hourStepN === 0)
      .filter((h) => !this.hideDisabledOptions || !isHourDisabledItem(h))
    const minStepN = Math.max(1, Math.min(60, this.minuteStep))
    const minutesList = Array.from({ length: Math.ceil(60 / minStepN) }, (_, i) => i * minStepN).filter(
      (m) => !this.hideDisabledOptions || !isMinuteDisabledItem(m),
    )
    const secStepN = Math.max(1, Math.min(60, this.secondStep))
    const secondsList = Array.from({ length: Math.ceil(60 / secStepN) }, (_, i) => i * secStepN).filter(
      (s) => !this.hideDisabledOptions || !isSecondDisabledItem(s),
    )
    const commit = (p: TimeParts) => {
      if (!withinBounds(p)) return
      this.emit(format24(p, this.format))
    }
    const pickHour12 = (h: number) => {
      const c = cur()
      const isPM = period === 'PM'
      commit({ hour24: (h % 12) + (isPM ? 12 : 0), minute: c.minute, second: c.second })
    }
    const pickHour24 = (h: number) => {
      const c = cur()
      commit({ hour24: h, minute: c.minute, second: c.second })
    }
    const pickMinute = (m: number) => {
      const c = cur()
      commit({ hour24: c.hour24, minute: m, second: c.second })
    }
    const pickSecond = (s: number) => {
      const c = cur()
      commit({ hour24: c.hour24, minute: c.minute, second: s })
    }
    const pickPeriod = (p: 'AM' | 'PM') => {
      const c = cur()
      const h12 = c.hour24 % 12
      commit({ hour24: h12 + (p === 'PM' ? 12 : 0), minute: c.minute, second: c.second })
    }
    const isHourActive = (h: number) => {
      if (!parts) return false
      return effective12Hour ? hour12 === h : parts.hour24 === h
    }
    const isHourDisabled = (h: number) => (!this.hideDisabledOptions ? isHourDisabledItem(h) : false)
    const isMinuteDisabled = (m: number) => (!this.hideDisabledOptions ? isMinuteDisabledItem(m) : false)
    const isSecondDisabled = (s: number) => (!this.hideDisabledOptions ? isSecondDisabledItem(s) : false)

    const hours = effective12Hour ? hours12List : hours24List
    return html`<div part="base" class="flex divide-x" data-uipkge="" data-slot="time-columns">
      <div part="column" data-column="hour" class=${columnScrollClasses}>
        <div class="flex w-14 flex-col p-1">
          ${hours.map(
            (h) => html`<button
              part="option"
              type="button"
              data-active=${isHourActive(h)}
              ?disabled=${isHourDisabled(h)}
              class=${cn(optionClasses, isHourActive(h) ? optionActiveClasses : '')}
              @click=${() => (effective12Hour ? pickHour12(h) : pickHour24(h))}
            >
              ${String(h).padStart(2, '0')}
            </button>`,
          )}
        </div>
      </div>

      <div part="column" data-column="minute" class=${columnScrollClasses}>
        <div class="flex w-14 flex-col p-1">
          ${minutesList.map(
            (m) => html`<button
              part="option"
              type="button"
              data-active=${parts?.minute === m}
              ?disabled=${isMinuteDisabled(m)}
              class=${cn(optionClasses, parts?.minute === m ? optionActiveClasses : '')}
              @click=${() => pickMinute(m)}
            >
              ${String(m).padStart(2, '0')}
            </button>`,
          )}
        </div>
      </div>

      ${showSeconds
        ? html`<div part="column" data-column="second" class=${columnScrollClasses}>
            <div class="flex w-14 flex-col p-1">
              ${secondsList.map(
                (s) => html`<button
                  part="option"
                  type="button"
                  data-active=${parts?.second === s}
                  ?disabled=${isSecondDisabled(s)}
                  class=${cn(optionClasses, parts?.second === s ? optionActiveClasses : '')}
                  @click=${() => pickSecond(s)}
                >
                  ${String(s).padStart(2, '0')}
                </button>`,
              )}
            </div>
          </div>`
        : nothing}
      ${effective12Hour
        ? html`<div part="column" data-column="period" class="flex w-12 flex-col p-1">
            ${(['AM', 'PM'] as const).map(
              (p) => html`<button
                part="option"
                type="button"
                class=${cn(periodClasses, period === p ? optionActiveClasses : '')}
                @click=${() => pickPeriod(p)}
              >
                ${p}
              </button>`,
            )}
          </div>`
        : nothing}
    </div>`
  }
}

/** Shared panel behaviour for the pickers: open state, native-popover panel, positioning, dismissal. */
class TimePickerPanel extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    state: { state: true },
    placedSide: { state: true },
    pos: { state: true },
  }

  open = false
  protected state: 'open' | 'closed' = 'closed'
  protected placedSide: Side = 'bottom'
  protected pos: Record<string, string> = {}
  private stopAutoUpdate?: () => void
  private returnFocus = true

  constructor() {
    super()
    new ThemeController(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.teardown()
  }

  protected get trigger(): HTMLElement | undefined {
    return this.renderRoot.querySelector<HTMLElement>('[part=trigger]') ?? undefined
  }

  protected get panel(): HTMLElement | undefined {
    return this.renderRoot.querySelector<HTMLElement>('[part=content]') ?? undefined
  }

  show() {
    this.setOpen(true)
  }

  hide() {
    this.setOpen(false)
  }

  toggle() {
    this.setOpen(!this.open)
  }

  protected setOpen(open: boolean) {
    if (this.open === open) return
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  private onDocPointerDown = (e: PointerEvent) => {
    if (e.composedPath().includes(this)) return
    this.returnFocus = false
    this.setOpen(false)
  }

  private onDocKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !this.open) return
    e.stopPropagation()
    this.setOpen(false)
  }

  private onFocusOut = (e: FocusEvent) => {
    const to = e.relatedTarget as Node | null
    if (!this.open || !to) return
    if (this.contains(to) || this.renderRoot.contains(to)) return
    this.returnFocus = false
    this.setOpen(false)
  }

  protected syncPanel(changed: Map<string, unknown>) {
    if (isServer) return
    const trigger = this.trigger
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'dialog')
      trigger.setAttribute('aria-expanded', String(this.open))
      trigger.setAttribute('data-state', this.state)
    }
    if (!changed.has('open')) return
    const panel = this.panel
    if (!panel) return
    if (this.open) {
      this.returnFocus = true
      if (!panel.matches(':popover-open')) panel.showPopover()
      addEventListener('pointerdown', this.onDocPointerDown, true)
      addEventListener('keydown', this.onDocKeyDown, true)
      this.addEventListener('focusout', this.onFocusOut)
      this.updateComplete.then(() => {
        if (!this.open) return
        if (trigger && !this.stopAutoUpdate) {
          this.stopAutoUpdate = autoUpdate(trigger, panel, () => this.place())
          Promise.all(panel.getAnimations().map((a) => a.finished)).then(() => this.open && this.place(), () => {})
        }
        // Focus the first selected option so keyboard users land in the grid.
        const active = panel.querySelector<HTMLElement>('[data-active="true"]')
        ;(active ?? panel).focus()
      })
    } else if (changed.get('open') === true) {
      this.teardown()
      if (this.returnFocus) trigger?.focus()
      let hidden = false
      const done = () => {
        if (hidden || this.open) return
        hidden = true
        if (panel.matches(':popover-open')) panel.hidePopover()
      }
      setTimeout(done, 400)
      const anims = panel.getAnimations()
      if (anims.length) Promise.all(anims.map((a) => a.finished)).then(done, done)
      else done()
    }
  }

  private teardown() {
    this.stopAutoUpdate?.()
    this.stopAutoUpdate = undefined
    removeEventListener('pointerdown', this.onDocPointerDown, true)
    removeEventListener('keydown', this.onDocKeyDown, true)
    this.removeEventListener('focusout', this.onFocusOut)
  }

  private place() {
    const trigger = this.trigger
    const panel = this.panel
    if (!trigger || !panel) return
    const { style, side, align } = computePosition(trigger, panel, { side: 'bottom', align: 'start', sideOffset: 4 })
    this.pos = { ...style, '--radix-popover-content-transform-origin': transformOrigin(side, align) }
    this.placedSide = side
  }

  /** Snap "now" to the configured steps (React's pickNow math). */
  protected nowValue(secondStep: number, minuteStep: number, format: TimeFormat) {
    const d = new Date()
    const sStep = Math.max(1, secondStep)
    const snappedS = Math.round(d.getSeconds() / sStep) * sStep
    const secCarry = Math.floor(snappedS / 60)
    const s = snappedS % 60
    const mStep = Math.max(1, minuteStep)
    const snappedM = Math.round((d.getMinutes() + secCarry) / mStep) * mStep
    const minCarry = Math.floor(snappedM / 60)
    const min = snappedM % 60
    const h = (d.getHours() + minCarry) % 24
    return formatDisplay(h, min, s, 'HH:mm:ss').slice(0, format === 'HH:mm:ss' ? 8 : 5)
  }
}

const presetsConverter = {
  fromAttribute: (v: string | null) => {
    if (v === null || v.trim() === '') return undefined
    try {
      const parsed = JSON.parse(v)
      return Array.isArray(parsed) ? parsed : undefined
    } catch {
      return undefined
    }
  },
  toAttribute: () => null,
}

/**
 * <uip-time-picker> — the registry TimePicker as a web component.
 *
 *   <uip-time-picker default-value="09:30" presets='[{"label":"Noon","value":"12:00"}]'></uip-time-picker>
 *
 * Trigger, preset, header, and option class strings are React's verbatim. The
 * panel is a native popover (align start, like React's PopoverContent) with
 * the same presets list, Time/Now header, and a nested <uip-time-columns>.
 * `value` is controlled (24h `HH:mm` / `HH:mm:ss`); `default-value` starts an
 * uncontrolled instance. `presets` is a property or a JSON attribute.
 * `disabled-hours` / `disabled-minutes` / `disabled-seconds` are function
 * properties. React's `readOnly` is the native `readonly` attribute;
 * `clearable`/`allow-clear` default true (`="false"` to disable).
 *
 * Events (bubble, composed): `value-change` (detail: { value } — React's
 * `onValueChange`), `input` + `change` (value on `.value`), `open-change`
 * (detail: { open }). Parts: `trigger`, `content`, `preset`, `now`.
 */
export class UipTimePicker extends TimePickerPanel {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    ...TimePickerPanel.properties,
    value: {},
    defaultValue: { attribute: 'default-value' },
    placeholder: {},
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    clearable: { type: Boolean, converter: trueByDefault },
    allowClear: { type: Boolean, attribute: 'allow-clear', converter: optBoolean },
    minuteStep: { type: Number, attribute: 'minute-step' },
    hourStep: { type: Number, attribute: 'hour-step' },
    secondStep: { type: Number, attribute: 'second-step' },
    use24Hour: { type: Boolean, attribute: 'use-24-hour' },
    use12Hours: { type: Boolean, attribute: 'use-12-hours' },
    minTime: { attribute: 'min-time' },
    maxTime: { attribute: 'max-time' },
    format: {},
    disabledHours: { attribute: false },
    disabledMinutes: { attribute: false },
    disabledSeconds: { attribute: false },
    hideDisabledOptions: { type: Boolean, attribute: 'hide-disabled-options' },
    presets: { converter: presetsConverter },
    size: { reflect: true },
    status: { reflect: true },
    internal: { state: true },
  }

  value?: string
  defaultValue = ''
  placeholder = 'Pick a time'
  disabled = false
  readOnly = false
  clearable = true
  allowClear?: boolean
  minuteStep = 5
  hourStep = 1
  secondStep = 1
  use24Hour = false
  use12Hours = false
  minTime?: string
  maxTime?: string
  format: TimeFormat = 'HH:mm'
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  hideDisabledOptions = false
  presets: TimePreset[] = []
  size: TimePickerSize = 'middle'
  status?: TimePickerStatus
  private internal = ''

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'time-picker')
    this.internal = this.defaultValue
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('open')) this.state = this.open ? 'open' : 'closed'
  }

  protected updated(changed: Map<string, unknown>) {
    this.syncPanel(changed)
  }

  private get currentValue() {
    return this.value !== undefined ? this.value : this.internal
  }

  private emitTime(v: string) {
    if (this.value === undefined) this.internal = v
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: v }, bubbles: true, composed: true }))
  }

  private pickNow() {
    if (this.readOnly) return
    this.emitTime(this.nowValue(this.secondStep, this.minuteStep, this.format))
  }

  private applyPreset(preset: TimePreset) {
    if (this.readOnly) return
    this.emitTime(preset.value)
    this.setOpen(false)
  }

  private clear(e: Event) {
    e.stopPropagation()
    if (this.disabled || this.readOnly) return
    this.emitTime('')
  }

  render() {
    const currentValue = this.currentValue
    const parsed = parse(currentValue)
    const display = parsed ? formatDisplay(parsed.hour24, parsed.minute, parsed.second, this.format) : ''
    const effectiveAllowClear = this.allowClear !== undefined ? this.allowClear : this.clearable
    const triggerClasses = cn(
      'min-w-[160px] justify-start gap-2 text-left font-normal',
      !parsed && 'text-muted-foreground',
      sizeClasses[this.size],
      this.status && statusClasses[this.status],
    )
    return html`
      <button
        part="trigger"
        type="button"
        data-uipkge=""
        data-slot="time-picker"
        ?disabled=${this.disabled}
        class=${cn(buttonVariants({ variant: 'outline' }), triggerClasses, 'grow')}
        @click=${() => {
          if (!this.disabled) this.toggle()
        }}
      >
        ${icon(Clock, 'clock', 'size-4 shrink-0')}
        <span class="flex-1 truncate">${display || this.placeholder}</span>
        ${effectiveAllowClear && parsed && !this.disabled && !this.readOnly
          ? html`<!-- span (not button): nested interactive elements inside Button are invalid HTML -->
              <span
                role="button"
                tabindex="-1"
                class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Clear time"
                @click=${this.clear}
                @mousedown=${(e: Event) => e.preventDefault()}
              >
                ${icon(X, 'x', 'size-3.5')}
              </span>`
          : nothing}
      </button>
      <div
        part="content"
        role="dialog"
        tabindex="-1"
        popover="manual"
        data-uipkge=""
        data-slot="time-picker-content"
        data-state=${this.state}
        data-side=${this.placedSide}
        data-align="start"
        style=${styleMap(this.pos)}
        class=${panelClasses}
      >
        ${this.presets.length > 0
          ? html`<div class="flex flex-col gap-0.5 border-b p-2">
              ${this.presets.map(
                (p) => html`<button
                  part="preset"
                  type="button"
                  class="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  @click=${() => this.applyPreset(p)}
                >
                  ${p.label}
                </button>`,
              )}
            </div>`
          : nothing}
        <div class="flex items-center justify-between border-b px-3 py-2">
          <span class="text-muted-foreground text-xs tracking-widest uppercase">Time</span>
          <button
            part="now"
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
            @click=${() => this.pickNow()}
          >
            Now
          </button>
        </div>
        <uip-time-columns
          value=${currentValue}
          ?use-24-hour=${this.use24Hour}
          ?use-12-hours=${this.use12Hours}
          minute-step=${this.minuteStep}
          hour-step=${this.hourStep}
          second-step=${this.secondStep}
          min-time=${this.minTime ?? nothing}
          max-time=${this.maxTime ?? nothing}
          format=${this.format}
          ?hide-disabled-options=${this.hideDisabledOptions}
          .visible=${this.open}
          .disabledHours=${this.disabledHours}
          .disabledMinutes=${this.disabledMinutes}
          .disabledSeconds=${this.disabledSeconds}
          @value-change=${(e: CustomEvent) => this.emitTime(e.detail.value)}
        ></uip-time-columns>
      </div>
    `
  }
}

/**
 * <uip-time-range-picker> — the registry TimeRangePicker as a web component.
 *
 * `value` is a `[start, end]` pair (`"09:00,17:00"` attribute, array property,
 * `null` = empty); the panel shows Start/End <uip-time-columns> side by side
 * with Now (Start) / Now (End) shortcuts. Otherwise the same API, classes,
 * and events as <uip-time-picker> (`value-change` detail: { value } with the
 * pair, plus `open-change`; no `input`/`change` — the value is a pair).
 */
export class UipTimeRangePicker extends TimePickerPanel {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    ...TimePickerPanel.properties,
    value: {
      converter: {
        fromAttribute: (v: string | null): [string, string] | null | undefined => {
          if (v === null) return undefined
          if (v.trim() === '') return null
          const [a, b] = v.split(/\s*,\s*/)
          return [a ?? '', b ?? '']
        },
        toAttribute: () => null,
      },
    },
    placeholder: {},
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    clearable: { type: Boolean, converter: trueByDefault },
    allowClear: { type: Boolean, attribute: 'allow-clear', converter: optBoolean },
    minuteStep: { type: Number, attribute: 'minute-step' },
    hourStep: { type: Number, attribute: 'hour-step' },
    secondStep: { type: Number, attribute: 'second-step' },
    use24Hour: { type: Boolean, attribute: 'use-24-hour' },
    use12Hours: { type: Boolean, attribute: 'use-12-hours' },
    minTime: { attribute: 'min-time' },
    maxTime: { attribute: 'max-time' },
    format: {},
    disabledHours: { attribute: false },
    disabledMinutes: { attribute: false },
    disabledSeconds: { attribute: false },
    hideDisabledOptions: { type: Boolean, attribute: 'hide-disabled-options' },
    presets: { converter: presetsConverter },
    size: { reflect: true },
    status: { reflect: true },
    internal: { state: true },
  }

  value?: [string, string] | null
  placeholder = 'Pick a time range'
  disabled = false
  readOnly = false
  clearable = true
  allowClear?: boolean
  minuteStep = 5
  hourStep = 1
  secondStep = 1
  use24Hour = false
  use12Hours = false
  minTime?: string
  maxTime?: string
  format: TimeFormat = 'HH:mm'
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  hideDisabledOptions = false
  presets: TimeRangePreset[] = []
  size: TimePickerSize = 'middle'
  status?: TimePickerStatus
  private internal: [string, string] | null = null

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'time-range-picker')
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('open')) this.state = this.open ? 'open' : 'closed'
  }

  protected updated(changed: Map<string, unknown>) {
    this.syncPanel(changed)
  }

  private get currentValue() {
    return this.value !== undefined ? this.value : this.internal
  }

  private emitRange(start: string, end: string) {
    const next: [string, string] = [start, end]
    if (this.value === undefined) this.internal = next
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
  }

  private emitStart(v: string) {
    this.emitRange(v, this.currentValue?.[1] || v)
  }

  private emitEnd(v: string) {
    this.emitRange(this.currentValue?.[0] || v, v)
  }

  private pickNow(which: 'start' | 'end') {
    if (this.readOnly) return
    const v = this.nowValue(this.secondStep, this.minuteStep, this.format)
    if (which === 'start') this.emitStart(v)
    else this.emitEnd(v)
  }

  private applyPreset(preset: TimeRangePreset) {
    if (this.readOnly) return
    if (this.value === undefined) this.internal = preset.value
    this.dispatchEvent(
      new CustomEvent('value-change', { detail: { value: preset.value }, bubbles: true, composed: true }),
    )
    this.setOpen(false)
  }

  private clear(e: Event) {
    e.stopPropagation()
    if (this.disabled || this.readOnly) return
    if (this.value === undefined) this.internal = null
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: null }, bubbles: true, composed: true }))
  }

  private columnsProps(which: 'start' | 'end') {
    const v = which === 'start' ? (this.currentValue?.[0] ?? '') : (this.currentValue?.[1] ?? '')
    return {
      value: v,
      onPick: which === 'start' ? this.emitStart.bind(this) : this.emitEnd.bind(this),
    }
  }

  render() {
    const startValue = this.currentValue?.[0] ?? ''
    const endValue = this.currentValue?.[1] ?? ''
    const startParsed = parse(startValue)
    const endParsed = parse(endValue)
    const display = (() => {
      const hasStart = startParsed !== null
      const hasEnd = endParsed !== null
      if (!hasStart && !hasEnd) return ''
      const startStr = hasStart ? formatDisplay(startParsed.hour24, startParsed.minute, startParsed.second, this.format) : ''
      const endStr = hasEnd ? formatDisplay(endParsed.hour24, endParsed.minute, endParsed.second, this.format) : ''
      if (hasStart && hasEnd) return `${startStr} ~ ${endStr}`
      return startStr || endStr
    })()
    const effectiveAllowClear = this.allowClear !== undefined ? this.allowClear : this.clearable
    const triggerClasses = cn(
      'min-w-[200px] justify-start gap-2 text-left font-normal',
      !display && 'text-muted-foreground',
      sizeClasses[this.size],
      this.status && statusClasses[this.status],
    )
    const cols = (which: 'start' | 'end') => {
      const { value, onPick } = this.columnsProps(which)
      return html`<uip-time-columns
        value=${value}
        ?use-24-hour=${this.use24Hour}
        ?use-12-hours=${this.use12Hours}
        minute-step=${this.minuteStep}
        hour-step=${this.hourStep}
        second-step=${this.secondStep}
        min-time=${this.minTime ?? nothing}
        max-time=${this.maxTime ?? nothing}
        format=${this.format}
        ?hide-disabled-options=${this.hideDisabledOptions}
        .visible=${this.open}
        .disabledHours=${this.disabledHours}
        .disabledMinutes=${this.disabledMinutes}
        .disabledSeconds=${this.disabledSeconds}
        @value-change=${(e: CustomEvent) => onPick(e.detail.value)}
      ></uip-time-columns>`
    }
    return html`
      <button
        part="trigger"
        type="button"
        data-uipkge=""
        data-slot="time-range-picker"
        ?disabled=${this.disabled}
        class=${cn(buttonVariants({ variant: 'outline' }), triggerClasses, 'grow')}
        @click=${() => {
          if (!this.disabled) this.toggle()
        }}
      >
        ${icon(Clock, 'clock', 'size-4 shrink-0')}
        <span class="flex-1 truncate">${display || this.placeholder}</span>
        ${effectiveAllowClear && display && !this.disabled && !this.readOnly
          ? html`<!-- span (not button): nested interactive elements inside Button are invalid HTML -->
              <span
                role="button"
                tabindex="-1"
                class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Clear time range"
                @click=${this.clear}
                @mousedown=${(e: Event) => e.preventDefault()}
              >
                ${icon(X, 'x', 'size-3.5')}
              </span>`
          : nothing}
      </button>
      <div
        part="content"
        role="dialog"
        tabindex="-1"
        popover="manual"
        data-uipkge=""
        data-slot="time-range-picker-content"
        data-state=${this.state}
        data-side=${this.placedSide}
        data-align="start"
        style=${styleMap(this.pos)}
        class=${panelClasses}
      >
        ${this.presets.length > 0
          ? html`<div class="flex flex-col gap-0.5 border-b p-2">
              ${this.presets.map(
                (p) => html`<button
                  part="preset"
                  type="button"
                  class="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  @click=${() => this.applyPreset(p)}
                >
                  ${p.label}
                </button>`,
              )}
            </div>`
          : nothing}
        <div class="flex items-center justify-between border-b px-3 py-2">
          <span class="text-muted-foreground text-xs tracking-widest uppercase">Time Range</span>
          <div class="flex gap-2">
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
              @click=${() => this.pickNow('start')}
            >
              Now (Start)
            </button>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
              @click=${() => this.pickNow('end')}
            >
              Now (End)
            </button>
          </div>
        </div>
        <div class="flex">
          <div class="flex flex-col">
            <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">Start</div>
            ${cols('start')}
          </div>
          <div class="bg-border w-px"></div>
          <div class="flex flex-col">
            <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">End</div>
            ${cols('end')}
          </div>
        </div>
      </div>
    `
  }
}

customElements.get('uip-time-picker') || customElements.define('uip-time-picker', UipTimePicker)
customElements.get('uip-time-columns') || customElements.define('uip-time-columns', UipTimeColumns)
customElements.get('uip-time-range-picker') || customElements.define('uip-time-range-picker', UipTimeRangePicker)

declare global {
  interface HTMLElementTagNameMap {
    'uip-time-picker': UipTimePicker
    'uip-time-columns': UipTimeColumns
    'uip-time-range-picker': UipTimeRangePicker
  }
}

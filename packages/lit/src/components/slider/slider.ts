import { LitElement, css, html, nothing, type PropertyValues } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { computePosition } from '../../lib/position'

export interface SliderMark {
  label: string
  /** Inline style for the label, as a (camelCase or kebab-case) style object. */
  style?: Record<string, string | number | undefined>
}

type Tooltip = boolean | ((value: number) => string)

const PAGE_KEYS = ['PageUp', 'PageDown']
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const BACK_KEYS: Record<string, string[]> = {
  'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
  'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
}

// --- Radix slider math, verbatim --------------------------------------------
const clamp = (v: number, [lo, hi]: [number, number]) => Math.min(hi, Math.max(lo, v))
function getDecimalCount(value: number) {
  if (!Number.isFinite(value)) return 0
  const str = value.toString()
  if (str.includes('e')) {
    const [coefficient, exponent] = str.split('e')
    return Math.max(0, (coefficient.split('.')[1] || '').length - Number(exponent))
  }
  return str.split('.')[1]?.length ?? 0
}
const roundValue = (value: number, decimals: number) => Math.round(value * 10 ** decimals) / 10 ** decimals
const linearScale = (input: [number, number], output: [number, number]) => (value: number) => {
  if (input[0] === input[1] || output[0] === output[1]) return output[0]
  return output[0] + ((output[1] - output[0]) / (input[1] - input[0])) * (value - input[0])
}
function getNextStepValue(value: number, min: number, step: number, direction: number, multiplier: number) {
  const decimals = getDecimalCount(step)
  const stepsFromMin = (value - min) / step
  const nearest = Math.round(stepsFromMin)
  const aligned = roundValue(nearest * step + min, decimals) === roundValue(value, decimals)
  const next = aligned ? nearest + multiplier * direction : direction > 0 ? Math.ceil(stepsFromMin) : Math.floor(stepsFromMin)
  return roundValue(next * step + min, decimals)
}
function getThumbInBoundsOffset(width: number, percent: number, direction: number) {
  const half = width / 2
  return (half - linearScale([0, 50], [0, half])(percent) * direction) * direction
}
function getClosestValueIndex(values: number[], next: number) {
  if (values.length === 1) return 0
  const distances = values.map((v) => Math.abs(v - next))
  return distances.indexOf(Math.min(...distances))
}
function thumbLabel(index: number, total: number) {
  if (total > 2) return `Value ${index + 1} of ${total}`
  if (total === 2) return ['Minimum', 'Maximum'][index]
  return undefined
}

/** "50" / "20,80" / "[20,80]" → number[] */
const numberList = {
  fromAttribute: (v: string | null) =>
    v == null
      ? undefined
      : v
          .replace(/[[\]\s]/g, '')
          .split(',')
          .filter(Boolean)
          .map(Number),
  toAttribute: (v: number[] | undefined) => v?.join(','),
}
/** Boolean props that default to true: only the literal `"false"` turns them off. */
const trueUnlessFalse = { fromAttribute: (v: string | null) => v !== 'false' }

let uid = 0

/**
 * <uip-slider> — the registry Slider (Radix slider + tooltip) as ONE web component.
 *
 * Same props as React: `value` / `default-value` (number[]; attribute "20,80"),
 * `min`, `max`, `step`, `range`, `vertical`, `height`, `marks` (object property,
 * or JSON attribute), `tooltip` (boolean or formatter function; `tooltip="false"`
 * hides it), `dots`, `reverse`, `included` (`included="false"` hides the fill),
 * `size` ('small' | 'default'), `disabled`, `name`, `min-steps-between-thumbs`.
 *
 * Events (bubble, composed):
 *  - `input` + `value-change` (detail: number[]) on every value change (React `onValueChange`);
 *  - `change` + `value-commit` (detail: number[]) when a drag ends or a key commits (React `onValueCommit`).
 *
 * Form-associated: submits `name=value` (one thumb) or `name[]=…` per thumb (range), like
 * Radix's hidden inputs; resets with its form.
 *
 * Shadow-DOM adaptations: React's injected motion <style> is re-expressed as `motion-safe:`
 * utilities on the range/thumb; the tooltip is a native popover in the same shadow root
 * (thumb `aria-describedby` → tooltip) positioned with `computePosition`.
 */
export class UipSlider extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { converter: numberList },
    defaultValue: { attribute: 'default-value', converter: numberList },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    minStepsBetweenThumbs: { type: Number, attribute: 'min-steps-between-thumbs' },
    range: { type: Boolean },
    vertical: { type: Boolean, reflect: true },
    height: {},
    marks: { type: Object },
    tooltip: { converter: trueUnlessFalse },
    dots: { type: Boolean },
    reverse: { type: Boolean },
    included: { converter: trueUnlessFalse },
    size: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    hoverIndex: { state: true },
    focusIndex: { state: true },
    dragging: { state: true },
  }

  value?: number[]
  defaultValue?: number[]
  min = 0
  max = 100
  step = 1
  minStepsBetweenThumbs = 0
  range = false
  vertical = false
  height?: string | number
  marks?: Record<number, string | SliderMark>
  tooltip: Tooltip = true
  dots = false
  reverse = false
  included = true
  size: 'small' | 'default' = 'default'
  disabled = false
  name?: string
  accessibleLabel?: string
  private hoverIndex = -1
  private focusIndex = -1
  private dragging = false

  private activeIndex = 0
  private initialValue: number[] = []
  private valuesBeforeSlide: number[] = []
  private pointerFocus = false
  private rect?: DOMRect
  private readonly uidBase = `uip-slider-${++uid}`
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'slider')
  }

  private get values(): number[] {
    return this.value ?? []
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (this.value === undefined) {
      this.value = this.defaultValue ?? (this.range ? [this.min, this.max] : [this.min])
    }
    if (!this.hasUpdated) this.initialValue = [...this.value]
    if (changed.has('value') || changed.has('name')) {
      const vals = this.values
      if (!this.name) this.internals.setFormValue(null)
      else if (vals.length === 1) this.internals.setFormValue(String(vals[0]))
      else {
        const fd = new FormData()
        vals.forEach((v) => fd.append(`${this.name}[]`, String(v)))
        this.internals.setFormValue(fd)
      }
    }
  }

  // --- form callbacks -------------------------------------------------------
  formResetCallback() {
    this.value = [...this.initialValue]
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  // --- orientation helpers (Radix SliderHorizontal / SliderVertical) ----------
  private get slideDirection() {
    if (this.vertical) return this.reverse ? 'from-top' : 'from-bottom'
    return this.reverse ? 'from-right' : 'from-left'
  }
  private get edges(): { start: string; end: string; direction: 1 | -1 } {
    switch (this.slideDirection) {
      case 'from-right':
        return { start: 'right', end: 'left', direction: -1 }
      case 'from-bottom':
        return { start: 'bottom', end: 'top', direction: 1 }
      case 'from-top':
        return { start: 'top', end: 'bottom', direction: -1 }
      default:
        return { start: 'left', end: 'right', direction: 1 }
    }
  }
  private percent(v: number) {
    return clamp((100 / (this.max - this.min)) * (v - this.min), [0, 100])
  }
  private get root() {
    return this.renderRoot?.querySelector<HTMLElement>('[data-slot=slider]')
  }
  private get thumbs() {
    return [...(this.renderRoot?.querySelectorAll<HTMLElement>('[role=slider]') ?? [])]
  }

  // --- value updates (Radix updateValues) -----------------------------------
  private updateValues(raw: number, atIndex: number, commit = false) {
    const decimals = getDecimalCount(this.step)
    const snapped = roundValue(Math.round((raw - this.min) / this.step) * this.step + this.min, decimals)
    const nextValue = clamp(snapped, [this.min, this.max])
    const prev = this.values
    const next = [...prev]
    next[atIndex] = nextValue
    next.sort((a, b) => a - b)
    const minGap = this.minStepsBetweenThumbs * this.step
    if (minGap > 0 && Math.min(...next.slice(0, -1).map((v, i) => next[i + 1] - v)) < minGap) return
    this.activeIndex = next.indexOf(nextValue)
    if (String(next) === String(prev)) return
    this.value = next
    this.emit('input', 'value-change')
    if (commit) this.emit('change', 'value-commit')
    // Radix moves focus to the thumb that now holds the changed value.
    this.updateComplete.then(() => this.thumbs[this.activeIndex]?.focus({ preventScroll: true }))
  }

  private emit(native: 'input' | 'change', custom: 'value-change' | 'value-commit') {
    this.dispatchEvent(new Event(native, { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent(custom, { detail: [...this.values], bubbles: true, composed: true }))
  }

  private valueFromPointer(e: PointerEvent) {
    const rect = (this.rect ??= this.root!.getBoundingClientRect())
    if (this.vertical) {
      const out: [number, number] = this.reverse ? [this.min, this.max] : [this.max, this.min]
      return linearScale([0, rect.height], out)(e.clientY - rect.top)
    }
    const out: [number, number] = this.reverse ? [this.max, this.min] : [this.min, this.max]
    return linearScale([0, rect.width], out)(e.clientX - rect.left)
  }

  // --- pointer (Radix SliderImpl) -------------------------------------------
  private onPointerDown(e: PointerEvent) {
    if (this.disabled || e.button !== 0) return
    const target = e.target as HTMLElement
    this.valuesBeforeSlide = [...this.values]
    this.pointerFocus = true
    target.setPointerCapture(e.pointerId)
    e.preventDefault()
    this.dragging = true
    if (target.getAttribute('role') === 'slider') {
      target.focus({ preventScroll: true })
    } else {
      const v = this.valueFromPointer(e)
      this.updateValues(v, getClosestValueIndex(this.values, v))
    }
  }
  private onPointerMove(e: PointerEvent) {
    const target = e.target as HTMLElement
    if (target.hasPointerCapture?.(e.pointerId)) this.updateValues(this.valueFromPointer(e), this.activeIndex)
  }
  private onPointerUp(e: PointerEvent) {
    const target = e.target as HTMLElement
    if (!target.hasPointerCapture?.(e.pointerId)) return
    target.releasePointerCapture(e.pointerId)
    this.rect = undefined
    this.dragging = false
    this.pointerFocus = false
    if (String(this.values) !== String(this.valuesBeforeSlide)) this.emit('change', 'value-commit')
  }

  // --- keyboard (Radix SliderImpl + Slider) ---------------------------------
  private onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return
    if (e.key === 'Home') {
      this.updateValues(this.min, 0, true)
    } else if (e.key === 'End') {
      this.updateValues(this.max, this.values.length - 1, true)
    } else if (PAGE_KEYS.includes(e.key) || ARROW_KEYS.includes(e.key)) {
      const dir = BACK_KEYS[this.slideDirection].includes(e.key) ? -1 : 1
      const skip = PAGE_KEYS.includes(e.key) || (e.shiftKey && ARROW_KEYS.includes(e.key))
      const at = this.activeIndex
      this.updateValues(getNextStepValue(this.values[at], this.min, this.step, dir, skip ? 10 : 1), at, true)
    } else return
    e.preventDefault()
  }

  private onThumbFocus(i: number) {
    this.activeIndex = i
    // Radix Tooltip opens on keyboard focus only (not on the focus a press causes).
    if (!this.pointerFocus) this.focusIndex = i
  }

  // --- tooltip ----------------------------------------------------------------
  private get openTip() {
    if (this.tooltip === false || this.disabled) return -1
    if (this.dragging) return this.activeIndex
    return this.hoverIndex >= 0 ? this.hoverIndex : this.focusIndex
  }
  private format(v: number) {
    return typeof this.tooltip === 'function' ? this.tooltip(v) : String(v)
  }

  protected updated() {
    const open = this.openTip
    this.renderRoot.querySelectorAll<HTMLElement>('[role=tooltip]').forEach((tip, i) => {
      if (i !== open) {
        if (tip.matches(':popover-open')) tip.hidePopover()
        return
      }
      if (!tip.matches(':popover-open')) tip.showPopover()
      const thumb = this.thumbs[i]
      if (!thumb) return
      const { style, side } = computePosition(thumb, tip, { side: this.vertical ? 'right' : 'top', sideOffset: 9 })
      Object.assign(tip.style, style)
      tip.dataset.side = side
    })
  }

  render() {
    const horizontal = !this.vertical
    const vals = this.values
    const { start, end, direction } = this.edges
    const small = this.size === 'small'
    const trackSize = small ? (horizontal ? 'h-1' : 'w-1') : horizontal ? 'h-1.5' : 'w-1.5'
    const thumbSize = small ? 'size-3' : 'size-4'
    const thumbPx = small ? 12 : 16
    const orientation = horizontal ? 'horizontal' : 'vertical'
    const pcts = vals.map((v) => this.percent(v))
    const rangeStart = vals.length > 1 ? Math.min(...pcts) : 0
    const rangeEnd = 100 - Math.max(...pcts)
    const span = this.max - this.min

    const markList = Object.entries(this.marks ?? {})
      .map(([k, m]) => ({
        value: Number(k),
        label: typeof m === 'string' ? m : m.label,
        style: typeof m === 'string' ? undefined : m.style,
        pct: ((Number(k) - this.min) / span) * 100,
      }))
      .sort((a, b) => a.value - b.value)
    const dotList: number[] = []
    if (this.dots) for (let i = 0; i <= Math.floor(span / this.step); i++) dotList.push(this.min + i * this.step)

    const thumbClass = cn(
      'border-primary bg-background ring-ring/50 block shrink-0 rounded-full border shadow-sm touch-manipulation hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none',
      thumbSize,
      // React's injected motion stylesheet, as utilities.
      'motion-safe:transition-[color,box-shadow,border-color,scale,left,right,top,bottom] motion-safe:duration-150 motion-safe:ease-emphasized motion-safe:active:not-data-[disabled]:scale-94 motion-safe:active:not-data-[disabled]:duration-100 motion-safe:group-active/slider:transition-[color,box-shadow,border-color,scale] motion-safe:group-active/slider:duration-100',
    )
    const heightStyle =
      !horizontal && this.height != null
        ? { height: typeof this.height === 'number' || /^\d+(\.\d+)?$/.test(this.height) ? `${this.height}px` : this.height }
        : {}

    return html`<div class=${cn('relative w-full', !horizontal && 'flex flex-col items-center')} style=${styleMap(heightStyle)}>
      <span
        part="root"
        data-uipkge=""
        data-slot="slider"
        data-orientation=${orientation}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        ?data-disabled=${this.disabled}
        dir="ltr"
        class=${cn(
          'relative flex touch-none select-none data-[disabled]:opacity-50',
          horizontal ? 'w-full items-center' : 'h-full min-h-44 flex-col justify-center',
          'group/slider',
        )}
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @lostpointercapture=${() => (this.dragging = false)}
        @keydown=${this.onKeyDown}
      >
        <span
          part="track"
          data-uipkge=""
          data-slot="slider-track"
          data-orientation=${orientation}
          ?data-disabled=${this.disabled}
          class=${cn('bg-muted relative grow overflow-hidden rounded-full', trackSize)}
        >
          ${this.included
            ? html`<span
                part="range"
                data-uipkge=""
                data-slot="slider-range"
                data-orientation=${orientation}
                ?data-disabled=${this.disabled}
                class=${cn(
                  'bg-primary absolute',
                  horizontal ? 'h-full' : 'w-full',
                  'motion-safe:transition-[left,right,top,bottom] motion-safe:duration-150 motion-safe:ease-emphasized motion-safe:group-active/slider:transition-none',
                )}
                style=${styleMap({ [start]: `${rangeStart}%`, [end]: `${rangeEnd}%` })}
              ></span>`
            : nothing}
        </span>
        ${dotList.map(
          (dot) => html`<div
            class=${cn(
              'border-primary/40 bg-background absolute rounded-full border',
              horizontal ? 'top-1/2 size-1.5 -translate-y-1/2' : 'left-1/2 size-1.5 -translate-x-1/2',
              small && 'size-1',
              horizontal ? 'transform-[translateX(-50%)_translateY(-50%)]' : 'transform-[translateX(-50%)_translateY(50%)]',
            )}
            style=${styleMap(horizontal ? { left: `${((dot - this.min) / span) * 100}%` } : { bottom: `${((dot - this.min) / span) * 100}%` })}
          ></div>`,
        )}
        ${markList.length
          ? html`<div
              class=${cn('pointer-events-none absolute', horizontal ? 'top-full mt-2.5 h-5 w-full' : 'top-0 left-full ml-3 h-full w-20')}
            >
              ${markList.map(
                (m) => html`<span
                  class=${cn(
                    'text-muted-foreground absolute text-xs whitespace-nowrap',
                    horizontal ? 'transform-[translateX(-50%)]' : 'transform-[translateY(50%)]',
                  )}
                  style=${styleMap({ ...m.style, ...(horizontal ? { left: `${m.pct}%` } : { bottom: `${m.pct}%` }) })}
                  >${m.label}</span
                >`,
              )}
            </div>`
          : nothing}
        ${vals.map((v, i) => {
          const pct = this.percent(v)
          const tipId = `${this.uidBase}-tip-${i}`
          const open = this.openTip === i
          return html`<span
              class=${cn('absolute', horizontal ? '-translate-x-1/2' : 'translate-y-1/2')}
              style=${styleMap({ [start]: `calc(${pct}% + ${getThumbInBoundsOffset(thumbPx, pct, direction)}px)` })}
              ><span
                part="thumb"
                role="slider"
                data-uipkge=""
                data-slot="slider-thumb"
                aria-label=${(vals.length === 1 ? this.accessibleLabel : undefined) ?? thumbLabel(i, vals.length) ?? nothing}
                aria-valuemin=${this.min}
                aria-valuenow=${v}
                aria-valuemax=${this.max}
                aria-orientation=${orientation}
                aria-describedby=${open ? tipId : nothing}
                data-orientation=${orientation}
                data-state=${this.tooltip === false ? nothing : open ? 'instant-open' : 'closed'}
                ?data-disabled=${this.disabled}
                tabindex=${this.disabled ? nothing : 0}
                class=${thumbClass}
                @focus=${() => this.onThumbFocus(i)}
                @blur=${() => (this.focusIndex = -1)}
                @pointerenter=${(e: PointerEvent) => e.pointerType !== 'touch' && (this.hoverIndex = i)}
                @pointerleave=${() => (this.hoverIndex = -1)}
              ></span
            ></span>
            ${this.tooltip === false
              ? nothing
              : html`<div
                  id=${tipId}
                  role="tooltip"
                  popover="manual"
                  data-state=${open ? 'instant-open' : 'closed'}
                  data-align="center"
                  class="bg-foreground text-background z-50 w-fit rounded-md px-2 py-1 text-xs fixed inset-auto m-0 overflow-visible"
                >
                  ${this.format(v ?? 0)}
                  <span
                    class=${cn(
                      'absolute',
                      horizontal ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full' : 'top-1/2 left-0 -translate-x-full -translate-y-1/2',
                    )}
                    ><svg
                      class="bg-foreground fill-foreground size-2.5 rotate-45 rounded-[2px] block"
                      width="10"
                      height="5"
                      viewBox="0 0 30 10"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <polygon points="0,0 30,0 15,10" /></svg
                  ></span>
                </div>`}`
        })}
      </span>
    </div>`
  }
}

customElements.get('uip-slider') || customElements.define('uip-slider', UipSlider)

declare global {
  interface HTMLElementTagNameMap {
    'uip-slider': UipSlider
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const numberList = {
  fromAttribute: (v: string | null): [number, number] | undefined => {
    if (!v) return undefined
    const parts = v
      .replace(/[[\]\s]/g, '')
      .split(',')
      .filter(Boolean)
      .map(Number)
    if (parts.length >= 2) return [parts[0]!, parts[1]!]
    return undefined
  },
  toAttribute: (v: [number, number] | undefined): string | null => (v ? `${v[0]},${v[1]}` : null),
}

const colorClasses: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info',
}

const trackHeightClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

const thumbSizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

/**
 * <uip-range-slider> — the registry RangeSlider as a web component.
 *
 * Form-associated: submits `name[]=min&name[]=max` with its <form>.
 */
export class UipRangeSlider extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; width: 100%; }`]

  static properties = {
    value: { converter: numberList },
    defaultValue: { attribute: 'default-value', converter: numberList },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    disabled: { type: Boolean, reflect: true },
    label: {},
    hint: {},
    error: { type: Boolean, reflect: true },
    errorMessages: { attribute: 'error-messages' },
    color: {},
    thumbSize: { attribute: 'thumb-size' },
    trackHeight: { attribute: 'track-height' },
    showTicks: { type: Boolean, attribute: 'show-ticks' },
    tickInterval: { type: Number, attribute: 'tick-interval' },
    thumbLabel: { type: Boolean, attribute: 'thumb-label' },
    inverted: { type: Boolean, reflect: true },
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    activeThumb: { state: true },
    isDragging: { state: true },
  }

  value?: [number, number]
  defaultValue?: [number, number]
  min = 0
  max = 100
  step = 1
  disabled = false
  label?: string
  hint?: string
  error = false
  errorMessages?: string
  color = 'primary'
  thumbSize: 'sm' | 'md' | 'lg' = 'md'
  trackHeight: 'sm' | 'md' | 'lg' = 'md'
  showTicks = false
  tickInterval?: number
  thumbLabel = false
  inverted = false
  name?: string
  accessibleLabel?: string

  private activeThumb = 0
  private isDragging = false
  private initialValue: [number, number] = [0, 100]
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'range-slider')
    if (this.value === undefined) {
      this.value = this.defaultValue ?? [this.min, this.max]
    }
    this.initialValue = [...this.value]
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (this.value === undefined) {
      this.value = this.defaultValue ?? [this.min, this.max]
    }
    if (changed.has('value') || changed.has('name')) {
      const vals = this.currentValue
      if (!this.name) {
        this.internals.setFormValue(null)
      } else {
        const fd = new FormData()
        fd.append(`${this.name}[]`, String(vals[0]))
        fd.append(`${this.name}[]`, String(vals[1]))
        this.internals.setFormValue(fd)
      }
    }
  }

  formResetCallback() {
    this.commit([...this.initialValue])
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get currentValue(): [number, number] {
    return this.value ?? [this.min, this.max]
  }

  private commit(next: [number, number]) {
    const prev = this.currentValue
    this.value = next
    if (next[0] !== prev[0] || next[1] !== prev[1]) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
    }
  }

  private percent(v: number): number {
    return clamp(((v - this.min) / (this.max - this.min)) * 100, 0, 100)
  }

  private snap(v: number): number {
    const stepped = Math.round((v - this.min) / this.step) * this.step + this.min
    return clamp(stepped, this.min, this.max)
  }

  private get track(): HTMLElement | null {
    return this.renderRoot?.querySelector('[data-slot=slider-track]')
  }

  private getValueFromPointer(e: PointerEvent): number {
    const track = this.track
    if (!track) return this.min
    const rect = track.getBoundingClientRect()
    const fraction = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const raw = this.min + fraction * (this.max - this.min)
    return this.snap(raw)
  }

  private onPointerDown = (e: PointerEvent) => {
    if (this.disabled || e.button !== 0) return
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    this.isDragging = true

    const clickedVal = this.getValueFromPointer(e)
    const [lo, hi] = this.currentValue
    const distLo = Math.abs(clickedVal - lo)
    const distHi = Math.abs(clickedVal - hi)

    if (distLo <= distHi) {
      this.activeThumb = 0
      this.commit([Math.min(clickedVal, hi), hi])
    } else {
      this.activeThumb = 1
      this.commit([lo, Math.max(clickedVal, lo)])
    }
  }

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return
    const val = this.getValueFromPointer(e)
    const [lo, hi] = this.currentValue
    if (this.activeThumb === 0) {
      this.commit([Math.min(val, hi), hi])
    } else {
      this.commit([lo, Math.max(val, lo)])
    }
  }

  private onPointerUp = (e: PointerEvent) => {
    if (!this.isDragging) return
    this.isDragging = false
    const target = e.currentTarget as HTMLElement
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId)
    }
  }

  private onKeyDownThumb(index: 0 | 1, e: KeyboardEvent) {
    if (this.disabled) return
    const [lo, hi] = this.currentValue
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? this.step : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -this.step : 0
    if (delta !== 0) {
      e.preventDefault()
      if (index === 0) {
        this.commit([clamp(lo + delta, this.min, hi), hi])
      } else {
        this.commit([lo, clamp(hi + delta, lo, this.max)])
      }
    }
  }

  render() {
    const [lo, hi] = this.currentValue
    const pctLo = this.percent(lo)
    const pctHi = this.percent(hi)

    const hasError = this.error || !!this.errorMessages

    const thumbClass = cn(
      'border-primary ring-ring/50 bg-background block rounded-full border shadow-xs transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
      thumbSizeClasses[this.thumbSize],
      hasError && 'border-destructive',
    )

    const ticks: number[] = []
    if (this.showTicks && this.tickInterval) {
      for (let i = this.min; i <= this.max; i += this.tickInterval) {
        ticks.push(i)
      }
    }

    const rangeStart = this.inverted ? 0 : pctLo
    const rangeWidth = this.inverted ? pctLo : pctHi - pctLo

    return html`
      <div part="base" class="flex flex-col gap-2">
        ${this.label
          ? html`<label class="text-sm font-medium leading-none">${this.label}</label>`
          : nothing}
        ${this.hint && !hasError
          ? html`<p class="text-muted-foreground text-xs">${this.hint}</p>`
          : nothing}

        <div class="flex items-center gap-4">
          <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
            ${lo}
          </div>

          <div
            class="relative flex w-full touch-none items-center select-none py-4"
            @pointerdown=${this.onPointerDown}
            @pointermove=${this.onPointerMove}
            @pointerup=${this.onPointerUp}
          >
            <div
              data-slot="slider-track"
              class=${cn(
                'bg-muted relative w-full overflow-hidden rounded-full',
                trackHeightClasses[this.trackHeight],
              )}
            >
              <div
                data-slot="slider-range"
                class=${cn('absolute h-full', colorClasses[this.color] || colorClasses.primary)}
                style=${styleMap({
                  left: `${rangeStart}%`,
                  width: `${rangeWidth}%`,
                })}
              ></div>
            </div>

            ${this.showTicks && ticks.length > 0
              ? html`
                  <div
                    class="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-between"
                    aria-hidden="true"
                  >
                    ${ticks.map(
                      () => html`<div class="bg-muted-foreground/30 h-2 w-0.5 rounded-full"></div>`,
                    )}
                  </div>
                `
              : nothing}

            <!-- Thumb 0 (Min) -->
            <div
              role="slider"
              tabindex=${this.disabled ? -1 : 0}
              aria-label=${this.label ? `${this.label} minimum` : 'Minimum value'}
              aria-valuemin=${this.min}
              aria-valuemax=${hi}
              aria-valuenow=${lo}
              aria-disabled=${this.disabled ? 'true' : 'false'}
              data-slot="slider-thumb"
              class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style=${styleMap({ left: `${pctLo}%` })}
              @keydown=${(e: KeyboardEvent) => this.onKeyDownThumb(0, e)}
            >
              <div class=${thumbClass}></div>
              ${this.thumbLabel
                ? html`
                    <span
                      class="bg-background border border-border absolute -top-7 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap shadow-xs tabular-nums"
                    >
                      ${lo}
                    </span>
                  `
                : nothing}
            </div>

            <!-- Thumb 1 (Max) -->
            <div
              role="slider"
              tabindex=${this.disabled ? -1 : 0}
              aria-label=${this.label ? `${this.label} maximum` : 'Maximum value'}
              aria-valuemin=${lo}
              aria-valuemax=${this.max}
              aria-valuenow=${hi}
              aria-disabled=${this.disabled ? 'true' : 'false'}
              data-slot="slider-thumb"
              class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style=${styleMap({ left: `${pctHi}%` })}
              @keydown=${(e: KeyboardEvent) => this.onKeyDownThumb(1, e)}
            >
              <div class=${thumbClass}></div>
              ${this.thumbLabel
                ? html`
                    <span
                      class="bg-background border border-border absolute -top-7 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap shadow-xs tabular-nums"
                    >
                      ${hi}
                    </span>
                  `
                : nothing}
            </div>
          </div>

          <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums text-right" aria-hidden="true">
            ${hi}
          </div>
        </div>

        ${this.showTicks && ticks.length > 0
          ? html`
              <div class="text-muted-foreground flex justify-between px-1 text-xs" aria-hidden="true">
                <span>${this.min}</span>
                <span>${this.max}</span>
              </div>
            `
          : nothing}
        ${hasError && this.errorMessages
          ? html`
              <div class="flex flex-col gap-0.5" role="alert">
                <p class="text-destructive text-xs">${this.errorMessages}</p>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-range-slider') || customElements.define('uip-range-slider', UipRangeSlider)

declare global {
  interface HTMLElementTagNameMap {
    'uip-range-slider': UipRangeSlider
  }
}

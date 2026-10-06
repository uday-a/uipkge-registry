import { LitElement, css, html } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const startAngle = -Math.PI * 0.75
const endAngle = Math.PI * 0.75
const sweep = endAngle - startAngle

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  const x2 = cx + r * Math.cos(a2)
  const y2 = cy + r * Math.sin(a2)
  const large = a2 - a1 > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-knob> — the registry Knob as a web component.
 *
 * Form-associated: submits `name=value` with its <form>, supports reset.
 */
export class UipKnob extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: inline-block; vertical-align: middle; }`]

  static properties = {
    value: { type: Number, reflect: true },
    defaultValue: { type: Number, attribute: 'default-value' },
    name: { reflect: true },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    size: { type: Number },
    strokeWidth: { type: Number, attribute: 'stroke-width' },
    valueColor: { attribute: 'value-color' },
    rangeColor: { attribute: 'range-color' },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    showValue: { converter: trueUnlessFalse, attribute: 'show-value' },
    valueTemplate: { attribute: 'value-template' },
    accessibleLabel: { attribute: 'aria-label' },
    isDragging: { state: true },
  }

  value = 0
  defaultValue?: number
  name?: string
  min = 0
  max = 100
  step = 1
  size = 100
  strokeWidth = 14
  valueColor = 'var(--primary)'
  rangeColor = 'var(--muted)'
  disabled = false
  readOnly = false
  showValue = true
  valueTemplate?: string
  accessibleLabel = 'Value'

  private isDragging = false
  private initialValue = 0
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'knob')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
    this.addEventListener('wheel', this.onWheel, { passive: false })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('wheel', this.onWheel)
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(String(this.value ?? 0))
    }
  }

  formResetCallback() {
    this.setValue(this.initialValue)
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private snap(v: number) {
    const stepped = Math.round((v - this.min) / this.step) * this.step + this.min
    return clamp(stepped, this.min, this.max)
  }

  private setValue(v: number) {
    if (this.disabled || this.readOnly) return
    const next = this.snap(v)
    if (next === this.value) return
    this.value = next
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
  }

  private get svg(): SVGSVGElement | null {
    return this.renderRoot?.querySelector('svg')
  }

  private angleFromEvent(e: PointerEvent): number {
    const rect = this.svg!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(e.clientY - cy, e.clientX - cx)
  }

  private angleToValue(angle: number): number {
    let a = angle - startAngle
    if (a < 0) a += Math.PI * 2
    if (a > sweep) {
      return a < (Math.PI * 2 + sweep) / 2 ? this.max : this.min
    }
    return this.min + (a / sweep) * (this.max - this.min)
  }

  private onPointerDown(e: PointerEvent) {
    if (this.disabled || this.readOnly || e.button !== 0) return
    const target = e.currentTarget as Element
    target.setPointerCapture(e.pointerId)
    this.isDragging = true
    this.setValue(this.angleToValue(this.angleFromEvent(e)))
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.isDragging) return
    this.setValue(this.angleToValue(this.angleFromEvent(e)))
  }

  private onPointerUp(e: PointerEvent) {
    if (!this.isDragging) return
    this.isDragging = false
    const target = e.currentTarget as Element
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId)
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.disabled || this.readOnly) return
    const big = this.step * 10
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault()
        this.setValue(this.value + this.step)
        break
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault()
        this.setValue(this.value - this.step)
        break
      case 'PageUp':
        e.preventDefault()
        this.setValue(this.value + big)
        break
      case 'PageDown':
        e.preventDefault()
        this.setValue(this.value - big)
        break
      case 'Home':
        e.preventDefault()
        this.setValue(this.min)
        break
      case 'End':
        e.preventDefault()
        this.setValue(this.max)
        break
    }
  }

  private onWheel = (e: WheelEvent) => {
    if (this.disabled || this.readOnly) return
    if (this.matches(':focus-within') || this.matches(':hover')) {
      e.preventDefault()
      this.setValue(this.value + (e.deltaY < 0 ? this.step : -this.step))
    }
  }

  render() {
    const val = clamp(this.value, this.min, this.max)
    const percent = this.max === this.min ? 0 : (val - this.min) / (this.max - this.min)

    const rangePath = arcPath(50, 50, 40, startAngle, endAngle)
    const valuePath = arcPath(50, 50, 40, startAngle, startAngle + sweep * percent)

    const displayVal = this.valueTemplate ? this.valueTemplate.replace('{value}', String(val)) : String(val)

    return html`
      <svg
        part="base"
        data-uipkge=""
        data-slot="knob"
        class=${cn(
          'focus-visible:ring-ring inline-block touch-none rounded-full outline-none select-none focus-visible:ring-2',
          this.disabled && 'cursor-not-allowed opacity-50',
          !this.disabled && !this.readOnly && 'cursor-pointer',
        )}
        width=${this.size}
        height=${this.size}
        viewBox="0 0 100 100"
        role="slider"
        aria-label=${this.accessibleLabel}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${val}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-readonly=${this.readOnly ? 'true' : 'false'}
        tabindex=${this.disabled ? -1 : 0}
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.onPointerUp}
        @keydown=${this.onKeyDown}
      >
        <path d=${rangePath} stroke=${this.rangeColor} stroke-width=${this.strokeWidth} fill="none" stroke-linecap="round" />
        <path d=${valuePath} stroke=${this.valueColor} stroke-width=${this.strokeWidth} fill="none" stroke-linecap="round" />
        ${this.showValue
          ? html`
              <text x="50" y="55" text-anchor="middle" font-size="18" class="fill-foreground font-medium">
                ${displayVal}
              </text>
            `
          : null}
      </svg>
    `
  }
}

customElements.get('uip-knob') || customElements.define('uip-knob', UipKnob)

declare global {
  interface HTMLElementTagNameMap {
    'uip-knob': UipKnob
  }
}

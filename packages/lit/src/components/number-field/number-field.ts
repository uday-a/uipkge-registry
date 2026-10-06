import { LitElement, css, html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { Minus, Plus } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type NumberFieldSize = 'small' | 'middle' | 'large'
export type NumberFieldStatus = 'error' | 'warning'
export type NumberFieldControlsPosition = 'default' | 'right'

function clamp(value: number, min?: number, max?: number) {
  let next = value
  if (min !== undefined) next = Math.max(min, next)
  if (max !== undefined) next = Math.min(max, next)
  return next
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

const decrementIncrementBase =
  'focus-visible:ring-ring inline-flex shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30'

/**
 * <uip-number-field> — the registry NumberField as a web component.
 *
 * Form-associated: submits `name=value` with its <form>.
 */
export class UipNumberField extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: inline-block; vertical-align: middle; }`]

  static properties = {
    value: { type: Number, reflect: true },
    defaultValue: { type: Number, attribute: 'default-value' },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    precision: { type: Number },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    size: { reflect: true },
    status: { reflect: true },
    controlsPosition: { attribute: 'controls-position' },
    keyboard: { converter: trueUnlessFalse },
    prefixText: { attribute: 'prefix' },
    suffixText: { attribute: 'suffix' },
    placeholder: {},
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    displayValue: { state: true },
  }

  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step = 1
  precision?: number
  disabled = false
  readOnly = false
  size: NumberFieldSize = 'middle'
  status?: NumberFieldStatus
  controlsPosition: NumberFieldControlsPosition = 'default'
  keyboard = true
  prefixText?: string
  suffixText?: string
  placeholder?: string
  name?: string
  accessibleLabel?: string

  private displayValue = ''
  private isUserTyping = false
  private initialValue?: number
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'number-field')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
    this.displayValue = this.formatValue(this.value)
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(this.value !== undefined ? String(this.value) : '')
      if (!this.isUserTyping) {
        this.displayValue = this.formatValue(this.value)
      }
    }
  }

  formResetCallback() {
    this.emit(this.initialValue)
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private formatValue(val: number | undefined): string {
    if (val === undefined || Number.isNaN(val)) return ''
    if (this.precision !== undefined) {
      return val.toFixed(this.precision)
    }
    return String(val)
  }

  private emit(next: number | undefined) {
    const changed = this.value !== next
    this.value = next
    this.displayValue = this.formatValue(next)
    if (changed) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
    }
  }

  private stepBy(delta: number) {
    if (this.disabled || this.readOnly) return
    const base = this.value ?? 0
    const next = clamp(base + delta, this.min, this.max)
    this.isUserTyping = false
    this.emit(next)
  }

  private handleIncrease(mult = 1) {
    this.stepBy(this.step * mult)
  }

  private handleDecrease(mult = 1) {
    this.stepBy(-this.step * mult)
  }

  private commitValue() {
    this.isUserTyping = false
    const raw = this.displayValue.trim()
    if (raw === '') {
      this.emit(undefined)
      return
    }
    // Parse cleaned number
    const cleaned = raw.replace(/[^0-9.-]/g, '')
    const num = Number(cleaned)
    if (!Number.isNaN(num)) {
      const next = clamp(num, this.min, this.max)
      this.emit(next)
    } else {
      this.displayValue = this.formatValue(this.value)
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      if (this.keyboard) {
        event.preventDefault()
        this.handleIncrease()
      }
    } else if (event.key === 'ArrowDown') {
      if (this.keyboard) {
        event.preventDefault()
        this.handleDecrease()
      }
    } else if (event.key === 'PageUp') {
      if (this.keyboard) {
        event.preventDefault()
        this.handleIncrease(10)
      }
    } else if (event.key === 'PageDown') {
      if (this.keyboard) {
        event.preventDefault()
        this.handleDecrease(10)
      }
    } else if (event.key === 'Home') {
      if (this.keyboard && this.min !== undefined) {
        event.preventDefault()
        this.emit(this.min)
      }
    } else if (event.key === 'End') {
      if (this.keyboard && this.max !== undefined) {
        event.preventDefault()
        this.emit(this.max)
      }
    } else if (event.key === 'Enter') {
      this.commitValue()
    }
  }

  private handleWheel(event: WheelEvent) {
    if (!this.matches(':focus-within') && !this.matches(':hover')) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    if (event.deltaY > 0) this.handleDecrease()
    else this.handleIncrease()
  }

  render() {
    const isRight = this.controlsPosition === 'right'
    const currentValue = this.value
    const iconSize = this.size === 'small' ? 'h-3 w-3' : this.size === 'large' ? 'h-5 w-5' : 'h-4 w-4'
    const buttonPadding = !isRight ? (this.size === 'small' ? 'p-1.5' : this.size === 'large' ? 'p-4' : 'p-3') : ''

    const inputSizeClasses =
      this.size === 'small'
        ? 'h-7 text-xs px-2 py-0.5'
        : this.size === 'large'
          ? 'h-11 text-base px-4 py-2'
          : 'h-9 text-sm px-3 py-1'

    const inputStatusClasses = !isRight
      ? this.status === 'error'
        ? 'border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive'
        : this.status === 'warning'
          ? 'border-warning focus-visible:ring-warning/20'
          : ''
      : ''

    const contentClasses = cn(
      'relative inline-flex',
      isRight &&
        'border-input focus-within:ring-ring inline-grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr] items-stretch overflow-hidden rounded-md border focus-within:ring-1',
    )

    const decrement = html`
      <button
        type="button"
        data-uipkge=""
        data-slot="decrement"
        tabindex="-1"
        aria-label="Decrease"
        ?disabled=${this.disabled || this.readOnly || (this.min !== undefined && (currentValue ?? 0) <= this.min)}
        @click=${() => this.handleDecrease()}
        class=${cn(
          decrementIncrementBase,
          !isRight && 'absolute top-1/2 left-0 z-10 -translate-y-1/2',
          buttonPadding,
          isRight && 'hover:bg-accent col-start-2 row-start-2 h-full w-auto rounded-none border-t border-l p-0 px-2',
        )}
      >
        ${icon(Minus, 'minus', iconSize)}
      </button>
    `

    const increment = html`
      <button
        type="button"
        data-uipkge=""
        data-slot="increment"
        tabindex="-1"
        aria-label="Increase"
        ?disabled=${this.disabled || this.readOnly || (this.max !== undefined && (currentValue ?? 0) >= this.max)}
        @click=${() => this.handleIncrease()}
        class=${cn(
          decrementIncrementBase,
          !isRight && 'absolute top-1/2 right-0 z-10 -translate-y-1/2',
          buttonPadding,
          isRight && 'hover:bg-accent col-start-2 row-start-1 h-full w-auto rounded-none border-l p-0 px-2',
        )}
      >
        ${icon(Plus, 'plus', iconSize)}
      </button>
    `

    const inputBlock = html`
      <div
        data-uipkge=""
        data-slot="input"
        class=${cn(
          'relative flex-1',
          isRight && 'col-span-1 row-span-2',
          !isRight && '[&>input]:pr-9 [&>input]:pl-9',
        )}
      >
        ${this.prefixText
          ? html`<span class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm"
              >${this.prefixText}</span
            >`
          : nothing}
        <input
          part="input"
          .value=${live(this.displayValue)}
          type="text"
          role="spinbutton"
          name=${this.name ?? nothing}
          aria-label=${this.accessibleLabel ?? nothing}
          aria-valuenow=${currentValue !== undefined && !Number.isNaN(currentValue) ? currentValue : nothing}
          aria-valuemin=${this.min ?? nothing}
          aria-valuemax=${this.max ?? nothing}
          aria-invalid=${this.status === 'error' ? 'true' : nothing}
          inputmode=${this.precision !== undefined ? 'decimal' : 'numeric'}
          ?disabled=${this.disabled}
          ?readonly=${this.readOnly}
          placeholder=${this.placeholder ?? nothing}
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          aria-roledescription="Number field"
          @focus=${() => (this.isUserTyping = true)}
          @input=${(e: Event) => (this.displayValue = (e.target as HTMLInputElement).value)}
          @blur=${this.commitValue}
          @keydown=${this.handleKeyDown}
          @wheel=${this.handleWheel}
          class=${cn(
            'placeholder:text-muted-foreground w-full bg-transparent text-center shadow-xs transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
            !isRight && 'border-input focus-visible:ring-ring rounded-md border focus-visible:ring-1',
            isRight && 'rounded-none border-0 focus-visible:ring-0',
            this.prefixText && 'pl-6',
            this.suffixText && 'pr-6',
            inputSizeClasses,
            inputStatusClasses,
          )}
        />
        ${this.suffixText
          ? html`<span class="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-sm"
              >${this.suffixText}</span
            >`
          : nothing}
      </div>
    `

    return html`
      <div data-uipkge="" data-slot="number-field" class="inline-flex">
        <div class=${contentClasses}>
          ${decrement}
          ${inputBlock}
          ${increment}
        </div>
      </div>
    `
  }
}

customElements.get('uip-number-field') || customElements.define('uip-number-field', UipNumberField)

declare global {
  interface HTMLElementTagNameMap {
    'uip-number-field': UipNumberField
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

let uid = 0

/**
 * <uip-float-label> — the registry FloatLabel as a web component.
 */
export class UipFloatLabel extends LitElement {
  static styles = [tailwind, css`:host { display: block; position: relative; }`]

  static properties = {
    label: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    isFocused: { state: true },
    hasValue: { state: true },
  }

  label = ''
  required = false
  disabled = false
  private isFocused = false
  private hasValue = false
  private controlId = `float-label-ctrl-${++uid}`

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'float-label')
    this.addEventListener('focusin', this.handleFocusIn)
    this.addEventListener('focusout', this.handleFocusOut)
    this.addEventListener('input', this.handleInput)
    this.addEventListener('change', this.handleInput)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('focusin', this.handleFocusIn)
    this.removeEventListener('focusout', this.handleFocusOut)
    this.removeEventListener('input', this.handleInput)
    this.removeEventListener('change', this.handleInput)
  }

  firstUpdated() {
    this.checkValue()
  }

  private findControl(): HTMLElement | null {
    const slot = this.shadowRoot?.querySelector('slot')
    const assigned = slot?.assignedElements({ flatten: true }) ?? []
    for (const el of assigned) {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        return el
      }
      if ('value' in el && el instanceof HTMLElement) return el
      const inner = el.querySelector?.('input, textarea, select') as HTMLElement | null
      if (inner) return inner
    }
    return (this.querySelector('input, textarea, select') as HTMLElement) ?? null
  }

  private checkValue() {
    const el = this.findControl()
    if (!el) {
      this.hasValue = false
      return
    }
    if ('value' in el) {
      this.hasValue = Boolean((el as HTMLInputElement).value)
    } else {
      const input = el.querySelector?.('input, textarea, select') as HTMLInputElement | null
      this.hasValue = Boolean(input?.value)
    }
  }

  private handleFocusIn = () => {
    this.isFocused = true
    this.checkValue()
  }

  private handleFocusOut = () => {
    this.isFocused = false
    this.checkValue()
  }

  private handleInput = () => {
    this.checkValue()
  }

  private handleSlotChange = () => {
    this.checkValue()
  }

  private onLabelClick = () => {
    const control = this.findControl()
    control?.focus()
  }

  render() {
    const isFloating = this.isFocused || this.hasValue
    this.toggleAttribute('data-floating', isFloating)

    const labelClasses = cn(
      'text-muted-foreground pointer-events-none absolute left-3 z-10 bg-transparent px-1 text-sm transition-[color,background-color,top,translate,scale] duration-200 select-none origin-left',
      !isFloating && 'top-1/2 -translate-y-1/2',
      isFloating && 'top-0 -translate-y-1/2 scale-75 bg-background text-foreground',
      this.isFocused && 'text-ring',
      this.required && "after:text-destructive after:ml-0.5 after:content-['*']",
    )

    const wrapperClasses = cn('relative flex flex-col', this.disabled && 'opacity-50 cursor-not-allowed')

    return html`
      <div part="base" class=${wrapperClasses}>
        <label
          part="label"
          for=${this.controlId}
          class=${labelClasses}
          @click=${this.onLabelClick}
        >
          ${this.label}
        </label>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `
  }
}

customElements.get('uip-float-label') || customElements.define('uip-float-label', UipFloatLabel)

declare global {
  interface HTMLElementTagNameMap {
    'uip-float-label': UipFloatLabel
  }
}

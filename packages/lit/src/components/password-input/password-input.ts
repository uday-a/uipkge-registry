import { LitElement, css, html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { styleMap } from 'lit/directives/style-map.js'
import { Eye, EyeOff } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { passwordInputVariants, type PasswordInputVariants } from './password-input.variants'

interface StrengthResult {
  score: number
  label: 'weak' | 'fair' | 'good' | 'strong'
  color: string
  barColor: string
  percent: number
}

function computeStrength(pwd: string): StrengthResult {
  if (!pwd) return { score: 0, label: 'weak', color: '', barColor: 'bg-transparent', percent: 0 }

  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) {
    return { score, label: 'weak', color: 'text-destructive', barColor: 'bg-destructive', percent: 25 }
  }
  if (score <= 2) {
    return {
      score,
      label: 'fair',
      color: 'text-warning',
      barColor: 'bg-warning',
      percent: 50,
    }
  }
  if (score <= 3) {
    return {
      score,
      label: 'good',
      color: 'text-info',
      barColor: 'bg-info',
      percent: 75,
    }
  }
  return {
    score,
    label: 'strong',
    color: 'text-success',
    barColor: 'bg-success',
    percent: 100,
  }
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-password-input> — the registry PasswordInput as a web component.
 *
 * Form-associated: submits `name=value` with its <form>, supports reset and validity.
 */
export class UipPasswordInput extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    placeholder: {},
    size: { reflect: true },
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    required: { type: Boolean, reflect: true },
    showStrength: { type: Boolean, attribute: 'show-strength' },
    showToggle: { converter: trueUnlessFalse, attribute: 'show-toggle' },
    minLength: { type: Number, attribute: 'minlength' },
    maxLength: { type: Number, attribute: 'maxlength' },
    name: { reflect: true },
    autocomplete: {},
    accessibleLabel: { attribute: 'aria-label' },
    passwordVisible: { state: true },
    focused: { state: true },
  }

  value = ''
  defaultValue?: string
  placeholder = 'Enter password'
  size: NonNullable<PasswordInputVariants['size']> = 'default'
  variant: NonNullable<PasswordInputVariants['variant']> = 'outlined'
  disabled = false
  readOnly = false
  required = false
  showStrength = false
  showToggle = true
  minLength = 0
  maxLength?: number
  name?: string
  autocomplete = 'current-password'
  accessibleLabel?: string

  private passwordVisible = false
  private focused = false
  private initialValue = ''
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'password-input')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(this.value ?? '')
    }
  }

  protected updated() {
    this.syncValidity()
  }

  private get input() {
    return this.renderRoot?.querySelector<HTMLInputElement>('input')
  }

  private syncValidity() {
    const i = this.input
    if (!i) return
    if (i.validity.valid) this.internals.setValidity({})
    else this.internals.setValidity(i.validity, i.validationMessage, i)
  }

  formResetCallback() {
    this.value = this.initialValue
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private onChange() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  private onKeypress(e: KeyboardEvent) {
    if (e.key !== 'Enter' || e.defaultPrevented || this.disabled) return
    const form = this.internals.form
    if (!form) return
    e.preventDefault()
    form.requestSubmit()
  }

  private togglePassword() {
    if (this.disabled || this.readOnly) return
    this.passwordVisible = !this.passwordVisible
    this.input?.focus()
  }

  render() {
    const currentValue = this.value ?? ''
    const computedType = this.passwordVisible ? 'text' : 'password'
    const strength = computeStrength(currentValue)
    const meetsMinLength = currentValue.length >= this.minLength

    const wrapperClasses = cn(
      passwordInputVariants({ size: this.size, variant: this.variant }),
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
      this.disabled && 'pointer-events-none opacity-50 cursor-not-allowed bg-muted/30',
    )

    const inputPadding = this.size === 'sm' ? 'px-2.5' : this.size === 'lg' ? 'px-4' : 'px-3'
    const togglePadding = this.size === 'sm' ? 'pr-2' : this.size === 'lg' ? 'pr-3' : 'pr-2.5'

    return html`
      <div part="base" class="flex w-full flex-col gap-2">
        <div
          part="control"
          class=${wrapperClasses}
          data-slot="password-input"
          data-size=${this.size}
          data-variant=${this.variant}
        >
          <input
            part="input"
            .value=${live(currentValue)}
            type=${computedType}
            name=${this.name ?? nothing}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            minlength=${this.minLength > 0 ? this.minLength : nothing}
            maxlength=${this.maxLength ?? nothing}
            autocomplete=${this.autocomplete}
            aria-label=${this.accessibleLabel ?? nothing}
            class=${cn(
              'placeholder:text-muted-foreground w-full min-w-0 flex-1 bg-transparent outline-none text-foreground',
              inputPadding,
            )}
            @input=${this.onInput}
            @change=${this.onChange}
            @keypress=${this.onKeypress}
            @focus=${() => (this.focused = true)}
            @blur=${() => (this.focused = false)}
          />

          ${this.showToggle
            ? html`
                <div class=${cn('flex shrink-0 items-center', togglePadding)}>
                  <button
                    type="button"
                    aria-label=${this.passwordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed=${this.passwordVisible ? 'true' : 'false'}
                    ?disabled=${this.disabled || this.readOnly}
                    class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed"
                    @mousedown=${(e: MouseEvent) => e.preventDefault()}
                    @click=${this.togglePassword}
                  >
                    ${this.passwordVisible ? icon(EyeOff, 'eye-off', 'size-4') : icon(Eye, 'eye', 'size-4')}
                  </button>
                </div>
              `
            : nothing}
        </div>

        ${this.showStrength && currentValue
          ? html`
              <div
                class="flex flex-col gap-1.5"
                role="status"
                aria-live="polite"
                aria-label=${`Password strength: ${strength.label}`}
              >
                <div class="bg-muted h-1.5 w-full overflow-hidden rounded-full" aria-hidden="true">
                  <div
                    class=${cn('h-full rounded-full transition-[width] duration-300', strength.barColor)}
                    style=${styleMap({ width: `${strength.percent}%` })}
                  ></div>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class=${cn('font-medium capitalize', strength.color)}>${strength.label}</span>
                  ${this.minLength > 0
                    ? html`
                        <span class=${meetsMinLength ? 'text-success' : 'text-muted-foreground'}>
                          ${currentValue.length} / ${this.minLength} chars
                        </span>
                      `
                    : nothing}
                </div>
              </div>
            `
          : nothing}
        ${this.minLength > 0 && !this.showStrength && currentValue
          ? html`<p class="text-muted-foreground text-xs">Minimum ${this.minLength} characters</p>`
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-password-input') || customElements.define('uip-password-input', UipPasswordInput)

declare global {
  interface HTMLElementTagNameMap {
    'uip-password-input': UipPasswordInput
  }
}

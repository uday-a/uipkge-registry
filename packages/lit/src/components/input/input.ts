import { LitElement, css, html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { Eye, EyeOff, X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

type Size = 'small' | 'middle' | 'large'
type Variant = 'outlined' | 'filled' | 'borderless'
type Status = 'error' | 'warning'

const sizeClasses: Record<Size, string> = {
  small: 'h-8 text-xs',
  middle: 'h-9 text-base md:text-sm',
  large: 'h-11 text-base',
}

const variantMap: Record<Variant, string> = {
  outlined: 'border-input bg-transparent shadow-xs',
  filled: 'border-transparent bg-muted/50 shadow-none',
  borderless: 'border-transparent bg-transparent shadow-none',
}

const statusMap: Record<Status, string> = {
  error:
    'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
  warning: 'border-warning focus-within:border-warning focus-within:ring-warning/20',
}

// React's <InputGroup> styles a nested Input through descendant selectors
// (`[&_[data-slot=input]]:…`, `[&_input]:…`), which can't reach into this
// shadow root — so the input applies those same classes itself when it sits
// inside a <uip-input-group>.
const groupWrapperClasses = 'rounded-none border-0 bg-transparent shadow-none focus-within:ring-0'
const groupInputClasses = 'h-full flex-1 border-0 bg-transparent px-3 text-sm outline-none focus-visible:ring-0'

const actionButtonClasses =
  'text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none'

const SLOTS = ['prefix', 'suffix', 'addon-before', 'addon-after'] as const

/**
 * <uip-input> — the registry Input as a web component.
 *
 * Class strings are React's `Input` verbatim. React's node props become named
 * slots; their string forms stay attributes:
 *  - `prefix` / `suffix` attributes, or `slot="prefix"` / `slot="suffix"`
 *    (also covers React's `prefixIcon` / `suffixIcon` shorthands);
 *  - `addon-before` / `addon-after` attributes, or the same-named slots.
 * Other props: `size` (small | middle | large), `variant`, `status`,
 * `allow-clear`, `show-count` (needs `maxlength`), `show-password-toggle`,
 * plus the native `type`, `placeholder`, `name`, `disabled`, `readonly`,
 * `required`, `maxlength`, `minlength`, `pattern`, `min`, `max`, `step`,
 * `autocomplete`, `spellcheck` (`spellcheck="false"`, or the `spellCheck`
 * property — what React's `spellCheck={false}` sets). The `value` attribute is
 * the default value; the `value` property is the live one.
 *
 * Form-associated: submits `name=value`, mirrors the inner <input>'s native
 * validity (required, pattern, type=email…), resets to the `value` attribute.
 * A light-DOM `<label for>` pointing at the host focuses and names the input.
 * Enter submits the host's form (`form.requestSubmit()`), like a native
 * single-line input's implicit submission; cancel the `keydown` to prevent it.
 *
 * Events: `input` (the native, composed one) and `change` (re-dispatched,
 * composed). Read `.value` on the host.
 */
export class UipInput extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: {},
    size: { reflect: true },
    variant: { reflect: true },
    status: { reflect: true },
    // `prefix` is already a (read-only) Element property, hence prefixText.
    prefixText: { attribute: 'prefix' },
    suffix: {},
    addonBefore: { attribute: 'addon-before' },
    addonAfter: { attribute: 'addon-after' },
    allowClear: { type: Boolean, attribute: 'allow-clear' },
    showCount: { type: Boolean, attribute: 'show-count' },
    showPasswordToggle: { type: Boolean, attribute: 'show-password-toggle' },
    type: {},
    placeholder: {},
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    required: { type: Boolean, reflect: true },
    maxLength: { type: Number, attribute: 'maxlength' },
    minLength: { type: Number, attribute: 'minlength' },
    pattern: {},
    min: {},
    max: {},
    step: {},
    autocomplete: {},
    // `spellcheck` is already an HTMLElement property (and does nothing on the
    // host), so the forwarded value lives on `spellCheck` — React's prop name.
    spellCheck: {
      attribute: 'spellcheck',
      converter: { fromAttribute: (v: string | null) => (v === null ? undefined : v !== 'false') },
    },
    accessibleLabel: { attribute: 'aria-label' },
    ariaInvalidAttr: { attribute: 'aria-invalid' },
    focused: { state: true },
    hovered: { state: true },
    passwordVisible: { state: true },
    slotted: { state: true },
    inGroup: { state: true },
    labelText: { state: true },
  }

  value = ''
  size: Size = 'middle'
  variant: Variant = 'outlined'
  status?: Status
  prefixText?: string
  suffix?: string
  addonBefore?: string
  addonAfter?: string
  allowClear = false
  showCount = false
  showPasswordToggle = false
  type = 'text'
  placeholder?: string
  name?: string
  disabled = false
  readOnly = false
  required = false
  maxLength?: number
  minLength?: number
  pattern?: string
  min?: string
  max?: string
  step?: string
  autocomplete?: string
  spellCheck?: boolean
  accessibleLabel?: string
  ariaInvalidAttr?: string
  private focused = false
  private hovered = false
  private passwordVisible = false
  private slotted = new Set<string>()
  private inGroup = false
  private labelText?: string
  private defaultValue = ''
  private internals = this.attachInternals()
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'input')
    this.defaultValue = this.getAttribute('value') ?? ''
    this.inGroup = !!this.parentElement?.closest('uip-input-group')
    // Named-slot content decides whether the prefix/suffix/addon containers
    // render at all (React doesn't mount them when empty), and frameworks may
    // add it after connect.
    this.readSlots()
    this.childObserver = new MutationObserver(() => this.readSlots())
    this.childObserver.observe(this, { childList: true, attributes: true, attributeFilter: ['slot'], subtree: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  private readSlots() {
    this.slotted = new Set([...this.children].map((c) => c.slot).filter((s) => (SLOTS as readonly string[]).includes(s)))
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) this.internals.setFormValue(this.value ?? '')
    const labels = [...(this.internals.labels ?? [])] as HTMLElement[]
    this.labelText = labels.map((l) => l.textContent?.trim()).filter(Boolean).join(' ') || undefined
  }

  protected updated() {
    this.syncValidity()
  }

  private get input() {
    return this.renderRoot?.querySelector<HTMLInputElement>('input')
  }

  // The inner <input> already computes native validity for every constraint
  // (required, pattern, type, min/max…); mirror it onto the host.
  private syncValidity() {
    const i = this.input
    if (!i) return
    if (i.validity.valid) this.internals.setValidity({})
    else this.internals.setValidity(i.validity, i.validationMessage, i)
  }

  formResetCallback() {
    this.value = this.defaultValue
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private onInput(e: Event) {
    // The native `input` event is composed, so it already reaches host
    // listeners — just keep `.value` current before it gets there.
    this.value = (e.target as HTMLInputElement).value
  }

  // Native implicit submission runs on the Enter key's default action, which a
  // shadow-root input can't reach the host's form with. `keypress` only fires
  // when `keydown` wasn't cancelled (and not mid-IME composition), so a
  // consumer's keydown preventDefault still stops it, as it would natively.
  private onKeypress(e: KeyboardEvent) {
    if (e.key !== 'Enter' || e.defaultPrevented || this.disabled) return
    const form = this.internals.form
    if (!form) return
    e.preventDefault()
    form.requestSubmit()
  }

  private onChange() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  private handleClear() {
    this.value = ''
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.input?.focus()
  }

  private togglePassword() {
    this.passwordVisible = !this.passwordVisible
    this.input?.focus()
  }

  private addonClasses(position: 'before' | 'after') {
    const roundedClass =
      position === 'before' ? 'rounded-l-md rounded-r-none border-r-0' : 'rounded-r-md rounded-l-none border-l-0'
    return cn(
      'flex items-center bg-muted px-3 text-sm text-muted-foreground border border-input',
      roundedClass,
      sizeClasses[this.size] ?? sizeClasses.middle,
    )
  }

  render() {
    const size: Size = this.size in sizeClasses ? this.size : 'middle'
    const variant: Variant = this.variant in variantMap ? this.variant : 'outlined'
    const status = this.status && this.status in statusMap ? this.status : undefined
    const currentValue = this.value ?? ''

    const isPassword = this.type === 'password'
    const hasPrefix = !!this.prefixText || this.slotted.has('prefix')
    const hasSuffix = !!this.suffix || this.slotted.has('suffix')
    const hasAddonBefore = !!this.addonBefore || this.slotted.has('addon-before')
    const hasAddonAfter = !!this.addonAfter || this.slotted.has('addon-after')

    const hasPasswordToggle = this.showPasswordToggle && isPassword
    const hasCount = this.showCount && this.maxLength != null
    const hasRightConfig = this.allowClear || hasPasswordToggle || hasCount

    const showClear =
      this.allowClear && currentValue.length > 0 && (this.focused || this.hovered) && !this.disabled && !this.readOnly
    const computedType = !isPassword ? this.type : this.passwordVisible ? 'text' : 'password'

    const wrapperRounded =
      hasAddonBefore && hasAddonAfter
        ? 'rounded-none'
        : hasAddonBefore
          ? 'rounded-l-none rounded-r-md'
          : hasAddonAfter
            ? 'rounded-r-none rounded-l-md'
            : 'rounded-md'

    const wrapperClasses = cn(
      'flex w-full items-center gap-1.5 overflow-hidden border transition-[color,box-shadow] outline-none',
      sizeClasses[size],
      variantMap[variant],
      status ? statusMap[status] : '',
      !status ? 'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]' : '',
      this.disabled ? 'pointer-events-none opacity-50 cursor-not-allowed bg-muted/30' : '',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      wrapperRounded,
      this.inGroup && groupWrapperClasses,
    )

    const sidePad =
      size === 'small' ? { l: 'pl-2', r: 'pr-2' } : size === 'large' ? { l: 'pl-3', r: 'pr-3' } : { l: 'pl-2.5', r: 'pr-2.5' }

    const hasLeft = hasPrefix
    const hasRight = hasSuffix || hasRightConfig
    const inputPadding =
      !hasLeft && !hasRight
        ? cn(sidePad.l, sidePad.r)
        : hasLeft && !hasRight
          ? cn('pl-0', sidePad.r)
          : !hasLeft && hasRight
            ? cn(sidePad.l, 'pr-0')
            : 'px-0'

    // status=error implies invalid for AT; also set on the native input.
    const resolvedAriaInvalid = status === 'error' ? 'true' : this.ariaInvalidAttr

    return html`<div class="flex w-full">
      ${hasAddonBefore
        ? html`<div class=${this.addonClasses('before')}>${this.addonBefore ?? nothing}<slot name="addon-before"></slot></div>`
        : nothing}

      <div
        part="control"
        class=${wrapperClasses}
        data-slot="input"
        aria-invalid=${resolvedAriaInvalid ?? nothing}
        @mouseenter=${() => (this.hovered = true)}
        @mouseleave=${() => (this.hovered = false)}
        @click=${() => this.input?.focus()}
      >
        ${hasPrefix
          ? html`<span class=${cn('text-muted-foreground pointer-events-none shrink-0 select-none', sidePad.l)}
              >${this.prefixText ?? nothing}<slot name="prefix"></slot
            ></span>`
          : nothing}

        <input
          part="input"
          .value=${live(currentValue)}
          type=${computedType}
          name=${this.name ?? nothing}
          placeholder=${this.placeholder ?? nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          maxlength=${this.maxLength ?? nothing}
          minlength=${this.minLength ?? nothing}
          pattern=${this.pattern ?? nothing}
          min=${this.min ?? nothing}
          max=${this.max ?? nothing}
          step=${this.step ?? nothing}
          autocomplete=${(this.autocomplete as AutoFill | undefined) ?? nothing}
          spellcheck=${this.spellCheck == null ? nothing : this.spellCheck ? 'true' : 'false'}
          aria-label=${this.accessibleLabel ?? this.labelText ?? nothing}
          aria-invalid=${resolvedAriaInvalid ?? nothing}
          @input=${this.onInput}
          @change=${this.onChange}
          @keypress=${this.onKeypress}
          @focus=${() => (this.focused = true)}
          @blur=${() => (this.focused = false)}
          class=${cn(
            'w-full min-w-0 flex-1 bg-transparent outline-none',
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
            'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'disabled:cursor-not-allowed',
            inputPadding,
            this.inGroup && groupInputClasses,
          )}
        />

        ${hasRight
          ? html`<div class=${cn('flex shrink-0 items-center gap-1', sidePad.r)}>
              ${showClear
                ? html`<button
                    type="button"
                    aria-label="Clear input"
                    class=${actionButtonClasses}
                    @mousedown=${(e: MouseEvent) => e.preventDefault()}
                    @click=${this.handleClear}
                  >
                    ${icon(X, 'x', 'size-4')}
                  </button>`
                : nothing}
              ${hasPasswordToggle && !this.disabled && !this.readOnly
                ? html`<button
                    type="button"
                    aria-label=${this.passwordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed=${this.passwordVisible ? 'true' : 'false'}
                    class=${actionButtonClasses}
                    @mousedown=${(e: MouseEvent) => e.preventDefault()}
                    @click=${this.togglePassword}
                  >
                    ${this.passwordVisible ? icon(EyeOff, 'eye-off', 'size-4') : icon(Eye, 'eye', 'size-4')}
                  </button>`
                : nothing}
              ${hasCount
                ? html`<span class="text-muted-foreground pointer-events-none text-xs select-none"
                    >${currentValue.length}/${this.maxLength}</span
                  >`
                : nothing}
              ${hasSuffix
                ? html`<span class="text-muted-foreground pointer-events-none select-none"
                    >${this.suffix ?? nothing}<slot name="suffix"></slot
                  ></span>`
                : nothing}
            </div>`
          : nothing}
      </div>

      ${hasAddonAfter
        ? html`<div class=${this.addonClasses('after')}>${this.addonAfter ?? nothing}<slot name="addon-after"></slot></div>`
        : nothing}
    </div>`
  }
}

customElements.get('uip-input') || customElements.define('uip-input', UipInput)

declare global {
  interface HTMLElementTagNameMap {
    'uip-input': UipInput
  }
}

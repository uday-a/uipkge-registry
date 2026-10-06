import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Check, CircleAlert, Loader, X } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { labelClasses } from '../label/label'

type Rule = (value: string) => true | string
type AutoSize = boolean | { minRows?: number; maxRows?: number }
type ShowCount = boolean | { formatter?: (count: number, maxLength?: number) => string }

// `boolean | object` props: a bare attribute means true, JSON means the object
// (auto-size='{"minRows":2,"maxRows":6}'). Functions (showCount.formatter)
// need the property.
const boolOrJson = {
  fromAttribute(v: string | null) {
    if (v === null || v === 'false') return undefined
    if (v === '' || v === 'true') return true
    try {
      return JSON.parse(v)
    } catch {
      return true
    }
  },
}
const boolOrNumber = {
  fromAttribute(v: string | null) {
    if (v === null || v === 'false') return undefined
    const n = Number(v)
    return v !== '' && !Number.isNaN(n) ? n : true
  },
}
const stringOrList = {
  fromAttribute(v: string | null) {
    return v ?? undefined
  },
}

// Literal classes (not `rounded-${x}`) so Tailwind compiles them into the
// shadow sheet; the resulting class names equal React's template string.
const roundedClasses: Record<string, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  pill: 'rounded-pill',
  circle: 'rounded-circle',
  full: 'rounded-full',
}

/**
 * <uip-textarea> — the registry Textarea as a web component (one element:
 * label, control, adornments and messages share one shadow root, so
 * `for` / `aria-describedby` resolve).
 *
 * Props are React's, kebab-cased as attributes (`show-count`, `allow-clear`,
 * `max-length`, `auto-size`, `read-only`, `validate-on`, …). Deviations forced
 * by HTMLElement: React's `prefix` / `suffix` are the `prefix` / `suffix`
 * attributes but the `prefixText` / `suffixText` properties (`prefix` is a
 * read-only Element property); `id` isn't forwarded (it stays the host's).
 * `autoSize` / `showCount` / `counter` / `errorMessages` / `successMessages`
 * take a bare attribute, JSON / a number / a string, or the full value as a
 * property; `rules` and `showCount.formatter` are properties only.
 *
 * Value: `value` is the live value (like a native textarea); `default-value`
 * seeds it and is what a form reset restores.
 *
 * Form-associated: submits `name=value`, reports `required` (valueMissing)
 * and error messages (customError), resets with its form, follows a disabled
 * <fieldset>. A native `<label for>` or `<uip-label for>` pointing at the host
 * names the inner textarea.
 *
 * Events: `input` / `change` (bubbling, composed; read `.value`),
 * `value-change` (detail: { value } — React's onValueChange), `clear`
 * (React's onClear). focus / blur / keydown / keyup are the native composed
 * events. Class overrides (className, inputClassName, labelClassName,
 * hintClassName) go through `::part(base | control | textarea | label | hint)`.
 */
export class UipTextarea extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: {},
    defaultValue: { attribute: 'default-value' },
    label: {},
    placeholder: {},
    hint: {},
    error: {},
    success: {},
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'read-only', reflect: true },
    required: { type: Boolean, reflect: true },
    autoFocus: { type: Boolean, attribute: 'auto-focus' },
    name: { reflect: true },
    variant: { reflect: true },
    density: { reflect: true },
    rounded: {},
    autoSize: { attribute: 'auto-size', converter: boolOrJson },
    autoGrow: { type: Boolean, attribute: 'auto-grow' },
    noResize: { type: Boolean, attribute: 'no-resize' },
    autoResize: { type: Boolean, attribute: 'auto-resize' },
    rows: { type: Number },
    rowHeight: { type: Number, attribute: 'row-height' },
    prefixText: { attribute: 'prefix' },
    suffixText: { attribute: 'suffix' },
    counter: { converter: boolOrNumber },
    showCount: { attribute: 'show-count', converter: boolOrJson },
    maxLength: { type: Number, attribute: 'max-length' },
    allowClear: { type: Boolean, attribute: 'allow-clear' },
    rules: { attribute: false },
    errorMessages: { attribute: 'error-messages', converter: stringOrList },
    successMessages: { attribute: 'success-messages', converter: stringOrList },
    validateOn: { attribute: 'validate-on' },
    loading: { type: Boolean },
    persistentHint: { type: Boolean, attribute: 'persistent-hint' },
    persistentPrefix: { type: Boolean, attribute: 'persistent-prefix' },
    persistentSuffix: { type: Boolean, attribute: 'persistent-suffix' },
    bgColor: { attribute: 'bg-color' },
    spellCheck: { attribute: 'spell-check', converter: { fromAttribute: (v: string | null) => (v === null ? undefined : v !== 'false') } },
    autoComplete: { attribute: 'auto-complete' },
    accessibleLabel: { attribute: 'aria-label' },
    focused: { state: true },
    internalErrorMessages: { state: true },
    labelText: { state: true },
  }

  value?: string
  defaultValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  success?: string
  disabled = false
  readOnly = false
  required = false
  autoFocus = false
  name?: string
  variant: 'outlined' | 'filled' | 'solo' | 'underlined' | 'plain' = 'outlined'
  density: 'compact' | 'comfortable' | 'default' = 'default'
  rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle' | 'full' = 'none'
  autoSize?: AutoSize
  autoGrow = false
  noResize = false
  autoResize = false
  rows: number | string = 3
  rowHeight = 24
  prefixText?: string
  suffixText?: string
  counter?: boolean | number
  showCount?: ShowCount
  maxLength?: number
  allowClear = false
  rules?: Rule[]
  errorMessages?: string | string[]
  successMessages?: string | string[]
  validateOn?: 'blur' | 'input' | 'submit' | 'lazy' | 'blurlazy' | 'inputlazy'
  loading = false
  persistentHint = false
  persistentPrefix = false
  persistentSuffix = false
  bgColor?: string
  spellCheck?: boolean
  autoComplete?: string
  accessibleLabel?: string
  private focused = false
  private internalErrorMessages: string[] = []
  private labelText?: string

  private internals = this.attachInternals()
  private resetValue = ''
  private minHeightPx = 0
  private maxHeightPx = Infinity

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'textarea')
    if (this.value === undefined) this.value = String(this.defaultValue ?? '')
    this.resetValue = this.defaultValue !== undefined ? String(this.defaultValue) : this.value
  }

  private get textarea() {
    return this.renderRoot?.querySelector<HTMLTextAreaElement>('textarea') ?? null
  }

  private get anyAutoResize() {
    return this.autoSize !== undefined || this.autoResize || this.autoGrow
  }

  private get current() {
    return String(this.value ?? '')
  }

  // --- validation / derived state -------------------------------------------
  private runRules(value: string) {
    if (!this.rules || this.rules.length === 0) return []
    const next: string[] = []
    for (const rule of this.rules) {
      const result = rule(value)
      if (result !== true) next.push(result as string)
    }
    return next
  }

  /** Run `rules` against the current value (React's validate). Returns true when valid. */
  validate() {
    this.internalErrorMessages = this.runRules(this.current)
    return this.internalErrorMessages.length === 0
  }

  private get computedErrorMessages() {
    if (this.errorMessages) return Array.isArray(this.errorMessages) ? this.errorMessages : [this.errorMessages]
    if (this.error) return [this.error]
    return this.internalErrorMessages
  }

  private get computedSuccessMessages() {
    if (this.successMessages) return Array.isArray(this.successMessages) ? this.successMessages : [this.successMessages]
    if (this.success) return [this.success]
    return []
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) this.internals.setFormValue(this.current)
    const labels = [...(this.internals.labels ?? [])] as HTMLElement[]
    this.labelText = labels.map((l) => l.textContent?.trim()).filter(Boolean).join(' ') || undefined
  }

  protected updated(changed: Map<string, unknown>) {
    const errors = this.computedErrorMessages
    const anchor = this.textarea ?? undefined
    if (this.required && !this.current) {
      this.internals.setValidity({ valueMissing: true }, 'Please fill out this field.', anchor)
    } else if (errors.length) {
      this.internals.setValidity({ customError: true }, errors[0], anchor)
    } else {
      this.internals.setValidity({})
    }
    if (changed.has('value') && this.anyAutoResize) requestAnimationFrame(() => this.autoResizeFn())
  }

  protected firstUpdated() {
    requestAnimationFrame(() => {
      this.measureHeights()
      if (this.anyAutoResize) this.autoResizeFn()
    })
  }

  // --- form callbacks ---------------------------------------------------------
  formResetCallback() {
    this.value = this.resetValue
    this.internalErrorMessages = []
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  // --- auto size (ported from React) -------------------------------------------
  private autoResizeFn() {
    const el = this.textarea
    if (!el || !this.anyAutoResize) return
    el.style.height = 'auto'
    let newHeight = el.scrollHeight
    if (this.minHeightPx && newHeight < this.minHeightPx) newHeight = this.minHeightPx
    if (newHeight > this.maxHeightPx) {
      newHeight = this.maxHeightPx
      el.style.overflowY = 'auto'
    } else {
      el.style.overflowY = 'hidden'
    }
    el.style.height = `${newHeight}px`
  }

  private measureHeights() {
    const el = this.textarea
    if (!el || this.autoSize === undefined) return
    const originalValue = el.value
    const originalRows = el.rows
    const originalOverflow = el.style.overflowY
    el.value = ''
    el.style.overflowY = 'hidden'
    const { minRows, maxRows } = typeof this.autoSize === 'object' ? this.autoSize : ({} as { minRows?: number; maxRows?: number })
    if (minRows) {
      el.rows = minRows
      this.minHeightPx = el.scrollHeight
    } else {
      this.minHeightPx = 0
    }
    if (maxRows) {
      el.rows = maxRows
      this.maxHeightPx = el.scrollHeight
    } else {
      this.maxHeightPx = Infinity
    }
    el.value = originalValue
    el.rows = originalRows
    el.style.overflowY = originalOverflow
    this.autoResizeFn()
  }

  private get computedRows() {
    const rowsNum = Number(this.rows) || 3
    if (this.autoSize !== undefined || this.autoResize) return rowsNum
    if (!this.autoGrow) return rowsNum
    const el = isServer ? null : this.textarea
    if (!el) return rowsNum
    const newRows = Math.ceil((el.scrollHeight - this.rowHeight) / this.rowHeight) + 1
    return Math.max(rowsNum, newRows)
  }

  // --- events -------------------------------------------------------------------
  private setValue(next: string) {
    this.value = next
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
  }

  private onInput(e: Event) {
    const next = (e.target as HTMLTextAreaElement).value
    this.setValue(next)
    if (this.anyAutoResize) this.autoResizeFn()
    if (this.validateOn === 'input' || this.validateOn === 'inputlazy') this.internalErrorMessages = this.runRules(next)
    // The native `input` event is composed and already reaches the host.
  }

  private onChange() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  private onClear() {
    this.setValue('')
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }))
    requestAnimationFrame(() => {
      this.autoResizeFn()
      this.textarea?.focus()
    })
  }

  private onFocus() {
    this.focused = true
  }

  private onBlur() {
    this.focused = false
    if (this.validateOn === 'blur' || this.validateOn === 'blurlazy') this.validate()
  }

  // --- render ---------------------------------------------------------------------
  render() {
    const errors = this.computedErrorMessages
    const successes = this.computedSuccessMessages
    const hasError = errors.length > 0
    const hasSuccess = successes.length > 0
    const focused = this.focused
    const current = this.current
    const currentLength = current.length
    const maxLength = this.maxLength

    const computedCounter =
      typeof this.counter === 'number' ? this.counter : this.counter ? (maxLength ?? 100) : null

    const showCountEnabled = this.showCount !== undefined && this.showCount !== false
    const formatter = typeof this.showCount === 'object' ? this.showCount.formatter : undefined
    const countText = formatter
      ? formatter(currentLength, maxLength)
      : maxLength !== undefined
        ? `${currentLength} / ${maxLength}`
        : `${currentLength}`

    const showClear = this.allowClear && !this.disabled && !this.readOnly && currentLength > 0

    const base = 'w-full transition-colors duration-200'
    let variantClasses = base
    switch (this.variant) {
      case 'outlined':
        variantClasses = cn(
          base,
          'border-2 rounded-lg',
          focused ? 'border-primary ring-2 ring-primary/20' : 'border-input',
          hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        )
        break
      case 'filled':
        variantClasses = cn(
          base,
          'border-b-2 bg-muted/50 rounded-t-lg',
          focused ? 'border-primary bg-muted' : 'border-transparent',
          hasError && 'border-destructive',
        )
        break
      case 'solo':
        variantClasses = cn(base, 'rounded-lg shadow-sm', focused ? 'shadow-md' : 'shadow-sm', 'bg-card border border-transparent')
        break
      case 'underlined':
        variantClasses = cn(
          base,
          'border-b-2 rounded-none border-x-0 border-t-0 px-0',
          focused ? 'border-primary' : 'border-muted-foreground/30',
          hasError && 'border-destructive',
        )
        break
      case 'plain':
        variantClasses = cn(base, 'border-0 bg-transparent')
        break
    }

    const densityClasses =
      this.density === 'compact'
        ? 'text-sm min-h-[32px]'
        : this.density === 'comfortable'
          ? 'text-base min-h-[40px]'
          : 'text-base min-h-[48px]'

    const resizeClasses = this.noResize ? 'resize-none' : this.anyAutoResize ? 'resize-none' : 'resize-y'
    const describedBy = hasError || hasSuccess || this.hint ? 'uip-textarea-description' : nothing

    return html`<div part="base" class="relative space-y-2">
      ${this.label
        ? html`<label
            part="label"
            for="uip-textarea"
            data-uipkge=""
            data-slot="label"
            class=${cn(
              labelClasses,
              'text-foreground text-sm font-medium',
              focused && 'text-primary',
              hasError && 'text-destructive',
            )}
            >${this.label}${this.required ? html`<span class="text-destructive ml-0.5">*</span>` : nothing}</label
          >`
        : nothing}

      <div
        part="control"
        class=${cn(
          'relative flex items-center',
          variantClasses,
          densityClasses,
          this.disabled && 'pointer-events-none opacity-50',
          this.readOnly && !this.disabled && 'cursor-default',
          this.rounded !== 'none' && roundedClasses[this.rounded],
        )}
        style=${styleMap(this.bgColor ? { backgroundColor: this.bgColor } : {})}
      >
        ${this.prefixText
          ? html`<span
              class=${cn(
                'text-muted-foreground pointer-events-none absolute top-3 left-3 text-sm',
                !this.persistentPrefix && !focused && 'opacity-50',
              )}
              >${this.prefixText}</span
            >`
          : nothing}

        <textarea
          part="textarea"
          id="uip-textarea"
          .value=${current}
          placeholder=${this.placeholder ?? nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          name=${this.name ?? nothing}
          autocomplete=${this.autoComplete ?? nothing}
          ?autofocus=${this.autoFocus}
          spellcheck=${this.spellCheck === undefined ? nothing : String(this.spellCheck)}
          maxlength=${maxLength ?? nothing}
          rows=${this.computedRows}
          aria-label=${!this.label ? (this.accessibleLabel ?? this.labelText ?? nothing) : nothing}
          aria-describedby=${describedBy}
          aria-invalid=${hasError ? 'true' : nothing}
          class=${cn(
            'w-full flex-1 resize-y bg-transparent outline-none',
            densityClasses,
            resizeClasses,
            this.prefixText ? 'pl-16' : 'pl-3',
            this.suffixText ? 'pr-16' : showClear ? 'pr-10' : 'pr-3',
            showCountEnabled && 'pb-6',
            'py-2',
          )}
          @input=${this.onInput}
          @change=${this.onChange}
          @focus=${this.onFocus}
          @blur=${this.onBlur}
        ></textarea>

        ${this.suffixText
          ? html`<span
              class=${cn(
                'text-muted-foreground pointer-events-none absolute top-3 right-3 text-sm',
                !this.persistentSuffix && !focused && 'opacity-50',
              )}
              >${this.suffixText}</span
            >`
          : nothing}
        ${showClear
          ? html`<button
              type="button"
              tabindex="-1"
              aria-label="Clear"
              class=${cn(
                'text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-3 flex items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
                this.suffixText ? 'right-10' : 'right-3',
              )}
              @click=${this.onClear}
            >
              ${icon(X, 'x', 'size-4')}
            </button>`
          : nothing}
        ${this.loading
          ? html`<div class="absolute top-3 right-3 flex items-center justify-center">
              ${icon(Loader, 'loader', 'text-muted-foreground size-4 animate-spin')}
            </div>`
          : nothing}
        ${hasSuccess && !this.loading
          ? html`<div class="text-success absolute top-3 right-3 flex items-center justify-center">
              ${icon(Check, 'check', 'size-4')}
            </div>`
          : nothing}
        ${hasError && !this.loading
          ? html`<div class="text-destructive absolute top-3 right-3 flex items-center justify-center">
              ${icon(CircleAlert, 'circle-alert', 'size-4')}
            </div>`
          : nothing}
        ${showCountEnabled
          ? html`<div
              class=${cn(
                'text-muted-foreground pointer-events-none absolute right-3 bottom-1.5 text-xs',
                maxLength !== undefined && currentLength > maxLength && 'text-destructive',
              )}
            >
              ${countText}
            </div>`
          : nothing}
      </div>

      <div id="uip-textarea-description" class="mt-1.5">
        ${this.hint && (!hasError || this.persistentHint) && !focused
          ? html`<p part="hint" class="text-muted-foreground text-sm">${this.hint}</p>`
          : nothing}
        ${errors.map(
          (msg) => html`<p class="text-destructive flex items-center gap-1 text-sm" role="alert">
            ${icon(CircleAlert, 'circle-alert', 'size-3 shrink-0')}${msg}
          </p>`,
        )}
        ${successes.map(
          (msg) => html`<p class="text-success flex items-center gap-1 text-sm">
            ${icon(Check, 'check', 'size-3 shrink-0')}${msg}
          </p>`,
        )}
        ${computedCounter !== null
          ? html`<div
              class=${cn('text-muted-foreground mt-1 text-right text-xs', currentLength > computedCounter && 'text-destructive')}
            >
              ${currentLength} / ${computedCounter}
            </div>`
          : nothing}
      </div>

      <slot></slot>
    </div>`
  }
}

customElements.get('uip-textarea') || customElements.define('uip-textarea', UipTextarea)

declare global {
  interface HTMLElementTagNameMap {
    'uip-textarea': UipTextarea
  }
}

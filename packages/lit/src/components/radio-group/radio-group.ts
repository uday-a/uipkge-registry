import { LitElement, css, html, nothing } from 'lit'
import { Circle } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type RadioOption = string | { label: string; value: string; disabled?: boolean }

interface Opt {
  value: string
  label: string
  disabled: boolean
}

type ButtonSize = 'small' | 'middle' | 'large'

// --- class tables: React's radio-group.tsx verbatim ---------------------------
const groupDensityClasses = {
  compact: 'gap-1',
  default: 'gap-3',
  comfortable: 'gap-4',
}

const itemDensityClasses = {
  compact: 'gap-1',
  default: 'gap-2',
  comfortable: 'gap-3',
}

const buttonSizeClasses = {
  small: 'h-7 px-2.5 text-xs',
  middle: 'h-8 px-4 text-sm',
  large: 'h-10 px-4.5 text-base',
}

const buttonVariantClasses = {
  outline: cn(
    'border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50',
    'data-[state=checked]:border-primary data-[state=checked]:text-primary',
    'disabled:hover:bg-transparent',
  ),
  solid: cn(
    'border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50',
    'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    'disabled:hover:bg-transparent',
  ),
}

// RadioGroupItem defaults (size="md", color="primary").
const itemClasses = cn(
  'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square shrink-0 rounded-full border shadow-sm transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
  'size-4',
  'data-[state=checked]:border-primary',
)
const indicatorIconClasses = cn(
  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current text-current',
  'size-2',
)
// <Label> (registry label.tsx) — the Default story pairs each item with one.
const labelComponentClasses =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

function normalizeOption(option: RadioOption): Opt {
  if (typeof option === 'string') return { label: option, value: option, disabled: false }
  return { label: option.label, value: option.value, disabled: Boolean(option.disabled) }
}

let uid = 0

/**
 * <uip-radio-group> — the registry RadioGroup (+ RadioGroupItem / RadioButton)
 * as ONE web component.
 *
 * Items come from light-DOM `<option value="…">Label</option>` children (read,
 * not rendered — like `uip-select`) or from the `options` property / JSON
 * attribute (React's `options` prop). Rendered in the shadow root:
 *  - `option-type="default"`: a RadioGroupItem with a label next to it. From
 *    `options` the label uses React's options-path classes; from `<option>`
 *    children it uses the registry <Label> classes (React's composed usage).
 *  - `option-type="button"`: a RadioButton per item.
 * Radios, labels (`for`) and the radiogroup all live in one shadow root, so
 * the id references resolve.
 *
 * Keyboard (Radix parity): roving tabindex; arrow keys (Up/Down when vertical,
 * Left/Right when horizontal, mirrored under `dir="rtl"`) move focus and
 * check; Home/End; `loop` wraps (default true, `loop="false"` to disable);
 * Space checks.
 *
 * Form-associated: submits `name=value`, supports `required`, resets to the
 * initial `value`. Events: `input`, `change` (read `.value`), and
 * `value-change` (React's `onValueChange`, `detail` = the new value).
 *
 * Custom composition: `slot="label-n"` (0-based item index) replaces item n's
 * label with rich markup (both `default` and `button` variants); without it
 * the option label renders as before. Per-item RadioGroupItem props (size,
 * color, hint, labelPosition, loading, hideIcon) stay data-driven — niche
 * next to the main `options` / `option-type` API. Parts: `base` (group),
 * `item` / `button` (per option), `indicator`, `label` (style from the host,
 * e.g. `class="[&::part(label)]:font-bold"`).
 */
export class UipRadioGroup extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: {},
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    orientation: { reflect: true },
    loop: { converter: { fromAttribute: (v: string | null) => v !== 'false' } },
    label: {},
    hint: {},
    errorMessages: { attribute: 'error-messages' },
    error: { type: Boolean },
    density: {},
    flat: { type: Boolean },
    bordered: { type: Boolean },
    options: { type: Array },
    size: {},
    optionType: { attribute: 'option-type' },
    buttonVariant: { attribute: 'button-variant' },
    accessibleLabel: { attribute: 'aria-label' },
    childOptions: { state: true },
  }

  value = ''
  name?: string
  disabled = false
  required = false
  orientation: 'horizontal' | 'vertical' = 'vertical'
  loop = true
  label?: string
  hint?: string
  errorMessages?: string | string[]
  error = false
  density: keyof typeof groupDensityClasses = 'default'
  /** Accepted for API parity; React's RadioGroup doesn't style it either. */
  flat = false
  bordered = false
  options?: RadioOption[]
  size: ButtonSize = 'middle'
  optionType: 'default' | 'button' = 'default'
  buttonVariant: 'outline' | 'solid' = 'outline'
  accessibleLabel?: string
  private childOptions: Opt[] = []
  private defaultValue = ''
  private readonly uidBase = `uip-radio-group-${++uid}`
  private internals = this.attachInternals()
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'radio-group')
    this.readOptions()
    this.defaultValue = this.value
    // Frameworks render <option> children after the host connects.
    this.childObserver = new MutationObserver(() => this.readOptions())
    this.childObserver.observe(this, { childList: true, subtree: true, characterData: true, attributes: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  private readOptions() {
    this.childOptions = [...this.querySelectorAll('option')].map((o) => ({
      value: o.value,
      label: o.label,
      disabled: o.disabled,
    }))
  }

  private get fromOptionsProp() {
    return Boolean(this.options && this.options.length > 0)
  }

  private get items(): Opt[] {
    return this.fromOptionsProp ? this.options!.map(normalizeOption) : this.childOptions
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('required')) {
      this.internals.setFormValue(this.value || null)
      if (this.required && !this.value) {
        this.internals.setValidity({ valueMissing: true }, 'Please select one of these options.', this.radios[0])
      } else {
        this.internals.setValidity({})
      }
    }
  }

  formResetCallback() {
    this.value = this.defaultValue
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  /** Focus the tabbable radio (checked one, else first enabled). */
  focus(options?: FocusOptions) {
    const tabbable = this.radios.find((r) => r.tabIndex === 0)
    if (tabbable) tabbable.focus(options)
    else super.focus(options)
  }

  private get radios() {
    return [...(this.renderRoot?.querySelectorAll<HTMLButtonElement>('[role=radio]') ?? [])]
  }

  private isDisabled(o: Opt) {
    return this.disabled || o.disabled
  }

  private check(o: Opt) {
    if (this.isDisabled(o) || o.value === this.value) return
    this.value = o.value
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: this.value, bubbles: true, composed: true }))
  }

  private onKeyDown(e: KeyboardEvent, index: number) {
    if (e.key === 'Enter') {
      // WAI-ARIA radio groups don't check on Enter (Radix prevents it too).
      e.preventDefault()
      return
    }
    const rtl = this.matches(':dir(rtl)')
    const vertical = this.orientation === 'vertical'
    const keys: Record<string, 'prev' | 'next' | 'first' | 'last'> = vertical
      ? { ArrowUp: 'prev', ArrowDown: 'next' }
      : rtl
        ? { ArrowRight: 'prev', ArrowLeft: 'next' }
        : { ArrowLeft: 'prev', ArrowRight: 'next' }
    Object.assign(keys, { Home: 'first', End: 'last', PageUp: 'first', PageDown: 'last' })
    const intent = keys[e.key]
    if (!intent) return
    e.preventDefault()
    const items = this.items
    const enabled = items.map((o, i) => (this.isDisabled(o) ? -1 : i)).filter((i) => i >= 0)
    if (!enabled.length) return
    let target: number
    if (intent === 'first') target = enabled[0]
    else if (intent === 'last') target = enabled[enabled.length - 1]
    else {
      const pos = enabled.indexOf(index)
      let next = intent === 'next' ? pos + 1 : pos - 1
      if (next < 0) next = this.loop ? enabled.length - 1 : 0
      if (next >= enabled.length) next = this.loop ? 0 : enabled.length - 1
      target = enabled[next]
    }
    this.check(items[target])
    this.radios[target]?.focus()
  }

  private renderRadio(o: Opt, i: number, tabbable: number, slot: string, classes: string, content: unknown) {
    const checked = o.value === this.value
    const disabled = this.isDisabled(o)
    return html`<button
      id=${`${this.uidBase}-${i}`}
      type="button"
      role="radio"
      part=${slot === 'radio-button' ? 'button' : 'item'}
      data-uipkge=""
      data-slot=${slot}
      aria-checked=${checked ? 'true' : 'false'}
      data-state=${checked ? 'checked' : 'unchecked'}
      data-orientation=${this.orientation}
      ?data-disabled=${disabled}
      ?disabled=${disabled}
      value=${o.value}
      tabindex=${i === tabbable ? 0 : -1}
      class=${classes}
      @click=${() => this.check(o)}
      @keydown=${(e: KeyboardEvent) => this.onKeyDown(e, i)}
    >
      ${content}
    </button>`
  }

  private renderItem(o: Opt, i: number, tabbable: number) {
    const checked = o.value === this.value
    const indicator = checked
      ? html`<span
          part="indicator"
          data-state="checked"
          ?data-disabled=${this.isDisabled(o)}
          data-uipkge=""
          data-slot="radio-group-indicator"
          class="relative flex items-center justify-center"
          >${icon(Circle, 'circle', indicatorIconClasses)}</span
        >`
      : nothing
    const radio = html`<div class=${cn('flex flex-col', itemDensityClasses.default)}>
      <div class="flex items-center">
        ${this.renderRadio(o, i, tabbable, 'radio-group-item', itemClasses, indicator)}
      </div>
    </div>`
    const labelClass = this.fromOptionsProp
      ? cn('cursor-pointer text-sm font-medium select-none', o.disabled && 'cursor-not-allowed opacity-50')
      : labelComponentClasses
    return html`<div class="flex items-center gap-2">
      ${radio}
      <label
        part="label"
        for=${`${this.uidBase}-${i}`}
        data-slot=${this.fromOptionsProp ? nothing : 'label'}
        class=${labelClass}
        ><slot name=${`label-${i}`}>${o.label}</slot></label
      >
    </div>`
  }

  private renderButton(o: Opt, i: number, tabbable: number) {
    const groupClasses =
      this.orientation === 'vertical'
        ? 'rounded-md w-full justify-start'
        : cn('rounded-none first:rounded-l-md last:rounded-r-md', 'border-l-0 first:border-l', '-ml-px first:ml-0')
    const classes = cn(
      'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-200',
      'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      buttonSizeClasses[this.size] ?? buttonSizeClasses.middle,
      buttonVariantClasses[this.buttonVariant] ?? buttonVariantClasses.outline,
      groupClasses,
    )
    return this.renderRadio(
      o,
      i,
      tabbable,
      'radio-button',
      classes,
      html`<slot name=${`label-${i}`}>${o.label || o.value}</slot>`,
    )
  }

  render() {
    const items = this.items
    const checkedIndex = items.findIndex((o) => o.value === this.value && !this.isDisabled(o))
    const tabbable = checkedIndex >= 0 ? checkedIndex : items.findIndex((o) => !this.isDisabled(o))
    const msgs = this.errorMessages
    const hasError = Boolean(this.error) || Boolean(msgs && (typeof msgs === 'string' ? msgs : msgs.length > 0))
    const isButton = this.optionType === 'button'
    const labelId = `${this.uidBase}-label`

    return html`<div class="flex flex-col gap-2">
      ${this.label ? html`<label id=${labelId} class="text-sm font-medium">${this.label}</label>` : nothing}
      ${this.hint && !hasError ? html`<p class="text-muted-foreground text-xs">${this.hint}</p>` : nothing}
      <div
        part="base"
        role="radiogroup"
        aria-required=${this.required ? 'true' : 'false'}
        aria-orientation=${this.orientation}
        aria-labelledby=${this.label && !this.accessibleLabel ? labelId : nothing}
        aria-label=${this.accessibleLabel ?? nothing}
        data-slot="radio-group"
        data-orientation=${this.orientation}
        ?data-disabled=${this.disabled}
        class=${cn(
          'grid gap-3',
          this.orientation === 'horizontal' && 'flex flex-row items-center gap-4',
          isButton && this.orientation === 'horizontal' && 'flex flex-row items-stretch gap-0',
          isButton && this.orientation === 'vertical' && 'flex flex-col items-stretch gap-0',
          !isButton && (groupDensityClasses[this.density] ?? groupDensityClasses.default),
          this.bordered && 'rounded-lg border p-4',
        )}
      >
        ${items.map((o, i) => (isButton ? this.renderButton(o, i, tabbable) : this.renderItem(o, i, tabbable)))}
      </div>
      ${hasError
        ? html`<div class="flex flex-col gap-0.5">
            ${(typeof msgs === 'string' ? [msgs] : (msgs ?? [])).map(
              (m) => html`<p class="text-destructive text-xs">${m}</p>`,
            )}
          </div>`
        : nothing}
    </div>`
  }
}

customElements.get('uip-radio-group') || customElements.define('uip-radio-group', UipRadioGroup)

declare global {
  interface HTMLElementTagNameMap {
    'uip-radio-group': UipRadioGroup
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { Check, LoaderCircle, Minus } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

type Size = 'sm' | 'md' | 'lg'
type Density = 'compact' | 'default' | 'comfortable'

const sizeClasses: Record<Size, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const iconSizes: Record<Size, string> = {
  sm: 'size-2.5',
  md: 'size-3.5',
  lg: 'size-4',
}

const colorClasses: Record<string, string> = {
  primary:
    'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
  secondary:
    'data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:border-secondary',
  success:
    'data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=indeterminate]:bg-success data-[state=indeterminate]:border-success',
  warning:
    'data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=indeterminate]:bg-warning data-[state=indeterminate]:border-warning',
  error:
    'data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:border-destructive',
  info: 'data-[state=checked]:bg-info data-[state=checked]:border-info data-[state=indeterminate]:bg-info data-[state=indeterminate]:border-info',
}

const densityClasses: Record<Density, string> = {
  compact: 'gap-1',
  default: 'gap-2',
  comfortable: 'gap-3',
}

// React's `checkbox-check-in` keyframes (scale .55 → 1.08 → 1) live in an
// injected <style>; custom keyframes aren't allowed here, so the same entrance
// uses tw-animate-css utilities (no overshoot). The class name is kept.
const indicatorIconClasses =
  'checkbox-indicator-icon motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-50 motion-safe:duration-200'

/** `error-messages="Required"` or `error-messages='["A","B"]'`. */
const messagesConverter = {
  fromAttribute: (v: string | null) => (v && v.trim().startsWith('[') ? (JSON.parse(v) as string[]) : (v ?? undefined)),
}

const messagesList = (m?: string | string[]) => (m == null ? [] : typeof m === 'string' ? (m ? [m] : []) : m)

const hasErrorMessages = (m?: string | string[]) =>
  Boolean(m && (typeof m === 'string' ? m : m.length > 0))

let uid = 0

/**
 * <uip-checkbox> — the registry Checkbox as a web component.
 *
 * Class strings are React's `Checkbox` verbatim. The inner
 * <button role=checkbox> carries `aria-checked` (true | false | mixed) and
 * `data-state` (checked | unchecked | indeterminate) like Radix's
 * Checkbox.Root; Space toggles, Enter doesn't (Radix). Clicking an
 * indeterminate checkbox makes it checked (Radix) and clears `indeterminate`.
 *
 * Props (attributes): `checked` (initial state — the `checked` property is the
 * live one, like <input>), `indeterminate`, `value` (default "on"), `size`
 * (sm | md | lg), `color`, `label`, `label-position` (before | after), `hint`,
 * `error`, `error-messages` (string or JSON array), `density`, `hide-icon`,
 * `loading`, `flat`, `inline`, `name`, `disabled`, `required`. Default slot
 * replaces the indicator icon (React's `children`).
 *
 * Form-associated: submits `name=value` when checked, supports `required`,
 * resets to the initial `checked` / `indeterminate` attributes. A light-DOM
 * `<label for>` pointing at the host toggles it and names the inner checkbox.
 *
 * Events: `input`, `change` (read `.checked` / `.indeterminate`), and
 * `checked-change` (React's `onCheckedChange`, `detail: { checked }`).
 */
export class UipCheckbox extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    checked: { type: Boolean, attribute: false },
    defaultChecked: { type: Boolean, attribute: 'checked' },
    indeterminate: { type: Boolean, reflect: true },
    value: {},
    size: { reflect: true },
    color: {},
    label: {},
    labelPosition: { attribute: 'label-position' },
    hint: {},
    error: { type: Boolean },
    errorMessages: { attribute: 'error-messages', converter: messagesConverter },
    density: {},
    hideIcon: { type: Boolean, attribute: 'hide-icon' },
    loading: { type: Boolean },
    flat: { type: Boolean },
    inline: { type: Boolean },
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    labelText: { state: true },
  }

  /** Current state. The `checked` attribute is the initial (default) state. */
  checked = false
  defaultChecked = false
  indeterminate = false
  value = 'on'
  size: Size = 'md'
  color = 'primary'
  label?: string
  labelPosition: 'before' | 'after' = 'after'
  hint?: string
  error = false
  errorMessages?: string | string[]
  density: Density = 'default'
  hideIcon = false
  loading = false
  flat = false
  inline = false
  name?: string
  disabled = false
  required = false
  accessibleLabel?: string
  private labelText?: string
  private defaultIndeterminate = false
  private readonly controlId = `uip-checkbox-${++uid}`
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
    // A click on the inner button (or the in-shadow <label>, which forwards a
    // click to the button) bubbles here; a light-DOM `<label for>` click is
    // dispatched on the host itself. Other clicks (hint text…) are ignored.
    this.addEventListener('click', (e) => {
      const path = e.composedPath()
      if (path[0] === this || (this.button && path.includes(this.button))) this.toggle()
    })
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'checkbox')
    this.defaultIndeterminate = this.hasAttribute('indeterminate')
  }

  private get state() {
    return this.indeterminate ? 'indeterminate' : this.checked ? 'checked' : 'unchecked'
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Attribute changes drive the state; on first render only a present
    // attribute applies, so a `.checked = true` set before connect survives.
    if (changed.has('defaultChecked') && (this.hasUpdated || this.defaultChecked)) this.checked = this.defaultChecked
    this.setAttribute('data-state', this.state)
    if (changed.has('checked') || changed.has('required') || changed.has('value')) {
      this.internals.setFormValue(this.checked ? this.value : null)
      if (this.required && !this.checked) {
        this.internals.setValidity({ valueMissing: true }, 'Please check this box.', this.button ?? undefined)
      } else {
        this.internals.setValidity({})
      }
    }
    const labels = [...(this.internals.labels ?? [])] as HTMLElement[]
    this.labelText = labels.map((l) => l.textContent?.trim()).filter(Boolean).join(' ') || undefined
  }

  formResetCallback() {
    this.checked = this.defaultChecked
    this.indeterminate = this.defaultIndeterminate
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get button() {
    return this.renderRoot?.querySelector<HTMLButtonElement>('[role=checkbox]')
  }

  private toggle() {
    if (this.disabled) return
    this.checked = this.indeterminate ? true : !this.checked
    this.indeterminate = false
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('checked-change', { detail: { checked: this.checked }, bubbles: true, composed: true }))
  }

  render() {
    const size: Size = this.size in sizeClasses ? this.size : 'md'
    const density: Density = this.density in densityClasses ? this.density : 'default'
    const hasError = this.error || hasErrorMessages(this.errorMessages)
    const isIndeterminate = this.indeterminate
    const state = this.state

    const checkboxClasses = cn(
      'peer border-input data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size],
      colorClasses[this.color] || colorClasses.primary,
      hasError &&
        'border-destructive data-[state=checked]:!bg-destructive data-[state=checked]:!border-destructive data-[state=indeterminate]:!bg-destructive data-[state=indeterminate]:!border-destructive',
      this.flat && 'shadow-none',
    )

    const labelClasses = cn(
      'cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      hasError ? 'text-destructive' : '',
      this.disabled && 'cursor-not-allowed opacity-50',
    )

    const label = (pos: 'before' | 'after') =>
      this.label && this.labelPosition === pos
        ? html`<label for=${this.controlId} class=${cn(pos === 'before' ? 'mr-2' : 'ml-2', labelClasses)}
            >${this.label}</label
          >`
        : nothing

    // Radix mounts the indicator only while checked/indeterminate, unless
    // force-mounted (indeterminate or hideIcon).
    const showIndicator = state !== 'unchecked' || isIndeterminate || this.hideIcon
    const iconContent = this.loading
      ? icon(LoaderCircle, 'loader-circle', cn(iconSizes[size], 'animate-spin'))
      : isIndeterminate
        ? icon(Minus, 'minus', cn(iconSizes[size], indicatorIconClasses))
        : !this.hideIcon
          ? icon(Check, 'check', cn(iconSizes[size], indicatorIconClasses))
          : nothing

    const errors = messagesList(this.errorMessages)

    return html`<div class=${cn('flex items-start', densityClasses[density], this.inline ? 'inline-flex' : 'flex-col')}>
      ${label('before')}
      <div class="flex items-center">
        <button
          part="base"
          type="button"
          role="checkbox"
          id=${this.controlId}
          data-slot="checkbox"
          aria-checked=${isIndeterminate ? 'mixed' : this.checked ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : nothing}
          aria-invalid=${hasError ? 'true' : nothing}
          aria-label=${this.accessibleLabel ?? (this.label ? nothing : (this.labelText ?? nothing))}
          data-state=${state}
          ?data-disabled=${this.disabled}
          value=${this.value}
          ?disabled=${this.disabled}
          class=${checkboxClasses}
          @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && e.preventDefault()}
        >
          ${showIndicator
            ? html`<span
                data-uipkge=""
                data-slot="checkbox-indicator"
                data-state=${state}
                ?data-disabled=${this.disabled}
                class="grid place-content-center text-current transition-none"
                ><slot>${iconContent}</slot></span
              >`
            : nothing}
        </button>
        ${label('after')}
      </div>
      ${this.hint && !hasError ? html`<p class="text-muted-foreground mt-1 text-xs">${this.hint}</p>` : nothing}
      ${hasError
        ? html`<div class="mt-1 flex flex-col gap-0.5">
            ${errors.map((msg) => html`<p class="text-destructive text-xs">${msg}</p>`)}
          </div>`
        : nothing}
    </div>`
  }
}

interface CheckboxOption {
  label: string
  value: string
  disabled?: boolean
}

let groupUid = 0

/**
 * <uip-checkbox-group> — React's `CheckboxGroup`.
 *
 * Either renders checkboxes from `options` (property, or a JSON attribute:
 * `options='[{"label":"Apple","value":"apple"}]'` / `'["A","B"]'`), or manages
 * slotted <uip-checkbox> children by their `value`. `value` is a string[]
 * (the `value` attribute takes JSON and is the initial/default value).
 *
 * Props: `label`, `hint`, `error`, `error-messages`, `orientation`
 * (vertical | horizontal), `inline`, `bordered`, `density`, `disabled`, `name`.
 *
 * Form-associated: with a `name`, submits one `name=value` entry per checked
 * item (like Radix's hidden inputs) and resets to the initial value.
 *
 * Events: `input`, `change` (read `.value`), and `value-change`
 * (React's `onValueChange`, `detail: { value }` with the new string[]). The individual
 * checkboxes' own events are stopped at the group.
 */
export class UipCheckboxGroup extends LitElement {
  static formAssociated = true
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { type: Array },
    options: { type: Array },
    disabled: { type: Boolean, reflect: true },
    error: { type: Boolean },
    errorMessages: { attribute: 'error-messages', converter: messagesConverter },
    label: {},
    hint: {},
    orientation: { reflect: true },
    bordered: { type: Boolean },
    density: {},
    name: { reflect: true },
    inline: { type: Boolean },
    accessibleLabel: { attribute: 'aria-label' },
  }

  value: string[] = []
  options: (string | CheckboxOption)[] = []
  disabled = false
  error = false
  errorMessages?: string | string[]
  label?: string
  hint?: string
  orientation: 'horizontal' | 'vertical' = 'vertical'
  bordered = false
  density: Density = 'default'
  name?: string
  inline = false
  accessibleLabel?: string
  private defaultValue: string[] = []
  private readonly labelId = `uip-checkbox-group-${++groupUid}-label`
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'checkbox-group')
    this.defaultValue = [...(this.value ?? [])]
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('name')) {
      if (this.name) {
        const fd = new FormData()
        for (const v of this.value ?? []) fd.append(this.name, v)
        this.internals.setFormValue(fd)
      } else {
        this.internals.setFormValue(null)
      }
    }
  }

  protected updated() {
    this.syncChildren()
  }

  formResetCallback() {
    this.value = [...this.defaultValue]
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get slottedBoxes() {
    return [...this.querySelectorAll('uip-checkbox')]
  }

  // Slotted children follow the group's value / disabled state.
  private syncChildren() {
    if (this.options?.length) return
    for (const box of this.slottedBoxes) {
      box.checked = (this.value ?? []).includes(box.value)
      if (this.disabled) box.disabled = true
    }
  }

  private onChildChange(e: Event) {
    const box = e.target as HTMLElement
    e.stopPropagation()
    if (e.type !== 'change' || box.localName !== 'uip-checkbox') return
    const { value, checked } = box as UipCheckbox
    const selected = this.value ?? []
    this.value = checked ? [...selected.filter((v) => v !== value), value] : selected.filter((v) => v !== value)
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private stop(e: Event) {
    e.stopPropagation()
  }

  render() {
    const orientation = this.inline ? 'horizontal' : this.orientation
    const selected = this.value ?? []
    const errors = messagesList(this.errorMessages)
    const options = this.options ?? []

    return html`<div
      part="base"
      data-slot="checkbox-group"
      role="group"
      data-orientation=${orientation}
      aria-labelledby=${this.label && !this.accessibleLabel ? this.labelId : nothing}
      aria-label=${this.accessibleLabel ?? nothing}
      class=${cn(
        'flex flex-col gap-2',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        this.bordered && 'rounded-lg border p-4',
      )}
      @change=${this.onChildChange}
      @input=${this.stop}
      @checked-change=${this.stop}
    >
      ${this.label ? html`<label id=${this.labelId} class="text-sm font-medium">${this.label}</label>` : nothing}
      ${this.hint && !this.error ? html`<p class="text-muted-foreground text-xs">${this.hint}</p>` : nothing}

      <div class=${cn('flex gap-4', orientation === 'horizontal' ? 'flex-row flex-wrap items-center' : 'flex-col')}>
        ${options.length > 0
          ? options.map((option) => {
              const optValue = typeof option === 'string' ? option : option.value
              const optLabel = typeof option === 'string' ? option : option.label
              const optDisabled = typeof option === 'string' ? false : !!option.disabled
              return html`<uip-checkbox
                .value=${optValue}
                .label=${optLabel}
                .disabled=${this.disabled || optDisabled}
                .density=${this.density}
                .checked=${selected.includes(optValue)}
              ></uip-checkbox>`
            })
          : html`<slot @slotchange=${() => this.syncChildren()}></slot>`}
      </div>

      ${this.error || this.errorMessages
        ? html`<div class="flex flex-col gap-0.5">
            ${errors.map((msg) => html`<p class="text-destructive text-xs">${msg}</p>`)}
          </div>`
        : nothing}
    </div>`
  }
}

customElements.get('uip-checkbox') || customElements.define('uip-checkbox', UipCheckbox)
customElements.get('uip-checkbox-group') || customElements.define('uip-checkbox-group', UipCheckboxGroup)

declare global {
  interface HTMLElementTagNameMap {
    'uip-checkbox': UipCheckbox
    'uip-checkbox-group': UipCheckboxGroup
  }
}

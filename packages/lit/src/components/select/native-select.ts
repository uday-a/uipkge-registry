import { LitElement, css, html, nothing } from 'lit'
import { ChevronDown } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export interface NativeSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export type NativeSelectSize = 'sm' | 'md' | 'lg'

// React's NativeSelect maps, verbatim.
const sizeClasses: Record<NativeSelectSize, string> = {
  sm: 'h-8 text-xs pl-2.5 pr-8',
  md: 'h-9 text-sm pl-3 pr-9',
  lg: 'h-11 text-base pl-4 pr-10',
}

const iconSizes: Record<NativeSelectSize, string> = {
  sm: 'size-3.5 right-2.5',
  md: 'size-4 right-3',
  lg: 'size-5 right-3.5',
}

interface Opt {
  value: string
  label: string
  disabled: boolean
}

/**
 * <uip-native-select> — the registry NativeSelect: a real <select> styled
 * with tokens plus a chevron (no custom listbox, so mobile gets the OS picker).
 *
 *   <uip-native-select default-value="banana" options='[{"label":"Apple","value":"apple"}, …]'></uip-native-select>
 *   <uip-native-select name="fruit">
 *     <option value="apple">Apple</option>
 *     <optgroup label="Citrus"><option value="lime">Lime</option></optgroup>
 *   </uip-native-select>
 *
 * Options come from the `options` property / JSON attribute (strings or
 * `{ label, value, disabled }`) or, when that is empty, from light-DOM
 * <option> / <optgroup> children (read and re-rendered inside the shadow
 * <select>, since a <select> can't take slotted options).
 *
 * `size-variant` = React's `sizeVariant` (sm | md | lg). `value` is the live
 * value, `default-value` seeds it and is what a form reset restores. Host
 * `class` = React's `className` (the wrapper); the select itself is
 * `part="base"` (React's `selectClassName` → `class="[&::part(base)]:…"`), the
 * chevron `part="icon"`.
 *
 * `multiple` (React inherits it from SelectHTMLAttributes): `value` /
 * `default-value` become string[] (set via property; declarative HTML can use
 * multiple `<option selected>`), the form submits one name=value entry per
 * selection, and the chevron hides (a multi-select renders as a listbox).
 * `size` (native visible-row count) is forwarded to the inner <select>.
 *
 * Form-associated (`name`, `required`, reset, disabled fieldset). Forwards
 * `aria-label`. Events: `input` and `change` (bubbling, composed; read `.value`).
 */
export class UipNativeSelect extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: {},
    defaultValue: { attribute: 'default-value' },
    options: {
      converter: {
        fromAttribute: (v: string | null) => {
          if (!v) return []
          try {
            return JSON.parse(v)
          } catch {
            return []
          }
        },
      },
    },
    sizeVariant: { attribute: 'size-variant', reflect: true },
    multiple: { type: Boolean, reflect: true },
    size: { type: Number, reflect: true },
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    childOptions: { state: true },
  }

  value?: string | string[]
  defaultValue?: string | string[]
  options: (NativeSelectOption | string)[] = []
  sizeVariant: NativeSelectSize = 'md'
  multiple = false
  size?: number
  name?: string
  disabled = false
  required = false
  accessibleLabel?: string
  private childOptions: { label?: string; disabled: boolean; items: Opt[] }[] = []
  private internals = this.attachInternals()
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'native-select-wrapper')
    this.readChildren()
    this.childObserver = new MutationObserver(() => this.readChildren())
    this.childObserver.observe(this, { childList: true, subtree: true, characterData: true, attributes: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  private readChildren() {
    const toOpt = (o: HTMLOptionElement): Opt => ({ value: o.value, label: o.textContent?.trim() ?? '', disabled: o.disabled })
    const groups: typeof this.childOptions = []
    for (const el of this.children) {
      if (el instanceof HTMLOptionElement) {
        const last = groups[groups.length - 1]
        if (last && last.label === undefined) last.items.push(toOpt(el))
        else groups.push({ disabled: false, items: [toOpt(el)] })
      } else if (el instanceof HTMLOptGroupElement) {
        groups.push({ label: el.label, disabled: el.disabled, items: [...el.querySelectorAll('option')].map(toOpt) })
      }
    }
    this.childOptions = groups
    // Light-DOM <option selected> seeds the value, like a native select
    // (all of them when `multiple`).
    const sel = [...this.querySelectorAll<HTMLOptionElement>('option[selected]')].map((o) => o.value)
    if (sel.length && this.value === undefined && this.defaultValue === undefined) {
      this.defaultValue = this.multiple ? sel : sel[0]
    }
  }

  private get select() {
    return this.renderRoot?.querySelector('select')
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('defaultValue') && this.value === undefined) this.value = this.defaultValue
    // Keep `value`'s shape in sync when `multiple` toggles.
    if (changed.has('multiple') && this.value !== undefined) {
      if (this.multiple && !Array.isArray(this.value)) this.value = this.value === '' ? [] : [this.value]
      else if (!this.multiple && Array.isArray(this.value)) this.value = this.value[0] ?? ''
    }
  }

  /** Live selection as an array (single-select: 0–1 entries). */
  private selectedValues(): string[] {
    if (Array.isArray(this.value)) return this.value
    return this.value === undefined || this.value === '' ? [] : [this.value]
  }

  protected updated() {
    const s = this.select
    if (!s) return
    // icon() takes no extra attributes; tag the chevron like React does.
    const chevron = this.renderRoot.querySelector('svg')
    chevron?.setAttribute('data-slot', 'native-select-icon')
    chevron?.setAttribute('part', 'icon')
    // Keep the rendered <select> on `value` once its options exist.
    if (this.multiple) {
      const want = new Set(this.selectedValues())
      for (const o of s.options) o.selected = want.has(o.value)
      if (this.value === undefined) this.value = [...s.selectedOptions].map((o) => o.value)
    } else {
      if (this.value !== undefined && s.value !== this.value) s.value = this.value as string
      if (this.value === undefined) this.value = s.value
    }
    const selected = this.multiple ? [...s.selectedOptions].map((o) => o.value) : s.value
    const empty = this.multiple ? selected.length === 0 : !selected
    if (this.multiple) {
      if (this.name && selected.length) {
        const fd = new FormData()
        for (const v of selected as string[]) fd.append(this.name, v)
        this.internals.setFormValue(fd)
      } else {
        this.internals.setFormValue(null)
      }
    } else {
      this.internals.setFormValue((selected as string) || null)
    }
    if (this.required && empty) this.internals.setValidity({ valueMissing: true }, 'Please select an option.', s)
    else this.internals.setValidity({})
  }

  formResetCallback() {
    if (this.defaultValue !== undefined) this.value = this.defaultValue
    else this.value = this.multiple ? [] : this.firstEnabledValue()
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private firstEnabledValue() {
    const opts = this.normalised().flatMap((g) => (g.disabled ? [] : g.items)).filter((o) => !o.disabled)
    return opts[0]?.value
  }

  private normalised() {
    if (this.options?.length)
      return [
        {
          label: undefined,
          disabled: false,
          items: this.options.map((o): Opt =>
            typeof o === 'string'
              ? { value: o, label: o, disabled: false }
              : { value: String(o.value), label: o.label, disabled: !!o.disabled },
          ),
        },
      ]
    return this.childOptions
  }

  private readSelectValue(el: HTMLSelectElement): string | string[] {
    return this.multiple ? [...el.selectedOptions].map((o) => o.value) : el.value
  }

  private onInput(e: Event) {
    this.value = this.readSelectValue(e.target as HTMLSelectElement)
    // The native `input` event is composed: it already reaches the host.
  }

  private onChange(e: Event) {
    this.value = this.readSelectValue(e.target as HTMLSelectElement)
    // `change` is not composed — re-dispatch it from the host.
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  render() {
    const size = sizeClasses[this.sizeVariant] ? this.sizeVariant : 'md'
    const selected = new Set(this.selectedValues())
    const isSelected = (v: string) => (this.multiple ? selected.has(v) : v === this.value)
    const renderOpt = (o: Opt) =>
      html`<option value=${o.value} ?disabled=${o.disabled} ?selected=${isSelected(o.value)}>${o.label}</option>`
    return html`<div class="relative inline-flex w-full items-center">
      <select
        part="base"
        data-slot="native-select"
        name=${this.name ?? nothing}
        aria-label=${this.accessibleLabel ?? nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?multiple=${this.multiple}
        size=${this.size ?? nothing}
        class=${cn(
          'border-input bg-background w-full appearance-none rounded-md border shadow-xs transition-[color,box-shadow]',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
          'disabled:bg-muted/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size],
        )}
        @input=${this.onInput}
        @change=${this.onChange}
      >
        ${this.normalised().map((g) =>
          g.label === undefined
            ? g.items.map(renderOpt)
            : html`<optgroup label=${g.label} ?disabled=${g.disabled}>${g.items.map(renderOpt)}</optgroup>`,
        )}
      </select>
      ${this.multiple
        ? nothing
        : icon(
            ChevronDown,
            'chevron-down',
            cn(
              'text-muted-foreground pointer-events-none absolute transition-opacity',
              this.disabled && 'opacity-50',
              iconSizes[size],
            ),
          )}
    </div>`
  }
}

customElements.get('uip-native-select') || customElements.define('uip-native-select', UipNativeSelect)

declare global {
  interface HTMLElementTagNameMap {
    'uip-native-select': UipNativeSelect
  }
}

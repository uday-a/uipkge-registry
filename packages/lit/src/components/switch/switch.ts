import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { LoaderCircle } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

type Size = 'sm' | 'default' | 'lg'

const colorMap: Record<string, string> = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--destructive)',
  info: 'var(--info)',
}

const thumbSizes = {
  sm: 'size-3',
  default: 'size-4',
  lg: 'size-5',
}

const thumbTranslate = {
  sm: 'data-[state=checked]:translate-x-[calc(100%-2px)]',
  default: 'data-[state=checked]:translate-x-[calc(100%-2px)]',
  lg: 'data-[state=checked]:translate-x-[calc(100%-5px)]',
}

const textSizes = {
  sm: 'text-[0.5rem]',
  default: 'text-xs',
  lg: 'text-xs',
}

const thumbIconSizes = {
  sm: 'size-2',
  default: 'size-3',
  lg: 'size-3',
}

/**
 * <uip-switch> — the registry Switch as a web component.
 *
 * Class strings are React's `Switch` verbatim. The inner <button role=switch>
 * carries `data-state` / `aria-checked` like Radix's Switch.Root.
 *
 * Content (React's node props become named slots; string props stay attributes):
 *  - `checked-children` / `un-checked-children` attributes, or
 *    `slot="checked-children"` / `slot="un-checked-children"` for icons;
 *  - `slot="thumb"` for custom thumb content (React's `thumb` render prop —
 *    read the host's `checked` / `data-state` to vary it).
 *
 * Form-associated: submits `name=value` (value defaults to "on", like Radix)
 * when checked, supports `required`, resets to the initial `checked`
 * attribute. A light-DOM `<label for>` pointing at the host toggles it and
 * names the inner switch.
 *
 * Events: `input`, `change` (read `.checked`), and `checked-change`
 * (React's `onCheckedChange`, `detail` = the new boolean).
 */
export class UipSwitch extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    // `checked` attribute = initial/default state (like <input checked>);
    // the `checked` property is the live state.
    checked: { type: Boolean, attribute: false },
    defaultChecked: { type: Boolean, attribute: 'checked' },
    size: { reflect: true },
    checkedChildren: { attribute: 'checked-children' },
    unCheckedChildren: { attribute: 'un-checked-children' },
    loading: { type: Boolean, reflect: true },
    color: {},
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    name: { reflect: true },
    value: {},
    accessibleLabel: { attribute: 'aria-label' },
    hasCheckedSlot: { state: true },
    hasUncheckedSlot: { state: true },
    labelText: { state: true },
  }

  /** Current state. The `checked` attribute is the initial (default) state. */
  checked = false
  defaultChecked = false
  size: Size = 'default'
  checkedChildren?: string
  unCheckedChildren?: string
  loading = false
  color?: string
  disabled = false
  required = false
  name?: string
  value = 'on'
  accessibleLabel?: string
  private hasCheckedSlot = false
  private hasUncheckedSlot = false
  private labelText?: string

  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
    // One listener for both sources: a click on the inner button bubbles to
    // the host, and a `<label for>` click is dispatched on the host itself.
    this.addEventListener('click', () => this.toggle())
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'switch')
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Attribute changes drive the state (so attribute-only frameworks work);
    // on first render only a present attribute applies, so a `.checked = true`
    // set before connect isn't overwritten by the absent attribute.
    if (changed.has('defaultChecked') && (this.hasUpdated || this.defaultChecked)) this.checked = this.defaultChecked
    this.setAttribute('data-state', this.checked ? 'checked' : 'unchecked')
    if (changed.has('checked') || changed.has('required') || changed.has('value')) {
      this.internals.setFormValue(this.checked ? this.value : null)
      if (this.required && !this.checked) {
        this.internals.setValidity({ valueMissing: true }, 'Please turn this on.', this.button ?? undefined)
      } else {
        this.internals.setValidity({})
      }
    }
    // Labels associated with the host name the inner switch.
    const labels = [...(this.internals.labels ?? [])] as HTMLElement[]
    this.labelText = labels.map((l) => l.textContent?.trim()).filter(Boolean).join(' ') || undefined
  }

  formResetCallback() {
    this.checked = this.defaultChecked
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get button() {
    return this.renderRoot?.querySelector<HTMLButtonElement>('[role=switch]')
  }

  private toggle() {
    if (this.disabled || this.loading) return
    this.checked = !this.checked
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('checked-change', { detail: this.checked, bubbles: true, composed: true }))
  }

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    const has = slot.assignedNodes().length > 0
    if (slot.name === 'checked-children') this.hasCheckedSlot = has
    else this.hasUncheckedSlot = has
  }

  render() {
    const size = this.size in thumbSizes ? this.size : 'default'
    const hasChildren = Boolean(
      this.checkedChildren || this.unCheckedChildren || this.hasCheckedSlot || this.hasUncheckedSlot,
    )
    const height = { sm: 'h-4', default: 'h-5', lg: 'h-6' }[size]
    const width = hasChildren
      ? { sm: 'min-w-8 w-fit', default: 'min-w-10 w-fit', lg: 'min-w-13 w-fit' }[size]
      : { sm: 'w-6', default: 'w-8', lg: 'w-11' }[size]
    const state = this.checked ? 'checked' : 'unchecked'
    const isDisabled = this.disabled || this.loading
    // Runtime value (any CSS colour) — the one dynamic style React sets too.
    const trackStyle = {
      '--switch-checked-bg': this.color ? colorMap[this.color] || this.color : 'var(--primary)',
    }

    return html`<button
      part="base"
      type="button"
      role="switch"
      data-slot="switch"
      aria-checked=${this.checked ? 'true' : 'false'}
      aria-required=${this.required ? 'true' : nothing}
      aria-label=${this.accessibleLabel ?? this.labelText ?? nothing}
      data-state=${state}
      ?data-disabled=${isDisabled}
      value=${this.value}
      ?disabled=${isDisabled}
      style=${styleMap(trackStyle)}
      class=${cn(
        'peer focus-visible:ring-ring/50 focus-visible:border-ring data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 relative inline-flex shrink-0 items-center overflow-hidden rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--switch-checked-bg)]',
        'touch-manipulation enabled:active:scale-[0.97] enabled:active:duration-100 motion-safe:transition-[background-color,border-color,box-shadow,transform,scale] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        `${height} ${width}`,
      )}
    >
      <div
        ?hidden=${!hasChildren}
        class=${cn(
          'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          this.checked ? 'translate-x-0 opacity-100' : '-translate-x-0.5 opacity-0',
          textSizes[size],
        )}
      >
        <span class="text-primary-foreground truncate font-medium"
          ><slot name="checked-children" @slotchange=${this.onSlotChange}>${this.checkedChildren ?? nothing}</slot></span
        >
      </div>
      <div
        ?hidden=${!hasChildren}
        class=${cn(
          'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          !this.checked ? 'translate-x-0 opacity-100' : 'translate-x-0.5 opacity-0',
          textSizes[size],
        )}
      >
        <span class="text-muted-foreground truncate font-medium"
          ><slot name="un-checked-children" @slotchange=${this.onSlotChange}>${this.unCheckedChildren ?? nothing}</slot></span
        >
      </div>
      <span
        part="thumb"
        data-uipkge=""
        data-slot="switch-thumb"
        data-state=${state}
        ?data-disabled=${isDisabled}
        class=${cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none z-10 flex items-center justify-center rounded-full shadow-sm ring-0 data-[state=unchecked]:translate-x-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1.15,0.36,1)] motion-reduce:transition-none',
          thumbSizes[size],
          thumbTranslate[size],
        )}
      >
        ${this.loading
          ? // lucide-react's Loader2 alias emits both lucide-loader-2 and lucide-loader-circle.
            icon(LoaderCircle, 'loader-2', cn('lucide-loader-circle', thumbIconSizes[size], 'text-muted-foreground motion-safe:animate-spin'))
          : html`<slot name="thumb"></slot>`}
      </span>
    </button>`
  }
}

customElements.get('uip-switch') || customElements.define('uip-switch', UipSwitch)

declare global {
  interface HTMLElementTagNameMap {
    'uip-switch': UipSwitch
  }
}

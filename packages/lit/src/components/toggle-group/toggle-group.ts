import { LitElement, css, html, nothing, type PropertyValues } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { toggleVariants, type ToggleVariants } from './toggle-group.variants'

type Variant = NonNullable<ToggleVariants['variant']>
type Size = NonNullable<ToggleVariants['size']>

interface Item {
  el: UipToggleGroupItem
  value: string
  label?: string
  disabled: boolean
  variant?: Variant
  size?: Size
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * <uip-toggle-group-item> — marks one item of a <uip-toggle-group>: `value`,
 * `disabled`, `aria-label`, optional per-item `variant` / `size` (the group's
 * win, like React's context). Its children (icon / text) are the item's label.
 *
 * It renders nothing of its own: the group renders the real <button> in its
 * shadow root and slots this element into it (manual slot assignment), so all
 * buttons, the sliding indicator and the roving focus live in ONE shadow root
 * and React's `group-data-*` / `first-of-type` classes keep working.
 */
export class UipToggleGroupItem extends LitElement {
  // display: contents so the slotted icon/text lay out as the button's own flex children.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    value: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    variant: { reflect: true },
    size: { reflect: true },
  }

  value = ''
  disabled = false
  variant?: Variant
  size?: Size

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'toggle-group-item')
  }

  render() {
    // React's `[&_svg]:…` item classes, re-expressed for a slotted <svg>.
    return html`<slot
      class="[&::slotted(svg)]:pointer-events-none [&::slotted(svg)]:shrink-0 [&::slotted(svg:not([class*='size-']))]:size-4"
    ></slot>`
  }
}

/**
 * <uip-toggle-group> — the registry ToggleGroup + ToggleGroupItem (Radix toggle-group).
 *
 *   <uip-toggle-group type="single" value="center">
 *     <uip-toggle-group-item value="left" aria-label="Align left"><svg …/></uip-toggle-group-item>
 *     …
 *   </uip-toggle-group>
 *
 * Props (React names): `type` ('single' | 'multiple'), `value` / `default-value`
 * (string for single, string[] for multiple; attribute "bold,italic"), `variant`,
 * `size`, `spacing` (number, default 0), `animated` (sliding indicator for single,
 * default true; `animated="false"` turns it off), `disabled`, `orientation`,
 * `roving-focus` (default true), `loop` (default true), `name`, `required`.
 *
 * Events (bubble, composed): `input`, `change`, and `value-change` (React
 * `onValueChange`; `detail: { value }`, value: string | string[]). Like Radix, clicking the pressed
 * item of a single group clears the value ('').
 *
 * Form-associated: submits `name=value` (single) or one `name=value` per pressed
 * item (multiple); `required` is invalid while nothing is pressed.
 */
export class UipToggleGroup extends LitElement {
  static formAssociated = true
  static shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
    slotAssignment: 'manual',
  }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    type: { reflect: true },
    value: {},
    defaultValue: { attribute: 'default-value' },
    variant: { reflect: true },
    size: { reflect: true },
    spacing: { type: Number },
    animated: { converter: { fromAttribute: (v: string | null) => v !== 'false' } },
    disabled: { type: Boolean, reflect: true },
    orientation: { reflect: true },
    rovingFocus: { attribute: 'roving-focus', converter: { fromAttribute: (v: string | null) => v !== 'false' } },
    loop: { converter: { fromAttribute: (v: string | null) => v !== 'false' } },
    name: { reflect: true },
    required: { type: Boolean, reflect: true },
    items: { state: true },
    tabStop: { state: true },
  }

  type: 'single' | 'multiple' = 'single'
  value?: string | string[]
  defaultValue?: string | string[]
  variant?: Variant
  size?: Size
  spacing = 0
  animated = true
  disabled = false
  orientation?: 'horizontal' | 'vertical'
  rovingFocus = true
  loop = true
  name?: string
  required = false
  private items: Item[] = []
  private tabStop = -1

  private initialValue: string | string[] = ''
  private firstPosition = true
  private internals = this.attachInternals()
  private childObserver?: MutationObserver
  private resizeObserver?: ResizeObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'toggle-group')
    this.readItems()
    this.childObserver = new MutationObserver(() => this.readItems())
    this.childObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value', 'disabled', 'aria-label', 'variant', 'size'],
    })
    this.resizeObserver = new ResizeObserver(() => this.updateIndicator())
    this.firstPosition = true
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
    this.resizeObserver?.disconnect()
  }

  private readItems() {
    this.items = [...this.children]
      .filter((el): el is UipToggleGroupItem => el.localName === 'uip-toggle-group-item')
      .map((el) => ({
        el,
        value: el.getAttribute('value') ?? '',
        label: el.getAttribute('aria-label') ?? undefined,
        disabled: el.hasAttribute('disabled'),
        variant: (el.getAttribute('variant') as Variant) ?? undefined,
        size: (el.getAttribute('size') as Size) ?? undefined,
      }))
  }

  /** The value as a list, whatever form it was given in. */
  private get values(): string[] {
    const v = this.value
    if (Array.isArray(v)) return v
    if (!v) return []
    return this.type === 'multiple' ? v.split(',').map((s) => s.trim()).filter(Boolean) : [v]
  }

  private get indicatorActive() {
    return this.animated !== false && this.type !== 'multiple'
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (this.value === undefined) this.value = this.defaultValue ?? (this.type === 'multiple' ? [] : '')
    if (!this.hasUpdated) this.initialValue = this.value
    if (changed.has('value') || changed.has('name') || changed.has('required') || changed.has('type')) {
      const vals = this.values
      if (!this.name || !vals.length) this.internals.setFormValue(null)
      else if (vals.length === 1) this.internals.setFormValue(vals[0])
      else {
        const fd = new FormData()
        vals.forEach((v) => fd.append(this.name!, v))
        this.internals.setFormValue(fd)
      }
      if (this.required && !vals.length) {
        this.internals.setValidity({ valueMissing: true }, 'Please select an option.', this.buttons[0] ?? undefined)
      } else this.internals.setValidity({})
    }
    if (changed.has('animated') || changed.has('type') || changed.has('size') || changed.has('spacing') || changed.has('variant')) {
      this.firstPosition = true
    }
  }

  protected updated() {
    // Manual slot assignment: each item element goes into its own button.
    const slots = this.renderRoot.querySelectorAll<HTMLSlotElement>('slot[data-item]')
    slots.forEach((slot, i) => {
      const el = this.items[i]?.el
      if (el && slot.assignedNodes()[0] !== el) slot.assign(el)
    })
    this.resizeObserver?.disconnect()
    if (this.indicatorActive) {
      const root = this.renderRoot.querySelector('[data-slot=toggle-group]')
      if (root) this.resizeObserver?.observe(root)
      this.buttons.forEach((b) => this.resizeObserver?.observe(b))
    }
    this.updateIndicator()
  }

  // --- form callbacks -------------------------------------------------------
  formResetCallback() {
    this.value = this.initialValue
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get buttons() {
    return [...(this.renderRoot?.querySelectorAll<HTMLButtonElement>('button[data-slot=toggle-group-item]') ?? [])]
  }

  /** React's updateIndicator: size/translate the pill onto the pressed item. */
  private updateIndicator() {
    const ind = this.renderRoot?.querySelector<HTMLElement>('[data-slot=toggle-group-indicator]')
    const root = this.renderRoot?.querySelector<HTMLElement>('[data-slot=toggle-group]')
    if (!ind || !root) return
    const active = root.querySelector<HTMLElement>('[data-slot="toggle-group-item"][data-state="on"]')
    if (!active) {
      ind.style.opacity = '0'
      return
    }
    const listRect = root.getBoundingClientRect()
    const r = active.getBoundingClientRect()
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    Object.assign(ind.style, {
      width: `${r.width}px`,
      height: `${r.height}px`,
      transform: `translate3d(${r.left - listRect.left + root.scrollLeft}px, ${r.top - listRect.top + root.scrollTop}px, 0)`,
      borderRadius: getComputedStyle(active).borderRadius,
      opacity: '1',
      transition:
        reduce || this.firstPosition
          ? 'none'
          : `transform 220ms ${EASE}, width 220ms ${EASE}, height 220ms ${EASE}, border-radius 220ms ${EASE}`,
    })
    this.firstPosition = false
  }

  private toggle(item: Item) {
    if (this.disabled || item.disabled) return
    const pressed = this.values.includes(item.value)
    let next: string | string[]
    if (this.type === 'multiple') {
      next = pressed ? this.values.filter((v) => v !== item.value) : [...this.values, item.value]
    } else {
      next = pressed ? '' : item.value
    }
    this.value = next
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: Array.isArray(next) ? [...next] : next },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private isFocusable(i: number) {
    return !this.disabled && !this.items[i]?.disabled
  }

  /** Radix RovingFocusGroup: the pressed item (or the first focusable) is the tab stop. */
  private currentTabStop() {
    if (this.tabStop >= 0 && this.isFocusable(this.tabStop)) return this.tabStop
    const pressed = this.items.findIndex((it, i) => this.values.includes(it.value) && this.isFocusable(i))
    if (pressed >= 0) return pressed
    return this.items.findIndex((_, i) => this.isFocusable(i))
  }

  private onKeyDown(e: KeyboardEvent) {
    if (!this.rovingFocus) return
    const horizontalKeys = ['ArrowLeft', 'ArrowRight']
    const verticalKeys = ['ArrowUp', 'ArrowDown']
    if (this.orientation === 'vertical' && horizontalKeys.includes(e.key)) return
    if (this.orientation === 'horizontal' && verticalKeys.includes(e.key)) return
    const focusable = this.items.map((_, i) => i).filter((i) => this.isFocusable(i))
    if (!focusable.length) return
    const current = focusable.indexOf(this.buttons.indexOf(e.target as HTMLButtonElement))
    let next: number
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        next = current <= 0 ? (this.loop ? focusable.length - 1 : 0) : current - 1
        break
      case 'ArrowRight':
      case 'ArrowDown':
        next = current >= focusable.length - 1 ? (this.loop ? 0 : focusable.length - 1) : current + 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = focusable.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    this.tabStop = focusable[next]
    this.buttons[focusable[next]]?.focus()
  }

  render() {
    const vals = this.values
    const indicator = this.indicatorActive
    const tabStop = this.rovingFocus ? this.currentTabStop() : -1
    return html`<div
      part="root"
      data-uipkge=""
      data-slot="toggle-group"
      role=${this.type === 'multiple' ? 'toolbar' : 'radiogroup'}
      dir="ltr"
      data-orientation=${this.rovingFocus ? (this.orientation ?? nothing) : nothing}
      data-size=${this.size ?? nothing}
      data-variant=${this.variant ?? nothing}
      data-spacing=${this.spacing}
      data-animated=${indicator ? 'true' : 'false'}
      aria-orientation=${this.orientation ?? nothing}
      style=${`--gap: ${this.spacing}`}
      class="group/toggle-group relative flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs"
      @keydown=${this.onKeyDown}
    >
      ${indicator
        ? html`<span
            data-slot="toggle-group-indicator"
            aria-hidden="true"
            class="bg-accent pointer-events-none absolute top-0 left-0 z-0 shadow-xs will-change-transform opacity-0"
          ></span>`
        : nothing}
      ${this.items.map((it, i) => {
        const pressed = vals.includes(it.value)
        const disabled = this.disabled || it.disabled
        const variant = this.variant || it.variant
        const size = this.size || it.size
        const single = this.type !== 'multiple'
        return html`<button
          part="item"
          type="button"
          data-uipkge=""
          data-slot="toggle-group-item"
          data-variant=${variant ?? nothing}
          data-size=${size ?? nothing}
          data-spacing=${this.spacing}
          data-state=${pressed ? 'on' : 'off'}
          ?data-disabled=${disabled}
          data-orientation=${this.rovingFocus ? (this.orientation ?? nothing) : nothing}
          role=${single ? 'radio' : nothing}
          aria-checked=${single ? String(pressed) : nothing}
          aria-pressed=${single ? nothing : String(pressed)}
          aria-label=${it.label ?? nothing}
          ?disabled=${disabled}
          tabindex=${this.rovingFocus ? (i === tabStop ? 0 : -1) : nothing}
          class=${cn(
            toggleVariants({ variant, size }),
            'relative z-10 w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
            'group-data-[animated=true]/toggle-group:data-[state=on]:bg-transparent group-data-[animated=true]/toggle-group:data-[state=on]:hover:bg-transparent',
            'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first-of-type:rounded-l-md data-[spacing=0]:last-of-type:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first-of-type:border-l',
          )}
          @click=${() => this.toggle(it)}
          @focus=${() => (this.tabStop = i)}
        >
          <slot data-item></slot>
        </button>`
      })}
    </div>`
  }
}

customElements.get('uip-toggle-group-item') || customElements.define('uip-toggle-group-item', UipToggleGroupItem)
customElements.get('uip-toggle-group') || customElements.define('uip-toggle-group', UipToggleGroup)

declare global {
  interface HTMLElementTagNameMap {
    'uip-toggle-group': UipToggleGroup
    'uip-toggle-group-item': UipToggleGroupItem
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const groupSizeClasses: Record<string, string> = {
  small: 'h-8 text-xs',
  middle: 'h-9 text-sm',
  large: 'h-11 text-base',
}

/**
 * <uip-input-group> — React's `InputGroup`: one bordered row holding
 * <uip-input-group-addon>, <uip-input> and <uip-input-group-button> children.
 *
 * Two shadow-DOM adaptations:
 *  - React restyles the nested Input through descendant selectors
 *    (`[&_[data-slot=input]]:…`, `[&_input]:…`); those can't reach into
 *    <uip-input>'s shadow root, so <uip-input> applies the same classes itself
 *    when it's inside a group (the strings are kept here for parity, inert).
 *  - `first:` / `last:` on the addon/button can't see light-DOM siblings from
 *    inside their shadow roots, so the group marks its first and last child
 *    with `data-first` / `data-last` and they use `data-[first]:` / `data-[last]:`.
 */
export class UipInputGroup extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    size: { reflect: true },
    disabled: { type: Boolean, reflect: true },
  }

  size: 'small' | 'middle' | 'large' = 'middle'
  disabled = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'input-group')
  }

  willUpdate() {
    this.setAttribute('data-size', this.size)
    this.toggleAttribute('data-disabled', this.disabled)
  }

  private onSlotChange(e: Event) {
    const els = (e.target as HTMLSlotElement).assignedElements()
    els.forEach((el, i) => {
      el.toggleAttribute('data-first', i === 0)
      el.toggleAttribute('data-last', i === els.length - 1)
    })
  }

  render() {
    return html`<div
      part="base"
      data-slot="input-group"
      data-size=${this.size}
      ?data-disabled=${this.disabled}
      class=${cn(
        'group/input-group border-input bg-background relative flex w-full items-stretch rounded-md border shadow-xs transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:outline-none',
        '[&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:focus-within:ring-0',
        '[&_input]:h-full [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:focus-visible:ring-0',
        this.disabled && 'bg-muted/30 pointer-events-none cursor-not-allowed opacity-50',
        groupSizeClasses[this.size] ?? groupSizeClasses.middle,
      )}
    >
      <slot class="[&::slotted(uip-input)]:w-full" @slotchange=${this.onSlotChange}></slot>
    </div>`
  }
}

/** <uip-input-group-addon> — React's `InputGroupAddon` (static text or an icon). */
export class UipInputGroupAddon extends LitElement {
  // flex so the inner addon stretches to the group's height like React's flex item.
  static styles = [tailwind, css`:host { display: flex; }`]

  static properties = {
    align: { reflect: true },
    first: { type: Boolean, attribute: 'data-first' },
    last: { type: Boolean, attribute: 'data-last' },
  }

  align: 'inline' | 'block' = 'inline'
  first = false
  last = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'input-group-addon')
  }

  render() {
    return html`<div
      part="base"
      data-slot="input-group-addon"
      ?data-first=${this.first}
      ?data-last=${this.last}
      class=${cn(
        'text-muted-foreground flex shrink-0 items-center justify-center px-3 text-sm select-none',
        'border-input data-[first]:rounded-l-[calc(var(--radius)-1px)] data-[last]:rounded-r-[calc(var(--radius)-1px)]',
        'border-r data-[first]:border-l-0 data-[last]:border-r-0',
      )}
    >
      <slot></slot>
    </div>`
  }
}

const buttonVariantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'border-l border-input hover:bg-accent hover:text-accent-foreground',
}

/**
 * <uip-input-group-button> — React's `InputGroupButton`. `type="submit"` /
 * `"reset"` act on the host's form (a shadow <button> can't on its own).
 */
export class UipInputGroupButton extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // flex so the inner button stretches to the group's height like React's flex item.
  static styles = [tailwind, css`:host { display: flex; }`]

  static properties = {
    variant: { reflect: true },
    type: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    first: { type: Boolean, attribute: 'data-first' },
    last: { type: Boolean, attribute: 'data-last' },
  }

  variant: 'default' | 'secondary' | 'ghost' | 'outline' = 'ghost'
  type: 'button' | 'submit' | 'reset' = 'button'
  disabled = false
  accessibleLabel?: string
  first = false
  last = false
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'input-group-button')
  }

  private onClick() {
    const form = this.internals.form
    if (this.disabled || !form) return
    if (this.type === 'submit') form.requestSubmit()
    else if (this.type === 'reset') form.reset()
  }

  render() {
    return html`<button
      part="base"
      type="button"
      data-slot="input-group-button"
      ?data-first=${this.first}
      ?data-last=${this.last}
      ?disabled=${this.disabled}
      aria-label=${this.accessibleLabel ?? nothing}
      class=${cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 px-3 text-sm font-medium transition-colors select-none',
        'data-[first]:rounded-l-[calc(var(--radius)-1px)] data-[last]:rounded-r-[calc(var(--radius)-1px)]',
        'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        buttonVariantClasses[this.variant] ?? buttonVariantClasses.ghost,
      )}
      @click=${this.onClick}
    >
      <slot></slot>
    </button>`
  }
}

customElements.get('uip-input-group') || customElements.define('uip-input-group', UipInputGroup)
customElements.get('uip-input-group-addon') || customElements.define('uip-input-group-addon', UipInputGroupAddon)
customElements.get('uip-input-group-button') || customElements.define('uip-input-group-button', UipInputGroupButton)

declare global {
  interface HTMLElementTagNameMap {
    'uip-input-group': UipInputGroup
    'uip-input-group-addon': UipInputGroupAddon
    'uip-input-group-button': UipInputGroupButton
  }
}

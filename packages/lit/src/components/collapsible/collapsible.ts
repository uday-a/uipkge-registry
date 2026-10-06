import { LitElement, css, html, nothing } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

let uid = 0

/**
 * <uip-collapsible> — the registry Collapsible root (Radix Collapsible.Root).
 *
 * Light-DOM layout: put <uip-collapsible-trigger> and
 * <uip-collapsible-content> anywhere inside (a header row, after static rows…),
 * exactly like the React parts. Trigger and content are in the same tree, so
 * the trigger's `aria-controls` resolves to the content's id.
 *
 * `open` is the state (reflected); `default-open` sets the initial state.
 * Events: `open-change` (detail: { open }) — React's `onOpenChange`.
 */
export class UipCollapsible extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    open: { type: Boolean, reflect: true },
    defaultOpen: { type: Boolean, attribute: 'default-open' },
    disabled: { type: Boolean, reflect: true },
  }

  open = false
  defaultOpen = false
  disabled = false
  private initialised = false
  private parts = new Set<LitElement>()
  content?: UipCollapsibleContent

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'collapsible')
    if (!this.initialised) {
      this.initialised = true
      if (this.defaultOpen && !this.hasAttribute('open')) this.open = true
    }
  }

  /** Parts register so they re-render when the state changes. */
  register(part: LitElement) {
    this.parts.add(part)
    if (part instanceof UipCollapsibleContent) this.content = part
    this.parts.forEach((p) => p.requestUpdate())
  }

  unregister(part: LitElement) {
    this.parts.delete(part)
    if (this.content === part) this.content = undefined
  }

  toggle() {
    if (this.disabled) return
    this.open = !this.open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: this.open }, bubbles: true, composed: true }))
  }

  protected willUpdate() {
    this.setAttribute('data-state', this.open ? 'open' : 'closed')
    this.toggleAttribute('data-disabled', this.disabled)
  }

  protected updated() {
    this.parts.forEach((p) => p.requestUpdate())
  }

  render() {
    return html`<slot></slot>`
  }
}

/** Shared registration with the closest <uip-collapsible>. */
abstract class CollapsiblePart extends LitElement {
  protected root?: UipCollapsible | null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.root = this.parentElement?.closest('uip-collapsible')
    this.root?.register(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.root?.unregister(this)
    this.root = undefined
  }

  protected get isOpen() {
    return !!this.root?.open
  }
  protected get isDisabled() {
    return !!this.root?.disabled
  }
}

/**
 * <uip-collapsible-trigger> — Radix Collapsible.Trigger.
 *
 * Default: renders its own <button> around the slotted content. `as-child`
 * (React's `asChild`): renders nothing of its own and puts `aria-controls`,
 * `aria-expanded`, `data-state` (and `disabled`) on its first child element,
 * e.g. a <uip-button>. Clicking toggles the root.
 */
export class UipCollapsibleTrigger extends CollapsiblePart {
  // display: contents so the button / child is laid out by the surrounding row.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    asChild: { type: Boolean, attribute: 'as-child' },
  }

  asChild = false
  private disabledChild?: Element

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'collapsible-trigger')
  }

  private get child() {
    return this.firstElementChild ?? undefined
  }

  private onClick() {
    this.root?.toggle()
  }

  protected updated() {
    const open = this.isOpen
    const state = open ? 'open' : 'closed'
    this.setAttribute('data-state', state)
    const contentId = this.root?.content?.id
    if (this.asChild) {
      const child = this.child
      if (!child) return
      child.setAttribute('aria-expanded', String(open))
      child.setAttribute('data-state', state)
      if (contentId) child.setAttribute('aria-controls', contentId)
      child.toggleAttribute('data-disabled', this.isDisabled)
      if (this.isDisabled && !child.hasAttribute('disabled')) {
        child.setAttribute('disabled', '')
        this.disabledChild = child
      } else if (!this.isDisabled && this.disabledChild === child) {
        child.removeAttribute('disabled')
        this.disabledChild = undefined
      }
      return
    }
    // aria-controls can't point out of this shadow root by id; element
    // reflection can (where supported).
    const button = this.renderRoot.querySelector('button') as
      | (HTMLButtonElement & { ariaControlsElements?: Element[] | null })
      | null
    if (button && 'ariaControlsElements' in button) {
      button.ariaControlsElements = this.root?.content ? [this.root.content] : null
    }
  }

  render() {
    if (this.asChild) return html`<slot @click=${this.onClick} @slotchange=${() => this.requestUpdate()}></slot>`
    const open = this.isOpen
    return html`<button
      part="base"
      type="button"
      data-uipkge=""
      data-slot="collapsible-trigger"
      aria-expanded=${open ? 'true' : 'false'}
      data-state=${open ? 'open' : 'closed'}
      ?data-disabled=${this.isDisabled}
      ?disabled=${this.isDisabled}
      @click=${this.onClick}
    >
      <slot></slot>
    </button>`
  }
}

/**
 * <uip-collapsible-content> — Radix Collapsible.Content. The host is the
 * content box (consumer classes such as `mt-1 space-y-1` apply to it) and is
 * `hidden` while closed, like Radix unmounting it.
 */
export class UipCollapsibleContent extends CollapsiblePart {
  // Block while shown; the `hidden` attribute (closed) keeps the UA display:none.
  static styles = [tailwind, css`:host(:not([hidden])) { display: block; }`]

  connectedCallback() {
    if (!this.id) this.id = `uip-collapsible-content-${++uid}`
    super.connectedCallback()
    this.setAttribute('data-slot', 'collapsible-content')
  }

  protected willUpdate() {
    const open = this.isOpen
    this.setAttribute('data-state', open ? 'open' : 'closed')
    this.toggleAttribute('data-disabled', this.isDisabled)
    this.hidden = !open
  }

  render() {
    return this.isOpen ? html`<slot></slot>` : nothing
  }
}

customElements.get('uip-collapsible') || customElements.define('uip-collapsible', UipCollapsible)
customElements.get('uip-collapsible-trigger') || customElements.define('uip-collapsible-trigger', UipCollapsibleTrigger)
customElements.get('uip-collapsible-content') || customElements.define('uip-collapsible-content', UipCollapsibleContent)

declare global {
  interface HTMLElementTagNameMap {
    'uip-collapsible': UipCollapsible
    'uip-collapsible-trigger': UipCollapsibleTrigger
    'uip-collapsible-content': UipCollapsibleContent
  }
}

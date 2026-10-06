import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { autoUpdate, computePosition, type Align, type Side } from '../../lib/position'

/**
 * <uip-hover-card> — the registry HoverCard (Root + Trigger + Content) as ONE
 * web component.
 *
 *   <uip-hover-card>
 *     <uip-button slot="trigger" variant="link">@uipkge</uip-button>
 *     <div slot="content">…rich card markup…</div>
 *   </uip-hover-card>
 *
 * The `trigger` slot is the hover target; `slot="content"` is the card (the
 * default slot aliases the trigger, so a bare child works too). Content
 * classes are React's HoverCardContent string verbatim; the card is a native
 * `popover="manual"` (top layer, no portal) positioned with `computePosition`,
 * with `data-side` / `data-align` / `data-state` like Radix — on both the card
 * and the trigger.
 *
 * Opens on hover after `open-delay` ms (default 700, like Radix) and
 * immediately on keyboard focus; moving between trigger and card keeps it
 * open; leaving both closes after `close-delay` ms (default 300). Escape
 * closes. `open` reflects the state (controlled: set it directly, or
 * `show()` / `hide()`).
 *
 * Styling: the card is `part="content"` — React's HoverCardContent `className`
 * becomes `class="[&::part(content)]:w-72"` on the host. A `display` utility
 * must be scoped to the open state (`[&::part(content):popover-open]:flex`).
 *
 * Events: `open-change` (detail: { open }).
 */
export class UipHoverCard extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  // `contents`: React's asChild trigger adds no box, so inline @-mentions in a
  // paragraph keep flowing (like <uip-tooltip>).
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    open: { type: Boolean, reflect: true },
    side: { reflect: true },
    align: {},
    sideOffset: { type: Number, attribute: 'side-offset' },
    alignOffset: { type: Number, attribute: 'align-offset' },
    openDelay: { type: Number, attribute: 'open-delay' },
    closeDelay: { type: Number, attribute: 'close-delay' },
    disabled: { type: Boolean, reflect: true },
    state: { state: true },
    placedSide: { state: true },
    pos: { state: true },
  }

  open = false
  side: Side = 'bottom'
  align: Align = 'center'
  sideOffset = 4
  alignOffset = 0
  openDelay = 700
  closeDelay = 300
  disabled = false
  private state: 'open' | 'closed' = 'closed'
  private placedSide: Side = 'bottom'
  private pos: Record<string, string> = {}
  private openTimer?: ReturnType<typeof setTimeout>
  private closeTimer?: ReturnType<typeof setTimeout>
  private stopAutoUpdate?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'hover-card')
    this.addEventListener('pointerenter', this.onPointerEnter)
    this.addEventListener('pointerleave', this.onPointerLeave)
    this.addEventListener('focusin', this.onFocusIn)
    this.addEventListener('focusout', this.onFocusOut)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('pointerenter', this.onPointerEnter)
    this.removeEventListener('pointerleave', this.onPointerLeave)
    this.removeEventListener('focusin', this.onFocusIn)
    this.removeEventListener('focusout', this.onFocusOut)
    this.teardown()
  }

  /** The trigger: `slot="trigger"` child, or the first default-slot element. */
  get trigger(): HTMLElement | undefined {
    const named = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    const el = named?.assignedElements({ flatten: true })[0] as HTMLElement | undefined
    if (el) return el
    const def = this.renderRoot?.querySelector<HTMLSlotElement>('slot:not([name])')
    return (def?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ?? undefined
  }

  private get card() {
    return this.renderRoot?.querySelector<HTMLElement>('[data-slot="hover-card-content"]')
  }

  show() {
    this.setOpen(true)
  }

  hide() {
    this.setOpen(false)
  }

  private setOpen(open: boolean) {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    if (open && this.disabled) return
    if (this.open === open) return
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  // --- trigger interaction -------------------------------------------------
  private onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    clearTimeout(this.closeTimer)
    if (this.open) return
    // Re-entering during the close grace reopens instantly (Radix behaviour).
    clearTimeout(this.openTimer)
    this.openTimer = setTimeout(() => this.setOpen(true), Math.max(0, this.openDelay))
  }

  private onPointerLeave = () => {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => this.setOpen(false), Math.max(0, this.closeDelay))
  }

  private onFocusIn = () => {
    clearTimeout(this.closeTimer)
    clearTimeout(this.openTimer)
    this.setOpen(true)
  }

  private onFocusOut = (e: FocusEvent) => {
    const to = e.relatedTarget as Node | null
    // Focus moving between trigger and card (same shadow tree) keeps it open.
    if (to && (this.contains(to) || this.renderRoot.contains(to))) return
    this.setOpen(false)
  }

  private onCardPointerEnter = () => clearTimeout(this.closeTimer)

  private onCardPointerLeave = () => {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => this.setOpen(false), Math.max(0, this.closeDelay))
  }

  private onDocKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) {
      e.stopPropagation()
      this.setOpen(false)
    }
  }

  // --- open / close ----------------------------------------------------------
  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('open')) this.state = this.open ? 'open' : 'closed'
  }

  protected updated(changed: Map<string, unknown>) {
    if (!changed.has('open') || isServer) return
    this.syncTriggerState()
    const card = this.card
    if (!card) return
    if (this.open) {
      if (!card.matches(':popover-open')) card.showPopover()
      addEventListener('keydown', this.onDocKeyDown, true)
      this.updateComplete.then(() => {
        const trigger = this.trigger
        if (this.open && trigger && !this.stopAutoUpdate) {
          this.stopAutoUpdate = autoUpdate(trigger, card, () => this.place())
          Promise.all(card.getAnimations().map((a) => a.finished)).then(() => this.open && this.place(), () => {})
        }
      })
    } else if (changed.get('open') === true) {
      this.teardown()
      let hidden = false
      const done = () => {
        if (hidden || this.open) return
        hidden = true
        if (card.matches(':popover-open')) card.hidePopover()
      }
      setTimeout(done, 400)
      const anims = card.getAnimations()
      if (anims.length) Promise.all(anims.map((a) => a.finished)).then(done, done)
      else done()
    }
  }

  private teardown() {
    this.stopAutoUpdate?.()
    this.stopAutoUpdate = undefined
    removeEventListener('keydown', this.onDocKeyDown, true)
  }

  private place() {
    const trigger = this.trigger
    const card = this.card
    if (!trigger || !card) return
    const { style, side } = computePosition(trigger, card, {
      side: this.side,
      align: this.align,
      sideOffset: this.sideOffset,
      alignOffset: this.alignOffset,
    })
    this.pos = style
    this.placedSide = side
  }

  private syncTriggerState() {
    const trigger = this.trigger
    if (!trigger) return
    if (!trigger.hasAttribute('data-slot')) trigger.setAttribute('data-slot', 'hover-card-trigger')
    if (trigger.getAttribute('data-state') !== this.state) trigger.setAttribute('data-state', this.state)
  }

  render() {
    return html`
      <slot name="trigger" @slotchange=${() => this.syncTriggerState()}></slot>
      <slot @slotchange=${() => this.syncTriggerState()}></slot>
      <div
        part="content"
        popover="manual"
        data-uipkge=""
        data-slot="hover-card-content"
        data-state=${this.state}
        data-side=${this.placedSide}
        data-align=${this.align}
        style=${styleMap(this.pos)}
        class=${cn(
          'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-64 rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
          // text-start: Chromium maps the host's `align` attribute to text-align.
          'fixed inset-auto m-0 text-start',
        )}
        @pointerenter=${this.onCardPointerEnter}
        @pointerleave=${this.onCardPointerLeave}
      >
        <slot name="content"></slot>
      </div>
    `
  }
}

customElements.get('uip-hover-card') || customElements.define('uip-hover-card', UipHoverCard)

declare global {
  interface HTMLElementTagNameMap {
    'uip-hover-card': UipHoverCard
  }
}

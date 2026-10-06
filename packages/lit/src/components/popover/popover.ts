import { LitElement, css, html, isServer } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { autoUpdate, computePosition, type Align, type Side } from '../../lib/position'

export type PopoverCloseBehavior = 'auto' | 'click-outside' | 'esc' | 'manual' | 'none'

let uid = 0

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Radix's --radix-popover-content-transform-origin, from the placed side/align.
const alignPct: Record<Align, string> = { start: '0%', center: '50%', end: '100%' }
function transformOrigin(side: Side, align: Align) {
  const a = alignPct[align]
  return { top: `${a} 100%`, bottom: `${a} 0%`, left: `100% ${a}`, right: `0% ${a}` }[side]
}

/**
 * <uip-popover> — the registry Popover (Popover + PopoverTrigger +
 * PopoverContent) as ONE web component.
 *
 *   <uip-popover side="bottom" align="start" class="[&::part(content)]:w-80">
 *     <uip-button slot="trigger" variant="outline">Open popover</uip-button>
 *     …content…
 *   </uip-popover>
 *
 * `slot="trigger"` toggles it on click; the default slot is the content. The
 * content is a native `popover="manual"` (top layer, no portal) positioned
 * with `computePosition`, with `data-side` / `data-align` / `data-state` like
 * Radix. On open, focus moves to the first focusable element in the content
 * (or the content itself); on close it returns to the trigger — except after
 * a click outside, like Radix.
 *
 * - `close-behavior`: `auto` (default) | `click-outside` | `esc` | `manual` |
 *   `none` — which dismissals are allowed (React's `closeBehavior`).
 * - `persist`: localStorage key for the open state (empty attribute = an
 *   auto-generated key), like React's `persist`.
 * - Styling: the panel is `part="content"` — React's PopoverContent
 *   `className` becomes `class="[&::part(content)]:w-80 [&::part(content)]:p-0"`
 *   on the host (the page's Tailwind compiles those rules).
 * - Any content element with `data-popover-close` closes it on click.
 *
 * The trigger gets `aria-haspopup="dialog"`, `aria-expanded` and
 * `data-state`. It can't point `aria-controls` at the content: ARIA ids don't
 * cross shadow roots.
 *
 * Events: `open-change` (detail: { open }).
 */
export class UipPopover extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    open: { type: Boolean, reflect: true },
    side: { reflect: true },
    align: {},
    sideOffset: { type: Number, attribute: 'side-offset' },
    alignOffset: { type: Number, attribute: 'align-offset' },
    closeBehavior: { attribute: 'close-behavior' },
    persist: {},
    state: { state: true },
    placedSide: { state: true },
    pos: { state: true },
  }

  open = false
  side: Side = 'bottom'
  align: Align = 'center'
  sideOffset = 4
  alignOffset = 0
  closeBehavior: PopoverCloseBehavior = 'auto'
  persist?: string
  private state: 'open' | 'closed' = 'closed'
  private placedSide: Side = 'bottom'
  private pos: Record<string, string> = {}
  private readonly autoKey = `uipkge-popover-${++uid}`
  private stopAutoUpdate?: () => void
  private returnFocus = true

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'popover')
    // Hydrate a persisted open state.
    const key = this.storageKey
    if (key && !isServer) {
      try {
        if (localStorage.getItem(key) === '1' && !this.open) this.setOpen(true)
      } catch {
        /* storage unavailable */
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.teardown()
  }

  private get storageKey() {
    if (this.persist === undefined || this.persist === null) return null
    return this.persist || this.autoKey
  }

  get trigger(): HTMLElement | undefined {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    return slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined
  }

  private get panel() {
    return this.renderRoot?.querySelector<HTMLElement>('[data-slot="popover-content"]')
  }

  show() {
    this.setOpen(true)
  }

  hide() {
    this.setOpen(false)
  }

  toggle() {
    this.setOpen(!this.open)
  }

  private setOpen(open: boolean) {
    if (this.open === open) return
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  // --- dismissal (Radix DismissableLayer + closeBehavior) --------------------
  private allows(kind: 'outside' | 'esc') {
    const b = this.closeBehavior
    if (b === 'manual' || b === 'none') return false
    if (kind === 'outside') return b !== 'esc'
    return b !== 'click-outside'
  }

  private onDocPointerDown = (e: PointerEvent) => {
    if (e.composedPath().includes(this)) return
    if (!this.allows('outside')) return
    this.returnFocus = false
    this.setOpen(false)
  }

  private onDocKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !this.open) return
    if (!this.allows('esc')) return
    e.stopPropagation()
    this.setOpen(false)
  }

  // Radix closes a non-modal popover when focus moves to an element outside it.
  private onFocusOut = (e: FocusEvent) => {
    const to = e.relatedTarget as Node | null
    if (!this.open || !to) return
    if (this.contains(to) || this.renderRoot.contains(to)) return
    this.returnFocus = false
    this.setOpen(false)
  }

  private onContentClick(e: MouseEvent) {
    const closer = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-popover-close'))
    if (closer) this.setOpen(false)
  }

  // --- open / close ----------------------------------------------------------
  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('open')) this.state = this.open ? 'open' : 'closed'
  }

  protected updated(changed: Map<string, unknown>) {
    if (isServer) return
    const trigger = this.trigger
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'dialog')
      trigger.setAttribute('aria-expanded', String(this.open))
      trigger.setAttribute('data-state', this.state)
    }
    if (!changed.has('open')) return
    this.savePersisted()
    const panel = this.panel
    if (!panel) return
    if (this.open) {
      this.returnFocus = true
      if (!panel.matches(':popover-open')) panel.showPopover()
      addEventListener('pointerdown', this.onDocPointerDown, true)
      addEventListener('keydown', this.onDocKeyDown, true)
      this.addEventListener('focusout', this.onFocusOut)
      this.updateComplete.then(() => {
        if (!this.open) return
        if (trigger && !this.stopAutoUpdate) {
          this.stopAutoUpdate = autoUpdate(trigger, panel, () => this.place())
          // computePosition measures getBoundingClientRect(), which includes the
          // zoom-in-95 entry transform; re-place at full size once it ends.
          Promise.all(panel.getAnimations().map((a) => a.finished)).then(() => this.open && this.place(), () => {})
        }
        this.focusFirst(panel)
      })
    } else if (changed.get('open') === true) {
      this.teardown()
      const active = document.activeElement
      if (this.returnFocus && (!active || active === document.body || this.contains(active))) trigger?.focus()
      let hidden = false
      const done = () => {
        if (hidden || this.open) return
        hidden = true
        if (panel.matches(':popover-open')) panel.hidePopover()
      }
      setTimeout(done, 400)
      const anims = panel.getAnimations()
      if (anims.length) Promise.all(anims.map((a) => a.finished)).then(done, done)
      else done()
    }
  }

  private teardown() {
    this.stopAutoUpdate?.()
    this.stopAutoUpdate = undefined
    removeEventListener('pointerdown', this.onDocPointerDown, true)
    removeEventListener('keydown', this.onDocKeyDown, true)
    this.removeEventListener('focusout', this.onFocusOut)
  }

  private savePersisted() {
    const key = this.storageKey
    if (!key) return
    try {
      if (this.open) localStorage.setItem(key, '1')
      else localStorage.removeItem(key)
    } catch {
      /* storage unavailable */
    }
  }

  /** First focusable slotted element (custom elements that delegate focus count), else the panel. */
  private focusFirst(panel: HTMLElement) {
    const slot = panel.querySelector<HTMLSlotElement>('slot:not([name])')
    for (const root of slot?.assignedElements({ flatten: true }) ?? []) {
      for (const el of [root, ...root.querySelectorAll('*')]) {
        if (el.matches(FOCUSABLE) || (el.shadowRoot?.delegatesFocus && !el.hasAttribute('disabled'))) {
          ;(el as HTMLElement).focus()
          return
        }
      }
    }
    panel.focus()
  }

  private place() {
    const trigger = this.trigger
    const panel = this.panel
    if (!trigger || !panel) return
    const { style, side, align } = computePosition(trigger, panel, {
      side: this.side,
      align: this.align,
      sideOffset: this.sideOffset,
      alignOffset: this.alignOffset,
    })
    this.pos = { ...style, '--radix-popover-content-transform-origin': transformOrigin(side, align) }
    this.placedSide = side
  }

  private onTriggerClick() {
    this.toggle()
  }

  render() {
    return html`
      <slot name="trigger" @click=${this.onTriggerClick} @slotchange=${() => this.requestUpdate()}></slot>
      <div
        part="content"
        role="dialog"
        tabindex="-1"
        popover="manual"
        data-uipkge=""
        data-slot="popover-content"
        data-state=${this.state}
        data-side=${this.placedSide}
        data-align=${this.align}
        style=${styleMap(this.pos)}
        class=${cn(
          'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
          // text-start: Chromium maps an `align` attribute on ANY element (the
          // host's align="end") to text-align, which the content would inherit.
          'fixed inset-auto m-0 text-start',
        )}
        @click=${this.onContentClick}
      >
        <slot></slot>
      </div>
    `
  }
}

customElements.get('uip-popover') || customElements.define('uip-popover', UipPopover)

declare global {
  interface HTMLElementTagNameMap {
    'uip-popover': UipPopover
  }
}

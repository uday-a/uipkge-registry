import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { autoUpdate, computePosition, type Align, type Side } from '../../lib/position'

type TooltipState = 'closed' | 'delayed-open' | 'instant-open'

// Radix TooltipProvider behaviour, shared by every <uip-tooltip> on the page:
// only one tooltip is open at a time, and once one has been open, moving to a
// neighbour within `skipDelayDuration` opens it instantly.
let current: UipTooltip | undefined
let lastClosedAt = 0

let uid = 0

// Radix's <Arrow> svg is 10×5, but the popper measures its RENDERED size — the
// `size-2.5` class makes it 10×10 — and adds that height to sideOffset
// (measured on the React page: 4 + 10 = 14px gap).
const ARROW_W = 10
const ARROW_H = 5
const ARROW_OFFSET = 10

// Radix popper arrow wrapper placement, keyed by the side the content sits on.
const arrowWrapper: Record<Side, Record<string, string>> = {
  top: { bottom: '0', transformOrigin: '', transform: 'translateY(100%)' },
  right: { left: '0', transformOrigin: '0 0', transform: 'translateY(50%) rotate(90deg) translateX(-50%)' },
  bottom: { top: '0', transformOrigin: 'center 0', transform: 'rotate(180deg)' },
  left: { right: '0', transformOrigin: '100% 0', transform: 'translateY(50%) rotate(-90deg) translateX(50%)' },
}

/**
 * <uip-tooltip> — the registry Tooltip (Tooltip + TooltipTrigger +
 * TooltipContent + TooltipProvider) as ONE web component.
 *
 *   <uip-tooltip content="Settings" side="top">
 *     <uip-button size="icon" aria-label="Settings">…</uip-button>
 *   </uip-tooltip>
 *
 * The first default-slot element is the trigger. Content is the `content`
 * attribute (text) or a `slot="content"` element (rich markup). Opens on hover
 * after `delay-duration` ms and immediately on keyboard focus; closes on
 * pointer leave, blur, click on the trigger and Escape. Focus never moves, so
 * it stays on the trigger.
 *
 * The bubble is a native `popover="manual"` (top layer, no portal) positioned
 * with `computePosition`; `data-side` / `data-align` / `data-state` match
 * Radix, on the bubble and the trigger: `delayed-open` after a hover delay
 * (also with `delay-duration="0"`), `instant-open` on keyboard focus, on a
 * skip-delay reopen and for a programmatic `open`, else `closed`.
 *
 * Styling: the bubble is `part="content"` — React's TooltipContent
 * `className` becomes `class="[&::part(content)]:…"` on the host. A `display`
 * utility must be scoped to the open state, or it overrides the closed
 * popover's `display: none`: `[&::part(content):popover-open]:flex`.
 *
 * Accessibility: the content can't be referenced by id from a light-DOM
 * trigger (ARIA ids don't cross shadow roots), so the element mirrors the
 * content text onto the trigger as `aria-description`.
 *
 * Events: `open-change` (detail: { open }).
 */
export class UipTooltip extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  // `contents`: React's TooltipTrigger asChild adds no box, so the trigger keeps
  // its own display (an inline <span> wrapper stays inline, not a flex item).
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    open: { type: Boolean, reflect: true },
    content: {},
    side: { reflect: true },
    align: {},
    sideOffset: { type: Number, attribute: 'side-offset' },
    alignOffset: { type: Number, attribute: 'align-offset' },
    delayDuration: { type: Number, attribute: 'delay-duration' },
    skipDelayDuration: { type: Number, attribute: 'skip-delay-duration' },
    disabled: { type: Boolean, reflect: true },
    state: { state: true },
    placedSide: { state: true },
    pos: { state: true },
    arrowPos: { state: true },
  }

  open = false
  content?: string
  side: Side = 'top'
  align: Align = 'center'
  sideOffset = 4
  alignOffset = 0
  delayDuration = 700
  skipDelayDuration = 300
  disabled = false
  private state: TooltipState = 'closed'
  private placedSide: Side = 'top'
  private pos: Record<string, string> = {}
  private arrowPos: Record<string, string> = {}
  private readonly contentId = `uip-tooltip-${++uid}`
  private openTimer?: ReturnType<typeof setTimeout>
  private closeTimer?: ReturnType<typeof setTimeout>
  private pointerDown = false
  private stopAutoUpdate?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'tooltip')
    this.addEventListener('pointerenter', this.onPointerEnter)
    this.addEventListener('pointerleave', this.onPointerLeave)
    this.addEventListener('pointerdown', this.onPointerDown)
    this.addEventListener('focusin', this.onFocusIn)
    this.addEventListener('focusout', this.onFocusOut)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('pointerenter', this.onPointerEnter)
    this.removeEventListener('pointerleave', this.onPointerLeave)
    this.removeEventListener('pointerdown', this.onPointerDown)
    this.removeEventListener('focusin', this.onFocusIn)
    this.removeEventListener('focusout', this.onFocusOut)
    this.teardown()
    if (current === this) current = undefined
  }

  /** The first slotted element in the default slot. */
  get trigger(): HTMLElement | undefined {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot:not([name])')
    return (slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ?? undefined
  }

  private get bubble() {
    return this.renderRoot?.querySelector<HTMLElement>('[role=tooltip]')
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

  // --- trigger interaction (Radix TooltipTrigger) ----------------------------
  private onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    clearTimeout(this.closeTimer)
    if (this.open) return
    const skip = Date.now() - lastClosedAt < this.skipDelayDuration || current?.open
    if (skip) {
      this.state = 'instant-open'
      this.setOpen(true)
      return
    }
    clearTimeout(this.openTimer)
    // Like Radix, a zero delay still takes this path and reports `delayed-open`.
    this.openTimer = setTimeout(() => {
      this.state = 'delayed-open'
      this.setOpen(true)
    }, Math.max(0, this.delayDuration))
  }

  // Short grace period so the pointer can cross the gap onto the content
  // (Radix keeps hoverable content open with a pointer grace area).
  private onPointerLeave = () => {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => this.setOpen(false), 100)
  }

  private onPointerDown = () => {
    this.pointerDown = true
    addEventListener('pointerup', () => (this.pointerDown = false), { once: true })
    // Radix closes the tooltip when the trigger is pressed.
    if (this.open) this.setOpen(false)
  }

  private onFocusIn = () => {
    if (this.pointerDown) return
    this.state = 'instant-open'
    this.setOpen(true)
  }

  private onFocusOut = (e: FocusEvent) => {
    if (e.relatedTarget && this.contains(e.relatedTarget as Node)) return
    this.setOpen(false)
  }

  private onDocKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) {
      e.stopPropagation()
      this.setOpen(false)
    }
  }

  // --- open / close ----------------------------------------------------------
  protected willUpdate(changed: Map<string, unknown>) {
    if (!changed.has('open')) return
    if (this.open && this.state === 'closed') this.state = 'instant-open'
    if (!this.open) this.state = 'closed'
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('content')) this.describeTrigger()
    if (!changed.has('open') || isServer) return
    this.syncTriggerState()
    const bubble = this.bubble
    if (!bubble) return
    if (this.open) {
      if (current && current !== this) current.hide()
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- deliberate singleton: tracks the open tooltip across instances
      current = this
      if (!bubble.matches(':popover-open')) bubble.showPopover()
      addEventListener('keydown', this.onDocKeyDown, true)
      // Start positioning after this update so place() doesn't update mid-update.
      this.updateComplete.then(() => {
        const trigger = this.trigger
        if (this.open && trigger && !this.stopAutoUpdate) {
          this.stopAutoUpdate = autoUpdate(trigger, bubble, () => this.place())
          // computePosition measures getBoundingClientRect(), which includes the
          // zoom-in-95 entry transform; re-place at full size once it ends.
          Promise.all(bubble.getAnimations().map((a) => a.finished)).then(() => this.open && this.place(), () => {})
        }
      })
    } else if (changed.get('open') === true) {
      this.teardown()
      lastClosedAt = Date.now()
      if (current === this) current = undefined
      // Play the exit animation (data-state=closed, rendered by this update),
      // then hide. The timeout covers tabs where animations never finish.
      let hidden = false
      const done = () => {
        if (hidden || this.open) return
        hidden = true
        if (bubble.matches(':popover-open')) bubble.hidePopover()
      }
      setTimeout(done, 400)
      const anims = bubble.getAnimations()
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
    const bubble = this.bubble
    if (!trigger || !bubble) return
    const { style, side } = computePosition(trigger, bubble, {
      side: this.side,
      align: this.align,
      sideOffset: this.sideOffset + ARROW_OFFSET,
      alignOffset: this.alignOffset,
    })
    this.pos = style
    this.placedSide = side
    // Arrow points at the trigger's centre, clamped inside the content.
    const a = trigger.getBoundingClientRect()
    const f = { left: parseFloat(style.left), top: parseFloat(style.top), ...bubble.getBoundingClientRect().toJSON() }
    const vertical = side === 'top' || side === 'bottom'
    const offset = vertical
      ? Math.min(Math.max(a.left + a.width / 2 - f.left - ARROW_W / 2, 0), f.width - ARROW_W)
      : Math.min(Math.max(a.top + a.height / 2 - f.top - ARROW_W / 2, 0), f.height - ARROW_W)
    this.arrowPos = {
      position: 'absolute',
      ...(vertical ? { left: `${offset}px` } : { top: `${offset}px` }),
      ...arrowWrapper[side],
    }
  }

  private contentText() {
    if (this.content) return this.content
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="content"]')
    return slot?.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '').join(' ').replace(/\s+/g, ' ').trim()
  }

  /** Radix TooltipTrigger carries `data-state` (closed from the start). */
  private syncTriggerState() {
    const trigger = this.trigger
    if (trigger && trigger.getAttribute('data-state') !== this.state) trigger.setAttribute('data-state', this.state)
  }

  private describeTrigger() {
    const trigger = this.trigger
    if (!trigger) return
    this.syncTriggerState()
    trigger.setAttribute('data-slot', trigger.getAttribute('data-slot') ?? 'tooltip-trigger')
    const text = this.contentText()
    if (text) trigger.setAttribute('aria-description', text)
  }

  render() {
    return html`
      <slot @slotchange=${() => this.describeTrigger()}></slot>
      <div
        part="content"
        id=${this.contentId}
        role="tooltip"
        popover="manual"
        data-uipkge=""
        data-slot="tooltip-content"
        data-state=${this.state}
        data-side=${this.placedSide}
        data-align=${this.align}
        style=${styleMap(this.pos)}
        class=${cn(
          'bg-foreground text-background motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
          // overflow-visible: the UA popover `overflow: auto` would clip the arrow.
          // text-start: Chromium maps the host's `align` attribute to text-align.
          'fixed inset-auto m-0 overflow-visible text-start',
        )}
      >
        <slot name="content" @slotchange=${() => this.describeTrigger()}>${this.content ?? nothing}</slot>
        <span style=${styleMap(this.arrowPos)}>
          <svg
            class="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
            width=${ARROW_W}
            height=${ARROW_H}
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,0 30,0 15,10"></polygon>
          </svg>
        </span>
      </div>
    `
  }
}

customElements.get('uip-tooltip') || customElements.define('uip-tooltip', UipTooltip)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tooltip': UipTooltip
  }
}

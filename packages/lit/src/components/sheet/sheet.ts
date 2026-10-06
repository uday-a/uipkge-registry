import { LitElement, css, html, nothing, isServer } from 'lit'
import { X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type SheetSide = 'top' | 'right' | 'bottom' | 'left'
export type SheetCloseBehavior = 'auto' | 'click-outside' | 'esc' | 'manual' | 'none'

let uid = 0

// Boolean props whose default is `true`: `attr="false"` turns them off.
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

// React's SheetContent side classes verbatim, plus the insets/sizes needed to
// undo the UA styles of a modal <dialog> (it is centred with `inset: 0;
// margin: auto`, sized `fit-content` and capped at `100% - 2em`).
const sideClasses: Record<SheetSide, string> = {
  right: cn(
    'motion-safe:data-[state=closed]:slide-out-to-right motion-safe:data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    'left-auto',
  ),
  left: cn(
    'motion-safe:data-[state=closed]:slide-out-to-left motion-safe:data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    'right-auto',
  ),
  top: cn(
    'motion-safe:data-[state=closed]:slide-out-to-top motion-safe:data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
    'bottom-auto w-auto',
  ),
  bottom: cn(
    'motion-safe:data-[state=closed]:slide-out-to-bottom motion-safe:data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
    'top-auto w-auto',
  ),
}

// React's SheetOverlay classes verbatim — rendered as a sibling <div> only when
// `modal` is false (a non-modal <dialog> has no ::backdrop). `pointer-events-none`
// keeps the page interactive, which is the point of a non-modal sheet;
// dismissal is handled by a document pointerdown listener instead.
const backdropClasses =
  'motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50'

/**
 * <uip-sheet> — the registry Sheet (Sheet + SheetTrigger + SheetContent +
 * SheetHeader/Title/Description + SheetFooter + SheetClose) as ONE web
 * component.
 *
 *   <uip-sheet side="left" heading="Edit profile" description="…">
 *     <uip-button slot="trigger" variant="outline">Open</uip-button>
 *     …body…
 *     <uip-button slot="footer">Save changes</uip-button>
 *     <uip-button slot="footer" variant="outline" data-sheet-close>Cancel</uip-button>
 *   </uip-sheet>
 *
 * Built on the native <dialog> + showModal() like <uip-dialog>: top layer, page
 * inert, focus trapped, focus returned to the trigger on close, Escape closes.
 * SheetOverlay is the dialog's ::backdrop.
 *
 * ARIA references can't cross a shadow boundary, so the title/description
 * come from the `heading` / `description` attributes rendered inside the
 * shadow root (`slot="title"` / `slot="description"` accept rich markup).
 * Any slotted element with `data-sheet-close` closes the sheet (SheetClose).
 * The header and footer stay pinned; wrap the body in <uip-sheet-body>
 * (SheetBody) so only that region scrolls, with the sheet's padding.
 *
 * `hide-header`: keeps the header in the accessibility tree but visually hidden
 * (`sr-only`, like React's `<SheetHeader className="sr-only">`), so a sheet
 * without a visible title still has an accessible name and description:
 *
 *   <uip-sheet side="left" hide-header heading="Sidebar" description="Displays the mobile sidebar.">
 *
 * - `modal` (default true; `modal="false"` for non-modal, like Radix's `modal`
 *   prop): non-modal uses `show()` — the page stays interactive (no inert, no
 *   focus trap) and the dimming is a plain `pointer-events-none` backdrop div
 *   (a non-modal dialog has no ::backdrop).
 * - `close-behavior`: `auto` (default) | `click-outside` | `esc` | `manual` |
 *   `none` — which dismissals are allowed (same values as <uip-popover>).
 *   `manual` / `none` block Escape and backdrop dismissal; unlike the popover,
 *   the `cancel` event still fires so consumers can confirm-then-close.
 * - `persist`: localStorage key for the open state (empty attribute = an
 *   auto-generated key), like <uip-popover>'s `persist`.
 *
 * Parts (style from the host with `class="[&::part(footer)]:…"`): `content`
 * (the dialog), `backdrop` (only non-modal: the dimming div), `header`,
 * `title`, `description`, `footer`, `close`.
 *
 * Slots: `trigger`, default (body), `footer`, `title`, `description`.
 * Methods: `show()`, `close()`. Events: `open-change` (detail: { open }),
 * `cancel` (cancelable, detail: { reason: 'escape' | 'backdrop' }) and `close`
 * (cancelable, detail: { reason }) — fired in that order when Escape or a
 * backdrop click requests dismissal; `preventDefault()` on either keeps the
 * sheet open. The close button, `data-sheet-close` elements and `close()`
 * always close (like Radix's DialogClose).
 */
export class UipSheet extends LitElement {
  static styles = [tailwind]

  static properties = {
    open: { type: Boolean, reflect: true },
    side: { reflect: true },
    heading: {},
    description: {},
    showCloseButton: { type: Boolean, attribute: 'show-close-button', converter: trueByDefault },
    hideHeader: { type: Boolean, attribute: 'hide-header' },
    modal: { converter: trueByDefault },
    closeBehavior: { attribute: 'close-behavior' },
    persist: {},
    state: { state: true },
    backdropVisible: { state: true },
    hasFooter: { state: true },
    hasTitle: { state: true },
  }

  open = false
  side: SheetSide = 'right'
  heading?: string
  description?: string
  showCloseButton = true
  hideHeader = false
  modal = true
  closeBehavior: SheetCloseBehavior = 'auto'
  persist?: string
  private state: 'open' | 'closed' = 'closed'
  private backdropVisible = false
  private hasFooter = false
  private hasTitle = false
  private readonly autoKey = `uipkge-sheet-${++uid}`

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'sheet')
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
    this.removeDocListeners()
  }

  private get storageKey() {
    if (this.persist === undefined || this.persist === null) return null
    return this.persist || this.autoKey
  }

  private get trigger(): HTMLElement | undefined {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    return slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined
  }

  private get dialog() {
    return this.renderRoot.querySelector('dialog')
  }

  show() {
    this.setOpen(true)
  }

  close() {
    this.setOpen(false)
  }

  private setOpen(open: boolean) {
    if (this.open === open) return
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  // --- dismissal (closeBehavior, like <uip-dialog> / <uip-popover>) ------------
  private allows(kind: 'outside' | 'esc') {
    const b = this.closeBehavior
    if (b === 'manual' || b === 'none') return false
    if (kind === 'outside') return b !== 'esc'
    return b !== 'click-outside'
  }

  /**
   * Escape or a backdrop click requests dismissal: fire cancelable `cancel`,
   * then (unless closeBehavior blocks it) cancelable `close`. Either can be
   * prevented; the close button / data-sheet-close / close() bypass this.
   */
  private requestDismiss(reason: 'escape' | 'backdrop') {
    if (!this.open) return
    const cancelEv = new CustomEvent('cancel', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true,
    })
    if (!this.dispatchEvent(cancelEv)) return
    if (!this.allows(reason === 'escape' ? 'esc' : 'outside')) return
    const closeEv = new CustomEvent('close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true,
    })
    if (!this.dispatchEvent(closeEv)) return
    this.setOpen(false)
  }

  // Non-modal only: the browser fires no `cancel` and ::backdrop doesn't exist,
  // so watch Escape + outside pointerdown on the document (like the popover).
  private onDocKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !this.open || this.modal) return
    e.stopPropagation()
    this.requestDismiss('escape')
  }

  private onDocPointerDown = (e: PointerEvent) => {
    if (!this.open || this.modal) return
    const path = e.composedPath()
    if (this.dialog && path.includes(this.dialog)) return
    const t = this.trigger
    if (t && path.includes(t)) return
    this.requestDismiss('backdrop')
  }

  private addDocListeners() {
    addEventListener('pointerdown', this.onDocPointerDown, true)
    addEventListener('keydown', this.onDocKeyDown, true)
  }

  private removeDocListeners() {
    removeEventListener('pointerdown', this.onDocPointerDown, true)
    removeEventListener('keydown', this.onDocKeyDown, true)
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

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      this.state = this.open ? 'open' : 'closed'
      // Mount the non-modal backdrop with the enter animation; it unmounts in
      // done() below so the exit animation plays first.
      if (this.open) this.backdropVisible = true
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (isServer) return
    // SheetTrigger: same attributes React/Radix put on the trigger (see popover.ts).
    const trigger = this.trigger
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'dialog')
      trigger.setAttribute('aria-expanded', String(this.open))
      trigger.setAttribute('data-state', this.state)
    }
    if (!changed.has('open') && !changed.has('modal')) return
    this.savePersisted()
    if (!this.modal && this.open) this.addDocListeners()
    else this.removeDocListeners()
    const dialog = this.dialog
    if (!dialog) return
    if (this.open && !dialog.open) {
      if (this.modal) dialog.showModal()
      else dialog.show()
    } else if (this.open && dialog.open && changed.has('modal')) {
      // A dialog can't switch modes while open — reopen it in the new mode.
      // (The intermediate close()'s native `close` arrives async, after the
      // dialog is open again; onClose ignores it by checking dialog.open.)
      dialog.close()
      if (this.modal) dialog.showModal()
      else dialog.show()
      this.backdropVisible = !this.modal
    } else if (!this.open && dialog.open) {
      // Play the exit animation (data-state=closed), then actually close. The
      // timeout covers tabs where animations never finish (hidden/background).
      let closed = false
      const done = () => {
        if (closed || this.open) return
        closed = true
        dialog.close()
        this.backdropVisible = false
      }
      setTimeout(done, 400)
      const anims = dialog.getAnimations()
      if (anims.length) Promise.all(anims.map((a) => a.finished)).then(done, done)
      else done()
    }
  }

  // Escape on a modal sheet: the browser fires `cancel`; prevent the native
  // instant close and route it through the dismiss flow (cancel/close events +
  // closeBehavior). (Non-modal sheets get no native cancel; onDocKeyDown covers them.)
  private onCancel(e: Event) {
    e.preventDefault()
    this.requestDismiss('escape')
  }

  // Native `close` arrives async, so it can't tell the exit path's close()
  // from the mode-switch branch's intermediate close() by timing — check the
  // dialog instead: only sync `open` off when it really is closed.
  private onClose() {
    if (!this.dialog?.open) this.close()
  }

  // A modal click on the ::backdrop lands on the <dialog> itself. Non-modal
  // clicks on the dialog box are content clicks — outside dismissal is
  // onDocPointerDown. SheetClose elements are marked with data-sheet-close.
  private onDialogClick(e: MouseEvent) {
    if (e.target === this.dialog && this.modal) return this.requestDismiss('backdrop')
    const closer = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-sheet-close'))
    if (closer) this.close()
  }

  private slotText(name: string) {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
    return slot?.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '').join(' ').trim() || undefined
  }

  private onTitleSlotChange() {
    this.hasTitle = !!this.slotText('title')
  }

  private onFooterSlotChange(e: Event) {
    this.hasFooter = (e.target as HTMLSlotElement).assignedNodes().length > 0
  }

  render() {
    const slottedTitle = this.hasTitle ? this.slotText('title') : undefined
    const hasHeader = !!(this.heading || this.description || this.hasTitle)
    return html`
      <slot name="trigger" @click=${() => this.show()} @slotchange=${() => this.requestUpdate()}></slot>
      ${!this.modal && this.backdropVisible
        ? html`<div
            part="backdrop"
            data-uipkge=""
            data-slot="sheet-overlay"
            data-state=${this.state}
            aria-hidden="true"
            class=${cn(backdropClasses, 'pointer-events-none')}
          ></div>`
        : nothing}
      <dialog
        part="content"
        data-uipkge=""
        data-slot="sheet-content"
        data-state=${this.state}
        aria-labelledby=${this.heading ? 'uip-sheet-title' : nothing}
        aria-label=${!this.heading && slottedTitle ? slottedTitle : nothing}
        aria-describedby=${this.description ? 'uip-sheet-description' : nothing}
        class=${cn(
          'bg-background motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 fixed z-50 open:flex flex-col gap-0 overflow-hidden shadow-lg transition ease-in-out motion-safe:data-[state=closed]:duration-200 motion-safe:data-[state=open]:duration-300',
          // Undo the modal <dialog> UA box (margin, max size) and its `color:
          // CanvasText` (React's portal inherits the page's text colour).
          'text-foreground m-0 max-h-none max-w-none backdrop:bg-foreground/50',
          sideClasses[this.side] ?? sideClasses.right,
        )}
        @cancel=${this.onCancel}
        @close=${this.onClose}
        @click=${this.onDialogClick}
      >
        <div
          part="header"
          data-slot="sheet-header"
          class=${cn('flex shrink-0 flex-col gap-1.5 border-b p-4 pr-12', this.hideHeader && 'sr-only')}
          ?hidden=${!hasHeader}
        >
          <h2 part="title" id="uip-sheet-title" data-slot="sheet-title" class="text-foreground font-semibold">
            <slot name="title" @slotchange=${this.onTitleSlotChange}>${this.heading}</slot>
          </h2>
          <p part="description" id="uip-sheet-description" data-slot="sheet-description" class="text-muted-foreground text-sm">
            <slot name="description">${this.description}</slot>
          </p>
        </div>
        <slot></slot>
        <div part="footer" data-slot="sheet-footer" class="mt-auto flex shrink-0 flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end" ?hidden=${!this.hasFooter}>
          <slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>
        </div>
        ${this.showCloseButton
          ? html`<button
              type="button"
              part="close"
              data-slot="sheet-close"
              class="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none"
              @click=${() => this.close()}
            >
              ${icon(X, 'x', 'size-4')}
              <span class="sr-only">Close</span>
            </button>`
          : nothing}
      </dialog>
    `
  }
}

/**
 * <uip-sheet-body> — SheetBody: the scrolling middle of a sheet (put it in
 * <uip-sheet>'s default slot). The header (title + close) and the footer
 * (actions) stay pinned; only this region scrolls. The host is
 * `display: contents`, so its inner div is the sheet's flex item. Style it with `class="[&::part(base)]:…"`.
 */
export class UipSheetBody extends LitElement {
  static styles = [tailwind, css`:host { display: contents; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'sheet-body')
  }

  render() {
    return html`<div part="base" data-slot="sheet-body" class="min-h-0 flex-1 overflow-y-auto p-4">
      <slot></slot>
    </div>`
  }
}

customElements.get('uip-sheet') || customElements.define('uip-sheet', UipSheet)
customElements.get('uip-sheet-body') || customElements.define('uip-sheet-body', UipSheetBody)

declare global {
  interface HTMLElementTagNameMap {
    'uip-sheet': UipSheet
    'uip-sheet-body': UipSheetBody
  }
}

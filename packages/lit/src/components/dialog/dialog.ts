import { LitElement, css, html, isServer, nothing } from 'lit'
import { X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type DialogCloseBehavior = 'auto' | 'click-outside' | 'esc' | 'manual' | 'none'

let uid = 0

// Boolean props whose default is `true`: `attr="false"` turns them off.
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

// React's DialogContent classes verbatim; `grid` is `open:grid` (a plain
// `grid` beats the closed <dialog>'s UA `display: none`) and the overlay is the
// dialog's ::backdrop. `text-foreground` undoes the modal dialog's UA
// `color: CanvasText` (React's portal inherits the page's text colour).
const contentClasses =
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 hidden open:grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-4 shadow-lg duration-200 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200 sm:max-w-lg'

// DialogScrollContent: the <dialog> is React's scrolling overlay (full
// viewport, `grid place-items-center overflow-y-auto`), the content is a box
// inside it — so a long body scrolls the overlay, not the page. The UA
// modal-dialog box (margin, max size, border, padding) is undone.
const scrollOverlayClasses = cn(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 hidden open:grid place-items-center overflow-y-auto data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200',
  'text-foreground m-0 size-full max-h-none max-w-none border-0 p-0 backdrop:bg-transparent',
)
const scrollContentClasses =
  'bg-background relative z-50 my-4 grid w-full max-w-lg gap-4 border p-4 shadow-lg duration-200 sm:rounded-lg md:w-full'

// React's DialogOverlay classes verbatim — rendered as a sibling <div> only when
// `modal` is false (a non-modal <dialog> has no ::backdrop). `pointer-events-none`
// keeps the page interactive, which is the point of a non-modal dialog;
// dismissal is handled by a document pointerdown listener instead.
const backdropClasses =
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200'

const closeClasses =
  "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
const scrollCloseClasses =
  'text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-[3px]'

/**
 * <uip-dialog> — the registry Dialog (Dialog + DialogTrigger + DialogContent /
 * DialogScrollContent + DialogHeader/Title/Description + DialogFooter +
 * DialogClose) as ONE web component.
 *
 *   <uip-dialog heading="Edit profile" description="…" class="[&::part(content)]:sm:max-w-md">
 *     <uip-button slot="trigger" variant="outline">Edit profile</uip-button>
 *     …body…
 *     <uip-button slot="footer" variant="outline" data-dialog-close>Cancel</uip-button>
 *     <uip-button slot="footer">Save changes</uip-button>
 *   </uip-dialog>
 *
 * Built on the native <dialog> + showModal(): the browser puts it in the top
 * layer (no portal), makes the page inert, traps focus, restores focus to the
 * trigger on close and closes on Escape. A click on the backdrop closes it.
 *
 * ARIA references can't cross a shadow boundary, so the accessible name and
 * description come from the `heading` / `description` attributes rendered
 * INSIDE the shadow root (aria-labelledby/-describedby then resolve). The
 * `title` / `description` slots accept rich markup instead; a slotted title
 * names the dialog from its text.
 *
 * - Any slotted element with `data-dialog-close` closes the dialog (DialogClose).
 * - Wrap a long body in <uip-dialog-body> (DialogBody) to scroll it at 60vh
 *   between the pinned header and footer.
 * - `scroll-content`: DialogScrollContent — the overlay scrolls, for very long
 *   bodies (the close button is always shown, with React's scroll-content style).
 * - `hide-header`: keeps the header for assistive tech but visually hidden
 *   (`sr-only`). The header / footer are dropped when they have no content.
 * - `show-close-button="false"` hides the top-right close button.
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
 * Parts (style from the host, e.g. `class="[&::part(content)]:sm:max-w-md
 * [&::part(footer)]:sm:justify-start"`): `content`, `overlay` (only with
 * `scroll-content`; otherwise the overlay is `content`'s ::backdrop),
 * `backdrop` (only non-modal: the dimming div), `header`, `title`,
 * `description`, `footer`, `close`.
 *
 * Slots: `trigger` (opens on click), `header-start` (inside the header, above
 * the title — e.g. an icon), `title`, `description`, default (body), `footer`.
 * Methods: `show()`, `close()`. Events: `open-change` (detail: { open }),
 * `cancel` (cancelable, detail: { reason: 'escape' | 'backdrop' }) and `close`
 * (cancelable, detail: { reason }) — fired in that order when Escape or a
 * backdrop click requests dismissal; `preventDefault()` on either keeps the
 * dialog open. The close button, `data-dialog-close` elements and `close()`
 * always close (like Radix's DialogClose).
 */
export class UipDialog extends LitElement {
  static styles = [tailwind]

  static properties = {
    open: { type: Boolean, reflect: true },
    heading: {},
    description: {},
    showCloseButton: { type: Boolean, attribute: 'show-close-button', converter: trueByDefault },
    hideHeader: { type: Boolean, attribute: 'hide-header' },
    scrollContent: { type: Boolean, attribute: 'scroll-content' },
    modal: { converter: trueByDefault },
    closeBehavior: { attribute: 'close-behavior' },
    persist: {},
    state: { state: true },
    backdropVisible: { state: true },
    hasTitle: { state: true },
    hasDescription: { state: true },
    hasHeaderStart: { state: true },
    hasFooter: { state: true },
  }

  open = false
  heading?: string
  description?: string
  showCloseButton = true
  hideHeader = false
  scrollContent = false
  modal = true
  closeBehavior: DialogCloseBehavior = 'auto'
  persist?: string
  private state: 'open' | 'closed' = 'closed'
  private backdropVisible = false
  private hasTitle = false
  private hasDescription = false
  private hasHeaderStart = false
  private hasFooter = false
  private readonly autoKey = `uipkge-dialog-${++uid}`

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'dialog')
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

  /** The content box (what counts as "inside" for outside-click dismissal). */
  private get contentBox(): Element | null {
    return this.renderRoot.querySelector('[part="content"]')
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

  // --- dismissal (closeBehavior, like <uip-popover>) --------------------------
  private allows(kind: 'outside' | 'esc') {
    const b = this.closeBehavior
    if (b === 'manual' || b === 'none') return false
    if (kind === 'outside') return b !== 'esc'
    return b !== 'click-outside'
  }

  /**
   * Escape or a backdrop click requests dismissal: fire cancelable `cancel`,
   * then (unless closeBehavior blocks it) cancelable `close`. Either can be
   * prevented; the close button / data-dialog-close / close() bypass this.
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
    if (this.contentBox && path.includes(this.contentBox)) return
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
    // DialogTrigger: same attributes React/Radix put on the trigger (see popover.ts).
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
      // showModal() focuses the first focusable (often a footer button) and
      // scrolls it into view; Radix focuses with preventScroll, so a long
      // dialog opens at its top.
      dialog.scrollTop = 0
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
      const anims = dialog.getAnimations({ subtree: true })
      if (anims.length) Promise.all(anims.map((a) => a.finished)).then(done, done)
      else done()
    }
  }

  // Escape on a modal dialog: the browser fires `cancel`; prevent the native
  // instant close and route it through the dismiss flow (cancel/close events +
  // closeBehavior). (Non-modal dialogs get no native cancel; onDocKeyDown covers them.)
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

  // A modal click on the ::backdrop lands on the <dialog> itself (with
  // scroll-content, on the overlay around the box). Non-modal clicks on the
  // dialog box are content clicks — outside dismissal is onDocPointerDown.
  // DialogClose elements are marked with data-dialog-close.
  private onDialogClick(e: MouseEvent) {
    if (e.target === this.dialog && this.modal) return this.requestDismiss('backdrop')
    const closer = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-dialog-close'))
    if (closer) this.close()
  }

  private slotText(name: string) {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
    return slot?.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '').join(' ').trim() || undefined
  }

  private hasSlotted(e: Event) {
    return (e.target as HTMLSlotElement).assignedNodes().some((n) => n.nodeType === 1 || n.textContent?.trim())
  }

  render() {
    const slottedTitle = this.hasTitle ? this.slotText('title') : undefined
    const hasHeader = !!(this.heading || this.description || this.hasTitle || this.hasDescription || this.hasHeaderStart)
    const hasDescription = !!(this.description || this.hasDescription)
    const body = html`
      <div
        part="header"
        data-slot="dialog-header"
        class=${cn('flex flex-col gap-2 pr-8 text-left', this.hideHeader && 'sr-only')}
        ?hidden=${!hasHeader}
      >
        <slot name="header-start" @slotchange=${(e: Event) => (this.hasHeaderStart = this.hasSlotted(e))}></slot>
        <h2 part="title" id="uip-dialog-title" data-slot="dialog-title" class="text-lg leading-none font-semibold">
          <slot name="title" @slotchange=${(e: Event) => (this.hasTitle = this.hasSlotted(e))}>${this.heading}</slot>
        </h2>
        <p
          part="description"
          id="uip-dialog-description"
          data-slot="dialog-description"
          class="text-muted-foreground text-sm"
          ?hidden=${!hasDescription}
        >
          <slot name="description" @slotchange=${(e: Event) => (this.hasDescription = this.hasSlotted(e))}
            >${this.description}</slot
          >
        </p>
      </div>
      <slot></slot>
      <div
        part="footer"
        data-slot="dialog-footer"
        class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        ?hidden=${!this.hasFooter}
      >
        <slot name="footer" @slotchange=${(e: Event) => (this.hasFooter = this.hasSlotted(e))}></slot>
      </div>
      ${this.showCloseButton || this.scrollContent
        ? html`<button
            type="button"
            part="close"
            data-slot="dialog-close"
            class=${this.scrollContent ? scrollCloseClasses : closeClasses}
            @click=${() => this.close()}
          >
            ${icon(X, 'x', this.scrollContent ? 'size-4' : '')}
            <span class="sr-only">Close</span>
          </button>`
        : nothing}
    `
    const labelling = {
      labelledby: this.heading ? 'uip-dialog-title' : undefined,
      label: !this.heading && slottedTitle ? slottedTitle : undefined,
      describedby: hasDescription ? 'uip-dialog-description' : undefined,
    }
    return html`
      <slot name="trigger" @click=${() => this.show()} @slotchange=${() => this.requestUpdate()}></slot>
      ${!this.modal && !this.scrollContent && this.backdropVisible
        ? html`<div
            part="backdrop"
            data-uipkge=""
            data-slot="dialog-overlay"
            data-state=${this.state}
            aria-hidden="true"
            class=${cn(backdropClasses, 'pointer-events-none')}
          ></div>`
        : nothing}
      ${this.scrollContent
        ? html`<dialog
            part="overlay"
            data-uipkge=""
            data-slot="dialog-overlay"
            data-state=${this.state}
            aria-labelledby=${labelling.labelledby ?? nothing}
            aria-label=${labelling.label ?? nothing}
            aria-describedby=${labelling.describedby ?? nothing}
            class=${cn(scrollOverlayClasses, !this.modal && 'pointer-events-none')}
            @cancel=${this.onCancel}
            @close=${this.onClose}
            @click=${this.onDialogClick}
          >
            <div
              part="content"
              data-uipkge=""
              data-slot="dialog-content"
              data-state=${this.state}
              class=${cn(scrollContentClasses, !this.modal && 'pointer-events-auto')}
            >
              ${body}
            </div>
          </dialog>`
        : html`<dialog
            part="content"
            data-uipkge=""
            data-slot="dialog-content"
            data-state=${this.state}
            aria-labelledby=${labelling.labelledby ?? nothing}
            aria-label=${labelling.label ?? nothing}
            aria-describedby=${labelling.describedby ?? nothing}
            class=${cn(contentClasses, 'text-foreground m-0 backdrop:bg-foreground/50')}
            @cancel=${this.onCancel}
            @close=${this.onClose}
            @click=${this.onDialogClick}
          >
            ${body}
          </dialog>`}
    `
  }
}

/**
 * <uip-dialog-body> — DialogBody: the scrollable content between the header
 * and the footer (put it in <uip-dialog>'s default slot). It scrolls at
 * `max-h-[60vh]` and bleeds to the dialog edges so the scrollbar sits at the
 * border, not inside the padding. Style it with `class="[&::part(base)]:…"`.
 */
export class UipDialogBody extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'dialog-body')
  }

  render() {
    return html`<div part="base" data-slot="dialog-body" class="-mx-4 max-h-[60vh] overflow-y-auto px-4">
      <slot></slot>
    </div>`
  }
}

customElements.get('uip-dialog') || customElements.define('uip-dialog', UipDialog)
customElements.get('uip-dialog-body') || customElements.define('uip-dialog-body', UipDialogBody)

declare global {
  interface HTMLElementTagNameMap {
    'uip-dialog': UipDialog
    'uip-dialog-body': UipDialogBody
  }
}

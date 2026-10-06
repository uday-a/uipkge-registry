import { LitElement, css, html, isServer, nothing } from 'lit'
import { CircleAlert, CircleCheck, Info, TriangleAlert, type IconNode } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type AlertTone = 'default' | 'destructive' | 'success' | 'warning'
export type AlertIconType = 'info' | 'warning' | 'error' | 'success'

const builtInIcons: Record<AlertIconType, IconNode> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
}

const iconColorClasses: Record<AlertTone, string> = {
  destructive: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  default: 'text-muted-foreground',
}

const actionToneClasses: Record<AlertTone, string> = {
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  default: '',
}

const contentClasses =
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 hidden open:grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg text-foreground m-0 backdrop:bg-foreground/50'

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-alert-modal> — AlertModal web component.
 */
export class UipAlertModal extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; }`]

  static properties = {
    open: { type: Boolean, reflect: true },
    title: { type: String },
    description: { type: String },
    actionLabel: { attribute: 'action-label' },
    cancelLabel: { attribute: 'cancel-label' },
    tone: { type: String },
    icon: { type: String },
    loading: { type: Boolean },
    actionDisabled: { type: Boolean, attribute: 'action-disabled' },
    state: { state: true },
    hasDefaultSlot: { state: true },
    hasActionsSlot: { state: true },
  }

  open = false
  title = ''
  description = ''
  actionLabel = 'Continue'
  cancelLabel: string | null = 'Cancel'
  tone: AlertTone = 'default'
  icon?: string | null = null
  loading = false
  actionDisabled = false
  private state: 'open' | 'closed' = 'closed'
  private hasDefaultSlot = false
  private hasActionsSlot = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'alert-modal')
  }

  private get trigger(): HTMLElement | undefined {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    return slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined
  }

  private get dialog() {
    return this.renderRoot?.querySelector('dialog')
  }

  show() {
    this.setOpen(true)
  }

  close() {
    if (this.loading) return
    this.setOpen(false)
  }

  private setOpen(open: boolean) {
    if (this.open === open) return
    if (!open && this.loading) return
    this.open = open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open }, bubbles: true, composed: true }))
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      this.state = this.open ? 'open' : 'closed'
    }
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
    const dialog = this.dialog
    if (!dialog) return

    if (this.open && !dialog.open) {
      dialog.showModal()
      dialog.scrollTop = 0
    } else if (!this.open && dialog.open) {
      let closed = false
      const done = () => {
        if (closed || this.open) return
        closed = true
        dialog.close()
      }
      setTimeout(done, 300)
      const anims = dialog.getAnimations({ subtree: true })
      if (anims.length) Promise.all(anims.map((a) => a.finished)).then(done, done)
      else done()
    }
  }

  private onCancel(e: Event) {
    // WAI-ARIA alertdialog: do not close automatically on Escape if loading
    if (this.loading) {
      e.preventDefault()
      return
    }
    const cancelEv = new CustomEvent('cancel', { bubbles: true, composed: true, cancelable: true })
    if (!this.dispatchEvent(cancelEv)) {
      e.preventDefault()
      return
    }
    this.setOpen(false)
  }

  private onActionClick(e: MouseEvent) {
    if (this.loading || this.actionDisabled) {
      e.preventDefault()
      return
    }
    const ev = new CustomEvent('action', { bubbles: true, composed: true, cancelable: true })
    if (this.dispatchEvent(ev)) {
      this.setOpen(false)
    }
  }

  private onCancelClick(e: MouseEvent) {
    const ev = new CustomEvent('cancel', { bubbles: true, composed: true, cancelable: true })
    if (this.dispatchEvent(ev)) {
      this.setOpen(false)
    }
  }

  private renderIcon() {
    if (!this.icon) return nothing
    const iconNode = builtInIcons[this.icon as AlertIconType]
    if (!iconNode) return nothing
    return html`
      <div
        class=${cn(
          'bg-muted mb-2 flex size-10 items-center justify-center rounded-full',
          iconColorClasses[this.tone] ?? iconColorClasses.default,
        )}
      >
        ${icon(iconNode, this.icon, 'size-5')}
      </div>
    `
  }

  render() {
    return html`
      <slot name="trigger" @click=${() => this.show()} @slotchange=${() => this.requestUpdate()}></slot>

      <dialog
        role="alertdialog"
        part="content"
        data-uipkge=""
        data-slot="alert-modal-content"
        data-state=${this.state}
        class=${contentClasses}
        @cancel=${this.onCancel}
      >
        <div class="flex flex-col gap-2 text-center sm:text-left">
          ${this.renderIcon()}
          ${this.title ? html`<h2 part="title" class="text-lg font-semibold">${this.title}</h2>` : nothing}
          ${this.description
            ? html`<p part="description" class="text-muted-foreground text-sm">${this.description}</p>`
            : nothing}
        </div>

        <div class="text-sm">
          <slot
            @slotchange=${(e: Event) =>
              (this.hasDefaultSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0)}
          ></slot>
        </div>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <slot
            name="actions"
            @slotchange=${(e: Event) =>
              (this.hasActionsSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0)}
          >
            ${this.cancelLabel !== null && this.cancelLabel !== undefined && this.cancelLabel !== 'null'
              ? html`
                  <button
                    type="button"
                    part="cancel"
                    class="focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                    ?disabled=${this.loading}
                    @click=${this.onCancelClick}
                  >
                    ${this.cancelLabel}
                  </button>
                `
              : nothing}
            <button
              type="button"
              part="action"
              class=${cn(
                'focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
                actionToneClasses[this.tone],
              )}
              ?disabled=${this.loading || this.actionDisabled}
              aria-busy=${this.loading ? 'true' : nothing}
              @click=${this.onActionClick}
            >
              ${this.loading
                ? html`<span
                    class="mr-2 inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  ></span>`
                : nothing}
              ${this.actionLabel}
            </button>
          </slot>
        </div>
      </dialog>
    `
  }
}

customElements.get('uip-alert-modal') || customElements.define('uip-alert-modal', UipAlertModal)

declare global {
  interface HTMLElementTagNameMap {
    'uip-alert-modal': UipAlertModal
  }
}

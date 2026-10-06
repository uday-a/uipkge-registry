import { LitElement, css, html, nothing, type TemplateResult } from 'lit'
import { Plus, type IconNode } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { fabVariants, type FabVariants } from '../fab/fab.variants'

export interface SpeedDialAction {
  icon: IconNode | string
  label: string
  handler?: () => void
  disabled?: boolean
  className?: string
}

export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right'
export type SpeedDialTrigger = 'click' | 'hover'
export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'inline'

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-speed-dial> — Floating Action Button with expandable sub-actions.
 */
export class UipSpeedDial extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; position: relative; }`]

  static properties = {
    actions: { type: Array },
    label: { type: String },
    direction: { type: String },
    trigger: { type: String },
    closeOnAction: { attribute: 'close-on-action', converter: trueByDefault },
    variant: { type: String },
    position: { type: String },
    absolute: { type: Boolean },
    disabled: { type: Boolean },
    open: { type: Boolean, reflect: true },
  }

  actions: SpeedDialAction[] = []
  label = 'Quick actions'
  direction: SpeedDialDirection = 'up'
  trigger: SpeedDialTrigger = 'click'
  closeOnAction = true
  variant: NonNullable<FabVariants['variant']> = 'default'
  position: SpeedDialPosition = 'bottom-right'
  absolute = false
  disabled = false
  open = false

  private hoverTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'speed-dial')
  }

  private toggleOpen() {
    if (this.disabled) return
    this.open = !this.open
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: this.open }, bubbles: true, composed: true }))
  }

  private onPointerEnter() {
    if (this.disabled || this.trigger !== 'hover') return
    if (this.hoverTimer) clearTimeout(this.hoverTimer)
    this.open = true
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: true }, bubbles: true, composed: true }))
  }

  private onPointerLeave() {
    if (this.trigger !== 'hover') return
    if (this.hoverTimer) clearTimeout(this.hoverTimer)
    this.hoverTimer = setTimeout(() => {
      this.open = false
      this.dispatchEvent(new CustomEvent('open-change', { detail: { open: false }, bubbles: true, composed: true }))
    }, 150)
  }

  private handleAction(action: SpeedDialAction) {
    if (action.disabled) return
    action.handler?.()
    this.dispatchEvent(new CustomEvent('action', { detail: { action }, bubbles: true, composed: true }))
    if (this.closeOnAction) {
      this.open = false
      this.dispatchEvent(new CustomEvent('open-change', { detail: { open: false }, bubbles: true, composed: true }))
    }
  }

  private renderActionIcon(actIcon: IconNode | string): TemplateResult | typeof nothing {
    if (Array.isArray(actIcon)) {
      return icon(actIcon as IconNode, 'speed-dial-icon', 'size-5')
    }
    if (typeof actIcon === 'string') {
      return html`<span class="size-5 [&_svg]:size-5 inline-flex items-center justify-center" .innerHTML=${actIcon}></span>`
    }
    return nothing
  }

  render() {
    const listDirectionClasses: Record<SpeedDialDirection, string> = {
      up: 'flex-col-reverse bottom-full mb-3 left-1/2 -translate-x-1/2',
      down: 'flex-col top-full mt-3 left-1/2 -translate-x-1/2',
      left: 'flex-row-reverse right-full mr-3 top-1/2 -translate-y-1/2',
      right: 'flex-row left-full ml-3 top-1/2 -translate-y-1/2',
    }

    return html`
      <div
        part="wrapper"
        class=${cn(
          'relative inline-flex items-center justify-center',
          this.position !== 'inline' && fabVariants({ position: this.position as FabVariants['position'] }),
          this.absolute && this.position !== 'inline' && 'absolute',
        )}
        @mouseenter=${this.onPointerEnter}
        @mouseleave=${this.onPointerLeave}
      >
        <!-- Actions container -->
        ${this.open
          ? html`
              <div
                part="actions"
                data-slot="speed-dial-actions"
                class=${cn(
                  'absolute z-50 flex items-center gap-3 pointer-events-auto',
                  listDirectionClasses[this.direction],
                )}
              >
                ${this.actions.map((act, i) => html`
                  <button
                    type="button"
                    part="action-button"
                    data-slot="speed-dial-action"
                    ?disabled=${act.disabled}
                    aria-label=${act.label}
                    style=${`animation-delay: ${i * 40}ms;`}
                    class=${cn(
                      "group/speed-dial-item bg-background text-foreground hover:bg-accent hover:text-accent-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 focus-visible:ring-ring/50 inline-flex size-12 items-center justify-center rounded-full border shadow-md transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
                      act.className,
                    )}
                    @click=${() => this.handleAction(act)}
                  >
                    ${this.renderActionIcon(act.icon)}
                    <span class="sr-only">${act.label}</span>
                  </button>
                `)}
              </div>
            `
          : nothing}

        <!-- Main FAB trigger -->
        <button
          type="button"
          part="trigger"
          data-slot="speed-dial-trigger"
          aria-label=${this.label}
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-haspopup="menu"
          ?disabled=${this.disabled}
          class=${cn(
            fabVariants({ variant: this.variant }),
            'transition-[transform,background-color,color] duration-200 cursor-pointer',
            this.open && 'rotate-45',
          )}
          @click=${() => this.toggleOpen()}
        >
          <slot name="icon">${icon(Plus, 'plus', 'size-6')}</slot>
        </button>
      </div>
    `
  }
}

customElements.get('uip-speed-dial') || customElements.define('uip-speed-dial', UipSpeedDial)

declare global {
  interface HTMLElementTagNameMap {
    'uip-speed-dial': UipSpeedDial
  }
}

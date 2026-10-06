import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { blockUiVariants } from './block-ui.variants'

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-block-ui> — BlockUi web component.
 */
export class UipBlockUi extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; position: relative; width: 100%; }`]

  static properties = {
    blocking: { type: Boolean, reflect: true },
    message: { type: String },
    opacity: { type: Number },
    overlayColor: { attribute: 'overlay-color' },
    blurred: { type: Boolean, attribute: 'blur' },
    showSpinner: { attribute: 'show-spinner', converter: trueByDefault },
    hasIconSlot: { state: true },
    hasMessageSlot: { state: true },
  }

  blocking = false
  message: string | null = 'Loading...'
  opacity = 0.6
  overlayColor = ''
  blurred = false
  showSpinner = true
  private hasIconSlot = false
  private hasMessageSlot = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'block-ui')
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('blocking')) {
      if (this.blocking) {
        this.setAttribute('data-blocked', '')
      } else {
        this.removeAttribute('data-blocked')
      }
    }
  }

  render() {
    const overlayBgStyle = {
      opacity: String(this.opacity),
      ...(this.overlayColor ? { backgroundColor: this.overlayColor } : {}),
    }

    return html`
      <div class=${cn(blockUiVariants(), 'w-full')}>
        <!-- Wrapped content -->
        <div
          part="content"
          class=${cn(
            'block-ui-content w-full',
            this.blocking && 'pointer-events-none',
            this.blurred && this.blocking && 'blur-[2px] transition-[filter]',
          )}
          aria-hidden=${this.blocking ? 'true' : nothing}
          ?inert=${this.blocking}
        >
          <slot></slot>
        </div>

        <!-- Blocking overlay -->
        ${this.blocking
          ? html`
              <div
                part="overlay"
                class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <!-- Background layer -->
                <div
                  part="backdrop"
                  class=${cn('absolute inset-0', !this.overlayColor && 'bg-background')}
                  style=${styleMap(overlayBgStyle)}
                ></div>

                <!-- Content layer -->
                <div class="relative z-10 flex flex-col items-center justify-center gap-3">
                  <slot
                    name="icon"
                    @slotchange=${(e: Event) =>
                      (this.hasIconSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0)}
                  >
                    ${this.showSpinner
                      ? html`
                          <svg
                            class="text-primary size-8 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        `
                      : nothing}
                  </slot>

                  <slot
                    name="message"
                    @slotchange=${(e: Event) =>
                      (this.hasMessageSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0)}
                  >
                    ${this.message
                      ? html`<p part="message" class="text-foreground text-sm font-medium">${this.message}</p>`
                      : nothing}
                  </slot>
                </div>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-block-ui') || customElements.define('uip-block-ui', UipBlockUi)

declare global {
  interface HTMLElementTagNameMap {
    'uip-block-ui': UipBlockUi
  }
}

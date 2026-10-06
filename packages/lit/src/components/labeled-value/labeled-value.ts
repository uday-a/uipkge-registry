import { LitElement, css, html } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-labeled-value> — key-value display pair.
 */
export class UipLabeledValue extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  static properties = {
    label: { reflect: true },
    value: { reflect: true },
  }

  label = ''
  value = ''

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'labeled-value')
  }

  render() {
    return html`
      <div
        part="base"
        data-slot="labeled-value"
        class="flex items-center justify-between gap-3 text-sm"
      >
        <span part="label" data-slot="labeled-value-label" class="text-muted-foreground shrink-0">
          ${this.label}
        </span>
        <slot>
          <span part="value" data-slot="labeled-value-value" class="min-w-0 text-right font-medium">
            ${this.value}
          </span>
        </slot>
      </div>
    `
  }
}

customElements.get('uip-labeled-value') || customElements.define('uip-labeled-value', UipLabeledValue)

declare global {
  interface HTMLElementTagNameMap {
    'uip-labeled-value': UipLabeledValue
  }
}

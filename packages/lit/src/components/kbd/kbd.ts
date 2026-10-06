import { LitElement, css, html } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-kbd> — the registry Kbd as a web component. Renders a native <kbd>
 * with React's class string verbatim. Class overrides (React's `className`)
 * target it through `::part(base)`.
 */
export class UipKbd extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kbd')
  }

  render() {
    return html`<kbd
      part="base"
      data-slot="kbd"
      class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none"
      ><slot></slot
    ></kbd>`
  }
}

customElements.get('uip-kbd') || customElements.define('uip-kbd', UipKbd)

declare global {
  interface HTMLElementTagNameMap {
    'uip-kbd': UipKbd
  }
}

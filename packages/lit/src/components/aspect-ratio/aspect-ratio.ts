import { LitElement, css, html } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const ratioConverter = {
  fromAttribute(value: string | null): number {
    if (!value) return 1
    if (value.includes('/')) {
      const [w, h] = value.split('/').map((s) => parseFloat(s.trim()))
      if (w && h) return w / h
    }
    const num = parseFloat(value)
    return Number.isNaN(num) ? 1 : num
  },
  toAttribute(value: number): string {
    return String(value)
  },
}

/**
 * <uip-aspect-ratio> — displays content within a desired ratio.
 *
 * Uses CSS `aspect-ratio` on the host so outer utility classes (grid, flex,
 * rounded, overflow-hidden) apply directly to the sized container.
 */
export class UipAspectRatio extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        aspect-ratio: var(--uip-aspect-ratio, 1 / 1);
      }
    `,
  ]

  static properties = {
    ratio: { converter: ratioConverter, reflect: true },
  }

  ratio = 1

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'aspect-ratio')
  }

  willUpdate() {
    this.style.setProperty('--uip-aspect-ratio', String(this.ratio))
  }

  render() {
    return html`<slot part="base"></slot>`
  }
}

customElements.get('uip-aspect-ratio') || customElements.define('uip-aspect-ratio', UipAspectRatio)

declare global {
  interface HTMLElementTagNameMap {
    'uip-aspect-ratio': UipAspectRatio
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-separator> — the registry Separator (Radix Separator) as a web component.
 *
 * React's class string verbatim on an inner <div>. Like Radix: decorative
 * (the default) renders role="none"; `decorative=false` renders
 * role="separator" with aria-orientation for vertical ones. Set
 * `decorative="false"` or `.decorative=${false}`.
 *
 * The host is `display: contents`, so the inner div is laid out directly by
 * the parent (its `h-full` / `w-full` resolve against the flex/grid parent the
 * same way React's div does). Because the host generates no box, margins and
 * other overrides (React's `className`) go on `::part(base)`, e.g.
 * `class="[&::part(base)]:my-3"`.
 */
export class UipSeparator extends LitElement {
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    orientation: { reflect: true },
    decorative: {
      reflect: true,
      converter: {
        fromAttribute: (v: string | null) => v !== 'false',
        toAttribute: (v: boolean) => String(v),
      },
    },
  }

  orientation: 'horizontal' | 'vertical' = 'horizontal'
  decorative = true

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'separator')
  }

  willUpdate() {
    this.setAttribute('data-orientation', this.orientation)
  }

  render() {
    const vertical = this.orientation === 'vertical'
    return html`<div
      part="base"
      data-slot="separator"
      data-orientation=${this.orientation}
      role=${this.decorative ? 'none' : 'separator'}
      aria-orientation=${!this.decorative && vertical ? 'vertical' : nothing}
      class="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
    ></div>`
  }
}

customElements.get('uip-separator') || customElements.define('uip-separator', UipSeparator)

declare global {
  interface HTMLElementTagNameMap {
    'uip-separator': UipSeparator
  }
}

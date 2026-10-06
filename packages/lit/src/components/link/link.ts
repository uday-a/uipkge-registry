import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { linkVariants, type LinkVariants } from './link.variants'

type Underline = NonNullable<LinkVariants['underline']>
type Color = NonNullable<LinkVariants['color']>
type Size = NonNullable<LinkVariants['size']>

/**
 * <uip-link> — styled navigational link.
 */
export class UipLink extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  static properties = {
    href: { reflect: true },
    to: { reflect: true },
    underline: { reflect: true },
    color: { reflect: true },
    size: { reflect: true },
    external: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    target: { reflect: true },
    rel: { reflect: true },
  }

  href?: string
  to?: string
  underline: Underline = 'hover'
  color: Color = 'primary'
  size: Size = 'default'
  external?: boolean
  disabled = false
  target?: string
  rel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'link')
  }

  willUpdate() {
    this.setAttribute('data-underline', this.underline)
    this.setAttribute('data-color', this.color)
    this.setAttribute('data-size', this.size)
    if (this.disabled) {
      this.setAttribute('data-disabled', '')
    } else {
      this.removeAttribute('data-disabled')
    }
  }

  private onClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  render() {
    const isExternal =
      !this.disabled && (this.external !== undefined ? this.external : typeof this.href === 'string' && /^https?:\/\//.test(this.href))
    const target = this.target ?? (isExternal ? '_blank' : undefined)
    const rel = this.rel ?? (isExternal ? 'noopener noreferrer' : undefined)
    const resolvedHref = this.disabled ? undefined : (this.to ?? this.href)

    return html`
      <a
        part="base"
        data-slot="link"
        href=${resolvedHref ?? nothing}
        target=${target ?? nothing}
        rel=${rel ?? nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        tabindex=${this.disabled ? -1 : nothing}
        class=${cn(
          linkVariants({ underline: this.underline, color: this.color, size: this.size }),
          this.disabled && 'pointer-events-none opacity-50',
        )}
        @click=${this.onClick}
      >
        <slot name="left" class="[&::slotted(svg)]:size-4 [&::slotted(svg)]:shrink-0"></slot>
        <slot class="[&::slotted(svg)]:size-4 [&::slotted(svg)]:shrink-0"></slot>
        <slot name="right" class="[&::slotted(svg)]:size-4 [&::slotted(svg)]:shrink-0"></slot>
      </a>
    `
  }
}

customElements.get('uip-link') || customElements.define('uip-link', UipLink)

declare global {
  interface HTMLElementTagNameMap {
    'uip-link': UipLink
  }
}

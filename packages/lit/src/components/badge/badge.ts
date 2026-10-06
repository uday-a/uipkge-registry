import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { badgeVariants, type BadgeVariants } from './badge.variants'

type Variant = NonNullable<BadgeVariants['variant']>

/**
 * <uip-badge> — the registry Badge as a web component.
 *
 * Class strings are React's `badgeVariants` verbatim. Shadow-DOM adaptations:
 *  - `[&>svg]:…` / `[&>span]:min-w-0` can't see slotted children, so they are
 *    repeated as `::slotted(svg)` / `::slotted(span)` on the <slot>;
 *  - `href` renders an <a> (the stand-in for React's `asChild` + <a>), which
 *    is what makes the `[a&]:hover:*` variants apply.
 * Class overrides (React's `className`) target the inner element through
 * `::part(base)`, e.g. `class="[&::part(base)]:px-3"`.
 */
export class UipBadge extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    variant: { reflect: true },
    wrap: { type: Boolean, reflect: true },
    href: {},
    target: {},
  }

  variant: Variant = 'default'
  wrap = false
  href?: string
  target?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'badge')
  }

  render() {
    // cn() like React's cn(badgeVariants(…), className): twMerge resolves `wrap`'s
    // whitespace-normal / rounded-lg / py-1 against the base classes.
    const classes = cn(badgeVariants({ variant: this.variant, wrap: this.wrap || undefined }))
    const slot = html`<slot
      class="[&::slotted(svg)]:size-3 [&::slotted(svg)]:shrink-0 [&::slotted(svg)]:pointer-events-none [&::slotted(span)]:min-w-0"
    ></slot>`
    if (this.href) {
      return html`<a part="base" data-slot="badge" class=${classes} href=${this.href} target=${this.target ?? nothing}
        >${slot}</a
      >`
    }
    return html`<span part="base" data-slot="badge" class=${classes}>${slot}</span>`
  }
}

customElements.get('uip-badge') || customElements.define('uip-badge', UipBadge)

declare global {
  interface HTMLElementTagNameMap {
    'uip-badge': UipBadge
  }
}

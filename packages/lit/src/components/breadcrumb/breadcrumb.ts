import { LitElement, css, html, nothing } from 'lit'
import { ChevronRight, Ellipsis } from 'lucide'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * Breadcrumb as small composable elements (no id references between parts, so
 * they can be separate elements, like React's parts):
 *
 *   <uip-breadcrumb>                      nav[aria-label=breadcrumb] > ol (Breadcrumb + BreadcrumbList)
 *     <uip-breadcrumb-item>               role=listitem (BreadcrumbItem)
 *       <uip-breadcrumb-link href="#">    <a> (BreadcrumbLink)
 *     <uip-breadcrumb-separator>          role=presentation; default chevron, slot to override
 *     <uip-breadcrumb-item>
 *       <uip-breadcrumb-page>             aria-current=page (BreadcrumbPage)
 *     <uip-breadcrumb-ellipsis>           (BreadcrumbEllipsis)
 *
 * Item/separator hosts ARE the list items (ElementInternals role), so the
 * <ol> → listitem relationship holds in the accessibility tree and classes
 * such as `hidden md:inline-flex` go straight on the host.
 * React's `className` on the inner <a>/<ol> → `::part(base)`.
 */

abstract class Base extends LitElement {
  protected internals = this.attachInternals()
  protected abstract slotName: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', this.slotName)
  }
}

export class UipBreadcrumb extends Base {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]
  protected slotName = 'breadcrumb'

  render() {
    return html`<nav aria-label="breadcrumb">
      <ol
        part="base"
        data-slot="breadcrumb-list"
        class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5"
      >
        <slot></slot>
      </ol>
    </nav>`
  }
}

export class UipBreadcrumbItem extends Base {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]
  protected slotName = 'breadcrumb-item'

  constructor() {
    super()
    this.internals.role = 'listitem'
  }

  render() {
    return html`<span part="base" class="inline-flex items-center gap-1.5"><slot></slot></span>`
  }
}

/** `href`, `target`, `rel` forward to the inner <a>; the host's aria-label too. */
export class UipBreadcrumbLink extends Base {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline; }`]
  protected slotName = 'breadcrumb-link'

  static properties = {
    href: {},
    target: {},
    rel: {},
    accessibleLabel: { attribute: 'aria-label' },
  }

  href?: string
  target?: string
  rel?: string
  accessibleLabel?: string

  render() {
    return html`<a
      part="base"
      data-slot="breadcrumb-link"
      href=${this.href ?? nothing}
      target=${this.target ?? nothing}
      rel=${this.rel ?? nothing}
      aria-label=${this.accessibleLabel ?? nothing}
      class="hover:text-foreground focus-visible:outline-ring rounded-sm underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
      ><slot></slot
    ></a>`
  }
}

export class UipBreadcrumbPage extends Base {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline; }`]
  protected slotName = 'breadcrumb-page'

  render() {
    return html`<span part="base" data-slot="breadcrumb-page" aria-current="page" class="text-foreground cursor-default font-normal"
      ><slot></slot
    ></span>`
  }
}

/** Slot any node (an icon, `·`) to replace the default chevron. */
export class UipBreadcrumbSeparator extends Base {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]
  protected slotName = 'breadcrumb-separator'

  constructor() {
    super()
    this.internals.role = 'presentation'
    this.internals.ariaHidden = 'true'
  }

  render() {
    return html`<span part="base" class="[&_svg]:size-3.5"
      ><slot class="[&::slotted(svg)]:size-3.5">${icon(ChevronRight, 'chevron-right')}</slot></span
    >`
  }
}

export class UipBreadcrumbEllipsis extends Base {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]
  protected slotName = 'breadcrumb-ellipsis'

  render() {
    return html`<span part="base" data-slot="breadcrumb-ellipsis" class="flex size-11 items-center justify-center">
      <slot>${icon(Ellipsis, 'ellipsis', 'size-4')}</slot>
      <span class="sr-only">More</span>
    </span>`
  }
}

const define = (tag: string, cls: CustomElementConstructor) => customElements.get(tag) || customElements.define(tag, cls)
define('uip-breadcrumb', UipBreadcrumb)
define('uip-breadcrumb-item', UipBreadcrumbItem)
define('uip-breadcrumb-link', UipBreadcrumbLink)
define('uip-breadcrumb-page', UipBreadcrumbPage)
define('uip-breadcrumb-separator', UipBreadcrumbSeparator)
define('uip-breadcrumb-ellipsis', UipBreadcrumbEllipsis)

declare global {
  interface HTMLElementTagNameMap {
    'uip-breadcrumb': UipBreadcrumb
    'uip-breadcrumb-item': UipBreadcrumbItem
    'uip-breadcrumb-link': UipBreadcrumbLink
    'uip-breadcrumb-page': UipBreadcrumbPage
    'uip-breadcrumb-separator': UipBreadcrumbSeparator
    'uip-breadcrumb-ellipsis': UipBreadcrumbEllipsis
  }
}

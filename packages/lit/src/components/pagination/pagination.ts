import { LitElement, css, html, nothing } from 'lit'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

/**
 * <uip-pagination> — The root pagination nav.
 */
export class UipPagination extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    ariaLabel: { attribute: 'aria-label' },
  }

  ariaLabel = 'Pagination'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination')
    this.setAttribute('role', 'navigation')
    this.setAttribute('aria-label', this.ariaLabel || 'Pagination')
  }

  render() {
    return html`
      <nav
        part="base"
        data-uipkge=""
        data-slot="pagination"
        aria-label=${this.ariaLabel || 'Pagination'}
        class="flex items-center gap-1"
      >
        <slot></slot>
      </nav>
    `
  }
}

/**
 * <uip-pagination-list> — The <ul> container for pagination items.
 */
export class UipPaginationList extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination-list')
  }

  render() {
    return html`
      <ul part="list" data-uipkge="" data-slot="pagination-list" class="flex items-center gap-1">
        <slot></slot>
      </ul>
    `
  }
}

/**
 * <uip-pagination-list-item> — The <li> item inside pagination list.
 */
export class UipPaginationListItem extends LitElement {
  static styles = [tailwind, css`:host { display: inline-block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination-list-item')
  }

  render() {
    return html`
      <li part="item" data-uipkge="" data-slot="pagination-list-item" class="shrink-0 list-none">
        <slot></slot>
      </li>
    `
  }
}

/**
 * <uip-pagination-first> — Go to first page button.
 */
export class UipPaginationFirst extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    disabled: { type: Boolean, reflect: true },
  }

  disabled = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination-first')
  }

  render() {
    return html`
      <button
        type="button"
        part="button"
        aria-label="Go to first page"
        ?disabled=${this.disabled}
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium hover:bg-accent focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        <slot>${icon(ChevronsLeft, 'chevrons-left', 'size-4')}</slot>
      </button>
    `
  }
}

/**
 * <uip-pagination-prev> — Go to previous page button.
 */
export class UipPaginationPrev extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    disabled: { type: Boolean, reflect: true },
  }

  disabled = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination-prev')
  }

  render() {
    return html`
      <button
        type="button"
        part="button"
        aria-label="Go to previous page"
        ?disabled=${this.disabled}
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium hover:bg-accent focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        <slot>${icon(ChevronLeft, 'chevron-left', 'size-4')}</slot>
      </button>
    `
  }
}

/**
 * <uip-pagination-next> — Go to next page button.
 */
export class UipPaginationNext extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    disabled: { type: Boolean, reflect: true },
  }

  disabled = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination-next')
  }

  render() {
    return html`
      <button
        type="button"
        part="button"
        aria-label="Go to next page"
        ?disabled=${this.disabled}
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium hover:bg-accent focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        <slot>${icon(ChevronRight, 'chevron-right', 'size-4')}</slot>
      </button>
    `
  }
}

/**
 * <uip-pagination-last> — Go to last page button.
 */
export class UipPaginationLast extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    disabled: { type: Boolean, reflect: true },
  }

  disabled = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination-last')
  }

  render() {
    return html`
      <button
        type="button"
        part="button"
        aria-label="Go to last page"
        ?disabled=${this.disabled}
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium hover:bg-accent focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        <slot>${icon(ChevronsRight, 'chevrons-right', 'size-4')}</slot>
      </button>
    `
  }
}

/**
 * <uip-pagination-ellipsis> — Ellipsis indicator.
 */
export class UipPaginationEllipsis extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pagination-ellipsis')
  }

  render() {
    return html`
      <span
        part="ellipsis"
        aria-hidden="true"
        class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
      >
        <slot>${icon(MoreHorizontal, 'more-horizontal', 'size-4')}</slot>
      </span>
    `
  }
}

customElements.get('uip-pagination') || customElements.define('uip-pagination', UipPagination)
customElements.get('uip-pagination-list') || customElements.define('uip-pagination-list', UipPaginationList)
customElements.get('uip-pagination-list-item') || customElements.define('uip-pagination-list-item', UipPaginationListItem)
customElements.get('uip-pagination-first') || customElements.define('uip-pagination-first', UipPaginationFirst)
customElements.get('uip-pagination-prev') || customElements.define('uip-pagination-prev', UipPaginationPrev)
customElements.get('uip-pagination-next') || customElements.define('uip-pagination-next', UipPaginationNext)
customElements.get('uip-pagination-last') || customElements.define('uip-pagination-last', UipPaginationLast)
customElements.get('uip-pagination-ellipsis') || customElements.define('uip-pagination-ellipsis', UipPaginationEllipsis)

declare global {
  interface HTMLElementTagNameMap {
    'uip-pagination': UipPagination
    'uip-pagination-list': UipPaginationList
    'uip-pagination-list-item': UipPaginationListItem
    'uip-pagination-first': UipPaginationFirst
    'uip-pagination-prev': UipPaginationPrev
    'uip-pagination-next': UipPaginationNext
    'uip-pagination-last': UipPaginationLast
    'uip-pagination-ellipsis': UipPaginationEllipsis
  }
}

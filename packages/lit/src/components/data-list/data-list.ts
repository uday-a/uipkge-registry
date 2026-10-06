import { LitElement, css, html } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-data-list> — React's DataList: a vertical stack of
 * <uip-data-list-item> rows. The items are slotted (light DOM), so they are
 * the flex children of the inner `flex flex-col` div.
 *
 * React's `className` on the list → `part="base"`: style it from the page with
 * `class="[&::part(base)]:…"` on the host. Padding, margin and width can simply
 * go on the host's own `class`.
 */
export class UipDataList extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
  }


  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'data-list')
  }

  render() {
    return html`<div part="base" class="flex flex-col">
      <slot></slot>
    </div>`
  }
}

/**
 * <uip-data-list-item> — React's DataListItem: a label/value row (both
 * slotted, laid out `justify-between`).
 *
 * React's `first:pt-0 last:border-0 last:pb-0` match the ROW's position among
 * its siblings; inside a shadow root the inner div is always an only child, so
 * the element watches its parent and sets `data-first` / `data-last` on the
 * inner div, and those classes become `data-[first]:` / `data-[last]:`.
 *
 * React's `className` on the row → `part="base"`, e.g. React's `border-0 py-1`
 * is `class="[&::part(base)]:border-0 [&::part(base)]:py-1"`. A part rule
 * outranks the row's own `data-[first]:pt-0` / `data-[last]:pb-0` (and
 * `::part()` can't take attribute selectors), so restate those against the
 * host's position: `first:[&::part(base)]:pt-0 last:[&::part(base)]:pb-0`.
 */
export class UipDataListItem extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    first: { state: true },
    last: { state: true },
  }

  private first = false
  private last = false
  private observer?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'data-list-item')
    this.updatePosition()
    // Siblings are parsed/rendered after this row connects and may change later.
    if (this.parentNode) {
      this.observer = new MutationObserver(() => this.updatePosition())
      this.observer.observe(this.parentNode, { childList: true })
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.observer?.disconnect()
  }

  private updatePosition() {
    this.first = !this.previousElementSibling
    this.last = !this.nextElementSibling
  }

  render() {
    return html`<div
      part="base"
      ?data-first=${this.first}
      ?data-last=${this.last}
      class="flex flex-row items-center justify-between border-b py-4 transition-colors duration-200 data-[first]:pt-0 data-[last]:border-0 data-[last]:pb-0"
    >
      <slot></slot>
    </div>`
  }
}

customElements.get('uip-data-list') || customElements.define('uip-data-list', UipDataList)
customElements.get('uip-data-list-item') || customElements.define('uip-data-list-item', UipDataListItem)

declare global {
  interface HTMLElementTagNameMap {
    'uip-data-list': UipDataList
    'uip-data-list-item': UipDataListItem
  }
}

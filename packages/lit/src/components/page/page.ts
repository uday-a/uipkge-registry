import { LitElement, css, html, nothing } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * Page layout shell — the registry Page / PageBody / PageHeader /
 * PageHeaderHeading as four small elements (no id references between them,
 * so separate parts are fine).
 *
 * Slotted children aren't shadow-tree children, so React's `space-y-4` on
 * Page can't reach them — and a `::slotted()` margin loses to the host page's
 * preflight (`* { margin: 0 }`), since outer styles beat ::slotted in the
 * cascade. It is expressed as `flex flex-col gap-4` instead (the <slot> is
 * display: contents, so slotted children are the flex items). Consumer
 * classes go on the hosts.
 */
export class UipPage extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'page')
  }

  render() {
    return html`<div part="base" data-slot="page" class="flex flex-col gap-4"><slot></slot></div>`
  }
}

/** <uip-page-body> — plain content region (React's PageBody). */
export class UipPageBody extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'page-body')
  }

  render() {
    return html`<div part="base" data-slot="page-body"><slot></slot></div>`
  }
}

/**
 * <uip-page-header> — title row. Default slot: heading content (React's
 * `children`, wrapped in `flex-1`); `actions` slot: the right-aligned action
 * bar (React's `actions` prop), in a wrapping `gap-2` row that is dropped when
 * nothing is slotted.
 */
export class UipPageHeader extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]
  static properties = { hasActions: { state: true } }
  private hasActions = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'page-header')
  }

  render() {
    return html`<div
      part="base"
      data-slot="page-header"
      class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div class="flex-1"><slot></slot></div>
      <div
        part="actions"
        data-slot="page-header-actions"
        class="flex flex-wrap items-center gap-2 self-start sm:self-auto"
        ?hidden=${!this.hasActions}
      >
        <slot
          name="actions"
          @slotchange=${(e: Event) => (this.hasActions = (e.target as HTMLSlotElement).assignedNodes().length > 0)}
        ></slot>
      </div>
    </div>`
  }
}

/**
 * <uip-page-header-heading> — `heading` (React's `title`; `title` is an
 * HTMLElement attribute and would show a tooltip) and optional `description`.
 */
export class UipPageHeaderHeading extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    heading: {},
    description: {},
  }

  heading = ''
  description?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'page-header-heading')
  }

  render() {
    return html`<div part="base" data-slot="page-header-heading">
      <h2 class="text-2xl font-semibold tracking-tight">${this.heading}</h2>
      ${this.description
        ? html`<p class="text-muted-foreground mt-1 text-sm">${this.description}</p>`
        : nothing}
    </div>`
  }
}

customElements.get('uip-page') || customElements.define('uip-page', UipPage)
customElements.get('uip-page-body') || customElements.define('uip-page-body', UipPageBody)
customElements.get('uip-page-header') || customElements.define('uip-page-header', UipPageHeader)
customElements.get('uip-page-header-heading') || customElements.define('uip-page-header-heading', UipPageHeaderHeading)

declare global {
  interface HTMLElementTagNameMap {
    'uip-page': UipPage
    'uip-page-body': UipPageBody
    'uip-page-header': UipPageHeader
    'uip-page-header-heading': UipPageHeaderHeading
  }
}

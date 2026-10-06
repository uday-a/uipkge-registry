import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-list> — container for list items.
 */
export class UipList extends LitElement {
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
    as: { reflect: true },
  }

  as: 'ul' | 'ol' | 'div' = 'ul'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list')
  }

  render() {
    return html`
      <div part="base" data-slot="list" class="list-none space-y-1">
        <slot></slot>
      </div>
    `
  }
}

/**
 * <uip-list-item> — a single item in a list.
 */
export class UipListItem extends LitElement {
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
    active: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: { reflect: true },
    as: { reflect: true },
    hasContent: { state: true },
  }

  active = false
  disabled = false
  href?: string
  as: 'li' | 'div' | 'a' = 'li'
  private hasContent = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list-item')
  }

  willUpdate() {
    if (this.active) {
      this.setAttribute('data-active', '')
      this.setAttribute('aria-current', 'true')
    } else {
      this.removeAttribute('data-active')
      this.removeAttribute('aria-current')
    }
    if (this.disabled) {
      this.setAttribute('data-disabled', '')
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.removeAttribute('data-disabled')
      this.removeAttribute('aria-disabled')
    }
  }

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    const assigned = slot.assignedElements()
    this.hasContent = assigned.some(
      (el) => el.localName === 'uip-list-item-content' || el.getAttribute('data-slot') === 'list-item-content',
    )
  }

  private onClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  render() {
    const isInteractive = !this.disabled && (this.as === 'a' || this.href != null)
    const classes = cn(
      'rounded-md px-2 py-1.5 text-sm transition-colors duration-200 select-none focus-visible:outline-none',
      this.hasContent && 'flex items-center gap-3',
      isInteractive && 'hover:bg-accent focus-visible:bg-accent cursor-pointer',
      this.active && 'bg-accent text-accent-foreground',
      this.disabled && 'pointer-events-none cursor-not-allowed opacity-50',
    )

    if (this.href || this.as === 'a') {
      return html`
        <a
          part="base"
          data-slot="list-item"
          href=${this.disabled ? nothing : (this.href ?? nothing)}
          tabindex=${this.disabled ? -1 : nothing}
          class=${classes}
          @click=${this.onClick}
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </a>
      `
    }

    return html`
      <div
        part="base"
        data-slot="list-item"
        tabindex=${this.disabled ? -1 : nothing}
        class=${classes}
        @click=${this.onClick}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    `
  }
}

/**
 * <uip-list-item-media> — icon/avatar slot in a list item.
 */
export class UipListItemMedia extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; align-self: center; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list-item-media')
  }

  render() {
    return html`
      <div part="base" data-slot="list-item-media" class="flex shrink-0 items-center justify-center self-center">
        <slot></slot>
      </div>
    `
  }
}

/**
 * <uip-list-item-content> — primary title + description container.
 */
export class UipListItemContent extends LitElement {
  static styles = [tailwind, css`:host { display: flex; flex: 1 1 0%; min-width: 0; align-self: center; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list-item-content')
  }

  render() {
    return html`
      <div part="base" data-slot="list-item-content" class="flex min-w-0 flex-1 flex-col gap-0.5 self-center">
        <slot></slot>
      </div>
    `
  }
}

/**
 * <uip-list-item-title> — title inside list item content.
 */
export class UipListItemTitle extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list-item-title')
  }

  render() {
    return html`
      <div part="base" data-slot="list-item-title" class="text-foreground truncate text-sm leading-none font-medium">
        <slot></slot>
      </div>
    `
  }
}

/**
 * <uip-list-item-description> — description under title.
 */
export class UipListItemDescription extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list-item-description')
  }

  render() {
    return html`
      <div part="base" data-slot="list-item-description" class="text-muted-foreground line-clamp-1 text-xs">
        <slot></slot>
      </div>
    `
  }
}

/**
 * <uip-list-item-actions> — trailing actions/controls in a list item.
 */
export class UipListItemActions extends LitElement {
  static styles = [tailwind, css`:host { display: inline-flex; align-self: center; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list-item-actions')
  }

  render() {
    return html`
      <div part="base" data-slot="list-item-actions" class="text-muted-foreground flex shrink-0 items-center gap-1.5 self-center">
        <slot></slot>
      </div>
    `
  }
}

/**
 * <uip-list-subheader> — group header for list sections.
 */
export class UipListSubheader extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'list-subheader')
  }

  render() {
    return html`
      <div part="base" data-slot="list-subheader" class="text-muted-foreground px-2 py-1 text-xs font-medium tracking-wider uppercase">
        <slot></slot>
      </div>
    `
  }
}

customElements.get('uip-list') || customElements.define('uip-list', UipList)
customElements.get('uip-list-item') || customElements.define('uip-list-item', UipListItem)
customElements.get('uip-list-item-media') || customElements.define('uip-list-item-media', UipListItemMedia)
customElements.get('uip-list-item-content') || customElements.define('uip-list-item-content', UipListItemContent)
customElements.get('uip-list-item-title') || customElements.define('uip-list-item-title', UipListItemTitle)
customElements.get('uip-list-item-description') || customElements.define('uip-list-item-description', UipListItemDescription)
customElements.get('uip-list-item-actions') || customElements.define('uip-list-item-actions', UipListItemActions)
customElements.get('uip-list-subheader') || customElements.define('uip-list-subheader', UipListSubheader)

declare global {
  interface HTMLElementTagNameMap {
    'uip-list': UipList
    'uip-list-item': UipListItem
    'uip-list-item-media': UipListItemMedia
    'uip-list-item-content': UipListItemContent
    'uip-list-item-title': UipListItemTitle
    'uip-list-item-description': UipListItemDescription
    'uip-list-item-actions': UipListItemActions
    'uip-list-subheader': UipListSubheader
  }
}

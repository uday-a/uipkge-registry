import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { cardClasses } from '../card/card'
import { cardVariants } from '../card/card.variants'

/**
 * <uip-section-card> — the registry SectionCard as a web component.
 *
 * Renders the same Card / CardHeader / CardTitle / CardDescription /
 * CardContent DOM React produces (card's class strings merged with
 * SectionCard's overrides through `cn`, as React's `className` would be), in
 * one shadow root.
 *
 * Props: `heading` (React's `title` — `title` is taken by HTMLElement),
 * `description`. React's `headerAction` / `footer` nodes are the
 * `header-action` / `footer` slots; children are the default slot.
 * `className` / `contentClassName` overrides go through `::part(base)` /
 * `::part(content)`.
 */
export class UipSectionCard extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
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
    this.setAttribute('data-slot', 'section-card')
  }

  render() {
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="card"
      class=${cn(cardVariants({}), 'overflow-hidden', 'flex flex-col')}
    >
      <div data-uipkge="" data-slot="card-header" class=${cn(cardClasses.header, 'pb-4')}>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="min-w-0">
            <h3 data-uipkge="" data-slot="card-title" class=${cn(cardClasses.title, 'text-base font-semibold')}>${this.heading}</h3>
            ${this.description
              ? html`<p data-uipkge="" data-slot="card-description" class=${cn(cardClasses.description, 'mt-0.5')}>${this.description}</p>`
              : nothing}
          </div>
          <slot name="header-action"></slot>
        </div>
      </div>
      <div part="content" data-uipkge="" data-slot="card-content" class=${cn(cardClasses.content, 'flex-1')}>
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    </div>`
  }
}

customElements.get('uip-section-card') || customElements.define('uip-section-card', UipSectionCard)

declare global {
  interface HTMLElementTagNameMap {
    'uip-section-card': UipSectionCard
  }
}

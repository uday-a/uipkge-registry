import { LitElement, css, html } from 'lit'
import { twMerge } from 'tailwind-merge'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { cardVariants, type CardVariants } from './card.variants'

type Variant = NonNullable<CardVariants['variant']>

/** React's part class strings verbatim (shared with <uip-section-card>). */
export const cardClasses = {
  header:
    'grid auto-rows-min grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto] items-start gap-1.5 p-4 has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]',
  title: 'leading-none font-semibold tracking-tight',
  description: 'text-muted-foreground text-sm',
  action: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
  content: 'p-4 pt-0',
  footer: 'flex items-center p-4 pt-0',
}

// Host utilities that reach the part by inheritance (font size, line height, weight, tracking, colour).
const INHERITED = /^(?:[\w-]+:)*(?:text-|leading-|font-|tracking-)/

/**
 * React's `cn(defaults, className)` for a shadow part: drops the defaults that
 * tailwind-merge says the consumer's classes on `host` override, so e.g.
 * `<uip-card-title class="text-2xl">` loses `leading-none` exactly like
 * `<CardTitle className="text-2xl">`. Counted as consumer classes:
 * `[&::part(<part>)]:x` (also behind variants, `dark:[&::part(base)]:x`) and
 * plain inheritable text utilities on the host. The consumer's utilities still
 * come from the page's stylesheet (on the host / through `::part`); this only
 * removes the defaults they would otherwise have to fight.
 */
export function mergeHostClasses(defaults: string, host: Element, part = 'base'): string {
  const re = new RegExp(`^((?:[\\w-]+:)*)\\[&::part\\(${part}\\)\\]:(.+)$`)
  const consumer: string[] = []
  for (const c of (host.getAttribute('class') || '').split(/\s+/)) {
    const m = c.match(re)
    if (m) consumer.push(m[1] + m[2])
    else if (c && !c.includes('::part(') && INHERITED.test(c)) consumer.push(c)
  }
  if (!consumer.length) return defaults
  const kept = new Set(twMerge(defaults, consumer.join(' ')).split(' '))
  return defaults
    .split(/\s+/)
    .filter((c) => kept.has(c))
    .join(' ')
}

/**
 * Shared base for the card parts: tailwind sheet, theme bridge,
 * `data-uipkge` / `data-slot` on the host, and a re-render when the host's
 * `class` changes (see `mergeHostClasses`).
 */
abstract class CardPart extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]
  protected abstract slotName: string

  static get observedAttributes() {
    return [...super.observedAttributes, 'class']
  }

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', this.slotName)
  }

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value)
    if (name === 'class') this.requestUpdate()
  }

  /** The part's React class string merged against the consumer's host classes. */
  protected classes(defaults: string) {
    return mergeHostClasses(defaults, this)
  }
}

/**
 * <uip-card> + parts — the registry Card as web components.
 *
 * Parts don't reference each other by id, so each React part is its own
 * element: <uip-card-header>, <uip-card-title> (an <h3>),
 * <uip-card-description>, <uip-card-action>, <uip-card-content>,
 * <uip-card-footer>. Class strings are React's verbatim, on an inner element
 * exposed as `part="base"`; class overrides (React's `className`) target it
 * with `::part(base)`, e.g. `class="[&::part(base)]:border-primary"`. Layout
 * utilities on the host (max-w-*, margins, space-y-* for the children) work
 * as-is. Like React's `cn()`, a part drops its own defaults that the consumer's
 * classes override (`mergeHostClasses`): `<uip-card-title class="text-2xl">`
 * renders without `leading-none`.
 *
 * The card host is `display: grid` so its inner box fills the host when a grid
 * or flex parent stretches it (equal-height tiles, as React's stretched card).
 */
export class UipCard extends CardPart {
  static styles = [tailwind, css`:host { display: grid; }`]
  static properties = { variant: { reflect: true } }
  protected slotName = 'card'
  variant: Variant = 'default'

  render() {
    return html`<div part="base" data-slot="card" class=${this.classes(cn(cardVariants({ variant: this.variant }), 'overflow-hidden'))}>
      <slot></slot>
    </div>`
  }
}

/**
 * React's `has-data-[slot=card-action]:` can't see slotted children, so the
 * header sets `data-action` when a <uip-card-action> is slotted and repeats the
 * two-column grid as `data-[action]:`.
 */
export class UipCardHeader extends CardPart {
  static properties = { hasAction: { state: true } }
  protected slotName = 'card-header'
  private hasAction = false

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    this.hasAction = slot.assignedElements().some((el) => el.getAttribute('data-slot') === 'card-action')
  }

  render() {
    return html`<div
      part="base"
      data-slot="card-header"
      ?data-action=${this.hasAction}
      class=${this.classes(cn(cardClasses.header, 'data-[action]:grid-cols-[minmax(0,1fr)_auto]'))}
    >
      <slot @slotchange=${this.onSlotChange}></slot>
    </div>`
  }
}

export class UipCardTitle extends CardPart {
  protected slotName = 'card-title'
  render() {
    return html`<h3 part="base" data-slot="card-title" class=${this.classes(cardClasses.title)}><slot></slot></h3>`
  }
}

export class UipCardDescription extends CardPart {
  protected slotName = 'card-description'
  render() {
    return html`<p part="base" data-slot="card-description" class=${this.classes(cardClasses.description)}><slot></slot></p>`
  }
}

/**
 * The action's grid placement has to be on the grid item. The host is
 * `display: contents`, so its inner div is the header's grid item.
 */
export class UipCardAction extends CardPart {
  static styles = [tailwind, css`:host { display: contents; }`]
  protected slotName = 'card-action'
  render() {
    return html`<div part="base" data-slot="card-action" class=${this.classes(cardClasses.action)}><slot></slot></div>`
  }
}

export class UipCardContent extends CardPart {
  protected slotName = 'card-content'
  render() {
    return html`<div part="base" data-slot="card-content" class=${this.classes(cardClasses.content)}><slot></slot></div>`
  }
}

export class UipCardFooter extends CardPart {
  protected slotName = 'card-footer'
  render() {
    return html`<div part="base" data-slot="card-footer" class=${this.classes(cardClasses.footer)}><slot></slot></div>`
  }
}

const define = (tag: string, cls: CustomElementConstructor) => customElements.get(tag) || customElements.define(tag, cls)
define('uip-card', UipCard)
define('uip-card-header', UipCardHeader)
define('uip-card-title', UipCardTitle)
define('uip-card-description', UipCardDescription)
define('uip-card-action', UipCardAction)
define('uip-card-content', UipCardContent)
define('uip-card-footer', UipCardFooter)

declare global {
  interface HTMLElementTagNameMap {
    'uip-card': UipCard
    'uip-card-header': UipCardHeader
    'uip-card-title': UipCardTitle
    'uip-card-description': UipCardDescription
    'uip-card-action': UipCardAction
    'uip-card-content': UipCardContent
    'uip-card-footer': UipCardFooter
  }
}

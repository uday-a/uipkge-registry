import { LitElement, css, html, nothing } from 'lit'
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js'
import { AlertCircle, CheckCircle, Info, TriangleAlert } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { alertVariants, type AlertVariants } from './alert.variants'

type Variant = NonNullable<AlertVariants['variant']>
export type AlertIcon = 'info' | 'warning' | 'error' | 'success'

const builtInIcons = {
  error: { node: AlertCircle, name: 'circle-alert' },
  success: { node: CheckCircle, name: 'circle-check-big' },
  warning: { node: TriangleAlert, name: 'triangle-alert' },
  info: { node: Info, name: 'info' },
} as const

/**
 * <uip-alert> — the registry Alert as a web component, with <uip-alert-title>
 * and <uip-alert-description> for the composition API.
 *
 *   <uip-alert variant="destructive">
 *     <svg><!-- slotted icon, like React's <AlertCircle /> child --></svg>
 *     <uip-alert-title>Error</uip-alert-title>
 *     <uip-alert-description>Something went wrong.</uip-alert-description>
 *   </uip-alert>
 *
 *   <uip-alert icon="info" title="Heads up" text="…"></uip-alert>
 *
 * Class strings are React's verbatim. Two shadow-DOM adaptations (a slotted
 * <svg> is not a child of the inner root, so `[&>svg]` can't reach it):
 *  - the slot carries the icon rules as `[&::slotted(svg)]:…`;
 *  - React's `[&>svg~*]:pl-7` (pad everything after the icon) becomes
 *    `data-icon` on the inner root, mirrored onto slotted
 *    <uip-alert-title>/<uip-alert-description> so they pad themselves; the
 *    `[&>svg+div]:translate-y-[-3px]` nudge becomes `data-nudge` on the
 *    description when no title precedes it.
 *
 * `icon` renders a built-in Lucide glyph (info | warning | error | success);
 * slot your own <svg> instead for custom icons. `title` / `text` are the
 * shorthand for a title + description; combine them with slotted children
 * freely (props render first).
 *
 * Parts: `base` on each element (style React's `className` overrides with
 * `class="[&::part(base)]:…"` on the host).
 */
export class UipAlert extends LitElement {
  // React's root is a block <div>.
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    variant: { reflect: true },
    icon: { reflect: true },
    title: {},
    text: {},
    hasSlottedIcon: { state: true },
    hasSlottedTitle: { state: true },
  }

  variant: Variant = 'default'
  icon?: AlertIcon
  override title: string = ''
  text?: string
  private hasSlottedIcon = false
  private hasSlottedTitle = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'alert')
  }

  private get hasIcon() {
    return !!this.icon || this.hasSlottedIcon
  }

  private onSlotChange(e: Event) {
    const assigned = (e.target as HTMLSlotElement).assignedElements()
    this.hasSlottedIcon = assigned.some((el) => el.localName === 'svg')
    this.hasSlottedTitle = assigned.some(
      (el) => el.localName === 'uip-alert-title' || el.getAttribute('data-slot') === 'alert-title',
    )
    // Mirror the icon state onto the slotted parts (see class comment).
    const hasTitle = !!this.title || this.hasSlottedTitle
    for (const el of assigned) {
      if (el.localName !== 'uip-alert-title' && el.localName !== 'uip-alert-description') continue
      if (this.hasIcon) el.setAttribute('data-icon', '')
      else el.removeAttribute('data-icon')
      if (el.localName === 'uip-alert-description') {
        if (this.hasIcon && !hasTitle) el.setAttribute('data-nudge', '')
        else el.removeAttribute('data-nudge')
      }
    }
  }

  render() {
    const hasIcon = this.hasIcon
    const builtIn = this.icon ? builtInIcons[this.icon] : undefined
    // A slotted <svg> also matches the variants' `[&>svg]` tint when it is a
    // real shadow child — it isn't, so repeat the colour on the slot. A slotted
    // svg's own page classes (e.g. text-info) still apply from the light DOM.
    const slottedIconColor = this.variant === 'destructive' ? '[&::slotted(svg)]:text-destructive' : '[&::slotted(svg)]:text-foreground'
    return html`<div part="base" role="alert" data-uipkge="" data-slot="alert" ?data-icon=${hasIcon} class=${alertVariants({ variant: this.variant })}>
      ${builtIn ? icon(builtIn.node, builtIn.name) : nothing}
      ${this.title
        ? html`<p data-uipkge="" data-slot="alert-title" class=${cn('mb-1 text-sm leading-none font-medium tracking-tight', hasIcon && 'pl-7')}>
            ${this.title}
          </p>`
        : nothing}
      ${this.text
        ? html`<div
            data-uipkge=""
            data-slot="alert-description"
            class=${cn(
              'text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed',
              hasIcon && 'pl-7',
              hasIcon && !this.title && !this.hasSlottedTitle && 'translate-y-[-3px]',
            )}
          >
            ${this.text}
          </div>`
        : nothing}
      <slot
        class=${cn(
          '[&::slotted(svg)]:absolute [&::slotted(svg)]:left-4 [&::slotted(svg)]:top-4 [&::slotted(svg)]:size-4',
          slottedIconColor,
        )}
        @slotchange=${this.onSlotChange}
      ></slot>
    </div>`
  }
}

const titleClasses = 'mb-1 text-sm leading-none font-medium tracking-tight'
const descriptionClasses = 'text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed'

/** <uip-alert-title> — React's AlertTitle (`as` = h1-h6 | div, default h5). */
export class UipAlertTitle extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    as: { reflect: true },
    dataIcon: { type: Boolean, attribute: 'data-icon', reflect: true },
  }

  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' = 'h5'
  /** Set by <uip-alert> when an icon precedes the title (React's `[&>svg~*]:pl-7`). */
  dataIcon = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'alert-title')
  }

  render() {
    const tag = unsafeStatic(this.as)
    return staticHtml`<${tag} part="base" data-uipkge="" data-slot="alert-title" class=${cn(titleClasses, this.dataIcon && 'pl-7')}><slot></slot></${tag}>`
  }
}

/** <uip-alert-description> — React's AlertDescription. */
export class UipAlertDescription extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    dataIcon: { type: Boolean, attribute: 'data-icon', reflect: true },
    dataNudge: { type: Boolean, attribute: 'data-nudge', reflect: true },
  }

  /** Set by <uip-alert> when an icon precedes the description (React's `[&>svg~*]:pl-7`). */
  dataIcon = false
  /** Set by <uip-alert> when the icon is directly adjacent (React's `[&>svg+div]:translate-y-[-3px]`). */
  dataNudge = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'alert-description')
  }

  render() {
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="alert-description"
      class=${cn(descriptionClasses, this.dataIcon && 'pl-7', this.dataNudge && 'translate-y-[-3px]')}
    >
      <slot></slot>
    </div>`
  }
}

customElements.get('uip-alert') || customElements.define('uip-alert', UipAlert)
customElements.get('uip-alert-title') || customElements.define('uip-alert-title', UipAlertTitle)
customElements.get('uip-alert-description') || customElements.define('uip-alert-description', UipAlertDescription)

declare global {
  interface HTMLElementTagNameMap {
    'uip-alert': UipAlert
    'uip-alert-title': UipAlertTitle
    'uip-alert-description': UipAlertDescription
  }
}

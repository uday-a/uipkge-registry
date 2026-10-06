import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ArrowUp } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { backTopVariants, type BackTopVariants } from './back-top.variants'

type Size = NonNullable<BackTopVariants['size']>
type Position = NonNullable<BackTopVariants['position']>

/**
 * <uip-back-top> — the registry BackTop as a web component.
 *
 * Class strings are React's `backTopVariants` verbatim. The host is
 * `display: contents` — the button positions itself `fixed` (viewport) or
 * `absolute` (contained), offset from the `position` corner by `offset` px.
 * The default arrow is the same ArrowUp node; slot your own <svg slot="icon">
 * for React's `icon` prop. React's `ariaLabel` prop maps to the native
 * `aria-label` attribute (default `'Scroll to top'`).
 *
 * `target` is a CSS selector (attribute), HTMLElement, or Window (property) —
 * defaults to the window. The button mounts once scroll passes `threshold`
 * (`>=`, so `threshold="0"` always shows) and unmounts 200ms after hiding so
 * the exit animation plays, exactly like React.
 *
 * Events: `visible` (detail: { visible } — React's `onVisible`). The click
 * still smooth-scrolls (or instant with `behavior="auto"` /
 * `prefers-reduced-motion`).
 */
export class UipBackTop extends LitElement {
  // The button positions itself (fixed/absolute); the host adds no box.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    threshold: { type: Number },
    target: { converter: { fromAttribute: (v: string | null) => v ?? undefined, toAttribute: () => null } },
    behavior: { reflect: true },
    size: { reflect: true },
    position: { reflect: true },
    offset: { type: Number },
    absolute: { type: Boolean, reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    visible: { state: true },
    mounted: { state: true },
    dataState: { state: true },
    hasSlottedIcon: { state: true },
  }

  threshold = 200
  target?: string | HTMLElement | Window
  behavior: ScrollBehavior = 'smooth'
  size: Size = 'default'
  position: Position = 'bottom-right'
  offset = 24
  absolute = false
  accessibleLabel = 'Scroll to top'
  private visible = false
  private mounted = false
  private dataState: 'open' | 'closed' = 'closed'
  private hasSlottedIcon = false
  private currentTarget: HTMLElement | Window | null = null
  private hideTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'back-top')
    this.currentTarget = this.resolveTarget()
    this.attach()
    this.handleScroll()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.detach()
    clearTimeout(this.hideTimer)
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('target')) {
      this.detach()
      this.currentTarget = this.resolveTarget()
      this.attach()
      this.handleScroll()
    }
    // Mount/unmount with exit animation, mirroring React.
    if (changed.has('visible')) {
      if (this.visible) {
        clearTimeout(this.hideTimer)
        this.mounted = true
        this.dataState = 'open'
      } else if (this.mounted) {
        this.dataState = 'closed'
        clearTimeout(this.hideTimer)
        this.hideTimer = setTimeout(() => (this.mounted = false), 200)
      }
    }
  }

  private resolveTarget(): HTMLElement | Window | null {
    if (typeof window === 'undefined') return null
    const t = this.target
    if (t === undefined || t === null) return window
    if (typeof t === 'string') return document.querySelector<HTMLElement>(t) ?? window
    return t
  }

  private getScrollTop(el: HTMLElement | Window): number {
    if (el === window) return window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0
    return (el as HTMLElement).scrollTop
  }

  private scrollToTop(el: HTMLElement | Window) {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : this.behavior
    if (el === window) window.scrollTo({ top: 0, behavior })
    else (el as HTMLElement).scrollTo({ top: 0, behavior })
  }

  private handleScroll = () => {
    const current = this.currentTarget
    if (!current) return
    // `>=` so threshold={0} always shows (size/position demos, forced-visible cases).
    const next = this.getScrollTop(current) >= this.threshold
    if (next !== this.visible) {
      this.visible = next
      this.dispatchEvent(new CustomEvent('visible', { detail: { visible: next }, bubbles: true, composed: true }))
    }
  }

  private attach() {
    const current = this.currentTarget
    if (!current) return
    current.addEventListener('scroll', this.handleScroll, { passive: true })
    // If target is a container, also listen to window scroll for safety on resize.
    if (current !== window) window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  private detach() {
    const current = this.currentTarget
    if (!current) return
    current.removeEventListener('scroll', this.handleScroll)
    if (current !== window) window.removeEventListener('scroll', this.handleScroll)
  }

  private onClick() {
    if (this.currentTarget) this.scrollToTop(this.currentTarget)
  }

  private onIconSlotChange(e: Event) {
    this.hasSlottedIcon = (e.target as HTMLSlotElement)
      .assignedNodes()
      .some((n) => n.nodeType === 1 || n.textContent?.trim())
  }

  render() {
    if (!this.mounted) return nothing
    const o = `${this.offset}px`
    const positionStyle =
      this.position === 'bottom-left'
        ? { left: o, bottom: o }
        : this.position === 'top-right'
          ? { right: o, top: o }
          : this.position === 'top-left'
            ? { left: o, top: o }
            : { right: o, bottom: o }
    // React's `[&_svg]:…` sizing for slotted icons (a slotted <svg> is not a
    // descendant of the inner button): sm → size-4, lg → size-6, else size-5.
    const slottedIconSize =
      this.size === 'sm'
        ? "[&::slotted(svg:not([class*=size-]))]:size-4"
        : this.size === 'lg'
          ? "[&::slotted(svg:not([class*=size-]))]:size-6"
          : "[&::slotted(svg:not([class*=size-]))]:size-5"
    return html`<button
      part="base"
      data-uipkge=""
      data-slot="back-top"
      data-state=${this.dataState}
      data-size=${this.size}
      data-position=${this.position}
      type="button"
      aria-label=${this.accessibleLabel}
      class=${cn(backTopVariants({ size: this.size, position: this.position }), this.absolute ? 'absolute' : 'fixed')}
      style=${styleMap(positionStyle)}
      @click=${this.onClick}
    >
      ${this.hasSlottedIcon ? nothing : icon(ArrowUp, 'arrow-up')}
      <slot
        name="icon"
        class=${cn('[&::slotted(svg)]:pointer-events-none [&::slotted(svg)]:shrink-0', slottedIconSize)}
        @slotchange=${this.onIconSlotChange}
      ></slot>
    </button>`
  }
}

customElements.get('uip-back-top') || customElements.define('uip-back-top', UipBackTop)

declare global {
  interface HTMLElementTagNameMap {
    'uip-back-top': UipBackTop
  }
}

import { LitElement, css, html, isServer, nothing } from 'lit'
import { Loader2 } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

type ScrollEl = HTMLElement | Window | null

/**
 * <uip-infinite-scroll> — Triggers a load-more event when the user scrolls near the end
 * (or top in reverse mode) of the viewport or a specified scrollable container.
 */
export class UipInfiniteScroll extends LitElement {
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
    hasMore: {
      type: Boolean,
      attribute: 'has-more',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    loading: { type: Boolean },
    distance: { type: Number },
    scrollTarget: { type: String, attribute: 'scroll-target' },
    reverse: { type: Boolean },
    disabled: { type: Boolean },
    hideSpinner: { type: Boolean, attribute: 'hide-spinner' },
  }

  hasMore = true
  loading = false
  distance = 0
  scrollTarget: string | HTMLElement = 'window'
  reverse = false
  disabled = false
  hideSpinner = false

  private scrollEl: ScrollEl = null
  private boundOnScroll: (() => void) | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'infinite-scroll')
    if (!isServer) {
      this.attachScrollListener()
      requestAnimationFrame(() => this.check())
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.detachScrollListener()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('scrollTarget')) {
      this.detachScrollListener()
      this.attachScrollListener()
    }
    if (changedProperties.has('loading') || changedProperties.has('hasMore')) {
      if (!this.loading && this.hasMore) {
        requestAnimationFrame(() => this.check())
      }
    }
  }

  private getScrollElement(): ScrollEl {
    if (typeof window === 'undefined') return null
    if (this.scrollTarget === 'window') return window
    if (typeof this.scrollTarget === 'string') {
      return (document.querySelector(this.scrollTarget) as HTMLElement | null) ?? window
    }
    return this.scrollTarget
  }

  private attachScrollListener() {
    this.scrollEl = this.getScrollElement()
    if (!this.scrollEl) return
    this.boundOnScroll = () => this.check()
    this.scrollEl.addEventListener('scroll', this.boundOnScroll, { passive: true })
  }

  private detachScrollListener() {
    if (this.scrollEl && this.boundOnScroll) {
      this.scrollEl.removeEventListener('scroll', this.boundOnScroll)
    }
    this.scrollEl = null
    this.boundOnScroll = null
  }

  private check() {
    if (this.disabled || this.loading || !this.hasMore) return
    const sentinel = this.renderRoot.querySelector('[data-slot="infinite-scroll-sentinel"]') as HTMLElement | null
    if (!sentinel) return

    const sentinelRect = sentinel.getBoundingClientRect()
    let edgeTop = 0
    let edgeBottom = window.innerHeight || document.documentElement.clientHeight

    if (this.scrollEl && this.scrollEl !== window) {
      const r = (this.scrollEl as HTMLElement).getBoundingClientRect()
      edgeTop = r.top
      edgeBottom = r.bottom
    }

    if (this.reverse) {
      if (sentinelRect.bottom >= edgeTop - this.distance && sentinelRect.top <= edgeBottom) {
        this.emitLoadMore()
      }
    } else {
      if (sentinelRect.top <= edgeBottom + this.distance && sentinelRect.bottom >= edgeTop - this.distance) {
        this.emitLoadMore()
      }
    }
  }

  private emitLoadMore() {
    this.dispatchEvent(new CustomEvent('load-more', { bubbles: true, composed: true }))
  }

  render() {
    const showSpinner = this.loading && !this.hideSpinner

    const loadingSlotContent = html`
      <slot name="loading">
        <div data-slot="infinite-scroll-loading" class="flex w-full justify-center py-3">
          ${icon(Loader2, 'loader-2', 'text-muted-foreground size-5 animate-spin', 'Loading')}
        </div>
      </slot>
    `

    const sentinelEl = html`<div data-slot="infinite-scroll-sentinel" class="h-px w-full" aria-hidden="true"></div>`

    const endSlotContent = html`
      <slot name="end">
        <div data-slot="infinite-scroll-end" class="text-muted-foreground w-full py-3 text-center text-xs">
          No more items
        </div>
      </slot>
    `

    return html`
      <div part="base" class="w-full">
        ${this.reverse
          ? html`
              ${showSpinner ? loadingSlotContent : nothing}
              ${sentinelEl}
              <slot></slot>
            `
          : html`
              <slot></slot>
              ${sentinelEl}
              ${showSpinner ? loadingSlotContent : nothing}
              ${!this.hasMore && !this.loading ? endSlotContent : nothing}
            `}
      </div>
    `
  }
}

customElements.get('uip-infinite-scroll') || customElements.define('uip-infinite-scroll', UipInfiniteScroll)

declare global {
  interface HTMLElementTagNameMap {
    'uip-infinite-scroll': UipInfiniteScroll
  }
}

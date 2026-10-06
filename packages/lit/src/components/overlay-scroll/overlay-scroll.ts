import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

const overlayScrollCss = css`
  /* A flex column (min-height: 0) so the viewport scrolls when the host is
     sized by a flex parent or a max-height, not only by an explicit height. */
  :host {
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
    overflow: hidden;
  }
  .overlay-scroll__inner {
    scrollbar-width: none;
    -ms-overflow-style: none;
    overscroll-behavior: contain;
  }
  .overlay-scroll__inner::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  .overlay-scroll__thumb {
    position: absolute;
    top: 0;
    border-radius: 2px;
    background: var(--muted-foreground);
    opacity: 0;
    pointer-events: none;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition:
      opacity 0.2s ease,
      background-color 0.15s,
      width 0.12s ease;
    will-change: transform, opacity;
  }
  .overlay-scroll__thumb--draggable {
    cursor: pointer;
  }
  .overlay-scroll__thumb--visible {
    opacity: 0.4;
    pointer-events: auto;
  }
  :host(:hover) .overlay-scroll__thumb--visible {
    opacity: 0.6;
  }
  :host(:hover) .overlay-scroll__thumb--draggable:hover {
    opacity: 0.8;
    width: 8px !important;
    background: var(--foreground);
  }
  .overlay-scroll__thumb--dragging {
    opacity: 1 !important;
    background: var(--foreground) !important;
    width: 8px !important;
  }
`

/**
 * <uip-overlay-scroll> — Slack-style auto-fading overlay scrollbar.
 */
export class UipOverlayScroll extends LitElement {
  static styles = [tailwind, overlayScrollCss]

  static properties = {
    thumbWidth: { type: Number, attribute: 'thumb-width' },
    thumbOffset: { type: Number, attribute: 'thumb-offset' },
    idleHideMs: { type: Number, attribute: 'idle-hide-ms' },
    draggable: { converter: trueByDefault },
    thumbHeight: { state: true },
    thumbTop: { state: true },
    showThumb: { state: true },
    isDragging: { state: true },
  }

  thumbWidth = 4
  thumbOffset = 2
  idleHideMs = 800
  draggable = true

  private thumbHeight = 0
  private thumbTop = 0
  private showThumb = false
  private isDragging = false

  private isHovered = false
  private hideTimer: ReturnType<typeof setTimeout> | null = null
  private activePointerId: number | null = null
  private dragStartY = 0
  private dragStartScrollTop = 0
  private ro?: ResizeObserver
  private mo?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'overlay-scroll')
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.ro?.disconnect()
    this.mo?.disconnect()
    if (this.hideTimer) clearTimeout(this.hideTimer)
  }

  get scrollerEl(): HTMLElement | null {
    return this.renderRoot?.querySelector('.overlay-scroll__inner') ?? null
  }

  scrollTo(options?: ScrollToOptions): void
  scrollTo(x: number, y: number): void
  scrollTo(xOrOptions?: number | ScrollToOptions, y?: number): void {
    if (typeof xOrOptions === 'number') {
      this.scrollerEl?.scrollTo(xOrOptions, y ?? 0)
    } else if (xOrOptions) {
      this.scrollerEl?.scrollTo(xOrOptions)
    }
  }

  recompute = () => {
    const el = this.scrollerEl
    if (!el) return
    const ratio = el.clientHeight / el.scrollHeight
    if (!Number.isFinite(ratio) || ratio >= 1) {
      this.thumbHeight = 0
      return
    }
    const h = Math.max(24, el.clientHeight * ratio)
    this.thumbHeight = h
    const maxScroll = el.scrollHeight - el.clientHeight
    const maxThumb = el.clientHeight - h
    this.thumbTop = maxScroll > 0 ? (el.scrollTop / maxScroll) * maxThumb : 0
  }

  private flashThumb() {
    if (this.thumbHeight === 0) return
    this.showThumb = true
    if (this.hideTimer) clearTimeout(this.hideTimer)
    this.hideTimer = setTimeout(() => {
      if (!this.isHovered && !this.isDragging) this.showThumb = false
    }, this.idleHideMs)
  }

  private onScroll = () => {
    this.recompute()
    this.flashThumb()
  }

  private onMouseEnter = () => {
    this.isHovered = true
    this.recompute()
    if (this.thumbHeight > 0) this.showThumb = true
  }

  private onMouseLeave = () => {
    this.isHovered = false
    if (this.isDragging) return
    if (this.hideTimer) clearTimeout(this.hideTimer)
    this.showThumb = false
  }

  private onPointerMove = (e: PointerEvent) => {
    if (this.activePointerId !== e.pointerId) return
    const el = this.scrollerEl
    if (!el) return
    const maxScroll = el.scrollHeight - el.clientHeight
    const maxThumb = el.clientHeight - this.thumbHeight
    if (maxThumb <= 0) return
    const scrollRatio = maxScroll / maxThumb
    el.scrollTop = this.dragStartScrollTop + (e.clientY - this.dragStartY) * scrollRatio
  }

  private endDrag = (e?: PointerEvent) => {
    if (e && this.activePointerId !== e.pointerId) return
    this.isDragging = false
    const thumb = this.renderRoot?.querySelector<HTMLElement>('.overlay-scroll__thumb')
    if (thumb && this.activePointerId !== null) {
      try {
        thumb.releasePointerCapture(this.activePointerId)
      } catch {
        // ignore
      }
    }
    this.activePointerId = null
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.endDrag)
    window.removeEventListener('pointercancel', this.endDrag)
    if (!this.isHovered) this.showThumb = false
  }

  private onThumbPointerDown = (e: PointerEvent) => {
    if (!this.draggable || !this.scrollerEl) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    this.isDragging = true
    this.activePointerId = e.pointerId
    this.dragStartY = e.clientY
    this.dragStartScrollTop = this.scrollerEl.scrollTop

    const thumb = e.currentTarget as HTMLElement
    thumb.setPointerCapture(e.pointerId)
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.endDrag)
    window.addEventListener('pointercancel', this.endDrag)
  }

  protected firstUpdated() {
    this.recompute()
    const scroller = this.scrollerEl
    if (!scroller) return

    this.ro = new ResizeObserver(this.recompute)
    this.ro.observe(scroller)
    this.ro.observe(this)

    this.mo = new MutationObserver(this.recompute)
    this.mo.observe(this, { childList: true, subtree: true })
  }

  render() {
    const thumbStyle = {
      width: `${this.thumbWidth}px`,
      right: `var(--ovs-thumb-right, ${this.thumbOffset}px)`,
      height: `${this.thumbHeight}px`,
      transform: `translateY(${this.thumbTop}px)`,
    }

    return html`
      <div
        class="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden"
        @mouseenter=${this.onMouseEnter}
        @mouseleave=${this.onMouseLeave}
      >
        <div
          part="viewport"
          data-slot="overlay-scroll-viewport"
          class="overlay-scroll__inner min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto"
          @scroll=${this.onScroll}
        >
          <slot @slotchange=${this.recompute}></slot>
        </div>

        <div
          part="thumb"
          data-slot="overlay-scroll-thumb"
          aria-hidden="true"
          class=${cn(
            'overlay-scroll__thumb',
            this.showThumb && 'overlay-scroll__thumb--visible',
            this.isDragging && 'overlay-scroll__thumb--dragging',
            this.draggable && 'overlay-scroll__thumb--draggable',
          )}
          style=${styleMap(thumbStyle)}
          @pointerdown=${this.onThumbPointerDown}
        ></div>
      </div>
    `
  }
}

customElements.get('uip-overlay-scroll') || customElements.define('uip-overlay-scroll', UipOverlayScroll)

declare global {
  interface HTMLElementTagNameMap {
    'uip-overlay-scroll': UipOverlayScroll
  }
}

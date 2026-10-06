import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type ScrollAreaType = 'hover' | 'always' | 'scroll' | 'auto'

/**
 * <uip-scroll-area> — the registry ScrollArea (Root + Viewport + ScrollBar +
 * Thumb) as ONE web component with native scrolling and custom overlay thumbs.
 *
 *   <uip-scroll-area class="h-48 max-w-xs rounded-md border">
 *     …overflowing content…
 *   </uip-scroll-area>
 *
 * The viewport scrolls natively (keyboard, touch, wheel all work); the native
 * scrollbars are hidden and overlay tracks render instead, sized and
 * positioned from the viewport's scroll metrics. Class strings are React's
 * verbatim: the tracks carry the ScrollBar classes (vertical `h-full w-2.5`,
 * horizontal `h-2.5 flex-col`), the thumbs the ScrollAreaThumb classes
 * (`bg-border relative flex-1 rounded-full`), positioned with an explicit
 * height/top (vertical) or width/left (horizontal) like Radix does. Thumbs
 * drag to scroll; clicking a track jumps toward the pointer.
 *
 * `type` mirrors Radix: `hover` (default — thumbs fade in on hover, focus, or
 * while scrolling), `always` / `auto` (visible whenever the axis overflows),
 * `scroll` (visible only while scrolling). Each axis renders its track only
 * when it overflows, so single-axis content shows a single scrollbar — React's
 * vertical-always + opt-in horizontal falls out naturally.
 *
 * `scroll` events don't cross the shadow boundary, so viewport scrolling is
 * re-dispatched as a `scroll` event (bubbles, composed) on the host.
 * `scrollTo()` / `scrollBy()` forward to the viewport.
 *
 * Parts: `base` (the positioned root), `viewport`, `scrollbar` (both tracks),
 * `thumb` (both thumbs).
 */
export class UipScrollArea extends LitElement {
  // React's root is a block <div>.
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    type: { reflect: true },
    canV: { state: true },
    canH: { state: true },
    thumbV: { state: true },
    thumbH: { state: true },
    interacting: { state: true },
  }

  type: ScrollAreaType = 'hover'
  private canV = false
  private canH = false
  private thumbV = { size: 0, offset: 0 }
  private thumbH = { size: 0, offset: 0 }
  /** Hover, focus-within, or mid-scroll — drives `hover`/`scroll` visibility. */
  private interacting = false
  private scrollEndTimer?: ReturnType<typeof setTimeout>
  private resizeObserver?: ResizeObserver
  private drag?: { axis: 'v' | 'h'; pointerId: number; grabOffset: number }

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'scroll-area')
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.resizeObserver?.disconnect()
    clearTimeout(this.scrollEndTimer)
  }

  private get viewport() {
    return this.renderRoot.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
  }

  protected firstUpdated() {
    this.sync()
    this.resizeObserver = new ResizeObserver(() => this.sync())
    const vp = this.viewport
    if (vp) this.resizeObserver.observe(vp)
  }

  /** Forwarded viewport scrolling (same overloads as Element.scrollTo). */
  scrollTo(options?: ScrollToOptions): void
  scrollTo(x: number, y: number): void
  scrollTo(xOrOptions?: number | ScrollToOptions, y?: number) {
    const vp = this.viewport
    if (!vp) return
    if (typeof xOrOptions === 'number') vp.scrollTo(xOrOptions, y ?? 0)
    else vp.scrollTo(xOrOptions)
  }

  /** Forwarded viewport scrolling (same overloads as Element.scrollBy). */
  scrollBy(options?: ScrollToOptions): void
  scrollBy(x: number, y: number): void
  scrollBy(xOrOptions?: number | ScrollToOptions, y?: number) {
    const vp = this.viewport
    if (!vp) return
    if (typeof xOrOptions === 'number') vp.scrollBy(xOrOptions, y ?? 0)
    else vp.scrollBy(xOrOptions)
  }

  private sync() {
    const vp = this.viewport
    if (!vp) return
    const canV = vp.scrollHeight - vp.clientHeight > 1
    const canH = vp.scrollWidth - vp.clientWidth > 1
    this.canV = canV
    this.canH = canH
    this.thumbV = this.metrics(vp.scrollTop, vp.scrollHeight, vp.clientHeight)
    this.thumbH = this.metrics(vp.scrollLeft, vp.scrollWidth, vp.clientWidth)
  }

  /** Thumb size/offset as track percentages (Radix-style proportional thumb). */
  private metrics(pos: number, total: number, visible: number) {
    if (total <= visible || total <= 0) return { size: 0, offset: 0 }
    const size = Math.max((visible / total) * 100, 4)
    const max = total - visible
    const offset = max > 0 ? (Math.min(Math.max(pos, 0), max) / max) * (100 - size) : 0
    return { size, offset }
  }

  private onScroll = () => {
    this.sync()
    this.dispatchEvent(new Event('scroll', { bubbles: true, composed: true }))
    // `scroll` (and the tail of `hover`) visibility: stay "interacting" until
    // 300ms after the last scroll event.
    this.interacting = true
    clearTimeout(this.scrollEndTimer)
    this.scrollEndTimer = setTimeout(() => (this.interacting = false), 300)
  }

  private onPointerEnter = () => (this.interacting = true)
  private onPointerLeave = () => (this.interacting = false)
  private onFocusIn = () => (this.interacting = true)
  private onFocusOut = (e: FocusEvent) => {
    if (e.relatedTarget && this.renderRoot.contains(e.relatedTarget as Node)) return
    this.interacting = false
  }

  private trackVisible() {
    if (this.type === 'always' || this.type === 'auto') return true
    return this.interacting
  }

  // --- thumb drag + track jump -------------------------------------------------
  private onThumbPointerDown(axis: 'v' | 'h', e: PointerEvent) {
    const vp = this.viewport
    const thumb = e.currentTarget as HTMLElement
    const track = thumb.parentElement
    if (!vp || !track) return
    e.preventDefault()
    e.stopPropagation()
    const thumbRect = thumb.getBoundingClientRect()
    this.drag = {
      axis,
      pointerId: e.pointerId,
      grabOffset: axis === 'v' ? e.clientY - thumbRect.top : e.clientX - thumbRect.left,
    }
    this.interacting = true
    thumb.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => {
      if (!this.drag || ev.pointerId !== this.drag.pointerId) return
      const r = track.getBoundingClientRect()
      if (axis === 'v') {
        const ratio = (ev.clientY - r.top - this.drag.grabOffset) / (r.height - thumbRect.height || 1)
        vp.scrollTop = ratio * (vp.scrollHeight - vp.clientHeight)
      } else {
        const ratio = (ev.clientX - r.left - this.drag.grabOffset) / (r.width - thumbRect.width || 1)
        vp.scrollLeft = ratio * (vp.scrollWidth - vp.clientWidth)
      }
    }
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== this.drag?.pointerId) return
      this.drag = undefined
      thumb.removeEventListener('pointermove', move)
      thumb.removeEventListener('pointerup', up)
      thumb.removeEventListener('pointercancel', up)
    }
    thumb.addEventListener('pointermove', move)
    thumb.addEventListener('pointerup', up)
    thumb.addEventListener('pointercancel', up)
  }

  private onTrackPointerDown(axis: 'v' | 'h', e: PointerEvent) {
    // Thumb drags stop propagation; anything reaching here is a track click.
    const vp = this.viewport
    const track = e.currentTarget as HTMLElement
    if (!vp) return
    const r = track.getBoundingClientRect()
    if (axis === 'v') {
      const ratio = (e.clientY - r.top) / (r.height || 1)
      vp.scrollTo({ top: ratio * vp.scrollHeight - vp.clientHeight / 2 })
    } else {
      const ratio = (e.clientX - r.left) / (r.width || 1)
      vp.scrollTo({ left: ratio * vp.scrollWidth - vp.clientWidth / 2 })
    }
  }

  render() {
    const show = this.trackVisible()
    const fade = show ? 'opacity-100' : 'pointer-events-none opacity-0'
    const scrollable = this.canV || this.canH
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="scroll-area"
      class="relative size-full"
      @pointerenter=${this.onPointerEnter}
      @pointerleave=${this.onPointerLeave}
      @focusin=${this.onFocusIn}
      @focusout=${this.onFocusOut}
    >
      <div
        part="viewport"
        data-uipkge=""
        data-slot="scroll-area-viewport"
        tabindex=${scrollable ? '0' : nothing}
        class="focus-visible:ring-ring/50 size-full overflow-auto rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll=${this.onScroll}
      >
        <slot @slotchange=${() => this.sync()}></slot>
      </div>
      ${this.canV
        ? html`<div
            part="scrollbar"
            data-uipkge=""
            data-slot="scroll-area-scrollbar"
            orientation="vertical"
            data-state=${show ? 'visible' : 'hidden'}
            class=${cn(
              'absolute top-0 right-0 flex touch-none p-px transition-colors select-none',
              'h-full w-2.5 border-l border-l-transparent',
              fade,
            )}
            @pointerdown=${(e: PointerEvent) => this.onTrackPointerDown('v', e)}
          >
            <div
              part="thumb"
              data-uipkge=""
              data-slot="scroll-area-thumb"
              class="bg-border relative flex-1 cursor-default rounded-full"
              style=${styleMap({ height: `${this.thumbV.size}%`, top: `${this.thumbV.offset}%` })}
              @pointerdown=${(e: PointerEvent) => this.onThumbPointerDown('v', e)}
            ></div>
          </div>`
        : nothing}
      ${this.canH
        ? html`<div
            part="scrollbar"
            data-uipkge=""
            data-slot="scroll-area-scrollbar"
            orientation="horizontal"
            data-state=${show ? 'visible' : 'hidden'}
            class=${cn(
              'absolute bottom-0 left-0 flex touch-none p-px transition-colors select-none',
              'h-2.5 w-full flex-col border-t border-t-transparent',
              fade,
            )}
            @pointerdown=${(e: PointerEvent) => this.onTrackPointerDown('h', e)}
          >
            <div
              part="thumb"
              data-uipkge=""
              data-slot="scroll-area-thumb"
              class="bg-border relative flex-1 cursor-default rounded-full"
              style=${styleMap({ width: `${this.thumbH.size}%`, left: `${this.thumbH.offset}%` })}
              @pointerdown=${(e: PointerEvent) => this.onThumbPointerDown('h', e)}
            ></div>
          </div>`
        : nothing}
    </div>`
  }
}

customElements.get('uip-scroll-area') || customElements.define('uip-scroll-area', UipScrollArea)

declare global {
  interface HTMLElementTagNameMap {
    'uip-scroll-area': UipScrollArea
  }
}

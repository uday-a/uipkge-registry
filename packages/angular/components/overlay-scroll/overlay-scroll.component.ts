import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export interface OverlayScrollMetrics {
  scrollHeight: number
  clientHeight: number
  scrollTop: number
}

const overlayScrollCss = `
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
:host:hover .overlay-scroll__thumb--visible,
.overlay-scroll:hover .overlay-scroll__thumb--visible {
  opacity: 0.6;
}
:host:hover .overlay-scroll__thumb--draggable:hover,
.overlay-scroll:hover .overlay-scroll__thumb--draggable:hover {
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
 * Angular port of UIPKGE OverlayScroll. Slack-style overlay scrollbar: the
 * native scrollbar is hidden so content uses the full width, then a thin
 * auto-fading thumb is drawn on top (drag-to-scroll via Pointer Events).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-overlay-scroll, [ui-overlay-scroll]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"overlay-scroll"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
  },
  template: `
    <style>
      ${overlayScrollCss}
    </style>
    <div #scrollerEl data-uipkge data-slot="overlay-scroll-viewport" [class]="innerClass" (scroll)="onScroll()">
      <ng-content />
    </div>
    @if (thumbHeight > 0 && showThumb) {
      <div
        #thumbEl
        data-uipkge
        data-slot="overlay-scroll-thumb"
        aria-hidden="true"
        [class]="thumbClass"
        [style]="thumbStyle"
        (pointerdown)="onThumbPointerDown($event)"
      ></div>
    }
  `,
})
export class UiOverlayScrollComponent implements AfterViewInit, OnDestroy {
  @Input() thumbWidth = 4
  @Input() thumbOffset = 2
  @Input() idleHideMs = 800
  @Input({ transform: booleanAttribute }) draggable = true
  @Input('class') className?: string

  @ViewChild('scrollerEl', { static: false }) scrollerRef?: ElementRef<HTMLElement>
  @ViewChild('thumbEl', { static: false }) thumbRef?: ElementRef<HTMLElement>

  thumbHeight = 0
  thumbTop = 0
  showThumb = false
  isHovered = false
  isDragging = false
  private hideTimer: ReturnType<typeof setTimeout> | null = null
  private resizeObserver: ResizeObserver | null = null
  private mutationObserver: MutationObserver | null = null

  private activePointerId: number | null = null
  private dragStartY = 0
  private dragStartScrollTop = 0

  get scrollerEl(): HTMLElement | null {
    return this.scrollerRef?.nativeElement ?? null
  }

  get hostClass(): string {
    return cn('block overlay-scroll relative', this.className)
  }

  get innerClass(): string {
    return cn('overlay-scroll__inner h-full overflow-x-hidden overflow-y-auto')
  }

  get thumbClass(): string {
    return cn(
      'overlay-scroll__thumb',
      this.showThumb && 'overlay-scroll__thumb--visible',
      this.isDragging && 'overlay-scroll__thumb--dragging',
      this.draggable && 'overlay-scroll__thumb--draggable',
    )
  }

  get thumbStyle(): Record<string, string> {
    const width = this.isHovered || this.isDragging ? this.thumbWidth * 2 : this.thumbWidth
    return {
      height: `${this.thumbHeight}px`,
      transform: `translateY(${this.thumbTop}px)`,
      width: `${width}px`,
      right: `var(--ovs-thumb-right, ${this.thumbOffset}px)`,
    }
  }

  ngAfterViewInit(): void {
    this.recompute()
    const el = this.scrollerEl
    if (!el) return

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.recompute())
      this.resizeObserver.observe(el)
    }

    const inner = el.firstElementChild as HTMLElement | null
    if (inner) {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver?.observe(inner)
      }
      if (typeof MutationObserver !== 'undefined') {
        this.mutationObserver = new MutationObserver(() => this.recompute())
        this.mutationObserver.observe(inner, { childList: true, subtree: true })
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()
    if (this.hideTimer) clearTimeout(this.hideTimer)
    this.endDrag()
  }

  recompute(m?: OverlayScrollMetrics): void {
    const el = this.scrollerEl
    const clientHeight = m ? m.clientHeight : (el?.clientHeight ?? 0)
    const scrollHeight = m ? m.scrollHeight : (el?.scrollHeight ?? 0)
    const scrollTop = m ? m.scrollTop : (el?.scrollTop ?? 0)

    const ratio = clientHeight / scrollHeight
    if (!Number.isFinite(ratio) || ratio >= 1) {
      this.thumbHeight = 0
      return
    }
    this.thumbHeight = Math.max(24, clientHeight * ratio)
    const maxScroll = scrollHeight - clientHeight
    const maxThumb = clientHeight - this.thumbHeight
    this.thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumb : 0
  }

  flashThumb(): void {
    if (this.thumbHeight === 0) return
    this.showThumb = true
    if (this.hideTimer) clearTimeout(this.hideTimer)
    this.hideTimer = setTimeout(() => {
      if (!this.isHovered && !this.isDragging) this.showThumb = false
    }, this.idleHideMs)
  }

  hideThumb(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer)
    this.hideTimer = null
    if (!this.isDragging) this.showThumb = false
  }

  onScroll(m?: OverlayScrollMetrics): void {
    this.recompute(m)
    this.flashThumb()
  }

  onEnter(): void {
    this.isHovered = true
    this.recompute()
    if (this.thumbHeight > 0) this.showThumb = true
  }

  onLeave(): void {
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
    const thumb = this.thumbRef?.nativeElement
    if (thumb && this.activePointerId !== null) {
      try {
        thumb.releasePointerCapture(this.activePointerId)
      } catch {}
    }
    this.activePointerId = null
    thumb?.removeEventListener('pointermove', this.onPointerMove)
    thumb?.removeEventListener('pointerup', this.endDrag)
    thumb?.removeEventListener('pointercancel', this.endDrag)
    if (!this.isHovered) this.showThumb = false
  }

  onThumbPointerDown(e: PointerEvent): void {
    if (!this.draggable || !this.scrollerEl || !this.thumbRef?.nativeElement) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    this.isDragging = true
    this.activePointerId = e.pointerId
    this.dragStartY = e.clientY
    this.dragStartScrollTop = this.scrollerEl.scrollTop
    const thumb = this.thumbRef.nativeElement
    thumb.setPointerCapture(e.pointerId)
    thumb.addEventListener('pointermove', this.onPointerMove)
    thumb.addEventListener('pointerup', this.endDrag)
    thumb.addEventListener('pointercancel', this.endDrag)
  }
}

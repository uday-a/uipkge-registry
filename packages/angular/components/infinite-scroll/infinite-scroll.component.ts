import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  booleanAttribute,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE InfiniteScroll. Load-more-on-scroll sentinel with
 * window/element target, threshold, reverse mode, loading/hasMore gating.
 * Classes and DOM structure mirror Vue and React sources.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-infinite-scroll, [ui-infinite-scroll]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"infinite-scroll"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    @if (reverse) {
      @if (showSpinner) {
        <div data-slot="infinite-scroll-loading" class="flex w-full justify-center py-3">
          <ng-content select="[slot=loading]">
            <svg
              class="text-muted-foreground size-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-label="Loading"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </ng-content>
        </div>
      }
      <div #sentinel data-slot="infinite-scroll-sentinel" aria-hidden="true" class="h-px w-full"></div>
      <ng-content />
    } @else {
      <ng-content />
      <div #sentinel data-slot="infinite-scroll-sentinel" aria-hidden="true" class="h-px w-full"></div>
      @if (showSpinner) {
        <div data-slot="infinite-scroll-loading" class="flex w-full justify-center py-3">
          <ng-content select="[slot=loading]">
            <svg
              class="text-muted-foreground size-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-label="Loading"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </ng-content>
        </div>
      }
      @if (!hasMore && !loading) {
        <div data-slot="infinite-scroll-end" class="text-muted-foreground w-full py-3 text-center text-xs">
          <ng-content select="[slot=end]">No more items</ng-content>
        </div>
      }
    }
  `,
})
export class UiInfiniteScrollComponent implements AfterViewInit, OnDestroy, OnChanges {
  private cdr?: ChangeDetectorRef

  constructor() {
    try {
      this.cdr = inject(ChangeDetectorRef, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input() hasMore = true
  @Input({ transform: booleanAttribute }) loading = false
  @Input() distance = 0
  @Input() scrollTarget: 'window' | HTMLElement | string = 'window'
  @Input({ transform: booleanAttribute }) reverse = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) hideSpinner = false
  @Input('class') className?: string

  @Output() load = new EventEmitter<void>()
  @Output() onLoadMore = this.load
  @Output() loadMore = this.load

  @ViewChild('sentinel') sentinelRef?: ElementRef<HTMLElement>

  private scrollEl: HTMLElement | Window | null = null

  get hostClass(): string {
    return cn('block w-full', this.className)
  }

  get showSpinner(): boolean {
    return this.loading && !this.hideSpinner
  }

  get canLoad(): boolean {
    return !this.disabled && !this.loading && this.hasMore
  }

  checkAndEmit(nearEdge: boolean): void {
    if (nearEdge && this.canLoad) this.load.emit()
  }

  onIntersection(isIntersecting: boolean): void {
    this.checkAndEmit(isIntersecting)
  }

  private getScrollElement(): HTMLElement | Window | null {
    if (typeof window === 'undefined') return null
    if (this.scrollTarget === 'window') return window
    if (typeof this.scrollTarget === 'string') {
      return (document.querySelector(this.scrollTarget) as HTMLElement | null) ?? window
    }
    return this.scrollTarget
  }

  private check(): void {
    if (!this.canLoad || !this.sentinelRef?.nativeElement) return
    const sentinelEl = this.sentinelRef.nativeElement
    const sentinelRect = sentinelEl.getBoundingClientRect()

    let edgeTop = 0
    let edgeBottom = typeof window !== 'undefined' ? window.innerHeight || document.documentElement.clientHeight : 0

    if (this.scrollEl && typeof window !== 'undefined' && this.scrollEl !== window) {
      const r = (this.scrollEl as HTMLElement).getBoundingClientRect()
      edgeTop = r.top
      edgeBottom = r.bottom
    }

    if (this.reverse) {
      if (sentinelRect.bottom >= edgeTop - this.distance && sentinelRect.top <= edgeBottom) {
        this.load.emit()
      }
    } else {
      if (sentinelRect.top <= edgeBottom + this.distance && sentinelRect.bottom >= edgeTop - this.distance) {
        this.load.emit()
      }
    }
  }

  private onScroll = (): void => {
    this.check()
  }

  ngAfterViewInit(): void {
    this.bindScroll()
    this.check()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scrollTarget'] && !changes['scrollTarget'].firstChange) {
      this.unbindScroll()
      this.bindScroll()
    }
    if (changes['loading']) {
      this.cdr?.markForCheck()
      if (!changes['loading'].currentValue && this.hasMore) {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(() => this.check())
        }
      }
    }
    if (changes['hasMore']) {
      this.cdr?.markForCheck()
    }
  }

  private bindScroll(): void {
    this.scrollEl = this.getScrollElement()
    this.scrollEl?.addEventListener('scroll', this.onScroll, { passive: true })
  }

  private unbindScroll(): void {
    this.scrollEl?.removeEventListener('scroll', this.onScroll)
    this.scrollEl = null
  }

  ngOnDestroy(): void {
    this.unbindScroll()
  }
}

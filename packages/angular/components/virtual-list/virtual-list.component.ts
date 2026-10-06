import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ContentChild,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { cn } from '@/lib/utils'

export interface VirtualListHandle {
  scrollToOffset: (px: number) => void
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' }) => void
  getVisibleRange: () => [number, number]
}

/**
 * Angular port of UIPKGE VirtualList — windowed scroller rendering only
 * visible rows plus overscan. Same API as React and Vue (items, itemSize fixed or fn,
 * height, overscan, keyField, direction).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-virtual-list, [ui-virtual-list]',
  standalone: true,
  imports: [NgTemplateOutlet],
  host: {
    '[attr.data-slot]': '"virtual-list"',
    '[attr.data-uipkge]': '""',
    '[attr.data-direction]': 'direction',
    '[class]': 'hostClass',
    '[style]': 'containerStyle',
    '(scroll)': 'onScroll($event)',
  },
  template: `
    <div [style]="innerStyle">
      @for (item of visibleItems; track keyAt(range[0] + $index); let i = $index) {
        <div [style]="rowStyle(item, range[0] + i)">
          @if (resolvedTemplate) {
            <ng-container *ngTemplateOutlet="resolvedTemplate; context: { $implicit: item, index: range[0] + i }" />
          }
        </div>
      }
    </div>
  `,
})
export class UiVirtualListComponent implements AfterViewInit, OnDestroy, OnChanges, VirtualListHandle {
  private elementRef?: ElementRef<HTMLElement>
  private cdr?: ChangeDetectorRef

  constructor() {
    try {
      this.elementRef = inject(ElementRef, { optional: true }) ?? undefined
      this.cdr = inject(ChangeDetectorRef, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input() items: unknown[] = []
  @Input() itemSize: number | ((item: unknown, index: number) => number) = 32
  @Input() height: number | string = 400
  @Input() overscan = 3
  @Input() keyField = 'id'
  @Input() direction: 'vertical' | 'horizontal' = 'vertical'
  @Input('class') className?: string
  @Input() itemTemplate?: TemplateRef<{ $implicit: unknown; index: number }>

  @ContentChild(TemplateRef) contentTemplate?: TemplateRef<{ $implicit: unknown; index: number }>

  @Output() scroll = new EventEmitter<Event>()
  @Output() rangeChange = new EventEmitter<[number, number]>()

  scrollOffset = 0
  viewportSize = 0
  private resizeObserver: ResizeObserver | null = null

  get resolvedTemplate(): TemplateRef<{ $implicit: unknown; index: number }> | undefined {
    return this.itemTemplate ?? this.contentTemplate
  }

  get hostClass(): string {
    return cn('block relative w-full', this.className)
  }

  get heightStyle(): string {
    return typeof this.height === 'number' ? `${this.height}px` : this.height
  }

  get isVertical(): boolean {
    return this.direction === 'vertical'
  }

  get containerStyle(): string {
    const h = this.heightStyle
    return this.isVertical ? `height: ${h}; overflow-y: auto;` : `width: ${h}; overflow-x: auto;`
  }

  sizeAt(index: number): number {
    if (typeof this.itemSize === 'number') return this.itemSize
    return this.itemSize(this.items[index], index)
  }

  totalSize(): number {
    let total = 0
    for (let i = 0; i < this.items.length; i++) total += this.sizeAt(i)
    return total
  }

  offsetAt(index: number): number {
    let offset = 0
    for (let i = 0; i < index && i < this.items.length; i++) offset += this.sizeAt(i)
    return offset
  }

  keyAt(index: number): string {
    const item = this.items[index] as Record<string, unknown> | null
    const k = item?.[this.keyField]
    return k == null ? String(index) : String(k)
  }

  private getOffsets(): number[] {
    const out: number[] = [0]
    for (let i = 0; i < this.items.length; i++) {
      out.push(out[i]! + this.sizeAt(i))
    }
    return out
  }

  private findIndex(offsets: number[], target: number): number {
    let lo = 0
    let hi = offsets.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (offsets[mid]! <= target) lo = mid
      else hi = mid - 1
    }
    return lo
  }

  visibleRange(scrollOffset: number, viewportSize: number): [number, number] {
    if (!this.items.length || (viewportSize === 0 && this.viewportSize === 0)) return [0, 0]
    const vs = viewportSize || this.viewportSize
    const offsets = this.getOffsets()
    const startIdx = this.findIndex(offsets, scrollOffset)
    const start = Math.max(0, startIdx - this.overscan)
    const endIdx = this.findIndex(offsets, scrollOffset + vs)
    const end = Math.min(this.items.length, endIdx + 1 + this.overscan)
    const range: [number, number] = [start, end]
    this.rangeChange.emit(range)
    return range
  }

  get range(): [number, number] {
    if (!this.items.length) return [0, 0]
    const vs =
      this.viewportSize ||
      (typeof this.height === 'number' ? this.height : Number.parseInt(String(this.height), 10) || 400)
    return this.visibleRange(this.scrollOffset, vs)
  }

  get visibleItems(): unknown[] {
    const [start, end] = this.range
    return this.items.slice(start, end)
  }

  get offsetStart(): number {
    return this.offsetAt(this.range[0])
  }

  get innerStyle(): string {
    const total = this.totalSize()
    return this.isVertical
      ? `height: ${total}px; position: relative; width: 100%;`
      : `width: ${total}px; position: relative; height: 100%;`
  }

  rowStyle(item: unknown, index: number): string {
    const size = this.sizeAt(index)
    const start = this.offsetAt(index)
    return this.isVertical
      ? `position: absolute; top: 0; left: 0; width: 100%; height: ${size}px; transform: translateY(${start}px);`
      : `position: absolute; top: 0; left: 0; height: 100%; width: ${size}px; transform: translateX(${start}px);`
  }

  get offsetStyle(): string {
    return this.isVertical
      ? `transform: translateY(${this.offsetStart}px);`
      : `transform: translateX(${this.offsetStart}px); height: 100%; display: flex;`
  }

  itemWrapperStyle(item: unknown, index: number): string {
    const s = this.sizeAt(index)
    return this.isVertical ? `height: ${s}px;` : `width: ${s}px; flex-shrink: 0;`
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement | null
    if (el) {
      this.scrollOffset = this.isVertical ? el.scrollTop : el.scrollLeft
      this.cdr?.markForCheck()
    }
    this.scroll.emit(event)
  }

  private measure(): void {
    const el = this.elementRef?.nativeElement as HTMLElement | undefined
    if (el) {
      const measured = this.isVertical ? el.clientHeight : el.clientWidth
      const fallback = typeof this.height === 'number' ? this.height : Number.parseInt(String(this.height), 10) || 0
      this.viewportSize = measured || fallback
      this.cdr?.markForCheck()
    }
  }

  ngAfterViewInit(): void {
    this.measure()
    const el = this.elementRef?.nativeElement as HTMLElement | undefined
    if (typeof ResizeObserver !== 'undefined' && el) {
      this.resizeObserver = new ResizeObserver(() => this.measure())
      this.resizeObserver.observe(el)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['height']) {
      this.measure()
    }
    this.cdr?.markForCheck()
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
  }

  scrollToOffset(px: number): void {
    const el = this.elementRef?.nativeElement as HTMLElement | undefined
    if (!el) return
    if (this.isVertical) el.scrollTop = px
    else el.scrollLeft = px
  }

  scrollToIndex(index: number, options: { align?: 'start' | 'center' | 'end' } = {}): void {
    const align = options.align ?? 'start'
    const start = this.offsetAt(index)
    const size = this.sizeAt(index)
    const vs =
      this.viewportSize ||
      (typeof this.height === 'number' ? this.height : Number.parseInt(String(this.height), 10) || 400)
    let target = start
    if (align === 'center') target = start - vs / 2 + size / 2
    else if (align === 'end') target = start - vs + size
    this.scrollToOffset(Math.max(0, target))
  }

  getVisibleRange(): [number, number] {
    return this.range
  }
}

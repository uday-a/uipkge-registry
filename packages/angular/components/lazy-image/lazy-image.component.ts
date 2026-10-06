import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiSkeletonComponent } from '@/ui/skeleton/skeleton.component'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

export type LazyImagePlaceholder = 'skeleton' | 'none'
export type LazyImageState = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * Angular port of UIPKGE LazyImage (React `Img`). Lazy-loaded image with aspect-ratio
 * reservation, Skeleton placeholder, fade-in and error fallback. The <img> mounts once the host
 * comes within 200px of the viewport (IntersectionObserver; renders immediately without IO or
 * with `eager`). React's `fallbackContent` node is a TemplateRef input.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-lazy-image, [ui-lazy-image]',
  standalone: true,
  imports: [UiSkeletonComponent, UiRenderTemplateDirective],
  host: {
    '[attr.data-slot]': '"lazy-image"',
    '[attr.data-uipkge]': '""',
    '[style.aspect-ratio]': 'aspectRatioStyle',
    '[style.width]': 'widthStyle',
    '[style.height]': 'heightStyle',
    '[class]': 'hostClass',
  },
  template: `<ng-container #anchor />
    @if (placeholder === 'skeleton' && state() !== 'loaded' && state() !== 'error') {
      <div ui-skeleton class="absolute inset-0 size-full rounded-none"></div>
    }
    @if (visible() && state() !== 'error') {
      <img
        [src]="src"
        [attr.srcset]="srcSet ?? null"
        [attr.sizes]="sizes ?? null"
        [alt]="alt"
        [attr.loading]="eager ? 'eager' : 'lazy'"
        [attr.decoding]="eager ? 'sync' : 'async'"
        [class]="imgClassMerged"
        (load)="onLoad($event)"
        (error)="onError($event)"
      />
    }
    @if (state() === 'error') {
      @if (fallbackContent) {
        <ng-container [uiRenderTemplate]="fallbackContent" />
      } @else if (fallback) {
        <img [src]="fallback" [alt]="alt" [class]="fallbackClass" />
      } @else {
        <div
          role="img"
          class="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs"
          aria-label="Image failed to load"
        >
          <span aria-hidden="true">Image unavailable</span>
        </div>
      }
    }`,
})
export class UiLazyImageComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() src = ''
  @Input() srcSet?: string
  @Input() sizes?: string
  @Input() alt = ''
  @Input() aspectRatio?: string | number
  @Input() width?: string | number
  @Input() height?: string | number
  @Input() placeholder: LazyImagePlaceholder = 'skeleton'
  @Input({ transform: booleanAttribute }) cover = true
  @Input({ transform: booleanAttribute }) eager = false
  @Input() fallback?: string
  @Input({ transform: booleanAttribute }) transition = true
  @Input('class') className?: string
  @Input() imgClassName?: string
  /** Overrides the default error fallback (React `fallbackContent`). */
  @Input() fallbackContent?: TemplateRef<unknown>

  /** React `onLoad` / `onError` (img load/error events don't bubble, so no native collision). */
  @Output() load = new EventEmitter<Event>()
  @Output() error = new EventEmitter<Event>()

  /** Comment node inside the host; its parent is the host element (no ElementRef injection needed). */
  @ViewChild('anchor', { read: ElementRef }) private anchor?: ElementRef<Comment>

  readonly state = signal<LazyImageState>('idle')
  readonly visible = signal(false)
  private observer?: IntersectionObserver
  private viewReady = false

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] || changes['eager']) {
      this.state.set('idle')
      if (this.viewReady) this.observe()
      else if (this.eager) this.show()
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true
    this.observe()
  }

  ngOnDestroy(): void {
    this.observer?.disconnect()
  }

  /** Reset + (re)observe, like React's [src, eager] effect. */
  private observe(): void {
    this.observer?.disconnect()
    this.observer = undefined
    if (this.eager) return this.show()
    this.visible.set(false)
    const host = this.anchor?.nativeElement.parentElement
    if (typeof IntersectionObserver === 'undefined' || !host) return this.show()
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect()
          this.show()
        }
      },
      { rootMargin: '200px' },
    )
    this.observer = observer
    observer.observe(host)
  }

  private show(): void {
    this.visible.set(true)
    if (this.state() === 'idle') this.state.set('loading')
  }

  get hostClass(): string {
    return cn('block bg-muted relative overflow-hidden', this.className)
  }

  get imgClassMerged(): string {
    return cn(
      'block size-full',
      this.cover ? 'object-cover' : 'object-contain',
      this.transition && 'transition-opacity duration-300',
      this.state() === 'loaded' ? 'opacity-100' : 'opacity-0',
      this.imgClassName,
    )
  }

  get fallbackClass(): string {
    return cn('block size-full', this.cover ? 'object-cover' : 'object-contain', this.imgClassName)
  }

  get aspectRatioStyle(): string | null {
    return this.aspectRatio === undefined ? null : String(this.aspectRatio)
  }

  get widthStyle(): string | null {
    if (this.width === undefined) return null
    return typeof this.width === 'number' ? `${this.width}px` : this.width
  }

  get heightStyle(): string | null {
    if (this.height === undefined) return null
    return typeof this.height === 'number' ? `${this.height}px` : this.height
  }

  onLoad(e: Event): void {
    this.state.set('loaded')
    this.load.emit(e)
  }

  onError(e: Event): void {
    this.state.set('error')
    this.error.emit(e)
  }
}

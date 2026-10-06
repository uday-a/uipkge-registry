import {
  AfterContentInit,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  avatarVariants,
  avatarFallbackVariants,
  type AvatarVariants,
  type AvatarFallbackVariants,
} from './avatar.variants'

export type AvatarSize = NonNullable<AvatarVariants['size']>
export type AvatarRounded = NonNullable<AvatarVariants['rounded']>
export type AvatarColor = NonNullable<AvatarVariants['color']>
export type AvatarVariant = NonNullable<AvatarVariants['variant']>
/** Radix `ImageLoadingStatus`. */
export type AvatarImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * Angular port of UIPKGE Avatar (React `Avatar` on Radix Avatar). Radix semantics: the root
 * holds the image loading status; `ui-avatar-image` preloads its `src` off-DOM and only
 * renders the `<img>` once it has loaded, while `ui-avatar-fallback` renders until then
 * (optionally after `delayMs`) and disappears once the image is shown. A broken or missing
 * src therefore shows just the fallback, never both side by side.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-avatar, [ui-avatar]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"avatar"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiAvatarComponent {
  @Input() size?: AvatarSize
  @Input() rounded?: AvatarRounded
  @Input() color?: AvatarColor
  @Input() variant?: AvatarVariant
  @Input({ transform: booleanAttribute }) tile = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) loading = false
  @Input('class') className?: string

  /** Shared with the image / fallback parts (signal: set from load callbacks, zoneless-safe). */
  readonly imageStatus = signal<AvatarImageLoadingStatus>('idle')

  get hostClass(): string {
    return cn(
      avatarVariants({ size: this.size, rounded: this.rounded, color: this.color, variant: this.variant }),
      this.tile ? 'rounded-none' : '',
      this.disabled ? 'cursor-not-allowed opacity-50' : '',
      this.loading ? 'animate-pulse' : '',
      this.className,
    )
  }
}

/**
 * Radix `AvatarImage`: preloads `src` with `new Image()` (honouring `referrerPolicy` /
 * `crossOrigin`) and renders the `<img>` only when it loaded. Emits `loadingStatusChange`
 * (React `onLoadingStatusChange`) for every status after `idle`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-avatar-image, [ui-avatar-image]',
  standalone: true,
  host: { class: 'contents' },
  template: `@if (status() === 'loaded') {
    <img
      [src]="src"
      [attr.alt]="alt ?? null"
      [attr.loading]="loading ?? null"
      [attr.referrerpolicy]="referrerPolicy ?? null"
      [attr.crossorigin]="crossOrigin ?? null"
      data-uipkge=""
      data-slot="avatar-image"
      [class]="imgClass"
    />
  }`,
})
export class UiAvatarImageComponent implements OnChanges, OnDestroy {
  private readonly avatar = inject(UiAvatarComponent, { optional: true })
  private readonly ownStatus = signal<AvatarImageLoadingStatus>('idle')
  private probe?: HTMLImageElement

  @Input() src?: string
  @Input() alt?: string
  @Input() loading?: 'eager' | 'lazy'
  @Input() referrerPolicy?: ReferrerPolicy
  @Input() crossOrigin?: 'anonymous' | 'use-credentials' | ''
  @Input('class') className?: string
  @Output() loadingStatusChange = new EventEmitter<AvatarImageLoadingStatus>()

  readonly status = computed(() => (this.avatar ? this.avatar.imageStatus() : this.ownStatus()))

  get imgClass(): string {
    return cn('aspect-square size-full object-cover', this.className)
  }

  ngOnChanges(): void {
    this.load()
  }

  ngOnDestroy(): void {
    this.detach()
    if (this.avatar) this.avatar.imageStatus.set('idle')
  }

  private setStatus(s: AvatarImageLoadingStatus): void {
    if (this.avatar) this.avatar.imageStatus.set(s)
    this.ownStatus.set(s)
    if (s !== 'idle') this.loadingStatusChange.emit(s)
  }

  private detach(): void {
    if (!this.probe) return
    this.probe.onload = this.probe.onerror = null
    this.probe = undefined
  }

  private load(): void {
    this.detach()
    if (!this.src || typeof window === 'undefined') {
      this.setStatus('error')
      return
    }
    const img = new window.Image()
    this.probe = img
    img.onload = () => this.probe === img && this.setStatus('loaded')
    img.onerror = () => this.probe === img && this.setStatus('error')
    if (this.referrerPolicy) img.referrerPolicy = this.referrerPolicy
    if (this.crossOrigin !== undefined) img.crossOrigin = this.crossOrigin
    this.setStatus('loading')
    img.src = this.src
    if (img.complete && img.naturalWidth > 0) this.setStatus('loaded')
  }
}

/**
 * Radix `AvatarFallback`: rendered while the image is not loaded; with `delayMs` it waits
 * that long first (avoids a flash of initials for fast-loading images). `text` wins over
 * projected content, like React `text ?? children`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-avatar-fallback, [ui-avatar-fallback]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"avatar-fallback"',
    '[class]': 'hostClass',
  },
  template: `@if (visible()) {
    @if (text !== undefined) {
      {{ text }}
    } @else {
      <ng-content />
    }
  }`,
})
export class UiAvatarFallbackComponent implements OnInit {
  private readonly avatar = inject(UiAvatarComponent, { optional: true })
  private readonly destroyRef = inject(DestroyRef)
  private readonly canRender = signal(true)

  @Input() size: NonNullable<AvatarFallbackVariants['size']> = 'default'
  @Input() color: NonNullable<AvatarFallbackVariants['color']> = 'default'
  @Input() text?: string
  @Input() delayMs?: number
  @Input('class') className?: string

  readonly visible = computed(() => this.canRender() && (this.avatar?.imageStatus() ?? 'idle') !== 'loaded')

  ngOnInit(): void {
    if (this.delayMs === undefined) return
    this.canRender.set(false)
    const id = setTimeout(() => this.canRender.set(true), this.delayMs)
    this.destroyRef.onDestroy(() => clearTimeout(id))
  }

  get hostClass(): string {
    return this.visible()
      ? cn(avatarFallbackVariants({ size: this.size, color: this.color }), this.className)
      : 'hidden'
  }
}

/** Renders an `overflow` template with the hidden count (React `overflow(count)`). */
@Directive({ selector: '[uiAvatarOverflowOutlet]', standalone: true })
export class UiAvatarOverflowOutletDirective implements OnChanges, OnDestroy {
  @Input('uiAvatarOverflowOutlet') template: TemplateRef<AvatarOverflowContext> | null = null
  @Input() uiAvatarOverflowOutletCount = 0
  private readonly vcr = inject(ViewContainerRef)
  private readonly ctx: AvatarOverflowContext = { $implicit: 0, count: 0 }

  ngOnChanges(): void {
    this.ctx.$implicit = this.ctx.count = this.uiAvatarOverflowOutletCount
    if (this.vcr.length === 0 && this.template) this.vcr.createEmbeddedView(this.template, this.ctx)
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

export interface AvatarOverflowContext {
  $implicit: number
  count: number
}

const overflowSizeClasses: Record<AvatarSize, string> = {
  xs: 'size-4 text-xs',
  sm: 'size-6 text-xs',
  default: 'size-8 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
  '2xl': 'size-20 text-xl',
}

/**
 * React `AvatarGroup` (custom layout, not Radix): overlaps its children and, when there are
 * more than `max`, shows only `max - 1` of them plus a `+N` chip (so `max` includes the chip).
 * Children are counted from the DOM (and re-counted when they change); `total` overrides the
 * count when only a subset is projected. `overflow` replaces the `+N` chip with a template
 * that receives the hidden count (`let-count`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-avatar-group, [ui-avatar-group]',
  standalone: true,
  imports: [UiAvatarOverflowOutletDirective],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"avatar-group"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />
    @if (showOverflow()) {
      <div data-avatar-group-overflow="" [class]="overflowClass">
        @if (overflow) {
          <ng-container [uiAvatarOverflowOutlet]="overflow" [uiAvatarOverflowOutletCount]="overflowCount()" />
        } @else {
          <span class="flex size-full items-center justify-center font-medium">+{{ overflowCount() }}</span>
        }
      </div>
    }`,
})
export class UiAvatarGroupComponent implements AfterContentInit, OnChanges, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private observer?: MutationObserver
  private readonly itemCount = signal(0)
  private readonly inputs = signal<{ max?: number; total?: number }>({})

  /** Max visible avatars including the +N chip when overflowing. */
  @Input() max?: number
  @Input({ transform: booleanAttribute }) overlap = true
  @Input() size: AvatarSize = 'default'
  /** Override the total used for +N when only a subset of avatars is projected. */
  @Input() total?: number
  @Input() overflow?: TemplateRef<AvatarOverflowContext>
  @Input('class') className?: string

  private readonly count = computed(() => this.inputs().total ?? this.itemCount())
  readonly showOverflow = computed(() => {
    const max = this.inputs().max
    return max != null && this.count() > max
  })
  private readonly visibleLimit = computed(() =>
    this.showOverflow() ? Math.max((this.inputs().max ?? 0) - 1, 0) : Number.POSITIVE_INFINITY,
  )
  readonly overflowCount = computed(() => (this.showOverflow() ? this.count() - this.visibleLimit() : 0))

  get overflowClass(): string {
    return cn(
      'bg-muted ring-background relative flex shrink-0 overflow-hidden rounded-full ring-2',
      overflowSizeClasses[this.size] ?? overflowSizeClasses.default,
    )
  }

  get hostClass(): string {
    return cn('flex items-center', this.overlap ? '-space-x-2' : 'gap-1', this.className)
  }

  ngOnChanges(): void {
    this.inputs.set({ max: this.max, total: this.total })
    this.apply()
  }

  ngAfterContentInit(): void {
    this.apply()
    if (typeof MutationObserver === 'undefined') return
    this.observer = new MutationObserver(() => this.apply())
    this.observer.observe(this.el, { childList: true })
  }

  ngOnDestroy(): void {
    this.observer?.disconnect()
  }

  private items(): HTMLElement[] {
    return [...this.el.children].filter(
      (c): c is HTMLElement => c instanceof HTMLElement && !c.hasAttribute('data-avatar-group-overflow'),
    )
  }

  /** Hide children beyond the visible limit (React simply does not render them). */
  private apply(): void {
    const items = this.items()
    this.itemCount.set(items.length)
    const limit = this.visibleLimit()
    items.forEach((item, i) => {
      const hide = i >= limit
      item.toggleAttribute('hidden', hide)
      // The `hidden` attribute's UA display:none loses to the avatar's `flex` utility, so hide inline too.
      item.style.display = hide ? 'none' : ''
    })
  }
}

export { avatarVariants, avatarFallbackVariants, type AvatarVariants, type AvatarFallbackVariants }

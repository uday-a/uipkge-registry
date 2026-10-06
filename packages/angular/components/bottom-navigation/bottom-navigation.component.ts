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
  booleanAttribute,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { NgTemplateOutlet } from '@angular/common'
import { cn } from '@/lib/utils'

export interface BottomNavItem {
  /** Unique value identifying this tab. Used with value / modelValue. */
  value: string
  /** Label shown under the icon. */
  label: string
  /** Icon: SVG string, template, or text. */
  icon?: string | TemplateRef<unknown>
  /** Optional badge count or text shown on the icon. */
  badge?: string | number
  /** Link destination (renders an anchor instead of a button). */
  to?: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-bottom-navigation, [ui-bottom-navigation]',
  standalone: true,
  imports: [NgTemplateOutlet],
  host: {
    '[attr.data-slot]': '"bottom-navigation"',
    '[attr.data-uipkge]': '""',
    '[attr.data-fixed]': "fixed ? '' : null",
    role: 'navigation',
    '[attr.aria-label]': '"Bottom navigation"',
    '[class]': 'hostClass',
  },
  template: `
    @if (showIndicator) {
      <span
        data-slot="bottom-navigation-indicator"
        aria-hidden="true"
        class="bg-primary/10 pointer-events-none absolute top-0 left-0 z-0 rounded-full will-change-transform"
        [style.width]="indicatorStyle['width']"
        [style.height]="indicatorStyle['height']"
        [style.transform]="indicatorStyle['transform']"
        [style.opacity]="indicatorStyle['opacity']"
        [style.transition]="indicatorStyle['transition']"
      ></span>
    }
    @for (item of items; track item.value) {
      @if (item.to) {
        <a
          [href]="item.to"
          data-slot="bottom-navigation-item"
          [attr.data-active]="isActive(item) ? '' : null"
          [attr.aria-current]="isActive(item) ? 'page' : null"
          [class]="itemClass(item)"
          (click)="onSelect(item)"
        >
          <span data-slot="bottom-navigation-icon" class="relative flex items-center justify-center">
            @if (isSvg(item.icon)) {
              <span
                class="flex size-5 items-center justify-center transition-transform duration-200 motion-reduce:transition-none [&>svg,&>lucide-icon>svg]:size-5"
                [class.scale-110]="isActive(item)"
                [innerHTML]="sanitize(item.icon)"
                aria-hidden="true"
              ></span>
            } @else if (isTemplate(item.icon)) {
              <ng-container [ngTemplateOutlet]="item.icon" />
            } @else {
              <span
                class="flex size-5 items-center justify-center transition-transform duration-200 motion-reduce:transition-none"
                [class.scale-110]="isActive(item)"
                aria-hidden="true"
                >{{ item.icon ?? '●' }}</span
              >
            }
            @if (item.badge !== undefined && item.badge !== '') {
              <span
                data-slot="bottom-navigation-badge"
                class="bg-destructive text-destructive-foreground absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full px-1 text-xs leading-4 font-medium"
              >
                {{ item.badge }}
              </span>
            }
          </span>
          <span
            data-slot="bottom-navigation-label"
            [class]="labelClass(item)"
          >
            {{ item.label }}
          </span>
        </a>
      } @else {
        <button
          type="button"
          data-slot="bottom-navigation-item"
          [attr.data-active]="isActive(item) ? '' : null"
          [attr.aria-current]="isActive(item) ? 'page' : null"
          [class]="itemClass(item)"
          (click)="onSelect(item)"
        >
          <span data-slot="bottom-navigation-icon" class="relative flex items-center justify-center">
            @if (isSvg(item.icon)) {
              <span
                class="flex size-5 items-center justify-center transition-transform duration-200 motion-reduce:transition-none [&>svg,&>lucide-icon>svg]:size-5"
                [class.scale-110]="isActive(item)"
                [innerHTML]="sanitize(item.icon)"
                aria-hidden="true"
              ></span>
            } @else if (isTemplate(item.icon)) {
              <ng-container [ngTemplateOutlet]="item.icon" />
            } @else {
              <span
                class="flex size-5 items-center justify-center transition-transform duration-200 motion-reduce:transition-none"
                [class.scale-110]="isActive(item)"
                aria-hidden="true"
                >{{ item.icon ?? '●' }}</span
              >
            }
            @if (item.badge !== undefined && item.badge !== '') {
              <span
                data-slot="bottom-navigation-badge"
                class="bg-destructive text-destructive-foreground absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full px-1 text-xs leading-4 font-medium"
              >
                {{ item.badge }}
              </span>
            }
          </span>
          <span
            data-slot="bottom-navigation-label"
            [class]="labelClass(item)"
          >
            {{ item.label }}
          </span>
        </button>
      }
    }
  `,
})
export class UiBottomNavigationComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() items: BottomNavItem[] = []
  @Input() value?: string
  @Input() defaultValue = ''
  @Input() modelValue = ''
  @Input() activeColor = 'text-primary'
  @Input({ transform: booleanAttribute }) fixed = true
  @Input({ transform: booleanAttribute }) showIndicator = true
  @Input({ transform: booleanAttribute }) safeArea = true
  @Input('class') className?: string

  @Output() valueChange = new EventEmitter<string>()
  @Output() onValueChange = new EventEmitter<string>()
  @Output() modelValueChange = new EventEmitter<string>()
  @Output() select = new EventEmitter<BottomNavItem>()

  private ro: ResizeObserver | null = null
  private firstPosition = true
  private prevItemsKey = ''
  private readonly sanitizer: DomSanitizer | null = null
  private readonly el: ElementRef<HTMLElement> | null = null

  constructor() {
    try {
      this.sanitizer = inject(DomSanitizer, { optional: true })
    } catch {}
    try {
      this.el = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
    } catch {}
  }

  private sanitizedCache = new Map<string, SafeHtml>()
  indicatorStyle: Record<string, string> = { opacity: '0' }

  get resolvedValue(): string {
    if (this.value !== undefined) return this.value
    if (this.modelValue !== '') return this.modelValue
    return this.defaultValue
  }

  get hostClass(): string {
    return cn(
      'border-border bg-background/95 z-50 flex items-stretch justify-around border-t backdrop-blur-sm',
      this.fixed ? 'fixed inset-x-0 bottom-0' : 'relative',
      this.safeArea && 'pb-[env(safe-area-inset-bottom)]',
      this.className,
    )
  }

  isActive(item: BottomNavItem): boolean {
    return this.resolvedValue === item.value
  }

  itemClass(item: BottomNavItem): string {
    return cn(
      'focus-visible:ring-ring/50 relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] motion-reduce:transition-none',
      this.isActive(item) ? this.activeColor : 'text-muted-foreground hover:text-foreground',
    )
  }

  labelClass(item: BottomNavItem): string {
    return cn(
      'max-w-full truncate px-1 transition-[opacity,font-weight] duration-200 motion-reduce:transition-none',
      this.isActive(item) ? 'font-medium' : 'font-normal',
    )
  }

  onSelect(item: BottomNavItem): void {
    this.modelValue = item.value
    this.value = item.value
    this.valueChange.emit(item.value)
    this.onValueChange.emit(item.value)
    this.modelValueChange.emit(item.value)
    this.select.emit(item)
    queueMicrotask(() => this.updateIndicator())
  }

  isSvg(val: unknown): boolean {
    return typeof val === 'string' && val.includes('<svg')
  }

  isTemplate(val: unknown): boolean {
    return val instanceof TemplateRef
  }

  sanitize(svg: string): SafeHtml | string {
    if (!this.sanitizer) return svg
    let safe = this.sanitizedCache.get(svg)
    if (!safe) {
      safe = this.sanitizer.bypassSecurityTrustHtml(svg)
      this.sanitizedCache.set(svg, safe)
    }
    return safe
  }

  ngAfterViewInit(): void {
    this.updateIndicator()
    if (this.el && typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.updateIndicator())
      const root = this.el.nativeElement
      this.ro.observe(root)
      root.querySelectorAll('[data-slot="bottom-navigation-item"]').forEach((el) => this.ro?.observe(el))
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Track item identity so layout swaps remount without a false slide (React parity).
    if (changes['items']) {
      const key = this.items.map((i) => i.value).join('\0')
      if (key !== this.prevItemsKey) {
        this.prevItemsKey = key
        this.firstPosition = true
      }
    }
    if (changes['showIndicator']) this.firstPosition = true
    if (changes['value'] || changes['modelValue'] || changes['items'] || changes['showIndicator']) {
      queueMicrotask(() => this.updateIndicator())
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect()
    this.ro = null
  }

  private motionSafeTransition(): string {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'none'
    }
    return this.firstPosition
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
  }

  private updateIndicator(): void {
    if (!this.showIndicator || !this.el) {
      this.indicatorStyle = { opacity: '0' }
      return
    }
    const root = this.el.nativeElement
    const activeItem = root.querySelector<HTMLElement>('[data-slot="bottom-navigation-item"][data-active]')
    if (!activeItem) {
      this.indicatorStyle = { opacity: '0' }
      return
    }

    const iconWrap = activeItem.querySelector<HTMLElement>('[data-slot="bottom-navigation-icon"]') ?? activeItem
    const rootRect = root.getBoundingClientRect()
    const iconRect = iconWrap.getBoundingClientRect()

    const padX = 14
    const pillH = 32
    const pillW = Math.max(iconRect.width + padX * 2, 56)
    const left = iconRect.left - rootRect.left + root.scrollLeft + (iconRect.width - pillW) / 2
    const top = iconRect.top - rootRect.top + root.scrollTop + (iconRect.height - pillH) / 2
    const transition = this.motionSafeTransition()

    this.indicatorStyle = {
      width: `${pillW}px`,
      height: `${pillH}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: '1',
      transition,
    }
    this.firstPosition = false
  }
}

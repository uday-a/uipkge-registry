import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  booleanAttribute,
  forwardRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { resolveScrollSpyColor } from './scroll-spy.types'
import type {
  RegisteredItem,
  ScrollSpyColor,
  ScrollSpyIndicatorMode,
  ScrollSpyItem,
  ScrollSpyLineWidth,
  ScrollSpyPosition,
  ScrollSpyRailPosition,
  ScrollSpyTurn,
  ScrollSpyVariant,
} from './scroll-spy.types'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-spy-title, [ui-scroll-spy-title]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"scroll-spy-title"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiScrollSpyTitleComponent {
  @Input('class') className?: string

  readonly root: UiScrollSpyComponent | null = null

  constructor() {
    try {
      this.root = inject(
        forwardRef(() => UiScrollSpyComponent),
        { optional: true },
      )
    } catch {}
  }

  get hostClass(): string {
    const isRightRail = this.root?.position === 'left' && this.root?.resolvedRailPosition === 'right'
    return cn(
      'scroll-spy-title text-foreground mb-3 text-sm font-semibold tracking-tight',
      isRightRail && 'pr-3 text-right',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-spy-list, [ui-scroll-spy-list]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"scroll-spy-list"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[style.borderLeftWidth]': 'leftBorderWidth',
    '[style.borderRightWidth]': 'rightBorderWidth',
  },
  template: `<ng-content />`,
})
export class UiScrollSpyListComponent {
  @Input('class') className?: string

  readonly root: UiScrollSpyComponent | null = null
  readonly el: ElementRef<HTMLElement> | null = null

  constructor() {
    try {
      this.root = inject(
        forwardRef(() => UiScrollSpyComponent),
        { optional: true },
      )
    } catch {}
    try {
      this.el = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
    } catch {}
  }

  get isStraight(): boolean {
    return this.root?.resolvedTurn === 'straight'
  }

  get isRightRail(): boolean {
    return this.root?.position === 'left' && this.root?.resolvedRailPosition === 'right'
  }

  get leftBorderWidth(): string | undefined {
    return this.isStraight && !this.isRightRail ? `${this.root?.resolvedLineWidth ?? 2.5}px` : undefined
  }

  get rightBorderWidth(): string | undefined {
    return this.isStraight && this.isRightRail ? `${this.root?.resolvedLineWidth ?? 2.5}px` : undefined
  }

  get hostClass(): string {
    return cn(
      'scroll-spy-list relative flex flex-col space-y-1 text-sm',
      this.isStraight && (this.isRightRail ? 'border-border border-r' : 'border-border border-l'),
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-spy-item, [ui-scroll-spy-item]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"scroll-spy-item"',
    '[attr.data-uipkge]': '""',
    '[attr.data-depth]': 'depth',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiScrollSpyItemComponent implements OnInit, OnDestroy {
  @Input() value = ''
  @Input() title?: string
  @Input() depth = 1
  @Input('class') className?: string

  readonly root: UiScrollSpyComponent | null = null
  readonly el: ElementRef<HTMLElement> | null = null

  constructor() {
    try {
      this.root = inject(
        forwardRef(() => UiScrollSpyComponent),
        { optional: true },
      )
    } catch {}
    try {
      this.el = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
    } catch {}
  }

  ngOnInit(): void {
    if (this.root && this.value) {
      this.root.registerItem({
        value: this.value,
        depth: this.depth,
        el: this.el?.nativeElement ?? null,
        title: this.title,
      })
    }
  }

  ngOnDestroy(): void {
    if (this.root && this.value) {
      this.root.unregisterItem(this.value)
    }
  }

  get hostClass(): string {
    return cn('scroll-spy-item relative flex flex-col', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-spy-link, [ui-scroll-spy-link]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"scroll-spy-link"',
    '[attr.data-uipkge]': '""',
    '[attr.data-active]': 'resolvedActive ? "true" : "false"',
    '[attr.data-parent-active]': 'resolvedParentActive ? "true" : "false"',
    '[attr.data-scrolled]': 'resolvedScrolled ? "true" : "false"',
    '[attr.data-depth]': 'depth',
    '[class]': 'hostClass',
    '[style.borderLeftWidth]': 'borderLeftWidth',
    '[style.borderRightWidth]': 'borderRightWidth',
    '[style.marginLeft]': 'marginLeft',
    '[style.marginRight]': 'marginRight',
  },
  template: `
    <a
      [href]="href"
      (click)="onClick($event)"
      [attr.aria-current]="resolvedActive ? 'location' : null"
      class="focus-visible:ring-ring block truncate leading-snug no-underline transition-colors duration-150 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {{ title }}<ng-content />
    </a>
  `,
})
export class UiScrollSpyLinkComponent {
  @Input() href = ''
  @Input() title?: string
  @Input() depth = 1
  @Input({ transform: booleanAttribute }) active = false
  @Input({ transform: booleanAttribute }) scrolled = false
  @Input('class') className?: string

  readonly root: UiScrollSpyComponent | null = null

  constructor() {
    try {
      this.root = inject(
        forwardRef(() => UiScrollSpyComponent),
        { optional: true },
      )
    } catch {}
  }

  get resolvedActive(): boolean {
    return this.active || (this.root ? this.root.isItemActive(this.href) : false)
  }

  get resolvedParentActive(): boolean {
    return this.root ? this.root.isItemParentActive(this.href) : false
  }

  get resolvedScrolled(): boolean {
    return this.scrolled || (this.root ? this.root.isItemScrolled(this.href) : false)
  }

  get isLeftWithRightRail(): boolean {
    return this.root?.position === 'left' && this.root?.resolvedRailPosition === 'right'
  }

  get isCircuit(): boolean {
    return this.root?.resolvedTurn !== 'straight'
  }

  get hasIndicatorBar(): boolean {
    return this.root?.resolvedTurn === 'straight' && (this.root?.indicator !== 'segment' || this.root?.keepScrolled)
  }

  get borderLeftWidth(): string | undefined {
    if (
      !this.isCircuit &&
      !this.hasIndicatorBar &&
      (this.resolvedActive || this.resolvedParentActive || this.resolvedScrolled)
    ) {
      return this.isLeftWithRightRail ? undefined : `${this.root?.resolvedLineWidth ?? 2.5}px`
    }
    return undefined
  }

  get borderRightWidth(): string | undefined {
    if (
      !this.isCircuit &&
      !this.hasIndicatorBar &&
      (this.resolvedActive || this.resolvedParentActive || this.resolvedScrolled)
    ) {
      return this.isLeftWithRightRail ? `${this.root?.resolvedLineWidth ?? 2.5}px` : undefined
    }
    return undefined
  }

  get marginLeft(): string | undefined {
    if (
      !this.isCircuit &&
      !this.hasIndicatorBar &&
      (this.resolvedActive || this.resolvedParentActive || this.resolvedScrolled)
    ) {
      return this.isLeftWithRightRail ? undefined : `-${this.root?.resolvedLineWidth ?? 2.5}px`
    }
    return undefined
  }

  get marginRight(): string | undefined {
    if (
      !this.isCircuit &&
      !this.hasIndicatorBar &&
      (this.resolvedActive || this.resolvedParentActive || this.resolvedScrolled)
    ) {
      return this.isLeftWithRightRail ? `-${this.root?.resolvedLineWidth ?? 2.5}px` : undefined
    }
    return undefined
  }

  get hostClass(): string {
    const handleColor = resolveScrollSpyColor(this.root?.color ?? 'primary')
    const borderActiveClass = this.hasIndicatorBar
      ? this.resolvedActive || this.resolvedParentActive
        ? 'text-foreground font-medium'
        : this.resolvedScrolled
          ? 'text-foreground/85'
          : 'text-muted-foreground hover:text-foreground'
      : this.resolvedActive
        ? cn(handleColor.borderClass, 'text-foreground font-medium')
        : this.resolvedParentActive
          ? 'border-border/50 text-foreground font-medium'
          : this.resolvedScrolled
            ? 'border-border/70 text-foreground/85'
            : 'text-muted-foreground hover:border-foreground/40 hover:text-foreground'

    return cn(
      'scroll-spy-link group block rounded-none leading-snug no-underline transition-[color,border-color,background-color,opacity,border-width,margin] duration-200 ease-out',
      this.isCircuit
        ? [
            'py-1',
            this.isLeftWithRightRail
              ? [
                  'text-right',
                  this.depth <= 1 && 'pr-4 pl-2 text-sm',
                  this.depth === 2 && 'pr-7 pl-2 text-xs',
                  this.depth === 3 && 'pr-10 pl-2 text-xs',
                  this.depth >= 4 && 'pr-12 pl-2 text-xs',
                ]
              : [
                  this.depth <= 1 && 'pr-2 pl-4 text-sm',
                  this.depth === 2 && 'pr-2 pl-7 text-xs',
                  this.depth === 3 && 'pr-2 pl-10 text-xs',
                  this.depth >= 4 && 'pr-2 pl-12 text-xs',
                ],
            this.resolvedActive || this.resolvedParentActive
              ? 'text-foreground font-medium'
              : this.resolvedScrolled
                ? 'text-foreground/85'
                : 'text-muted-foreground hover:text-foreground',
          ]
        : this.isLeftWithRightRail
          ? [
              '-mr-px border-r border-transparent py-0.5 pr-3 pl-2 text-right',
              this.depth <= 1 && 'text-sm',
              this.depth === 2 && 'pr-6 text-xs',
              this.depth === 3 && 'pr-9 text-xs',
              this.depth >= 4 && 'pr-12 text-xs',
              borderActiveClass,
            ]
          : [
              '-ml-px border-l border-transparent py-0.5 pr-2 pl-3 text-left',
              this.depth <= 1 && 'text-sm',
              this.depth === 2 && 'pl-6 text-xs',
              this.depth === 3 && 'pl-9 text-xs',
              this.depth >= 4 && 'pl-12 text-xs',
              borderActiveClass,
            ],
      this.className,
    )
  }

  onClick(e: MouseEvent): void {
    if (this.root && this.href) {
      e.preventDefault()
      this.root.scrollToHref(this.href)
    }
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-spy-indicator, [ui-scroll-spy-indicator]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"scroll-spy-indicator"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    @if (root && root.resolvedTurn !== 'straight') {
      <svg class="absolute inset-0 size-full overflow-visible" fill="none">
        <path
          [attr.d]="trackPath"
          class="stroke-border"
          [attr.stroke-width]="root.resolvedLineWidth"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        @if (trackPath && activeEnd > 0) {
          <path
            [attr.d]="trackPath"
            [class]="handleStroke"
            [attr.stroke-width]="root.resolvedLineWidth"
            stroke-linecap="round"
            stroke-linejoin="round"
            [style.strokeDasharray]="activeEnd - activeStart + ' ' + pathLength"
            [style.strokeDashoffset]="-activeStart"
          />
        }
      </svg>
    } @else if (root && root.resolvedTurn === 'straight' && (root.indicator !== 'segment' || root.keepScrolled)) {
      <div
        class="pointer-events-none absolute transition-[top,height] duration-200 ease-out"
        [class]="handleBg"
        [style.width.px]="root.resolvedLineWidth"
        [style.left.px]="isRightRail ? null : -root.resolvedLineWidth"
        [style.right.px]="isRightRail ? -root.resolvedLineWidth : null"
        [style.top.px]="highlightTop"
        [style.height.px]="highlightHeight"
      ></div>
    }
  `,
})
export class UiScrollSpyIndicatorComponent {
  @Input() color?: ScrollSpyColor
  @Input('class') className?: string

  trackPath = ''
  pathLength = 0
  activeStart = 0
  activeEnd = 0
  highlightTop = 0
  highlightHeight = 0

  readonly root: UiScrollSpyComponent | null = null

  constructor() {
    try {
      this.root = inject(
        forwardRef(() => UiScrollSpyComponent),
        { optional: true },
      )
    } catch {}
  }

  get isRightRail(): boolean {
    return this.root?.position === 'left' && this.root?.resolvedRailPosition === 'right'
  }

  get handleBg(): string {
    return resolveScrollSpyColor(this.color ?? this.root?.color ?? 'primary').bgClass
  }

  get handleStroke(): string {
    return resolveScrollSpyColor(this.color ?? this.root?.color ?? 'primary').strokeClass
  }

  get hostClass(): string {
    return cn('scroll-spy-indicator pointer-events-none absolute inset-0 overflow-visible', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-spy-stepper, [ui-scroll-spy-stepper]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'slotName',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    @if (root && root.position === 'bottom') {
      <button
        type="button"
        aria-label="Previous section"
        [disabled]="activeIndex <= 0"
        class="text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:ring-ring flex size-7 items-center justify-center rounded-full transition-[color,background-color,box-shadow,opacity,scale] outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-95 disabled:pointer-events-none disabled:opacity-25"
        (click)="root.goToPrev()"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <div class="flex items-center gap-1.5 px-1">
        @for (item of root.items; track item.href ?? item.value; let idx = $index) {
          <button
            type="button"
            [attr.aria-label]="'Jump to section ' + (idx + 1)"
            class="focus-visible:ring-ring h-1.5 cursor-pointer rounded-full transition-[width,background-color,box-shadow] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            [class.bg-primary]="idx === activeIndex"
            [class.w-5]="idx === activeIndex"
            [class.bg-primary/40]="idx < activeIndex"
            [class.hover:bg-primary/60]="idx < activeIndex"
            [class.w-2]="idx !== activeIndex"
            [class.bg-muted-foreground/30]="idx > activeIndex"
            [class.hover:bg-muted-foreground/50]="idx > activeIndex"
            (click)="root.scrollToHref(item.href ?? item.value ?? '')"
          ></button>
        }
      </div>

      <div class="border-border/60 flex items-center gap-2 border-l pl-2">
        <span class="text-foreground max-w-[130px] truncate text-xs font-medium tracking-tight">
          {{ activeTitle }}
        </span>
        <span class="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
          {{ Math.round(rootProgress * 100) }}%
        </span>
      </div>

      <button
        type="button"
        aria-label="Next section"
        [disabled]="activeIndex >= root.items.length - 1"
        class="text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:ring-ring flex size-7 items-center justify-center rounded-full transition-[color,background-color,box-shadow,opacity,scale] outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-95 disabled:pointer-events-none disabled:opacity-25"
        (click)="root.goToNext()"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    } @else if (root && isScrollSpy) {
      @for (item of root.items; track item.href ?? item.value; let idx = $index) {
        <button
          type="button"
          [attr.data-active]="idx === activeIndex ? 'true' : 'false'"
          class="group focus-visible:ring-ring relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-[color,background-color,box-shadow,scale] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]"
          [class.bg-primary/10]="idx === activeIndex"
          [class.text-primary]="idx === activeIndex"
          [class.font-semibold]="idx === activeIndex"
          [class.shadow-2xs]="idx === activeIndex"
          [class.text-muted-foreground]="idx !== activeIndex"
          [class.hover:bg-muted/50]="idx !== activeIndex"
          [class.hover:text-foreground]="idx !== activeIndex"
          (click)="root.scrollToHref(item.href ?? item.value ?? '')"
        >
          @if (idx === activeIndex) {
            <span class="bg-primary animate-in fade-in zoom-in-75 size-1.5 shrink-0 rounded-full duration-150"></span>
          }
          <span class="truncate">{{ item.title || (item.href ?? item.value ?? '') }}</span>
        </button>
      }
      <div class="bg-border/20 absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl">
        <div
          class="bg-primary h-full transition-[width] duration-150 ease-out"
          [style.width.%]="Math.round(rootProgress * 100)"
        ></div>
      </div>
    } @else if (root) {
      @for (item of root.items; track item.href ?? item.value; let idx = $index) {
        <button
          type="button"
          [attr.data-active]="idx === activeIndex ? 'true' : 'false'"
          class="group focus-visible:ring-ring flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-[color,background-color,scale] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]"
          [class.bg-primary/10]="idx === activeIndex"
          [class.text-foreground]="idx === activeIndex"
          [class.font-medium]="idx === activeIndex"
          [class.shadow-2xs]="idx === activeIndex"
          [class.text-foreground/80]="idx < activeIndex"
          [class.hover:bg-muted/50]="idx < activeIndex"
          [class.text-muted-foreground]="idx > activeIndex"
          [class.hover:bg-muted/30]="idx > activeIndex"
          [class.hover:text-foreground]="idx > activeIndex"
          (click)="root.scrollToHref(item.href ?? item.value ?? '')"
        >
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] transition-[color,background-color,box-shadow,scale] duration-200"
            [class.bg-primary]="idx === activeIndex"
            [class.text-primary-foreground]="idx === activeIndex"
            [class.scale-105]="idx === activeIndex"
            [class.font-semibold]="idx === activeIndex"
            [class.shadow-2xs]="idx === activeIndex"
            [class.bg-primary/15]="idx < activeIndex"
            [class.text-primary]="idx < activeIndex"
            [class.font-medium]="idx < activeIndex"
            [class.bg-muted]="idx > activeIndex"
            [class.text-muted-foreground/70]="idx > activeIndex"
          >
            @if (idx < activeIndex) {
              <svg class="size-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            } @else {
              {{ idx + 1 }}
            }
          </span>
          <span class="max-w-[120px] truncate">{{ item.title || (item.href ?? item.value ?? '') }}</span>
        </button>
        @if (idx < root.items.length - 1) {
          <div
            class="bg-border/70 h-0.5 max-w-10 min-w-4 flex-1 rounded-full transition-colors duration-200"
            [class.bg-primary]="idx < activeIndex"
          ></div>
        }
      }
    }
  `,
})
export class UiScrollSpyStepperComponent {
  @Input('class') className?: string

  Math = Math

  readonly root: UiScrollSpyComponent | null = null

  constructor() {
    try {
      this.root = inject(
        forwardRef(() => UiScrollSpyComponent),
        { optional: true },
      )
    } catch {}
  }

  get isScrollSpy(): boolean {
    return (
      this.root?.variant === 'scrollspy' ||
      this.root?.variant === 'tabs' ||
      this.root?.variant === 'pills' ||
      this.root?.indicator === 'pill' ||
      this.root?.indicator === 'dot'
    )
  }

  get slotName(): string {
    if (this.root?.position === 'bottom') return 'scroll-spy-stepper-bottom'
    return this.isScrollSpy ? 'scroll-spy-top' : 'scroll-spy-stepper-top'
  }

  get activeIndex(): number {
    if (!this.root || !this.root.items) return 0
    const val = this.root.modelValue.replace(/^#/, '')
    const idx = this.root.items.findIndex((i) => (i.href ?? i.value ?? '').replace(/^#/, '') === val)
    return idx >= 0 ? idx : 0
  }

  get activeTitle(): string {
    return this.root?.items?.[this.activeIndex]?.title ?? ''
  }

  get rootProgress(): number {
    return this.root?.currentProgress ?? 0
  }

  get hostClass(): string {
    if (this.root?.position === 'bottom') {
      return cn(
        'border-border/80 bg-background/95 sticky bottom-3 z-30 mx-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-md backdrop-blur-md select-none',
        this.className,
      )
    }
    if (this.isScrollSpy) {
      return cn(
        'border-border/70 bg-card/85 relative sticky top-0 z-20 flex w-full scrollbar-none items-center gap-1 overflow-x-auto rounded-xl border p-1.5 shadow-xs backdrop-blur-md',
        this.className,
      )
    }
    return cn(
      'border-border/70 bg-card/85 sticky top-0 z-20 flex w-full scrollbar-none items-center gap-1.5 overflow-x-auto rounded-xl border p-2 shadow-xs backdrop-blur-md',
      this.className,
    )
  }
}

/**
 * Angular port of UIPKGE ScrollSpy. In-page navigation list where the active
 * item highlights as the user scrolls through anchored sections. Root +
 * title/list/item/link/indicator/stepper parts mirror the Vue file splits;
 * intersection observation is plain inputs/outputs at the consumer level.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-spy, [ui-scroll-spy]',
  standalone: true,
  imports: [
    UiScrollSpyTitleComponent,
    UiScrollSpyListComponent,
    UiScrollSpyItemComponent,
    UiScrollSpyLinkComponent,
    UiScrollSpyIndicatorComponent,
    UiScrollSpyStepperComponent,
  ],
  host: {
    '[attr.data-slot]': '"scroll-spy"',
    '[attr.data-uipkge]': '""',
    '[attr.data-position]': 'resolvedPosition',
    '[attr.data-rail-position]': 'resolvedRailPosition',
    '[attr.data-variant]': 'resolvedVariant',
    '[attr.data-turn]': 'resolvedTurn',
    '[attr.data-indicator]': 'indicator',
    '[attr.data-keep-scrolled]': 'keepScrolled ? "true" : null',
    '[attr.data-highlight-parent]': 'highlightParent ? "true" : null',
    '[attr.data-line-width]': 'lineWidth',
    '[attr.data-color]': 'color',
    '[class]': 'hostClass',
    '[style.top.px]': 'affix && resolvedPosition !== "bottom" ? offsetTop : null',
  },
  template: `
    @if (items && items.length > 0) {
      @if (resolvedPosition === 'top') {
        <ui-scroll-spy-stepper />
      } @else if (resolvedPosition !== 'bottom') {
        @if (title) {
          <ui-scroll-spy-title>{{ title }}</ui-scroll-spy-title>
        }
        <ui-scroll-spy-list>
          <ui-scroll-spy-indicator [color]="color" />
          @for (item of items; track item.href ?? item.value ?? $index; let itemIdx = $index) {
            <ui-scroll-spy-item
              [value]="item.href ?? item.value ?? ''"
              [depth]="item.depth ?? 1"
              [class]="itemIdx > 0 && items[itemIdx - 1]?.children?.length ? 'mt-2' : undefined"
            >
              <ui-scroll-spy-link
                [href]="item.href ?? item.value ?? ''"
                [title]="item.title"
                [depth]="item.depth ?? 1"
              />
            </ui-scroll-spy-item>
            @for (child of item.children ?? []; track child.href ?? child.value ?? $index; let childIdx = $index) {
              <ui-scroll-spy-item
                [value]="child.href ?? child.value ?? ''"
                [depth]="child.depth ?? 2"
                [class]="
                  childIdx === 0 || (childIdx > 0 && item.children?.[childIdx - 1]?.children?.length)
                    ? 'mt-2'
                    : undefined
                "
              >
                <ui-scroll-spy-link
                  [href]="child.href ?? child.value ?? ''"
                  [title]="child.title"
                  [depth]="child.depth ?? 2"
                />
              </ui-scroll-spy-item>
              @for (
                grandchild of child.children ?? [];
                track grandchild.href ?? grandchild.value ?? $index;
                let gIdx = $index
              ) {
                <ui-scroll-spy-item
                  [value]="grandchild.href ?? grandchild.value ?? ''"
                  [depth]="grandchild.depth ?? 3"
                  [class]="gIdx === 0 ? 'mt-2' : undefined"
                >
                  <ui-scroll-spy-link
                    [href]="grandchild.href ?? grandchild.value ?? ''"
                    [title]="grandchild.title"
                    [depth]="grandchild.depth ?? 3"
                  />
                </ui-scroll-spy-item>
              }
            }
          }
        </ui-scroll-spy-list>
      }
      @if (resolvedPosition === 'bottom') {
        <ui-scroll-spy-stepper />
      }
    } @else {
      <ng-content />
    }
  `,
})
export class UiScrollSpyComponent implements OnInit, OnDestroy {
  @Input() modelValue = ''
  @Output() modelValueChange = new EventEmitter<string>()
  @Output() change = new EventEmitter<string>()
  @Output() progress = new EventEmitter<number>()
  @Input() items: ScrollSpyItem[] = []
  @Input() title?: string
  @Input() offsetTop = 0
  @Input() bounds = 5
  @Input() scrollContainer?: HTMLElement | string | null
  @Input({ transform: booleanAttribute }) affix = false
  @Input() variant?: ScrollSpyVariant
  @Input() turn?: ScrollSpyTurn
  @Input() indicator: ScrollSpyIndicatorMode = 'line'
  @Input({ transform: booleanAttribute }) keepScrolled = false
  @Input({ transform: booleanAttribute }) highlightParent = true
  @Input() lineWidth: ScrollSpyLineWidth = 'default'
  @Input() color: ScrollSpyColor = 'primary'
  @Input() position: ScrollSpyPosition = 'right'
  @Input() railPosition?: ScrollSpyRailPosition
  private _className?: string
  @Input('class') set classAttr(v: string | undefined) {
    this._className = v
  }
  @Input() set className(v: string | undefined) {
    this._className = v
  }
  get className(): string | undefined {
    return this._className
  }

  registered: RegisteredItem[] = []
  scrolledValues = new Set<string>()
  currentProgress = 0

  private scrollHandler = () => this.onScroll()
  private containerEl: HTMLElement | Window | null = null

  private readonly el: ElementRef<HTMLElement> | null = null

  constructor() {
    try {
      this.el = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
    } catch {}
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.initContainer()
      if (this.items.length > 0 && !this.modelValue) {
        this.modelValue = this.items[0]?.href ?? this.items[0]?.value ?? ''
      }
    }
  }

  ngOnDestroy(): void {
    if (this.containerEl) {
      this.containerEl.removeEventListener('scroll', this.scrollHandler)
    }
  }

  private initContainer(): void {
    if (typeof window === 'undefined') return
    if (typeof this.scrollContainer === 'string') {
      this.containerEl = document.querySelector(this.scrollContainer) as HTMLElement | null
    } else if (this.scrollContainer instanceof HTMLElement) {
      this.containerEl = this.scrollContainer
    } else {
      this.containerEl = window
    }
    if (this.containerEl) {
      this.containerEl.addEventListener('scroll', this.scrollHandler, { passive: true })
    }
  }

  private onScroll(): void {
    const allItems = this.getAllItems()
    if (allItems.length === 0) return

    let current = allItems[0]?.href ?? allItems[0]?.value ?? ''
    const offset = this.offsetTop + this.bounds + 20

    for (const item of allItems) {
      const id = (item.href ?? item.value ?? '').replace(/^#/, '')
      const el = document.getElementById(id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= offset) {
          current = item.href ?? item.value ?? ''
        }
      }
    }

    if (current && current !== this.modelValue) {
      this.setActive(current)
    }
  }

  getAllItems(): ScrollSpyItem[] {
    const list: ScrollSpyItem[] = []
    const walk = (items: ScrollSpyItem[]) => {
      for (const item of items) {
        list.push(item)
        if (item.children) walk(item.children)
      }
    }
    walk(this.items)
    return list
  }

  get resolvedPosition(): ScrollSpyPosition {
    return this.position ?? 'right'
  }

  get resolvedRailPosition(): ScrollSpyRailPosition {
    if (this.railPosition) return this.railPosition
    return this.position === 'left' ? 'right' : 'left'
  }

  get resolvedTurn(): ScrollSpyTurn {
    if (this.turn) return this.turn
    if (this.variant === 'angle' || this.variant === 'rounded') return 'rounded'
    if (this.variant === 'sharp') return 'sharp'
    if (this.variant === 'line' || this.variant === 'default') return 'straight'
    return 'straight'
  }

  get resolvedVariant(): ScrollSpyVariant {
    if (this.variant) return this.variant
    if (this.turn === 'sharp') return 'angle'
    if (this.turn === 'rounded') return 'rounded'
    if (this.position === 'top' || this.position === 'bottom') return 'stepper'
    return 'line'
  }

  get resolvedLineWidth(): number {
    if (typeof this.lineWidth === 'number') return this.lineWidth
    return this.lineWidth === 'thin' ? 1.5 : this.lineWidth === 'thick' ? 3.5 : 2.5
  }

  get handleColor(): string {
    return resolveScrollSpyColor(this.color).borderClass
  }

  get hostClass(): string {
    const isTopOrBottom = this.resolvedPosition === 'top' || this.resolvedPosition === 'bottom'
    return cn(
      'relative flex text-sm',
      isTopOrBottom ? 'w-full flex-col' : 'flex-col',
      this.affix && (this.resolvedPosition === 'bottom' ? 'sticky bottom-4' : 'sticky'),
      this.className,
    )
  }

  registerItem(item: RegisteredItem): void {
    if (!this.registered.some((i) => i.value === item.value)) this.registered.push(item)
  }

  unregisterItem(value: string): void {
    this.registered = this.registered.filter((i) => i.value !== value)
  }

  normalize(href: string): string {
    return href.replace(/^#/, '')
  }

  isItemActive(href: string): boolean {
    return this.normalize(href) === this.normalize(this.modelValue)
  }

  isItemParentActive(href: string): boolean {
    if (!this.highlightParent || this.isItemActive(href)) return this.isItemActive(href)
    return this.registered.some((i) => this.isItemActive(i.value) && i.value.startsWith(this.normalize(href)))
  }

  isItemScrolled(href: string): boolean {
    return this.scrolledValues.has(this.normalize(href))
  }

  setActive(value: string): void {
    this.modelValue = value
    this.modelValueChange.emit(value)
    this.change.emit(value)
  }

  markScrolled(value: string, done = true): void {
    const key = this.normalize(value)
    if (done) this.scrolledValues.add(key)
    else this.scrolledValues.delete(key)
  }

  reportProgress(value: number): void {
    const p = Math.min(1, Math.max(0, value))
    this.currentProgress = p
    this.progress.emit(p)
  }

  scrollToHref(href: string): void {
    this.setActive(href)
    const id = this.normalize(href)
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  goToPrev(): void {
    const items = this.getAllItems()
    const idx = items.findIndex((i) => this.normalize(i.href ?? i.value ?? '') === this.normalize(this.modelValue))
    if (idx > 0) {
      this.scrollToHref(items[idx - 1]!.href ?? items[idx - 1]!.value ?? '')
    }
  }

  goToNext(): void {
    const items = this.getAllItems()
    const idx = items.findIndex((i) => this.normalize(i.href ?? i.value ?? '') === this.normalize(this.modelValue))
    if (idx >= 0 && idx < items.length - 1) {
      this.scrollToHref(items[idx + 1]!.href ?? items[idx + 1]!.value ?? '')
    }
  }
}

export * from './scroll-spy.types'

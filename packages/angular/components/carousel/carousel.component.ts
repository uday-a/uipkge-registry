import {
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button/button.component'
import {
  carouselItemVariants,
  carouselVariants,
  type CarouselItemVariants,
  type CarouselVariants,
} from './carousel.variants'

export type CarouselOrientation = NonNullable<CarouselVariants['orientation']>
export type CarouselItemOrientation = NonNullable<CarouselItemVariants['orientation']>

export interface CarouselOptions {
  loop?: boolean
  axis?: 'x' | 'y'
}

/** Angular port of UIPKGE Carousel. Native CSS scroll-snap scroller with prev/next + indicators. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel, [ui-carousel]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"region"',
    '[attr.aria-roledescription]': '"carousel"',
    '[attr.aria-label]': '"Carousel"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCarouselComponent {
  @Input() modelValue = 0
  @Input() orientation: CarouselOrientation = 'horizontal'
  @Input({ transform: booleanAttribute }) loop = false
  @Input() opts?: CarouselOptions
  @Input('class') className?: string

  @Output() modelValueChange = new EventEmitter<number>()

  activeIndex = 0
  itemCount = 0

  get isLoop(): boolean {
    return this.loop || !!this.opts?.loop
  }

  get hostClass(): string {
    return cn('block', carouselVariants({ orientation: this.orientation }), this.className)
  }

  get isHorizontal(): boolean {
    return this.orientation !== 'vertical'
  }

  scrollTo(index: number): void {
    const max = Math.max(0, this.itemCount - 1)
    let next = Math.max(0, Math.min(max, index))
    if (this.isLoop && this.itemCount > 0) {
      next = ((index % this.itemCount) + this.itemCount) % this.itemCount
    }
    this.activeIndex = next
    this.modelValueChange.emit(next)
  }

  scrollToPrev(): void {
    this.scrollTo(this.activeIndex - 1)
  }

  scrollToNext(): void {
    this.scrollTo(this.activeIndex + 1)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel-content, [ui-carousel-content]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel-content"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    '[attr.aria-orientation]': 'resolvedOrientation',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCarouselContentComponent {
  private carousel?: UiCarouselComponent

  constructor() {
    try {
      this.carousel = inject(UiCarouselComponent, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input() orientation?: CarouselOrientation
  @Input('class') className?: string

  get resolvedOrientation(): CarouselOrientation {
    return this.orientation ?? this.carousel?.orientation ?? 'horizontal'
  }

  get hostClass(): string {
    return cn(
      this.resolvedOrientation !== 'vertical'
        ? 'flex overflow-x-auto scroll-smooth snap-x snap-mandatory'
        : 'flex flex-col overflow-y-auto snap-y snap-mandatory',
      'relative h-full w-full',
      '[scrollbar-width:none] [-ms-overflow-style:none]',
      '[&::-webkit-scrollbar]:hidden',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel-item, [ui-carousel-item]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel-item"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    '[attr.aria-roledescription]': '"slide"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCarouselItemComponent {
  private carousel?: UiCarouselComponent

  constructor() {
    try {
      this.carousel = inject(UiCarouselComponent, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input() orientation?: CarouselItemOrientation
  @Input('class') className?: string

  get resolvedOrientation(): CarouselItemOrientation {
    return this.orientation ?? this.carousel?.orientation ?? 'horizontal'
  }

  get hostClass(): string {
    return cn(
      carouselItemVariants({ orientation: this.resolvedOrientation }),
      'shrink-0 grow-0 basis-full',
      'snap-start',
      'relative',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel-header, [ui-carousel-header]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel-header"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCarouselHeaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex items-center justify-between px-1 pb-2', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel-footer, [ui-carousel-footer]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel-footer"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCarouselFooterComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex items-center justify-between px-1 pt-2', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel-indicators, [ui-carousel-indicators]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel-indicators"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"tablist"',
    '[attr.aria-label]': '"Carousel navigation"',
    '[class]': 'hostClass',
  },
  template: `
    @for (_ of dots; track $index) {
      <button
        type="button"
        role="tab"
        [attr.aria-label]="'Go to slide ' + ($index + 1)"
        [attr.aria-selected]="$index === resolvedActiveIndex"
        [class]="dotClass($index)"
        (click)="onDotClick($index)"
      ></button>
    }
  `,
})
export class UiCarouselIndicatorsComponent {
  private carousel?: UiCarouselComponent

  constructor() {
    try {
      this.carousel = inject(UiCarouselComponent, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input() count = 0
  @Input() activeIndex = 0
  @Input('class') className?: string

  @Output() goTo = new EventEmitter<number>()

  get resolvedActiveIndex(): number {
    return this.carousel?.activeIndex ?? this.activeIndex
  }

  get resolvedCount(): number {
    return this.count || this.carousel?.itemCount || 0
  }

  get dots(): unknown[] {
    return Array.from({ length: this.resolvedCount })
  }

  get hostClass(): string {
    return cn('flex items-center justify-center gap-1.5 py-2', this.className)
  }

  dotClass(index: number): string {
    return cn(
      'h-2 w-2 rounded-full transition-colors duration-200',
      index === this.resolvedActiveIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
    )
  }

  onDotClick(index: number): void {
    this.carousel?.scrollTo(index)
    this.goTo.emit(index)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel-previous, [ui-carousel-previous]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel-previous"',
    '[attr.data-uipkge]': '""',
    '[attr.type]': '"button"',
    '[attr.aria-label]': 'label',
    '[attr.disabled]': 'disabled ? "" : null',
    '[class]': 'hostClass',
    '(click)': 'onClick()',
  },
  template: `<ng-content
    ><svg
      class="size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" /></svg
  ></ng-content>`,
})
export class UiCarouselPreviousComponent {
  private carousel?: UiCarouselComponent

  constructor() {
    try {
      this.carousel = inject(UiCarouselComponent, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input() label = 'Previous slide'
  @Input() orientation?: CarouselOrientation
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  @Output() prev = new EventEmitter<void>()

  get resolvedOrientation(): CarouselOrientation {
    return this.orientation ?? this.carousel?.orientation ?? 'horizontal'
  }

  get hostClass(): string {
    // buttonVariants(outline, icon) first, like React/Vue render a real Button: cn() lets the
    // size-8 / rounded-full / bg-background/80 overrides below win via tailwind-merge.
    return cn(
      buttonVariants({ variant: 'outline', size: 'icon' }),
      'absolute z-10 size-8 shrink-0 rounded-full',
      'bg-background/80 border shadow-md backdrop-blur-sm',
      'hover:bg-accent hover:text-accent-foreground',
      'disabled:pointer-events-none disabled:opacity-50',
      this.resolvedOrientation !== 'vertical'
        ? 'top-1/2 -left-3 -translate-y-1/2'
        : '-top-3 left-1/2 -translate-x-1/2 rotate-90',
      this.className,
    )
  }

  onClick(): void {
    this.carousel?.scrollToPrev()
    this.prev.emit()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-carousel-next, [ui-carousel-next]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"carousel-next"',
    '[attr.data-uipkge]': '""',
    '[attr.type]': '"button"',
    '[attr.aria-label]': 'label',
    '[attr.disabled]': 'disabled ? "" : null',
    '[class]': 'hostClass',
    '(click)': 'onClick()',
  },
  template: `<ng-content
    ><svg
      class="size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" /></svg
  ></ng-content>`,
})
export class UiCarouselNextComponent {
  private carousel?: UiCarouselComponent

  constructor() {
    try {
      this.carousel = inject(UiCarouselComponent, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input() label = 'Next slide'
  @Input() orientation?: CarouselOrientation
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  @Output() next = new EventEmitter<void>()

  get resolvedOrientation(): CarouselOrientation {
    return this.orientation ?? this.carousel?.orientation ?? 'horizontal'
  }

  get hostClass(): string {
    // buttonVariants(outline, icon) first, like React/Vue render a real Button: cn() lets the
    // size-8 / rounded-full / bg-background/80 overrides below win via tailwind-merge.
    return cn(
      buttonVariants({ variant: 'outline', size: 'icon' }),
      'absolute z-10 size-8 shrink-0 rounded-full',
      'bg-background/80 border shadow-md backdrop-blur-sm',
      'hover:bg-accent hover:text-accent-foreground',
      'disabled:pointer-events-none disabled:opacity-50',
      this.resolvedOrientation !== 'vertical'
        ? 'top-1/2 -right-3 -translate-y-1/2'
        : '-bottom-3 left-1/2 -translate-x-1/2 rotate-90',
      this.className,
    )
  }

  onClick(): void {
    this.carousel?.scrollToNext()
    this.next.emit()
  }
}

export { carouselItemVariants, carouselVariants, type CarouselItemVariants, type CarouselVariants }

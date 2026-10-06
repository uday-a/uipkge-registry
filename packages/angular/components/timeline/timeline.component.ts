import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { timelineMediaVariants, type TimelineMediaVariant, type TimelineMediaVariantsProps } from './timeline.variants'

// Copied verbatim from the React timeline (injected there as a global <style> by TimelineItem).
// Unscoped (ViewEncapsulation.None) so it reaches the markers; Angular adds it once.
const TIMELINE_MOTION_STYLES = `
@keyframes timeline-item-enter {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes timeline-current-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--primary) 45%, transparent); }
  50% { box-shadow: 0 0 0 6px color-mix(in oklab, var(--primary) 0%, transparent); }
}
[data-slot='timeline-item'].timeline-item-enter {
  animation: timeline-item-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--timeline-stagger, 0ms);
}
[data-slot='timeline-item'].timeline-item-current [data-slot='timeline-media-marker'],
[data-slot='timeline-item'].timeline-item-current [data-slot='timeline-separator-marker'] {
  animation: timeline-current-pulse 1.8s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='timeline-item'].timeline-item-enter,
  [data-slot='timeline-item'].timeline-item-current [data-slot='timeline-media-marker'],
  [data-slot='timeline-item'].timeline-item-current [data-slot='timeline-separator-marker'] {
    animation: none !important;
  }
}
`

export type TimelineDirection = 'vertical' | 'horizontal'
export type TimelineAlign = 'start' | 'center'
export type TimelineSide = 'left' | 'right' | 'top' | 'bottom'
export type TimelineStatus = 'default' | 'current' | 'success' | 'warning' | 'error' | 'info' | 'muted'
export type TimelineDensity = 'compact' | 'default' | 'comfortable'
export type TimelineMediaStatus = NonNullable<TimelineMediaVariantsProps['status']>
export type TimelineLineStyle = 'solid' | 'dashed' | 'dotted'
export type TimelineTitleAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'

/** React `TimelineItemRenderProps`, read from `#item="uiTimelineItem"` in Angular. */
export interface TimelineItemRenderProps {
  index: number
  isLast: boolean
  side: TimelineSide
  status: TimelineStatus
}

/**
 * Angular port of UIPKGE Timeline (React `Timeline`). The root provides direction / align /
 * side / density to its items, which register themselves (in DOM order) so each item knows
 * its index and whether it is the last one: that drives the alternating sides of
 * `align="center"`, the row spacing (none after the last row) and the connector lines (none
 * below the last marker). Class strings, data attributes and motion CSS match React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline, [ui-timeline]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline"',
    '[attr.data-direction]': 'direction',
    '[attr.data-align]': 'align',
    // `align` is consumed like the React prop: a leftover HTML align="center" would center the text.
    '[attr.align]': 'null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTimelineComponent {
  @Input() direction: TimelineDirection = 'vertical'
  @Input() align: TimelineAlign = 'start'
  @Input() side?: TimelineSide
  @Input() density: TimelineDensity = 'default'
  @Input('class') className?: string

  /** Registered items in DOM order (signal: registration happens outside template events). */
  readonly items = signal<UiTimelineItemComponent[]>([])
  private sortQueued = false

  /** Explicit side wins, else top for horizontal / left for vertical. */
  get resolvedSide(): TimelineSide {
    return this.side ?? (this.direction === 'horizontal' ? 'top' : 'left')
  }

  register(item: UiTimelineItemComponent): void {
    this.items.update((prev) => (prev.includes(item) ? prev : [...prev, item]))
    this.queueSort()
  }

  unregister(item: UiTimelineItemComponent): void {
    this.items.update((prev) => prev.filter((i) => i !== item))
  }

  indexOf(item: UiTimelineItemComponent): number {
    return this.items().indexOf(item)
  }

  /** Items register on creation, before projection places them; re-sort once they are in the DOM. */
  private queueSort(): void {
    if (this.sortQueued) return
    this.sortQueued = true
    queueMicrotask(() => {
      this.sortQueued = false
      const prev = this.items()
      const sorted = [...prev].sort((a, b) =>
        a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      )
      if (sorted.some((item, i) => item !== prev[i])) this.items.set(sorted)
    })
  }

  get hostClass(): string {
    return cn('relative', this.direction === 'vertical' ? 'flex flex-col' : 'flex flex-row', this.className)
  }
}

const VERTICAL_SPACING: Record<TimelineDensity, string> = {
  compact: '[&>[data-slot=timeline-content]]:pb-2',
  default: '[&>[data-slot=timeline-content]]:pb-6',
  comfortable: '[&>[data-slot=timeline-content]]:pb-10',
}

const HORIZONTAL_SPACING: Record<TimelineDensity, string> = {
  compact: '[&>[data-slot=timeline-content]]:pr-3',
  default: '[&>[data-slot=timeline-content]]:pr-6',
  comfortable: '[&>[data-slot=timeline-content]]:pr-10',
}

/**
 * React `TimelineItem`. Reads index / last / side from the root; `status` tints its media
 * marker and `current` pulses it. React passes render props to a function child; in Angular
 * read them from the exported instance: `<div ui-timeline-item #item="uiTimelineItem">
 * {{ item.index() }} {{ item.isLast() }}</div>`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-item, [ui-timeline-item]',
  exportAs: 'uiTimelineItem',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [TIMELINE_MOTION_STYLES],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-item"',
    '[attr.data-side]': 'effectiveSide',
    '[attr.data-status]': 'status',
    '[attr.data-last]': 'isLast() || null',
    '[style.--timeline-stagger]': 'stagger',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTimelineItemComponent {
  readonly timeline = inject(UiTimelineComponent, { optional: true })
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  @Input() side?: TimelineSide
  @Input() status: TimelineStatus = 'default'
  @Input('class') className?: string

  readonly index = computed(() => (this.timeline ? this.timeline.items().indexOf(this) : 0))
  readonly isLast = computed(() => (this.timeline ? this.index() === this.timeline.items().length - 1 : false))

  constructor() {
    if (!this.timeline) return
    this.timeline.register(this)
    inject(DestroyRef).onDestroy(() => this.timeline!.unregister(this))
  }

  get isFirst(): boolean {
    return this.index() === 0
  }

  get direction(): TimelineDirection {
    return this.timeline?.direction ?? 'vertical'
  }

  get density(): TimelineDensity {
    return this.timeline?.density ?? 'default'
  }

  get effectiveSide(): TimelineSide {
    if (this.side) return this.side
    const t = this.timeline
    if (!t) return 'left'
    if (t.align === 'center') {
      const even = this.index() % 2 === 0
      if (t.direction === 'vertical') return even ? 'left' : 'right'
      return even ? 'top' : 'bottom'
    }
    return t.resolvedSide
  }

  /** Render props (React `TimelineItemRenderProps`). */
  get renderProps(): TimelineItemRenderProps {
    return { index: this.index(), isLast: this.isLast(), side: this.effectiveSide, status: this.status }
  }

  get stagger(): string {
    return `${Math.min(this.index(), 12) * 55}ms`
  }

  get hostClass(): string {
    const direction = this.direction
    const isCenter = this.timeline?.align === 'center'
    const side = this.effectiveSide
    const last = this.isLast()
    const verticalSpacing = last ? '' : VERTICAL_SPACING[this.density]
    const horizontalSpacing = last ? '' : HORIZONTAL_SPACING[this.density]
    return cn(
      'timeline-item-enter relative',
      this.status === 'current' && 'timeline-item-current',
      !isCenter &&
        direction === 'vertical' &&
        cn('flex gap-4', side === 'right' && 'flex-row-reverse text-right', verticalSpacing),
      !isCenter &&
        direction === 'horizontal' &&
        cn('flex flex-col gap-2', side === 'bottom' && 'flex-col-reverse', horizontalSpacing),
      isCenter &&
        direction === 'vertical' &&
        cn(
          'grid grid-cols-[1fr_auto_1fr] items-start gap-x-4',
          '[&>[data-slot=timeline-media]]:col-start-2 [&>[data-slot=timeline-media]]:row-start-1',
          '[&>[data-slot=timeline-separator]]:col-start-2 [&>[data-slot=timeline-separator]]:row-start-1',
          '[&>[data-slot=timeline-content]]:row-start-1',
          side === 'left' && '[&>[data-slot=timeline-content]]:col-start-1 [&>[data-slot=timeline-content]]:text-right',
          side === 'right' && '[&>[data-slot=timeline-content]]:col-start-3',
          verticalSpacing,
        ),
      isCenter &&
        direction === 'horizontal' &&
        cn(
          'grid grid-rows-[1fr_auto_1fr] items-start gap-y-2',
          '[&>[data-slot=timeline-media]]:col-start-1 [&>[data-slot=timeline-media]]:row-start-2',
          '[&>[data-slot=timeline-separator]]:col-start-1 [&>[data-slot=timeline-separator]]:row-start-2',
          '[&>[data-slot=timeline-content]]:col-start-1',
          side === 'top' && '[&>[data-slot=timeline-content]]:row-start-1 [&>[data-slot=timeline-content]]:self-end',
          side === 'bottom' && '[&>[data-slot=timeline-content]]:row-start-3',
          horizontalSpacing,
        ),
      this.className,
    )
  }
}

const COLORED_CONNECTOR: Record<TimelineStatus, string> = {
  default: 'bg-primary',
  current: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info',
  muted: 'bg-muted-foreground/40',
}

/**
 * React `TimelineMedia`: the marker (dot / icon / avatar / outline, tinted by its own `status`
 * or the item's) plus the connector line to the next item, hidden on the last item or with
 * `hideConnector`. `coloredConnector` tints the line by status; `lineStyle` dashes / dots it.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-media, [ui-timeline-media]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-media"',
    '[attr.data-variant]': 'variant',
    '[class]': 'hostClass',
  },
  template: `<div data-uipkge="" data-slot="timeline-media-marker" [class]="markerClass"><ng-content /></div>
    @if (showConnector) {
      <div data-uipkge="" data-slot="timeline-media-connector" aria-hidden="true" [class]="connectorClass"></div>
    }`,
})
export class UiTimelineMediaComponent {
  private readonly item = inject(UiTimelineItemComponent, { optional: true })

  @Input() variant: TimelineMediaVariant = 'dot'
  @Input() status?: TimelineStatus
  /** Manually hide the auto-generated connector line. */
  @Input({ transform: booleanAttribute }) hideConnector = false
  /** Color the connector by the item's status instead of the neutral border. */
  @Input({ transform: booleanAttribute }) coloredConnector = false
  @Input() lineStyle: TimelineLineStyle = 'solid'
  @Input('class') className?: string

  get direction(): TimelineDirection {
    return this.item?.direction ?? 'vertical'
  }

  get effectiveStatus(): TimelineStatus {
    return this.status ?? this.item?.status ?? 'default'
  }

  get showConnector(): boolean {
    return !this.hideConnector && !(this.item?.isLast() ?? true)
  }

  get hostClass(): string {
    return cn(
      'relative flex shrink-0 items-center',
      this.direction === 'vertical' ? 'flex-col self-stretch' : 'flex-row items-center self-stretch',
      this.className,
    )
  }

  get markerClass(): string {
    return cn(
      timelineMediaVariants({ variant: this.variant, status: this.effectiveStatus }),
      this.direction === 'vertical' && this.variant === 'dot' && 'mt-1',
    )
  }

  private get connectorBgClass(): string {
    const vertical = this.direction === 'vertical'
    if (this.lineStyle === 'dashed') {
      return vertical
        ? 'border-l-2 border-dashed border-border bg-transparent w-0'
        : 'border-t-2 border-dashed border-border bg-transparent h-0'
    }
    if (this.lineStyle === 'dotted') {
      return vertical
        ? 'border-l-2 border-dotted border-border bg-transparent w-0'
        : 'border-t-2 border-dotted border-border bg-transparent h-0'
    }
    return this.coloredConnector ? COLORED_CONNECTOR[this.effectiveStatus] : 'bg-border'
  }

  get connectorClass(): string {
    return cn(this.direction === 'vertical' ? 'my-1 w-px flex-1' : 'mx-1 h-px flex-1', this.connectorBgClass)
  }
}

/**
 * React `TimelineSeparator`: a primary ring marker with an inner dot plus the connector line.
 * Replace the inner dot (React `dot` prop) by projecting an element with `slot="dot"`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-separator, [ui-timeline-separator]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-separator"',
    '[class]': 'hostClass',
  },
  template: `<div
      data-slot="timeline-separator-marker"
      class="bg-primary ring-background relative z-10 flex size-4 items-center justify-center rounded-full shadow-2xs ring-4"
    >
      <ng-content select="[slot=dot]"><div class="bg-primary-foreground size-1.5 rounded-full"></div></ng-content>
    </div>
    @if (showConnector) {
      <div aria-hidden="true" data-slot="timeline-media-connector" [class]="connectorClass"></div>
    }`,
})
export class UiTimelineSeparatorComponent {
  private readonly item = inject(UiTimelineItemComponent, { optional: true })

  /** Manually hide the auto-generated connector line. */
  @Input({ transform: booleanAttribute }) hideConnector = false
  @Input('class') className?: string

  get direction(): TimelineDirection {
    return this.item?.direction ?? 'vertical'
  }

  get showConnector(): boolean {
    return !this.hideConnector && !(this.item?.isLast() ?? true)
  }

  get hostClass(): string {
    return cn(
      'relative flex shrink-0 items-center',
      this.direction === 'vertical' ? 'w-4 flex-col self-stretch' : 'h-4 flex-row items-center self-stretch',
      this.className,
    )
  }

  get connectorClass(): string {
    return cn('bg-border', this.direction === 'vertical' ? 'my-1.5 w-0.5 flex-1' : 'mx-1.5 h-0.5 flex-1')
  }
}

/** React `TimelineContent` (a `<div>`). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-content, [ui-timeline-content]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-content"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTimelineContentComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block flex-1 space-y-1', this.className)
  }
}

/** React `TimelineHeader` (a flex row: title + date / badge). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-header, [ui-timeline-header]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-header"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTimelineHeaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-wrap items-center justify-between gap-2', this.className)
  }
}

/**
 * React `TimelineTitle` renders an `<h3>` (or the `as` element). Put it on a heading
 * (`<h3 ui-timeline-title>`) for the native element; the `<ui-timeline-title>` custom element
 * gets heading semantics via role="heading" + aria-level from `as`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-title, [ui-timeline-title]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-title"',
    '[attr.role]': 'ariaLevel ? "heading" : null',
    '[attr.aria-level]': 'ariaLevel',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTimelineTitleComponent {
  private readonly isCustom = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'UI-TIMELINE-TITLE'
  @Input() as: TimelineTitleAs = 'h3'
  @Input('class') className?: string

  get ariaLevel(): number | null {
    return this.isCustom && this.as !== 'div' ? Number(this.as.slice(1)) : null
  }

  get hostClass(): string {
    return cn('block text-sm leading-none font-semibold tracking-tight', this.className)
  }
}

/** React `TimelineDescription` (a `<p>`). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-description, [ui-timeline-description]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-description"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTimelineDescriptionComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block text-muted-foreground text-sm', this.className)
  }
}

/** React `TimelineDate` (an inline `<time>`; use `<time ui-timeline-date>` for the native element). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-timeline-date, [ui-timeline-date]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"timeline-date"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTimelineDateComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-muted-foreground text-xs', this.className)
  }
}

export { timelineMediaVariants, type TimelineMediaVariant, type TimelineMediaVariantsProps }

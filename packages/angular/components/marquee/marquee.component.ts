import {
  AfterViewInit,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChildren,
  ViewEncapsulation,
  QueryList,
  booleanAttribute,
  inject,
  numberAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'
import { cn } from '@/lib/utils'

// Copied verbatim from the React marquee (injected there as a global <style>). Unscoped
// (ViewEncapsulation.None) so the inline animationName resolves the @keyframes.
const MARQUEE_MOTION_STYLES = `
@keyframes uipkge-marquee-x {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes uipkge-marquee-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='marquee-track'] {
    animation: none !important;
  }
}
`

/**
 * Marks the repeated content of a marquee: `<ng-template uiMarqueeItem>…</ng-template>`. Each
 * track stamps a live copy of it (React renders `children` once per track). Plain projected
 * content also works: it fills the first track and the others get static DOM clones.
 */
@Directive({ selector: 'ng-template[uiMarqueeItem]', standalone: true })
export class UiMarqueeItemDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef)
}

/**
 * Continuously auto-scrolling content (React `Marquee`): horizontal or vertical, configurable
 * speed / gap / repeat, pause on hover or hard pause. The content is repeated `repeat` times
 * (copies 2..n aria-hidden) for a seamless loop.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-marquee, [ui-marquee]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [MARQUEE_MOTION_STYLES],
  imports: [UiRenderTemplateDirective],
  host: {
    'data-uipkge': '',
    'data-slot': 'marquee',
    role: 'region',
    'aria-roledescription': 'marquee',
    '[attr.data-orientation]': 'orientation',
    '[attr.data-direction]': 'direction',
    '[class]': 'hostClass',
    '[style.--marquee-gap]': 'gap + "px"',
  },
  template: `
    @for (i of tracks; track i) {
      <div
        #track
        data-slot="marquee-track"
        [class]="trackClass"
        [style]="trackStyle"
        [attr.aria-hidden]="i > 0 ? 'true' : null"
      >
        @if (item) {
          <ng-container [uiRenderTemplate]="item.templateRef" />
        } @else if (i === 0) {
          <ng-content />
        }
      </div>
    }
  `,
})
export class UiMarqueeComponent implements AfterViewInit, OnDestroy {
  /** Scroll axis. */
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal'
  /** Travel direction. */
  @Input() direction: 'left' | 'right' | 'up' | 'down' = 'left'
  /** Animation duration in seconds. Lower = faster. */
  @Input({ transform: numberAttribute }) speed = 20
  /** Pause the animation on hover. */
  @Input({ transform: booleanAttribute }) pauseOnHover = false
  /** Gap between repeated content groups (px). */
  @Input({ transform: numberAttribute }) gap = 16
  /** Number of times the content is duplicated for a seamless loop. */
  @Input({ transform: numberAttribute }) repeat = 2
  /** Hard pause the animation. */
  @Input({ transform: booleanAttribute }) paused = false
  @Input('class') className?: string

  @ContentChild(UiMarqueeItemDirective) item?: UiMarqueeItemDirective
  @ViewChildren('track') private trackEls!: QueryList<ElementRef<HTMLElement>>
  private observer?: MutationObserver

  get isVertical(): boolean {
    return this.orientation === 'vertical'
  }

  get tracks(): number[] {
    return Array.from({ length: Math.max(0, this.repeat) }, (_, i) => i)
  }

  get hostClass(): string {
    return cn(
      'group flex overflow-hidden',
      this.isVertical ? 'flex-col' : 'flex-row',
      this.pauseOnHover ? 'hover:[&>[data-slot=marquee-track]]:[animation-play-state:paused]' : '',
      this.className,
    )
  }

  get trackClass(): string {
    return cn(
      'flex shrink-0',
      this.isVertical ? 'flex-col' : 'flex-row',
      this.paused ? '![animation-play-state:paused]' : '',
    )
  }

  get trackStyle(): Record<string, string> {
    const reverse = this.direction === 'right' || this.direction === 'down'
    return {
      gap: 'var(--marquee-gap)',
      'animation-name': this.isVertical ? 'uipkge-marquee-y' : 'uipkge-marquee-x',
      'animation-duration': `${this.speed}s`,
      'animation-timing-function': 'linear',
      'animation-iteration-count': 'infinite',
      'animation-direction': reverse ? 'reverse' : 'normal',
    }
  }

  ngAfterViewInit(): void {
    if (this.item) return
    // Plain projected content: mirror track 0 into the aria-hidden copies, and keep them in sync.
    this.syncClones()
    this.trackEls.changes.subscribe(() => this.syncClones())
    const first = this.trackEls.first?.nativeElement
    if (first && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.syncClones())
      this.observer.observe(first, { childList: true, subtree: true, characterData: true, attributes: true })
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect()
  }

  private syncClones(): void {
    const [first, ...rest] = this.trackEls.map((t) => t.nativeElement)
    if (!first) return
    for (const el of rest) el.replaceChildren(...Array.from(first.childNodes, (n) => n.cloneNode(true)))
  }
}

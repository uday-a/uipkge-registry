import {
  type AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  type OnDestroy,
  Output,
  booleanAttribute,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { afterExitAnimation, uniqueId } from '@/ui/popper/popper'

/**
 * Angular port of UIPKGE Collapsible with Radix behaviour. Root and Trigger are
 * directives so they can sit on an existing element -- the `asChild` equivalent
 * (`<li ui-sidebar-menu-item ui-collapsible [defaultOpen]="true">`). The trigger
 * toggles, carries aria-expanded / aria-controls / data-state (and type="button" on
 * native buttons). Content is hidden with its children unmounted while
 * closed (kept through a data-state exit animation, like Radix Presence), and exposes
 * --radix-collapsible-content-height / -width (plus the --reka-* aliases) for height
 * animations.
 */
@Directive({
  selector: 'ui-collapsible, [ui-collapsible]',
  standalone: true,
  exportAs: 'uiCollapsible',
  host: {
    '[attr.data-slot]': '"collapsible"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    '[attr.data-disabled]': 'disabled ? "" : null',
  },
})
export class UiCollapsibleComponent {
  @Input() set open(v: boolean | undefined) {
    this._controlled.set(v)
  }
  get open(): boolean | undefined {
    return this._controlled()
  }
  @Input({ transform: booleanAttribute }) defaultOpen = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('collapsible-content')
  private readonly _open = signal<boolean | null>(null)
  private readonly _controlled = signal<boolean | undefined>(undefined)

  get isOpen(): boolean {
    const controlled = this._controlled()
    if (controlled !== undefined) return controlled
    return this._open() ?? this.defaultOpen
  }

  setOpen(value: boolean): void {
    if (this.disabled || value === this.isOpen) return
    this._open.set(value)
    this.openChange.emit(value)
  }

  toggle(): void {
    this.setOpen(!this.isOpen)
  }
}

@Directive({
  selector: 'ui-collapsible-trigger, [ui-collapsible-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.aria-expanded]': 'collapsible.isOpen',
    '[attr.aria-controls]': 'collapsible.contentId',
    '[attr.data-state]': 'collapsible.isOpen ? "open" : "closed"',
    '[attr.data-disabled]': 'collapsible.disabled ? "" : null',
    // Radix renders <button type="button">; an explicit type on the host (or ui-button's) wins.
    '[attr.type]': 'defaultType ? "button" : null',
    '(click)': 'collapsible.toggle()',
  },
})
export class UiCollapsibleTriggerComponent {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'collapsible-trigger'
  readonly collapsible = inject(UiCollapsibleComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly defaultType =
    this.el.tagName === 'BUTTON' && !this.el.hasAttribute('type') && !this.el.hasAttribute('ui-button')
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-collapsible-content, [ui-collapsible-content]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"collapsible-content"',
    '[attr.data-uipkge]': '""',
    '[attr.id]': 'collapsible.contentId',
    '[attr.data-state]': 'collapsible.isOpen ? "open" : "closed"',
    '[attr.data-disabled]': 'collapsible.disabled ? "" : null',
    '[attr.hidden]': 'shown ? null : ""',
    '[style.--radix-collapsible-content-height]': 'size().height',
    '[style.--radix-collapsible-content-width]': 'size().width',
    '[style.--reka-collapsible-content-height]': 'size().height',
    '[style.--reka-collapsible-content-width]': 'size().width',
    '[class]': 'hostClass',
  },
  template: `@if (shown) {
    <ng-content />
  }`,
})
export class UiCollapsibleContentComponent implements AfterViewInit, OnDestroy {
  readonly collapsible = inject(UiCollapsibleComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input({ transform: booleanAttribute }) forceMount = false
  @Input('class') className?: string

  /** Measured open size, exposed as CSS vars (null until first measured). */
  readonly size = signal<{ height: string | null; width: string | null }>({ height: null, width: null })
  /** True while the closing exit animation plays (Radix Presence). */
  private readonly exiting = signal(false)
  private wasOpen: boolean | null = null
  private viewReady = false
  private destroyed = false

  constructor() {
    // Re-measure on every open, and keep the content present through its exit animation.
    effect(() => {
      const open = this.collapsible.isOpen
      if (this.wasOpen === null) {
        this.wasOpen = open
        return
      }
      if (open === this.wasOpen) return
      this.wasOpen = open
      if (open) {
        this.exiting.set(false)
        queueMicrotask(() => this.measure(false))
      } else {
        this.exiting.set(true)
        queueMicrotask(async () => {
          await afterExitAnimation(this.el)
          if (!this.destroyed && !this.collapsible.isOpen) this.exiting.set(false)
        })
      }
    })
  }

  /** Radix: open, animating out, or force-mounted. */
  get shown(): boolean {
    return this.collapsible.isOpen || this.exiting() || this.forceMount
  }

  ngAfterViewInit(): void {
    this.viewReady = true
    // The initially-open content is measured without playing its mount animation.
    if (this.collapsible.isOpen) this.measure(true)
  }

  private measure(initial: boolean): void {
    if (!this.viewReady || this.destroyed || typeof getComputedStyle === 'undefined') return
    const node = this.el
    const style = node.style
    const prev = { transitionDuration: style.transitionDuration, animationName: style.animationName }
    // Block any animation so the full size is measured.
    style.transitionDuration = '0s'
    style.animationName = 'none'
    const rect = node.getBoundingClientRect()
    this.size.set({ height: `${rect.height}px`, width: `${rect.width}px` })
    if (!initial) {
      style.transitionDuration = prev.transitionDuration
      style.animationName = prev.animationName
    } else {
      // Keep the mount animation blocked for the first paint, then restore.
      const restore = () => {
        style.transitionDuration = prev.transitionDuration
        style.animationName = prev.animationName
      }
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(restore)
      else restore()
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true
  }

  get hostClass(): string {
    return cn('block', this.className)
  }
}

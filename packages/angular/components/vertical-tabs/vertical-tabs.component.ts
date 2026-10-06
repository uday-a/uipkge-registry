import {
  type AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  type OnChanges,
  type OnDestroy,
  Output,
  type SimpleChanges,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export type VerticalTabsActivationMode = 'automatic' | 'manual'

let idCounter = 0

/**
 * Angular port of UIPKGE VerticalTabs (React: Radix Tabs locked to `orientation="vertical"`).
 * Root holds controlled `value` / uncontrolled `defaultValue` + `valueChange`, `dir` and
 * `activationMode`. The list is a Radix roving-focus group (ArrowUp / ArrowDown, Home / End,
 * looping, disabled triggers skipped) with the React sliding `vertical-tabs-indicator`
 * (muted surface + primary rail) positioned via ResizeObserver + MutationObserver; with
 * `animated=false` the trigger paints the active chrome itself. Inactive panels are hidden and
 * unmounted unless force-mounted. DOM, aria and class strings match React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-vertical-tabs, [ui-vertical-tabs]',
  standalone: true,
  host: {
    '[attr.dir]': 'dir',
    '[attr.data-orientation]': '"vertical"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"vertical-tabs"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiVerticalTabsComponent {
  @Input('class') className?: string
  @Input() value?: string
  @Input() defaultValue?: string
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Input() activationMode: VerticalTabsActivationMode = 'automatic'
  /** Radix `onValueChange`. */
  @Output() valueChange = new EventEmitter<string>()

  readonly baseId = `vertical-tabs-${++idCounter}`
  private readonly _value = signal<string | null>(null)

  get activeValue(): string | undefined {
    if (this.value !== undefined) return this.value
    return this._value() ?? this.defaultValue
  }

  select(v: string): void {
    if (v === this.activeValue) return
    this._value.set(v)
    this.valueChange.emit(v)
  }

  triggerId(value: string): string {
    return `${this.baseId}-trigger-${value}`
  }

  contentId(value: string): string {
    return `${this.baseId}-content-${value}`
  }

  get hostClass(): string {
    return cn('flex w-full gap-6', this.className)
  }
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-vertical-tabs-list, [ui-vertical-tabs-list]',
  standalone: true,
  host: {
    '[attr.role]': '"tablist"',
    '[attr.aria-orientation]': '"vertical"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"vertical-tabs-list"',
    '[attr.data-animated]': 'animated ? "true" : "false"',
    '[class]': 'hostClass',
    // Radix RovingFocusGroup: the list is the tab stop and forwards focus to the active tab.
    '[attr.tabindex]': 'tabbingBackOut() ? -1 : 0',
    '[attr.data-orientation]': '"vertical"',
    '[attr.dir]': 'tabs.dir',
    '[style.outline]': '"none"',
    '(mousedown)': 'clickFocus = true',
    '(focus)': 'onFocus($event)',
    '(focusout)': 'tabbingBackOut.set(false)',
  },
  template: `@if (animated) {
      <span
        data-slot="vertical-tabs-indicator"
        aria-hidden="true"
        class="bg-muted pointer-events-none absolute top-0 left-0 z-0 rounded-md will-change-transform"
        [style]="indicatorStyle()"
        ><span class="bg-primary absolute inset-y-1 left-0 w-0.5 rounded-full"></span
      ></span>
    }
    <ng-content />`,
})
export class UiVerticalTabsListComponent implements AfterViewInit, OnChanges, OnDestroy {
  readonly tabs = inject(UiVerticalTabsComponent)
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input('class') className?: string
  /** Sliding active indicator (default true). When false, active chrome paints on the trigger. */
  @Input({ transform: booleanAttribute }) animated = true
  /** Radix `loop`: arrow keys wrap from the last trigger to the first. */
  @Input({ transform: booleanAttribute }) loop = true

  readonly indicatorStyle = signal<Record<string, string>>({ opacity: '0' })
  readonly tabbingBackOut = signal(false)
  /** Roving tab stop: the trigger focused last (Radix currentTabStopId). */
  readonly currentTabStop = signal<string | null>(null)
  clickFocus = false
  private firstPosition = true
  private stopObserving: (() => void) | null = null
  private viewReady = false

  get hostClass(): string {
    return cn('group/list border-border relative flex w-56 shrink-0 flex-col gap-0.5 border-r pr-3', this.className)
  }

  ngAfterViewInit(): void {
    this.viewReady = true
    this.observe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Wait for the indicator span to (un)render before measuring.
    if (this.viewReady && changes['animated']) queueMicrotask(() => this.observe())
  }

  ngOnDestroy(): void {
    this.stopObserving?.()
  }

  /** Bind observers once per `animated` flip (not per render), like React. */
  private observe(): void {
    this.stopObserving?.()
    this.stopObserving = null
    this.firstPosition = true
    if (!this.animated) {
      this.indicatorStyle.set({ opacity: '0' })
      return
    }
    this.updateIndicator()
    const root = this.el
    const triggers = () => root.querySelectorAll('[data-slot="vertical-tabs-trigger"]')
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.updateIndicator()) : null
    if (ro) {
      ro.observe(root)
      triggers().forEach((t) => ro.observe(t))
    }
    const mo =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver((mutations) => {
            if (ro && mutations.some((m) => m.type === 'childList')) triggers().forEach((t) => ro.observe(t))
            this.updateIndicator()
          })
        : null
    mo?.observe(root, { attributes: true, attributeFilter: ['data-state'], subtree: true, childList: true })
    this.stopObserving = () => {
      ro?.disconnect()
      mo?.disconnect()
    }
  }

  private transition(): string {
    const reduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || this.firstPosition) return 'none'
    return `transform 220ms ${EASE}, width 220ms ${EASE}, height 220ms ${EASE}`
  }

  updateIndicator(): void {
    if (!this.animated) return
    const root = this.el
    const active = root.querySelector<HTMLElement>('[data-slot="vertical-tabs-trigger"][data-state="active"]')
    if (!active) {
      this.indicatorStyle.set({ opacity: '0' })
      return
    }
    const listRect = root.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - listRect.left + root.scrollLeft
    const top = activeRect.top - listRect.top + root.scrollTop
    // Full active surface slides (muted pill); the primary rail is nested so it stays inset-y-1.
    this.indicatorStyle.set({
      width: `${activeRect.width}px`,
      height: `${activeRect.height}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: '1',
      transition: this.transition(),
    })
    this.firstPosition = false
  }

  /** Enabled triggers of this list, in DOM order. */
  focusableTriggers(): HTMLElement[] {
    return [...this.el.querySelectorAll<HTMLElement>('[data-slot="vertical-tabs-trigger"]')].filter(
      (t) => !t.hasAttribute('data-disabled'),
    )
  }

  /** Keyboard focus landing on the list itself moves to the active tab (then the tab stop, then the first). */
  onFocus(event: FocusEvent): void {
    const fromClick = this.clickFocus
    this.clickFocus = false
    if (event.target !== this.el || fromClick || this.tabbingBackOut()) return
    const items = this.focusableTriggers()
    const active = items.find((t) => t.getAttribute('data-state') === 'active')
    const stop = this.currentTabStop()
    const current = stop === null ? undefined : items.find((t) => t.id === this.tabs.triggerId(stop))
    ;(active ?? current ?? items[0])?.focus()
  }

  /** Radix RovingFocusGroup (vertical): ArrowUp / ArrowDown, Home / End / PageUp / PageDown. */
  onTriggerKeydown(event: KeyboardEvent, trigger: HTMLElement): void {
    if (event.key === 'Tab' && event.shiftKey) {
      this.tabbingBackOut.set(true)
      return
    }
    if (event.target !== trigger || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const key = event.key
    let intent: 'first' | 'last' | 'prev' | 'next' | null = null
    if (key === 'Home' || key === 'PageUp') intent = 'first'
    else if (key === 'End' || key === 'PageDown') intent = 'last'
    else if (key === 'ArrowUp') intent = 'prev'
    else if (key === 'ArrowDown') intent = 'next'
    if (!intent) return
    event.preventDefault()
    const items = this.focusableTriggers()
    const i = items.indexOf(trigger)
    let target: HTMLElement | undefined
    if (intent === 'first') target = items[0]
    else if (intent === 'last') target = items[items.length - 1]
    else {
      const next = intent === 'next' ? i + 1 : i - 1
      target = this.loop ? items[(next + items.length) % items.length] : items[next]
    }
    target?.focus()
  }
}

/** Non-interactive group heading inside the list (React `label` prop, rendered as the text). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-vertical-tabs-section, [ui-vertical-tabs-section]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"vertical-tabs-section"',
    '[class]': 'hostClass',
  },
  template: `{{ label }}`,
})
export class UiVerticalTabsSectionComponent {
  @Input({ required: true }) label!: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'block text-muted-foreground mt-3 mb-1 px-2 text-xs font-medium tracking-wider uppercase first:mt-0',
      this.className,
    )
  }
}

/** Use `<button ui-vertical-tabs-trigger>` (Radix renders a button); other hosts get role="tab" + tabindex. */
@Directive({
  selector: 'ui-vertical-tabs-trigger, [ui-vertical-tabs-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[attr.role]': '"tab"',
    '[attr.aria-selected]': 'isSelected',
    '[attr.aria-controls]': 'tabs.contentId(value)',
    '[attr.data-state]': 'isSelected ? "active" : "inactive"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.disabled]': 'isNativeButton && disabled ? "" : null',
    '[attr.id]': 'tabs.triggerId(value)',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.tabindex]': 'list.currentTabStop() === value ? 0 : -1',
    '[attr.data-orientation]': '"vertical"',
    '(mousedown)': 'onMousedown($event)',
    '(keydown)': 'onKeydown($event)',
    '(focus)': 'onFocus()',
  },
})
export class UiVerticalTabsTriggerComponent {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'vertical-tabs-trigger'
  readonly tabs = inject(UiVerticalTabsComponent)
  readonly list = inject(UiVerticalTabsListComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isNativeButton = this.el.tagName === 'BUTTON'
  @Input('class') className?: string
  @Input({ required: true }) value!: string
  @Input({ transform: booleanAttribute }) disabled = false

  get isSelected(): boolean {
    return this.tabs.activeValue === this.value
  }

  /** Radix selects on left mouse-down (not click); disabled tabs never take focus. */
  onMousedown(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault()
      return
    }
    this.list.currentTabStop.set(this.value)
    if (event.button === 0 && !event.ctrlKey) this.tabs.select(this.value)
    else event.preventDefault()
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.disabled && (event.key === ' ' || event.key === 'Enter')) {
      if (!this.isNativeButton) event.preventDefault()
      this.tabs.select(this.value)
      return
    }
    this.list.onTriggerKeydown(event, this.el)
  }

  onFocus(): void {
    this.list.currentTabStop.set(this.value)
    if (!this.isSelected && !this.disabled && this.tabs.activationMode !== 'manual') this.tabs.select(this.value)
  }

  get hostClass(): string {
    return cn(
      // z-10 keeps the label above the sliding indicator; static active chrome restores when
      // the list has data-animated="false" (group-data variants below).
      'group/trigger text-muted-foreground relative z-10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-[color,background-color] duration-150',
      'hover:bg-muted/60 hover:text-foreground',
      'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:text-foreground',
      'group-data-[animated=false]/list:data-[state=active]:bg-muted',
      "before:bg-primary before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:opacity-0 before:content-['']",
      'group-data-[animated=false]/list:data-[state=active]:before:opacity-100',
      '[&>svg,&>lucide-icon>svg]:size-4 [&>svg,&>lucide-icon>svg]:shrink-0',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-vertical-tabs-content, [ui-vertical-tabs-content]',
  standalone: true,
  host: {
    '[attr.data-state]': 'isSelected ? "active" : "inactive"',
    '[attr.data-orientation]': '"vertical"',
    '[attr.role]': '"tabpanel"',
    '[attr.aria-labelledby]': 'tabs.triggerId(value)',
    '[attr.hidden]': 'present ? null : ""',
    '[attr.id]': 'tabs.contentId(value)',
    '[attr.tabindex]': '0',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"vertical-tabs-content"',
    '[class]': 'hostClass',
    '[style.animation-duration]': 'mountAnimationPrevented() && isSelected ? "0s" : null',
  },
  template: `@if (present) {
    <ng-content />
  }`,
})
export class UiVerticalTabsContentComponent implements AfterViewInit {
  readonly tabs = inject(UiVerticalTabsComponent)
  @Input('class') className?: string
  @Input({ required: true }) value!: string
  @Input({ transform: booleanAttribute }) forceMount = false

  /** Radix: the tab active on first paint does not play its enter animation. */
  readonly mountAnimationPrevented = signal(true)

  get isSelected(): boolean {
    return this.tabs.activeValue === this.value
  }

  get present(): boolean {
    return this.forceMount || this.isSelected
  }

  ngAfterViewInit(): void {
    const release = () => this.mountAnimationPrevented.set(false)
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(release)
    else release()
  }

  get hostClass(): string {
    return cn(
      'block ring-offset-background focus-visible:ring-ring/50 flex-1 focus-visible:ring-2 focus-visible:outline-none',
      this.className,
    )
  }
}

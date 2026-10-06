import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { uniqueId } from '@/ui/popper/popper'
import { tabsListVariants, tabsTriggerVariants, type TabsListVariants, type TabsTriggerVariants } from './tabs.variants'

export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsListVariant = NonNullable<TabsListVariants['variant']>
export type TabsTriggerSize = NonNullable<TabsTriggerVariants['size']>
export type TabsActivationMode = 'automatic' | 'manual'

/**
 * Angular port of UIPKGE Tabs with Radix Tabs behaviour: controlled `value` or
 * uncontrolled `defaultValue` + `valueChange`, `orientation`, `dir` and
 * `activationMode` (automatic selects on focus, manual needs Enter / Space / click).
 * The list is a roving-focus group (arrows per orientation, Home / End, looping,
 * disabled triggers skipped) and renders the same sliding `tabs-indicator` span as
 * React, positioned via ResizeObserver + MutationObserver. Inactive panels are hidden
 * and unmounted unless force-mounted. Class strings match React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tabs, [ui-tabs]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"tabs"',
    '[attr.dir]': 'dir',
    '[attr.data-orientation]': 'orientation',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTabsComponent {
  @Input('class') className?: string
  @Input() value?: string
  @Input() defaultValue?: string
  @Input() orientation: TabsOrientation = 'horizontal'
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Input() activationMode: TabsActivationMode = 'automatic'
  @Output() valueChange = new EventEmitter<string>()

  readonly baseId = uniqueId('tabs')
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
    return cn('flex w-full', this.orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-2', this.className)
  }
}

const INDICATOR_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tabs-list, [ui-tabs-list]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"tabs-list"',
    '[attr.data-animated]': 'animated ? "true" : "false"',
    '[attr.role]': '"tablist"',
    '[attr.aria-orientation]': 'tabs.orientation',
    '[attr.data-orientation]': 'tabs.orientation',
    '[attr.dir]': 'tabs.dir',
    // Radix RovingFocusGroup: the list is the tab stop and forwards focus to the active tab.
    '[attr.tabindex]': 'tabbingBackOut() ? -1 : 0',
    '[class]': 'hostClass',
    '(mousedown)': 'clickFocus = true',
    '(focus)': 'onFocus($event)',
    '(focusout)': 'tabbingBackOut.set(false)',
  },
  template: `@if (animated) {
      <span data-slot="tabs-indicator" aria-hidden="true" [class]="indicatorClass" [style]="indicatorStyle()"></span>
    }
    <ng-content />`,
})
export class UiTabsListComponent implements AfterViewInit, OnChanges, OnDestroy {
  readonly tabs = inject(UiTabsComponent)
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input('class') className?: string
  @Input() variant: TabsListVariant = 'segmented'
  /** Styling orientation; defaults to the Tabs root's orientation. */
  @Input() orientation?: TabsOrientation
  /** Sliding active indicator (default true). When false, the active surface paints on the trigger. */
  @Input({ transform: booleanAttribute }) animated = true
  @Input({ transform: booleanAttribute }) loop = true

  readonly indicatorStyle = signal<Record<string, string>>({ opacity: '0' })
  readonly tabbingBackOut = signal(false)
  /** Roving tab stop: the trigger that was focused last (Radix currentTabStopId). */
  readonly currentTabStop = signal<string | null>(null)
  clickFocus = false
  private firstPosition = true
  private stopObserving: (() => void) | null = null
  private viewReady = false

  get effectiveOrientation(): TabsOrientation {
    return this.orientation ?? this.tabs.orientation
  }

  get indicatorClass(): string {
    if (this.variant === 'pill')
      return 'pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-primary shadow-xs will-change-transform'
    if (this.variant === 'underline')
      return 'pointer-events-none absolute top-0 left-0 z-0 bg-foreground will-change-transform'
    return 'pointer-events-none absolute top-0 left-0 z-0 rounded-sm bg-background shadow-xs will-change-transform'
  }

  ngAfterViewInit(): void {
    this.viewReady = true
    this.observe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewReady && (changes['animated'] || changes['variant'] || changes['orientation'])) {
      // Wait for the indicator span to (un)render before measuring.
      queueMicrotask(() => this.observe())
    }
  }

  ngOnDestroy(): void {
    this.stopObserving?.()
  }

  /** Bind observers once per animated / variant / orientation (not per render), like React. */
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
    const triggers = () => root.querySelectorAll('[data-slot="tabs-trigger"]')
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
    return `transform 220ms ${INDICATOR_EASE}, width 220ms ${INDICATOR_EASE}, height 220ms ${INDICATOR_EASE}`
  }

  updateIndicator(): void {
    if (!this.animated) return
    const root = this.el
    const active = root.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
    if (!active) {
      this.indicatorStyle.set({ opacity: '0' })
      return
    }
    const listRect = root.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - listRect.left + root.scrollLeft
    const top = activeRect.top - listRect.top + root.scrollTop
    const transition = this.transition()
    const thickness = 2
    let box: { width: number; height: number; x: number; y: number }
    if (this.variant === 'underline' && this.effectiveOrientation === 'vertical') {
      box = { width: thickness, height: activeRect.height, x: listRect.width - thickness, y: top }
    } else if (this.variant === 'underline') {
      box = { width: activeRect.width, height: thickness, x: left, y: listRect.height - thickness }
    } else {
      box = { width: activeRect.width, height: activeRect.height, x: left, y: top }
    }
    this.indicatorStyle.set({
      width: `${box.width}px`,
      height: `${box.height}px`,
      transform: `translate3d(${box.x}px, ${box.y}px, 0)`,
      opacity: '1',
      transition,
    })
    this.firstPosition = false
  }

  /** Enabled triggers of this list, in DOM order. */
  focusableTriggers(): HTMLElement[] {
    return [...this.el.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')].filter(
      (t) => t.closest('[data-slot="tabs-list"]') === this.el && !t.hasAttribute('data-disabled'),
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

  /** Radix RovingFocusGroup arrow / Home / End / PageUp / PageDown handling. */
  onTriggerKeydown(event: KeyboardEvent, trigger: HTMLElement): void {
    if (event.key === 'Tab' && event.shiftKey) {
      this.tabbingBackOut.set(true)
      return
    }
    if (event.target !== trigger || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const vertical = this.tabs.orientation === 'vertical'
    const rtl = this.tabs.dir === 'rtl'
    const key =
      !vertical && rtl ? ({ ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' }[event.key] ?? event.key) : event.key
    let intent: 'first' | 'last' | 'prev' | 'next' | null = null
    if (key === 'Home' || key === 'PageUp') intent = 'first'
    else if (key === 'End' || key === 'PageDown') intent = 'last'
    else if ((!vertical && key === 'ArrowLeft') || (vertical && key === 'ArrowUp')) intent = 'prev'
    else if ((!vertical && key === 'ArrowRight') || (vertical && key === 'ArrowDown')) intent = 'next'
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

  get hostClass(): string {
    return cn(
      'group/list relative',
      tabsListVariants({ variant: this.variant, orientation: this.effectiveOrientation }),
      this.className,
    )
  }
}

/** Use `<button ui-tabs-trigger>` (Radix renders a button); other hosts get role="tab" + tabindex. */
@Directive({
  selector: 'ui-tabs-trigger, [ui-tabs-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[attr.role]': '"tab"',
    '[attr.id]': 'tabs.triggerId(value)',
    '[attr.aria-selected]': 'isSelected',
    '[attr.aria-controls]': 'tabs.contentId(value)',
    '[attr.tabindex]': 'list.currentTabStop() === value ? 0 : -1',
    '[attr.disabled]': 'isNativeButton && disabled ? "" : null',
    '[attr.data-state]': 'isSelected ? "active" : "inactive"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.data-orientation]': 'tabs.orientation',
    '[class]': 'hostClass',
    '(mousedown)': 'onMousedown($event)',
    '(keydown)': 'onKeydown($event)',
    '(focus)': 'onFocus()',
  },
})
export class UiTabsTriggerComponent {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'tabs-trigger'
  readonly tabs = inject(UiTabsComponent)
  readonly list = inject(UiTabsListComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isNativeButton = this.el.tagName === 'BUTTON'
  @Input('class') className?: string
  @Input({ required: true }) value!: string
  @Input({ transform: booleanAttribute }) disabled = false
  @Input() size?: TabsTriggerSize
  @Input() variant?: TabsListVariant
  /** Styling orientation; defaults to the Tabs root's orientation. */
  @Input() orientation?: TabsOrientation

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
      tabsTriggerVariants({
        size: this.size,
        variant: this.variant,
        orientation: this.orientation ?? this.tabs.orientation,
      }),
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tabs-content, [ui-tabs-content]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"tabs-content"',
    '[attr.id]': 'tabs.contentId(value)',
    '[attr.role]': '"tabpanel"',
    '[attr.aria-labelledby]': 'tabs.triggerId(value)',
    '[attr.tabindex]': '0',
    '[attr.data-state]': 'isSelected ? "active" : "inactive"',
    '[attr.data-orientation]': 'tabs.orientation',
    '[attr.hidden]': 'present ? null : ""',
    '[style.animation-duration]': 'mountAnimationPrevented() ? "0s" : null',
    '[class]': 'hostClass',
  },
  template: `@if (present) {
    <ng-content />
  }`,
})
export class UiTabsContentComponent implements AfterViewInit {
  readonly tabs = inject(UiTabsComponent)
  @Input('class') className?: string
  @Input({ required: true }) value!: string
  @Input({ transform: booleanAttribute }) forceMount = false

  /** Radix: the tab that is active on first paint does not play its enter animation. */
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
      'block',
      'ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:blur-in-2 motion-safe:data-[state=active]:slide-in-from-bottom-1 motion-safe:data-[state=active]:ease-emphasized flex-1 focus-visible:ring-2 focus-visible:ring-[3px] focus-visible:outline-none motion-safe:data-[state=active]:duration-200',
      this.className,
    )
  }
}

export { tabsListVariants, tabsTriggerVariants, type TabsListVariants, type TabsTriggerVariants }

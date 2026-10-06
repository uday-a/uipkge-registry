import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  DestroyRef,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { toggleVariants, type ToggleVariants } from '@/ui/toggle/toggle.variants'

export type ToggleGroupType = 'single' | 'multiple'
export type ToggleGroupVariant = NonNullable<ToggleVariants['variant']>
export type ToggleGroupSize = NonNullable<ToggleVariants['size']>
export type ToggleGroupOrientation = 'horizontal' | 'vertical'

const ITEM_SELECTOR = '[data-slot="toggle-group-item"]'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Angular port of UIPKGE ToggleGroup, behaving like the Radix ToggleGroup the React
 * component wraps: `type="single"` (radio semantics, clicking the pressed item clears
 * the value to '') or `type="multiple"` (pressed buttons), roving focus with arrow keys /
 * Home / End (looping), items reading variant / size / spacing / disabled from the group,
 * and the React sliding selection indicator for single-select. Class strings are
 * identical to the React source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-toggle-group, [ui-toggle-group]',
  standalone: true,
  host: {
    // Radix: single is a radiogroup, multiple a toolbar; roving root is tabbable and redirects focus.
    '[attr.role]': 'type === "multiple" ? "toolbar" : "radiogroup"',
    '[attr.tabindex]': 'rovingFocus ? (tabbingBackOut() || !enabledItems().length ? -1 : 0) : null',
    '[attr.dir]': 'dir',
    '[attr.data-orientation]': 'orientation ?? null',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"toggle-group"',
    '[attr.data-size]': 'size ?? null',
    '[attr.data-variant]': 'variant ?? null',
    '[attr.data-spacing]': 'spacing',
    '[attr.data-animated]': 'indicatorActive ? "true" : "false"',
    '[style.--gap]': 'spacing',
    '[class]': 'hostClass',
    '(mousedown)': 'clickFocus = true',
    '(focus)': 'onRootFocus($event)',
    '(focusout)': 'tabbingBackOut.set(false)',
  },
  template: `
    @if (indicatorActive) {
      <span
        data-slot="toggle-group-indicator"
        aria-hidden="true"
        class="bg-accent pointer-events-none absolute top-0 left-0 z-0 shadow-xs will-change-transform"
        [style]="indicatorStyle()"
      ></span>
    }
    <ng-content />
  `,
})
export class UiToggleGroupComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)

  @Input() type: ToggleGroupType = 'single'
  /** Controlled value: a string for `single`, a string[] for `multiple`. */
  @Input() value?: string | string[]
  @Input() defaultValue?: string | string[]
  @Output() valueChange = new EventEmitter<any>()
  @Input() variant?: ToggleGroupVariant
  @Input() size?: ToggleGroupSize
  @Input() spacing = 0
  /** Sliding selection indicator for single-select (default true). Multi-select keeps item chrome. */
  @Input({ transform: booleanAttribute }) animated = true
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) rovingFocus = true
  @Input({ transform: booleanAttribute }) loop = true
  @Input() orientation?: ToggleGroupOrientation
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Input('class') className?: string

  private readonly _value = signal<string | string[] | undefined>(undefined)
  /** Roving tab stop (Radix currentTabStopId): the item last focused inside the group. */
  readonly tabStop = signal<string | null>(null)
  /** Shift+Tab from an item: drop the root out of the tab order so focus can leave. */
  readonly tabbingBackOut = signal(false)
  clickFocus = false
  readonly indicatorStyle = signal<Record<string, string>>({ opacity: '0' })
  private firstPosition = true
  private observers: { disconnect(): void }[] = []

  get indicatorActive(): boolean {
    return this.animated !== false && this.type !== 'multiple'
  }

  get hostClass(): string {
    return cn(
      'group/toggle-group relative flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
      this.className,
    )
  }

  /** Pressed values as an array, whichever `type` is in use. */
  get values(): string[] {
    const v = this.value !== undefined ? this.value : (this._value() ?? this.defaultValue)
    if (v === undefined || v === null || v === '') return []
    return Array.isArray(v) ? v : [v]
  }

  isPressed(value: string): boolean {
    return this.values.includes(value)
  }

  toggle(value: string): void {
    if (this.disabled) return
    let next: string | string[]
    if (this.type === 'multiple') {
      const current = this.values
      next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    } else {
      next = this.isPressed(value) ? '' : value
    }
    this._value.set(next)
    this.valueChange.emit(next)
  }

  private readonly registry = signal<UiToggleGroupItemComponent[]>([])

  register(item: UiToggleGroupItemComponent): void {
    this.registry.update((list) => [...list, item])
  }

  unregister(item: UiToggleGroupItemComponent): void {
    this.registry.update((list) => list.filter((i) => i !== item))
  }

  /** Focusable items in DOM order (roving focus order). */
  enabledItems(): UiToggleGroupItemComponent[] {
    return this.registry()
      .filter((i) => !i.isDisabled)
      .sort((a, b) => (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1))
  }

  /** Radix RovingFocusGroup keyboard: arrows (per orientation / dir), Home, End, looping. */
  onItemKeydown(event: KeyboardEvent, current: UiToggleGroupItemComponent): void {
    if (!this.rovingFocus) return
    if (event.key === 'Tab' && event.shiftKey) {
      this.tabbingBackOut.set(true)
      return
    }
    const rtl = this.dir === 'rtl'
    const keys: Record<string, 'prev' | 'next' | 'first' | 'last'> = {
      Home: 'first',
      End: 'last',
      PageUp: 'first',
      PageDown: 'last',
    }
    if (this.orientation !== 'vertical') {
      keys['ArrowLeft'] = rtl ? 'next' : 'prev'
      keys['ArrowRight'] = rtl ? 'prev' : 'next'
    }
    if (this.orientation !== 'horizontal') {
      keys['ArrowUp'] = 'prev'
      keys['ArrowDown'] = 'next'
    }
    const intent = keys[event.key]
    if (!intent || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    event.preventDefault()
    const items = this.enabledItems()
    const i = items.indexOf(current)
    let target: UiToggleGroupItemComponent | undefined
    if (intent === 'first') target = items[0]
    else if (intent === 'last') target = items[items.length - 1]
    else {
      const next = intent === 'next' ? i + 1 : i - 1
      target = this.loop ? items[(next + items.length) % items.length] : items[next]
    }
    target?.element.focus()
  }

  /** Radix entry focus: keyboard focus on the root moves to the pressed, last-focused or first item. */
  onRootFocus(event: FocusEvent): void {
    const keyboard = !this.clickFocus
    this.clickFocus = false
    if (event.target !== this.el.nativeElement || !keyboard || this.tabbingBackOut() || !this.rovingFocus) return
    const items = this.enabledItems()
    const target = items.find((i) => i.pressed) ?? items.find((i) => i.value === this.tabStop()) ?? items[0]
    target?.element.focus()
  }

  ngOnChanges(): void {
    this.firstPosition = true
    this.updateIndicator()
  }

  ngAfterViewInit(): void {
    const root = this.el.nativeElement
    root.style.outline = 'none'
    this.updateIndicator()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.updateIndicator()) : null
    const observeItems = () => root.querySelectorAll(ITEM_SELECTOR).forEach((el) => ro?.observe(el))
    ro?.observe(root)
    observeItems()
    if (ro) this.observers.push(ro)
    if (typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver((mutations) => {
        if (mutations.some((m) => m.type === 'childList')) observeItems()
        this.updateIndicator()
      })
      mo.observe(root, { attributes: true, attributeFilter: ['data-state'], subtree: true, childList: true })
      this.observers.push(mo)
    }
  }

  private updateIndicator(): void {
    if (!this.indicatorActive || typeof window === 'undefined') return
    const root = this.el.nativeElement
    const active = root.querySelector<HTMLElement>(`${ITEM_SELECTOR}[data-state="on"]`)
    if (!active) {
      this.indicatorStyle.set({ opacity: '0' })
      return
    }
    const listRect = root.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - listRect.left + root.scrollLeft
    const top = activeRect.top - listRect.top + root.scrollTop
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const transition =
      reduced || this.firstPosition
        ? 'none'
        : `transform 220ms ${EASE}, width 220ms ${EASE}, height 220ms ${EASE}, border-radius 220ms ${EASE}`
    this.indicatorStyle.set({
      width: `${activeRect.width}px`,
      height: `${activeRect.height}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      'border-radius': getComputedStyle(active).borderRadius,
      opacity: '1',
      transition,
    })
    this.firstPosition = false
  }

  ngOnDestroy(): void {
    this.observers.splice(0).forEach((o) => o.disconnect())
  }
}

/**
 * One toggle in the group. Put it on a `<button>` (`<button ui-toggle-group-item value="x">`)
 * for the Radix DOM; on the custom element it gets button semantics via role + keyboard.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-toggle-group-item, [ui-toggle-group-item]',
  standalone: true,
  host: {
    '[attr.type]': 'isButton ? "button" : null',
    '[attr.role]': 'group.type === "single" ? "radio" : isButton ? null : "button"',
    '[attr.aria-checked]': 'group.type === "single" ? pressed : null',
    '[attr.aria-pressed]': 'group.type === "single" ? null : pressed',
    '[attr.data-state]': 'pressed ? "on" : "off"',
    '[attr.data-disabled]': 'isDisabled ? "" : null',
    '[attr.disabled]': 'isDisabled && isButton ? "" : null',
    '[attr.tabindex]': 'tabIndex',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"toggle-group-item"',
    '[attr.data-variant]': 'resolvedVariant ?? null',
    '[attr.data-size]': 'resolvedSize ?? null',
    '[attr.data-spacing]': 'group.spacing',
    '[class]': 'hostClass',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
    '(focus)': 'group.tabStop.set(value)',
  },
  template: `<ng-content />`,
})
export class UiToggleGroupItemComponent {
  readonly group = inject(UiToggleGroupComponent)
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isButton = this.element.tagName === 'BUTTON'

  @Input({ required: true }) value!: string
  @Input({ transform: booleanAttribute }) disabled = false
  @Input() variant?: ToggleGroupVariant
  @Input() size?: ToggleGroupSize
  @Input('class') className?: string

  get pressed(): boolean {
    return this.group.isPressed(this.value)
  }

  get isDisabled(): boolean {
    return this.group.disabled || this.disabled
  }

  get resolvedVariant(): ToggleGroupVariant | undefined {
    return this.group.variant || this.variant
  }

  get resolvedSize(): ToggleGroupSize | undefined {
    return this.group.size || this.size
  }

  /** Radix roving tabindex: only the current tab stop (the last focused item) is 0; the root takes Tab first. */
  get tabIndex(): number | null {
    if (!this.group.rovingFocus) return this.isButton ? null : 0
    return this.group.tabStop() === this.value && !this.isDisabled ? 0 : -1
  }

  constructor() {
    this.group.register(this)
    inject(DestroyRef).onDestroy(() => this.group.unregister(this))
  }

  get hostClass(): string {
    return cn(
      toggleVariants({ variant: this.resolvedVariant, size: this.resolvedSize }),
      // z-10 keeps label/icons above the sliding indicator. When the parent
      // has data-animated=true (single-select), on-state surface lives on the
      // indicator — suppress item bg so the pill can slide cleanly.
      'relative z-10 w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
      'group-data-[animated=true]/toggle-group:data-[state=on]:bg-transparent group-data-[animated=true]/toggle-group:data-[state=on]:hover:bg-transparent',
      // first/last-of-type (not first/last-child): sliding indicator is a sibling span
      // and must not steal end-cap rounding or the outline left border.
      'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first-of-type:rounded-l-md data-[spacing=0]:last-of-type:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first-of-type:border-l',
      this.className,
    )
  }

  onClick(): void {
    if (this.isDisabled) return
    this.group.toggle(this.value)
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isButton && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      this.onClick()
      return
    }
    this.group.onItemKeydown(event, this)
  }
}

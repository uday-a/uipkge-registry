import {
  AfterViewChecked,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective, afterExitAnimation, pushDismissableLayer, uniqueId } from '@/ui/popper/popper'
import { navigationMenuTriggerStyle } from './navigation-menu.variants'
import { navigationMenuContentVariants } from './navigation-menu-content.variants'

export type NavigationMenuOrientation = 'horizontal' | 'vertical'
export type NavigationMenuMotion = 'from-start' | 'from-end' | 'to-start' | 'to-end'

const TABBABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
const tabbables = (el: HTMLElement | null | undefined) =>
  el ? [...el.querySelectorAll<HTMLElement>(TABBABLE)].filter((n) => !n.hasAttribute('disabled')) : []
const isMouse = (e: PointerEvent) => !e.pointerType || e.pointerType === 'mouse'

/** Internal: reports a template element to its owner on create / destroy (a ref callback). */
@Directive({ selector: '[uiNavigationMenuRef]', standalone: true })
export class UiNavigationMenuRefDirective implements OnInit, OnDestroy {
  @Input({ alias: 'uiNavigationMenuRef', required: true }) ref!: (el: HTMLElement | null) => void
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  ngOnInit(): void {
    this.ref(this.el)
  }

  ngOnDestroy(): void {
    this.ref(null)
  }
}

/** Radix NavigationMenuContent class string (group-data viewport=false popover + link focus reset). */
const CONTENT_POPOVER_CLASSES =
  'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none'

/**
 * Viewport. React's NavigationMenuViewport renders a positioning wrapper
 * (`absolute top-full left-0 isolate z-50 flex justify-center`) around the Radix
 * viewport: here the host is that wrapper and the viewport div renders inside it
 * while a menu is open (or animating closed). It hosts the active content, sizes
 * itself to it through --radix-navigation-menu-viewport-width / -height, and keeps
 * the menu open while the pointer is over it.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-navigation-menu-viewport, [ui-navigation-menu-viewport]',
  standalone: true,
  imports: [UiRenderTemplateDirective],
  host: { class: 'absolute top-full left-0 isolate z-50 flex justify-center' },
  template: `@if (present) {
    <div
      #viewport
      data-uipkge=""
      data-slot="navigation-menu-viewport"
      [attr.data-state]="root.isOpen ? 'open' : 'closed'"
      [attr.data-orientation]="root.orientation"
      [class]="viewportClass"
      [style]="viewportStyle"
      (pointerenter)="root.onContentEnter()"
      (pointerleave)="onPointerLeave($event)"
    >
      @for (content of root.contents(); track content) {
        @if (content.present) {
          <ng-container [uiRenderTemplate]="content.template" />
        }
      }
    </div>
  }`,
})
export class UiNavigationMenuViewportComponent implements AfterViewChecked, OnDestroy {
  readonly root = inject(UiNavigationMenuComponent)
  @Input('class') className?: string
  @ViewChild('viewport') viewportRef?: ElementRef<HTMLElement>

  private readonly exiting = signal(false)
  private readonly size = signal<{ width: number; height: number } | null>(null)
  private wasOpen = false
  private observed: HTMLElement | null = null
  private ro: ResizeObserver | null = null

  constructor() {
    this.root.viewportComponent = this
  }

  get present(): boolean {
    return this.root.isOpen || this.exiting()
  }

  get viewportStyle(): Record<string, string> {
    const s = this.size()
    const style: Record<string, string> = {}
    if (s) {
      for (const lib of ['radix', 'reka']) {
        style[`--${lib}-navigation-menu-viewport-width`] = `${s.width}px`
        style[`--${lib}-navigation-menu-viewport-height`] = `${s.height}px`
      }
    }
    if (!this.root.isOpen) style['pointer-events'] = 'none'
    return style
  }

  beginExit(): void {
    this.exiting.set(true)
  }

  onPointerLeave(event: PointerEvent): void {
    if (isMouse(event)) this.root.onContentLeave()
  }

  ngAfterViewChecked(): void {
    const open = this.root.isOpen
    if (open !== this.wasOpen) {
      this.wasOpen = open
      if (!open) {
        const el = this.viewportRef?.nativeElement
        void afterExitAnimation(el).then(() => {
          if (!this.root.isOpen) this.exiting.set(false)
        })
      } else {
        this.exiting.set(false)
      }
    }
    // Radix sizes the viewport to the active content (offsetWidth / offsetHeight).
    const panel = this.root.contents().find((c) => c.isActiveContent)?.panel ?? null
    if (panel !== this.observed) {
      this.ro?.disconnect()
      this.observed = panel
      if (!panel) return
      const measure = () => {
        const next = { width: panel.offsetWidth, height: panel.offsetHeight }
        const prev = this.size()
        if (!prev || prev.width !== next.width || prev.height !== next.height) this.size.set(next)
      }
      measure()
      this.ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
      this.ro?.observe(panel)
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect()
    if (this.root.viewportComponent === this) this.root.viewportComponent = undefined
  }

  get viewportClass(): string {
    return cn(
      'origin-top-center bg-popover text-popover-foreground data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:zoom-out-95 data-[state=open]:motion-safe:zoom-in-90 relative left-[var(--radix-navigation-menu-viewport-left)] mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]',
      this.className,
    )
  }
}

/**
 * Angular port of UIPKGE NavigationMenu with Radix NavigationMenu behaviour: triggers
 * open on hover (delayDuration, then skipDelayDuration for quick moves between
 * triggers) or click, close 150ms after the pointer leaves, and Escape / outside
 * pointer-down / focus leaving the menu dismiss. Content renders into the shared
 * viewport (or inline as a popover with `[viewport]="false"`) with data-motion
 * from-/to-start/end so panels slide in the direction of travel. Arrow keys move
 * between triggers and links, ArrowDown enters an open panel. Use `<nav ui-navigation-menu>`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-navigation-menu, [ui-navigation-menu]',
  standalone: true,
  imports: [UiNavigationMenuViewportComponent],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"navigation-menu"',
    '[attr.data-viewport]': 'viewport ? "true" : "false"',
    '[attr.data-orientation]': 'orientation',
    '[attr.dir]': 'dir',
    '[attr.aria-label]': '"Main"',
    '[attr.role]': 'isNav ? null : "navigation"',
    '[class]': 'hostClass',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `<ng-content />
    @if (viewport) {
      <ui-navigation-menu-viewport />
    }`,
})
export class UiNavigationMenuComponent implements OnChanges, OnDestroy {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isNav = this.el.tagName === 'NAV'
  @Input('class') className?: string
  /** Controlled open item value ('' = closed). */
  @Input() value?: string
  @Input() defaultValue = ''
  @Output() valueChange = new EventEmitter<string>()
  @Input({ transform: booleanAttribute }) viewport = true
  @Input() delayDuration = 200
  @Input() skipDelayDuration = 300
  @Input() orientation: NavigationMenuOrientation = 'horizontal'
  @Input() dir: 'ltr' | 'rtl' = 'ltr'

  readonly baseId = uniqueId('navigation-menu')
  private readonly _value = signal<string | null>(null)
  readonly previousValue = signal('')
  readonly items: UiNavigationMenuItemComponent[] = []
  readonly contents = signal<UiNavigationMenuContentComponent[]>([])
  viewportComponent?: UiNavigationMenuViewportComponent
  indicatorComponent?: UiNavigationMenuIndicatorComponent
  indicatorTrack: HTMLElement | null = null

  private isOpenDelayed = true
  private openTimer?: ReturnType<typeof setTimeout>
  private closeTimer?: ReturnType<typeof setTimeout>
  private skipDelayTimer?: ReturnType<typeof setTimeout>
  private removeLayer: (() => void) | null = null

  get currentValue(): string {
    if (this.value !== undefined) return this.value
    return this._value() ?? this.defaultValue
  }

  get isOpen(): boolean {
    return this.currentValue !== ''
  }

  /** Radix: the viewport keeps showing the last content while it animates closed. */
  get activeContentValue(): string {
    return this.isOpen ? this.currentValue : this.previousValue()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['value']
    if (change && !change.firstChange) this.transition(change.previousValue ?? '', change.currentValue ?? '')
  }

  ngOnDestroy(): void {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    clearTimeout(this.skipDelayTimer)
    this.removeLayer?.()
  }

  setValue(next: string): void {
    const prev = this.currentValue
    if (next === prev) return
    if (this.value === undefined) {
      this.transition(prev, next)
      this._value.set(next)
    }
    clearTimeout(this.skipDelayTimer)
    if (next !== '') {
      if (this.skipDelayDuration > 0) this.isOpenDelayed = false
    } else {
      this.skipDelayTimer = setTimeout(() => (this.isOpenDelayed = true), this.skipDelayDuration)
    }
    this.valueChange.emit(next)
  }

  /** Keeps leaving content / the closing viewport mounted for their exit animations. */
  private transition(prev: string, next: string): void {
    const activeBefore = prev !== '' ? prev : this.previousValue()
    const activeAfter = next !== '' ? next : prev
    for (const c of this.contents()) {
      const v = c.item.value
      const was = this.viewport ? v === activeBefore : v === prev
      const now = this.viewport ? v === activeAfter : v === next
      if (was && !now) c.beginExit()
    }
    if (prev !== '' && next === '') {
      this.viewportComponent?.beginExit()
      this.indicatorComponent?.beginExit()
    }
    this.previousValue.set(prev)
    if (next !== '' && !this.removeLayer) {
      this.removeLayer = pushDismissableLayer({
        contains: (t) => this.containsInteractive(t),
        onEscape: () => {
          const item = this.items.find((i) => i.value === this.currentValue)
          if (item) item.wasEscapeClose = true
          item?.triggerEl?.focus()
          this.setValue('')
        },
        onPointerDownOutside: () => this.setValue(''),
      })
    } else if (next === '') {
      this.removeLayer?.()
      this.removeLayer = null
    }
  }

  /** Radix onPointerDownOutside: triggers, the viewport and the open content do not dismiss. */
  private containsInteractive(target: Node): boolean {
    if (this.items.some((i) => i.triggerEl?.contains(target))) return true
    if (this.viewportComponent?.viewportRef?.nativeElement.contains(target)) return true
    return this.contents().some((c) => c.panel?.contains(target))
  }

  onTriggerEnter(itemValue: string): void {
    clearTimeout(this.openTimer)
    if (this.isOpenDelayed) {
      if (this.currentValue === itemValue) {
        clearTimeout(this.closeTimer)
        return
      }
      this.openTimer = setTimeout(() => {
        clearTimeout(this.closeTimer)
        this.setValue(itemValue)
      }, this.delayDuration)
    } else {
      clearTimeout(this.closeTimer)
      this.setValue(itemValue)
    }
  }

  onTriggerLeave(): void {
    clearTimeout(this.openTimer)
    this.startCloseTimer()
  }

  onContentEnter(): void {
    clearTimeout(this.closeTimer)
  }

  onContentLeave(): void {
    this.startCloseTimer()
  }

  onItemSelect(itemValue: string): void {
    this.setValue(this.currentValue === itemValue ? '' : itemValue)
  }

  private startCloseTimer(): void {
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => this.setValue(''), 150)
  }

  /** Radix onFocusOutside: focus moving out of the whole menu closes it. */
  onFocusOut(event: FocusEvent): void {
    const to = event.relatedTarget
    if (this.isOpen && to instanceof Node && !this.el.contains(to)) this.setValue('')
  }

  registerContent(content: UiNavigationMenuContentComponent): void {
    this.contents.update((list) => [...list, content])
  }

  unregisterContent(content: UiNavigationMenuContentComponent): void {
    this.contents.update((list) => list.filter((c) => c !== content))
  }

  /** Radix data-motion: the direction content enters from / leaves to when switching items. */
  motionFor(
    itemValue: string,
    last: NavigationMenuMotion | null,
  ): { motion: NavigationMenuMotion | null; changed: boolean } {
    const values = this.items.map((i) => i.value)
    if (this.dir === 'rtl') values.reverse()
    const index = values.indexOf(this.currentValue)
    const prevIndex = values.indexOf(this.previousValue())
    const isSelected = itemValue === this.currentValue
    const wasSelected = prevIndex === values.indexOf(itemValue)
    if (!isSelected && !wasSelected) return { motion: last, changed: false }
    let motion: NavigationMenuMotion | null = null
    if (index !== prevIndex) {
      if (isSelected && prevIndex !== -1) motion = index > prevIndex ? 'from-end' : 'from-start'
      else if (wasSelected && index !== -1) motion = index > prevIndex ? 'to-start' : 'to-end'
    }
    return { motion, changed: true }
  }

  /** Radix FocusGroup: arrows / Home / End move between triggers and links of one group (no looping). */
  onFocusGroupKeydown(event: KeyboardEvent, current: HTMLElement): void {
    const arrows = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']
    if (![...arrows, 'Home', 'End'].includes(event.key)) return
    const group = current.closest('[data-slot="navigation-menu-content"], [data-slot="navigation-menu-list"]')
    if (!group) return
    let candidates = [
      ...group.querySelectorAll<HTMLElement>(
        '[data-slot="navigation-menu-trigger"], [data-slot="navigation-menu-link"]',
      ),
    ].filter(
      (n) =>
        n.closest('[data-slot="navigation-menu-content"], [data-slot="navigation-menu-list"]') === group &&
        !n.hasAttribute('disabled'),
    )
    const prevKey = this.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    if ([prevKey, 'ArrowUp', 'End'].includes(event.key)) candidates.reverse()
    if (arrows.includes(event.key)) candidates = candidates.slice(candidates.indexOf(current) + 1)
    event.preventDefault()
    setTimeout(() => candidates[0]?.focus())
  }

  get hostClass(): string {
    return cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', this.className)
  }
}

/**
 * Radix List renders `<div style="position: relative"><ul>`: the host is that
 * relative track (the indicator is positioned in it) and the <ul> carries the
 * classes. Put `<li ui-navigation-menu-item>` children inside.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-navigation-menu-list, [ui-navigation-menu-list]',
  standalone: true,
  host: { class: 'relative block' },
  template: `<ul
    data-uipkge=""
    data-slot="navigation-menu-list"
    [attr.data-orientation]="root.orientation"
    [class]="listClass"
  >
    <ng-content />
  </ul>`,
})
export class UiNavigationMenuListComponent implements OnDestroy {
  readonly root = inject(UiNavigationMenuComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input('class') className?: string

  constructor() {
    this.root.indicatorTrack = this.el
  }

  ngOnDestroy(): void {
    if (this.root.indicatorTrack === this.el) this.root.indicatorTrack = null
  }

  get listClass(): string {
    return cn('group flex flex-1 list-none items-center justify-center gap-1', this.className)
  }
}

/** Use `<li ui-navigation-menu-item>` (Radix renders an <li>). */
@Directive({
  selector: 'ui-navigation-menu-item, [ui-navigation-menu-item]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"navigation-menu-item"',
    '[class]': 'hostClass',
  },
})
export class UiNavigationMenuItemComponent implements OnDestroy {
  readonly root = inject(UiNavigationMenuComponent)
  @Input('class') className?: string
  @Input() value: string = uniqueId('navigation-menu-item')

  triggerEl?: HTMLElement
  content?: UiNavigationMenuContentComponent
  wasEscapeClose = false

  constructor() {
    this.root.items.push(this)
  }

  ngOnDestroy(): void {
    const i = this.root.items.indexOf(this)
    if (i >= 0) this.root.items.splice(i, 1)
  }

  get isOpen(): boolean {
    return this.root.currentValue === this.value
  }

  get triggerId(): string {
    return `${this.root.baseId}-trigger-${this.value}`
  }

  get contentId(): string {
    return `${this.root.baseId}-content-${this.value}`
  }

  /** Focus the first tabbable element of this item's open panel (Radix onEntryKeyDown). */
  focusContent(fromEnd = false): boolean {
    const items = tabbables(this.content?.panel)
    const target = fromEnd ? items[items.length - 1] : items[0]
    target?.focus()
    return !!target
  }

  get hostClass(): string {
    return cn('relative', this.className)
  }
}

/** Use `<button ui-navigation-menu-trigger>` (Radix renders a button). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-navigation-menu-trigger, [ui-navigation-menu-trigger]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"navigation-menu-trigger"',
    '[attr.id]': 'item.triggerId',
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[attr.role]': 'isNativeButton ? null : "button"',
    '[attr.tabindex]': 'isNativeButton ? null : 0',
    '[attr.disabled]': 'isNativeButton && disabled ? "" : null',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.data-state]': 'item.isOpen ? "open" : "closed"',
    '[attr.aria-expanded]': 'item.isOpen',
    '[attr.aria-controls]': 'item.contentId',
    '[class]': 'hostClass',
    '(pointerenter)': 'onPointerEnter()',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerleave)': 'onPointerLeave($event)',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content /><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-down relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>`,
})
export class UiNavigationMenuTriggerComponent {
  readonly item = inject(UiNavigationMenuItemComponent)
  private readonly root = this.item.root
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isNativeButton = this.el.tagName === 'BUTTON'
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) disabled = false

  private wasClickClose = false
  private hasPointerMoveOpened = false

  constructor() {
    this.item.triggerEl = this.el
  }

  onPointerEnter(): void {
    this.wasClickClose = false
    this.item.wasEscapeClose = false
  }

  onPointerMove(event: PointerEvent): void {
    if (!isMouse(event) || this.disabled || this.wasClickClose || this.item.wasEscapeClose || this.hasPointerMoveOpened)
      return
    this.root.onTriggerEnter(this.item.value)
    this.hasPointerMoveOpened = true
  }

  onPointerLeave(event: PointerEvent): void {
    if (!isMouse(event) || this.disabled) return
    this.root.onTriggerLeave()
    this.hasPointerMoveOpened = false
  }

  onClick(): void {
    if (this.disabled) return
    const wasOpen = this.item.isOpen
    this.root.onItemSelect(this.item.value)
    this.wasClickClose = wasOpen
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    if (!this.isNativeButton && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      this.onClick()
      return
    }
    const entryKey =
      this.root.orientation === 'horizontal' ? 'ArrowDown' : this.root.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    if (this.item.isOpen && event.key === entryKey) {
      this.item.focusContent()
      event.preventDefault()
      return
    }
    // Radix focus proxy: Tab from an open trigger moves into its panel.
    if (this.item.isOpen && event.key === 'Tab' && !event.shiftKey && this.item.focusContent()) {
      event.preventDefault()
      return
    }
    this.root.onFocusGroupKeydown(event, this.el)
  }

  get hostClass(): string {
    return cn(navigationMenuTriggerStyle(), 'group', this.className)
  }
}

/**
 * Content for one item. The panel is an <ng-template>: the viewport renders it while
 * the item is active (or sliding out), or -- with `[viewport]="false"` -- it renders in
 * place after this (display: contents) host as a popover under the trigger.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-navigation-menu-content, [ui-navigation-menu-content]',
  standalone: true,
  imports: [UiRenderTemplateDirective, UiNavigationMenuRefDirective],
  host: { class: 'contents' },
  template: `<ng-template #panelTemplate>
      <div
        [uiNavigationMenuRef]="setPanel"
        data-uipkge=""
        data-slot="navigation-menu-content"
        [attr.id]="item.contentId"
        [attr.aria-labelledby]="item.triggerId"
        [attr.data-motion]="motion"
        [attr.data-state]="item.isOpen ? 'open' : 'closed'"
        [attr.data-orientation]="root.orientation"
        [class]="contentClass"
        (pointerenter)="onPointerEnter()"
        (pointerleave)="onPointerLeave($event)"
        (keydown)="onKeydown($event)"
        (click)="onClick($event)"
      >
        <ng-content />
      </div>
    </ng-template>
    @if (!root.viewport && present) {
      <ng-container [uiRenderTemplate]="panelTemplate" />
    }`,
})
export class UiNavigationMenuContentComponent implements AfterViewChecked, OnDestroy {
  readonly item = inject(UiNavigationMenuItemComponent)
  readonly root = this.item.root
  @Input('class') className?: string
  @ViewChild('panelTemplate', { static: true }) template!: TemplateRef<unknown>
  /** The rendered panel element (in viewport mode it lives inside the viewport). */
  panel: HTMLElement | undefined
  readonly setPanel = (el: HTMLElement | null) => (this.panel = el ?? undefined)

  private readonly exiting = signal(false)
  private lastMotion: NavigationMenuMotion | null = null
  private wasActive = false

  constructor() {
    this.item.content = this
    this.root.registerContent(this)
  }

  /** The content the viewport shows (and sizes itself to). */
  get isActiveContent(): boolean {
    return this.root.viewport ? this.item.value === this.root.activeContentValue : this.item.isOpen
  }

  get present(): boolean {
    return this.isActiveContent || this.exiting()
  }

  get motion(): NavigationMenuMotion | null {
    const { motion, changed } = this.root.motionFor(this.item.value, this.lastMotion)
    if (changed) this.lastMotion = motion
    return motion
  }

  beginExit(): void {
    this.exiting.set(true)
  }

  /** Radix Presence: unmount once the exit animation (slide-out / zoom-out) has finished. */
  ngAfterViewChecked(): void {
    const active = this.isActiveContent
    if (active === this.wasActive) return
    this.wasActive = active
    if (active) {
      this.exiting.set(false)
      return
    }
    const panel = this.panel
    void afterExitAnimation(panel).then(() => {
      if (!this.isActiveContent) this.exiting.set(false)
    })
  }

  ngOnDestroy(): void {
    this.root.unregisterContent(this)
    if (this.item.content === this) this.item.content = undefined
  }

  onPointerEnter(): void {
    if (!this.root.viewport) this.root.onContentEnter()
  }

  onPointerLeave(event: PointerEvent): void {
    if (!this.root.viewport && isMouse(event)) this.root.onContentLeave()
  }

  /** Tab walks the panel, then leaves it next to the trigger (Radix focus proxy). */
  onKeydown(event: KeyboardEvent): void {
    const panel = event.currentTarget as HTMLElement
    if (event.key === 'Tab' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const candidates = tabbables(panel)
      const index = candidates.indexOf(document.activeElement as HTMLElement)
      const next = event.shiftKey ? candidates.slice(0, index).reverse() : candidates.slice(index + 1)
      if (next[0]) {
        next[0].focus()
        event.preventDefault()
      } else if (this.item.triggerEl) {
        this.item.triggerEl.focus()
        // Backwards lands on the trigger; forwards lets the browser Tab on from it.
        if (event.shiftKey) event.preventDefault()
      }
      return
    }
    const target = event.target as HTMLElement
    if (target.matches('[data-slot="navigation-menu-link"]')) return
    this.root.onFocusGroupKeydown(event, target)
  }

  /** Radix Link select: activating a NavigationMenuLink inside content closes the menu. */
  onClick(event: MouseEvent): void {
    const link = (event.target as HTMLElement).closest('[data-slot="navigation-menu-link"]')
    if (link && !event.defaultPrevented && !event.metaKey && !event.ctrlKey) this.root.setValue('')
  }

  get contentClass(): string {
    return cn(navigationMenuContentVariants(), CONTENT_POPOVER_CLASSES, this.className)
  }
}

/** Use `<a ui-navigation-menu-link href="...">` (Radix renders an anchor). */
@Directive({
  selector: 'ui-navigation-menu-link, [ui-navigation-menu-link]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"navigation-menu-link"',
    '[attr.data-active]': 'active ? "" : null',
    '[attr.aria-current]': 'active ? "page" : null',
    '[class]': 'hostClass',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiNavigationMenuLinkComponent {
  private readonly root = inject(UiNavigationMenuComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input({ transform: booleanAttribute }) active = false
  @Input('class') className?: string
  /** Radix Link `onSelect`: `preventDefault()` keeps the menu open (meta-click never closes). */
  @Output() select = new EventEmitter<Event>()

  /** Radix: activating a link selects it, then dismisses the menu unless prevented. */
  onClick(event: MouseEvent): void {
    const selectEvent = new Event('select', { cancelable: true })
    this.select.emit(selectEvent)
    if (!selectEvent.defaultPrevented && !event.metaKey) this.root.setValue('')
  }

  onKeydown(event: KeyboardEvent): void {
    this.root.onFocusGroupKeydown(event, this.el)
  }

  get hostClass(): string {
    return cn(
      "data-active:focus:bg-accent data-active:hover:bg-accent data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
      this.className,
    )
  }
}

/**
 * Radix Indicator: portalled into the list's relative track and slid under the open
 * trigger (offsetLeft / offsetWidth, ResizeObserver-tracked). Hidden until a menu first opens.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-navigation-menu-indicator, [ui-navigation-menu-indicator]',
  standalone: true,
  imports: [UiRenderTemplateDirective, UiNavigationMenuRefDirective],
  host: { class: 'hidden' },
  template: `<ng-template #indicatorTemplate>
      <div
        [uiNavigationMenuRef]="setIndicator"
        data-uipkge=""
        data-slot="navigation-menu-indicator"
        aria-hidden="true"
        [attr.data-state]="root.isOpen ? 'visible' : 'hidden'"
        [attr.data-orientation]="root.orientation"
        [class]="hostClass"
        [style]="indicatorStyle"
      >
        <div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
      </div>
    </ng-template>
    @if (present) {
      <ng-container [uiRenderTemplate]="indicatorTemplate" />
    }`,
})
export class UiNavigationMenuIndicatorComponent implements AfterViewChecked, OnDestroy {
  readonly root = inject(UiNavigationMenuComponent)
  @Input('class') className?: string
  private indicatorEl: HTMLElement | null = null
  /** Portal: the rendered indicator moves into the list track, beside the <ul> (Radix createPortal). */
  readonly setIndicator = (el: HTMLElement | null) => {
    this.indicatorEl = el
    if (el) this.root.indicatorTrack?.appendChild(el)
  }

  private readonly exiting = signal(false)
  private readonly position = signal<{ size: number; offset: number } | null>(null)
  private wasOpen = false
  private activeTrigger: HTMLElement | null = null
  private ro: ResizeObserver | null = null

  constructor() {
    this.root.indicatorComponent = this
  }

  get present(): boolean {
    return (this.root.isOpen || this.exiting()) && this.position() !== null
  }

  beginExit(): void {
    this.exiting.set(true)
  }

  get indicatorStyle(): Record<string, string> {
    const p = this.position()
    if (!p) return {}
    return this.root.orientation === 'horizontal'
      ? { position: 'absolute', left: '0', width: `${p.size}px`, transform: `translateX(${p.offset}px)` }
      : { position: 'absolute', top: '0', height: `${p.size}px`, transform: `translateY(${p.offset}px)` }
  }

  ngAfterViewChecked(): void {
    const open = this.root.isOpen
    if (open !== this.wasOpen) {
      this.wasOpen = open
      if (open) this.exiting.set(false)
      else {
        void afterExitAnimation(this.indicatorEl).then(() => {
          if (!this.root.isOpen) this.exiting.set(false)
        })
      }
    }
    // Follow the open trigger (Radix keeps the last one while hidden).
    const trigger = this.root.items.find((i) => i.value === this.root.currentValue)?.triggerEl ?? null
    if (trigger && trigger !== this.activeTrigger) {
      this.activeTrigger = trigger
      this.ro?.disconnect()
      const update = () => {
        const horizontal = this.root.orientation === 'horizontal'
        const next = {
          size: horizontal ? trigger.offsetWidth : trigger.offsetHeight,
          offset: horizontal ? trigger.offsetLeft : trigger.offsetTop,
        }
        const prev = this.position()
        if (!prev || prev.size !== next.size || prev.offset !== next.offset) this.position.set(next)
      }
      update()
      this.ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
      this.ro?.observe(trigger)
      if (this.root.indicatorTrack) this.ro?.observe(this.root.indicatorTrack)
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect()
    this.indicatorEl?.remove()
    if (this.root.indicatorComponent === this) this.root.indicatorComponent = undefined
  }

  get hostClass(): string {
    return cn(
      'data-[state=visible]:motion-safe:animate-in data-[state=hidden]:motion-safe:animate-out data-[state=hidden]:motion-safe:fade-out data-[state=visible]:motion-safe:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
      this.className,
    )
  }
}

export { navigationMenuTriggerStyle } from './navigation-menu.variants'
export { navigationMenuContentVariants } from './navigation-menu-content.variants'

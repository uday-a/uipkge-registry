import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  BodyPortal,
  afterExitAnimation,
  autoPlace,
  computePlacement,
  pushDismissableLayer,
  uniqueId,
  type PopperAlign,
  type PopperSide,
  type PlaceOptions,
} from '@/ui/popper/popper'

export type MenubarItemVariant = 'default' | 'destructive'
export type MenubarCheckedState = boolean | 'indeterminate'
export type MenubarDir = 'ltr' | 'rtl'
export type MenubarSide = PopperSide
export type MenubarAlign = PopperAlign

/**
 * autoPlace() positions on the next animation frame; place once synchronously too so the
 * panel never paints (or catches a fast click's pointerup) at the viewport origin.
 */
function placeAndTrack(anchor: Element, panel: HTMLElement, options: () => PlaceOptions, prefix: string): () => void {
  const stop = autoPlace(anchor, panel, options, prefix)
  const p = computePlacement(
    anchor.getBoundingClientRect(),
    { width: panel.offsetWidth, height: panel.offsetHeight },
    options(),
  )
  panel.style.left = `${Math.round(p.x)}px`
  panel.style.top = `${Math.round(p.y)}px`
  panel.setAttribute('data-side', p.side)
  panel.setAttribute('data-align', p.align)
  return stop
}

/*
 * Angular port of UIPKGE Menubar with Radix Menubar behaviour: a row of menus whose
 * triggers share one roving tab stop (ArrowLeft / ArrowRight / Home / End between them).
 * Pressing a trigger (or Enter / Space / ArrowDown) opens its menu in a body portal under
 * it; while one menu is open, hovering another trigger switches to it and ArrowLeft /
 * ArrowRight inside a menu move to the neighbouring menu. Items, checkbox / radio items,
 * labels, separators, shortcuts and hover / ArrowRight submenus behave like the Radix
 * menu (roving focus, typeahead, pointer grace area). Escape and outside presses close;
 * closing from inside hands focus back to the trigger. Class strings match React.
 */

// ---------------------------------------------------------------------------------------
// Shared menu machinery (Radix Menu): roving focus, typeahead, pointer grace area.
// ---------------------------------------------------------------------------------------

interface Point {
  x: number
  y: number
}
interface GraceIntent {
  area: Point[]
  side: 'left' | 'right'
}

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]!
    const b = polygon[j]!
    if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x)
      inside = !inside
  }
  return inside
}

const isMouse = (event: PointerEvent) => event.pointerType === 'mouse'
const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home']
const LAST_KEYS = ['ArrowUp', 'PageDown', 'End']

/** Keyboard + pointer state of one menu panel (root content or a submenu). */
class MenuPanel {
  el?: HTMLElement
  openSub?: UiMenubarSubComponent
  /** Typeahead buffer; while non-empty a Space extends the search instead of selecting. */
  search = ''
  private searchTimer: ReturnType<typeof setTimeout> | undefined
  private lastX = 0
  private pointerDir: 'left' | 'right' = 'right'
  private grace: GraceIntent | null = null
  private graceTimer: ReturnType<typeof setTimeout> | undefined

  constructor(private readonly loop: () => boolean) {}

  items(): HTMLElement[] {
    if (!this.el) return []
    return [...this.el.querySelectorAll<HTMLElement>('[role^="menuitem"]')].filter(
      (el) => !el.hasAttribute('data-disabled'),
    )
  }

  focusFirst(): void {
    this.items()[0]?.focus({ preventScroll: true })
  }

  focusPanel(): void {
    this.el?.focus({ preventScroll: true })
  }

  keydown(event: KeyboardEvent): void {
    const panel = this.el
    const target = event.target as HTMLElement
    if (!panel) return
    if (target.closest('[role="menu"]') === panel) {
      if (event.key === 'Tab') event.preventDefault()
      if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1) this.typeahead(event.key)
    }
    const items = this.items()
    if (target === panel) {
      // Menu itself focused (pointer open): the first arrow press enters the list.
      if (FIRST_KEYS.includes(event.key)) items[0]?.focus({ preventScroll: true })
      else if (LAST_KEYS.includes(event.key)) items[items.length - 1]?.focus({ preventScroll: true })
      else return
      event.preventDefault()
      return
    }
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const current = items.indexOf(target)
    if (current < 0) return
    let next: number
    if (event.key === 'ArrowDown') next = current + 1
    else if (event.key === 'ArrowUp') next = current - 1
    else if (event.key === 'Home' || event.key === 'PageUp') next = 0
    else if (event.key === 'End' || event.key === 'PageDown') next = items.length - 1
    else return
    event.preventDefault()
    if (this.loop()) next = (next + items.length) % items.length
    else next = Math.min(Math.max(next, 0), items.length - 1)
    items[next]?.focus({ preventScroll: true })
  }

  /** Radix typeahead: accumulate for 1s, a repeated single character cycles matches. */
  private typeahead(key: string): void {
    const search = this.search + key
    const items = this.items()
    const text = (el: HTMLElement) => (el.getAttribute('data-text-value') ?? el.textContent ?? '').trim()
    const current = items.find((el) => el === document.activeElement)
    const repeated = search.length > 1 && [...search].every((c) => c === search[0])
    const needle = (repeated ? search[0]! : search).toLowerCase()
    const start = current ? items.indexOf(current) : 0
    let candidates = [...items.slice(start), ...items.slice(0, start)]
    if (needle.length === 1) candidates = candidates.filter((el) => el !== current)
    const match = candidates.find((el) => text(el).toLowerCase().startsWith(needle))
    this.search = search
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => (this.search = ''), 1000)
    if (match && match !== current) setTimeout(() => match.focus({ preventScroll: true }))
  }

  pointerMove(event: PointerEvent): void {
    if (!isMouse(event) || !this.el?.contains(event.target as Node) || event.clientX === this.lastX) return
    this.pointerDir = event.clientX > this.lastX ? 'right' : 'left'
    this.lastX = event.clientX
  }

  /** True while the pointer travels from a sub-trigger toward its open submenu. */
  isMovingToSub(event: PointerEvent): boolean {
    const g = this.grace
    return !!g && this.pointerDir === g.side && isPointInPolygon({ x: event.clientX, y: event.clientY }, g.area)
  }

  setGrace(intent: GraceIntent | null): void {
    this.grace = intent
    clearTimeout(this.graceTimer)
    if (intent) this.graceTimer = setTimeout(() => (this.grace = null), 300)
  }

  /** Radix `onItemLeave`: the pointer left an item, so the menu itself takes focus. */
  itemLeave(event: PointerEvent): void {
    if (this.isMovingToSub(event)) return
    this.focusPanel()
  }

  /** Focus landing anywhere in this panel except the open sub's trigger closes that sub. */
  focusMoved(target: EventTarget | null): void {
    const sub = this.openSub
    if (sub && target !== sub.trigger) sub.setOpen(false)
  }

  destroy(): void {
    clearTimeout(this.searchTimer)
    clearTimeout(this.graceTimer)
    this.search = ''
    this.grace = null
  }
}

// ---------------------------------------------------------------------------------------
// Root, menu, trigger, content
// ---------------------------------------------------------------------------------------

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar, [ui-menubar]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"menubar"',
    '[attr.data-orientation]': '"horizontal"',
    '[attr.tabindex]': 'tabbingBackOut || !menus.size ? -1 : 0',
    '[class]': 'hostClass',
    '(mousedown)': 'clickFocus = true',
    '(focusin)': 'onFocus($event)',
    '(focusout)': 'onFocusOut()',
  },
  template: `<ng-content />`,
})
export class UiMenubarComponent {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  @Input('class') className?: string
  /** The open menu's `value` ('' when every menu is closed). */
  @Input() value?: string
  @Input() defaultValue = ''
  @Input({ transform: booleanAttribute }) loop = true
  @Input() dir: MenubarDir = 'ltr'
  @Output() valueChange = new EventEmitter<string>()

  private readonly _value = signal<string | null>(null)
  /** Roving tab stop: the trigger Tab lands on (the last focused / opened one). */
  readonly tabStop = signal<string | null>(null)
  readonly menus = new Map<HTMLElement, UiMenubarMenuComponent>()
  tabbingBackOut = false
  clickFocus = false

  get currentValue(): string {
    return this.value ?? this._value() ?? this.defaultValue
  }

  get hostClass(): string {
    return cn('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs', this.className)
  }

  setValue(value: string): void {
    const previous = this.currentValue
    if (value === previous) return
    this._value.set(value)
    this.valueChange.emit(value)
    for (const menu of this.menus.values()) if (menu.value === previous || menu.value === value) menu.sync()
  }

  /** Radix `onMenuOpen`: open this menu (closing any other) and make its trigger the tab stop. */
  openMenu(value: string): void {
    this.setValue(value)
    this.tabStop.set(value)
  }

  closeMenus(): void {
    this.setValue('')
  }

  /** Triggers in DOM order (the roving-focus / ArrowLeft-Right order). */
  triggers(): { el: HTMLElement; menu: UiMenubarMenuComponent }[] {
    return [...this.el.nativeElement.querySelectorAll<HTMLElement>('[data-slot="menubar-trigger"]')]
      .map((el) => ({ el, menu: this.menus.get(el)! }))
      .filter((t) => !!t.menu)
  }

  enabledTriggers(): { el: HTMLElement; menu: UiMenubarMenuComponent }[] {
    return this.triggers().filter((t) => !t.el.hasAttribute('data-disabled'))
  }

  /** Radix RovingFocusGroup entry: tabbing onto the bar lands on the tab-stop trigger. */
  onFocus(event: FocusEvent): void {
    const isKeyboardFocus = !this.clickFocus
    this.clickFocus = false
    if (event.target !== this.el.nativeElement || !isKeyboardFocus) return
    const items = this.enabledTriggers()
    const target = items.find((t) => t.menu.value === this.tabStop()) ?? items[0]
    target?.el.focus()
  }

  /** Arrow / Home / End between triggers (horizontal roving focus). */
  moveFocus(from: HTMLElement, key: string): boolean {
    const items = this.enabledTriggers().map((t) => t.el)
    const i = items.indexOf(from)
    const prev = this.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    const next = this.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    let target: number
    if (key === next) target = i + 1
    else if (key === prev) target = i - 1
    else if (key === 'Home' || key === 'PageUp') target = 0
    else if (key === 'End' || key === 'PageDown') target = items.length - 1
    else return false
    if (this.loop) target = (target + items.length) % items.length
    else target = Math.min(Math.max(target, 0), items.length - 1)
    items[target]?.focus()
    return true
  }

  onFocusOut(): void {
    this.tabbingBackOut = false
    this.el.nativeElement.setAttribute('tabindex', this.menus.size ? '0' : '-1')
  }

  /** Shift+Tab out of the bar must not land on the bar itself (Radix `isTabbingBackOut`). */
  tabBackOut(): void {
    this.tabbingBackOut = true
    this.el.nativeElement.setAttribute('tabindex', '-1')
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-menu, [ui-menubar-menu]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar-menu"',
    '[attr.data-uipkge]': '""',
    // Radix Menu renders no element: keep the wrapper out of layout.
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiMenubarMenuComponent implements OnInit {
  readonly bar = inject(UiMenubarComponent)
  /** Identifies the menu in the bar's `value`; auto-generated when not set. */
  @Input() value = ''
  readonly triggerId = uniqueId('menubar-trigger')
  readonly contentId = uniqueId('menubar-content')
  trigger?: HTMLElement
  content?: UiMenubarContentComponent
  /** Radix `wasKeyboardTriggerOpenRef`: Enter / Space / ArrowDown on the trigger focus the first item. */
  wasKeyboardTriggerOpen = false

  ngOnInit(): void {
    if (!this.value) this.value = uniqueId('menubar-menu')
  }

  get dir(): MenubarDir {
    return this.bar.dir
  }

  get isOpen(): boolean {
    return !!this.value && this.bar.currentValue === this.value
  }

  /** Item family API (select closes, Escape closes). */
  setOpen(value: boolean): void {
    if (value) this.bar.openMenu(this.value)
    else if (this.isOpen) this.bar.closeMenus()
  }

  sync(): void {
    if (!this.isOpen) this.wasKeyboardTriggerOpen = false
    this.content?.sync()
  }
}

/** A directive, so it sits on any `<button>` (Radix renders one) and keeps its projected label. */
@Directive({
  selector: 'ui-menubar-trigger, [ui-menubar-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.type]': 'isButton ? "button" : null',
    '[attr.role]': '"menuitem"',
    '[attr.id]': 'menu.triggerId',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'menu.isOpen',
    '[attr.aria-controls]': 'menu.isOpen ? menu.contentId : null',
    '[attr.data-highlighted]': 'focused ? "" : null',
    '[attr.data-state]': 'menu.isOpen ? "open" : "closed"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.disabled]': 'disabled && isButton ? "" : null',
    '[attr.data-orientation]': '"horizontal"',
    '[attr.tabindex]': 'menu.bar.tabStop() === menu.value ? 0 : -1',
    '[class]': 'hostClass',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerenter)': 'onPointerEnter()',
    '(mousedown)': 'onMouseDown($event)',
    '(keydown)': 'onKeydown($event)',
    '(focus)': 'onFocus()',
    '(blur)': 'focused = false',
  },
})
export class UiMenubarTriggerComponent implements OnDestroy {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'menubar-trigger'
  readonly menu = inject(UiMenubarMenuComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) disabled = false
  focused = false
  readonly isButton = this.el.nativeElement.tagName === 'BUTTON'

  constructor() {
    this.menu.trigger = this.el.nativeElement
    this.menu.bar.menus.set(this.el.nativeElement, this.menu)
  }

  get hostClass(): string {
    return cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none',
      this.className,
    )
  }

  /** Left press toggles (ctrl+click is a macOS right-click, so it is ignored). */
  onPointerDown(event: PointerEvent): void {
    if (this.disabled || event.button !== 0 || event.ctrlKey) return
    if (this.menu.isOpen) {
      // Radix: the open menu's dismissable layer closes it on a press of its own trigger.
      this.menu.content?.markInteractedOutside()
      this.menu.setOpen(false)
      return
    }
    this.menu.bar.openMenu(this.menu.value)
    // Keep focus off the trigger so the opening menu can take it.
    event.preventDefault()
  }

  /** While any menu is open, hovering another trigger switches to its menu. */
  onPointerEnter(): void {
    if (this.disabled || !this.menu.bar.currentValue || this.menu.isOpen) return
    this.menu.bar.openMenu(this.menu.value)
    this.el.nativeElement.focus()
  }

  /** Radix RovingFocusGroup item: a non-focusable (disabled) trigger never takes focus. */
  onMouseDown(event: MouseEvent): void {
    if (this.disabled) event.preventDefault()
  }

  onFocus(): void {
    this.focused = true
    this.menu.bar.tabStop.set(this.menu.value)
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    if (event.key === 'Tab' && event.shiftKey) return this.menu.bar.tabBackOut()
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      // Set before opening: the menu reads it to decide whether the first item takes focus.
      this.menu.wasKeyboardTriggerOpen = true
      if (event.key === 'ArrowDown' || !this.menu.isOpen) this.menu.bar.openMenu(this.menu.value)
      else this.menu.setOpen(false)
      return
    }
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    if (this.menu.bar.moveFocus(this.el.nativeElement, event.key)) event.preventDefault()
  }

  ngOnDestroy(): void {
    this.menu.bar.menus.delete(this.el.nativeElement)
  }
}

export const MENUBAR_CONTENT_CLASS =
  'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-content, [ui-menubar-content]',
  standalone: true,
  // The host stays where it is declared (no box); the menu itself renders in a body portal.
  host: { class: 'hidden' },
  template: `
    <ng-template #panelTpl>
      <div
        [id]="menu.contentId"
        [attr.aria-labelledby]="menu.triggerId"
        role="menu"
        aria-orientation="vertical"
        data-orientation="vertical"
        tabindex="-1"
        data-radix-menubar-content=""
        data-slot="menubar-content"
        data-uipkge=""
        [attr.dir]="menu.dir"
        [attr.data-state]="state()"
        [class]="panelClass"
        (keydown)="onKeydown($event)"
        (pointermove)="panel.pointerMove($event)"
        (focus)="panel.focusMoved($event.target)"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiMenubarContentComponent implements OnDestroy {
  readonly menu = inject(UiMenubarMenuComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() side: MenubarSide = 'bottom'
  @Input() align: MenubarAlign = 'start'
  @Input() sideOffset = 8
  @Input() alignOffset = -4
  @Input({ transform: booleanAttribute }) avoidCollisions = true
  @Input() collisionPadding = 0
  @Input({ transform: booleanAttribute }) loop = false
  /** Radix `onCloseAutoFocus`: `preventDefault()` keeps focus where it is after closing. */
  @Output() closeAutoFocus = new EventEmitter<Event>()

  @ViewChild('panelTpl', { static: true }) panelTpl!: TemplateRef<unknown>
  readonly panel = new MenuPanel(() => this.loop)
  readonly state = signal<'open' | 'closed'>('closed')
  private cleanups: (() => void)[] = []
  private interactedOutside = false

  constructor() {
    this.menu.content = this
  }

  get panelEl(): HTMLElement | undefined {
    return this.panel.el
  }

  get panelClass(): string {
    return cn(MENUBAR_CONTENT_CLASS, this.className)
  }

  markInteractedOutside(): void {
    this.interactedOutside = true
  }

  /** Mirrors the bar's open value into the portal (called by the bar on every change). */
  sync(): void {
    if (this.menu.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.menu.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    const trigger = this.menu.trigger
    if (!trigger) return
    this.interactedOutside = false
    this.state.set('open')
    const panel = this.portal.attach(this.panelTpl).firstElementChild as HTMLElement
    this.panel.el = panel
    this.cleanups.push(
      placeAndTrack(
        trigger,
        panel,
        () => ({
          side: this.side,
          align: this.align,
          sideOffset: this.sideOffset,
          alignOffset: this.alignOffset,
          collisionPadding: this.collisionPadding,
          avoidCollisions: this.avoidCollisions,
        }),
        'menubar',
      ),
      pushDismissableLayer({
        contains: (t) => panel.contains(t) || trigger.contains(t) || !!this.panel.openSub?.containsTarget(t),
        onEscape: () => this.menu.setOpen(false),
        onPointerDownOutside: () => {
          this.interactedOutside = true
          this.menu.setOpen(false)
        },
      }),
      () => this.panel.destroy(),
    )
    const keyboard = this.menu.wasKeyboardTriggerOpen
    queueMicrotask(() => {
      this.panel.focusPanel()
      if (keyboard) this.panel.focusFirst()
    })
  }

  private async hide(): Promise<void> {
    this.panel.openSub?.setOpen(false)
    this.state.set('closed')
    const panel = this.panel.el
    const hadFocus = !!panel?.contains(document.activeElement)
    this.cleanups.splice(0).forEach((fn) => fn())
    // Radix: focus goes back to the trigger only when the whole bar closed (not a switch) from inside.
    const returnToTrigger = !this.menu.bar.currentValue && !this.interactedOutside
    this.interactedOutside = false
    const event = new Event('closeAutoFocus', { cancelable: true })
    this.closeAutoFocus.emit(event)
    if (returnToTrigger && hadFocus && !event.defaultPrevented) this.menu.trigger?.focus({ preventScroll: true })
    await afterExitAnimation(panel)
    if (this.menu.isOpen) return
    this.portal.detach()
    this.panel.el = undefined
  }

  /** ArrowLeft / ArrowRight move to the previous / next menu in the bar (not from sub-triggers / submenus). */
  onKeydown(event: KeyboardEvent): void {
    this.panel.keydown(event)
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    const target = event.target as HTMLElement
    const prevKey = this.menu.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    const isPrev = event.key === prevKey
    if (!isPrev && target.hasAttribute('data-radix-menubar-subtrigger')) return
    if (isPrev && target.closest('[data-radix-menubar-content]') !== this.panel.el) return
    const bar = this.menu.bar
    let values = bar.enabledTriggers().map((t) => t.menu.value)
    if (isPrev) values.reverse()
    const i = values.indexOf(this.menu.value)
    values = bar.loop ? [...values.slice(i + 1), ...values.slice(0, i + 1)] : values.slice(i + 1)
    const next = values[0]
    if (next && next !== this.menu.value) bar.openMenu(next)
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

/** Radix Portal part: content already renders in a body portal, so this only groups. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-portal, [ui-menubar-portal]',
  standalone: true,
  host: { class: 'contents' },
  template: `<ng-content />`,
})
export class UiMenubarPortalComponent {}

// ---------------------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------------------

type ParentContent = UiMenubarContentComponent | UiMenubarSubContentComponent

/** Shared item behaviour (select, keyboard, pointer highlight). Host metadata lives on each concrete item. */
@Directive()
abstract class MenubarItemBase {
  protected readonly menu = inject(UiMenubarMenuComponent)
  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  protected readonly parent: ParentContent | null =
    inject(UiMenubarSubContentComponent, { optional: true }) ?? inject(UiMenubarContentComponent, { optional: true })
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) disabled = false
  /** Text used by typeahead when the item's text content is not what users type. */
  @Input() textValue?: string
  /** Radix `onSelect`: call `event.preventDefault()` to keep the menu open. */
  @Output() select = new EventEmitter<Event>()
  highlighted = false
  private pointerWentDown = false

  onClick(): void {
    if (this.disabled) return
    const event = new Event('select', { cancelable: true })
    this.select.emit(event)
    this.afterSelect()
    if (!event.defaultPrevented) this.menu.setOpen(false)
  }

  /** Hook for checkbox / radio items to update their state before the menu closes. */
  protected afterSelect(): void {}

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    if (event.key === ' ' && this.parent?.panel.search) return
    if (event.key === 'Enter' || event.key === ' ') {
      this.el.nativeElement.click()
      event.preventDefault()
    }
  }

  onPointerDown(): void {
    this.pointerWentDown = true
  }

  /** Press on the trigger, release on an item (right-drag-release) selects it, like Radix. */
  onPointerUp(): void {
    if (!this.pointerWentDown) this.el.nativeElement.click()
  }

  onPointerMove(event: PointerEvent): void {
    if (!isMouse(event) || !this.parent) return
    if (this.disabled) return this.parent.panel.itemLeave(event)
    if (this.parent.panel.isMovingToSub(event)) return
    if (document.activeElement !== this.el.nativeElement) this.el.nativeElement.focus({ preventScroll: true })
  }

  onPointerLeave(event: PointerEvent): void {
    if (isMouse(event)) this.parent?.panel.itemLeave(event)
  }

  onFocus(): void {
    this.highlighted = true
    this.parent?.panel.focusMoved(this.el.nativeElement)
  }

  onBlur(): void {
    this.highlighted = false
  }
}

const ITEM_HOST = {
  '[attr.data-uipkge]': '""',
  '[attr.tabindex]': '"-1"',
  '[attr.data-orientation]': '"vertical"',
  '[attr.data-highlighted]': 'highlighted ? "" : null',
  '[attr.data-disabled]': 'disabled ? "" : null',
  '[attr.aria-disabled]': 'disabled || null',
  '[attr.data-text-value]': 'textValue ?? null',
  '[class]': 'hostClass',
  '(click)': 'onClick()',
  '(keydown)': 'onKeydown($event)',
  '(pointerdown)': 'onPointerDown()',
  '(pointerup)': 'onPointerUp()',
  '(pointermove)': 'onPointerMove($event)',
  '(pointerleave)': 'onPointerLeave($event)',
  '(focus)': 'onFocus()',
  '(blur)': 'onBlur()',
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-item, [ui-menubar-item]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"menubar-item"',
    '[attr.role]': '"menuitem"',
    '[attr.data-variant]': 'variant',
    '[attr.data-inset]': 'inset ? "" : null',
  },
  template: `<ng-content />`,
})
export class UiMenubarItemComponent extends MenubarItemBase {
  @Input({ transform: booleanAttribute }) inset = false
  @Input() variant: MenubarItemVariant = 'default'

  get hostClass(): string {
    return cn(
      "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:[&>svg,&>lucide-icon>svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.className,
    )
  }
}

const CHECKABLE_ITEM_CLASS =
  "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-checkbox-item, [ui-menubar-checkbox-item]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"menubar-checkbox-item"',
    '[attr.role]': '"menuitemcheckbox"',
    '[attr.aria-checked]': 'checked === "indeterminate" ? "mixed" : checked',
    '[attr.data-state]': 'checkedState',
  },
  template: `
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (checked) {
        <span [attr.data-state]="checkedState"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-check size-4"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" /></svg
        ></span>
      }
    </span>
    <ng-content />
  `,
})
export class UiMenubarCheckboxItemComponent extends MenubarItemBase {
  private readonly _checkedProp = signal<MenubarCheckedState | undefined>(undefined)
  private readonly _internal = signal<MenubarCheckedState | null>(null)
  /** Controlled checked state (pair with `checkedChange` for `[(checked)]`). */
  @Input()
  set checked(v: MenubarCheckedState | undefined) {
    this._checkedProp.set(v)
  }
  get checked(): MenubarCheckedState {
    return this._checkedProp() ?? this._internal() ?? this.defaultChecked
  }
  /** Uncontrolled initial state (Radix `defaultChecked`). */
  @Input() defaultChecked: MenubarCheckedState = false
  @Output() checkedChange = new EventEmitter<boolean>()

  get checkedState(): 'checked' | 'unchecked' | 'indeterminate' {
    return this.checked === 'indeterminate' ? 'indeterminate' : this.checked ? 'checked' : 'unchecked'
  }

  get hostClass(): string {
    return cn(CHECKABLE_ITEM_CLASS, this.className)
  }

  protected override afterSelect(): void {
    const next = this.checked === 'indeterminate' ? true : !this.checked
    if (this._checkedProp() === undefined) this._internal.set(next)
    this.checkedChange.emit(next)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-radio-group, [ui-menubar-radio-group]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar-radio-group"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    class: 'block',
  },
  template: `<ng-content />`,
})
export class UiMenubarRadioGroupComponent {
  private readonly _valueProp = signal<string | undefined>(undefined)
  private readonly _internal = signal<string | null>(null)
  /** Controlled value (pair with `valueChange` for `[(value)]`). */
  @Input()
  set value(v: string | undefined) {
    this._valueProp.set(v ?? undefined)
  }
  get value(): string | undefined {
    return this._valueProp() ?? this._internal() ?? this.defaultValue
  }
  /** Uncontrolled initial value (Radix `defaultValue`). */
  @Input() defaultValue?: string
  @Output() valueChange = new EventEmitter<string>()

  setValue(value: string): void {
    if (this._valueProp() === undefined) this._internal.set(value)
    this.valueChange.emit(value)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-radio-item, [ui-menubar-radio-item]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"menubar-radio-item"',
    '[attr.role]': '"menuitemradio"',
    '[attr.aria-checked]': 'isChecked',
    '[attr.data-state]': 'isChecked ? "checked" : "unchecked"',
  },
  template: `
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (isChecked) {
        <span data-state="checked"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-circle size-2 fill-current"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" /></svg
        ></span>
      }
    </span>
    <ng-content />
  `,
})
export class UiMenubarRadioItemComponent extends MenubarItemBase {
  private readonly group = inject(UiMenubarRadioGroupComponent, { optional: true })
  @Input() value = ''

  get isChecked(): boolean {
    return !!this.group && this.group.value === this.value
  }

  get hostClass(): string {
    return cn(CHECKABLE_ITEM_CLASS, this.className)
  }

  protected override afterSelect(): void {
    this.group?.setValue(this.value)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-label, [ui-menubar-label]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar-label"',
    '[attr.data-uipkge]': '""',
    '[attr.data-inset]': 'inset ? "" : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiMenubarLabelComponent {
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) inset = false

  get hostClass(): string {
    return cn('block px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-separator, [ui-menubar-separator]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar-separator"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': '"horizontal"',
    '[class]': 'hostClass',
  },
  template: ``,
})
export class UiMenubarSeparatorComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block bg-border -mx-1 my-1 h-px', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-shortcut, [ui-menubar-shortcut]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar-shortcut"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiMenubarShortcutComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-muted-foreground ml-auto text-xs tracking-widest', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-group, [ui-menubar-group]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar-group"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    class: 'block',
  },
  template: `<ng-content />`,
})
export class UiMenubarGroupComponent {}

// ---------------------------------------------------------------------------------------
// Submenus
// ---------------------------------------------------------------------------------------

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-sub, [ui-menubar-sub]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"menubar-sub"',
    '[attr.data-uipkge]': '""',
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiMenubarSubComponent implements OnChanges {
  private readonly parent: ParentContent | null =
    inject(UiMenubarSubContentComponent, { optional: true }) ?? inject(UiMenubarContentComponent, { optional: true })
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('menubar-sub-content')
  private readonly _open = signal<boolean | null>(null)
  trigger?: HTMLElement
  content?: UiMenubarSubContentComponent

  get isOpen(): boolean {
    if (this.open !== undefined) return this.open
    return this._open() ?? this.defaultOpen
  }

  ngOnChanges(): void {
    this.content?.sync()
  }

  setOpen(value: boolean): void {
    if (value === this.isOpen) return
    this._open.set(value)
    this.openChange.emit(value)
    if (this.parent) {
      if (value) this.parent.panel.openSub = this
      else if (this.parent.panel.openSub === this) this.parent.panel.openSub = undefined
    }
    this.content?.sync()
  }

  containsTarget(target: Node): boolean {
    return !!this.content?.panelEl?.contains(target) || !!this.content?.panel.openSub?.containsTarget(target)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-sub-trigger, [ui-menubar-sub-trigger]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"menubar-sub-trigger"',
    '[attr.data-radix-menubar-subtrigger]': '""',
    '[attr.role]': '"menuitem"',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'sub.isOpen',
    '[attr.aria-controls]': 'sub.isOpen ? sub.contentId : null',
    '[attr.data-state]': 'sub.isOpen ? "open" : "closed"',
    '[attr.data-inset]': 'inset ? "" : null',
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
      class="lucide lucide-chevron-right ml-auto size-4"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>`,
})
export class UiMenubarSubTriggerComponent extends MenubarItemBase implements OnDestroy {
  readonly sub = inject(UiMenubarSubComponent)
  @Input({ transform: booleanAttribute }) inset = false
  private openTimer: ReturnType<typeof setTimeout> | undefined

  constructor() {
    super()
    this.sub.trigger = this.el.nativeElement
  }

  get hostClass(): string {
    return cn(
      'focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8',
      this.className,
    )
  }

  private openSub(): void {
    this.sub.setOpen(true)
  }

  /** Click focuses and opens; it never selects / closes the menu. */
  override onClick(): void {
    if (this.disabled) return
    this.el.nativeElement.focus({ preventScroll: true })
    if (!this.sub.isOpen) this.openSub()
  }

  override onPointerUp(): void {}

  /** Hover opens after 100ms (Radix), unless the pointer is heading into another open submenu. */
  override onPointerMove(event: PointerEvent): void {
    super.onPointerMove(event)
    if (!isMouse(event) || event.defaultPrevented || this.disabled || this.sub.isOpen || this.openTimer) return
    if (this.parent?.panel.isMovingToSub(event)) return
    this.parent?.panel.setGrace(null)
    this.openTimer = setTimeout(() => {
      this.openTimer = undefined
      this.openSub()
    }, 100)
  }

  /** Leaving toward the open submenu keeps it open through a triangle grace area. */
  override onPointerLeave(event: PointerEvent): void {
    if (!isMouse(event)) return
    clearTimeout(this.openTimer)
    this.openTimer = undefined
    const content = this.sub.content?.panelEl
    if (!this.sub.isOpen || !content) return this.parent?.panel.itemLeave(event)
    const rect = content.getBoundingClientRect()
    const right = (content.getAttribute('data-side') ?? 'right') === 'right'
    const near = right ? rect.left : rect.right
    const far = right ? rect.right : rect.left
    this.parent?.panel.setGrace({
      side: right ? 'right' : 'left',
      area: [
        { x: event.clientX + (right ? -5 : 5), y: event.clientY },
        { x: near, y: rect.top },
        { x: far, y: rect.top },
        { x: far, y: rect.bottom },
        { x: near, y: rect.bottom },
      ],
    })
  }

  override onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    if (event.key === ' ' && this.parent?.panel.search) return
    const openKey = this.menu.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    if (event.key === 'Enter' || event.key === ' ' || event.key === openKey) {
      event.preventDefault()
      event.stopPropagation()
      this.openSub()
      this.sub.content?.focusFirstWhenOpen()
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.openTimer)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-menubar-sub-content, [ui-menubar-sub-content]',
  standalone: true,
  host: { class: 'hidden' },
  template: `
    <ng-template #panelTpl>
      <div
        [id]="sub.contentId"
        role="menu"
        aria-orientation="vertical"
        data-orientation="vertical"
        tabindex="-1"
        data-radix-menubar-content=""
        data-slot="menubar-sub-content"
        data-uipkge=""
        [attr.dir]="menu.dir"
        [attr.data-state]="state()"
        [class]="panelClass"
        (keydown)="onKeydown($event)"
        (pointermove)="panel.pointerMove($event)"
        (focus)="panel.focusMoved($event.target)"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiMenubarSubContentComponent implements OnDestroy {
  readonly sub = inject(UiMenubarSubComponent)
  readonly menu = inject(UiMenubarMenuComponent)
  private readonly parent: ParentContent | null =
    inject(UiMenubarSubContentComponent, { optional: true, skipSelf: true }) ??
    inject(UiMenubarContentComponent, { optional: true })
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() sideOffset = 0
  @Input() alignOffset = 0
  @Input({ transform: booleanAttribute }) avoidCollisions = true
  @Input() collisionPadding = 0
  @Input({ transform: booleanAttribute }) loop = false
  @ViewChild('panelTpl', { static: true }) panelTpl!: TemplateRef<unknown>
  readonly panel = new MenuPanel(() => this.loop)
  readonly state = signal<'open' | 'closed'>('closed')
  private cleanups: (() => void)[] = []

  constructor() {
    this.sub.content = this
  }

  get panelEl(): HTMLElement | undefined {
    return this.panel.el
  }

  get panelClass(): string {
    return cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
      this.className,
    )
  }

  sync(): void {
    if (this.sub.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.sub.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  /** Keyboard opens (ArrowRight / Enter / Space on the sub-trigger) land on the first item. */
  focusFirstWhenOpen(): void {
    queueMicrotask(() => this.panel.focusFirst())
  }

  private show(): void {
    const trigger = this.sub.trigger
    if (!trigger) return
    this.state.set('open')
    const panel = this.portal.attach(this.panelTpl).firstElementChild as HTMLElement
    this.panel.el = panel
    this.cleanups.push(
      placeAndTrack(
        trigger,
        panel,
        () => ({
          side: this.menu.dir === 'rtl' ? 'left' : 'right',
          align: 'start',
          sideOffset: this.sideOffset,
          alignOffset: this.alignOffset,
          collisionPadding: this.collisionPadding,
          avoidCollisions: this.avoidCollisions,
        }),
        'menubar',
      ),
      pushDismissableLayer({
        contains: (t) => panel.contains(t) || trigger.contains(t) || !!this.panel.openSub?.containsTarget(t),
        // Radix: Escape inside a submenu closes the whole menu.
        onEscape: () => this.menu.setOpen(false),
        // Clicking back inside the parent menu closes only this submenu; anywhere else closes the whole menu.
        onPointerDownOutside: (e) => {
          if (this.parent?.panelEl?.contains(e.target as Node)) this.sub.setOpen(false)
          else this.menu.setOpen(false)
        },
      }),
      () => this.panel.destroy(),
    )
  }

  private async hide(): Promise<void> {
    this.panel.openSub?.setOpen(false)
    this.state.set('closed')
    const panel = this.panel.el
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(panel)
    if (this.sub.isOpen) return
    this.portal.detach()
    this.panel.el = undefined
  }

  onKeydown(event: KeyboardEvent): void {
    const closeKey = this.menu.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === closeKey && this.panel.el?.contains(event.target as Node)) {
      event.preventDefault()
      this.sub.setOpen(false)
      this.sub.trigger?.focus({ preventScroll: true })
      return
    }
    this.panel.keydown(event)
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

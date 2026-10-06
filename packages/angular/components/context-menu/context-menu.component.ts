import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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
  lockScroll,
  pushDismissableLayer,
  uniqueId,
  type PlaceOptions,
} from '@/ui/popper/popper'
import { contextMenuItemVariants, type ContextMenuItemVariants } from './context-menu-item.variants'

export type ContextMenuItemVariant = NonNullable<ContextMenuItemVariants['variant']>
export type ContextMenuCheckedState = boolean | 'indeterminate'
export type ContextMenuDir = 'ltr' | 'rtl'

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
 * Angular port of UIPKGE Context Menu with Radix ContextMenu behaviour: a right-click
 * (or a 700ms touch / pen long-press) on the trigger opens a body-portalled menu at the
 * pointer, flipped / shifted to stay on screen. Arrow keys / Home / End / typeahead
 * rove between items, Enter / Space select, Escape and outside pointer-downs dismiss,
 * selecting an item closes the menu unless its handler prevents it, and submenus open
 * on hover (with Radix's pointer grace area) or ArrowRight. Class strings are identical
 * to the React source.
 */

// ---------------------------------------------------------------------------------------
// Shared menu machinery (Radix Menu): input modality, roving focus, typeahead, grace area.
// ---------------------------------------------------------------------------------------

/** Radix `isUsingKeyboardRef`: keyboard opens focus the first item, pointer opens focus the menu. */
let usingKeyboard = false
let trackingModality = false
function trackModality(): void {
  if (trackingModality || typeof document === 'undefined') return
  trackingModality = true
  document.addEventListener('keydown', () => (usingKeyboard = true), true)
  const pointer = () => (usingKeyboard = false)
  document.addEventListener('pointerdown', pointer, true)
  document.addEventListener('pointermove', pointer, true)
}

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
  openSub?: UiContextMenuSubComponent
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

/** Zero-size anchor at the pointer (Radix's virtual element) that the popper can observe. */
function pointAnchor(point: () => Point): Element {
  const el = document.createElement('span')
  el.getBoundingClientRect = () => {
    const { x, y } = point()
    return { x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0, toJSON: () => ({}) } as DOMRect
  }
  return el
}

// ---------------------------------------------------------------------------------------
// Root, trigger, content
// ---------------------------------------------------------------------------------------

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu, [ui-context-menu]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"context-menu"',
    '[attr.data-uipkge]': '""',
    // Radix Root renders no element: keep the wrapper out of layout.
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiContextMenuComponent implements OnChanges {
  /** Radix allows controlling `open`; the position is the last right-click / long-press point. */
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input({ transform: booleanAttribute }) modal = true
  @Input() dir: ContextMenuDir = 'ltr'
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('context-menu-content')
  private readonly _open = signal<boolean | null>(null)
  point: Point = { x: 0, y: 0 }
  content?: UiContextMenuContentComponent
  openedWith: 'keyboard' | 'pointer' = 'pointer'

  constructor() {
    trackModality()
  }

  get isOpen(): boolean {
    if (this.open !== undefined) return this.open
    return this._open() ?? this.defaultOpen
  }

  ngOnChanges(): void {
    this.content?.sync()
  }

  setOpen(value: boolean): void {
    if (value === this.isOpen) return
    if (value) this.openedWith = usingKeyboard ? 'keyboard' : 'pointer'
    this._open.set(value)
    this.openChange.emit(value)
    this.content?.sync()
  }

  /** Open at a viewport point (what the trigger does on contextmenu / long-press). */
  openAt(x: number, y: number): void {
    this.point = { x, y }
    this.setOpen(true)
  }
}

/** The area that responds to right-click. A directive, so it sits on any element (Radix `asChild`). */
@Directive({
  selector: 'ui-context-menu-trigger, [ui-context-menu-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'menu.isOpen ? "open" : "closed"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[style.-webkit-touch-callout]': '"none"',
    '(contextmenu)': 'onContextMenu($event)',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerEnd($event)',
    '(pointercancel)': 'onPointerEnd($event)',
    '(pointerup)': 'onPointerEnd($event)',
  },
})
export class UiContextMenuTriggerComponent implements OnChanges, OnDestroy {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'context-menu-trigger'
  readonly menu = inject(UiContextMenuComponent)
  @Input({ transform: booleanAttribute }) disabled = false
  private longPress: ReturnType<typeof setTimeout> | undefined

  ngOnChanges(): void {
    if (this.disabled) clearTimeout(this.longPress)
  }

  onContextMenu(event: MouseEvent): void {
    // Disabled: fall through to the browser's own menu, like Radix.
    if (this.disabled) return
    clearTimeout(this.longPress)
    this.menu.openAt(event.clientX, event.clientY)
    event.preventDefault()
  }

  /** Touch / pen: hold for 700ms to open (no contextmenu event on most touch browsers). */
  onPointerDown(event: PointerEvent): void {
    if (this.disabled || isMouse(event)) return
    clearTimeout(this.longPress)
    if (this.menu.isOpen) this.menu.setOpen(false)
    const { clientX, clientY } = event
    this.longPress = setTimeout(() => this.menu.openAt(clientX, clientY), 700)
  }

  onPointerEnd(event: PointerEvent): void {
    if (!this.disabled && !isMouse(event)) clearTimeout(this.longPress)
  }

  ngOnDestroy(): void {
    clearTimeout(this.longPress)
  }
}

export const CONTEXT_MENU_CONTENT_CLASS =
  'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-content, [ui-context-menu-content]',
  standalone: true,
  // The host stays where it is declared (no box); the menu itself renders in a body portal.
  host: { class: 'hidden' },
  template: `
    <ng-template #panelTpl>
      <div
        [id]="menu.contentId"
        role="menu"
        aria-orientation="vertical"
        data-orientation="vertical"
        tabindex="-1"
        data-slot="context-menu-content"
        data-uipkge=""
        [attr.dir]="menu.dir"
        [attr.data-state]="state()"
        [class]="panelClass"
        (keydown)="panel.keydown($event)"
        (pointermove)="panel.pointerMove($event)"
        (focus)="panel.focusMoved($event.target)"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiContextMenuContentComponent implements OnDestroy {
  readonly menu = inject(UiContextMenuComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() alignOffset = 0
  @Input({ transform: booleanAttribute }) avoidCollisions = true
  @Input() collisionPadding = 0
  @Input({ transform: booleanAttribute }) loop = false
  /** Radix `onCloseAutoFocus`: `preventDefault()` keeps focus where it is after closing. */
  @Output() closeAutoFocus = new EventEmitter<Event>()

  @ViewChild('panelTpl', { static: true }) panelTpl!: TemplateRef<unknown>
  readonly panel = new MenuPanel(() => this.loop)
  readonly state = signal<'open' | 'closed'>('closed')
  private cleanups: (() => void)[] = []
  private returnFocusTo: HTMLElement | null = null

  constructor() {
    this.menu.content = this
  }

  get panelEl(): HTMLElement | undefined {
    return this.panel.el
  }

  get panelClass(): string {
    return cn(CONTEXT_MENU_CONTENT_CLASS, this.className)
  }

  /** Mirrors root open state into the portal (called by the root on every change). */
  sync(): void {
    if (this.menu.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      // Reopened mid exit-animation (right-click elsewhere): drop the closing menu, start fresh.
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.menu.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    this.returnFocusTo = document.activeElement as HTMLElement | null
    this.state.set('open')
    const panel = this.portal.attach(this.panelTpl).firstElementChild as HTMLElement
    this.panel.el = panel
    const anchor = pointAnchor(() => this.menu.point)
    this.cleanups.push(
      placeAndTrack(
        anchor,
        panel,
        () => ({
          side: this.menu.dir === 'rtl' ? 'left' : 'right',
          align: 'start',
          sideOffset: 2,
          alignOffset: this.alignOffset,
          collisionPadding: this.collisionPadding,
          avoidCollisions: this.avoidCollisions,
        }),
        'context-menu',
      ),
      pushDismissableLayer({
        contains: (t) => panel.contains(t) || !!this.panel.openSub?.containsTarget(t),
        onEscape: () => this.menu.setOpen(false),
        onPointerDownOutside: () => this.menu.setOpen(false),
      }),
      () => this.panel.destroy(),
    )
    if (this.menu.modal) this.cleanups.push(lockScroll())
    const keyboard = this.menu.openedWith === 'keyboard'
    queueMicrotask(() => {
      this.panel.focusPanel()
      if (keyboard) this.panel.focusFirst()
    })
  }

  private async hide(): Promise<void> {
    this.panel.openSub?.setOpen(false)
    this.state.set('closed')
    const panel = this.panel.el
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(panel)
    if (this.menu.isOpen) return
    const active = document.activeElement
    const focusWasInMenu = !active || active === document.body || !!panel?.contains(active)
    this.portal.detach()
    this.panel.el = undefined
    const event = new Event('closeAutoFocus', { cancelable: true })
    this.closeAutoFocus.emit(event)
    // Radix FocusScope: hand focus back to whatever had it before the menu opened.
    if (focusWasInMenu && !event.defaultPrevented) this.returnFocusTo?.focus?.({ preventScroll: true })
    this.returnFocusTo = null
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

/** Radix `asChild`-free Portal part: content already renders in a body portal, so this only groups. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-portal, [ui-context-menu-portal]',
  standalone: true,
  host: { class: 'contents' },
  template: `<ng-content />`,
})
export class UiContextMenuPortalComponent {}

// ---------------------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------------------

type ParentContent = UiContextMenuContentComponent | UiContextMenuSubContentComponent

/** Shared item behaviour (select, keyboard, pointer highlight). Host metadata lives on each concrete item. */
@Directive()
abstract class ContextMenuItemBase {
  protected readonly menu = inject(UiContextMenuComponent)
  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  protected readonly parent: ParentContent | null =
    inject(UiContextMenuSubContentComponent, { optional: true }) ??
    inject(UiContextMenuContentComponent, { optional: true })
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
  selector: 'ui-context-menu-item, [ui-context-menu-item]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"context-menu-item"',
    '[attr.role]': '"menuitem"',
    '[attr.data-variant]': 'variant',
    '[attr.data-inset]': 'inset ? "" : null',
  },
  template: `<ng-content />`,
})
export class UiContextMenuItemComponent extends ContextMenuItemBase {
  @Input({ transform: booleanAttribute }) inset = false
  @Input() variant: ContextMenuItemVariant = 'default'

  get hostClass(): string {
    return cn(contextMenuItemVariants({ variant: this.variant, inset: this.inset }), this.className)
  }
}

const CHECKABLE_ITEM_CLASS =
  "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-checkbox-item, [ui-context-menu-checkbox-item]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"context-menu-checkbox-item"',
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
export class UiContextMenuCheckboxItemComponent extends ContextMenuItemBase {
  @Input() checked: ContextMenuCheckedState = false
  @Output() checkedChange = new EventEmitter<boolean>()

  get checkedState(): 'checked' | 'unchecked' | 'indeterminate' {
    return this.checked === 'indeterminate' ? 'indeterminate' : this.checked ? 'checked' : 'unchecked'
  }

  get hostClass(): string {
    return cn(CHECKABLE_ITEM_CLASS, this.className)
  }

  protected override afterSelect(): void {
    this.checked = this.checked === 'indeterminate' ? true : !this.checked
    this.checkedChange.emit(this.checked)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-radio-group, [ui-context-menu-radio-group]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"context-menu-radio-group"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    class: 'block',
  },
  template: `<ng-content />`,
})
export class UiContextMenuRadioGroupComponent {
  @Input() value?: string
  @Output() valueChange = new EventEmitter<string>()

  setValue(value: string): void {
    this.value = value
    this.valueChange.emit(value)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-radio-item, [ui-context-menu-radio-item]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"context-menu-radio-item"',
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
export class UiContextMenuRadioItemComponent extends ContextMenuItemBase {
  private readonly group = inject(UiContextMenuRadioGroupComponent, { optional: true })
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
  selector: 'ui-context-menu-label, [ui-context-menu-label]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"context-menu-label"',
    '[attr.data-uipkge]': '""',
    '[attr.data-inset]': 'inset ? "" : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiContextMenuLabelComponent {
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) inset = false

  get hostClass(): string {
    return cn('block text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-separator, [ui-context-menu-separator]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"context-menu-separator"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': '"horizontal"',
    '[class]': 'hostClass',
  },
  template: ``,
})
export class UiContextMenuSeparatorComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block bg-border -mx-1 my-1 h-px', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-shortcut, [ui-context-menu-shortcut]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"context-menu-shortcut"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiContextMenuShortcutComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-muted-foreground ml-auto text-xs tracking-widest', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-group, [ui-context-menu-group]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"context-menu-group"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    class: 'block',
  },
  template: `<ng-content />`,
})
export class UiContextMenuGroupComponent {}

// ---------------------------------------------------------------------------------------
// Submenus
// ---------------------------------------------------------------------------------------

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-context-menu-sub, [ui-context-menu-sub]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"context-menu-sub"',
    '[attr.data-uipkge]': '""',
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiContextMenuSubComponent implements OnChanges {
  private readonly parent: ParentContent | null =
    inject(UiContextMenuSubContentComponent, { optional: true }) ??
    inject(UiContextMenuContentComponent, { optional: true })
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('context-menu-sub-content')
  private readonly _open = signal<boolean | null>(null)
  trigger?: HTMLElement
  content?: UiContextMenuSubContentComponent

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
  selector: 'ui-context-menu-sub-trigger, [ui-context-menu-sub-trigger]',
  standalone: true,
  host: {
    ...ITEM_HOST,
    '[attr.data-slot]': '"context-menu-sub-trigger"',
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
      class="lucide lucide-chevron-right ml-auto"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>`,
})
export class UiContextMenuSubTriggerComponent extends ContextMenuItemBase implements OnDestroy {
  readonly sub = inject(UiContextMenuSubComponent)
  @Input({ transform: booleanAttribute }) inset = false
  private openTimer: ReturnType<typeof setTimeout> | undefined

  constructor() {
    super()
    this.sub.trigger = this.el.nativeElement
  }

  get hostClass(): string {
    return cn(
      "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
  selector: 'ui-context-menu-sub-content, [ui-context-menu-sub-content]',
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
        data-slot="context-menu-sub-content"
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
export class UiContextMenuSubContentComponent implements OnDestroy {
  readonly sub = inject(UiContextMenuSubComponent)
  readonly menu = inject(UiContextMenuComponent)
  private readonly parent: ParentContent | null =
    inject(UiContextMenuSubContentComponent, { optional: true, skipSelf: true }) ??
    inject(UiContextMenuContentComponent, { optional: true })
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
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
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
        'context-menu',
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

export { contextMenuItemVariants, type ContextMenuItemVariants }

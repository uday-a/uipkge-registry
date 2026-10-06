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
  disableOutsidePointerEvents,
  lockScroll,
  pushDismissableLayer,
  uniqueId,
  type PopperAlign,
} from '@/ui/popper/popper'
import { dropdownMenuContentVariants } from './dropdown-menu-content.variants'

export type DropdownMenuSide = 'top' | 'right' | 'bottom' | 'left'
export type DropdownMenuAlign = PopperAlign
export type DropdownMenuItemVariant = 'default' | 'destructive'

/**
 * Angular port of UIPKGE Dropdown Menu, behaving like the Radix (React) / reka-ui
 * (Vue) menu: the trigger is a directive (the `asChild` equivalent -- put it on any
 * button), content renders in a body portal positioned against the trigger with
 * flip + shift, arrow keys / Home / End / typeahead move focus, Escape and outside
 * clicks dismiss, selecting an item closes the menu, and submenus open to the side.
 * Tailwind class strings are identical to the Vue / React sources.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu, [ui-dropdown-menu]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    // Radix Root renders no element: keep the wrapper out of layout.
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiDropdownMenuComponent implements OnChanges {
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input({ transform: booleanAttribute }) modal = true
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('dropdown-menu-content')
  private readonly _open = signal<boolean | null>(null)
  trigger?: HTMLElement
  content?: UiDropdownMenuContentComponent
  /** How the last open happened: keyboard opens focus the first item, pointer opens focus the menu. */
  openedWith: 'keyboard' | 'pointer' = 'pointer'
  focusLastOnOpen = false

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
    this.content?.sync()
  }

  toggle(): void {
    this.setOpen(!this.isOpen)
  }
}

@Directive({
  selector: 'ui-dropdown-menu-trigger, [ui-dropdown-menu-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'menu.isOpen',
    '[attr.aria-controls]': 'menu.isOpen ? menu.contentId : null',
    '[attr.data-state]': 'menu.isOpen ? "open" : "closed"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiDropdownMenuTriggerComponent {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'dropdown-menu-trigger'
  readonly menu = inject(UiDropdownMenuComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  @Input({ transform: booleanAttribute }) disabled = false

  constructor() {
    this.menu.trigger = this.el.nativeElement
  }

  onClick(): void {
    if (this.disabled) return
    this.menu.openedWith = 'pointer'
    this.menu.toggle()
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      this.menu.openedWith = 'keyboard'
      this.menu.focusLastOnOpen = event.key === 'ArrowUp'
      this.menu.setOpen(true)
    }
  }
}

/** Roving focus + typeahead shared by the root content and submenu content. */
function menuItems(panel: HTMLElement): HTMLElement[] {
  return [...panel.querySelectorAll<HTMLElement>('[role^="menuitem"]')].filter(
    (el) => !el.hasAttribute('data-disabled'),
  )
}

function handleMenuKeydown(event: KeyboardEvent, panel: HTMLElement, loop = false): void {
  const items = menuItems(panel)
  const current = items.indexOf(document.activeElement as HTMLElement)
  // Radix: arrows stop at the ends unless `loop` is set.
  const focusAt = (i: number) =>
    items[loop ? (i + items.length) % items.length : Math.max(0, Math.min(items.length - 1, i))]?.focus()
  if (event.key === 'ArrowDown') focusAt(current + 1)
  else if (event.key === 'ArrowUp') focusAt(current < 0 ? items.length - 1 : current - 1)
  else if (event.key === 'Home' || event.key === 'PageUp') focusAt(0)
  else if (event.key === 'End' || event.key === 'PageDown') focusAt(items.length - 1)
  else if (event.key === 'Tab') {
    /* Radix keeps focus inside an open menu. */
  } else if (event.key.length === 1 && /\S/.test(event.key) && !event.metaKey && !event.ctrlKey) {
    const q = event.key.toLowerCase()
    const order = [...items.slice(current + 1), ...items.slice(0, current + 1)]
    order.find((el) => el.textContent?.trim().toLowerCase().startsWith(q))?.focus()
    return
  } else return
  event.preventDefault()
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-content, [ui-dropdown-menu-content]',
  standalone: true,
  // The host stays where it is declared (no box); the menu itself renders in a body portal.
  host: { class: 'hidden' },
  template: `
    <ng-template #panel>
      <div
        #panelEl
        [id]="menu.contentId"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
        data-slot="dropdown-menu-content"
        data-uipkge=""
        [attr.data-state]="state()"
        [class]="panelClass"
        (keydown)="onKeydown($event)"
        (pointerleave)="onPointerLeave()"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiDropdownMenuContentComponent implements OnChanges, OnDestroy {
  readonly menu = inject(UiDropdownMenuComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() side: DropdownMenuSide = 'bottom'
  @Input() align: DropdownMenuAlign = 'center'
  @Input() sideOffset = 4
  @Input() alignOffset = 0
  /** Radix `loop`: arrow keys wrap from last to first item. */
  @Input({ transform: booleanAttribute }) loop = false
  @Input({ transform: booleanAttribute }) avoidCollisions = true
  @Input() collisionPadding = 0
  @Output() closeAutoFocus = new EventEmitter<Event>()

  @ViewChild('panel', { static: true }) panelTpl!: TemplateRef<unknown>
  panelEl?: HTMLElement
  readonly state = signal<'open' | 'closed'>('closed')
  openSub?: UiDropdownMenuSubComponent
  private cleanups: (() => void)[] = []

  constructor() {
    this.menu.content = this
  }

  get panelClass(): string {
    return cn(dropdownMenuContentVariants({ side: this.side }), this.className)
  }

  ngOnChanges(): void {
    if (this.portal.attached) this.sync()
  }

  /** Mirrors root open state into the portal (called by the root on every change). */
  sync(): void {
    if (this.menu.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      // Reopened mid exit-animation: drop the closing panel and start fresh.
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.menu.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    const trigger = this.menu.trigger
    if (!trigger) return
    this.state.set('open')
    const host = this.portal.attach(this.panelTpl)
    const panel = host.firstElementChild as HTMLElement
    this.panelEl = panel
    this.cleanups.push(
      autoPlace(trigger, panel, () => this.placeOptions(), 'dropdown-menu'),
      pushDismissableLayer({
        contains: (t) => panel.contains(t) || trigger.contains(t) || !!this.openSub?.containsTarget(t),
        onEscape: () => this.menu.setOpen(false),
        onPointerDownOutside: () => this.menu.setOpen(false),
      }),
    )
    if (this.menu.modal) this.cleanups.push(lockScroll(), disableOutsidePointerEvents(panel))
    queueMicrotask(() => {
      const items = menuItems(panel)
      if (this.menu.openedWith === 'keyboard' && items.length) {
        ;(this.menu.focusLastOnOpen ? items[items.length - 1] : items[0])!.focus()
      } else panel.focus({ preventScroll: true })
    })
  }

  private async hide(): Promise<void> {
    this.openSub?.setOpen(false)
    this.state.set('closed')
    const panel = this.panelEl
    const hadFocus = !!panel?.contains(document.activeElement)
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(panel)
    if (this.menu.isOpen) return
    this.portal.detach()
    this.panelEl = undefined
    const event = new Event('closeAutoFocus', { cancelable: true })
    this.closeAutoFocus.emit(event)
    if (hadFocus && !event.defaultPrevented) this.menu.trigger?.focus({ preventScroll: true })
  }

  private placeOptions() {
    return {
      side: this.side,
      align: this.align,
      sideOffset: this.sideOffset,
      alignOffset: this.alignOffset,
      collisionPadding: this.collisionPadding,
      avoidCollisions: this.avoidCollisions,
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.panelEl) handleMenuKeydown(event, this.panelEl, this.loop)
  }

  onPointerLeave(): void {
    if (!this.openSub?.isOpen) this.panelEl?.focus({ preventScroll: true })
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

/** Shared item behaviour (select, keyboard, pointer highlight). Host metadata lives on each concrete item. */
@Directive()
abstract class DropdownMenuItemBase {
  protected readonly menu = inject(UiDropdownMenuComponent)
  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly parentContent =
    inject(UiDropdownMenuSubContentComponent, { optional: true }) ??
    inject(UiDropdownMenuContentComponent, { optional: true })
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) inset = false
  @Input() variant: DropdownMenuItemVariant = 'default'
  @Input({ transform: booleanAttribute }) disabled = false
  /** Radix `onSelect`: call `event.preventDefault()` to keep the menu open. */
  @Output() select = new EventEmitter<Event>()

  onSelect(_event?: Event): void {
    if (this.disabled) return
    const event = new Event('select', { cancelable: true })
    this.beforeSelect()
    this.select.emit(event)
    if (!event.defaultPrevented) this.menu.setOpen(false)
  }

  /** Hook for checkbox / radio items to update their state before the menu closes. */
  protected beforeSelect(): void {}

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.onSelect()
    }
  }

  onPointerMove(): void {
    if (this.disabled) return
    this.parentContent?.openSub?.setOpen(false)
    if (document.activeElement !== this.el.nativeElement) this.el.nativeElement.focus({ preventScroll: true })
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-item, [ui-dropdown-menu-item]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-item"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"menuitem"',
    '[attr.data-variant]': 'variant',
    '[attr.data-inset]': 'inset ? "" : null',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.tabindex]': '"-1"',
    '[class]': 'hostClass',
    '(click)': 'onSelect($event)',
    '(keydown)': 'onKeydown($event)',
    '(pointermove)': 'onPointerMove()',
  },
  template: `<ng-content />`,
})
export class UiDropdownMenuItemComponent extends DropdownMenuItemBase {
  get hostClass(): string {
    return cn(
      "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:[&>svg,&>lucide-icon>svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-checkbox-item, [ui-dropdown-menu-checkbox-item]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-checkbox-item"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"menuitemcheckbox"',
    '[attr.aria-checked]': 'checked',
    '[attr.data-state]': 'checked ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.tabindex]': '"-1"',
    '[class]': 'hostClass',
    '(click)': 'onSelect($event)',
    '(keydown)': 'onKeydown($event)',
    '(pointermove)': 'onPointerMove()',
  },
  template: `
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (checked) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      }
    </span>
    <ng-content />
  `,
})
export class UiDropdownMenuCheckboxItemComponent extends DropdownMenuItemBase {
  @Input({ transform: booleanAttribute }) checked = false
  @Output() checkedChange = new EventEmitter<boolean>()

  get hostClass(): string {
    return cn(
      "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.className,
    )
  }

  protected override beforeSelect(): void {
    this.checked = !this.checked
    this.checkedChange.emit(this.checked)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-radio-group, [ui-dropdown-menu-radio-group]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-radio-group"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
  },
  template: `<ng-content />`,
})
export class UiDropdownMenuRadioGroupComponent {
  @Input() value?: string
  @Output() valueChange = new EventEmitter<string>()

  setValue(value: string): void {
    this.value = value
    this.valueChange.emit(value)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-radio-item, [ui-dropdown-menu-radio-item]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-radio-item"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"menuitemradio"',
    '[attr.aria-checked]': 'isChecked',
    '[attr.data-state]': 'isChecked ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.tabindex]': '"-1"',
    '[class]': 'hostClass',
    '(click)': 'onSelect($event)',
    '(keydown)': 'onKeydown($event)',
    '(pointermove)': 'onPointerMove()',
  },
  template: `
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (isChecked) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="2"
          class="size-2 fill-current"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      }
    </span>
    <ng-content />
  `,
})
export class UiDropdownMenuRadioItemComponent extends DropdownMenuItemBase {
  private readonly group = inject(UiDropdownMenuRadioGroupComponent, { optional: true })
  @Input() value?: string
  @Input({ transform: booleanAttribute }) checked = false

  get isChecked(): boolean {
    return this.group && this.value !== undefined ? this.group.value === this.value : this.checked
  }

  get hostClass(): string {
    return cn(
      "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.className,
    )
  }

  protected override beforeSelect(): void {
    if (this.group && this.value !== undefined) this.group.setValue(this.value)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-label, [ui-dropdown-menu-label]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-label"',
    '[attr.data-uipkge]': '""',
    '[attr.data-inset]': 'inset ? "" : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDropdownMenuLabelComponent {
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) inset = false

  get hostClass(): string {
    return cn('block px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-separator, [ui-dropdown-menu-separator]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-separator"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"separator"',
    '[class]': 'hostClass',
  },
  template: ``,
})
export class UiDropdownMenuSeparatorComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('bg-border -mx-1 my-1 block h-px', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-shortcut, [ui-dropdown-menu-shortcut]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-shortcut"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDropdownMenuShortcutComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-muted-foreground ml-auto text-xs tracking-widest', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-group, [ui-dropdown-menu-group]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-group"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    class: 'block',
  },
  template: `<ng-content />`,
})
export class UiDropdownMenuGroupComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-sub, [ui-dropdown-menu-sub]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-sub"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiDropdownMenuSubComponent implements OnChanges {
  private readonly parentContent =
    inject(UiDropdownMenuSubContentComponent, { optional: true, skipSelf: true }) ??
    inject(UiDropdownMenuContentComponent, { optional: true })
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('dropdown-menu-sub-content')
  private readonly _open = signal<boolean | null>(null)
  trigger?: HTMLElement
  content?: UiDropdownMenuSubContentComponent
  openedWith: 'keyboard' | 'pointer' = 'pointer'

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
    if (this.parentContent) this.parentContent.openSub = value ? this : undefined
    this.content?.sync()
  }

  containsTarget(target: Node): boolean {
    return !!this.content?.panelEl?.contains(target) || !!this.content?.openSub?.containsTarget(target)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-sub-trigger, [ui-dropdown-menu-sub-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dropdown-menu-sub-trigger"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"menuitem"',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'sub.isOpen',
    '[attr.aria-controls]': 'sub.isOpen ? sub.contentId : null',
    '[attr.data-state]': 'sub.isOpen ? "open" : "closed"',
    '[attr.data-inset]': 'inset ? "" : null',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.tabindex]': '"-1"',
    '[class]': 'hostClass',
    '(pointermove)': 'onPointerMove()',
    '(click)': 'openSub("pointer")',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content /><svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="ml-auto size-4"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>`,
})
export class UiDropdownMenuSubTriggerComponent {
  readonly sub = inject(UiDropdownMenuSubComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) inset = false
  @Input({ transform: booleanAttribute }) disabled = false

  constructor() {
    this.sub.trigger = this.el.nativeElement
  }

  get hostClass(): string {
    return cn(
      "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[variant=destructive]:[&>svg,&>lucide-icon>svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.className,
    )
  }

  openSub(how: 'keyboard' | 'pointer'): void {
    if (this.disabled) return
    this.sub.openedWith = how
    this.sub.setOpen(true)
  }

  onPointerMove(): void {
    if (this.disabled) return
    if (document.activeElement !== this.el.nativeElement) this.el.nativeElement.focus({ preventScroll: true })
    this.openSub('pointer')
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      this.openSub('keyboard')
    }
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dropdown-menu-sub-content, [ui-dropdown-menu-sub-content]',
  standalone: true,
  host: { class: 'hidden' },
  template: `
    <ng-template #panel>
      <div
        [id]="sub.contentId"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
        data-slot="dropdown-menu-sub-content"
        data-uipkge=""
        [attr.data-state]="state()"
        [class]="panelClass"
        (keydown)="onKeydown($event)"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiDropdownMenuSubContentComponent implements OnDestroy {
  readonly sub = inject(UiDropdownMenuSubComponent)
  private readonly menu = inject(UiDropdownMenuComponent)
  private readonly rootContent = inject(UiDropdownMenuContentComponent, { optional: true })
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() sideOffset = 0
  @Input() alignOffset = 0
  @Input({ transform: booleanAttribute }) loop = false
  @ViewChild('panel', { static: true }) panelTpl!: TemplateRef<unknown>
  panelEl?: HTMLElement
  openSub?: UiDropdownMenuSubComponent
  readonly state = signal<'open' | 'closed'>('closed')
  private cleanups: (() => void)[] = []

  constructor() {
    this.sub.content = this
  }

  get panelClass(): string {
    return cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
      this.className,
    )
  }

  sync(): void {
    if (this.sub.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      // Reopened mid exit-animation: drop the closing panel and start fresh.
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.sub.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    const trigger = this.sub.trigger
    if (!trigger) return
    this.state.set('open')
    const panel = this.portal.attach(this.panelTpl).firstElementChild as HTMLElement
    this.panelEl = panel
    this.cleanups.push(
      autoPlace(
        trigger,
        panel,
        () => ({
          side: 'right',
          align: 'start',
          sideOffset: this.sideOffset,
          alignOffset: this.alignOffset,
          collisionPadding: 0,
          avoidCollisions: true,
        }),
        'dropdown-menu',
      ),
      pushDismissableLayer({
        contains: (t) => panel.contains(t) || trigger.contains(t) || !!this.openSub?.containsTarget(t),
        // Radix: Escape inside a submenu closes the whole menu (ArrowLeft closes just the sub).
        onEscape: () => this.menu.setOpen(false),
        // Clicking back inside the parent menu closes only this submenu; anywhere else closes the whole menu.
        onPointerDownOutside: (e) => {
          const inParent = this.rootContent?.panelEl?.contains(e.target as Node)
          if (inParent) this.sub.setOpen(false)
          else this.menu.setOpen(false)
        },
      }),
    )
    if (this.menu.modal) this.cleanups.push(disableOutsidePointerEvents(panel))
    if (this.sub.openedWith === 'keyboard') queueMicrotask(() => menuItems(panel)[0]?.focus())
  }

  private async hide(): Promise<void> {
    this.openSub?.setOpen(false)
    this.state.set('closed')
    const panel = this.panelEl
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(panel)
    if (this.sub.isOpen) return
    this.portal.detach()
    this.panelEl = undefined
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.panelEl) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      this.sub.setOpen(false)
      this.sub.trigger?.focus({ preventScroll: true })
      return
    }
    event.stopPropagation()
    handleMenuKeydown(event, this.panelEl, this.loop)
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

export { dropdownMenuContentVariants }

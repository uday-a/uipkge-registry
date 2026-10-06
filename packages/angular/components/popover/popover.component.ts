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
  lockScroll,
  pushDismissableLayer,
  trapFocus,
  uniqueId,
  type PopperAlign,
  type PopperSide,
} from '@/ui/popper/popper'

export type PopoverCloseBehavior = 'auto' | 'click-outside' | 'esc' | 'manual' | 'none'
export type PopoverSide = PopperSide
export type PopoverAlign = PopperAlign

/**
 * Cancelable event emitted by Content's dismiss / focus outputs (Radix semantics):
 * `preventDefault()` keeps the popover open, or skips the automatic focus move.
 */
export type PopoverDismissEvent = CustomEvent<{ originalEvent: Event }>

const dismissEvent = (type: string, originalEvent: Event): PopoverDismissEvent =>
  new CustomEvent(type, { cancelable: true, detail: { originalEvent } })

/**
 * Angular port of UIPKGE Popover with Radix Popover behaviour (what the React registry
 * wraps): the trigger is a directive (the `asChild` equivalent), content renders in a
 * body portal positioned against the trigger -- or a PopoverAnchor -- with flip + shift,
 * focus moves into the panel on open and back to the trigger on close, Escape /
 * outside pointer-down / focus leaving the panel dismiss, and `closeBehavior` vetoes
 * the Escape and outside-click paths exactly like the React wrapper. `persist`
 * remembers the open state in localStorage. Class strings identical to React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-popover, [ui-popover]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"popover"',
    '[attr.data-uipkge]': '""',
    // Radix Root renders no element: keep the wrapper out of layout.
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiPopoverComponent implements OnInit, OnChanges {
  /** Controlled open state (pair with `openChange`). Leave unset for uncontrolled use. */
  @Input() open?: boolean
  @Input({ transform: booleanAttribute }) defaultOpen = false
  /** Modal popovers trap focus and lock page scroll (Radix `modal`). */
  @Input({ transform: booleanAttribute }) modal = false
  /** Persist open state in localStorage: `true` = auto key, a string = that key, `false` = off. */
  @Input() persist: string | boolean = false
  /** Controls how the popover may be dismissed. */
  @Input() closeBehavior: PopoverCloseBehavior = 'auto'
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('popover-content')
  private readonly autoKey = `uipkge-${uniqueId('popover')}`
  /** First trigger registered (a Close-style trigger inside the content never replaces it). */
  trigger?: HTMLElement
  anchor?: HTMLElement
  content?: UiPopoverContentComponent
  private readonly _open = signal<boolean | null>(null)

  get isOpen(): boolean {
    if (this.open !== undefined) return this.open
    return this._open() ?? this.defaultOpen
  }

  get storageKey(): string | null {
    if (this.persist === false || this.persist === '') return null
    return this.persist === true ? this.autoKey : this.persist
  }

  ngOnInit(): void {
    const key = this.storageKey
    if (!key) return
    try {
      if (localStorage.getItem(key) === '1' && !this.isOpen) {
        this._open.set(true)
        if (this.open === undefined) this.openChange.emit(true)
      }
    } catch {
      /* storage blocked */
    }
  }

  ngOnChanges(): void {
    this.content?.sync()
  }

  setOpen(value: boolean): void {
    if (value === this.isOpen) return
    this._open.set(value)
    this.openChange.emit(value)
    this.persistState(value)
    this.content?.sync()
  }

  toggle(): void {
    this.setOpen(!this.isOpen)
  }

  /** React composes these guards into onPointerDownOutside / onEscapeKeyDown. */
  blocksOutsideClose(): boolean {
    return this.closeBehavior === 'esc' || this.closeBehavior === 'manual' || this.closeBehavior === 'none'
  }

  blocksEscapeClose(): boolean {
    return this.closeBehavior === 'click-outside' || this.closeBehavior === 'manual' || this.closeBehavior === 'none'
  }

  private persistState(value: boolean): void {
    const key = this.storageKey
    if (!key) return
    try {
      if (value) localStorage.setItem(key, '1')
      else localStorage.removeItem(key)
    } catch {
      /* storage blocked */
    }
  }
}

/** Popover Trigger as a directive: put it on any button (Radix `PopoverTrigger asChild`). */
@Directive({
  selector: 'ui-popover-trigger, [ui-popover-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.type]': 'isButton ? "button" : null',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'popover.isOpen',
    '[attr.aria-controls]': 'popover.contentId',
    '[attr.data-state]': 'popover.isOpen ? "open" : "closed"',
    '(click)': 'popover.toggle()',
  },
})
export class UiPopoverTriggerComponent implements OnDestroy {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'popover-trigger'
  readonly popover = inject(UiPopoverComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isButton = this.el.tagName === 'BUTTON'

  constructor() {
    this.popover.trigger ??= this.el
  }

  ngOnDestroy(): void {
    if (this.popover.trigger === this.el) this.popover.trigger = undefined
  }
}

/** Positions the content against this element instead of the trigger (Radix PopoverAnchor). */
@Directive({
  selector: 'ui-popover-anchor, [ui-popover-anchor]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"popover-anchor"',
    '[attr.data-uipkge]': '""',
  },
})
export class UiPopoverAnchorComponent implements OnDestroy {
  private readonly popover = inject(UiPopoverComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  constructor() {
    this.popover.anchor = this.el
  }

  ngOnDestroy(): void {
    if (this.popover.anchor === this.el) this.popover.anchor = undefined
  }
}

const TABBABLE =
  'button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-popover-content, [ui-popover-content]',
  standalone: true,
  // The host stays where it is declared (no box); the panel renders in a body portal.
  host: { '[attr.hidden]': '""' },
  template: `
    <ng-template #tpl>
      <div
        [id]="popover.contentId"
        role="dialog"
        tabindex="-1"
        data-uipkge=""
        data-slot="popover-content"
        [attr.data-state]="state()"
        [attr.aria-modal]="popover.modal ? 'true' : null"
        [class]="panelClass"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiPopoverContentComponent implements OnInit, OnChanges, OnDestroy {
  readonly popover = inject(UiPopoverComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() side: PopoverSide = 'bottom'
  @Input() align: PopoverAlign = 'center'
  @Input() sideOffset = 4
  @Input() alignOffset = 0
  @Input({ transform: booleanAttribute }) avoidCollisions = true
  @Input() collisionPadding = 8
  @Output() openAutoFocus = new EventEmitter<PopoverDismissEvent>()
  @Output() closeAutoFocus = new EventEmitter<PopoverDismissEvent>()
  @Output() escapeKeyDown = new EventEmitter<PopoverDismissEvent>()
  @Output() pointerDownOutside = new EventEmitter<PopoverDismissEvent>()
  @Output() focusOutside = new EventEmitter<PopoverDismissEvent>()
  @Output() interactOutside = new EventEmitter<PopoverDismissEvent>()

  @ViewChild('tpl', { static: true }) tpl!: TemplateRef<unknown>
  readonly state = signal<'open' | 'closed'>('closed')
  private panelEl?: HTMLElement
  private interactedOutside = false
  private pointerDownOutsideSeen = false
  private cleanups: (() => void)[] = []

  constructor() {
    this.popover.content = this
  }

  get panelClass(): string {
    return cn(
      'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
      this.className,
    )
  }

  ngOnInit(): void {
    // defaultOpen / persisted / open=true on first render: no input change will call sync().
    if (this.popover.isOpen) queueMicrotask(() => this.sync())
  }

  ngOnChanges(): void {
    if (this.portal.attached) this.sync()
  }

  /** Mirrors root open state into the portal (called by the root on every change). */
  sync(): void {
    if (this.popover.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.popover.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    const anchor = this.popover.anchor ?? this.popover.trigger
    if (!anchor) return
    this.interactedOutside = false
    this.pointerDownOutsideSeen = false
    this.state.set('open')
    const host = this.portal.attach(this.tpl)
    const panel = host.firstElementChild as HTMLElement
    this.panelEl = panel
    const inside = (t: Node) => panel.contains(t) || !!this.popover.trigger?.contains(t)
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Node | null
      if (!target || inside(target) || !this.popover.isOpen) return
      const event = dismissEvent('focusOutside', e)
      this.focusOutside.emit(event)
      this.interactOutside.emit(event)
      // Radix: focus landing outside right after a (vetoed) outside pointer-down doesn't dismiss.
      if (event.defaultPrevented || this.pointerDownOutsideSeen) return
      this.interactedOutside = true
      this.popover.setOpen(false)
    }
    document.addEventListener('focusin', onFocusIn)
    this.cleanups.push(
      () => document.removeEventListener('focusin', onFocusIn),
      autoPlace(anchor, panel, () => this.placeOptions(), 'popover'),
      pushDismissableLayer({
        contains: inside,
        onEscape: (e) => {
          const event = dismissEvent('escapeKeyDown', e)
          if (this.popover.blocksEscapeClose()) event.preventDefault()
          this.escapeKeyDown.emit(event)
          if (!event.defaultPrevented) this.popover.setOpen(false)
        },
        onPointerDownOutside: (e) => {
          const event = dismissEvent('pointerDownOutside', e)
          if (this.popover.blocksOutsideClose()) event.preventDefault()
          this.pointerDownOutside.emit(event)
          this.interactOutside.emit(event)
          this.pointerDownOutsideSeen = true
          if (event.defaultPrevented) return
          this.interactedOutside = true
          this.popover.setOpen(false)
        },
      }),
    )
    if (this.popover.modal) this.cleanups.push(trapFocus(panel), lockScroll())
    queueMicrotask(() => {
      if (!panel.isConnected) return
      const event = dismissEvent('openAutoFocus', new Event('focus'))
      this.openAutoFocus.emit(event)
      if (event.defaultPrevented) return
      const first = panel.querySelector<HTMLElement>('[autofocus]') ?? panel.querySelector<HTMLElement>(TABBABLE)
      ;(first ?? panel).focus({ preventScroll: true })
      // Radix FocusScope selects the text of an auto-focused input.
      if (first instanceof HTMLInputElement) first.select()
    })
  }

  private async hide(): Promise<void> {
    this.state.set('closed')
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(this.panelEl, 200)
    if (this.popover.isOpen) return
    this.portal.detach()
    this.panelEl = undefined
    const event = dismissEvent('closeAutoFocus', new Event('blur'))
    this.closeAutoFocus.emit(event)
    // Radix: back to the trigger unless the user already moved on by interacting outside.
    if (event.defaultPrevented || this.interactedOutside) return
    this.popover.trigger?.focus({ preventScroll: true })
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

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
    if (this.popover.content === this) this.popover.content = undefined
  }
}

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
  pushDismissableLayer,
  type PopperAlign,
  type PopperSide,
  type PlaceOptions,
} from '@/ui/popper/popper'

export type HoverCardSide = PopperSide
export type HoverCardAlign = PopperAlign

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

export const HOVER_CARD_CONTENT_CLASS =
  'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-64 rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200'

/**
 * Angular port of UIPKGE HoverCard with Radix HoverCard behaviour: pointer-enter (not
 * touch) or focus on the trigger opens after `openDelay`, pointer-leave / blur closes
 * after `closeDelay`, and moving the pointer onto the card cancels the close so it can
 * be read and clicked. Escape and outside pointer-downs dismiss at once. Content renders
 * in a body portal positioned against the trigger (flip + shift). Class strings are
 * identical to the React source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-hover-card, [ui-hover-card]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"hover-card"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    // Radix Root renders no element: keep the wrapper out of layout.
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiHoverCardComponent implements OnChanges, OnDestroy {
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() openDelay = 700
  @Input() closeDelay = 300
  @Output() openChange = new EventEmitter<boolean>()

  private readonly _open = signal<boolean | null>(null)
  private openTimer: ReturnType<typeof setTimeout> | undefined
  private closeTimer: ReturnType<typeof setTimeout> | undefined
  /** Text selected inside the card keeps it open until an explicit dismiss (Radix). */
  hasSelection = false
  isPointerDownOnContent = false
  trigger?: HTMLElement
  content?: UiHoverCardContentComponent

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

  /** Radix `onOpen`: cancel a pending close, open after the delay. */
  handleOpen(): void {
    clearTimeout(this.closeTimer)
    clearTimeout(this.openTimer)
    this.openTimer = setTimeout(() => this.setOpen(true), this.openDelay)
  }

  /** Radix `onClose`: cancel a pending open, close after the delay unless the user is selecting text. */
  handleClose(): void {
    clearTimeout(this.openTimer)
    if (!this.hasSelection && !this.isPointerDownOnContent) {
      clearTimeout(this.closeTimer)
      this.closeTimer = setTimeout(() => this.setOpen(false), this.closeDelay)
    }
  }

  /** Escape / outside pointer-down: close immediately. */
  handleDismiss(): void {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
    this.setOpen(false)
  }

  ngOnDestroy(): void {
    clearTimeout(this.openTimer)
    clearTimeout(this.closeTimer)
  }
}

/** Radix `excludeTouch`: hover intent never comes from a finger. */
const isTouch = (event: PointerEvent) => event.pointerType === 'touch'

/** The Radix `asChild` trigger: put it on the link / button that should reveal the card. */
@Directive({
  selector: 'ui-hover-card-trigger, [ui-hover-card-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'card.isOpen ? "open" : "closed"',
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'onPointerLeave($event)',
    '(focus)': 'card.handleOpen()',
    '(blur)': 'card.handleClose()',
    '(touchstart)': '$event.preventDefault()',
  },
})
export class UiHoverCardTriggerComponent {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'hover-card-trigger'
  readonly card = inject(UiHoverCardComponent)

  constructor() {
    this.card.trigger = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  }

  onPointerEnter(event: PointerEvent): void {
    if (!isTouch(event)) this.card.handleOpen()
  }

  onPointerLeave(event: PointerEvent): void {
    if (!isTouch(event)) this.card.handleClose()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-hover-card-content, [ui-hover-card-content]',
  standalone: true,
  // The host stays where it is declared (no box); the card itself renders in a body portal.
  host: { class: 'hidden' },
  template: `
    <ng-template #panel>
      <div
        data-slot="hover-card-content"
        data-uipkge=""
        [attr.data-state]="state()"
        [class]="panelClass"
        (pointerenter)="onPointerEnter($event)"
        (pointerleave)="onPointerLeave($event)"
        (pointerdown)="onPointerDown()"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiHoverCardContentComponent implements OnChanges, OnDestroy {
  readonly card = inject(UiHoverCardComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() side: HoverCardSide = 'bottom'
  @Input() align: HoverCardAlign = 'center'
  @Input() sideOffset = 4
  @Input() alignOffset = 0
  @Input({ transform: booleanAttribute }) avoidCollisions = true
  @Input() collisionPadding = 0

  @ViewChild('panel', { static: true }) panelTpl!: TemplateRef<unknown>
  panelEl?: HTMLElement
  readonly state = signal<'open' | 'closed'>('closed')
  private cleanups: (() => void)[] = []
  private previousBodyUserSelect = ''

  constructor() {
    this.card.content = this
  }

  get panelClass(): string {
    return cn(HOVER_CARD_CONTENT_CLASS, this.className)
  }

  ngOnChanges(): void {
    if (this.portal.attached) this.sync()
  }

  /** Mirrors root open state into the portal (called by the root on every change). */
  sync(): void {
    if (this.card.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      // Reopened mid exit-animation: drop the closing card and start fresh.
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.card.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    const trigger = this.card.trigger
    if (!trigger) return
    this.state.set('open')
    const panel = this.portal.attach(this.panelTpl).firstElementChild as HTMLElement
    this.panelEl = panel
    const onPointerUp = () => {
      this.releaseSelection()
      this.card.isPointerDownOnContent = false
      setTimeout(() => {
        if ((document.getSelection()?.toString() ?? '') !== '') this.card.hasSelection = true
      })
    }
    document.addEventListener('pointerup', onPointerUp)
    this.cleanups.push(
      placeAndTrack(trigger, panel, () => this.placeOptions(), 'hover-card'),
      pushDismissableLayer({
        contains: (t) => panel.contains(t),
        onEscape: () => this.card.handleDismiss(),
        onPointerDownOutside: () => this.card.handleDismiss(),
      }),
      () => {
        document.removeEventListener('pointerup', onPointerUp)
        this.releaseSelection()
        this.card.hasSelection = false
        this.card.isPointerDownOnContent = false
      },
    )
    // Radix: the card is a preview, not a tab stop -- its focusables leave the tab order.
    queueMicrotask(() => {
      for (const el of panel.querySelectorAll<HTMLElement>('*')) if (el.tabIndex >= 0) el.setAttribute('tabindex', '-1')
    })
  }

  private async hide(): Promise<void> {
    this.state.set('closed')
    const panel = this.panelEl
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(panel)
    if (this.card.isOpen) return
    this.portal.detach()
    this.panelEl = undefined
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

  onPointerEnter(event: PointerEvent): void {
    if (!isTouch(event)) this.card.handleOpen()
  }

  onPointerLeave(event: PointerEvent): void {
    if (!isTouch(event)) this.card.handleClose()
  }

  /** Radix contains text selection to the card while the pointer is down on it. */
  onPointerDown(): void {
    this.card.hasSelection = false
    this.card.isPointerDownOnContent = true
    if (!this.panelEl) return
    this.previousBodyUserSelect = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    this.panelEl.style.userSelect = 'text'
  }

  private releaseSelection(): void {
    if (this.panelEl?.style.userSelect !== 'text') return
    document.body.style.userSelect = this.previousBodyUserSelect
    this.panelEl.style.userSelect = ''
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

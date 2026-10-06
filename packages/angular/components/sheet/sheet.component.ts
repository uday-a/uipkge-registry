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
  lockScroll,
  pushDismissableLayer,
  trapFocus,
  uniqueId,
} from '@/ui/popper/popper'

export type SheetSide = 'top' | 'right' | 'bottom' | 'left'

/**
 * Cancelable event emitted by Content's dismiss / focus outputs. Mirrors Radix (and the
 * sibling dialog): call `event.preventDefault()` to keep the sheet open (escapeKeyDown,
 * pointerDownOutside, interactOutside) or to skip the automatic focus move (openAutoFocus,
 * closeAutoFocus). `detail.originalEvent` is the DOM event that caused it.
 */
export type SheetDismissEvent = CustomEvent<{ originalEvent: Event }>

const dismissEvent = (type: string, originalEvent: Event): SheetDismissEvent =>
  new CustomEvent(type, { cancelable: true, detail: { originalEvent } })

/**
 * Angular port of UIPKGE Sheet with Radix Dialog behaviour (what the React / Vue
 * sheets use): content renders in a body portal over an overlay, focus is trapped
 * and restored, page scroll locks while open, Escape and overlay clicks dismiss
 * (cancelable through the Radix-named outputs), title / description wire
 * aria-labelledby / aria-describedby. Trigger and Close
 * are directives (the `asChild` equivalent). Tailwind class strings identical to
 * the Vue / React sources.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sheet, [ui-sheet]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"sheet"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiSheetComponent implements OnChanges {
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input({ transform: booleanAttribute }) modal = true
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('sheet-content')
  titleId?: string
  descriptionId?: string
  trigger?: HTMLElement
  content?: UiSheetContentComponent
  private readonly _open = signal<boolean | null>(null)

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

export const SHEET_OVERLAY_CLASS =
  'motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50'

/** Standalone overlay part (the content renders its own overlay, as in React). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sheet-overlay, [ui-sheet-overlay]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"sheet-overlay"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'sheet ? (sheet.isOpen ? "open" : "closed") : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSheetOverlayComponent {
  readonly sheet = inject(UiSheetComponent, { optional: true })
  @Input('class') className?: string

  get hostClass(): string {
    return cn(SHEET_OVERLAY_CLASS, this.className)
  }
}

export function sheetContentClass(side: SheetSide, className?: string): string {
  return cn(
    'bg-background motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 fixed z-50 flex flex-col gap-4 overflow-hidden shadow-lg transition ease-in-out motion-safe:data-[state=closed]:duration-200 motion-safe:data-[state=open]:duration-300',
    side === 'right' &&
      'motion-safe:data-[state=closed]:slide-out-to-right motion-safe:data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    side === 'left' &&
      'motion-safe:data-[state=closed]:slide-out-to-left motion-safe:data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    side === 'top' &&
      'motion-safe:data-[state=closed]:slide-out-to-top motion-safe:data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
    side === 'bottom' &&
      'motion-safe:data-[state=closed]:slide-out-to-bottom motion-safe:data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
    className,
  )
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sheet-content, [ui-sheet-content]',
  standalone: true,
  host: { class: 'hidden' },
  template: `
    <ng-template #panel>
      @if (sheet.modal) {
        <div data-slot="sheet-overlay" data-uipkge="" [attr.data-state]="state()" [class]="overlayClass"></div>
      }
      <div
        #panelEl
        [id]="sheet.contentId"
        role="dialog"
        [attr.aria-modal]="sheet.modal ? 'true' : null"
        tabindex="-1"
        data-slot="sheet-content"
        data-uipkge=""
        [attr.data-state]="state()"
        [attr.data-side]="side"
        [attr.aria-labelledby]="sheet.titleId || null"
        [attr.aria-describedby]="sheet.descriptionId || null"
        [class]="panelClass"
      >
        <ng-content />
        <button
          type="button"
          data-slot="sheet-close"
          class="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          (click)="sheet.setOpen(false)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x size-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </button>
      </div>
    </ng-template>
  `,
})
export class UiSheetContentComponent implements OnChanges, OnDestroy {
  readonly sheet = inject(UiSheetComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))
  @Input('class') className?: string
  @Input() side: SheetSide = 'right'
  /** Extra attributes for the dialog element (React spreads props onto SheetContent). */
  @Input() attributes: Record<string, string> = {}
  @Output() closed = new EventEmitter<void>()
  @Output() openAutoFocus = new EventEmitter<SheetDismissEvent>()
  @Output() closeAutoFocus = new EventEmitter<SheetDismissEvent>()
  @Output() escapeKeyDown = new EventEmitter<SheetDismissEvent>()
  @Output() pointerDownOutside = new EventEmitter<SheetDismissEvent>()
  @Output() interactOutside = new EventEmitter<SheetDismissEvent>()
  @ViewChild('panel', { static: true }) panelTpl!: TemplateRef<unknown>
  readonly overlayClass = SHEET_OVERLAY_CLASS
  readonly state = signal<'open' | 'closed'>('closed')
  private panelEl?: HTMLElement
  private restoreFocusTo: HTMLElement | null = null
  private interactedOutside = false
  private cleanups: (() => void)[] = []

  constructor() {
    this.sheet.content = this
  }

  get panelClass(): string {
    return sheetContentClass(this.side, this.className)
  }

  ngOnChanges(): void {
    if (this.portal.attached) this.sync()
  }

  sync(): void {
    if (this.sheet.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.sheet.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    this.restoreFocusTo = document.activeElement as HTMLElement | null
    this.interactedOutside = false
    this.state.set('open')
    const host = this.portal.attach(this.panelTpl)
    const panel = host.querySelector<HTMLElement>('[data-slot="sheet-content"]')!
    for (const [name, value] of Object.entries(this.attributes)) panel.setAttribute(name, value)
    this.panelEl = panel
    this.cleanups.push(
      pushDismissableLayer({
        contains: (t) => panel.contains(t),
        onEscape: (e) => {
          const event = dismissEvent('escapeKeyDown', e)
          this.escapeKeyDown.emit(event)
          if (!event.defaultPrevented) this.close()
        },
        onPointerDownOutside: (e) => {
          // Non-modal: the trigger toggles on its own click; don't dismiss first.
          if (!this.sheet.modal && this.sheet.trigger?.contains(e.target as Node)) return
          const event = dismissEvent('pointerDownOutside', e)
          this.pointerDownOutside.emit(event)
          this.interactOutside.emit(event)
          if (event.defaultPrevented) return
          this.interactedOutside = true
          this.close()
        },
      }),
    )
    // Radix: only a modal dialog traps focus, locks scroll and renders the overlay.
    if (this.sheet.modal) this.cleanups.push(trapFocus(panel), lockScroll())
    queueMicrotask(() => {
      if (!panel.isConnected) return
      const event = dismissEvent('openAutoFocus', new Event('focus'))
      this.openAutoFocus.emit(event)
      if (event.defaultPrevented) return
      const first = panel.querySelector<HTMLElement>(
        '[autofocus],a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
      )
      ;(first ?? panel).focus({ preventScroll: true })
      // Radix FocusScope focuses the first tabbable with { select: true }: text inputs get selected.
      if (first instanceof HTMLInputElement) first.select()
    })
  }

  private close(): void {
    this.sheet.setOpen(false)
    this.closed.emit()
  }

  private async hide(): Promise<void> {
    this.state.set('closed')
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(this.panelEl, 300)
    if (this.sheet.isOpen) return
    this.portal.detach()
    this.panelEl = undefined
    const event = dismissEvent('closeAutoFocus', new Event('blur'))
    this.closeAutoFocus.emit(event)
    if (event.defaultPrevented || (!this.sheet.modal && this.interactedOutside)) return
    this.restoreFocusTo?.focus?.({ preventScroll: true })
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sheet-header, [ui-sheet-header]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"sheet-header"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSheetHeaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-col gap-1.5 p-4', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sheet-footer, [ui-sheet-footer]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"sheet-footer"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSheetFooterComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('mt-auto flex flex-col gap-2 p-4', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sheet-title, [ui-sheet-title]',
  standalone: true,
  host: {
    '[attr.id]': 'id',
    '[attr.data-slot]': '"sheet-title"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSheetTitleComponent {
  private readonly sheet = inject(UiSheetComponent, { optional: true })
  readonly id = uniqueId('sheet-title')
  @Input('class') className?: string

  constructor() {
    if (this.sheet) this.sheet.titleId = this.id
  }

  get hostClass(): string {
    return cn('block text-foreground font-semibold', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sheet-description, [ui-sheet-description]',
  standalone: true,
  host: {
    '[attr.id]': 'id',
    '[attr.data-slot]': '"sheet-description"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSheetDescriptionComponent {
  private readonly sheet = inject(UiSheetComponent, { optional: true })
  readonly id = uniqueId('sheet-description')
  @Input('class') className?: string

  constructor() {
    if (this.sheet) this.sheet.descriptionId = this.id
  }

  get hostClass(): string {
    return cn('block text-muted-foreground text-sm', this.className)
  }
}

@Directive({
  selector: 'ui-sheet-trigger, [ui-sheet-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'sheet.isOpen',
    '[attr.aria-controls]': 'sheet.isOpen ? sheet.contentId : null',
    '[attr.data-state]': 'sheet.isOpen ? "open" : "closed"',
    '(click)': 'sheet.toggle()',
  },
})
export class UiSheetTriggerComponent {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'sheet-trigger'
  readonly sheet = inject(UiSheetComponent)

  constructor() {
    this.sheet.trigger = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  }
}

@Directive({
  selector: 'ui-sheet-close, [ui-sheet-close]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"sheet-close"',
    '[attr.data-uipkge]': '""',
    '(click)': 'sheet.setOpen(false)',
  },
})
export class UiSheetCloseComponent {
  readonly sheet = inject(UiSheetComponent)
}

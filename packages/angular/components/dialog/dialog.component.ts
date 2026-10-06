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
import { buttonVariants } from '@/ui/button/button.component'
import {
  BodyPortal,
  afterExitAnimation,
  lockScroll,
  pushDismissableLayer,
  trapFocus,
  uniqueId,
} from '@/ui/popper/popper'

/**
 * Cancelable event emitted by Content's dismiss / focus outputs. Mirrors Radix: call
 * `event.preventDefault()` to keep the dialog open (escapeKeyDown, pointerDownOutside,
 * interactOutside) or to skip the automatic focus move (openAutoFocus, closeAutoFocus).
 * `detail.originalEvent` is the DOM event that caused it.
 */
export type DialogDismissEvent = CustomEvent<{ originalEvent: Event }>

const dismissEvent = (type: string, originalEvent: Event): DialogDismissEvent =>
  new CustomEvent(type, { cancelable: true, detail: { originalEvent } })

/**
 * Angular port of UIPKGE Dialog with Radix Dialog behaviour (what the React registry
 * wraps): Content renders in a body portal over an Overlay, focus moves into the
 * dialog and is trapped while modal, page scroll locks, Escape / overlay clicks
 * dismiss (cancelable through the Radix-named outputs), focus returns to the trigger
 * on close, and Title / Description wire aria-labelledby / aria-describedby. Trigger
 * and Close are directives (the `asChild` equivalent -- put them on any button).
 * Tailwind class strings are identical to the React source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog, [ui-dialog]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dialog"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    // Radix Root renders no element: keep the wrapper out of layout.
    class: 'contents',
  },
  template: `<ng-content />`,
})
export class UiDialogComponent implements OnChanges {
  /** Controlled open state (pair with `openChange`). Leave unset for uncontrolled use. */
  @Input() open?: boolean
  @Input({ transform: booleanAttribute }) defaultOpen = false
  @Input({ transform: booleanAttribute }) modal = true
  @Output() openChange = new EventEmitter<boolean>()

  readonly contentId = uniqueId('dialog-content')
  /** Set by Title / Description so Content can wire aria-labelledby / aria-describedby. */
  titleId: string | null = null
  descriptionId: string | null = null
  /** Element focus returns to on close (set by UiDialogTriggerComponent). */
  trigger?: HTMLElement
  content?: DialogContentBase
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

export const DIALOG_OVERLAY_CLASS =
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200'

export const DIALOG_CONTENT_CLASS =
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200 sm:max-w-lg'

const SCROLL_OVERLAY_CLASS =
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 grid place-items-center overflow-y-auto data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200'

const SCROLL_CONTENT_CLASS =
  'bg-background relative z-50 my-8 grid w-full max-w-lg gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg md:w-full'

/**
 * Standalone Overlay part (DialogContent renders its own overlay, as in React). Only
 * meaningful when you build a custom content layout; reflects the dialog's data-state.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog-overlay, [ui-dialog-overlay]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dialog-overlay"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'dialog ? (dialog.isOpen ? "open" : "closed") : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDialogOverlayComponent {
  readonly dialog = inject(UiDialogComponent, { optional: true })
  @Input('class') className?: string

  get hostClass(): string {
    return cn(DIALOG_OVERLAY_CLASS, this.className)
  }
}

const TABBABLE =
  'button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]'

/** Open / close lifecycle shared by DialogContent and DialogScrollContent. */
@Directive()
export abstract class DialogContentBase implements OnInit, OnChanges, OnDestroy {
  readonly dialog = inject(UiDialogComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  /** ARIA role of the content element (AlertModal passes `alertdialog`). */
  @Input() role: 'dialog' | 'alertdialog' = 'dialog'
  @Output() openAutoFocus = new EventEmitter<DialogDismissEvent>()
  @Output() closeAutoFocus = new EventEmitter<DialogDismissEvent>()
  @Output() escapeKeyDown = new EventEmitter<DialogDismissEvent>()
  @Output() pointerDownOutside = new EventEmitter<DialogDismissEvent>()
  @Output() interactOutside = new EventEmitter<DialogDismissEvent>()

  @ViewChild('tpl', { static: true }) tpl!: TemplateRef<unknown>
  readonly state = signal<'open' | 'closed'>('closed')
  private panelEl?: HTMLElement
  private previouslyFocused: HTMLElement | null = null
  private interactedOutside = false
  private cleanups: (() => void)[] = []

  constructor() {
    this.dialog.content = this
  }

  ngOnInit(): void {
    // defaultOpen / open=true on first render: no input change will call sync().
    if (this.dialog.isOpen) queueMicrotask(() => this.sync())
  }

  ngOnChanges(): void {
    if (this.portal.attached) this.sync()
  }

  /** Mirrors root open state into the portal (called by the root on every change). */
  sync(): void {
    if (this.dialog.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      // Reopened mid exit-animation: drop the closing panel and start fresh.
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.dialog.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  /** Hook for ScrollContent: pointer-downs that should never count as "outside". */
  protected ignorePointerDown(_event: PointerEvent): boolean {
    return false
  }

  private show(): void {
    this.previouslyFocused = document.activeElement as HTMLElement | null
    this.interactedOutside = false
    this.state.set('open')
    const host = this.portal.attach(this.tpl)
    const panel = host.querySelector<HTMLElement>('[data-slot="dialog-content"]')!
    this.panelEl = panel
    this.cleanups.push(
      pushDismissableLayer({
        contains: (t) => panel.contains(t),
        onEscape: (e) => {
          const event = dismissEvent('escapeKeyDown', e)
          this.escapeKeyDown.emit(event)
          if (!event.defaultPrevented) this.dialog.setOpen(false)
        },
        onPointerDownOutside: (e) => {
          if (this.ignorePointerDown(e)) return
          // Non-modal: the trigger toggles on its own click; don't dismiss first.
          if (!this.dialog.modal && this.dialog.trigger?.contains(e.target as Node)) return
          const event = dismissEvent('pointerDownOutside', e)
          this.pointerDownOutside.emit(event)
          this.interactOutside.emit(event)
          if (event.defaultPrevented) return
          this.interactedOutside = true
          this.dialog.setOpen(false)
        },
      }),
    )
    if (this.dialog.modal) this.cleanups.push(trapFocus(panel), lockScroll())
    queueMicrotask(() => {
      if (!panel.isConnected) return
      const event = dismissEvent('openAutoFocus', new Event('focus'))
      this.openAutoFocus.emit(event)
      if (event.defaultPrevented) return
      // Radix FocusScope: first tabbable (links skipped), else the content itself.
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
    if (this.dialog.isOpen) return
    this.portal.detach()
    this.panelEl = undefined
    const event = dismissEvent('closeAutoFocus', new Event('blur'))
    this.closeAutoFocus.emit(event)
    if (event.defaultPrevented || (!this.dialog.modal && this.interactedOutside)) return
    const target = this.dialog.trigger ?? this.previouslyFocused
    if (target?.isConnected) target.focus({ preventScroll: true })
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
    if (this.dialog.content === this) this.dialog.content = undefined
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog-content, [ui-dialog-content]',
  standalone: true,
  // The host stays where it is declared (no box); the dialog renders in a body portal.
  host: { '[attr.hidden]': '""' },
  template: `
    <ng-template #tpl>
      @if (dialog.modal) {
        <div data-uipkge="" data-slot="dialog-overlay" [attr.data-state]="state()" [class]="overlayClass"></div>
      }
      <div
        [id]="dialog.contentId"
        [attr.role]="role"
        aria-modal="true"
        tabindex="-1"
        data-uipkge=""
        data-slot="dialog-content"
        [attr.data-state]="state()"
        [attr.aria-labelledby]="dialog.titleId"
        [attr.aria-describedby]="dialog.descriptionId"
        [class]="contentClass"
      >
        <ng-content />
        @if (showCloseButton) {
          <button
            type="button"
            data-uipkge=""
            data-slot="dialog-close"
            class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            (click)="dialog.setOpen(false)"
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
              class="lucide lucide-x"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class UiDialogContentComponent extends DialogContentBase {
  @Input({ transform: booleanAttribute }) showCloseButton = true
  readonly overlayClass = DIALOG_OVERLAY_CLASS

  get contentClass(): string {
    return cn(DIALOG_CONTENT_CLASS, this.className)
  }
}

/** Content inside a scrollable overlay: very long bodies scroll the overlay, not the page. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog-scroll-content, [ui-dialog-scroll-content]',
  standalone: true,
  host: { '[attr.hidden]': '""' },
  template: `
    <ng-template #tpl>
      <div data-uipkge="" data-slot="dialog-overlay" [attr.data-state]="state()" [class]="overlayClass">
        <div
          [id]="dialog.contentId"
          [attr.role]="role"
          aria-modal="true"
          tabindex="-1"
          data-uipkge=""
          data-slot="dialog-content"
          [attr.data-state]="state()"
          [attr.aria-labelledby]="dialog.titleId"
          [attr.aria-describedby]="dialog.descriptionId"
          [class]="contentClass"
        >
          <ng-content />
          <button
            type="button"
            data-uipkge=""
            data-slot="dialog-close"
            class="hover:bg-secondary absolute top-4 right-4 rounded-md p-0.5 transition-colors duration-200"
            (click)="dialog.setOpen(false)"
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
              class="lucide lucide-x h-4 w-4"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
export class UiDialogScrollContentComponent extends DialogContentBase {
  readonly overlayClass = SCROLL_OVERLAY_CLASS

  get contentClass(): string {
    return cn(SCROLL_CONTENT_CLASS, this.className)
  }

  /** React: a pointer-down on the overlay's scrollbar must not dismiss. */
  protected override ignorePointerDown(event: PointerEvent): boolean {
    const target = event.target as HTMLElement | null
    if (!target || typeof event.offsetX !== 'number') return false
    return event.offsetX > target.clientWidth || event.offsetY > target.clientHeight
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog-header, [ui-dialog-header]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dialog-header"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDialogHeaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-col gap-2 text-center sm:text-left', this.className)
  }
}

/** Dialog Close as a directive: put it on any element (Radix `DialogClose asChild`). */
@Directive({
  selector: 'ui-dialog-close, [ui-dialog-close]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dialog-close"',
    '[attr.data-uipkge]': '""',
    '[attr.type]': 'isButton ? "button" : null',
    '(click)': 'dialog.setOpen(false)',
  },
})
export class UiDialogCloseComponent {
  readonly dialog = inject(UiDialogComponent)
  readonly isButton = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'BUTTON'
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog-footer, [ui-dialog-footer]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dialog-footer"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    <ng-content />
    @if (showCloseButton) {
      <button
        type="button"
        data-uipkge=""
        data-slot="button"
        data-variant="outline"
        data-size="default"
        [class]="closeClass"
        (click)="dialog?.setOpen(false)"
      >
        Close
      </button>
    }
  `,
})
export class UiDialogFooterComponent {
  readonly dialog = inject(UiDialogComponent, { optional: true })
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) showCloseButton = false
  readonly closeClass = buttonVariants({ variant: 'outline' })

  get hostClass(): string {
    return cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.className)
  }
}

/** Radix renders an <h2>; use `<h2 ui-dialog-title>` for the same element (custom tags get role=heading). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog-title, [ui-dialog-title]',
  standalone: true,
  host: {
    '[attr.id]': 'id',
    '[attr.role]': 'custom ? "heading" : null',
    '[attr.aria-level]': 'custom ? 2 : null',
    '[attr.data-slot]': '"dialog-title"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDialogTitleComponent implements OnDestroy {
  private readonly dialog = inject(UiDialogComponent, { optional: true })
  readonly custom = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName.includes('-')
  readonly id = uniqueId('dialog-title')
  @Input('class') className?: string

  constructor() {
    if (this.dialog) this.dialog.titleId = this.id
  }

  get hostClass(): string {
    return cn(this.custom && 'block', 'text-lg leading-none font-semibold', this.className)
  }

  ngOnDestroy(): void {
    if (this.dialog?.titleId === this.id) this.dialog.titleId = null
  }
}

/** Radix renders a <p>; use `<p ui-dialog-description>` for the same element. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dialog-description, [ui-dialog-description]',
  standalone: true,
  host: {
    '[attr.id]': 'id',
    '[attr.data-slot]': '"dialog-description"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDialogDescriptionComponent implements OnDestroy {
  private readonly dialog = inject(UiDialogComponent, { optional: true })
  private readonly custom = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName.includes('-')
  readonly id = uniqueId('dialog-description')
  @Input('class') className?: string

  constructor() {
    if (this.dialog) this.dialog.descriptionId = this.id
  }

  get hostClass(): string {
    return cn(this.custom && 'block', 'text-muted-foreground text-sm', this.className)
  }

  ngOnDestroy(): void {
    if (this.dialog?.descriptionId === this.id) this.dialog.descriptionId = null
  }
}

/** Dialog Trigger as a directive: put it on any button (Radix `DialogTrigger asChild`). */
@Directive({
  selector: 'ui-dialog-trigger, [ui-dialog-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.type]': 'isButton ? "button" : null',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'dialog.isOpen',
    '[attr.aria-controls]': 'dialog.contentId',
    '[attr.data-state]': 'dialog.isOpen ? "open" : "closed"',
    '(click)': 'dialog.toggle()',
  },
})
export class UiDialogTriggerComponent implements OnDestroy {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'dialog-trigger'
  readonly dialog = inject(UiDialogComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isButton = this.el.tagName === 'BUTTON'

  constructor() {
    this.dialog.trigger = this.el
  }

  ngOnDestroy(): void {
    if (this.dialog.trigger === this.el) this.dialog.trigger = undefined
  }
}

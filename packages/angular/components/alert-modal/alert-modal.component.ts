import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button/button.component'
import {
  UiDialogComponent,
  UiDialogContentComponent,
  UiDialogDescriptionComponent,
  UiDialogTitleComponent,
  type DialogDismissEvent,
} from '@/ui/dialog/dialog.component'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

export type AlertModalTone = 'default' | 'destructive' | 'success' | 'warning'
export type AlertModalIcon = 'info' | 'warning' | 'error' | 'success'

const TONE_ICON: Record<AlertModalTone, string> = {
  destructive: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  default: 'text-muted-foreground',
}

const TONE_ACTION: Record<AlertModalTone, string> = {
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  default: '',
}

const isBuiltInIcon = (value: unknown): value is AlertModalIcon =>
  value === 'info' || value === 'success' || value === 'warning' || value === 'error'

/**
 * Angular port of UIPKGE AlertModal, composed from Dialog exactly like the React
 * component: a role="alertdialog" DialogContent (portal, overlay, focus trap + restore,
 * scroll lock, Escape) that does NOT soft-dismiss on outside clicks (WAI-ARIA), a
 * tone-colored icon ring, cancel (closes) + action (emits `action`, the consumer
 * closes) buttons, and a `loading` state that keeps the modal open and disables both
 * buttons. Open it with a `[ui-alert-modal-trigger]` element projected inside, or drive
 * `open` / `openChange` yourself.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-alert-modal, [ui-alert-modal]',
  standalone: true,
  imports: [
    UiDialogComponent,
    UiDialogContentComponent,
    UiDialogTitleComponent,
    UiDialogDescriptionComponent,
    UiRenderTemplateDirective,
  ],
  // React renders no wrapper element. A static title="..." input would also land on the
  // host as a native tooltip over the trigger: strip it.
  host: { class: 'contents', '[attr.title]': 'null' },
  template: `
    <ui-dialog [open]="isOpen" (openChange)="setOpen($event)">
      <ng-content select="[ui-alert-modal-trigger], [slot=trigger]" />
      <ui-dialog-content
        role="alertdialog"
        [showCloseButton]="false"
        [class]="className ?? ''"
        (pointerDownOutside)="preventOutside($event)"
        (interactOutside)="preventOutside($event)"
      >
        <div class="flex flex-col gap-2 text-center sm:text-left">
          @if (iconTemplate || builtInIcon) {
            <div [class]="iconClass">
              @if (iconTemplate) {
                <ng-container [uiRenderTemplate]="iconTemplate" />
              } @else {
                @switch (builtInIcon) {
                  @case ('info') {
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
                      class="lucide lucide-info size-5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  }
                  @case ('success') {
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
                      class="lucide lucide-circle-check size-5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  }
                  @case ('warning') {
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
                      class="lucide lucide-triangle-alert size-5"
                      aria-hidden="true"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  }
                  @case ('error') {
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
                      class="lucide lucide-circle-alert size-5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                  }
                }
              }
            </div>
          }
          <h2 ui-dialog-title class="text-lg font-semibold">{{ title }}</h2>
          @if (description) {
            <p ui-dialog-description class="text-muted-foreground text-sm">{{ description }}</p>
          }
        </div>

        <div class="text-sm empty:hidden"><ng-content /></div>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          @if (actions) {
            <ng-container [uiRenderTemplate]="actions" />
          } @else {
            @if (cancelLabel != null) {
              <button
                type="button"
                data-uipkge=""
                data-slot="dialog-close"
                data-variant="outline"
                data-size="default"
                [class]="cancelClass"
                [disabled]="loading"
                (click)="handleCancel($event)"
              >
                {{ cancelLabel }}
              </button>
            }
            <button
              type="button"
              data-uipkge=""
              data-slot="button"
              data-variant="default"
              data-size="default"
              [class]="actionClass"
              [disabled]="loading || actionDisabled"
              [attr.aria-busy]="loading"
              (click)="handleAction($event)"
            >
              @if (loading) {
                <span
                  class="mr-2 inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                ></span>
              }
              {{ actionLabel }}
            </button>
          }
        </div>
      </ui-dialog-content>
    </ui-dialog>
  `,
})
export class UiAlertModalComponent {
  /** Controlled open state (pair with `openChange`). Leave unset for uncontrolled use. */
  @Input() open?: boolean
  @Input() title = ''
  @Input() description = ''
  @Input() actionLabel = 'Continue'
  /** Label for the cancel button. Pass `null` to hide it. */
  @Input() cancelLabel: string | null = 'Cancel'
  @Input() tone: AlertModalTone = 'default'
  /** Built-in icon shortcut, or an `<ng-template>` rendering a custom icon. */
  @Input() icon: AlertModalIcon | TemplateRef<unknown> | null = null
  @Input({ transform: booleanAttribute }) loading = false
  @Input({ transform: booleanAttribute }) actionDisabled = false
  /** Classes merged onto the dialog content (React passes className to DialogContent). */
  @Input('class') className?: string
  /** Replaces the default cancel / action button row. */
  @Input() actions: TemplateRef<unknown> | null = null

  @Output() openChange = new EventEmitter<boolean>()
  @Output() action = new EventEmitter<MouseEvent>()
  @Output() cancel = new EventEmitter<MouseEvent>()

  @ViewChild(UiDialogComponent, { static: true }) dialog!: UiDialogComponent
  private readonly internalOpen = signal(false)

  get isOpen(): boolean {
    return this.open !== undefined ? this.open : this.internalOpen()
  }

  get builtInIcon(): AlertModalIcon | null {
    return isBuiltInIcon(this.icon) ? this.icon : null
  }

  get iconTemplate(): TemplateRef<unknown> | null {
    return this.icon instanceof TemplateRef ? this.icon : null
  }

  get iconClass(): string {
    return cn('bg-muted mb-2 flex size-10 items-center justify-center rounded-full', TONE_ICON[this.tone])
  }

  get cancelClass(): string {
    return buttonVariants({ variant: 'outline' })
  }

  get actionClass(): string {
    return cn(buttonVariants({ variant: 'default' }), TONE_ACTION[this.tone])
  }

  setOpen(value: boolean): void {
    // Keep the dialog open while an async action is in flight.
    if (!value && this.loading) return
    if (value === this.isOpen) return
    if (this.open === undefined) this.internalOpen.set(value)
    this.openChange.emit(value)
    // Controlled: the parent's [open] binding drives the dialog on its next check.
  }

  /** Alert dialogs must not soft-dismiss on outside click (WAI-ARIA). */
  preventOutside(event: DialogDismissEvent): void {
    event.preventDefault()
  }

  handleAction(event: MouseEvent): void {
    if (this.loading || this.actionDisabled) {
      event.preventDefault()
      return
    }
    this.action.emit(event)
  }

  handleCancel(event: MouseEvent): void {
    this.cancel.emit(event)
    this.setOpen(false)
  }

  registerTrigger(el: HTMLElement): void {
    this.dialog.trigger = el
  }
}

/**
 * Marks the element that opens the modal (React's `trigger` prop wrapped in
 * DialogTrigger asChild): `<button ui-button ui-alert-modal-trigger>Delete</button>`
 * projected inside `<ui-alert-modal>`.
 */
@Directive({
  selector: '[ui-alert-modal-trigger]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[attr.type]': 'isButton ? "button" : null',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'modal.isOpen',
    '[attr.aria-controls]': 'modal.dialog?.contentId',
    '[attr.data-state]': 'modal.isOpen ? "open" : "closed"',
    '(click)': 'onClick()',
  },
})
export class UiAlertModalTriggerDirective implements OnDestroy {
  // Radix Slot: the trigger's data-slot overrides a wrapped component's own (ui-button's
  // "button"), but a data-slot written on the element itself wins.
  readonly dataSlot: string = inject(ElementRef).nativeElement.getAttribute('data-slot') ?? 'dialog-trigger'
  readonly modal = inject(UiAlertModalComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isButton = this.el.tagName === 'BUTTON'

  onClick(): void {
    this.modal.registerTrigger(this.el)
    this.modal.setOpen(!this.modal.isOpen)
  }

  ngOnDestroy(): void {
    if (this.modal.dialog?.trigger === this.el) this.modal.dialog.trigger = undefined
  }
}

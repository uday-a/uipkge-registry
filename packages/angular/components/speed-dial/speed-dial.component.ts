import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiFabComponent } from '@/ui/fab/fab.component'
import { UiPopoverComponent, UiPopoverContentComponent } from '@/ui/popover/popover.component'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

export interface SpeedDialAction {
  /** Icon template (React passes a LucideIcon component): `<ng-template #mail><svg ...></svg></ng-template>`. */
  icon: TemplateRef<unknown>
  label: string
  handler?: () => void
  disabled?: boolean
  className?: string
}

export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right'
export type SpeedDialTrigger = 'click' | 'hover'
export type SpeedDialVariant = 'default' | 'secondary' | 'destructive' | 'outline'
export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'inline'

const sideMap: Record<SpeedDialDirection, 'top' | 'bottom' | 'left' | 'right'> = {
  up: 'top',
  down: 'bottom',
  left: 'left',
  right: 'right',
}

const ACTION_CLASS =
  "group/speed-dial-item bg-background text-foreground hover:bg-accent hover:text-accent-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 focus-visible:ring-ring/50 inline-flex size-12 items-center justify-center rounded-full border shadow-md transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5"

/**
 * Angular port of UIPKGE SpeedDial (React: Popover + Fab). The trigger is a wrapper div
 * around the Fab (Radix `PopoverTrigger asChild`); actions render in a transparent
 * popover panel on the side given by `direction`, 12px from the FAB, each fading in with
 * a 40ms stagger. `trigger="hover"` opens on mouse enter and closes 150ms after the
 * pointer leaves both the FAB and the actions. Same props and defaults as React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-speed-dial, [ui-speed-dial]',
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverContentComponent, UiFabComponent, UiRenderTemplateDirective],
  // React renders no wrapper around the Popover root.
  host: { class: 'contents' },
  template: `
    <ui-popover #popover [open]="open()" (openChange)="handleOpenChange($event)">
      <!-- Radix PopoverTrigger asChild: trigger props merged onto the wrapper div. -->
      <div
        #triggerEl
        data-uipkge=""
        data-slot="speed-dial"
        aria-haspopup="dialog"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="popover.contentId"
        [attr.data-state]="open() ? 'open' : 'closed'"
        [class]="rootClass"
        (mouseenter)="onTriggerEnter()"
        (mouseleave)="onTriggerLeave()"
        (click)="popover.toggle()"
      >
        <button
          ui-fab
          [variant]="variant"
          [position]="position"
          [absolute]="absolute"
          [disabled]="disabled"
          [ariaLabel]="label || 'Quick actions'"
          [attr.aria-expanded]="open()"
          aria-haspopup="menu"
          [class]="fabClass"
          (click)="onFabClick($event)"
        >
          @if (icon) {
            <ng-container [uiRenderTemplate]="icon" />
          } @else {
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          }
        </button>
      </div>
      <ui-popover-content [side]="side" align="center" [sideOffset]="12" [class]="contentClass">
        <div [class]="listClass" (mouseenter)="onContentEnter()" (mouseleave)="onContentLeave()">
          @for (action of actions; track $index; let i = $index) {
            <button
              type="button"
              data-slot="speed-dial-action"
              [disabled]="action.disabled"
              [attr.aria-label]="action.label"
              [style.animation-delay.ms]="i * 40"
              [class]="actionClass(action)"
              (click)="runAction(action)"
            >
              <ng-container [uiRenderTemplate]="action.icon" />
              <span class="sr-only">{{ action.label }}</span>
            </button>
          }
        </div>
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiSpeedDialComponent implements AfterViewInit, OnDestroy {
  @ViewChild('popover', { static: true }) popover!: UiPopoverComponent
  @ViewChild('triggerEl', { static: true }) triggerEl!: ElementRef<HTMLElement>

  @Input() actions: SpeedDialAction[] = []
  /** Main FAB icon template (defaults to a plus). */
  @Input() icon?: TemplateRef<unknown>
  /** Accessible label for the main FAB. */
  @Input() label?: string
  @Input() direction: SpeedDialDirection = 'up'
  @Input() trigger: SpeedDialTrigger = 'click'
  /** Close the dial after an action is triggered. */
  @Input({ transform: booleanAttribute }) closeOnAction = true
  @Input() variant: SpeedDialVariant = 'default'
  @Input() position: SpeedDialPosition = 'bottom-right'
  @Input({ transform: booleanAttribute }) absolute = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  readonly open = signal(false)
  private hoverTimer: ReturnType<typeof setTimeout> | null = null

  get side() {
    return sideMap[this.direction]
  }

  get rootClass(): string {
    return cn(this.className)
  }

  get fabClass(): string {
    return cn(
      'transition-[color,background-color,box-shadow,transform,scale,translate,rotate] duration-200',
      this.open() && 'rotate-45',
    )
  }

  get contentClass(): string {
    return cn('w-auto border-0 bg-transparent p-0 shadow-none', this.trigger === 'hover' && 'pointer-events-auto')
  }

  get listClass(): string {
    return this.direction === 'up' || this.direction === 'down'
      ? 'flex flex-col items-center gap-3'
      : 'flex flex-row items-center gap-3'
  }

  actionClass(action: SpeedDialAction): string {
    return cn(ACTION_CLASS, action.className)
  }

  private clearHoverTimer(): void {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer)
      this.hoverTimer = null
    }
  }

  private closeLater(): void {
    this.clearHoverTimer()
    this.hoverTimer = setTimeout(() => this.open.set(false), 150)
  }

  onTriggerEnter(): void {
    if (this.disabled || this.trigger !== 'hover') return
    this.clearHoverTimer()
    this.open.set(true)
  }

  onTriggerLeave(): void {
    if (this.trigger !== 'hover') return
    this.closeLater()
  }

  onContentEnter(): void {
    if (this.trigger !== 'hover') return
    this.clearHoverTimer()
  }

  onContentLeave(): void {
    if (this.trigger !== 'hover') return
    this.closeLater()
  }

  /** In hover mode a click on the FAB must not toggle the popover (React stops propagation). */
  onFabClick(event: MouseEvent): void {
    if (this.trigger === 'hover') event.stopPropagation()
  }

  /** The trigger is a wrapper div, so a disabled Fab alone does not block the popover. */
  handleOpenChange(next: boolean): void {
    this.open.set(this.disabled ? false : next)
  }

  runAction(action: SpeedDialAction): void {
    if (action.disabled) return
    action.handler?.()
    if (this.closeOnAction) this.open.set(false)
  }

  ngAfterViewInit(): void {
    // The popover anchors to (and returns focus to) the wrapper div.
    this.popover.trigger = this.triggerEl.nativeElement
  }

  ngOnDestroy(): void {
    this.clearHoverTimer()
  }
}

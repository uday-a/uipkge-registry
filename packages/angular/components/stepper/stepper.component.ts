import {
  AfterViewInit,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { stepperIndicatorVariants } from './stepper.variants'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperStatus = 'active' | 'completed' | 'pending' | 'error'
export type StepperSize = 'sm' | 'default' | 'lg'

export interface StepperStep {
  id: string | number
  title: string
  description?: string
  /** Icon template (React passes a LucideIcon component). */
  icon?: TemplateRef<unknown>
  disabled?: boolean
  error?: boolean
}
/** React exports the step config type under this alias too. */
export type StepperStepConfig = StepperStep

export interface StepperContentContext {
  $implicit: number
  activeStep: number
  steps: StepperStep[]
}

/* Motion styles, verbatim from the React / Vue source. */
const STEPPER_STYLE_CONTENT = `
@keyframes stepper-indicator-pop {
  0% { transform: scale(0.92); }
  55% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes stepper-indicator-fill {
  0% { transform: scale(0.92); }
  55% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes stepper-indicator-error {
  0% { transform: scale(0.92); }
  55% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes stepper-icon-in {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
/* Distinct names so active→completed restarts the pop. */
[data-slot='stepper-indicator'][data-status='active'] {
  animation: stepper-indicator-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
[data-slot='stepper-indicator'][data-status='completed'] {
  animation: stepper-indicator-fill 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
[data-slot='stepper-indicator'][data-status='error'] {
  animation: stepper-indicator-error 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
[data-slot='stepper-indicator'][data-status='completed'] [data-slot='stepper-indicator-icon'],
[data-slot='stepper-indicator'][data-status='error'] [data-slot='stepper-indicator-icon'],
[data-slot='stepper-indicator'][data-status='active'] [data-slot='stepper-indicator-icon'] {
  animation: stepper-icon-in 220ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
[data-slot='stepper-connector-fill'] {
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-slot='stepper-connector-fill'][data-orientation='horizontal'] {
  transform-origin: left center;
  transform: scaleX(0);
}
[data-slot='stepper-connector-fill'][data-orientation='horizontal'][data-completed='true'] {
  transform: scaleX(1);
}
[data-slot='stepper-connector-fill'][data-orientation='vertical'] {
  transform-origin: center top;
  transform: scaleY(0);
}
[data-slot='stepper-connector-fill'][data-orientation='vertical'][data-completed='true'] {
  transform: scaleY(1);
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='stepper-indicator'],
  [data-slot='stepper-indicator'] [data-slot='stepper-indicator-icon'],
  [data-slot='stepper-indicator'] [data-slot='stepper-indicator-label'],
  [data-slot='stepper-connector-fill'] {
    animation: none !important;
    transition: none !important;
  }
}
`

/**
 * Renders a template with a context (UiRenderTemplateDirective has none). With `iconClass`
 * set it also decorates the rendered root <svg>s the way React passes props to an icon
 * component: `class`, `data-slot="stepper-indicator-icon"` and `aria-hidden`.
 */
@Directive({ selector: '[uiStepperOutlet]', standalone: true })
export class UiStepperOutletDirective implements OnChanges, OnDestroy {
  @Input('uiStepperOutlet') template: TemplateRef<unknown> | null | undefined = null
  @Input('uiStepperOutletContext') context: unknown = null
  @Input('uiStepperOutletIconClass') iconClass?: string
  private readonly vcr = inject(ViewContainerRef)
  private view: EmbeddedViewRef<unknown> | null = null

  ngOnChanges(): void {
    this.vcr.clear()
    this.view = null
    if (!this.template) return
    this.view = this.vcr.createEmbeddedView(this.template, this.context ?? {})
    if (this.iconClass === undefined) return
    for (const node of this.view.rootNodes) {
      if (!(node instanceof Element) || node.tagName.toLowerCase() !== 'svg') continue
      if (this.iconClass) node.classList.add(...this.iconClass.split(' '))
      node.setAttribute('data-slot', 'stepper-indicator-icon')
      node.setAttribute('aria-hidden', 'true')
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/** Marks `<ng-template uiStepperContent let-activeStep="activeStep">` as the render-prop content (React children fn). */
@Directive({ selector: 'ng-template[uiStepperContent]', standalone: true })
export class UiStepperContentTemplateDirective {
  readonly template = inject<TemplateRef<StepperContentContext>>(TemplateRef)
}

/* ------------------------------------------------------------------ */
/* StepperIndicator                                                    */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper-indicator, [ui-stepper-indicator]',
  standalone: true,
  imports: [UiStepperOutletDirective],
  host: {
    '[attr.type]': '"button"',
    '[attr.data-slot]': '"stepper-indicator"',
    '[attr.data-status]': 'status',
    '[attr.disabled]': 'clickable ? null : ""',
    '[attr.aria-current]': 'status === "active" ? "step" : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content>
    @if (icon) {
      <ng-container [uiStepperOutlet]="icon" uiStepperOutletIconClass="size-4" />
    } @else if (status === 'completed') {
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
        class="lucide lucide-check size-4"
        data-slot="stepper-indicator-icon"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    } @else if (status === 'error') {
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
        data-slot="stepper-indicator-icon"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    } @else if (index !== undefined) {
      <span class="font-medium" data-slot="stepper-indicator-label">{{ index }}</span>
    }
  </ng-content>`,
})
export class UiStepperIndicatorComponent {
  @Input() status: StepperStatus = 'pending'
  @Input() size: StepperSize = 'default'
  @Input() index?: number
  @Input() icon?: TemplateRef<unknown>
  @Input({ transform: booleanAttribute }) clickable = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      stepperIndicatorVariants({ status: this.status, size: this.size }),
      'ring-background relative z-10 ring-4 transition-[color,background-color,box-shadow,transform] duration-200 outline-none',
      this.clickable && 'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
      !this.clickable && 'cursor-default',
      this.className,
    )
  }
}

/* ------------------------------------------------------------------ */
/* Stepper (root)                                                      */
/* ------------------------------------------------------------------ */

/**
 * Angular port of UIPKGE Stepper (React parity). Controlled like React: `value` (1-based
 * active step, default 1) + `valueChange`; clicking a completed step's indicator or title
 * navigates back to it, disabled steps can't be reached. Renders an `<ol>` of StepperItems
 * from `steps` unless a `[slot=steps]` element is projected; any other projected content (or
 * an `<ng-template uiStepperContent>` render prop) goes in the content area below.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper, [ui-stepper]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [STEPPER_STYLE_CONTENT],
  imports: [UiStepperOutletDirective, forwardRef(() => UiStepperItemComponent)],
  host: {
    '[class]': 'hostClass',
    role: 'tablist',
    '[attr.aria-orientation]': 'orientation',
    '[attr.data-orientation]': 'orientation',
  },
  template: `<ng-content select="[slot=steps]">
      @if (steps.length > 0) {
        <ol [class]="listClass">
          @for (step of steps; track step.id; let index = $index) {
            <li ui-stepper-item [step]="step" [index]="index"></li>
          }
        </ol>
      }
    </ng-content>
    <div #contentWrap [class]="hasContent() ? 'mt-6 flex-1' : 'hidden'">
      <ng-content />
      @if (contentTemplate) {
        <ng-container
          [uiStepperOutlet]="contentTemplate.template"
          [uiStepperOutletContext]="{ $implicit: value, activeStep: value, steps: steps }"
        />
      }
    </div>`,
})
export class UiStepperComponent implements AfterViewInit, OnDestroy {
  @Input() steps: StepperStep[] = []
  /** Active step, 1-based (React `value`). */
  @Input() value = 1
  @Input() orientation: StepperOrientation = 'horizontal'
  @Input() size: StepperSize = 'default'
  @Input('class') className?: string
  @Output() valueChange = new EventEmitter<number>()

  @ContentChild(UiStepperContentTemplateDirective) contentTemplate?: UiStepperContentTemplateDirective
  @ViewChild('contentWrap', { static: true }) contentWrap!: ElementRef<HTMLElement>
  /** React renders the content wrapper only when children exist. */
  readonly hasContent = signal(false)
  private observer?: MutationObserver

  get activeStep(): number {
    return this.value
  }

  get hostClass(): string {
    return cn('block w-full', this.className)
  }

  get listClass(): string {
    return cn('flex', this.orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col items-stretch')
  }

  getStatus(index: number): StepperStatus {
    const step = this.steps[index]
    if (step?.error) return 'error'
    if (index + 1 === this.activeStep) return 'active'
    if (index + 1 < this.activeStep) return 'completed'
    return 'pending'
  }

  isClickable(index: number): boolean {
    return index + 1 < this.activeStep
  }

  goToStep(stepIndex: number): void {
    if (stepIndex < 1 || stepIndex > this.steps.length) return
    if (this.steps[stepIndex - 1]?.disabled) return
    this.valueChange.emit(stepIndex)
  }

  ngAfterViewInit(): void {
    const el = this.contentWrap.nativeElement
    const check = () => this.hasContent.set(Array.from(el.childNodes).some((n) => n.nodeType !== Node.COMMENT_NODE))
    check()
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(check)
      this.observer.observe(el, { childList: true })
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect()
  }
}

/* ------------------------------------------------------------------ */
/* StepperItem                                                         */
/* ------------------------------------------------------------------ */

const INDICATOR_AXIS = {
  horizontal: {
    sm: 'h-7 w-full items-center justify-center',
    default: 'h-9 w-full items-center justify-center',
    lg: 'h-11 w-full items-center justify-center',
  },
  vertical: {
    sm: 'w-7 flex-col items-center justify-start self-stretch',
    default: 'w-9 flex-col items-center justify-start self-stretch',
    lg: 'w-11 flex-col items-center justify-start self-stretch',
  },
} as const

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper-item, [ui-stepper-item]',
  standalone: true,
  imports: [UiStepperIndicatorComponent],
  host: {
    '[attr.data-slot]': '"stepper-item"',
    '[class]': 'hostClass',
    role: 'tab',
    '[attr.aria-selected]': 'status === "active"',
    '[attr.aria-disabled]': 'step.disabled || null',
    '[attr.data-status]': 'status',
  },
  template: `
    <div [class]="axisClass">
      @if (!isFirst) {
        <span
          aria-hidden="true"
          data-slot="stepper-connector"
          [attr.data-orientation]="orientation"
          [attr.data-edge]="orientation === 'horizontal' ? 'left' : 'top'"
          [class]="
            orientation === 'horizontal'
              ? 'bg-border pointer-events-none absolute top-1/2 right-1/2 left-0 h-px -translate-y-1/2 overflow-hidden'
              : 'bg-border pointer-events-none absolute top-0 bottom-1/2 left-1/2 w-px -translate-x-1/2 overflow-hidden'
          "
        >
          <span
            data-slot="stepper-connector-fill"
            [attr.data-completed]="index < stepper.activeStep ? 'true' : 'false'"
            [attr.data-orientation]="orientation"
            class="bg-primary absolute inset-0"
          ></span>
        </span>
      }
      @if (!isLast) {
        <span
          aria-hidden="true"
          data-slot="stepper-connector"
          [attr.data-orientation]="orientation"
          [attr.data-edge]="orientation === 'horizontal' ? 'right' : 'bottom'"
          [class]="
            orientation === 'horizontal'
              ? 'bg-border pointer-events-none absolute top-1/2 right-0 left-1/2 h-px -translate-y-1/2 overflow-hidden'
              : 'bg-border pointer-events-none absolute top-1/2 bottom-0 left-1/2 w-px -translate-x-1/2 overflow-hidden'
          "
        >
          <span
            data-slot="stepper-connector-fill"
            [attr.data-completed]="index < stepper.activeStep - 1 ? 'true' : 'false'"
            [attr.data-orientation]="orientation"
            class="bg-primary absolute inset-0"
          ></span>
        </span>
      }
      <button
        ui-stepper-indicator
        [status]="status"
        [size]="stepper.size"
        [index]="index + 1"
        [icon]="step.icon"
        [clickable]="clickable"
        class="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
        (click)="navigate()"
      ></button>
    </div>
    <div data-slot="stepper-item-content" [class]="contentClass">
      <button type="button" [class]="titleClass" [disabled]="!clickable" (click)="navigate()">{{ step.title }}</button>
      @if (step.description) {
        <p class="text-muted-foreground mt-0.5 text-xs text-balance">{{ step.description }}</p>
      }
    </div>
  `,
})
export class UiStepperItemComponent {
  readonly stepper = inject(UiStepperComponent)
  @Input({ required: true }) step!: StepperStep
  @Input({ required: true }) index!: number
  @Input('class') className?: string

  get orientation(): StepperOrientation {
    return this.stepper.orientation
  }
  get status(): StepperStatus {
    return this.stepper.getStatus(this.index)
  }
  get isFirst(): boolean {
    return this.index === 0
  }
  get isLast(): boolean {
    return this.index === this.stepper.steps.length - 1
  }
  get clickable(): boolean {
    return this.stepper.isClickable(this.index) && !this.step.disabled
  }

  get hostClass(): string {
    return cn(
      'group/stepper-item relative min-w-0',
      this.orientation === 'horizontal'
        ? 'flex flex-1 flex-col items-center gap-2'
        : 'flex flex-row items-start gap-3 pb-6 last:pb-0',
      this.step.disabled && 'opacity-50',
      this.className,
    )
  }

  get axisClass(): string {
    return cn('relative flex shrink-0', INDICATOR_AXIS[this.orientation][this.stepper.size])
  }

  get contentClass(): string {
    return cn('min-w-0', this.orientation === 'horizontal' ? 'max-w-[12rem] text-center' : 'flex-1 pt-1.5')
  }

  get titleClass(): string {
    const status = this.status
    return cn(
      'text-foreground text-sm font-medium text-balance transition-colors duration-200 outline-none',
      this.clickable &&
        'hover:text-primary focus-visible:text-primary focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
      !this.clickable && 'cursor-default',
      status === 'pending' && 'text-muted-foreground',
      status === 'error' && 'text-destructive',
    )
  }

  navigate(): void {
    if (this.clickable) this.stepper.goToStep(this.index + 1)
  }
}

/* ------------------------------------------------------------------ */
/* StepperHeader / Content / Title / Description                       */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper-header, [ui-stepper-header]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiStepperHeaderComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('stepper-header flex items-center gap-0', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper-content, [ui-stepper-content]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"stepper-content"',
    '[class]': 'hostClass',
    '[style.display]': 'isActive ? null : "none"',
    role: 'tabpanel',
    '[attr.aria-hidden]': '!isActive',
  },
  template: `<ng-content />`,
})
export class UiStepperContentComponent {
  @Input() step = 1
  @Input() activeStep = 1
  @Input('class') className?: string

  get isActive(): boolean {
    return this.step === this.activeStep
  }

  get hostClass(): string {
    return cn(
      'block stepper-content motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper-title, [ui-stepper-title]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiStepperTitleComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('text-foreground text-sm font-medium', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper-description, [ui-stepper-description]',
  standalone: true,
  host: { '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiStepperDescriptionComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('text-muted-foreground text-xs', this.className)
  }
}

/* ------------------------------------------------------------------ */
/* StepperStep (standalone, slot-driven)                               */
/* ------------------------------------------------------------------ */

/**
 * Standalone step row. Slots (React `iconSlot` / `titleSlot` / `descriptionSlot`):
 * project `[slot=icon]`, `[slot=title]`, `[slot=description]` to replace the defaults.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stepper-step, [ui-stepper-step]',
  standalone: true,
  host: {
    '[class]': 'hostClass',
    role: 'tab',
    '[attr.aria-selected]': 'active',
    '[attr.aria-disabled]': 'disabled',
  },
  template: `
    <div data-slot="stepper-indicator" [attr.data-status]="computedStatus" [class]="indicatorClass">
      <ng-content select="[slot=icon]">
        @if (computedStatus === 'completed') {
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
            class="lucide lucide-check size-4"
            data-slot="stepper-indicator-icon"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        } @else if (index) {
          <span data-slot="stepper-indicator-label">{{ index }}</span>
        }
      </ng-content>
    </div>
    <div class="flex flex-col gap-0.5 pt-1">
      <ng-content select="[slot=title]"
        ><span class="text-sm font-medium">{{ title }}</span></ng-content
      >
      <ng-content select="[slot=description]">
        @if (description) {
          <span class="text-muted-foreground text-xs">{{ description }}</span>
        }
      </ng-content>
    </div>
  `,
})
export class UiStepperStepComponent {
  @Input() title = ''
  @Input() description?: string
  @Input({ transform: booleanAttribute }) completed = false
  @Input({ transform: booleanAttribute }) active = false
  @Input({ transform: booleanAttribute }) error = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input() status?: StepperStatus
  @Input() index?: number
  @Input('class') className?: string

  get computedStatus(): StepperStatus {
    if (this.status) return this.status
    if (this.error) return 'error'
    if (this.active) return 'active'
    if (this.completed) return 'completed'
    return 'pending'
  }

  get hostClass(): string {
    return cn('stepper-step flex gap-3', this.className)
  }

  get indicatorClass(): string {
    return cn(stepperIndicatorVariants({ status: this.computedStatus, size: 'default' }))
  }
}

export { stepperIndicatorVariants, type StepperIndicatorVariants } from './stepper.variants'

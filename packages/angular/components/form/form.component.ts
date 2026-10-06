import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  type OnInit,
  TemplateRef,
  ViewChild,
  afterEveryRender,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective, uniqueId } from '@/ui/popper/popper'
import { UiLabelComponent } from '@/ui/label/label.component'

export type FormStatusValue = 'error' | 'warning' | 'success' | null | undefined

interface Subscribable {
  subscribe(fn: () => void): { unsubscribe(): void }
}

/** The parts of an @angular/forms AbstractControl the form parts read (structural, no import). */
export interface FormControlLike {
  readonly invalid: boolean
  readonly touched: boolean
  readonly dirty: boolean
  readonly errors: Record<string, unknown> | null
}

/** The parts of an @angular/forms FormGroup the form parts use: pass your FormGroup. */
export interface FormGroupLike extends FormControlLike {
  get(path: string): FormControlLike | null
  markAllAsTouched(): void
  reset(value?: unknown): void
  readonly events?: Subscribable
}

/**
 * React `Form` (react-hook-form FormProvider) for Angular reactive forms. Put it on the
 * `<form>` next to `[formGroup]` (it reads the same input) or on an `<ng-container [uiForm]="fg">`.
 * It renders nothing. It records submit attempts, marks every control touched and focuses
 * the first invalid field, like react-hook-form's handleSubmit; FormField parts read errors
 * through it (shown after the first submit, then live -- react-hook-form's default modes).
 *
 * No @angular/forms import: any FormGroup satisfies the structural FormGroupLike.
 */
@Directive({
  selector: '[uiForm]',
  standalone: true,
  exportAs: 'uiForm',
  host: { '(submit)': 'onSubmit()' },
})
export class UiFormDirective {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement
  private readonly destroyRef = inject(DestroyRef)
  private sub?: { unsubscribe(): void }
  private _group?: FormGroupLike

  /** Bumped on every value / status change and submit, so readers re-evaluate (zoneless-safe). */
  readonly version = signal(0)
  readonly submitted = signal(false)

  /** The FormGroup (the same `[formGroup]` the reactive-forms directive receives). */
  @Input()
  set formGroup(v: FormGroupLike | undefined) {
    this.sub?.unsubscribe()
    this._group = v
    this.sub = v?.events?.subscribe(() => this.version.update((n) => n + 1))
    this.version.update((n) => n + 1)
  }
  get formGroup(): FormGroupLike | undefined {
    return this._group
  }
  /** Same as `formGroup`, for `<ng-container [uiForm]="fg">`. */
  @Input()
  set uiForm(v: FormGroupLike | '' | undefined) {
    if (v) this.formGroup = v
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.sub?.unsubscribe())
  }

  control(name: string): FormControlLike | null {
    this.version()
    return this._group?.get(name) ?? null
  }

  onSubmit(): void {
    this.submitted.set(true)
    this._group?.markAllAsTouched()
    this.version.update((n) => n + 1)
    if (this._group?.invalid) {
      // react-hook-form shouldFocusError: focus the first invalid field once it is marked.
      requestAnimationFrame(() => {
        this.host.querySelector<HTMLElement>('[aria-invalid="true"]:is(input, textarea, select, button)')?.focus()
      })
    }
  }

  /** Clear the submitted state (react-hook-form `reset`). */
  reset(value?: Record<string, unknown>): void {
    this._group?.reset(value)
    this.submitted.set(false)
    this.version.update((n) => n + 1)
  }
}

/** Human message for a control's first error: a string, `{ message }`, or the error key. */
function errorMessage(errors: Record<string, unknown> | null | undefined): string | undefined {
  if (!errors) return undefined
  const [key, value] = Object.entries(errors)[0] ?? []
  if (key === undefined) return undefined
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && typeof (value as { message?: unknown }).message === 'string') {
    return (value as { message: string }).message
  }
  return key
}

/**
 * React `FormField`: publishes the field name so the label / control / description /
 * message parts derive ids and error state. Use it on an `<ng-container>` (renders nothing)
 * or directly on the `<ui-form-item>`; bind the control itself with `formControlName`.
 */
@Directive({
  selector: '[uiFormField]',
  standalone: true,
  exportAs: 'uiFormField',
})
export class UiFormFieldDirective {
  private readonly form = inject(UiFormDirective, { optional: true })

  /** The control name in the FormGroup (React `name`). */
  @Input({ alias: 'uiFormField', required: true }) name = ''

  get control(): FormControlLike | null {
    return this.form?.control(this.name) ?? null
  }

  /** react-hook-form fieldState.error: only after a submit attempt, then live. */
  get error(): { message?: string } | undefined {
    const c = this.control
    if (!c || !this.form?.submitted() || !c.invalid) return undefined
    return { message: errorMessage(c.errors) }
  }

  get invalid(): boolean {
    return !!this.control?.invalid
  }
  get isTouched(): boolean {
    return !!this.control?.touched
  }
  get isDirty(): boolean {
    return !!this.control?.dirty
  }
}

/** React FormItem context: the per-item id the field parts build on. */
export class FormItemContext {
  readonly id = uniqueId('form')
}

export interface FormFieldState {
  id: string
  name: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  error: { message?: string } | undefined
  invalid: boolean
  isTouched: boolean
  isDirty: boolean
}

/**
 * React `useFormField()`: call it in an injection context inside a FormField. Returns a
 * getter-based view of the ids and error state (read it in templates / getters).
 */
export function injectFormField(): FormFieldState {
  const field = inject(UiFormFieldDirective, { optional: true })
  const item = inject(FormItemContext, { optional: true })
  if (!field) throw new Error('useFormField must be used within <FormField> ([uiFormField])')
  return {
    get id() {
      return item?.id ?? 'undefined'
    },
    get name() {
      return field.name
    },
    get formItemId() {
      return `${this.id}-form-item`
    },
    get formDescriptionId() {
      return `${this.id}-form-item-description`
    },
    get formMessageId() {
      return `${this.id}-form-item-message`
    },
    get error() {
      return field.error
    },
    get invalid() {
      return field.invalid
    },
    get isTouched() {
      return field.isTouched
    },
    get isDirty() {
      return field.isDirty
    },
  }
}
/** React name for {@link injectFormField}. */
export const useFormField = injectFormField

/**
 * React FormItem: the `grid gap-1.5` field block. Optional `label` / `required` /
 * `description` / `status` / `help` props render the label row, hint and status help text
 * (and tint nested inputs by status); `layout="horizontal"` puts the label in a
 * `labelWidth` column.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-form-item',
  standalone: true,
  imports: [UiLabelComponent],
  providers: [FormItemContext],
  host: {
    'data-uipkge': '',
    'data-slot': 'form-item',
    '[class]': 'hostClass',
    '[style.--label-width]': 'labelWidth || null',
  },
  template: `
    @if (label || required) {
      <div class="flex items-center gap-1">
        @if (label) {
          <label ui-label [for]="ctx.id + '-form-item'" [class]="labelClass">{{ label }}</label>
        }
        @if (required) {
          <span class="text-destructive text-sm" aria-hidden="true">*</span>
        }
      </div>
    }
    <div [class]="bodyClass">
      <ng-content />
      @if (description) {
        <p class="text-muted-foreground text-xs">{{ description }}</p>
      }
      @if (help) {
        <p [attr.role]="status === 'error' ? 'alert' : null" [class]="helpClass">{{ help }}</p>
      }
    </div>
  `,
})
export class UiFormItemComponent {
  readonly ctx = inject(FormItemContext)

  @Input() label?: string
  @Input({ transform: booleanAttribute }) required = false
  @Input() description?: string
  @Input() status?: FormStatusValue
  @Input() help?: string
  @Input() layout: 'vertical' | 'horizontal' = 'vertical'
  @Input() labelWidth?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'grid gap-1.5',
      this.layout === 'horizontal' && 'grid-cols-[var(--label-width,140px)_1fr] items-start gap-x-4 gap-y-0',
      this.className,
    )
  }

  get labelClass(): string {
    return cn(this.status === 'error' && 'text-destructive')
  }

  get bodyClass(): string {
    return cn(
      'space-y-1',
      // An empty <ui-form-message> host stays in the DOM (React renders nothing): keep its
      // previous sibling from picking up the space-y gap, as if it were the last child.
      '[&>:has(+ui-form-message:empty:last-child)]:mb-0',
      // React Radix Select renders a hidden native <select> as a direct sibling of <button>,
      // giving <button> a 4px (mb-1) margin under space-y-1. Angular wraps them in <ui-select>,
      // so give the trigger button that same 4px gap when a hidden select is present.
      '[&>ui-select:has(select)>[data-slot=select-trigger]]:mb-1',
      this.status === 'error' &&
        '[&_input]:border-destructive [&_textarea]:border-destructive [&_button]:border-destructive',
      this.status === 'warning' && '[&_input]:border-warning [&_textarea]:border-warning [&_button]:border-warning',
      this.status === 'success' && '[&_input]:border-success [&_textarea]:border-success [&_button]:border-success',
    )
  }

  get helpClass(): string {
    return cn(
      'text-xs',
      this.status === 'error' && 'text-destructive',
      this.status === 'warning' && 'text-warning',
      this.status === 'success' && 'text-success',
      !this.status && 'text-muted-foreground',
    )
  }
}

/** React FormLabel: the Label, linked to the field control and red while it has an error. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'label[ui-form-label], ui-form-label',
  standalone: true,
  host: {
    // Runs after the inherited Label bindings, so these win.
    '[attr.data-slot]': '"form-label"',
    '[attr.data-error]': 'field.error ? "true" : "false"',
  },
  template: `<ng-content />`,
})
export class UiFormLabelComponent extends UiLabelComponent {
  readonly field = injectFormField()

  constructor() {
    super()
    // React passes htmlFor={formItemId} before the user's props, so a `for` input still wins.
    this.htmlFor = this.field.formItemId
  }

  override get hostClass(): string {
    return cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      cn('data-[error=true]:text-destructive', this.className),
    )
  }
}

/**
 * React FormControl (Radix Slot): put it on the control -- `<ui-input uiFormControl>`,
 * `<input uiFormControl>`, `<ui-textarea uiFormControl>`. The id / aria-describedby /
 * aria-invalid / data-slot land on the native input, textarea or select (the host itself
 * when it is one), which is where React's Slot props end up for Input.
 */
@Directive({
  selector: '[uiFormControl], [ui-form-control]',
  standalone: true,
})
export class UiFormControlDirective {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement
  readonly field = injectFormField()

  constructor() {
    afterEveryRender(() => this.apply())
  }

  private get target(): HTMLElement | null {
    if (this.host.matches('input, textarea, select, button')) return this.host
    return this.host.querySelector<HTMLElement>('input, textarea, select')
  }

  private apply(): void {
    const el = this.target
    if (!el) return
    const f = this.field
    const describedBy = !f.error ? f.formDescriptionId : `${f.formDescriptionId} ${f.formMessageId}`
    const set = (name: string, value: string) => {
      if (el.getAttribute(name) !== value) el.setAttribute(name, value)
    }
    set('data-uipkge', '')
    set('data-slot', 'form-control')
    set('id', f.formItemId)
    set('aria-describedby', describedBy)
    set('aria-invalid', f.error ? 'true' : 'false')
    // An Input's bordered wrapper mirrors aria-invalid for its destructive ring.
    const wrapper = el.closest('[data-slot="input"]')
    if (wrapper && this.host.contains(wrapper)) {
      if (wrapper.getAttribute('aria-invalid') !== (f.error ? 'true' : 'false'))
        wrapper.setAttribute('aria-invalid', f.error ? 'true' : 'false')
    }
  }
}

/** React FormDescription: hint text wired to the control through aria-describedby. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'p[ui-form-description], ui-form-description',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'form-description',
    '[attr.id]': 'field.formDescriptionId',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiFormDescriptionComponent {
  readonly field = injectFormField()
  private readonly isP = inject(ElementRef).nativeElement.tagName === 'P'
  @Input('class') className?: string

  get hostClass(): string {
    return cn(!this.isP && 'block', 'text-muted-foreground text-sm', this.className)
  }
}

/**
 * React FormMessage: the field's error (role=alert), or the projected text when there is
 * none; renders nothing when both are empty.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-form-message',
  standalone: true,
  imports: [UiRenderTemplateDirective],
  host: { '[attr.class]': '"contents"' },
  template: `
    <ng-template #content><ng-content /></ng-template>
    @if (field.error?.message; as message) {
      <p data-uipkge="" data-slot="form-message" [attr.id]="field.formMessageId" role="alert" [class]="pClass">
        {{ message }}
      </p>
    } @else if (hasContent) {
      <p data-uipkge="" data-slot="form-message" [attr.id]="field.formMessageId" role="alert" [class]="pClass">
        <ng-container [uiRenderTemplate]="content" />
      </p>
    }
  `,
})
export class UiFormMessageComponent implements OnInit {
  readonly field = injectFormField()
  @ViewChild('content', { static: true }) content!: TemplateRef<unknown>
  @Input('class') className?: string
  /** Whether anything was projected (React `children`), measured once. */
  hasContent = false

  ngOnInit(): void {
    const probe = this.content.createEmbeddedView(null)
    this.hasContent = probe.rootNodes.some(
      (n: Node) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim()),
    )
    probe.destroy()
  }

  get pClass(): string {
    return cn('text-destructive text-sm', this.className)
  }
}

/** React FormSection: optional divider + heading / subtitle, description, then the fields. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-form-section',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'form-section',
    '[class]': 'hostClass',
  },
  template: `
    @if (divider || title || subtitle) {
      <div [class]="dividerClass">
        @if (title || subtitle) {
          <div class="space-y-1">
            @if (title) {
              @switch (headingLevel) {
                @case ('h2') {
                  <h2 class="text-sm font-semibold">{{ title }}</h2>
                }
                @case ('h3') {
                  <h3 class="text-sm font-semibold">{{ title }}</h3>
                }
                @case ('h5') {
                  <h5 class="text-sm font-semibold">{{ title }}</h5>
                }
                @default {
                  <h4 class="text-sm font-semibold">{{ title }}</h4>
                }
              }
            }
            @if (subtitle) {
              <p class="text-muted-foreground text-xs">{{ subtitle }}</p>
            }
          </div>
        }
      </div>
    }
    @if (description) {
      <p class="text-muted-foreground text-xs">{{ description }}</p>
    }
    <ng-content />
  `,
})
export class UiFormSectionComponent {
  @Input() title?: string
  @Input() subtitle?: string
  @Input() description?: string
  @Input({ transform: booleanAttribute }) divider = false
  @Input() headingLevel: 'h2' | 'h3' | 'h4' | 'h5' = 'h4'
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block space-y-3', this.className)
  }

  get dividerClass(): string {
    return cn(this.divider && 'border-t pt-4')
  }
}

const alignClasses = { left: 'justify-start', center: 'justify-center', right: 'justify-end' } as const
const gapClasses = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' } as const

/** React FormActions: the button row. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-form-actions',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'form-actions',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiFormActionsComponent {
  @Input() align: 'left' | 'center' | 'right' = 'right'
  @Input() gap: 'sm' | 'md' | 'lg' = 'md'
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-wrap items-center', alignClasses[this.align], gapClasses[this.gap], this.className)
  }
}

const statusContainer = {
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-warning/10 text-warning border-warning/30',
  success: 'bg-success/10 text-success border-success/30',
} as const

/** React FormStatus: a tinted banner with an icon; role=alert for errors, status otherwise. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-form-status',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'form-status',
    '[attr.role]': 'status === "error" ? "alert" : "status"',
    '[class]': 'hostClass',
  },
  template: `
    @switch (status) {
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
          class="lucide lucide-circle-alert size-4 shrink-0"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
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
          class="lucide lucide-triangle-alert size-4 shrink-0"
          aria-hidden="true"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
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
          class="lucide lucide-circle-check size-4 shrink-0"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      }
    }
    <span>{{ message }}</span>
  `,
})
export class UiFormStatusComponent {
  @Input() status: NonNullable<FormStatusValue> = 'error'
  @Input() message = ''
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
      statusContainer[this.status],
      this.className,
    )
  }
}

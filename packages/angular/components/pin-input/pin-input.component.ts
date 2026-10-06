import {
  type AfterViewChecked,
  type AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  numberAttribute,
  signal,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'

export type PinInputStatus = 'error' | 'warning' | 'success' | 'default'
export type PinInputSize = 'sm' | 'md' | 'lg'

/** One entry per slot, like input-otp's OTPInputContext `slots`. */
export interface PinInputSlotState {
  char: string | null
  placeholderChar: string | null
  isActive: boolean
  hasFakeCaret: boolean
}

const TEXT_ALIGN: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

/**
 * Angular port of the React PinInput (input-otp). The `<ui-pin-input>` host is input-otp's
 * container (`data-input-otp-container`): the projected groups / slots / separators, then
 * one transparent native <input> stretched over the whole row. The input owns the value,
 * the caret and the selection; slots render `value[index]` and the slot under the caret
 * is `data-active`. Typing, Backspace, arrows and paste are the native input's.
 *
 * Model is React's `value` / `defaultValue` / `valueChange` (React / input-otp `onChange`);
 * `complete` fires once the last slot fills. `status` paints the slots and shakes once
 * when it becomes 'error'; `mask` renders dots. NG_VALUE_ACCESSOR is provided for forms.
 *
 * The keyframes below are React's injected pin-input stylesheet, copied verbatim.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pin-input',
  standalone: true,
  exportAs: 'uiPinInput',
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiPinInputComponent), multi: true }],
  host: {
    'data-input-otp-container': 'true',
    '[attr.class]': 'containerClass',
    '[style.--root-height]': 'rootHeight()',
    // These belong to the native <input>.
    '[attr.id]': 'null',
    '[attr.aria-label]': 'null',
  },
  styles: [
    `
      @keyframes pin-slot-pop {
        0% {
          transform: scale(1);
        }
        40% {
          transform: scale(1.06);
        }
        100% {
          transform: scale(1);
        }
      }
      @keyframes pin-char-pop {
        0% {
          opacity: 0.55;
          transform: scale(0.88);
        }
        55% {
          opacity: 1;
          transform: scale(1.06);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes pin-input-shake {
        0%,
        100% {
          transform: translateX(0);
        }
        20% {
          transform: translateX(-5px);
        }
        40% {
          transform: translateX(5px);
        }
        60% {
          transform: translateX(-3px);
        }
        80% {
          transform: translateX(3px);
        }
      }
      [data-slot='pin-input-slot'].pin-slot-pop {
        animation: pin-slot-pop 200ms cubic-bezier(0.22, 1.25, 0.36, 1) both;
        z-index: 1;
      }
      [data-slot='pin-input-slot'] .pin-char-pop {
        display: inline-block;
        transform-origin: center center;
        animation: pin-char-pop 200ms cubic-bezier(0.22, 1.25, 0.36, 1) both;
      }
      /* Class may live on OTPInput's container (no data-slot) or a root wrapper. */
      .pin-input-shake {
        animation: pin-input-shake 380ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-slot='pin-input-slot'].pin-slot-pop,
        [data-slot='pin-input-slot'] .pin-char-pop,
        .pin-input-shake {
          animation: none !important;
        }
        [data-slot='pin-input-slot'] {
          transition-duration: 0ms !important;
        }
      }
    `,
  ],
  template: `
    <ng-content />
    <div class="pointer-events-none absolute inset-0">
      <input
        #inputEl
        [attr.autocomplete]="autoComplete"
        [attr.id]="id ?? null"
        [attr.name]="name ?? null"
        [attr.aria-label]="ariaLabel ?? null"
        data-uipkge=""
        data-slot="pin-input"
        [attr.data-status]="status === 'default' ? null : status"
        data-input-otp="true"
        [attr.data-input-otp-placeholder-shown]="currentValue().length === 0 ? 'true' : null"
        [attr.data-input-otp-mss]="mss()"
        [attr.data-input-otp-mse]="mse()"
        [attr.inputmode]="inputMode"
        [attr.pattern]="patternSource"
        [attr.aria-placeholder]="placeholder ?? null"
        [attr.maxlength]="maxLength"
        [value]="currentValue()"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [required]="required"
        [autofocus]="autoFocus"
        [class]="inputClass"
        (paste)="handlePaste($event)"
        (input)="handleChange($event)"
        (focus)="handleFocus($event)"
        (blur)="handleBlur($event)"
      />
    </div>
  `,
})
export class UiPinInputComponent implements ControlValueAccessor, AfterViewInit, AfterViewChecked {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly destroyRef = inject(DestroyRef)
  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>

  private readonly _valueProp = signal<string | undefined>(undefined)
  private readonly _internal = signal<string | null>(null)
  private readonly _status = signal<PinInputStatus>('default')
  private readonly _maxLength = signal(6)

  /** Controlled value (React `value`). Reading it returns the resolved current value. */
  @Input()
  set value(v: string | null | undefined) {
    this._valueProp.set(v == null ? undefined : String(v))
  }
  get value(): string {
    return this.currentValue()
  }
  @Input() defaultValue?: string
  /** React / input-otp `onChange`: the joined string on every edit. */
  @Output() valueChange = new EventEmitter<string>()
  /** React `onComplete`: the joined string once every slot is filled. */
  @Output() complete = new EventEmitter<string>()
  @Output('focus') focusEvent = new EventEmitter<FocusEvent>()
  @Output('blur') blurEvent = new EventEmitter<FocusEvent>()

  /** Number of slots (input-otp `maxLength`). */
  @Input({ transform: numberAttribute })
  set maxLength(v: number) {
    this._maxLength.set(v)
  }
  get maxLength(): number {
    return this._maxLength()
  }
  /** Render the typed characters as dots instead of plain text. */
  @Input({ transform: booleanAttribute }) mask = false
  @Input()
  set status(v: PinInputStatus) {
    this._status.set(v ?? 'default')
  }
  get status(): PinInputStatus {
    return this._status()
  }
  @Input() size: PinInputSize = 'md'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  @Input({ transform: booleanAttribute }) required = false
  @Input({ transform: booleanAttribute }) autoFocus = false
  /** Only accept values matching this pattern (input-otp REGEXP_ONLY_DIGITS etc.). */
  @Input() pattern?: string | RegExp
  @Input() inputMode = 'numeric'
  @Input() placeholder?: string
  @Input() textAlign: 'left' | 'center' | 'right' = 'left'
  @Input() pasteTransformer?: (pasted: string) => string
  @Input() autoComplete = 'one-time-code'
  @Input() id?: string
  @Input() name?: string
  @Input('aria-label') ariaLabel?: string
  /** React `className`: lands on the native input. */
  @Input('class') className?: string
  @Input() containerClassName?: string

  readonly currentValue = computed(() => this._valueProp() ?? this._internal() ?? this.defaultValue ?? '')
  readonly isFocused = signal(false)
  readonly mss = signal<number | null>(null)
  readonly mse = signal<number | null>(null)
  readonly rootHeight = signal<string | null>(null)
  readonly isShaking = signal(false)

  /** input-otp's slot model, read by every <ui-pin-input-slot>. */
  readonly slots = computed<PinInputSlotState[]>(() => {
    const v = this.currentValue()
    const focused = this.isFocused()
    const start = this.mss()
    const end = this.mse()
    return Array.from({ length: this._maxLength() }, (_, o) => {
      const isActive =
        focused && start !== null && end !== null && ((start === end && o === start) || (o >= start && o < end))
      const char = v[o] !== undefined ? v[o]! : null
      const placeholderChar = v[0] !== undefined ? null : (this.placeholder?.[o] ?? null)
      return { char, placeholderChar, isActive, hasFakeCaret: isActive && char === null }
    })
  })

  private prevSelection: [number | null, number | null, string | null] = [null, null, null]
  private readonly timers = new Set<ReturnType<typeof setTimeout>>()
  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}

  constructor() {
    // onComplete: only on the edit that fills the last slot.
    let prev: string | undefined
    effect(() => {
      const v = this.currentValue()
      const max = this._maxLength()
      untracked(() => {
        if (prev !== undefined && v !== prev && prev.length < max && v.length === max) this.complete.emit(v)
        prev = v
      })
    })
    // One-shot shake when status transitions into error (not on mount).
    let prevStatus: PinInputStatus | null = null
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    effect(() => {
      const status = this._status()
      untracked(() => {
        if (prevStatus !== null && status === 'error' && prevStatus !== 'error') {
          this.isShaking.set(false)
          cancelAnimationFrame(frame)
          clearTimeout(timer)
          // Restart the animation on the next frame; clear it once it has run.
          frame = requestAnimationFrame(() => {
            this.isShaking.set(true)
            timer = setTimeout(() => this.isShaking.set(false), 400)
          })
        }
        prevStatus = status
      })
    })
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      for (const id of this.timers) clearTimeout(id)
    })
  }

  get patternSource(): string | null {
    const p = this.pattern
    return p ? (typeof p === 'string' ? p : p.source) : null
  }

  get containerClass(): string {
    return cn(
      // input-otp's container inline styles, as utilities.
      'relative select-none pointer-events-none',
      this.disabled ? 'cursor-default' : 'cursor-text',
      'flex items-center gap-2 has-disabled:opacity-50',
      this.isShaking() && 'pin-input-shake',
      this.containerClassName,
    )
  }

  get inputClass(): string {
    return cn(
      // input-otp's input inline styles + injected stylesheet, as utilities.
      'absolute inset-0 flex h-full w-full bg-transparent leading-none tabular-nums text-transparent caret-transparent opacity-100 shadow-none pointer-events-auto',
      'border-0 border-solid border-transparent outline-0 outline-solid outline-transparent',
      'tracking-[-.5em] text-[length:var(--root-height)] font-[monospace]',
      TEXT_ALIGN[this.textAlign],
      'selection:bg-transparent selection:text-transparent',
      'autofill:bg-transparent! autofill:text-transparent! autofill:border-transparent! autofill:opacity-0! autofill:shadow-none! autofill:[-webkit-text-fill-color:transparent]!',
      'disabled:cursor-not-allowed',
      this.className,
    )
  }

  private get regex(): RegExp | null {
    const p = this.pattern
    return p ? (typeof p === 'string' ? new RegExp(p) : p) : null
  }

  ngAfterViewInit(): void {
    const input = this.inputEl.nativeElement
    this.prevSelection = [input.selectionStart, input.selectionEnd, input.selectionDirection]
    const onSelection = () => this.syncSelection()
    document.addEventListener('selectionchange', onSelection, { capture: true })
    this.syncSelection()
    if (document.activeElement === input) this.isFocused.set(true)
    const measure = () => this.rootHeight.set(`${input.clientHeight}px`)
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(input)
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('selectionchange', onSelection, { capture: true })
      ro?.disconnect()
    })
  }

  /** The [value] binding misses a rejected edit (pattern / controlled parent): sync the DOM. */
  ngAfterViewChecked(): void {
    const el = this.inputEl?.nativeElement
    if (el && el.value !== this.currentValue()) el.value = this.currentValue()
  }

  /** input-otp's selectionchange handler: keep a one-char selection so the caret "is" a slot. */
  syncSelection(): void {
    const t = this.inputEl?.nativeElement
    if (!t) return
    if (document.activeElement !== t) {
      this.mss.set(null)
      this.mse.set(null)
      return
    }
    const c = t.selectionStart
    const b = t.selectionEnd
    const dir = t.selectionDirection
    const v = t.maxLength
    const C = t.value
    const prev = this.prevSelection
    let g = -1
    let E = -1
    let w: 'forward' | 'backward' | undefined
    if (C.length !== 0 && c !== null && b !== null) {
      const collapsed = c === b
      const atEnd = c === C.length && C.length < v
      if (collapsed && !atEnd) {
        const y = c
        if (y === 0) {
          g = 0
          E = 1
          w = 'forward'
        } else if (y === v) {
          g = y - 1
          E = y
          w = 'backward'
        } else if (v > 1 && C.length > 1) {
          let et = 0
          if (prev[0] !== null && prev[1] !== null) {
            w = y < prev[1] ? 'backward' : 'forward'
            const wasCollapsed = prev[0] === prev[1] && prev[0] < v
            if (w === 'backward' && !wasCollapsed) et = -1
          }
          g = et + y
          E = et + y + 1
        }
      }
      if (g !== -1 && E !== -1 && g !== E) t.setSelectionRange(g, E, w)
    }
    const start = g !== -1 ? g : c
    const end = E !== -1 ? E : b
    this.mss.set(start)
    this.mse.set(end)
    this.prevSelection = [start, end, w ?? dir]
  }

  /** input-otp re-reads the selection a few times after the value / focus changes. */
  private resyncSoon(): void {
    const read = () => {
      const t = this.inputEl?.nativeElement
      if (!t) return
      const s = t.selectionStart
      const e = t.selectionEnd
      if (s !== null && e !== null && document.activeElement === t) {
        this.mss.set(s)
        this.mse.set(e)
        this.prevSelection = [s, e, t.selectionDirection]
      }
    }
    for (const ms of [0, 10, 50]) {
      const id = setTimeout(() => {
        this.timers.delete(id)
        read()
      }, ms)
      this.timers.add(id)
    }
  }

  private setValue(next: string): void {
    this._internal.set(next)
    this.onChange(next)
    this.valueChange.emit(next)
  }

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement
    const next = target.value.slice(0, this.maxLength)
    const re = this.regex
    if (next.length > 0 && re && !re.test(next)) return
    const prev = this.currentValue()
    if (next.length < prev.length) document.dispatchEvent(new Event('selectionchange'))
    this.setValue(next)
    this.resyncSoon()
  }

  handleFocus(event: FocusEvent): void {
    const t = this.inputEl.nativeElement
    const start = Math.min(t.value.length, this.maxLength - 1)
    const end = t.value.length
    t.setSelectionRange(start, end)
    this.mss.set(start)
    this.mse.set(end)
    this.isFocused.set(true)
    this.resyncSoon()
    this.focusEvent.emit(event)
  }

  handleBlur(event: FocusEvent): void {
    this.isFocused.set(false)
    this.onTouched()
    this.blurEvent.emit(event)
  }

  /** input-otp only takes over paste with a pasteTransformer (and on iOS). */
  handlePaste(event: ClipboardEvent): void {
    const t = this.inputEl.nativeElement
    if (!this.pasteTransformer || !event.clipboardData) return
    const raw = event.clipboardData.getData('text/plain')
    const content = this.pasteTransformer(raw)
    event.preventDefault()
    const v = this.currentValue()
    const s = t.selectionStart ?? 0
    const e = t.selectionEnd ?? s
    const next = (s !== e ? v.slice(0, s) + content + v.slice(e) : v.slice(0, s) + content + v.slice(s)).slice(
      0,
      this.maxLength,
    )
    const re = this.regex
    if (next.length > 0 && re && !re.test(next)) return
    t.value = next
    this.setValue(next)
    const start = Math.min(next.length, this.maxLength - 1)
    t.setSelectionRange(start, next.length)
    this.mss.set(start)
    this.mse.set(next.length)
  }

  /** Focus the hidden input (React: the forwarded ref). */
  focus(): void {
    this.inputEl?.nativeElement.focus()
  }

  writeValue(v: string | null): void {
    this._internal.set(v ?? '')
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
    this.cdr.markForCheck()
  }
}

/** React PinInputGroup: a flush row of slots. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pin-input-group',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'pin-input-group',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiPinInputGroupComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex items-center', this.className)
  }
}

const sizeClassMap: Record<PinInputSize, string> = {
  sm: 'h-8 w-8 text-sm',
  lg: 'h-12 w-12 text-xl',
  md: 'h-10 w-10 text-base',
}

const statusClassMap: Record<PinInputStatus, string> = {
  error: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/40 text-destructive',
  warning: 'border-warning focus-within:border-warning focus-within:ring-warning/40 text-warning',
  success: 'border-success focus-within:border-success focus-within:ring-success/40 text-success',
  default: '',
}

/** React PinInputSlot: renders `value[index]` (or a dot when masked); pops when a char lands. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pin-input-slot',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'pin-input-slot',
    '[attr.data-active]': 'slot()?.isActive ? "" : null',
    '[class]': 'hostClass',
    '(animationend)': 'onAnimationEnd($event)',
  },
  template: `
    @if (slot()?.char != null) {
      @for (gen of [popGen()]; track gen) {
        @if (effectiveMask) {
          <span [class]="maskClass"></span>
        } @else {
          <span [class]="gen > 0 ? 'pin-char-pop' : ''">{{ slot()!.char }}</span>
        }
      }
    }
  `,
})
export class UiPinInputSlotComponent {
  private readonly root = inject(UiPinInputComponent)
  private readonly _index = signal(0)

  @Input({ required: true, transform: numberAttribute })
  set index(v: number) {
    this._index.set(v)
  }
  get index(): number {
    return this._index()
  }
  /** Override the inherited mask flag for this slot. */
  @Input({ transform: (v: unknown) => (v === undefined || v === null ? undefined : booleanAttribute(v)) })
  mask?: boolean
  @Input('class') className?: string

  readonly slot = computed<PinInputSlotState | undefined>(() => this.root.slots()[this._index()])
  readonly popGen = signal(0)
  readonly isPopping = signal(false)

  constructor() {
    // Quiet pop when a character lands (including paste into this slot); not on mount.
    let first = true
    let prevChar: string | null = null
    effect(() => {
      const char = this.slot()?.char ?? null
      untracked(() => {
        if (first) {
          first = false
          prevChar = char
          return
        }
        if (char != null && char !== '' && char !== prevChar) {
          this.popGen.update((g) => g + 1)
          this.isPopping.set(true)
        }
        prevChar = char
      })
    })
  }

  get effectiveMask(): boolean {
    return this.mask ?? this.root.mask
  }

  get maskClass(): string {
    return cn('bg-foreground size-2 rounded-full', this.popGen() > 0 && 'pin-char-pop')
  }

  get hostClass(): string {
    return cn(
      'border-input bg-background text-foreground relative -ml-px flex items-center justify-center border text-center shadow-xs outline-none first:ml-0 first:rounded-l-md last:rounded-r-md',
      'transition-[border-color,box-shadow,color,transform] duration-150 ease-out',
      'focus-within:border-ring focus-within:ring-ring/40 focus-within:relative focus-within:z-10 focus-within:ring-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.slot()?.isActive && 'border-ring ring-ring/40 z-10 ring-2',
      this.isPopping() && 'pin-slot-pop',
      sizeClassMap[this.root.size],
      statusClassMap[this.root.status],
      this.className,
    )
  }

  /** Only clear on the slot animation -- the child char-pop bubbles first. */
  onAnimationEnd(event: AnimationEvent): void {
    if (event.target === event.currentTarget && event.animationName === 'pin-slot-pop') this.isPopping.set(false)
  }
}

/** React PinInputSeparator: a Minus icon (or projected content) between groups. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pin-input-separator',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'pin-input-separator',
    role: 'separator',
    class: 'block',
  },
  template: `<ng-content
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
      class="lucide lucide-minus"
      aria-hidden="true"
    >
      <path d="M5 12h14" /></svg
  ></ng-content>`,
})
export class UiPinInputSeparatorComponent {}

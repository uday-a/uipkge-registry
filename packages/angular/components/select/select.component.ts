import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  DestroyRef,
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
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import {
  BodyPortal,
  autoPlace,
  lockScroll,
  pushDismissableLayer,
  uniqueId,
  type PopperAlign,
  type PopperSide,
} from '@/ui/popper/popper'

export type SelectTriggerSize = 'sm' | 'default' | 'lg'
export type SelectTriggerState = 'default' | 'error' | 'success'
export type SelectPosition = 'popper' | 'item-aligned'

/** Radix CONTENT_MARGIN: gap kept between the listbox and the viewport edge. */
const CONTENT_MARGIN = 10

/** Radix Select typeahead: accumulate keys for 1s, repeated single keys cycle matches. */
class Typeahead {
  search = ''
  private timer?: ReturnType<typeof setTimeout>

  push(key: string): string {
    this.search += key
    clearTimeout(this.timer)
    if (this.search) this.timer = setTimeout(() => (this.search = ''), 1000)
    return this.search
  }

  reset(): void {
    this.search = ''
    clearTimeout(this.timer)
  }
}

function findNextItem<T extends { textValue: string }>(items: T[], search: string, current?: T): T | undefined {
  const isRepeated = search.length > 1 && Array.from(search).every((c) => c === search[0])
  const normalized = isRepeated ? search[0]! : search
  const index = current ? items.indexOf(current) : -1
  let wrapped = items.map((_, i) => items[(Math.max(index, 0) + i) % items.length]!)
  if (normalized.length === 1) wrapped = wrapped.filter((item) => item !== current)
  const next = wrapped.find((item) => item.textValue.toLowerCase().startsWith(normalized.toLowerCase()))
  return next !== current ? next : undefined
}

/**
 * Angular port of UIPKGE Select, behaving like the Radix Select the React component
 * wraps: a `role="combobox"` trigger showing the selected item's text (or a placeholder),
 * a body-portalled listbox positioned against the trigger (`position="popper"`, the React
 * default, or `item-aligned`), check indicators, groups / labels / separators, scroll
 * up / down buttons, typeahead (trigger + open list), arrow / Home / End keys, Escape and
 * outside-click dismiss, focus returned to the trigger, and a hidden native `<select>`
 * for form submission. Registers NG_VALUE_ACCESSOR so [formControl] / ngModel bind.
 * Class strings are identical to the React source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select, [ui-select]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSelectComponent), multi: true }],
  host: {
    '[attr.data-slot]': '"select"',
    '[attr.data-uipkge]': '""',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
    // Radix Root renders no element: keep the wrapper out of layout.
    class: 'contents',
  },
  template: `
    <ng-content />
    @if (isFormControl) {
      <select
        aria-hidden="true"
        tabindex="-1"
        class="sr-only"
        [attr.name]="name ?? null"
        [attr.form]="form ?? null"
        [attr.autocomplete]="autoComplete ?? null"
        [required]="required"
        [disabled]="disabled"
        (change)="onNativeChange($event)"
      >
        <option value=""></option>
        @for (item of items(); track item) {
          <option [value]="item.value" [selected]="item.value === value">{{ item.textValue }}</option>
        }
      </select>
    }
  `,
})
export class UiSelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly _value = signal<string | undefined>(undefined)
  private readonly _open = signal<boolean | null>(null)

  @Input()
  set value(v: string | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): string | undefined {
    return this._value()
  }
  @Input() defaultValue?: string
  @Output() valueChange = new EventEmitter<string>()
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Output() openChange = new EventEmitter<boolean>()
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) required = false
  @Input() name?: string
  @Input() form?: string
  @Input() autoComplete?: string
  @Input() dir: 'ltr' | 'rtl' = 'ltr'

  readonly contentId = uniqueId('select-content')
  readonly items = signal<UiSelectItemComponent[]>([])
  trigger?: HTMLElement
  content?: UiSelectContentComponent
  readonly typeahead = new Typeahead()

  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}

  get isOpen(): boolean {
    if (this.open !== undefined) return this.open
    return this._open() ?? this.defaultOpen
  }

  /** Radix shouldShowPlaceholder: nothing selected yet (undefined or ''). */
  get showPlaceholder(): boolean {
    return this.value === undefined || this.value === ''
  }

  /** Radix renders the bubble <select> only inside a form (or with a `form` id). */
  get isFormControl(): boolean {
    return !!this.form || !!this.trigger?.closest('form')
  }

  ngOnInit(): void {
    if (this._value() === undefined && this.defaultValue !== undefined) this._value.set(this.defaultValue)
  }

  ngOnChanges(): void {
    this.content?.sync()
  }

  setOpen(value: boolean): void {
    if (value && this.disabled) return
    if (value === this.isOpen) return
    this._open.set(value)
    this.openChange.emit(value)
    this.content?.sync()
  }

  /** Select a value (item click / Enter / trigger typeahead). */
  select(value: string): void {
    if (value === this.value) return
    this._value.set(value)
    this.valueChange.emit(value)
    this.onChange(value)
  }

  register(item: UiSelectItemComponent): void {
    this.items.update((list) => [...list, item])
  }

  unregister(item: UiSelectItemComponent): void {
    this.items.update((list) => list.filter((i) => i !== item))
  }

  /**
   * Items in template order. Registration order is used (not DOM order): while the list is
   * closed the projected items are detached nodes, which have no document order.
   */
  orderedItems(): UiSelectItemComponent[] {
    return this.items()
  }

  selectedItem(): UiSelectItemComponent | undefined {
    return this.items().find((i) => i.value === this.value)
  }

  /** Closed-trigger typeahead: selects the next matching item without opening (Radix). */
  typeaheadSelect(key: string): void {
    const search = this.typeahead.push(key)
    const enabled = this.orderedItems().filter((i) => !i.disabled)
    const next = findNextItem(
      enabled,
      search,
      enabled.find((i) => i.value === this.value),
    )
    if (next) this.select(next.value)
  }

  markTouched(): void {
    this.onTouched()
  }

  onNativeChange(event: Event): void {
    this.select((event.target as HTMLSelectElement).value)
  }

  writeValue(v: string | null): void {
    this.value = v
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

/** Radix Select.Group: `role="group"` labelled by its SelectLabel. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-group, [ui-select-group]',
  standalone: true,
  host: {
    '[attr.role]': '"group"',
    '[attr.aria-labelledby]': 'labelId ?? null',
    class: 'block',
  },
  template: `<ng-content />`,
})
export class UiSelectGroupComponent {
  labelId?: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-value, [ui-select-value]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"select-value"',
  },
  template: ``,
})
export class UiSelectValueComponent implements AfterViewChecked {
  private readonly select = inject(UiSelectComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input() placeholder?: string
  private rendered: string | null = null

  constructor() {
    // Radix Value style: the text never intercepts clicks meant for the trigger.
    this.el.style.pointerEvents = 'none'
  }

  /**
   * Radix portals the selected ItemText into the Value; here the selected item's text
   * nodes are cloned in (they exist while the list is closed: projected content is
   * instantiated eagerly), so icons inside item text carry over like in React.
   */
  ngAfterViewChecked(): void {
    const item = this.select.showPlaceholder ? undefined : this.select.selectedItem()
    const key = item ? `item:${item.value}:${item.textEl?.innerHTML}` : `placeholder:${this.placeholder ?? ''}`
    if (key === this.rendered) return
    this.rendered = key
    if (item?.textEl) {
      const clones = [...item.textEl.childNodes]
        .filter((n) => n.nodeType !== Node.COMMENT_NODE)
        .map((n) => n.cloneNode(true))
      this.el.replaceChildren(...clones)
    } else this.el.textContent = this.select.showPlaceholder ? (this.placeholder ?? '') : ''
  }
}

const triggerSizeClasses: Record<SelectTriggerSize, string> = {
  sm: 'h-8 text-sm px-2.5 py-1.5',
  default: 'h-9 text-sm px-3 py-2',
  lg: 'h-11 text-base px-4 py-2.5',
}

const triggerStateClasses: Record<SelectTriggerState, string> = {
  default: 'border-input dark:hover:bg-input/50',
  error:
    'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  success: 'border-success focus-visible:border-success',
}

/** Put it on a `<button>`: `<button ui-select-trigger><ui-select-value placeholder="..." /></button>`. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-trigger, [ui-select-trigger]',
  standalone: true,
  host: {
    '[attr.type]': 'isButton ? "button" : null',
    '[attr.role]': '"combobox"',
    '[attr.aria-controls]': 'select.contentId',
    '[attr.aria-expanded]': 'select.isOpen',
    '[attr.aria-required]': 'select.required || null',
    '[attr.aria-autocomplete]': '"none"',
    '[attr.aria-busy]': 'loading',
    '[attr.dir]': 'select.dir',
    '[attr.tabindex]': 'isButton ? null : isDisabled ? -1 : 0',
    '[attr.data-state]': 'select.isOpen ? "open" : "closed"',
    '[attr.disabled]': 'isDisabled && isButton ? "" : null',
    '[attr.data-disabled]': 'isDisabled ? "" : null',
    '[attr.data-placeholder]': 'select.showPlaceholder ? "" : null',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"select-trigger"',
    '[attr.data-size]': 'size',
    '[attr.data-state-value]': 'state',
    '[class]': 'hostClass',
    '(pointerdown)': 'onPointerDown($event)',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
    '(blur)': 'select.markTouched()',
  },
  template: `
    <ng-content />
    @if (loading) {
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
        class="lucide lucide-loader size-4 animate-spin opacity-50"
        aria-hidden="true"
      >
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
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
        class="lucide lucide-chevron-down size-4 opacity-50"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    }
  `,
})
export class UiSelectTriggerComponent {
  readonly select = inject(UiSelectComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isButton = this.el.tagName === 'BUTTON'
  // Radix starts at 'touch' so programmatic / touch clicks open; mouse opens on pointerdown.
  private pointerType = 'touch'

  @Input() size: SelectTriggerSize = 'default'
  @Input() state: SelectTriggerState = 'default'
  @Input({ transform: booleanAttribute }) loading = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  constructor() {
    this.select.trigger = this.el
  }

  get isDisabled(): boolean {
    return this.select.disabled || this.disabled || this.loading
  }

  get hostClass(): string {
    return cn(
      "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      triggerSizeClasses[this.size],
      triggerStateClasses[this.state],
      this.className,
    )
  }

  private handleOpen(): void {
    if (this.isDisabled) return
    this.select.typeahead.reset()
    this.select.setOpen(true)
  }

  /** Radix opens on mouse pointerdown (not click) and keeps focus off the trigger; a second press closes. */
  onPointerDown(event: PointerEvent): void {
    this.pointerType = event.pointerType ?? 'mouse'
    if (event.button === 0 && !event.ctrlKey && this.pointerType === 'mouse') {
      event.preventDefault()
      if (this.select.isOpen) this.select.setOpen(false)
      else this.handleOpen()
    }
  }

  /** Touch / pen (and synthetic clicks) open on click, like Radix. */
  onClick(): void {
    this.el.focus()
    if (this.pointerType !== 'mouse') this.handleOpen()
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled) return
    const typingAhead = this.select.typeahead.search !== ''
    const modifier = event.ctrlKey || event.altKey || event.metaKey
    if (!modifier && event.key.length === 1) this.select.typeaheadSelect(event.key)
    if (typingAhead && event.key === ' ') return
    if ([' ', 'Enter', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault()
      this.handleOpen()
    }
  }
}

/** Radix injects this to hide the viewport scrollbar (scroll buttons replace it). */
const VIEWPORT_CSS =
  '[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-content, [ui-select-content]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [VIEWPORT_CSS],
  // The host stays where it is declared (no box); the listbox renders in a body portal.
  host: { class: 'hidden' },
  imports: [forwardRef(() => UiSelectScrollUpButtonComponent), forwardRef(() => UiSelectScrollDownButtonComponent)],
  template: `
    <ng-template #panel>
      <div
        [id]="select.contentId"
        role="listbox"
        tabindex="-1"
        data-uipkge=""
        data-slot="select-content"
        [attr.data-state]="state()"
        [attr.dir]="select.dir"
        [class]="panelClass"
        (keydown)="onKeydown($event)"
        (contextmenu)="$event.preventDefault()"
      >
        <ui-select-scroll-up-button />
        <div data-radix-select-viewport="" role="presentation" [class]="viewportClass" (scroll)="updateScrollButtons()">
          <ng-content />
        </div>
        <ui-select-scroll-down-button />
      </div>
    </ng-template>
  `,
})
export class UiSelectContentComponent implements OnChanges, OnDestroy {
  readonly select = inject(UiSelectComponent)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  @Input('class') className?: string
  @Input() position: SelectPosition = 'popper'
  @Input() side: PopperSide = 'bottom'
  @Input() sideOffset = 0
  @Input() align: PopperAlign = 'start'
  @Input() alignOffset = 0
  @Input({ transform: booleanAttribute }) avoidCollisions = true
  @Input() collisionPadding = CONTENT_MARGIN

  @ViewChild('panel', { static: true }) panelTpl!: TemplateRef<unknown>
  readonly state = signal<'open' | 'closed'>('closed')
  readonly canScrollUp = signal(false)
  readonly canScrollDown = signal(false)
  panelEl?: HTMLElement
  viewportEl?: HTMLElement
  private readonly typeahead = new Typeahead()
  private cleanups: (() => void)[] = []

  constructor() {
    this.select.content = this
  }

  get panelClass(): string {
    return cn(
      'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
      this.position === 'popper' &&
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      this.className,
    )
  }

  get viewportClass(): string {
    return cn(
      'p-1',
      this.position === 'popper' &&
        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
    )
  }

  ngOnChanges(): void {
    if (this.portal.attached) this.sync()
  }

  /** Mirrors root open state into the portal (called by the root on every change). */
  sync(): void {
    if (this.select.isOpen && !this.portal.attached) this.show()
    else if (!this.select.isOpen && this.portal.attached) this.hide()
  }

  /** Enabled option elements in DOM order. */
  optionEls(): HTMLElement[] {
    return [...(this.panelEl?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])].filter(
      (el) => !el.hasAttribute('data-disabled'),
    )
  }

  private show(): void {
    const trigger = this.select.trigger
    if (!trigger) return
    this.state.set('open')
    const host = this.portal.attach(this.panelTpl)
    const panel = host.querySelector<HTMLElement>('[data-slot="select-content"]')!
    const viewport = panel.querySelector<HTMLElement>('[data-radix-select-viewport]')!
    this.panelEl = panel
    this.viewportEl = viewport
    // Radix Select inline styles (content is a flex column; the viewport is the scroller).
    Object.assign(panel.style, { display: 'flex', flexDirection: 'column', outline: 'none', boxSizing: 'border-box' })
    Object.assign(viewport.style, { position: 'relative', flex: '1', overflow: 'hidden auto' })
    const close = () => this.select.setOpen(false)
    this.cleanups.push(
      pushDismissableLayer({
        contains: (t) => panel.contains(t) || trigger.contains(t),
        onEscape: close,
        onPointerDownOutside: close,
      }),
      lockScroll(),
      disableOutsidePointerEvents(panel),
    )
    if (this.position === 'popper') {
      this.cleanups.push(
        autoPlace(
          trigger,
          panel,
          () => this.placeOptions(),
          'select',
          () => this.updateScrollButtons(),
        ),
      )
    } else {
      this.placeItemAligned(trigger, panel)
    }
    window.addEventListener('blur', close)
    window.addEventListener('resize', close)
    this.cleanups.push(() => {
      window.removeEventListener('blur', close)
      window.removeEventListener('resize', close)
    })
    queueMicrotask(() => {
      const selected = panel.querySelector<HTMLElement>('[role="option"][data-state="checked"]')
      const target = selected ?? this.optionEls()[0]
      ;(target ?? panel).focus({ preventScroll: true })
      target?.scrollIntoView?.({ block: 'nearest' })
      this.updateScrollButtons()
    })
  }

  private hide(): void {
    // Radix Select content has no exit Presence: it unmounts as soon as it closes.
    this.state.set('closed')
    this.typeahead.reset()
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
    this.panelEl = undefined
    this.viewportEl = undefined
    this.canScrollUp.set(false)
    this.canScrollDown.set(false)
    this.select.trigger?.focus({ preventScroll: true })
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

  /** Radix item-aligned: the selected item sits over the trigger, clamped to the viewport. */
  private placeItemAligned(trigger: HTMLElement, panel: HTMLElement): void {
    const t = trigger.getBoundingClientRect()
    Object.assign(panel.style, {
      position: 'fixed',
      minWidth: `${t.width}px`,
      maxHeight: `${window.innerHeight - CONTENT_MARGIN * 2}px`,
    })
    const selected =
      panel.querySelector<HTMLElement>('[role="option"][data-state="checked"]') ?? this.optionEls()[0] ?? null
    const p = panel.getBoundingClientRect()
    const offset = selected ? selected.getBoundingClientRect().top - p.top + selected.offsetHeight / 2 : p.height / 2
    const top = t.top + t.height / 2 - offset
    const maxTop = window.innerHeight - CONTENT_MARGIN - panel.offsetHeight
    const maxLeft = window.innerWidth - CONTENT_MARGIN - panel.offsetWidth
    panel.style.top = `${Math.round(Math.max(CONTENT_MARGIN, Math.min(top, maxTop)))}px`
    panel.style.left = `${Math.round(Math.max(CONTENT_MARGIN, Math.min(t.left, maxLeft)))}px`
    this.updateScrollButtons()
  }

  updateScrollButtons(): void {
    const v = this.viewportEl
    if (!v) return
    this.canScrollUp.set(v.scrollTop > 0)
    this.canScrollDown.set(Math.ceil(v.scrollTop) < v.scrollHeight - v.clientHeight)
  }

  /** Auto-scroll step used by the scroll buttons: one item height, like Radix. */
  scrollBy(direction: -1 | 1): void {
    const v = this.viewportEl
    if (!v) return
    const item =
      this.panelEl?.querySelector<HTMLElement>('[role="option"][data-state="checked"]') ?? this.optionEls()[0]
    v.scrollTop += direction * (item?.offsetHeight ?? 32)
    this.updateScrollButtons()
  }

  /** Radix onItemLeave: pointer left an item, park focus on the listbox. */
  focusContent(): void {
    this.panelEl?.focus({ preventScroll: true })
  }

  onKeydown(event: KeyboardEvent): void {
    const modifier = event.ctrlKey || event.altKey || event.metaKey
    if (event.key === 'Tab') event.preventDefault()
    if (!modifier && event.key.length === 1) this.typeaheadFocus(event.key)
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      let candidates = this.optionEls()
      if (event.key === 'ArrowUp' || event.key === 'End') candidates = candidates.slice().reverse()
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const i = candidates.indexOf(event.target as HTMLElement)
        candidates = candidates.slice(i + 1)
      }
      // Radix does not loop: at either end the focus stays put.
      const next = candidates[0]
      if (next) {
        next.focus({ preventScroll: true })
        next.scrollIntoView?.({ block: 'nearest' })
      }
      event.preventDefault()
    }
  }

  get typeaheadSearch(): string {
    return this.typeahead.search
  }

  private typeaheadFocus(key: string): void {
    const search = this.typeahead.push(key)
    const enabled = this.select.orderedItems().filter((i) => !i.disabled)
    const current = enabled.find((i) => i.element === document.activeElement)
    const next = findNextItem(enabled, search, current)
    if (next) {
      next.element.focus({ preventScroll: true })
      next.element.scrollIntoView?.({ block: 'nearest' })
    }
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

/** DismissableLayer disableOutsidePointerEvents: the rest of the page ignores the pointer while open. */
function disableOutsidePointerEvents(layer: HTMLElement): () => void {
  const body = document.body
  const previous = body.style.pointerEvents
  body.style.pointerEvents = 'none'
  layer.style.pointerEvents = 'auto'
  return () => {
    body.style.pointerEvents = previous
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-label, [ui-select-label]',
  standalone: true,
  host: {
    '[attr.id]': 'id',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"select-label"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSelectLabelComponent {
  readonly id = uniqueId('select-label')
  @Input('class') className?: string

  constructor() {
    const group = inject(UiSelectGroupComponent, { optional: true })
    if (group) group.labelId = this.id
  }

  get hostClass(): string {
    return cn('block', 'text-muted-foreground px-2 py-1.5 text-xs', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-item, [ui-select-item]',
  standalone: true,
  host: {
    '[attr.role]': '"option"',
    '[attr.aria-labelledby]': 'textId',
    '[attr.data-highlighted]': 'focused() ? "" : null',
    '[attr.aria-selected]': 'isSelected && focused()',
    '[attr.data-state]': 'isSelected ? "checked" : "unchecked"',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.tabindex]': 'disabled ? null : -1',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"select-item"',
    '[class]': 'hostClass',
    '(focus)': 'focused.set(true)',
    '(blur)': 'focused.set(false)',
    '(click)': 'handleSelect()',
    '(keydown)': 'onKeydown($event)',
    '(pointermove)': 'onPointerMove()',
    '(pointerleave)': 'onPointerLeave()',
  },
  template: `
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      @if (isSelected) {
        <span aria-hidden="true"
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
            class="lucide lucide-check size-4"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" /></svg
        ></span>
      }
    </span>
    <span #text [id]="textId"><ng-content /></span>
  `,
})
export class UiSelectItemComponent {
  private readonly select = inject(UiSelectComponent)
  private readonly content = inject(UiSelectContentComponent, { optional: true })
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly textId = uniqueId('select-item-text')
  readonly focused = signal(false)
  @ViewChild('text', { static: true }) textRef?: ElementRef<HTMLElement>

  @Input({ required: true }) value!: string
  @Input({ transform: booleanAttribute }) disabled = false
  /** Typeahead text (defaults to the item's text content), as Radix `textValue`. */
  @Input('textValue') textValueOverride?: string
  @Input('class') className?: string

  constructor() {
    this.select.register(this)
    inject(DestroyRef).onDestroy(() => this.select.unregister(this))
  }

  get textEl(): HTMLElement | undefined {
    return this.textRef?.nativeElement
  }

  get textValue(): string {
    return this.textValueOverride ?? this.textEl?.textContent?.trim() ?? ''
  }

  get isSelected(): boolean {
    return this.select.value === this.value
  }

  get hostClass(): string {
    return cn(
      "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      this.className,
    )
  }

  handleSelect(): void {
    if (this.disabled) return
    this.select.select(this.value)
    this.select.setOpen(false)
  }

  onKeydown(event: KeyboardEvent): void {
    if ((this.content?.typeaheadSearch ?? '') !== '' && event.key === ' ') return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.handleSelect()
    }
  }

  private hovered = false

  onPointerMove(): void {
    this.hovered = true
    if (this.disabled) this.content?.focusContent()
    else if (document.activeElement !== this.element) this.element.focus({ preventScroll: true })
  }

  /** Only a real hover-out parks focus on the list (re-portalled nodes can get a stray pointerleave). */
  onPointerLeave(): void {
    if (!this.hovered) return
    this.hovered = false
    if (document.activeElement === this.element) this.content?.focusContent()
  }
}

/** Radix Select.ItemText: the part of an item shown in the trigger. SelectItem already renders one. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-item-text, [ui-select-item-text]',
  standalone: true,
  template: `<ng-content />`,
})
export class UiSelectItemTextComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-separator, [ui-select-separator]',
  standalone: true,
  host: {
    '[attr.aria-hidden]': '"true"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"select-separator"',
    '[class]': 'hostClass',
  },
  template: ``,
})
export class UiSelectSeparatorComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block', 'bg-border pointer-events-none -mx-1 my-1 h-px', this.className)
  }
}

/** Shared scroll-button behaviour: renders only while the viewport can scroll that way, auto-scrolls on hover. */
@Directive()
abstract class SelectScrollButtonBase implements OnDestroy {
  protected readonly content = inject(UiSelectContentComponent)
  protected abstract readonly direction: -1 | 1
  @Input('class') className?: string
  private timer?: ReturnType<typeof setInterval>

  constructor() {
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.style.flexShrink = '0'
  }

  get visible(): boolean {
    return this.direction < 0 ? this.content.canScrollUp() : this.content.canScrollDown()
  }

  get hostClass(): string {
    return this.visible ? cn('flex cursor-default items-center justify-center py-1', this.className) : 'hidden'
  }

  start(): void {
    if (this.timer) return
    this.timer = setInterval(() => {
      this.content.scrollBy(this.direction)
      if (!this.visible) this.stop()
    }, 50)
  }

  onPointerMove(): void {
    this.content.focusContent()
    this.start()
  }

  stop(): void {
    clearInterval(this.timer)
    this.timer = undefined
  }

  ngOnDestroy(): void {
    this.stop()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-scroll-up-button, [ui-select-scroll-up-button]',
  standalone: true,
  host: {
    '[attr.aria-hidden]': '"true"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"select-scroll-up-button"',
    '[class]': 'hostClass',
    '(pointerdown)': 'start()',
    '(pointermove)': 'onPointerMove()',
    '(pointerleave)': 'stop()',
  },
  template: `
    @if (visible) {
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
        class="lucide lucide-chevron-up size-4"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    }
  `,
})
export class UiSelectScrollUpButtonComponent extends SelectScrollButtonBase {
  protected readonly direction = -1 as const
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-select-scroll-down-button, [ui-select-scroll-down-button]',
  standalone: true,
  host: {
    '[attr.aria-hidden]': '"true"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"select-scroll-down-button"',
    '[class]': 'hostClass',
    '(pointerdown)': 'start()',
    '(pointermove)': 'onPointerMove()',
    '(pointerleave)': 'stop()',
  },
  template: `
    @if (visible) {
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
        class="lucide lucide-chevron-down size-4"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    }
  `,
})
export class UiSelectScrollDownButtonComponent extends SelectScrollButtonBase {
  protected readonly direction = 1 as const
}

import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { afterExitAnimation, uniqueId } from '@/ui/popper/popper'
import {
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  type AccordionVariants,
  type AccordionItemVariants,
  type AccordionTriggerVariants,
} from './accordion.variants'

export type AccordionVariant = NonNullable<AccordionVariants['variant']>
export type AccordionType = 'single' | 'multiple'
export type AccordionOrientation = 'horizontal' | 'vertical'

/**
 * Angular port of UIPKGE Accordion with Radix Accordion behaviour: `type` single /
 * multiple, controlled `value` or uncontrolled `defaultValue` + `valueChange`,
 * `collapsible`, `disabled`, `orientation`, `dir`. Items read the root's variant
 * (React's AccordionVariantContext), triggers toggle their item and rove focus with
 * Arrow / Home / End, and content measures itself into
 * `--radix-accordion-content-height` so `animate-accordion-down/up` run like React,
 * staying mounted until the close animation ends. Class strings match React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-accordion, [ui-accordion]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"accordion"',
    '[attr.data-variant]': 'variant',
    '[attr.data-orientation]': 'orientation',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiAccordionComponent implements OnChanges {
  @Input('class') className?: string
  @Input() variant: AccordionVariant = 'default'
  @Input() type: AccordionType = 'single'
  /** Controlled value: a string for type="single", a string[] for type="multiple". */
  @Input() value?: string | string[]
  @Input() defaultValue?: string | string[]
  @Input({ transform: booleanAttribute }) collapsible = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input() orientation: AccordionOrientation = 'vertical'
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Output() valueChange = new EventEmitter<string | string[]>()

  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly _value = signal<string[] | null>(null)
  readonly items = new Set<UiAccordionItemComponent>()

  /** Currently expanded item values. */
  get openItems(): string[] {
    if (this.value !== undefined) return toList(this.value)
    return this._value() ?? toList(this.defaultValue)
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['value']
    if (change && !change.firstChange) this.notify(toList(change.previousValue), toList(change.currentValue))
  }

  isOpen(value: string): boolean {
    return this.openItems.includes(value)
  }

  /** Radix onItemOpen / onItemClose: the value an item click produces. */
  toggle(value: string): void {
    const current = this.openItems
    let next: string[]
    if (this.type === 'multiple') {
      next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    } else if (current.includes(value)) {
      if (!this.collapsible) return
      next = []
    } else {
      next = [value]
    }
    this._value.set(next)
    this.valueChange.emit(this.type === 'multiple' ? next : (next[0] ?? ''))
    if (this.value === undefined) this.notify(current, next)
  }

  /** Items that just closed keep their content mounted for the exit animation. */
  private notify(prev: string[], next: string[]): void {
    for (const item of this.items) {
      if (prev.includes(item.value) && !next.includes(item.value)) item.content?.beginExit()
    }
  }

  /** Radix handleKeyDown: Arrow keys (per orientation / dir), Home and End rove across enabled triggers. */
  onTriggerKeydown(event: KeyboardEvent, trigger: HTMLElement): void {
    const triggers = [...this.el.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger"]')].filter(
      (t) => t.closest('[data-slot="accordion"]') === this.el && !t.hasAttribute('data-disabled'),
    )
    const index = triggers.indexOf(trigger)
    if (index < 0 || !triggers.length) return
    const last = triggers.length - 1
    const forward = this.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backward = this.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    let next: number
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else if (this.orientation === 'vertical' && event.key === 'ArrowDown') next = index + 1
    else if (this.orientation === 'vertical' && event.key === 'ArrowUp') next = index - 1
    else if (this.orientation === 'horizontal' && event.key === forward) next = index + 1
    else if (this.orientation === 'horizontal' && event.key === backward) next = index - 1
    else return
    event.preventDefault()
    triggers[(next + triggers.length) % triggers.length]!.focus()
  }

  get hostClass(): string {
    return cn('block', accordionVariants({ variant: this.variant }), this.className)
  }
}

function toList(value: string | string[] | undefined | null): string[] {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-accordion-item, [ui-accordion-item]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"accordion-item"',
    '[attr.data-state]': 'state',
    '[attr.data-disabled]': 'isDisabled ? "" : null',
    '[attr.data-orientation]': 'accordion.orientation',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiAccordionItemComponent implements OnDestroy {
  readonly accordion = inject(UiAccordionComponent)
  @Input('class') className?: string
  @Input({ required: true }) value!: string
  @Input({ transform: booleanAttribute }) disabled = false

  readonly triggerId = uniqueId('accordion-trigger')
  readonly contentId = uniqueId('accordion-content')
  content?: UiAccordionContentComponent

  constructor() {
    this.accordion.items.add(this)
  }

  ngOnDestroy(): void {
    this.accordion.items.delete(this)
  }

  get isOpen(): boolean {
    return this.accordion.isOpen(this.value)
  }

  get isDisabled(): boolean {
    return this.accordion.disabled || this.disabled
  }

  get state(): 'open' | 'closed' {
    return this.isOpen ? 'open' : 'closed'
  }

  toggle(): void {
    if (!this.isDisabled) this.accordion.toggle(this.value)
  }

  get hostClass(): string {
    return cn('block', accordionItemVariants({ variant: this.accordion.variant }), this.className)
  }
}

/** Radix renders the header as an <h3>: use `<h3 ui-accordion-header>`; the element form gets heading semantics. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-accordion-header, [ui-accordion-header]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"accordion-header"',
    '[attr.data-state]': 'item.state',
    '[attr.data-disabled]': 'item.isDisabled ? "" : null',
    '[attr.data-orientation]': 'item.accordion.orientation',
    '[attr.role]': 'isHeading ? null : "heading"',
    '[attr.aria-level]': 'isHeading ? null : 3',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiAccordionHeaderComponent {
  readonly item = inject(UiAccordionItemComponent)
  readonly isHeading = /^H[1-6]$/.test(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName)
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex', this.className)
  }
}

/** Use `<button ui-accordion-trigger>` (Radix renders a button); other hosts get button semantics. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-accordion-trigger, [ui-accordion-trigger]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"accordion-trigger"',
    '[attr.id]': 'item.triggerId',
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[attr.role]': 'isNativeButton ? null : "button"',
    '[attr.tabindex]': 'isNativeButton ? null : (item.isDisabled ? -1 : 0)',
    '[attr.aria-controls]': 'item.contentId',
    '[attr.aria-expanded]': 'item.isOpen',
    '[attr.aria-disabled]': 'ariaDisabled',
    '[attr.disabled]': 'isNativeButton && item.isDisabled ? "" : null',
    '[attr.data-state]': 'item.state',
    '[attr.data-disabled]': 'item.isDisabled ? "" : null',
    '[attr.data-orientation]': 'item.accordion.orientation',
    '[class]': 'hostClass',
    '(click)': 'item.toggle()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content /><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-down text-muted-foreground size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]/accordion-trigger:rotate-180 motion-reduce:transition-none"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>`,
})
export class UiAccordionTriggerComponent {
  readonly item = inject(UiAccordionItemComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isNativeButton = this.el.tagName === 'BUTTON'
  @Input('class') className?: string

  /** Radix: an open item that cannot collapse (single, collapsible=false) reports aria-disabled. */
  get ariaDisabled(): 'true' | null {
    const a = this.item.accordion
    return this.item.isOpen && a.type === 'single' && !a.collapsible ? 'true' : null
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isNativeButton && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      this.item.toggle()
      return
    }
    this.item.accordion.onTriggerKeydown(event, this.el)
  }

  get hostClass(): string {
    return cn(accordionTriggerVariants({ variant: this.item.accordion.variant }), this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-accordion-content, [ui-accordion-content]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"accordion-content"',
    '[attr.id]': 'item.contentId',
    '[attr.role]': '"region"',
    '[attr.aria-labelledby]': 'item.triggerId',
    '[attr.data-state]': 'item.state',
    '[attr.data-disabled]': 'item.isDisabled ? "" : null',
    '[attr.data-orientation]': 'item.accordion.orientation',
    '[attr.hidden]': 'present ? null : ""',
    '[class]': 'hostClass',
  },
  template: `@if (present) {
    <div class="pt-0 pb-4"><ng-content /></div>
  }`,
})
export class UiAccordionContentComponent implements AfterViewChecked, OnDestroy {
  readonly item = inject(UiAccordionItemComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) forceMount = false

  /** True while the close animation runs (Radix Presence keeps the node mounted). */
  private readonly exiting = signal(false)
  private wasOpen: boolean | null = null
  private exitToken = 0
  private originalAnimation = ''

  constructor() {
    this.item.content = this
  }

  get present(): boolean {
    return this.forceMount || this.item.isOpen || this.exiting()
  }

  beginExit(): void {
    this.exiting.set(true)
  }

  /** Radix CollapsibleContent: measure the natural size into CSS vars before the animation paints. */
  ngAfterViewChecked(): void {
    const open = this.item.isOpen
    if (open === this.wasOpen) return
    const first = this.wasOpen === null
    this.wasOpen = open
    const style = this.el.style
    if (first) this.originalAnimation = style.animationName
    // Measure without the animation. On first paint Radix leaves it suppressed, so a
    // pre-opened item does not animate in; the next open / close restores it.
    style.animationName = 'none'
    const rect = this.el.getBoundingClientRect()
    for (const lib of ['radix', 'reka']) {
      style.setProperty(`--${lib}-accordion-content-height`, `${rect.height}px`)
      style.setProperty(`--${lib}-accordion-content-width`, `${rect.width}px`)
    }
    if (!first) style.animationName = this.originalAnimation
    if (!open && !first) {
      const token = ++this.exitToken
      void afterExitAnimation(this.el).then(() => {
        if (token === this.exitToken && !this.item.isOpen) this.exiting.set(false)
      })
    } else if (open) {
      this.exitToken++
      this.exiting.set(false)
    }
  }

  ngOnDestroy(): void {
    if (this.item.content === this) this.item.content = undefined
  }

  get hostClass(): string {
    return cn(
      'block',
      'text-muted-foreground overflow-hidden text-sm',
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      'duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
      'motion-reduce:animate-none',
      this.className,
    )
  }
}

export {
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  type AccordionVariants,
  type AccordionItemVariants,
  type AccordionTriggerVariants,
}

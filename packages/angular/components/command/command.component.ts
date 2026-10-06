import {
  AfterContentInit,
  AfterViewInit,
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
  booleanAttribute,
  computed,
  forwardRef,
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

export type CommandFilter = (value: string, search: string, keywords?: string[]) => number

// ---------------------------------------------------------------------------
// command-score (the ranking cmdk uses): fuzzy abbreviation match, rewarding
// contiguous runs and word starts, penalising skipped characters.
const SCORE_CONTINUE_MATCH = 1
const SCORE_SPACE_WORD_JUMP = 0.9
const SCORE_NON_SPACE_WORD_JUMP = 0.8
const SCORE_CHARACTER_JUMP = 0.17
const SCORE_TRANSPOSITION = 0.1
const PENALTY_SKIPPED = 0.999
const PENALTY_CASE_MISMATCH = 0.9999
const PENALTY_NOT_COMPLETE = 0.99
const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g
const IS_SPACE_REGEXP = /[\s-]/
const COUNT_SPACE_REGEXP = /[\s-]/g

function scoreInner(
  string: string,
  abbreviation: string,
  lowerString: string,
  lowerAbbreviation: string,
  stringIndex: number,
  abbreviationIndex: number,
  memo: Record<string, number>,
): number {
  if (abbreviationIndex === abbreviation.length) {
    return stringIndex === string.length ? SCORE_CONTINUE_MATCH : PENALTY_NOT_COMPLETE
  }
  const memoKey = `${stringIndex},${abbreviationIndex}`
  if (memo[memoKey] !== undefined) return memo[memoKey]!
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex)
  let index = lowerString.indexOf(abbreviationChar, stringIndex)
  let highScore = 0
  while (index >= 0) {
    let score = scoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memo)
    if (score > highScore) {
      if (index === stringIndex) score *= SCORE_CONTINUE_MATCH
      else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP
        const breaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP)
        if (breaks && stringIndex > 0) score *= Math.pow(PENALTY_SKIPPED, breaks.length)
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP
        const breaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP)
        if (breaks && stringIndex > 0) score *= Math.pow(PENALTY_SKIPPED, breaks.length)
      } else {
        score *= SCORE_CHARACTER_JUMP
        if (stringIndex > 0) score *= Math.pow(PENALTY_SKIPPED, index - stringIndex)
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) score *= PENALTY_CASE_MISMATCH
    }
    if (
      (score < SCORE_TRANSPOSITION &&
        lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1)) ||
      (lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) &&
        lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex))
    ) {
      const transposed = scoreInner(
        string,
        abbreviation,
        lowerString,
        lowerAbbreviation,
        index + 1,
        abbreviationIndex + 2,
        memo,
      )
      if (transposed * SCORE_TRANSPOSITION > score) score = transposed * SCORE_TRANSPOSITION
    }
    if (score > highScore) highScore = score
    index = lowerString.indexOf(abbreviationChar, index + 1)
  }
  memo[memoKey] = highScore
  return highScore
}

const formatInput = (s: string) => s.toLowerCase().replace(COUNT_SPACE_REGEXP, ' ')

/** cmdk's default filter: 0 hides the item, higher ranks it earlier. */
export function commandScore(value: string, search: string, keywords?: string[]): number {
  const string = keywords && keywords.length > 0 ? `${value} ${keywords.join(' ')}` : value
  return scoreInner(string, search, formatInput(string), formatInput(search), 0, 0, {})
}

const GROUP_ITEMS_SELECTOR = '[cmdk-group-items]'
const LIST_SIZER_SELECTOR = '[cmdk-list-sizer]'

/**
 * cmdk root state shared by `ui-command` and `ui-command-dialog` (the dialog renders its
 * own Command inside the portal, so projected items resolve the root through this token).
 */
@Directive()
export abstract class CommandRoot {
  /** Accessible label for the input (cmdk renders a visually hidden <label>). */
  @Input() label = ''
  @Input({ transform: booleanAttribute }) shouldFilter = true
  @Input() filter?: CommandFilter
  @Input({ transform: booleanAttribute }) loop = false
  @Input({ transform: booleanAttribute }) vimBindings = true
  @Input({ transform: booleanAttribute }) disablePointerSelection = false
  /** Controlled selected (highlighted) item value. */
  @Input()
  set value(v: string | undefined) {
    if (v !== undefined) this.selected.set(v)
  }
  get value(): string | undefined {
    return this.selected()
  }
  @Output() valueChange = new EventEmitter<string>()

  readonly search = signal('')
  readonly selected = signal<string | undefined>(undefined)
  readonly items = signal<UiCommandItemComponent[]>([])
  readonly groups = signal<UiCommandGroupComponent[]>([])
  readonly inputId = uniqueId('cmdk-input')
  readonly listId = uniqueId('cmdk-list')
  readonly labelId = uniqueId('cmdk-label')

  /** Items matching the search (cmdk `filtered.count`, drives CommandEmpty). */
  readonly visibleCount = computed(() => this.items().filter((i) => i.visible()).length)
  readonly selectedId = computed(() => this.items().find((i) => i.valueSig() === this.selected())?.id ?? null)

  /** The element carrying `cmdk-root` (host for `ui-command`, the portalled panel for the dialog). */
  abstract rootElement(): HTMLElement | null | undefined

  scoreFor(value: string, keywords: string[] | undefined): number {
    const search = this.search()
    if (!this.shouldFilter || !search) return 1
    return (this.filter ?? commandScore)(value, search, keywords)
  }

  register(item: UiCommandItemComponent): void {
    this.items.update((list) => [...list, item])
  }

  unregister(item: UiCommandItemComponent): void {
    this.items.update((list) => list.filter((i) => i !== item))
  }

  registerGroup(group: UiCommandGroupComponent): void {
    this.groups.update((list) => [...list, group])
  }

  unregisterGroup(group: UiCommandGroupComponent): void {
    this.groups.update((list) => list.filter((g) => g !== group))
  }

  setSearch(value: string): void {
    if (value === this.search()) return
    this.search.set(value)
    if (value) this.sort()
    else this.restoreOrder()
    this.selectFirst()
  }

  setSelected(value: string | undefined, scroll = false): void {
    if (value === undefined || value === this.selected()) return
    this.selected.set(value)
    this.valueChange.emit(value)
    if (scroll) this.scrollSelectedIntoView()
  }

  /** Visible, enabled items in DOM order (cmdk getValidItems). */
  validItems(): UiCommandItemComponent[] {
    const root = this.rootElement()
    if (!root) return []
    const byEl = new Map(this.items().map((i) => [i.element, i]))
    return [...root.querySelectorAll<HTMLElement>('[cmdk-item]')]
      .map((el) => byEl.get(el))
      .filter((i): i is UiCommandItemComponent => !!i && i.visible() && !i.disabled)
  }

  selectFirst(): void {
    const first = this.validItems()[0]
    if (first) this.setSelected(first.valueSig())
  }

  private selectedItem(): UiCommandItemComponent | undefined {
    return this.items().find((i) => i.valueSig() === this.selected() && i.visible())
  }

  /** Children of every container sort() reorders, in source order, taken before the first reorder. */
  private sourceOrder: Map<HTMLElement, HTMLElement[]> | null = null

  private snapshotOrder(root: HTMLElement): void {
    if (this.sourceOrder) return
    const containers = new Set<HTMLElement>()
    const sizer = root.querySelector<HTMLElement>(LIST_SIZER_SELECTOR)
    if (sizer) containers.add(sizer)
    for (const el of root.querySelectorAll<HTMLElement>(GROUP_ITEMS_SELECTOR)) containers.add(el)
    for (const g of this.groups()) if (g.element.parentElement) containers.add(g.element.parentElement)
    this.sourceOrder = new Map([...containers].map((c) => [c, [...c.children] as HTMLElement[]]))
  }

  /**
   * An empty search shows the list in source order again. cmdk gets this from React
   * re-rendering; here sort() moved real DOM nodes, so put them back. Nodes added since the
   * snapshot keep their place after the original ones.
   */
  private restoreOrder(): void {
    if (!this.sourceOrder) return
    for (const [container, children] of this.sourceOrder) {
      const current = [...container.children] as HTMLElement[]
      const known = children.filter((c) => c.parentElement === container)
      const added = current.filter((c) => !children.includes(c))
      for (const child of [...known, ...added]) container.appendChild(child)
    }
    this.sourceOrder = null
  }

  /** cmdk sort(): while searching, rank items inside their group and groups inside the list. */
  private sort(): void {
    const root = this.rootElement()
    if (!root || !this.search() || !this.shouldFilter) return
    this.snapshotOrder(root)
    const sizer = root.querySelector<HTMLElement>(LIST_SIZER_SELECTOR)
    const ranked = this.validItems().sort((a, b) => b.score() - a.score())
    for (const item of ranked) {
      const el = item.element
      const groupItems = el.closest<HTMLElement>(GROUP_ITEMS_SELECTOR)
      if (groupItems) {
        groupItems.appendChild(el.parentElement === groupItems ? el : el.closest(`${GROUP_ITEMS_SELECTOR} > *`)!)
      } else if (sizer) {
        sizer.appendChild(el.parentElement === sizer ? el : (el.closest(`${LIST_SIZER_SELECTOR} > *`) ?? el))
      }
    }
    const groups = this.groups()
      .filter((g) => g.visible())
      .map((g) => [g, Math.max(0, ...g.items().map((i) => i.score()))] as const)
      .sort((a, b) => b[1] - a[1])
    for (const [group] of groups) group.element.parentElement?.appendChild(group.element)
  }

  private scrollSelectedIntoView(): void {
    const el = this.selectedItem()?.element
    if (!el) return
    if (el.parentElement?.firstElementChild === el) {
      el.closest('[cmdk-group]')?.querySelector('[cmdk-group-heading]')?.scrollIntoView?.({ block: 'nearest' })
    }
    el.scrollIntoView?.({ block: 'nearest' })
  }

  private updateByItem(change: 1 | -1): void {
    const items = this.validItems()
    const index = items.findIndex((i) => i.valueSig() === this.selected())
    let next = items[index + change]
    if (this.loop) {
      next =
        index + change < 0
          ? items[items.length - 1]
          : index + change === items.length
            ? items[0]
            : items[index + change]
    }
    if (next) this.setSelected(next.valueSig(), true)
  }

  private updateByGroup(change: 1 | -1): void {
    let group = this.selectedItem()?.element.closest('[cmdk-group]') ?? null
    let next: UiCommandItemComponent | undefined
    const valid = new Set(this.validItems().map((i) => i.element))
    while (group && !next) {
      group = change > 0 ? nextSibling(group, '[cmdk-group]') : previousSibling(group, '[cmdk-group]')
      const els = group ? [...group.querySelectorAll<HTMLElement>('[cmdk-item]')].filter((el) => valid.has(el)) : []
      next = this.items().find((i) => i.element === els[0])
    }
    if (next) this.setSelected(next.valueSig(), true)
    else this.updateByItem(change)
  }

  private edge(last: boolean): void {
    const items = this.validItems()
    const item = last ? items[items.length - 1] : items[0]
    if (item) this.setSelected(item.valueSig(), true)
  }

  private move(event: KeyboardEvent, change: 1 | -1): void {
    event.preventDefault()
    if (event.metaKey) this.edge(change > 0)
    else if (event.altKey) this.updateByGroup(change)
    else this.updateByItem(change)
  }

  /** cmdk root keyboard: arrows (+ Ctrl-n/j/p/k), Alt = by group, Meta / Home / End = edges, Enter selects. */
  onKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return
    switch (event.key) {
      case 'n':
      case 'j':
        if (this.vimBindings && event.ctrlKey) this.move(event, 1)
        break
      case 'ArrowDown':
        this.move(event, 1)
        break
      case 'p':
      case 'k':
        if (this.vimBindings && event.ctrlKey) this.move(event, -1)
        break
      case 'ArrowUp':
        this.move(event, -1)
        break
      case 'Home':
        event.preventDefault()
        this.edge(false)
        break
      case 'End':
        event.preventDefault()
        this.edge(true)
        break
      case 'Enter':
        if (!event.isComposing && event.keyCode !== 229) {
          event.preventDefault()
          this.selectedItem()?.onSelect()
        }
    }
  }
}

function nextSibling(el: Element, selector: string): Element | null {
  let sibling = el.nextElementSibling
  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.nextElementSibling
  }
  return null
}

function previousSibling(el: Element, selector: string): Element | null {
  let sibling = el.previousElementSibling
  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.previousElementSibling
  }
  return null
}

/**
 * Angular port of UIPKGE Command, behaving like the cmdk component the React version
 * wraps: typing filters and ranks items (command-score), the first match is highlighted,
 * arrow keys / Home / End / Enter drive the highlight, groups hide when empty, separators
 * hide while searching and CommandEmpty shows when nothing matches. Class strings are
 * identical to the React source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command, [ui-command]',
  standalone: true,
  providers: [{ provide: CommandRoot, useExisting: forwardRef(() => UiCommandComponent) }],
  host: {
    tabindex: '-1',
    'cmdk-root': '',
    'data-uipkge': '',
    'data-slot': 'command',
    '[class]': 'hostClass',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <label cmdk-label class="sr-only" [attr.for]="inputId" [id]="labelId">{{ label }}</label>
    <ng-content />
  `,
})
export class UiCommandComponent extends CommandRoot implements AfterContentInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input('class') className?: string

  rootElement(): HTMLElement {
    return this.el
  }

  ngAfterContentInit(): void {
    if (this.selected() === undefined) this.selectFirst()
  }

  get hostClass(): string {
    return cn(
      'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
      this.className,
    )
  }
}

const COMMAND_DIALOG_COMMAND_CLASS =
  '[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-1 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5'

/**
 * CommandDialog: a Radix-Dialog-style modal (body portal, overlay, focus trap + restore,
 * scroll lock, Escape / overlay dismiss, sr-only title + description) wrapping a Command.
 * Built on the popper helpers like the sheet; React composes @radix-ui/react-dialog
 * primitives directly too, not the registry Dialog component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-dialog, [ui-command-dialog]',
  standalone: true,
  providers: [{ provide: CommandRoot, useExisting: forwardRef(() => UiCommandDialogComponent) }],
  host: { class: 'hidden' },
  template: `
    <ng-template #panel>
      <div
        data-uipkge=""
        data-slot="command-dialog-overlay"
        [attr.data-state]="state()"
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
      ></div>
      <div
        role="dialog"
        tabindex="-1"
        [id]="contentId"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="descriptionId"
        data-uipkge=""
        data-slot="command-dialog"
        [attr.data-state]="state()"
        class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-hidden rounded-lg border p-0 shadow-lg duration-200"
      >
        <h2 class="sr-only" [id]="titleId">{{ title }}</h2>
        <p class="sr-only" [id]="descriptionId">{{ description }}</p>
        <div
          tabindex="-1"
          cmdk-root=""
          data-uipkge=""
          data-slot="command"
          [class]="commandClass"
          (keydown)="onKeydown($event)"
        >
          <label cmdk-label class="sr-only" [attr.for]="inputId" [id]="labelId">{{ label }}</label>
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
})
export class UiCommandDialogComponent extends CommandRoot implements OnChanges, OnDestroy {
  private readonly portal = new BodyPortal(inject(ViewContainerRef))
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input({ transform: booleanAttribute }) modal = true
  @Input() title = 'Command Palette'
  @Input() description = 'Search for a command to run...'
  @Output() openChange = new EventEmitter<boolean>()
  @ViewChild('panel', { static: true }) panelTpl!: TemplateRef<unknown>

  readonly contentId = uniqueId('command-dialog')
  readonly titleId = uniqueId('command-dialog-title')
  readonly descriptionId = uniqueId('command-dialog-description')
  readonly state = signal<'open' | 'closed'>('closed')
  readonly commandClass = cn(
    'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
    COMMAND_DIALOG_COMMAND_CLASS,
  )
  private readonly _open = signal<boolean | null>(null)
  private commandEl?: HTMLElement
  private panelEl?: HTMLElement
  private restoreFocusTo: HTMLElement | null = null
  private cleanups: (() => void)[] = []

  get isOpen(): boolean {
    if (this.open !== undefined) return this.open
    return this._open() ?? this.defaultOpen
  }

  rootElement(): HTMLElement | undefined {
    return this.commandEl
  }

  ngOnChanges(): void {
    this.sync()
  }

  setOpen(value: boolean): void {
    if (value === this.isOpen) return
    this._open.set(value)
    this.openChange.emit(value)
    this.sync()
  }

  toggle(): void {
    this.setOpen(!this.isOpen)
  }

  private sync(): void {
    if (!this.panelTpl) return
    if (this.isOpen && (!this.portal.attached || this.state() === 'closed')) {
      if (this.portal.attached) this.portal.detach()
      this.show()
    } else if (!this.isOpen && this.portal.attached && this.state() === 'open') void this.hide()
  }

  private show(): void {
    this.restoreFocusTo = document.activeElement as HTMLElement | null
    this.state.set('open')
    const host = this.portal.attach(this.panelTpl)
    const panel = host.querySelector<HTMLElement>('[data-slot="command-dialog"]')!
    this.panelEl = panel
    this.commandEl = panel.querySelector<HTMLElement>('[cmdk-root]')!
    const close = () => this.setOpen(false)
    this.cleanups.push(
      pushDismissableLayer({
        contains: (t) => panel.contains(t),
        onEscape: close,
        onPointerDownOutside: close,
      }),
      trapFocus(panel),
    )
    if (this.modal) this.cleanups.push(lockScroll())
    // A fresh cmdk mounts on every open in React: start from the first item.
    this.selected.set(undefined)
    this.selectFirst()
    queueMicrotask(() => {
      const first = panel.querySelector<HTMLElement>(
        '[autofocus],a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
      )
      ;(first ?? panel).focus({ preventScroll: true })
    })
  }

  private async hide(): Promise<void> {
    this.state.set('closed')
    this.cleanups.splice(0).forEach((fn) => fn())
    await afterExitAnimation(this.panelEl, 200)
    if (this.isOpen) return
    this.portal.detach()
    this.panelEl = undefined
    this.commandEl = undefined
    // React unmounts the cmdk tree on close, so the query resets — and the list goes back to
    // source order (the items are projected content, so they survive the close).
    this.setSearch('')
    this.restoreFocusTo?.focus?.({ preventScroll: true })
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }
}

/** Search field: the host is the `cmdk-input-wrapper` row, `class` styles the <input> (as in React). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-input, [ui-command-input]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'command-input-wrapper',
    'cmdk-input-wrapper': '',
    // Attribute (not class) binding: React sends className to the <input>, so a consumer
    // `class` must not also land on the wrapper row.
    '[attr.class]': '"flex h-9 items-center gap-2 border-b px-3"',
  },
  template: `
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
      class="lucide lucide-search text-muted-foreground size-4 shrink-0"
      aria-hidden="true"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
    <input
      #input
      cmdk-input=""
      data-uipkge=""
      data-slot="command-input"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      aria-autocomplete="list"
      role="combobox"
      aria-expanded="true"
      type="text"
      [id]="root.inputId"
      [attr.aria-controls]="root.listId"
      [attr.aria-labelledby]="root.labelId"
      [attr.aria-activedescendant]="root.selectedId()"
      [attr.placeholder]="placeholder ?? null"
      [disabled]="disabled"
      [value]="root.search()"
      [class]="inputClass"
      (input)="onInput($event)"
    />
  `,
})
export class UiCommandInputComponent implements AfterViewInit {
  readonly root = inject(CommandRoot)
  @Input() placeholder?: string
  @Input({ transform: booleanAttribute }) disabled = false
  // Default false so inline Command embeds don't steal focus / scroll the page.
  @Input({ transform: booleanAttribute }) autoFocus = false
  /** Controlled search query (cmdk Input `value`). */
  @Input()
  set value(v: string | undefined) {
    if (v !== undefined) this.root.setSearch(v)
  }
  get value(): string {
    return this.root.search()
  }
  @Output() valueChange = new EventEmitter<string>()
  @Input('class') className?: string
  @ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLInputElement>

  get inputClass(): string {
    return cn(
      'placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      this.className,
    )
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) this.inputRef.nativeElement.focus({ preventScroll: true })
  }

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value
    this.root.setSearch(v)
    this.valueChange.emit(v)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-list, [ui-command-list]',
  standalone: true,
  host: {
    'cmdk-list': '',
    role: 'listbox',
    tabindex: '-1',
    '[attr.aria-label]': 'label',
    '[id]': 'root.listId',
    'data-uipkge': '',
    'data-slot': 'command-list',
    '[class]': 'hostClass',
  },
  template: `<div cmdk-list-sizer="" #sizer><ng-content /></div>`,
})
export class UiCommandListComponent implements AfterViewInit, OnDestroy {
  readonly root = inject(CommandRoot)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input() label = 'Suggestions'
  @Input('class') className?: string
  @ViewChild('sizer', { static: true }) sizer!: ElementRef<HTMLElement>
  private ro?: ResizeObserver

  get hostClass(): string {
    return cn('block', 'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', this.className)
  }

  /** cmdk exposes the content height as --cmdk-list-height (for height transitions). */
  ngAfterViewInit(): void {
    if (typeof ResizeObserver === 'undefined') return
    this.ro = new ResizeObserver(() => {
      this.el.style.setProperty('--cmdk-list-height', `${this.sizer.nativeElement.offsetHeight.toFixed(1)}px`)
    })
    this.ro.observe(this.sizer.nativeElement)
  }

  ngOnDestroy(): void {
    this.ro?.disconnect()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-empty, [ui-command-empty]',
  standalone: true,
  host: {
    'cmdk-empty': '',
    role: 'presentation',
    'data-uipkge': '',
    'data-slot': 'command-empty',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCommandEmptyComponent {
  private readonly root = inject(CommandRoot)
  @Input('class') className?: string

  /** cmdk renders Empty only while no item matches; hidden (not unmounted) here. */
  get hostClass(): string {
    return this.root.visibleCount() === 0 ? cn('block', 'py-6 text-center text-sm', this.className) : 'hidden'
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-group, [ui-command-group]',
  standalone: true,
  host: {
    'cmdk-group': '',
    role: 'presentation',
    '[attr.data-value]': 'value ?? heading ?? null',
    '[attr.hidden]': 'visible() ? null : ""',
    'data-uipkge': '',
    'data-slot': 'command-group',
    '[class]': 'hostClass',
  },
  template: `
    @if (heading) {
      <div cmdk-group-heading="" aria-hidden="true" [id]="headingId">{{ heading }}</div>
    }
    <div cmdk-group-items="" role="group" [attr.aria-labelledby]="heading ? headingId : null"><ng-content /></div>
  `,
})
export class UiCommandGroupComponent {
  private readonly root = inject(CommandRoot)
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly headingId = uniqueId('cmdk-group-heading')
  readonly items = signal<UiCommandItemComponent[]>([])
  private readonly force = signal(false)
  @Input() heading?: string
  @Input() value?: string
  @Input({ transform: booleanAttribute })
  set forceMount(v: boolean) {
    this.force.set(v)
  }
  @Input('class') className?: string

  readonly visible = computed(() => this.force() || this.items().some((i) => i.visible()))

  constructor() {
    this.root.registerGroup(this)
    inject(DestroyRef).onDestroy(() => this.root.unregisterGroup(this))
  }

  get hostClass(): string {
    return cn(
      'block',
      'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-separator, [ui-command-separator]',
  standalone: true,
  host: {
    'cmdk-separator': '',
    role: 'separator',
    '[attr.hidden]': 'root.search() && !alwaysRender ? "" : null',
    'data-uipkge': '',
    'data-slot': 'command-separator',
    '[class]': 'hostClass',
  },
  template: ``,
})
export class UiCommandSeparatorComponent {
  readonly root = inject(CommandRoot)
  /** cmdk hides separators while a search is active unless alwaysRender. */
  @Input({ transform: booleanAttribute }) alwaysRender = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block', 'bg-border -mx-1 h-px', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-item, [ui-command-item]',
  standalone: true,
  host: {
    'cmdk-item': '',
    role: 'option',
    '[id]': 'id',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.data-disabled]': 'disabled',
    '[attr.data-selected]': 'isSelected()',
    '[attr.data-value]': 'valueSig()',
    '[attr.hidden]': 'visible() ? null : ""',
    'data-uipkge': '',
    'data-slot': 'command-item',
    '[class]': 'hostClass',
    '(pointermove)': 'onPointerMove()',
    '(click)': 'onSelect()',
  },
  template: `<ng-content />`,
})
export class UiCommandItemComponent implements OnInit, OnChanges {
  private readonly root = inject(CommandRoot)
  private readonly group = inject(UiCommandGroupComponent, { optional: true })
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly id = uniqueId('cmdk-item')
  readonly valueSig = signal('')
  private readonly keywordsSig = signal<string[] | undefined>(undefined)
  private readonly force = signal(false)

  @Input() value?: string
  @Input() keywords?: string[]
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute })
  set forceMount(v: boolean) {
    this.force.set(v)
  }
  @Input('class') className?: string
  /** cmdk `onSelect`: click or Enter while highlighted. Emits the item value. */
  @Output() select = new EventEmitter<string>()

  readonly score = computed(() => this.root.scoreFor(this.valueSig(), this.keywordsSig()))
  readonly visible = computed(() => this.force() || this.score() > 0)
  readonly isSelected = computed(() => this.root.selected() === this.valueSig())

  constructor() {
    this.root.register(this)
    this.group?.items.update((list) => [...list, this])
    inject(DestroyRef).onDestroy(() => {
      this.root.unregister(this)
      this.group?.items.update((list) => list.filter((i) => i !== this))
    })
  }

  ngOnInit(): void {
    this.syncValue()
  }

  ngOnChanges(): void {
    this.syncValue()
    this.keywordsSig.set(this.keywords?.map((k) => k.trim()))
  }

  /** cmdk value: the `value` prop, else the item's text, trimmed. */
  private syncValue(): void {
    this.valueSig.set((this.value ?? this.element.textContent ?? '').trim())
  }

  get hostClass(): string {
    return cn(
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.className,
    )
  }

  onPointerMove(): void {
    if (this.disabled || this.root.disablePointerSelection) return
    this.root.setSelected(this.valueSig())
  }

  onSelect(): void {
    if (this.disabled) return
    this.root.setSelected(this.valueSig())
    this.select.emit(this.valueSig())
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-command-shortcut, [ui-command-shortcut]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'command-shortcut',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCommandShortcutComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-muted-foreground ml-auto text-xs tracking-widest', this.className)
  }
}

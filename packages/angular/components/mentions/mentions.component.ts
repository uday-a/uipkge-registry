import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiPopoverAnchorComponent,
  UiPopoverComponent,
  UiPopoverContentComponent,
  type PopoverDismissEvent,
} from '@/ui/popover/popover.component'
import { uniqueId } from '@/ui/popper/popper'
import { getCaretRect, type CaretRect } from './caret-position'

export { UiMentionTagComponent } from './mention-tag.component'

export interface MentionOption {
  value: string
  label: string
  description?: string
  avatar?: string
  email?: string
  handle?: string
  bio?: string
  joined?: string
  following?: number | string
  followers?: number | string
  verified?: boolean
  disabled?: boolean
  [key: string]: unknown
}

/**
 * Angular port of UIPKGE Mentions, 1:1 with the React component: a combobox textarea that
 * detects a trigger character (`@` by default, or any of `triggers`) at the caret, opens a
 * Popover anchored at the caret with the filtered options (static list, per-trigger map, or
 * debounced `loadOptions`), and on Enter / Tab / click replaces trigger + query with the
 * formatted token. ArrowUp / ArrowDown move the highlight (skipping disabled options) and
 * Escape closes. Focus stays in the textarea (the popover never steals it).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-mentions, [ui-mentions]',
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverAnchorComponent, UiPopoverContentComponent],
  host: {
    'data-uipkge': '',
    'data-slot': 'mentions',
    '[class]': 'hostClass',
  },
  template: `
    <textarea
      #textarea
      [value]="current()"
      [rows]="rows"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readOnly]="readOnly"
      role="combobox"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="listboxId"
      [attr.aria-activedescendant]="open() && filtered.length > 0 ? optionId(highlightedIndex()) : null"
      class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-16 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      (input)="onInput($event)"
      (keydown)="onKeyDown($event)"
      (scroll)="updateAnchor()"
    ></textarea>
    <ui-popover [open]="open()" (openChange)="open.set($event)">
      <div
        ui-popover-anchor
        aria-hidden="true"
        [style.display]="caretRect() ? null : 'none'"
        [style.position]="caretRect() ? 'fixed' : null"
        [style.top.px]="caretRect() ? caretRect()!.top + caretRect()!.height : null"
        [style.left.px]="caretRect()?.left ?? null"
        [style.width.px]="caretRect() ? 0 : null"
        [style.height.px]="caretRect() ? 0 : null"
        [style.pointer-events]="caretRect() ? 'none' : null"
      ></div>
      <ui-popover-content
        align="start"
        [sideOffset]="4"
        class="border-border/80 w-64 rounded-lg p-1 shadow-md"
        (openAutoFocus)="preventFocus($event)"
      >
        <div [id]="listboxId">
          @if (totalLoading) {
            <div class="text-muted-foreground px-2 py-3 text-sm" role="status">Loading...</div>
          } @else if (filtered.length === 0) {
            <div class="text-muted-foreground px-2 py-3 text-sm" role="status">No matches</div>
          } @else {
            <ul class="max-h-64 overflow-auto" role="listbox" aria-label="Mentions">
              @for (opt of filtered; track opt.value; let i = $index) {
                <li
                  [id]="optionId(i)"
                  role="option"
                  [attr.aria-selected]="i === highlightedIndex()"
                  [attr.aria-disabled]="opt.disabled || null"
                  [class]="optionClass(opt, i)"
                  (mouseenter)="!opt.disabled && highlightedIndex.set(i)"
                  (mousedown)="$event.preventDefault(); !opt.disabled && insert(opt)"
                >
                  @if (opt.avatar) {
                    <img [src]="opt.avatar" alt="" class="size-6 rounded-full object-cover" />
                  }
                  <div class="min-w-0 flex-1">
                    <div class="truncate font-medium">{{ opt.label }}</div>
                    @if (opt.description || opt.email) {
                      <div class="text-muted-foreground truncate text-xs">{{ opt.description || opt.email }}</div>
                    }
                  </div>
                </li>
              }
            </ul>
          }
        </div>
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiMentionsComponent<O extends MentionOption = MentionOption> implements OnChanges, OnDestroy {
  /** Controlled textarea value (pair with `valueChange`). */
  @Input() value = ''
  @Input() options: O[] | Record<string, O[]> = []
  @Input() triggers: string[] = ['@']
  @Input() triggerPrefixes?: Record<string, string>
  @Input() prefix = '@'
  @Input() rows = 4
  @Input({ transform: booleanAttribute }) loading = false
  @Input() loadOptions?: (query: string, trigger: string) => Promise<O[]>
  @Input() format?: (option: O, trigger: string) => string
  @Input() placeholder = ''
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  @Input('class') className?: string

  /** Fires with the next textarea value on every input + on insert (React `onValueChange`). */
  @Output() valueChange = new EventEmitter<string>()
  /**
   * Fires when an option is committed into the text (React `onSelect`). Not named `select`:
   * the textarea's native select event bubbles to this host and would reach `(select)` too.
   */
  @Output() mentionSelect = new EventEmitter<O>()
  /** Fires whenever the active mention query changes (React `onSearch`). */
  @Output() search = new EventEmitter<{ trigger: string; query: string }>()

  @ViewChild('textarea', { static: true }) private textareaRef!: ElementRef<HTMLTextAreaElement>

  readonly open = signal(false)
  readonly activeTrigger = signal('')
  readonly query = signal('')
  readonly highlightedIndex = signal(0)
  readonly asyncResults = signal<O[]>([])
  readonly isAsyncLoading = signal(false)
  readonly caretRect = signal<CaretRect | null>(null)
  /** Latest text: the `value` input, advanced by typing / inserts until the parent echoes it. */
  readonly current = signal('')
  private triggerIndex = -1
  private asyncToken = 0
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  readonly listboxId = uniqueId('mentions-listbox')

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) this.current.set(this.value ?? '')
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
  }

  get hostClass(): string {
    return cn('block', 'relative w-full', this.className)
  }

  optionId(i: number): string {
    return `${this.listboxId}-opt-${i}`
  }

  private get currentOptionsList(): O[] {
    const options = this.options
    if (!options) return []
    if (Array.isArray(options)) return options
    return options[this.activeTrigger()] ?? []
  }

  get filtered(): O[] {
    if (this.loadOptions) return this.asyncResults()
    const source = this.currentOptionsList
    const query = this.query()
    if (!query) return source
    const q = query.toLowerCase()
    return source.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.email && o.email.toLowerCase().includes(q)),
    )
  }

  get totalLoading(): boolean {
    return this.loading || this.isAsyncLoading()
  }

  optionClass(opt: O, i: number): string {
    return cn(
      'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
      i === this.highlightedIndex() && !opt.disabled ? 'bg-accent text-accent-foreground' : '',
      opt.disabled ? 'cursor-not-allowed opacity-50' : '',
    )
  }

  /** React: `onOpenAutoFocus={(e) => e.preventDefault()}` keeps the caret in the textarea. */
  preventFocus(e: PopoverDismissEvent): void {
    e.preventDefault()
  }

  private moveHighlight(delta: number): void {
    const list = this.filtered
    const len = list.length
    if (len === 0) return
    let i = this.highlightedIndex()
    for (let n = 0; n < len; n++) {
      i = (i + delta + len) % len
      if (!list[i]?.disabled) {
        document.getElementById(this.optionId(i))?.scrollIntoView?.({ block: 'nearest' })
        this.highlightedIndex.set(i)
        return
      }
    }
  }

  private findActiveMention(val: string, caret: number): { trigger: string; index: number; query: string } | null {
    for (let i = caret - 1; i >= 0; i--) {
      const ch = val[i]!
      if (this.triggers.includes(ch)) {
        const before = i === 0 ? '' : val[i - 1]!
        if (i === 0 || /\s/.test(before)) return { trigger: ch, index: i, query: val.substring(i + 1, caret) }
        return null
      }
      if (/\s/.test(ch)) return null
    }
    return null
  }

  updateAnchor(): void {
    const ta = this.textareaRef.nativeElement
    this.caretRect.set(getCaretRect(ta, ta.selectionStart ?? 0))
  }

  private async runAsync(trigger: string, q: string): Promise<void> {
    if (!this.loadOptions) return
    const token = ++this.asyncToken
    this.isAsyncLoading.set(true)
    try {
      const results = await this.loadOptions(q, trigger)
      if (token === this.asyncToken) this.asyncResults.set(results)
    } finally {
      if (token === this.asyncToken) this.isAsyncLoading.set(false)
    }
  }

  private scheduleAsync(trigger: string, q: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => void this.runAsync(trigger, q), 200)
  }

  onInput(e: Event): void {
    const ta = e.target as HTMLTextAreaElement
    const next = ta.value
    this.current.set(next)
    this.valueChange.emit(next)
    const match = this.findActiveMention(next, ta.selectionStart ?? 0)
    if (match) {
      // Anchor at the caret before opening so the first placement is already right.
      this.updateAnchor()
      this.activeTrigger.set(match.trigger)
      this.triggerIndex = match.index
      this.query.set(match.query)
      this.open.set(true)
      this.search.emit({ trigger: match.trigger, query: match.query })
      if (this.loadOptions) this.scheduleAsync(match.trigger, match.query)
      requestAnimationFrame(() => this.updateAnchor())
    } else {
      this.open.set(false)
    }
  }

  private defaultFormat(option: O, trigger: string): string {
    const resolvedPrefix = this.triggerPrefixes?.[trigger] ?? trigger ?? this.prefix ?? '@'
    return `${resolvedPrefix}${option.value} `
  }

  insert(option: O): void {
    const ta = this.textareaRef.nativeElement
    const caret = ta.selectionStart ?? 0
    const value = this.current()
    const before = value.substring(0, this.triggerIndex)
    const after = value.substring(caret)
    const trigger = this.activeTrigger()
    const token = this.format ? this.format(option, trigger) : this.defaultFormat(option, trigger)
    const next = before + token + after
    this.current.set(next)
    this.valueChange.emit(next)
    this.mentionSelect.emit(option)
    this.open.set(false)
    requestAnimationFrame(() => {
      const pos = before.length + token.length
      ta.focus()
      ta.setSelectionRange(pos, pos)
    })
  }

  onKeyDown(e: KeyboardEvent): void {
    if (!this.open()) return
    if (e.key === 'Escape') {
      e.preventDefault()
      this.open.set(false)
      return
    }
    const list = this.filtered
    if (list.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.moveHighlight(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      this.moveHighlight(-1)
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      const opt = list[this.highlightedIndex()]
      if (opt && !opt.disabled) this.insert(opt)
    }
  }
}

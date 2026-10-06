import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import type { JsonValue } from './types'

export type { JsonValue } from './types'

function pathKey(path: (string | number)[]): string {
  return path.length ? path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('') : '$'
}

function typeOf(val: JsonValue): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' {
  if (val === null) return 'null'
  if (Array.isArray(val)) return 'array'
  return typeof val as 'object' | 'string' | 'number' | 'boolean'
}

function formatValue(val: JsonValue): string {
  if (val === null) return 'null'
  if (typeof val === 'string') return JSON.stringify(val)
  return String(val)
}

const typeColor: Record<string, string> = {
  string: 'text-emerald-600 dark:text-emerald-400',
  number: 'text-blue-600 dark:text-blue-400',
  boolean: 'text-amber-600 dark:text-amber-400',
  null: 'text-muted-foreground italic',
  object: 'text-foreground',
  array: 'text-foreground',
}

const keyColor = 'text-violet-600 dark:text-violet-400'

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-json-tree-node, [ui-json-tree-node]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"json-tree-node"',
    '[attr.data-uipkge]': '""',
    '[attr.data-dimmed]': 'dimmed ? "" : null',
    '[class.opacity-30]': 'dimmed',
    '[attr.role]': '"treeitem"',
    '[attr.aria-expanded]': 'isContainer ? open : null',
  },
  template: `
    @if (isContainer) {
      <div
        data-tree-row
        [attr.data-tree-id]="key"
        [attr.data-tree-parent]="parentKey"
        tabindex="0"
        class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        [style.padding-left.px]="indent"
        (click)="toggle()"
        (keydown)="handleRowKeydown($event)"
      >
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-4 shrink-0 items-center justify-center rounded"
          [attr.aria-expanded]="open"
          [attr.aria-label]="open ? 'Collapse' : 'Expand'"
          tabindex="-1"
          (click)="onToggleClick($event)"
        >
          @if (open) {
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
              class="lucide lucide-chevron-down size-3.5"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
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
              class="lucide lucide-chevron-right size-3.5"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          }
        </button>
        <span class="text-violet-600 select-none dark:text-violet-400">{{ isRoot ? label : '"' + label + '"' }}</span>
        <span class="text-muted-foreground">:</span>
        @if (open) {
          <span class="text-muted-foreground select-none">{{ type === 'array' ? '[' : '{' }}</span>
        } @else {
          <span class="text-muted-foreground select-none">{{ collapsedPreview }}</span>
        }
        @if (open) {
          <span class="text-muted-foreground ml-0.5 text-xs">{{ count }} {{ count === 1 ? 'item' : 'items' }}</span>
        }
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
          title="Copy value"
          aria-label="Copy value"
          tabindex="-1"
          (click)="onCopyClick($event)"
        >
          @if (copiedPath === key) {
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
              class="lucide lucide-check size-3 text-emerald-500"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
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
              class="lucide lucide-copy size-3"
              aria-hidden="true"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          }
        </button>
      </div>

      @if (open) {
        <div role="group">
          @for (entry of entries; track entry.key) {
            <ui-json-tree-node
              [data]="entry.value"
              [path]="appendPath(entry.key)"
              [label]="entry.key"
              [isRoot]="false"
              [search]="search"
              [maxDepth]="maxDepth"
              [copiedPath]="copiedPath"
              [matchesSearchFn]="matchesSearchFn"
              [isExpandedFn]="isExpandedFn"
              [toggleFn]="toggleFn"
              (copy)="copy.emit($event)"
            />
          }
          <div class="text-muted-foreground py-0.5 select-none" [style.padding-left.px]="indent">
            {{ type === 'array' ? ']' : '}' }}
          </div>
        </div>
      }
    } @else {
      <div
        data-tree-row
        [attr.data-tree-id]="key"
        [attr.data-tree-parent]="parentKey"
        tabindex="0"
        class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        [style.padding-left.px]="indent"
        (click)="handleCopy()"
        (keydown)="handleRowKeydown($event)"
      >
        <span class="inline-flex size-4 shrink-0"></span>
        @if (isRoot) {
          <span class="text-muted-foreground select-none">{{ label }}</span>
        } @else {
          <span class="text-violet-600 select-none dark:text-violet-400">"{{ label }}"</span>
        }
        <span class="text-muted-foreground">:</span>
        <span [class]="valueClass">{{ formattedValue }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
          title="Copy value"
          aria-label="Copy value"
          tabindex="-1"
          (click)="onCopyClick($event)"
        >
          @if (copiedPath === key) {
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
              class="lucide lucide-check size-3 text-emerald-500"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
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
              class="lucide lucide-copy size-3"
              aria-hidden="true"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          }
        </button>
      </div>
    }
  `,
})
export class UiJsonTreeNodeComponent {
  @Input() data: JsonValue = null
  @Input() path: (string | number)[] = []
  @Input() label: string | number = ''
  @Input({ transform: booleanAttribute }) isRoot = false
  @Input() search = ''
  @Input() maxDepth = 100
  @Input() copiedPath: string | null = null

  @Input() matchesSearchFn?: (val: JsonValue) => boolean
  @Input() isExpandedFn?: (path: (string | number)[]) => boolean
  @Input() toggleFn?: (path: (string | number)[]) => void

  @Output() copy = new EventEmitter<{ value: string; path: string }>()

  // Backwards-compat getters & setters for unit tests
  get value(): JsonValue {
    return this.data
  }
  set value(v: JsonValue) {
    this.data = v
  }

  get key(): string {
    return pathKey(this.path)
  }

  get parentKey(): string | null {
    return this.path.length ? pathKey(this.path.slice(0, -1)) : null
  }

  get type(): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' {
    return typeOf(this.data)
  }

  get isContainer(): boolean {
    return this.type === 'object' || this.type === 'array'
  }

  get isExpandable(): boolean {
    return this.isContainer
  }

  get open(): boolean {
    return this.isExpandedFn ? this.isExpandedFn(this.path) : false
  }

  get dimmed(): boolean {
    return !!this.search && !!this.matchesSearchFn && !this.matchesSearchFn(this.data)
  }

  get indent(): number {
    return this.isRoot ? 0 : 20
  }

  get entries(): { key: string; value: JsonValue }[] {
    if (Array.isArray(this.data)) return this.data.map((v, i) => ({ key: String(i), value: v }))
    if (this.data !== null && typeof this.data === 'object') {
      return Object.entries(this.data).map(([key, value]) => ({ key, value: value as JsonValue }))
    }
    return []
  }

  get count(): number {
    return this.entries.length
  }

  get formattedValue(): string {
    return formatValue(this.data)
  }

  get displayValue(): string {
    return this.formattedValue
  }

  get valueClass(): string {
    return cn(typeColor[this.type] ?? 'text-foreground', 'rounded text-left font-mono')
  }

  get collapsedPreview(): string {
    if (this.open || !this.isContainer) return ''
    const items = this.entries.slice(0, 3)
    const parts = items.map(({ key, value: v }) => {
      const vt = typeOf(v)
      let valStr: string
      if (vt === 'string') valStr = `"${String(v).slice(0, 20)}"`
      else if (vt === 'array') valStr = '[…]'
      else if (vt === 'object') valStr = '{…}'
      else valStr = formatValue(v)
      return `${Array.isArray(this.data) ? '' : `"${key}": `}${valStr}`
    })
    const suffix = this.count > 3 ? ', …' : ''
    const open2 = this.type === 'array' ? '[' : '{'
    const close = this.type === 'array' ? ']' : '}'
    return `${open2}${parts.join(', ')}${suffix}${close}`
  }

  appendPath(segment: string | number): (string | number)[] {
    return [...this.path, segment]
  }

  formatEntryKey(segment: string | number): string {
    return String(segment)
  }

  toggle(): void {
    this.toggleFn?.(this.path)
  }

  onToggleClick(e: MouseEvent): void {
    e.stopPropagation()
    this.toggle()
  }

  handleCopy(): void {
    const str = typeof this.data === 'string' ? this.data : JSON.stringify(this.data)
    const p = this.path.length ? this.key : String(this.label) || '$'
    this.copy.emit({ value: str, path: p })
  }

  copyValue(): void {
    this.handleCopy()
  }

  onCopyClick(e: MouseEvent): void {
    e.stopPropagation()
    this.handleCopy()
  }

  handleRowKeydown(e: KeyboardEvent): void {
    const target = e.currentTarget as HTMLElement
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (this.isContainer) this.toggle()
      else this.handleCopy()
      return
    }

    const tree = target.closest('[role="tree"]')
    const rows = tree ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]')) : []
    const idx = rows.indexOf(target)

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (this.isContainer && !this.open) {
        this.toggle()
      } else if (this.isContainer && this.open && idx >= 0 && idx < rows.length - 1) {
        rows[idx + 1]?.focus()
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (this.isContainer && this.open) {
        this.toggle()
      } else if (this.parentKey && tree) {
        const parent = tree.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(this.parentKey)}"]`)
        parent?.focus()
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (idx < 0) return
      const next = e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1]
      next?.focus()
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      rows[0]?.focus()
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      rows[rows.length - 1]?.focus()
    }
  }
}

/**
 * Angular port of UIPKGE JsonTreeView. Collapsible JSON viewer with
 * color-coded types, copy, search, expand-all. 1:1 React parity.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-json-tree-view, [ui-json-tree-view]',
  standalone: true,
  imports: [UiJsonTreeNodeComponent],
  host: {
    '[attr.data-slot]': '"json-tree-view"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    @if (showToolbar || showSearch) {
      <div data-slot="json-tree-toolbar" class="border-border flex items-center gap-2 border-b px-3 py-2">
        <div class="flex items-center gap-1.5">
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
            class="lucide lucide-braces text-muted-foreground size-4"
            aria-hidden="true"
          >
            <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
            <path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
          </svg>
          <span class="text-muted-foreground text-xs">{{ summary }}</span>
        </div>
        <div class="ml-auto flex items-center gap-1">
          @if (showSearch) {
            <div class="relative">
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
                class="lucide lucide-search text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                data-slot="json-tree-search"
                type="text"
                [value]="search"
                (input)="onSearchInput($event)"
                placeholder="Filter..."
                aria-label="Filter JSON tree"
                class="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2"
              />
            </div>
          }
          @if (search) {
            <span class="text-muted-foreground text-xs">
              {{ searchMatchCount }} match{{ searchMatchCount === 1 ? '' : 'es' }}
            </span>
          }
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
            title="Expand all"
            aria-label="Expand all"
            (click)="expandAll()"
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
              class="lucide lucide-unfold-vertical size-4"
              aria-hidden="true"
            >
              <path d="M12 22v-6" />
              <path d="M12 8V2" />
              <path d="M4 12H2" />
              <path d="M10 12H8" />
              <path d="M16 12h-2" />
              <path d="M22 12h-2" />
              <path d="m15 19-3 3-3-3" />
              <path d="m9 5 3-3 3 3" />
            </svg>
          </button>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
            title="Collapse all"
            aria-label="Collapse all"
            (click)="collapseAll()"
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
              class="lucide lucide-fold-vertical size-4"
              aria-hidden="true"
            >
              <path d="M12 22v-6" />
              <path d="M12 8V2" />
              <path d="M4 12H2" />
              <path d="M10 12H8" />
              <path d="M16 12h-2" />
              <path d="M22 12h-2" />
              <path d="m15 5-3-3-3 3" />
              <path d="m9 19 3 3 3-3" />
            </svg>
          </button>
        </div>
      </div>
    }

    <div
      class="min-h-0 flex-1 overflow-auto p-2"
      role="tree"
      [attr.aria-label]="rootLabel"
      [style.max-height]="maxHeight"
    >
      <ui-json-tree-node
        [data]="data"
        [path]="[]"
        [label]="rootLabel"
        [isRoot]="true"
        [search]="search"
        [maxDepth]="maxDepth"
        [copiedPath]="copiedPath"
        [matchesSearchFn]="matchesSearchBound"
        [isExpandedFn]="isExpandedBound"
        [toggleFn]="toggleBound"
        (copy)="onCopyNode($event)"
      />
    </div>
  `,
})
export class UiJsonTreeViewComponent implements OnInit, OnChanges {
  @Input() data: JsonValue = null
  @Input() expandDepth = 1
  @Input() maxDepth = 100
  @Input({ transform: booleanAttribute }) showSearch = true
  @Input({ transform: booleanAttribute }) showToolbar = true
  @Input() rootLabel = 'root'
  @Input() maxHeight?: string
  @Input('class') className?: string

  @Output() copy = new EventEmitter<{ value: string; path: string }>()

  search = ''
  copiedPath: string | null = null
  expanded = new Set<string>()
  forcedExpanded: boolean | null = null

  readonly matchesSearchBound = (val: JsonValue): boolean => this.matchesSearch(val)
  readonly isExpandedBound = (path: (string | number)[]): boolean => this.expanded.has(pathKey(path))
  readonly toggleBound = (path: (string | number)[]): void => this.toggle(path)

  get hostClass(): string {
    return cn('bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm', this.className)
  }

  get summary(): string {
    const t = typeOf(this.data)
    if (t === 'array') return `Array(${(this.data as JsonValue[]).length})`
    if (t === 'object') return `Object(${Object.keys(this.data as object).length})`
    return t
  }

  get searchMatchCount(): number {
    if (!this.search) return 0
    let count = 0
    const term = this.search.toLowerCase()
    const walk = (v: JsonValue) => {
      if (v === null) {
        if ('null'.includes(term)) count++
        return
      }
      if (typeof v === 'string') {
        if (v.toLowerCase().includes(term)) count++
        return
      }
      if (typeof v === 'number' || typeof v === 'boolean') {
        if (String(v).includes(term)) count++
        return
      }
      if (Array.isArray(v)) {
        v.forEach(walk)
        return
      }
      if (typeof v === 'object') {
        Object.entries(v).forEach(([k, val]) => {
          if (k.toLowerCase().includes(term)) count++
          walk(val)
        })
      }
    }
    walk(this.data)
    return count
  }

  ngOnInit(): void {
    this.resetExpanded()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['expandDepth']) {
      this.resetExpanded()
    }
  }

  private resetExpanded(): void {
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= this.expandDepth) return
      if (val !== null && typeof val === 'object') {
        next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(this.data)
    this.expanded = next
  }

  toggle(path: (string | number)[]): void {
    const k = pathKey(path)
    const next = new Set(this.expanded)
    if (next.has(k)) next.delete(k)
    else next.add(k)
    this.expanded = next
  }

  expandAll(): void {
    this.forcedExpanded = true
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= this.maxDepth) return
      if (val !== null && typeof val === 'object') {
        next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(this.data)
    this.expanded = next
  }

  collapseAll(): void {
    this.forcedExpanded = false
    this.expanded = new Set()
  }

  onSearchInput(event: Event): void {
    this.search = (event.target as HTMLInputElement).value
    if (!this.search) {
      this.resetExpanded()
      return
    }
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= this.maxDepth) return
      if (val !== null && typeof val === 'object') {
        if (this.matchesSearch(val)) next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(this.data)
    this.expanded = next
  }

  matchesSearch(val: JsonValue): boolean {
    if (!this.search) return true
    const term = this.search.toLowerCase()
    const walk = (v: JsonValue): boolean => {
      if (v === null) return 'null'.includes(term)
      if (typeof v === 'string') return v.toLowerCase().includes(term)
      if (typeof v === 'number' || typeof v === 'boolean') return String(v).includes(term)
      if (Array.isArray(v)) return v.some(walk)
      if (typeof v === 'object') {
        return Object.entries(v).some(([k, value]) => k.toLowerCase().includes(term) || walk(value))
      }
      return false
    }
    return walk(val)
  }

  async onCopyNode(event: { value: string; path: string }): Promise<void> {
    try {
      await navigator.clipboard.writeText(event.value)
      this.copiedPath = event.path
      this.copy.emit(event)
      setTimeout(() => {
        if (this.copiedPath === event.path) this.copiedPath = null
      }, 1200)
    } catch {
      this.copy.emit(event)
    }
  }
}

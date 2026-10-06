import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiButtonComponent } from '@/ui/button/button.component'
import { UiCheckboxComponent } from '@/ui/checkbox/checkbox.component'
import { UiInputComponent } from '@/ui/input/input.component'
import { UiScrollAreaComponent } from '@/ui/scroll-area/scroll-area.component'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

export interface TransferItem {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

export type TransferSide = 'left' | 'right'

interface TransferDragPayload {
  keys: string[]
  fromSide: TransferSide
}

const defaultFilter = (q: string, item: TransferItem) => item.label.toLowerCase().includes(q.toLowerCase())

/**
 * Angular port of UIPKGE Transfer, 1:1 with the React component: two TransferList columns
 * (header with select-all checkbox + "selected/total", optional search, a role=listbox of
 * items, optional pagination and footer) around a TransferOperation strip of move buttons.
 * Keyboard: arrows / Home / End move between rows, Enter / Space toggle, Ctrl/Cmd+Enter or
 * Alt+Arrow transfer. `draggable` enables HTML5 drag between lists and reordering inside the
 * target; `selectable=false` hides checkboxes for desktop click / Cmd / Shift selection.
 * `targetKeys` / `defaultTargetKeys` / `targetKeysChange` work controlled or uncontrolled.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-transfer, [ui-transfer]',
  standalone: true,
  // The parts are declared below this class.
  imports: [forwardRef(() => UiTransferListComponent), forwardRef(() => UiTransferOperationComponent)],
  host: {
    'data-uipkge': '',
    'data-slot': 'transfer',
    '[class]': 'hostClass',
  },
  template: `
    <div class="min-w-0 flex-1">
      <div
        ui-transfer-list
        side="left"
        [title]="titles[0]"
        [items]="sourceItems"
        [selected]="selectedLeft()"
        (selectedChange)="onLeftSelected($event)"
        (search)="search.emit({ direction: 'left', query: $event })"
        [footer]="footerLeft"
      ></div>
    </div>
    <div
      ui-transfer-operation
      [canMoveRight]="selectedLeft().length > 0 && !disabled"
      [canMoveLeft]="selectedRight().length > 0 && !disabled"
      [oneWay]="oneWay"
      (moveRight)="moveRight()"
      (moveLeft)="moveLeft()"
    ></div>
    <div class="min-w-0 flex-1">
      <div
        ui-transfer-list
        side="right"
        [title]="titles[1]"
        [items]="targetItems"
        [selected]="selectedRight()"
        (selectedChange)="onRightSelected($event)"
        (search)="search.emit({ direction: 'right', query: $event })"
        [footer]="footerRight"
      ></div>
    </div>
  `,
})
export class UiTransferComponent {
  /** Controlled target keys (pair with `targetKeysChange`). Leave unset for uncontrolled use. */
  @Input() targetKeys?: string[]
  /** Uncontrolled initial target keys. */
  @Input() defaultTargetKeys?: string[]
  @Input() dataSource: TransferItem[] = []
  @Input() titles: [string, string] = ['Source', 'Target']
  @Input({ transform: booleanAttribute }) showSearch = false
  @Input() filterFn?: (query: string, item: TransferItem) => boolean
  @Input() height: number | string = 320
  @Input() pagination: boolean | { pageSize: number } = false
  @Input({ transform: booleanAttribute }) oneWay = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) draggable = false
  @Input({ transform: booleanAttribute }) selectable = true
  @Input('class') className?: string
  /** Footer rendered under the left list (React `footerLeft` node). */
  @Input() footerLeft?: TemplateRef<unknown> | null
  /** Footer rendered under the right list (React `footerRight` node). */
  @Input() footerRight?: TemplateRef<unknown> | null

  /** React `onTargetKeysChange`. */
  @Output() targetKeysChange = new EventEmitter<string[]>()
  /**
   * React `onChange(keys, direction, moved)`. Not named `change`: the native change event of
   * the search inputs bubbles to this host and would reach a `(change)` listener too.
   */
  @Output() transferChange = new EventEmitter<{ keys: string[]; direction: TransferSide; moved: string[] }>()
  /** React `onSearch`. */
  @Output() search = new EventEmitter<{ direction: TransferSide; query: string }>()
  /** React `onSelectChange`. */
  @Output() selectChange = new EventEmitter<{ left: string[]; right: string[] }>()

  readonly selectedLeft = signal<string[]>([])
  readonly selectedRight = signal<string[]>([])
  readonly dragPayload = signal<TransferDragPayload | null>(null)
  private readonly internalKeys = signal<string[] | null>(null)

  get hostClass(): string {
    return cn('flex items-stretch gap-3', this.className)
  }

  get resolvedTargetKeys(): string[] {
    if (this.targetKeys !== undefined) return this.targetKeys
    return this.internalKeys() ?? this.defaultTargetKeys ?? []
  }

  private setTargetKeys(next: string[]): void {
    if (this.targetKeys === undefined) this.internalKeys.set(next)
    this.targetKeysChange.emit(next)
  }

  get filter(): (query: string, item: TransferItem) => boolean {
    return this.filterFn ?? defaultFilter
  }

  get pageSize(): number | null {
    if (this.pagination === false) return null
    if (this.pagination === true) return 10
    return this.pagination.pageSize
  }

  get sourceItems(): TransferItem[] {
    const keys = this.resolvedTargetKeys
    return this.dataSource.filter((i) => !keys.includes(i.key))
  }

  /** When draggable, target order follows targetKeys exactly so reorder persists. */
  get targetItems(): TransferItem[] {
    const keys = this.resolvedTargetKeys
    if (this.draggable) {
      const map = new Map(this.dataSource.map((i) => [i.key, i]))
      return keys.map((k) => map.get(k)).filter((i): i is TransferItem => !!i)
    }
    return this.dataSource.filter((i) => keys.includes(i.key))
  }

  startDrag(payload: TransferDragPayload): void {
    this.dragPayload.set(payload)
  }

  endDrag(): void {
    this.dragPayload.set(null)
  }

  drop(toSide: TransferSide, beforeKey: string | null): void {
    const payload = this.dragPayload()
    this.dragPayload.set(null)
    if (!payload || this.disabled) return
    const map = new Map(this.dataSource.map((i) => [i.key, i]))
    const keys = payload.keys.filter((k) => {
      const item = map.get(k)
      return item && !item.disabled
    })
    if (keys.length === 0) return

    // left -> left: reorder source not supported (parent owns dataSource order). No-op.
    if (payload.fromSide === 'left' && toSide === 'left') return

    // right -> left: remove from targetKeys (skip when oneWay).
    if (payload.fromSide === 'right' && toSide === 'left') {
      if (this.oneWay) return
      const removeSet = new Set(keys)
      const next = this.resolvedTargetKeys.filter((k) => !removeSet.has(k))
      const nextRight = this.selectedRight().filter((k) => !removeSet.has(k))
      this.selectedRight.set(nextRight)
      this.setTargetKeys(next)
      this.transferChange.emit({ keys: next, direction: 'left', moved: keys })
      this.selectChange.emit({ left: this.selectedLeft(), right: nextRight })
      return
    }

    // -> right: insert (cross-list move) or reorder (within-target).
    const movingSet = new Set(keys)
    const without = this.resolvedTargetKeys.filter((k) => !movingSet.has(k))
    let insertAt = without.length
    if (beforeKey != null) {
      const idx = without.indexOf(beforeKey)
      if (idx >= 0) insertAt = idx
    }
    const next = [...without.slice(0, insertAt), ...keys, ...without.slice(insertAt)]
    if (payload.fromSide === 'left') {
      const nextLeft = this.selectedLeft().filter((k) => !movingSet.has(k))
      this.selectedLeft.set(nextLeft)
      this.setTargetKeys(next)
      this.transferChange.emit({ keys: next, direction: 'right', moved: keys })
      this.selectChange.emit({ left: nextLeft, right: this.selectedRight() })
    } else {
      // right -> right: pure reorder, no change event (target set unchanged).
      this.setTargetKeys(next)
    }
  }

  onLeftSelected(keys: string[]): void {
    this.selectedLeft.set(keys)
    this.selectChange.emit({ left: keys, right: this.selectedRight() })
  }

  onRightSelected(keys: string[]): void {
    this.selectedRight.set(keys)
    this.selectChange.emit({ left: this.selectedLeft(), right: keys })
  }

  /** Move left -> right. Optional keys override the current left selection. */
  moveRight(keys?: string[]): void {
    if (this.disabled) return
    const moved = keys?.length ? [...keys] : [...this.selectedLeft()]
    if (moved.length === 0) return
    const current = this.resolvedTargetKeys
    const next = [...current, ...moved.filter((k) => !current.includes(k))]
    const nextLeft = this.selectedLeft().filter((k) => !moved.includes(k))
    this.selectedLeft.set(nextLeft)
    this.setTargetKeys(next)
    this.transferChange.emit({ keys: next, direction: 'right', moved })
    this.selectChange.emit({ left: nextLeft, right: this.selectedRight() })
  }

  /** Move right -> left. Optional keys override the current right selection. */
  moveLeft(keys?: string[]): void {
    if (this.disabled || this.oneWay) return
    const moved = keys?.length ? [...keys] : [...this.selectedRight()]
    if (moved.length === 0) return
    const remove = new Set(moved)
    const next = this.resolvedTargetKeys.filter((k) => !remove.has(k))
    const nextRight = this.selectedRight().filter((k) => !remove.has(k))
    this.selectedRight.set(nextRight)
    this.setTargetKeys(next)
    this.transferChange.emit({ keys: next, direction: 'left', moved })
    this.selectChange.emit({ left: this.selectedLeft(), right: nextRight })
  }
}

/** The centre strip of move buttons (React `TransferOperation`). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-transfer-operation, [ui-transfer-operation]',
  standalone: true,
  imports: [UiButtonComponent],
  host: { class: 'flex flex-col items-center justify-center gap-2 px-2' },
  template: `
    <button
      ui-button
      size="icon-sm"
      variant="outline"
      [disabled]="!canMoveRight"
      aria-label="Move selected to right"
      (click)="moveRight.emit()"
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
        class="lucide lucide-chevron-right"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
    @if (!oneWay) {
      <button
        ui-button
        size="icon-sm"
        variant="outline"
        [disabled]="!canMoveLeft"
        aria-label="Move selected to left"
        (click)="moveLeft.emit()"
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
          class="lucide lucide-chevron-left"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
    }
  `,
})
export class UiTransferOperationComponent {
  @Input({ transform: booleanAttribute }) canMoveRight = false
  @Input({ transform: booleanAttribute }) canMoveLeft = false
  @Input({ transform: booleanAttribute }) oneWay = false
  @Output() moveRight = new EventEmitter<void>()
  @Output() moveLeft = new EventEmitter<void>()
}

/** One column of a Transfer (React `TransferList`); must sit inside `ui-transfer`. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-transfer-list, [ui-transfer-list]',
  standalone: true,
  imports: [UiCheckboxComponent, UiInputComponent, UiScrollAreaComponent, UiRenderTemplateDirective],
  host: { '[class]': 'hostClass' },
  template: `
    <div class="bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
      <div class="flex min-w-0 items-center gap-2">
        @if (ctx.selectable) {
          <ui-checkbox
            [attr.aria-label]="'Select all in ' + title"
            [checked]="masterIndeterminate ? 'indeterminate' : masterChecked"
            [disabled]="ctx.disabled || visibleEnabledKeys.length === 0"
            (checkedChange)="toggleAll($event === true)"
          />
        }
        <span class="truncate text-sm font-medium">{{ title }}</span>
      </div>
      <span class="text-muted-foreground text-xs tabular-nums"> {{ selected.length }}/{{ items.length }} </span>
    </div>

    @if (ctx.showSearch) {
      <div class="border-b p-2">
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
            class="lucide lucide-search text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2"
            aria-hidden="true"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <ui-input
            [value]="query()"
            placeholder="Search"
            [aria-label]="'Search ' + title"
            class="h-8 pl-8"
            (valueChange)="handleSearch($any($event))"
          />
        </div>
      </div>
    }

    <ui-scroll-area
      [style.height]="heightStyle"
      class="flex-1"
      (dragover)="onListDragOver($event)"
      (drop)="onListDrop($event)"
      (dragleave)="onListDragLeave($event)"
    >
      <ul role="listbox" [attr.aria-label]="title" aria-multiselectable="true" class="py-1">
        @for (item of visible; track item.key) {
          <li
            role="option"
            [attr.aria-selected]="isSelected(item)"
            [attr.aria-disabled]="item.disabled || null"
            [attr.tabindex]="item.disabled || ctx.disabled ? -1 : 0"
            [attr.draggable]="ctx.draggable && !item.disabled && !ctx.disabled"
            [class]="itemClass(item)"
            (click)="onRowClick($event, item)"
            (keydown)="onRowKeydown($event, item)"
            (dragstart)="onItemDragStart($event, item)"
            (dragend)="onItemDragEnd()"
            (dragover)="onItemDragOver($event, item)"
            (drop)="onItemDrop($event, item)"
          >
            @if (indicatorFor(item) === 'before') {
              <span
                class="bg-primary pointer-events-none absolute -top-px right-2 left-2 h-0.5 rounded-full"
                aria-hidden="true"
              ></span>
            }
            @if (indicatorFor(item) === 'after') {
              <span
                class="bg-primary pointer-events-none absolute right-2 -bottom-px left-2 h-0.5 rounded-full"
                aria-hidden="true"
              ></span>
            }
            @if (ctx.selectable) {
              <ui-checkbox
                [attr.aria-label]="'Select ' + (item.label || item.key)"
                [checked]="isSelected(item)"
                [disabled]="!!item.disabled || ctx.disabled"
                (checkedChange)="toggleItem(item, $event === true)"
                (click)="$event.stopPropagation()"
              />
            }
            <div class="min-w-0 flex-1">
              <div class="truncate">{{ item.label }}</div>
              @if (item.description) {
                <div class="text-muted-foreground truncate text-xs">{{ item.description }}</div>
              }
            </div>
            @if (ctx.draggable && !item.disabled) {
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
                class="lucide lucide-grip-vertical text-muted-foreground/60 mt-0.5 size-3.5 shrink-0"
                aria-hidden="true"
              >
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            }
          </li>
        }
        @if (visible.length === 0) {
          <li class="text-muted-foreground px-3 py-6 text-center text-sm">No items</li>
        }
      </ul>
    </ui-scroll-area>

    @if (ctx.pageSize && totalPages > 1) {
      <div class="flex items-center justify-center gap-2 border-t p-2 text-xs">
        <button
          type="button"
          class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          [disabled]="page() <= 1"
          [attr.aria-label]="'Previous page of ' + title"
          (click)="prevPage()"
        >
          Prev
        </button>
        <span class="tabular-nums" aria-live="polite">{{ page() }} / {{ totalPages }}</span>
        <button
          type="button"
          class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          [disabled]="page() >= totalPages"
          [attr.aria-label]="'Next page of ' + title"
          (click)="nextPage()"
        >
          Next
        </button>
      </div>
    }

    @if (footer) {
      <div class="border-t p-2"><ng-container [uiRenderTemplate]="footer" /></div>
    }
  `,
})
export class UiTransferListComponent implements OnChanges {
  readonly ctx = inject(UiTransferComponent)
  @Input() side: TransferSide = 'left'
  @Input() title = ''
  @Input() items: TransferItem[] = []
  @Input() selected: string[] = []
  @Input() footer?: TemplateRef<unknown> | null
  /** React `onSelectedChange`. */
  @Output() selectedChange = new EventEmitter<string[]>()
  /** React `onSearch`. */
  @Output() search = new EventEmitter<string>()

  readonly query = signal('')
  readonly page = signal(1)
  private lastAnchor: string | null = null
  readonly dropIndicator = signal<{ key: string; position: 'before' | 'after' } | null>(null)
  readonly draggingKeys = signal<Set<string>>(new Set())

  ngOnChanges(): void {
    // React clamps the page in an effect when the list shrinks.
    if (this.page() > this.totalPages) this.page.set(this.totalPages)
  }

  get hostClass(): string {
    const p = this.ctx.dragPayload()
    return cn(
      'bg-card flex flex-col overflow-hidden rounded-md border transition-colors',
      p && this.isDropTarget && 'ring-ring/40 ring-1',
    )
  }

  get filtered(): TransferItem[] {
    const q = this.query()
    if (!q) return this.items
    return this.items.filter((i) => this.ctx.filter(q, i))
  }

  private get effectivePageSize(): number {
    return this.ctx.pageSize ?? Math.max(1, this.filtered.length)
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.effectivePageSize))
  }

  get visible(): TransferItem[] {
    if (!this.ctx.pageSize) return this.filtered
    const start = (Math.min(this.page(), this.totalPages) - 1) * this.effectivePageSize
    return this.filtered.slice(start, start + this.effectivePageSize)
  }

  get visibleEnabledKeys(): string[] {
    return this.visible.filter((i) => !i.disabled).map((i) => i.key)
  }

  isSelected(item: TransferItem): boolean {
    return this.selected.includes(item.key)
  }

  get masterChecked(): boolean {
    const keys = this.visibleEnabledKeys
    return keys.length > 0 && keys.every((k) => this.selected.includes(k))
  }

  get masterIndeterminate(): boolean {
    const keys = this.visibleEnabledKeys
    const count = keys.filter((k) => this.selected.includes(k)).length
    return count > 0 && count < keys.length
  }

  get heightStyle(): string {
    const h = this.ctx.height
    return typeof h === 'number' ? h + 'px' : h
  }

  itemClass(item: TransferItem): string {
    return cn(
      'hover:bg-accent focus-visible:ring-ring relative flex min-h-11 cursor-pointer items-start gap-2 px-3 py-3 text-sm select-none focus-visible:ring-2 focus-visible:outline-none',
      item.disabled && 'cursor-not-allowed opacity-50',
      this.draggingKeys().has(item.key) && 'opacity-40',
      !this.ctx.selectable && this.isSelected(item) && 'bg-accent',
    )
  }

  indicatorFor(item: TransferItem): 'before' | 'after' | null {
    const d = this.dropIndicator()
    return d && d.key === item.key && this.side === 'right' ? d.position : null
  }

  toggleAll(checked: boolean): void {
    let next = [...this.selected]
    const keys = this.visibleEnabledKeys
    if (checked) {
      for (const k of keys) if (!next.includes(k)) next.push(k)
    } else {
      next = next.filter((k) => !keys.includes(k))
    }
    this.selectedChange.emit(next)
  }

  toggleItem(item: TransferItem, checked: boolean): void {
    if (item.disabled || this.ctx.disabled) return
    let next = [...this.selected]
    if (checked) {
      if (!next.includes(item.key)) next.push(item.key)
    } else {
      next = next.filter((k) => k !== item.key)
    }
    this.selectedChange.emit(next)
    this.lastAnchor = item.key
  }

  onRowClick(e: MouseEvent, item: TransferItem): void {
    if (item.disabled || this.ctx.disabled) return
    // With checkbox visible, click toggles (matches checkbox UX).
    if (this.ctx.selectable) {
      this.toggleItem(item, !this.isSelected(item))
      return
    }
    // No checkbox: desktop list pattern -- plain=replace, cmd/ctrl=toggle, shift=range.
    const enabledKeys = this.visibleEnabledKeys
    if (e.shiftKey && this.lastAnchor && enabledKeys.includes(this.lastAnchor)) {
      const start = enabledKeys.indexOf(this.lastAnchor)
      const end = enabledKeys.indexOf(item.key)
      const [lo, hi] = start < end ? [start, end] : [end, start]
      this.selectedChange.emit(enabledKeys.slice(lo, hi + 1))
      return
    }
    if (e.metaKey || e.ctrlKey) {
      const next = this.isSelected(item) ? this.selected.filter((k) => k !== item.key) : [...this.selected, item.key]
      this.selectedChange.emit(next)
      this.lastAnchor = item.key
      return
    }
    this.selectedChange.emit([item.key])
    this.lastAnchor = item.key
  }

  private optionRows(from: HTMLElement): HTMLElement[] {
    const list = from.closest('[role="listbox"]')
    if (!list) return []
    return Array.from(list.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'))
  }

  /** Keys to transfer: the current multi-selection, or just the focused item. */
  private keysToTransfer(item: TransferItem): string[] {
    if (this.isSelected(item) && this.selected.length > 0) {
      return this.selected.filter((k) => {
        const i = this.items.find((x) => x.key === k)
        return i && !i.disabled
      })
    }
    return item.disabled ? [] : [item.key]
  }

  onRowKeydown(e: KeyboardEvent, item: TransferItem): void {
    const target = e.currentTarget as HTMLElement

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const rows = this.optionRows(target)
      const idx = rows.indexOf(target)
      if (idx < 0) return
      rows[e.key === 'ArrowDown' ? idx + 1 : idx - 1]?.focus()
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      this.optionRows(target)[0]?.focus()
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      const rows = this.optionRows(target)
      rows[rows.length - 1]?.focus()
      return
    }

    // Ctrl/Cmd+Enter transfers selected items (or the focused item if none selected).
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (item.disabled || this.ctx.disabled) return
      const keys = this.keysToTransfer(item)
      if (!keys.length) return
      if (this.side === 'left') this.ctx.moveRight(keys)
      else if (!this.ctx.oneWay) this.ctx.moveLeft(keys)
      return
    }

    // Alt+Arrow transfers without reaching for the button strip.
    if (e.key === 'ArrowRight' && e.altKey && this.side === 'left') {
      e.preventDefault()
      if (item.disabled || this.ctx.disabled) return
      const keys = this.keysToTransfer(item)
      if (keys.length) this.ctx.moveRight(keys)
      return
    }
    if (e.key === 'ArrowLeft' && e.altKey && this.side === 'right' && !this.ctx.oneWay) {
      e.preventDefault()
      if (item.disabled || this.ctx.disabled) return
      const keys = this.keysToTransfer(item)
      if (keys.length) this.ctx.moveLeft(keys)
      return
    }

    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    if (item.disabled || this.ctx.disabled) return
    if (this.ctx.selectable) {
      this.toggleItem(item, !this.isSelected(item))
      return
    }
    // Keyboard without modifiers: toggle single-item selection (desktop replace).
    this.selectedChange.emit(this.isSelected(item) && this.selected.length === 1 ? [] : [item.key])
    this.lastAnchor = item.key
  }

  handleSearch(v: string): void {
    this.query.set(v)
    this.page.set(1)
    this.search.emit(v)
  }

  prevPage(): void {
    if (this.page() > 1) this.page.update((p) => p - 1)
  }

  nextPage(): void {
    if (this.page() < this.totalPages) this.page.update((p) => p + 1)
  }

  // ----- DnD -----

  get isDropTarget(): boolean {
    const p = this.ctx.dragPayload()
    if (!p) return false
    // left list rejects drops when oneWay; left -> left is a no-op (parent owns dataSource order)
    if (this.side === 'left' && this.ctx.oneWay && p.fromSide === 'right') return false
    if (this.side === 'left' && p.fromSide === 'left') return false
    return true
  }

  onItemDragStart(e: DragEvent, item: TransferItem): void {
    if (!this.ctx.draggable || item.disabled || this.ctx.disabled) {
      e.preventDefault()
      return
    }
    // Dragging a selected row drags the whole selection; otherwise just this row.
    const keys = this.isSelected(item)
      ? this.selected.filter((k) => {
          const i = this.items.find((x) => x.key === k)
          return i && !i.disabled
        })
      : [item.key]
    this.draggingKeys.set(new Set(keys))
    this.ctx.startDrag({ keys, fromSide: this.side })
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      // Required by Firefox to actually start the drag.
      try {
        e.dataTransfer.setData('text/plain', keys.join(','))
      } catch {
        /* noop */
      }
    }
  }

  onItemDragEnd(): void {
    this.draggingKeys.set(new Set())
    this.dropIndicator.set(null)
    this.ctx.endDrag()
  }

  onItemDragOver(e: DragEvent, item: TransferItem): void {
    if (!this.isDropTarget) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    // left list: no insertion indicator, drop just removes from target
    if (this.side !== 'right') return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const after = e.clientY > rect.top + rect.height / 2
    this.dropIndicator.set({ key: item.key, position: after ? 'after' : 'before' })
  }

  onItemDrop(e: DragEvent, item: TransferItem): void {
    if (!this.isDropTarget) return
    e.preventDefault()
    e.stopPropagation()
    if (this.side === 'right') {
      const after = this.dropIndicator()?.position === 'after'
      const idx = this.items.findIndex((x) => x.key === item.key)
      const beforeKey = after ? (this.items[idx + 1]?.key ?? null) : item.key
      this.ctx.drop('right', beforeKey)
    } else {
      this.ctx.drop('left', null)
    }
    this.dropIndicator.set(null)
  }

  onListDragOver(e: DragEvent): void {
    if (!this.isDropTarget) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  }

  onListDrop(e: DragEvent): void {
    if (!this.isDropTarget) return
    e.preventDefault()
    // Empty zone or below all items -> append (right) / remove (left).
    this.ctx.drop(this.side, null)
    this.dropIndicator.set(null)
  }

  onListDragLeave(e: DragEvent): void {
    // Clear the indicator only when leaving the list container, not when crossing rows.
    const related = e.relatedTarget as Node | null
    const current = e.currentTarget as Node
    if (!related || !current.contains(related)) this.dropIndicator.set(null)
  }
}

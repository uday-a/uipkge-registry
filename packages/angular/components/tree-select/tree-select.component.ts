import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiPopoverComponent,
  UiPopoverContentComponent,
  UiPopoverTriggerComponent,
} from '@/ui/popover/popover.component'
import { treeSelectTriggerVariants } from './tree-select.variants'
import { UiTreeSelectNodeComponent } from './tree-select-node.component'
import type { TreeSelectNode as TreeNode } from './types'

export type TreeSelectValue = string | string[] | null
export type TreeSelectSize = 'sm' | 'default' | 'lg'

function collectAllExpandable(nodes: TreeNode[]): string[] {
  const ids: string[] = []
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      if (n.children?.length) {
        ids.push(n.value)
        walk(n.children)
      }
    }
  }
  walk(nodes)
  return ids
}

function findNode(nodes: TreeNode[], value: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.value === value) return n
    if (n.children) {
      const found = findNode(n.children, value)
      if (found) return found
    }
  }
  return undefined
}

function findLabels(nodes: TreeNode[], values: string[]): string[] {
  return values.map((v) => findNode(nodes, v)?.label ?? v)
}

function collectLeafValues(node: TreeNode): string[] {
  if (!node.children?.length) return [node.value]
  const vals: string[] = []
  for (const c of node.children) vals.push(...collectLeafValues(c))
  return vals
}

/**
 * Angular port of UIPKGE TreeSelect, 1:1 with the React component: a Popover whose trigger
 * is a combobox button (label, or up to three labels + "+N" in multiple mode) and whose
 * content is a searchable role=tree of TreeSelectNode rows. Single mode commits and closes;
 * multiple mode shows checkboxes, a parent toggles all its leaf descendants, and a footer
 * shows "N selected / Clear all". Searching keeps matches plus their ancestors and expands
 * those ancestors. `value` / `defaultValue` / `valueChange` work controlled or uncontrolled.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tree-select, [ui-tree-select]',
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverTriggerComponent, UiPopoverContentComponent, UiTreeSelectNodeComponent],
  // Block (not `contents`) so parent spacing utilities reach it like React's trigger button.
  host: { '[class]': '"block"' },
  template: `
    <ui-popover [open]="isOpen()" (openChange)="setOpen($event)">
      <button
        #triggerEl
        ui-popover-trigger
        type="button"
        role="combobox"
        [disabled]="disabled || loading"
        data-uipkge=""
        data-slot="tree-select"
        [class]="triggerClasses"
      >
        <span [class]="labelClass">{{ displayLabel }}</span>
        <span class="flex shrink-0 items-center gap-1">
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
              class="lucide lucide-loader-circle text-muted-foreground size-4 animate-spin"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          } @else if (clearable && hasValue && !disabled) {
            <span
              role="button"
              tabindex="0"
              aria-label="Clear"
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-4 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              (click)="clearAll($event)"
              (keydown)="onClearKeydown($event)"
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
                class="lucide lucide-x size-4"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </span>
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
              [attr.class]="chevronClass"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          }
        </span>
      </button>

      <ui-popover-content class="p-0" align="start" [sideOffset]="4" (openAutoFocus)="onPanelOpen()">
        <div #body class="flex max-h-80 flex-col">
          @if (searchable) {
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
                  class="lucide lucide-search text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                <input
                  [value]="search()"
                  (input)="onSearch($any($event.target).value)"
                  [placeholder]="searchPlaceholder"
                  aria-label="Search tree"
                  class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                />
              </div>
            </div>
          }

          @if (loading) {
            <div class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
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
                class="lucide lucide-loader-circle size-4 animate-spin"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Loading...
            </div>
          } @else if (data.length === 0 || (filteredIds() && filteredIds()!.size === 0)) {
            <div class="text-muted-foreground py-6 text-center text-sm">{{ emptyText }}</div>
          } @else {
            <div class="flex-1 overflow-y-auto p-1" role="tree">
              @for (node of data; track node.value) {
                @if (!filteredIds() || filteredIds()!.has(node.value)) {
                  <div
                    ui-tree-select-node
                    [node]="node"
                    [depth]="0"
                    [multiple]="multiple"
                    [expandedIds]="expandedIds()"
                    [selectedValues]="selectedValues"
                    [filteredIds]="filteredIds()"
                    (toggle)="toggleNode($event)"
                    (select)="selectNode($event)"
                  ></div>
                }
              }
            </div>
          }

          @if (multiple && selectedCount > 0) {
            <div class="flex items-center justify-between border-t px-2 py-1.5 text-xs">
              <span class="text-muted-foreground">{{ selectedCount }} selected</span>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded focus-visible:ring-2 focus-visible:outline-none"
                (click)="clearAll()"
              >
                Clear all
              </button>
            </div>
          }
        </div>
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiTreeSelectComponent implements OnChanges, AfterViewInit {
  /** Controlled value (pair with `valueChange`). Leave unset for uncontrolled use. */
  @Input() value?: TreeSelectValue
  @Input() defaultValue?: TreeSelectValue
  @Input() data: TreeNode[] = []
  @Input({ transform: booleanAttribute }) multiple = false
  @Input() placeholder = 'Select...'
  @Input({ transform: booleanAttribute }) searchable = true
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) loading = false
  @Input({ transform: booleanAttribute }) clearable = true
  @Input({ transform: booleanAttribute }) defaultExpandAll = false
  @Input() size: TreeSelectSize = 'default'
  @Input() emptyText = 'No results found.'
  @Input() searchPlaceholder = 'Search...'
  @Input('class') className?: string

  /** React `onValueChange`. */
  @Output() valueChange = new EventEmitter<TreeSelectValue>()
  /** React `onChange`. */
  @Output() change = new EventEmitter<TreeSelectValue>()
  /** React `onSelect(node)`. */
  @Output() select = new EventEmitter<TreeNode>()
  /** React `onClear`. */
  @Output() clear = new EventEmitter<void>()

  @ViewChild('triggerEl', { static: true }) private triggerEl?: ElementRef<HTMLButtonElement>
  @ViewChild('body', { static: true }) private body?: ElementRef<HTMLElement>

  readonly isOpen = signal(false)
  readonly search = signal('')
  readonly expandedIds = signal<Set<string>>(new Set())
  private readonly internalValue = signal<TreeSelectValue | undefined>(undefined)

  ngOnChanges(changes: SimpleChanges): void {
    // Re-collect expandable nodes when defaultExpandAll toggles or data changes.
    if ((changes['defaultExpandAll'] || changes['data']) && this.defaultExpandAll) {
      this.expandedIds.set(new Set(collectAllExpandable(this.data)))
    }
  }

  ngAfterViewInit(): void {
    // Radix Slot: the child's data-slot wins over PopoverTrigger's (Angular host bindings would win).
    this.triggerEl?.nativeElement.setAttribute('data-slot', 'tree-select')
  }

  get currentValue(): TreeSelectValue {
    if (this.value !== undefined) return this.value
    const v = this.internalValue()
    return v === undefined ? (this.defaultValue ?? null) : v
  }

  setOpen(open: boolean): void {
    this.isOpen.set(open)
    // Clear search when the popover closes.
    if (!open) this.search.set('')
  }

  /** Content width tracks the trigger (React passes `style` to PopoverContent). */
  onPanelOpen(): void {
    const panel = this.body?.nativeElement.parentElement
    if (panel) panel.style.width = 'var(--radix-popover-trigger-width)'
  }

  get selectedValues(): Set<string> {
    const v = this.currentValue
    if (v == null) return new Set()
    return new Set(Array.isArray(v) ? v : [v])
  }

  get selectedCount(): number {
    const v = this.currentValue
    return Array.isArray(v) ? v.length : 0
  }

  get displayLabel(): string {
    const v = this.currentValue
    if (this.multiple) {
      const vals = Array.isArray(v) ? v : []
      if (vals.length === 0) return this.placeholder
      const labels = findLabels(this.data, vals)
      if (labels.length <= 3) return labels.join(', ')
      return `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`
    }
    if (v == null) return this.placeholder
    return findNode(this.data, v as string)?.label ?? String(v)
  }

  get hasValue(): boolean {
    const v = this.currentValue
    if (this.multiple) return Array.isArray(v) && v.length > 0
    return v != null
  }

  /** Search: a node is visible if it or any descendant matches. */
  filteredIds(): Set<string> | null {
    const q = this.search().trim().toLowerCase()
    if (!q) return null
    const visible = new Set<string>()
    const walk = (nodes: TreeNode[]): boolean => {
      let anyMatch = false
      for (const n of nodes) {
        const selfMatch = n.label.toLowerCase().includes(q)
        const childMatch = n.children?.length ? walk(n.children) : false
        if (selfMatch || childMatch) {
          visible.add(n.value)
          anyMatch = true
        }
      }
      return anyMatch
    }
    walk(this.data)
    return visible
  }

  onSearch(value: string): void {
    this.search.set(value)
    // Auto-expand ancestors of search matches (React does this in an effect).
    const q = value.trim().toLowerCase()
    if (!q) return
    const next = new Set(this.expandedIds())
    let changed = false
    const walk = (nodes: TreeNode[]): boolean => {
      let anyMatch = false
      for (const n of nodes) {
        const selfMatch = n.label.toLowerCase().includes(q)
        const childMatch = n.children?.length ? walk(n.children) : false
        if (selfMatch || childMatch) {
          anyMatch = true
          if (childMatch && !next.has(n.value)) {
            next.add(n.value)
            changed = true
          }
        }
      }
      return anyMatch
    }
    walk(this.data)
    if (changed) this.expandedIds.set(next)
  }

  private commit(next: TreeSelectValue): void {
    if (this.value === undefined) this.internalValue.set(next)
    this.valueChange.emit(next)
    this.change.emit(next)
  }

  toggleNode(node: TreeNode): void {
    if (node.disabled) return
    const next = new Set(this.expandedIds())
    if (next.has(node.value)) next.delete(node.value)
    else next.add(node.value)
    this.expandedIds.set(next)
  }

  selectNode(node: TreeNode): void {
    if (node.disabled) return
    if (!this.multiple) {
      this.commit(node.value)
      this.select.emit(node)
      this.setOpen(false)
      return
    }
    // Multi-select: toggle. For parent nodes, toggle all leaf descendants.
    const v = this.currentValue
    const current = Array.isArray(v) ? [...v] : []
    const leaves = collectLeafValues(node)
    const allSelected = leaves.every((l) => current.includes(l))
    const next = allSelected
      ? current.filter((l) => !leaves.includes(l))
      : [...current, ...leaves.filter((l) => !current.includes(l))]
    this.commit(next)
    this.select.emit(node)
  }

  clearAll(event?: Event): void {
    event?.stopPropagation()
    if (this.disabled) return
    this.clear.emit()
    this.commit(this.multiple ? [] : null)
  }

  onClearKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.clearAll(e)
    }
  }

  get triggerClasses(): string {
    return cn(treeSelectTriggerVariants({ size: this.size }), this.className)
  }

  get labelClass(): string {
    return cn('flex-1 truncate text-left', this.hasValue ? 'text-foreground' : 'text-muted-foreground')
  }

  get chevronClass(): string {
    return cn(
      'lucide lucide-chevron-down',
      'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
      this.isOpen() && 'rotate-180',
    )
  }
}

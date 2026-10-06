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
/** Anything that can announce to screen readers — @angular/cdk's LiveAnnouncer fits, without depending on the CDK. */
export interface Announcer {
  announce(message: string): unknown
}
import { cn } from '@/lib/utils'

export interface TreeViewItem {
  id: string
  label: string
  icon?: string | any
  disabled?: boolean
  selected?: boolean
  children?: TreeViewItem[]
  [key: string]: unknown
}

const INDENT = 20

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tree-view-node, [ui-tree-view-node]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"tree-view-node"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"treeitem"',
    '[attr.aria-expanded]': 'hasChildren ? isExpanded : null',
    '[attr.aria-selected]': 'isSelected',
    class: 'relative block',
  },
  template: `
    @if (depth > 0) {
      <span
        aria-hidden="true"
        class="border-border pointer-events-none absolute top-0 h-4 w-3 rounded-bl-md border-b border-l"
        [style.left]="connectorLeft"
      ></span>
    }
    @if (depth > 0 && !isLast) {
      <span
        aria-hidden="true"
        class="bg-border pointer-events-none absolute top-4 bottom-0 w-px"
        [style.left]="connectorLeft"
      ></span>
    }

    <div
      data-tree-row
      [attr.data-tree-id]="item?.id"
      [attr.data-tree-parent]="parentId"
      [attr.data-disabled]="item?.disabled ? 'true' : null"
      [class]="rowClass"
      [style.padding-left]="rowPadLeft"
      [tabindex]="item?.disabled ? -1 : 0"
      (click)="handleSelect()"
      (keydown)="handleRowKeydown($event)"
    >
      @if (hasChildren) {
        <button
          type="button"
          class="focus-visible:ring-ring hover:bg-foreground/10 flex size-4 shrink-0 items-center justify-center rounded transition-transform duration-150 focus-visible:ring-2 focus-visible:outline-none"
          [class.rotate-90]="isExpanded"
          [attr.aria-label]="isExpanded ? 'Collapse' : 'Expand'"
          tabindex="-1"
          (click)="handleToggle($event)"
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
            class="text-muted-foreground size-3.5"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      } @else {
        <span class="size-4 shrink-0"></span>
      }

      @if (tree?.showCheckboxes) {
        <input
          type="checkbox"
          [checked]="isSelected"
          [disabled]="item?.disabled"
          [attr.aria-label]="item?.label"
          class="border-input bg-background text-primary focus:ring-ring focus-visible:ring-ring size-3.5 shrink-0 rounded focus:ring-1 focus-visible:ring-2 focus-visible:outline-none"
          (change)="handleSelect()"
          (click)="$event.stopPropagation()"
        />
      }

      @if (tree?.showIcons) {
        @switch (iconType) {
          @case ('folder') {
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
              class="text-primary size-4 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
              />
            </svg>
          }
          @case ('folder-open') {
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
              class="text-primary size-4 shrink-0"
              aria-hidden="true"
            >
              <path
                d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
              />
            </svg>
          }
          @case ('file-code') {
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
              class="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M10 12.5 8 15l2 2.5" />
              <path d="m14 12.5 2 2.5-2 2.5" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
            </svg>
          }
          @case ('file-text') {
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
              class="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
          }
          @case ('hash') {
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
              class="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="9" y2="9" />
              <line x1="4" x2="20" y1="15" y2="15" />
              <line x1="10" x2="8" y1="3" y2="21" />
              <line x1="16" x2="14" y1="3" y2="21" />
            </svg>
          }
          @case ('user') {
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
              class="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          @case ('settings') {
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
              class="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          @default {
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
              class="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
          }
        }
      }

      <span class="flex-1 truncate">{{ item?.label }}</span>
    </div>

    @if (hasChildren && isExpanded) {
      <div role="group">
        @for (child of item!.children!; track child.id; let j = $index) {
          <ui-tree-view-node
            [item]="child"
            [depth]="depth + 1"
            [parentId]="item?.id"
            [isLast]="j === (item!.children?.length ?? 0) - 1"
            [tree]="tree"
          />
        }
      </div>
    }
  `,
})
export class UiTreeViewNodeComponent {
  @Input() item?: TreeViewItem
  @Input() depth = 0
  @Input() parentId: string | null | undefined = null
  @Input({ transform: booleanAttribute }) isLast = false
  @Input() tree?: UiTreeViewComponent

  // Backwards compat inputs
  @Input({ transform: booleanAttribute }) expanded = false
  @Input({ transform: booleanAttribute }) selected = false
  @Input('class') className?: string

  get hasChildren(): boolean {
    return !!(this.item?.children && this.item.children.length)
  }

  get isExpanded(): boolean {
    if (this.tree && this.item) return this.tree.isExpanded(this.item.id)
    return this.expanded
  }

  get isSelected(): boolean {
    if (this.tree && this.item) return this.tree.isSelected(this.item.id)
    return this.selected
  }

  get rowPadLeft(): string {
    return `${this.depth * INDENT + 4}px`
  }

  get connectorLeft(): string {
    return `${(this.depth - 1) * INDENT + 10}px`
  }

  get iconType(): string {
    if (!this.item) return 'file'
    const ic = typeof this.item.icon === 'string' ? this.item.icon.toLowerCase() : ''
    if (ic.includes('code')) return 'file-code'
    if (ic.includes('text')) return 'file-text'
    if (ic.includes('hash')) return 'hash'
    if (ic.includes('user')) return 'user'
    if (ic.includes('setting')) return 'settings'
    if (ic.includes('folder')) {
      return this.isExpanded ? 'folder-open' : 'folder'
    }
    if (this.hasChildren) {
      return this.isExpanded ? 'folder-open' : 'folder'
    }
    return 'file'
  }

  get rowClass(): string {
    return cn(
      'group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
      this.item?.disabled && 'cursor-not-allowed opacity-50',
      this.isSelected && 'bg-accent text-accent-foreground font-medium',
      this.className,
    )
  }

  get hostClass(): string {
    return cn(
      'flex items-center gap-1.5 rounded-md px-2 py-1.5',
      this.selected && 'bg-accent text-accent-foreground',
      this.className,
    )
  }

  indentStyle(indent = 20): Record<string, string> {
    return { 'padding-left': `${this.depth * indent + 8}px` }
  }

  handleToggle(e?: MouseEvent): void {
    e?.stopPropagation()
    if (this.tree && this.item) {
      this.tree.toggleItem(this.item)
    }
  }

  handleSelect(): void {
    if (this.item?.disabled) return
    if (this.tree && this.item) {
      this.tree.selectItem(this.item)
    }
  }

  handleRowKeydown(e: KeyboardEvent): void {
    if (this.item?.disabled) return
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.handleSelect()
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (this.hasChildren && !this.isExpanded) {
        this.handleToggle()
      } else if (this.hasChildren && this.isExpanded) {
        const tree = target.closest('[role="tree"]')
        const rows = tree
          ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]:not([data-disabled="true"])'))
          : []
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) rows[idx + 1]?.focus()
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (this.hasChildren && this.isExpanded) {
        this.handleToggle()
      } else if (this.parentId) {
        const tree = target.closest('[role="tree"]')
        const parent = tree?.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(this.parentId)}"]`)
        parent?.focus()
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const tree = target.closest('[role="tree"]')
      const rows = tree
        ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]:not([data-disabled="true"])'))
        : []
      const idx = rows.indexOf(target)
      if (idx < 0) return
      const next = e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1]
      next?.focus()
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      const tree = target.closest('[role="tree"]')
      const rows = tree
        ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]:not([data-disabled="true"])'))
        : []
      rows[0]?.focus()
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      const tree = target.closest('[role="tree"]')
      const rows = tree
        ? Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]:not([data-disabled="true"])'))
        : []
      rows[rows.length - 1]?.focus()
    }
  }
}

/**
 * Angular port of UIPKGE TreeView. Expandable hierarchical tree
 * with continuous Discord-style elbow connectors, optional checkboxes,
 * icons, keyboard navigation, and 1:1 React parity.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tree-view, [ui-tree-view]',
  standalone: true,
  imports: [UiTreeViewNodeComponent],
  host: {
    '[attr.data-slot]': '"tree-view"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"tree"',
    '[class]': 'hostClass',
  },
  template: `
    @for (item of items; track item.id; let i = $index) {
      <ui-tree-view-node [item]="item" [depth]="0" [isLast]="i === items.length - 1" [tree]="this" />
    }
    <ng-content />
  `,
})
export class UiTreeViewComponent implements OnInit, OnChanges {
  @Input() items: TreeViewItem[] = []
  @Input({ transform: booleanAttribute }) showIcons = true
  @Input({ transform: booleanAttribute }) showCheckboxes = false
  @Input({ transform: booleanAttribute }) defaultExpanded = false
  @Input() selectedId: string | null = null
  @Input('class') className?: string

  @Output() select = new EventEmitter<TreeViewItem>()
  @Output() toggle = new EventEmitter<TreeViewItem>()
  @Output() selectedIdChange = new EventEmitter<string | null>()

  announcer?: Announcer

  expandedIds = new Set<string>()
  checkedIds = new Set<string>()
  private initialized = false

  get hostClass(): string {
    return cn('text-sm block', this.className)
  }

  ngOnInit(): void {
    this.ensureInit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['defaultExpanded']) {
      this.initialized = false
      this.ensureInit()
    }
  }

  private ensureInit(): void {
    if (this.initialized) return
    this.initialized = true
    if (this.defaultExpanded) {
      const ids = new Set<string>()
      const walk = (list: TreeViewItem[]) => {
        for (const i of list) {
          if (i.children?.length) {
            ids.add(i.id)
            walk(i.children)
          }
        }
      }
      walk(this.items)
      this.expandedIds = ids
    }
  }

  isExpanded(id: string): boolean {
    this.ensureInit()
    return this.expandedIds.has(id)
  }

  isSelected(id: string): boolean {
    return this.selectedId === id
  }

  toggleItem(item: TreeViewItem): void {
    if (item.disabled) return
    this.ensureInit()
    const next = new Set(this.expandedIds)
    if (next.has(item.id)) next.delete(item.id)
    else next.add(item.id)
    this.expandedIds = next
    this.toggle.emit(item)
  }

  selectItem(item: TreeViewItem): void {
    if (item.disabled) return
    this.selectedId = item.id
    this.selectedIdChange.emit(item.id)
    this.select.emit(item)
    try {
      this.announcer?.announce(item.label)
    } catch {
      /* announcer optional */
    }
  }

  toggleCheck(item: TreeViewItem): void {
    if (item.disabled) return
    const next = new Set(this.checkedIds)
    if (next.has(item.id)) next.delete(item.id)
    else next.add(item.id)
    this.checkedIds = next
  }

  onKeydown(event: KeyboardEvent, item: TreeViewItem, hasChildren: boolean): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.selectItem(item)
    } else if (event.key === 'ArrowRight' && hasChildren && !this.isExpanded(item.id)) {
      event.preventDefault()
      this.toggleItem(item)
    } else if (event.key === 'ArrowLeft' && this.isExpanded(item.id)) {
      event.preventDefault()
      this.toggleItem(item)
    }
  }
}

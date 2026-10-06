import {
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import type { TreeSelectNode as TreeSelectNodeData } from './types'

function collectValues(node: TreeSelectNodeData): string[] {
  const vals: string[] = []
  const walk = (n: TreeSelectNodeData) => {
    if (n.children?.length) for (const c of n.children) walk(c)
    else vals.push(n.value)
  }
  walk(node)
  return vals
}

function getTreeRows(from: HTMLElement): HTMLElement[] {
  const tree = from.closest('[role="tree"]')
  if (!tree) return []
  return Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]:not([data-disabled="true"])'))
}

function focusRow(row: HTMLElement | null | undefined): void {
  row?.focus()
}

/**
 * One TreeSelect row (React `TreeSelectNode`): a role=treeitem wrapper holding the focusable
 * row (expand chevron, optional checkbox with indeterminate state, label) and, when expanded,
 * a role=group of child rows. Arrow keys / Home / End move focus between visible rows,
 * ArrowRight / ArrowLeft expand, collapse or jump to the parent, Enter / Space select.
 * Put it on a div: `<div ui-tree-select-node [node]="...">` (React renders a div).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tree-select-node, [ui-tree-select-node]',
  standalone: true,
  // Recursive: child rows are this component.
  imports: [forwardRef(() => UiTreeSelectNodeComponent)],
  host: {
    role: 'treeitem',
    '[class]': '"block"',
    '[attr.aria-expanded]': 'hasChildren ? isExpanded : null',
    '[attr.aria-selected]': 'isSelected',
  },
  template: `
    <div
      data-tree-row=""
      [attr.data-tree-id]="node.value"
      [attr.data-tree-parent]="parentValue ?? null"
      [attr.data-disabled]="node.disabled ? 'true' : null"
      [class]="rowClass"
      [style.padding-left]="indent"
      [attr.tabindex]="node.disabled ? -1 : 0"
      (click)="handleSelect()"
      (keydown)="handleRowKeydown($event)"
    >
      @if (hasChildren) {
        <button
          type="button"
          [class]="toggleClass"
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
            class="lucide lucide-chevron-right text-muted-foreground size-3.5"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      } @else {
        <span class="size-4 shrink-0"></span>
      }

      @if (multiple) {
        <input
          type="checkbox"
          [checked]="isFullyChecked || isChecked"
          [indeterminate]="isChecked && !isFullyChecked"
          [disabled]="!!node.disabled"
          class="border-input text-primary focus:ring-ring size-3.5 shrink-0 rounded focus:ring-1"
          (change)="handleCheckboxChange($event)"
          (click)="$event.stopPropagation()"
        />
      }

      <span class="flex-1 truncate">{{ node.label }}</span>
    </div>

    @if (hasChildren && isExpanded) {
      <div role="group">
        @for (child of node.children; track child.value) {
          @if (!filteredIds || filteredIds.has(child.value)) {
            <div
              ui-tree-select-node
              [node]="child"
              [depth]="depth + 1"
              [multiple]="multiple"
              [expandedIds]="expandedIds"
              [selectedValues]="selectedValues"
              [filteredIds]="filteredIds"
              [parentValue]="node.value"
              (toggle)="toggle.emit($event)"
              (select)="select.emit($event)"
            ></div>
          }
        }
      </div>
    }
  `,
})
export class UiTreeSelectNodeComponent {
  @Input() node: TreeSelectNodeData = { value: '', label: '' }
  @Input() depth = 0
  @Input({ transform: booleanAttribute }) multiple = false
  @Input() expandedIds: Set<string> = new Set()
  @Input() selectedValues: Set<string> = new Set()
  @Input() filteredIds: Set<string> | null = null
  @Input() parentValue: string | null = null
  /** React `onToggle(node)`. */
  @Output() toggle = new EventEmitter<TreeSelectNodeData>()
  /** React `onSelect(node)`. */
  @Output() select = new EventEmitter<TreeSelectNodeData>()

  get hasChildren(): boolean {
    return !!this.node.children?.length
  }

  get isExpanded(): boolean {
    return this.expandedIds.has(this.node.value)
  }

  /** Partially checked (some but not all leaf descendants), or selected in single mode. */
  get isChecked(): boolean {
    if (!this.multiple) return this.selectedValues.has(this.node.value)
    if (this.selectedValues.has(this.node.value)) return true
    if (!this.hasChildren) return false
    const descendants = collectValues(this.node)
    const selected = descendants.filter((v) => this.selectedValues.has(v))
    return selected.length > 0 && selected.length < descendants.length
  }

  get isFullyChecked(): boolean {
    if (!this.multiple) return false
    if (this.selectedValues.has(this.node.value)) return true
    if (!this.hasChildren) return false
    const descendants = collectValues(this.node)
    return descendants.length > 0 && descendants.every((v) => this.selectedValues.has(v))
  }

  get isSelected(): boolean {
    return !this.multiple ? this.selectedValues.has(this.node.value) : this.isFullyChecked || this.isChecked
  }

  get indent(): string {
    return `${this.depth * 20 + 8}px`
  }

  get rowClass(): string {
    return cn(
      'group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
      this.node.disabled && 'cursor-not-allowed opacity-50',
      !this.multiple && this.selectedValues.has(this.node.value) && 'bg-accent text-accent-foreground font-medium',
    )
  }

  get toggleClass(): string {
    return cn(
      'focus-visible:ring-ring flex size-4 shrink-0 items-center justify-center rounded transition-transform duration-150 focus-visible:ring-2 focus-visible:outline-none',
      'hover:bg-foreground/10',
      this.isExpanded && 'rotate-90',
    )
  }

  handleToggle(e: Event): void {
    e.stopPropagation()
    this.toggle.emit(this.node)
  }

  handleSelect(): void {
    if (this.node.disabled) return
    this.select.emit(this.node)
  }

  handleCheckboxChange(e: Event): void {
    e.stopPropagation()
    if (this.node.disabled) return
    this.select.emit(this.node)
  }

  handleRowKeydown(e: KeyboardEvent): void {
    if (this.node.disabled) return
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.handleSelect()
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (this.hasChildren && !this.isExpanded) {
        this.toggle.emit(this.node)
      } else if (this.hasChildren && this.isExpanded) {
        const rows = getTreeRows(target)
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (this.hasChildren && this.isExpanded) {
        this.toggle.emit(this.node)
      } else if (this.parentValue) {
        const tree = target.closest('[role="tree"]')
        focusRow(tree?.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(this.parentValue)}"]`))
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const rows = getTreeRows(target)
      const idx = rows.indexOf(target)
      if (idx < 0) return
      focusRow(e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1])
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      focusRow(getTreeRows(target)[0])
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      const rows = getTreeRows(target)
      focusRow(rows[rows.length - 1])
    }
  }
}

import { LitElement, css, html, nothing } from 'lit'
import { ChevronRight, File, Folder, FolderOpen } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export interface TreeViewItem {
  id: string
  label: string
  icon?: any
  disabled?: boolean
  selected?: boolean
  children?: TreeViewItem[]
}

/**
 * <uip-tree-view> — Hierarchical tree navigation with continuous guide lines,
 * checkboxes, custom icons, and keyboard navigation.
 */
export class UipTreeView extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  static properties = {
    items: { type: Array, attribute: false },
    showIcons: {
      type: Boolean,
      attribute: 'show-icons',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    showCheckboxes: { type: Boolean, attribute: 'show-checkboxes' },
    defaultExpanded: { type: Boolean, attribute: 'default-expanded' },
    selectedId: { type: String, attribute: 'selected-id' },
    expandedIds: { state: true },
  }

  items: TreeViewItem[] = []
  showIcons = true
  showCheckboxes = false
  defaultExpanded = false
  selectedId: string | null = null

  expandedIds = new Set<string>()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'tree-view')
    this.setAttribute('role', 'tree')
    if (this.defaultExpanded) {
      this.expandAll()
    }
  }

  private collectExpandable(items: TreeViewItem[], acc: Set<string>) {
    for (const it of items) {
      if (it.children?.length) {
        acc.add(it.id)
        this.collectExpandable(it.children, acc)
      }
    }
  }

  expandAll() {
    const next = new Set<string>()
    this.collectExpandable(this.items, next)
    this.expandedIds = next
  }

  collapseAll() {
    this.expandedIds = new Set()
  }

  private toggle(item: TreeViewItem) {
    if (item.disabled) return
    const next = new Set(this.expandedIds)
    if (next.has(item.id)) next.delete(item.id)
    else next.add(item.id)
    this.expandedIds = next
    this.dispatchEvent(new CustomEvent('toggle', { detail: { item }, bubbles: true, composed: true }))
  }

  private select(item: TreeViewItem) {
    if (item.disabled) return
    this.selectedId = item.id
    this.dispatchEvent(new CustomEvent('select', { detail: { item }, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('selected-id-change', { detail: { id: item.id }, bubbles: true, composed: true }))
    this.requestUpdate()
  }

  private renderNode(item: TreeViewItem, depth = 0, isLast = false): unknown {
    const hasChildren = Boolean(item.children && item.children.length > 0)
    const isExpanded = this.expandedIds.has(item.id)
    const isSelected = this.selectedId === item.id || item.selected

    // Icon resolution
    let nodeIcon = item.icon
    if (!nodeIcon) {
      if (hasChildren) {
        nodeIcon = isExpanded ? FolderOpen : Folder
      } else {
        nodeIcon = File
      }
    }

    return html`
      <div class="relative flex flex-col select-none" role="treeitem" aria-expanded=${hasChildren ? (isExpanded ? 'true' : 'false') : nothing}>
        <div
          class=${cn(
            'group hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors cursor-pointer',
            isSelected && 'bg-accent text-accent-foreground font-medium',
            item.disabled && 'cursor-not-allowed opacity-50',
          )}
          style="padding-left: ${depth * 16 + 8}px;"
          @click=${() => (hasChildren ? this.toggle(item) : this.select(item))}
        >
          <!-- Expand Chevron -->
          ${hasChildren
            ? html`
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground -ml-1 flex size-5 items-center justify-center rounded p-0.5 transition-transform"
                  aria-label="Toggle node"
                  @click=${(e: Event) => {
                    e.stopPropagation()
                    this.toggle(item)
                  }}
                >
                  <span class=${cn('transition-transform duration-150 inline-block', isExpanded && 'rotate-90')}>
                    ${icon(ChevronRight, 'chevron-right', 'size-3.5')}
                  </span>
                </button>
              `
            : html`<span class="size-4 shrink-0"></span>`}

          <!-- Checkbox -->
          ${this.showCheckboxes
            ? html`
                <input
                  type="checkbox"
                  class="rounded border-input text-primary focus:ring-ring size-3.5"
                  .checked=${Boolean(isSelected)}
                  ?disabled=${item.disabled}
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${() => this.select(item)}
                />
              `
            : nothing}

          <!-- Icon -->
          ${this.showIcons && nodeIcon
            ? html`
                <span class="text-muted-foreground group-hover:text-foreground shrink-0">
                  ${typeof nodeIcon === 'function' || Array.isArray(nodeIcon)
                    ? icon(nodeIcon, 'node-icon', 'size-4')
                    : nothing}
                </span>
              `
            : nothing}

          <!-- Label -->
          <span class="truncate" @click=${(e: Event) => {
            e.stopPropagation()
            this.select(item)
          }}>${item.label}</span>
        </div>

        <!-- Children with elbow line -->
        ${hasChildren && isExpanded
          ? html`
              <div class="relative flex flex-col">
                <div
                  class="border-border/60 absolute left-0 top-0 bottom-2 border-l"
                  style="left: ${depth * 16 + 17}px;"
                ></div>
                ${item.children!.map((child, i) =>
                  this.renderNode(child, depth + 1, i === item.children!.length - 1),
                )}
              </div>
            `
          : nothing}
      </div>
    `
  }

  render() {
    return html`
      <div part="base" class="text-sm">
        ${this.items.map((item, i) => this.renderNode(item, 0, i === this.items.length - 1))}
      </div>
    `
  }
}

customElements.get('uip-tree-view') || customElements.define('uip-tree-view', UipTreeView)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tree-view': UipTreeView
  }
}

import { LitElement, css, html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChevronDown, ChevronRight, Loader2, Search, X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { computePosition } from '../../lib/position'
import { treeSelectTriggerVariants } from './tree-select.variants'

export interface TreeSelectNode {
  value: string
  label: string
  disabled?: boolean
  children?: TreeSelectNode[]
  [key: string]: unknown
}

function collectAllExpandable(nodes: TreeSelectNode[]): string[] {
  const ids: string[] = []
  const walk = (list: TreeSelectNode[]) => {
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

function findNode(nodes: TreeSelectNode[], value: string): TreeSelectNode | undefined {
  for (const n of nodes) {
    if (n.value === value) return n
    if (n.children) {
      const found = findNode(n.children, value)
      if (found) return found
    }
  }
  return undefined
}

function findLabels(nodes: TreeSelectNode[], values: string[]): string[] {
  return values.map((v) => findNode(nodes, v)?.label ?? v)
}

function collectLeafValues(node: TreeSelectNode): string[] {
  if (!node.children?.length) return [node.value]
  const vals: string[] = []
  for (const c of node.children) vals.push(...collectLeafValues(c))
  return vals
}

function collectValues(node: TreeSelectNode): string[] {
  const vals: string[] = []
  const walk = (n: TreeSelectNode) => {
    if (n.children?.length) {
      for (const c of n.children) walk(c)
    } else {
      vals.push(n.value)
    }
  }
  walk(node)
  return vals
}

const jsonConverter = {
  fromAttribute: (v: string | null) => {
    if (!v) return undefined
    try {
      return JSON.parse(v)
    } catch {
      return v
    }
  },
  toAttribute: (v: unknown) => (v ? (typeof v === 'string' ? v : JSON.stringify(v)) : null),
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-tree-select> — the registry TreeSelect as a web component.
 *
 * Form-associated: submits `name=val` or `name[]=val` with its <form>.
 */
export class UipTreeSelect extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; width: 100%; }`]

  static properties = {
    value: { converter: jsonConverter },
    defaultValue: { attribute: 'default-value', converter: jsonConverter },
    data: { converter: jsonConverter },
    multiple: { type: Boolean, reflect: true },
    placeholder: {},
    searchable: { converter: trueUnlessFalse },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    clearable: { converter: trueUnlessFalse },
    defaultExpandAll: { type: Boolean, attribute: 'default-expand-all' },
    size: { reflect: true },
    emptyText: { attribute: 'empty-text' },
    searchPlaceholder: { attribute: 'search-placeholder' },
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    isOpen: { state: true },
    search: { state: true },
    expandedIds: { state: true },
    pos: { state: true },
  }

  value: string | string[] | null = null
  defaultValue: string | string[] | null = null
  data: TreeSelectNode[] = []
  multiple = false
  placeholder = 'Select...'
  searchable = true
  disabled = false
  loading = false
  clearable = true
  defaultExpandAll = false
  size: 'sm' | 'default' | 'lg' = 'default'
  emptyText = 'No results found.'
  searchPlaceholder = 'Search...'
  name?: string
  accessibleLabel?: string

  private isOpen = false
  private search = ''
  private expandedIds: Set<string> = new Set()
  private pos: Record<string, string> = {}
  private initialValue: string | string[] | null = null
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'tree-select')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
    if (this.defaultExpandAll) {
      this.expandedIds = new Set(collectAllExpandable(this.data))
    }
    document.addEventListener('pointerdown', this.onDocumentPointerDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('pointerdown', this.onDocumentPointerDown)
  }

  private onDocumentPointerDown = (e: PointerEvent) => {
    if (!this.isOpen) return
    const path = e.composedPath()
    if (!path.includes(this)) {
      this.close()
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('name')) {
      if (!this.name || this.value == null) {
        this.internals.setFormValue(null)
      } else if (Array.isArray(this.value)) {
        const fd = new FormData()
        this.value.forEach((v) => fd.append(`${this.name}[]`, v))
        this.internals.setFormValue(fd)
      } else {
        this.internals.setFormValue(String(this.value))
      }
    }
    if (changed.has('defaultExpandAll') || changed.has('data')) {
      if (this.defaultExpandAll) {
        this.expandedIds = new Set(collectAllExpandable(this.data))
      }
    }
  }

  formResetCallback() {
    this.commit(this.initialValue)
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get trigger(): HTMLElement | null {
    return this.renderRoot?.querySelector('[role=combobox]')
  }

  private get popoverEl(): HTMLElement | null {
    return this.renderRoot?.querySelector('[data-slot=tree-select-popover]')
  }

  private toggleOpen() {
    if (this.disabled || this.loading) return
    if (this.isOpen) this.close()
    else this.open()
  }

  private open() {
    this.isOpen = true
    this.search = ''
    this.place()
  }

  private close() {
    this.isOpen = false
    this.search = ''
  }

  private place() {
    this.updateComplete.then(() => {
      const t = this.trigger
      const p = this.popoverEl
      if (!t || !p) return
      const { style } = computePosition(t, p, { side: 'bottom', align: 'start', sideOffset: 4, matchWidth: true })
      this.pos = style
    })
  }

  private commit(next: string | string[] | null) {
    this.value = next
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
  }

  private get selectedValues(): Set<string> {
    if (this.value == null) return new Set()
    if (Array.isArray(this.value)) return new Set(this.value)
    return new Set([this.value])
  }

  private toggleNode(node: TreeSelectNode) {
    if (node.disabled) return
    const next = new Set(this.expandedIds)
    if (next.has(node.value)) next.delete(node.value)
    else next.add(node.value)
    this.expandedIds = next
  }

  private selectNode(node: TreeSelectNode) {
    if (node.disabled) return
    if (!this.multiple) {
      this.commit(node.value)
      this.dispatchEvent(new CustomEvent('select', { detail: { node }, bubbles: true, composed: true }))
      this.close()
      return
    }

    const current = Array.isArray(this.value) ? [...this.value] : []
    const leaves = collectLeafValues(node)
    const allSelected = leaves.every((v) => current.includes(v))
    let next: string[]
    if (allSelected) {
      next = current.filter((v) => !leaves.includes(v))
    } else {
      next = [...current, ...leaves.filter((v) => !current.includes(v))]
    }
    this.commit(next)
    this.dispatchEvent(new CustomEvent('select', { detail: { node }, bubbles: true, composed: true }))
  }

  private clearAll(e?: Event) {
    e?.stopPropagation()
    if (this.disabled) return
    if (this.multiple) {
      this.commit([])
    } else {
      this.commit(null)
    }
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }))
  }

  private get filteredIds(): Set<string> | null {
    const q = this.search.trim().toLowerCase()
    if (!q) return null
    const visible = new Set<string>()
    const walk = (nodes: TreeSelectNode[]): boolean => {
      let anyMatch = false
      for (const n of nodes) {
        const selfMatch = n.label.toLowerCase().includes(q)
        let childMatch = false
        if (n.children?.length) {
          childMatch = walk(n.children)
        }
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

  private renderTreeNode(node: TreeSelectNode, depth: number, parentValue: string | null = null): TemplateResult | null {
    const filteredIds = this.filteredIds
    if (filteredIds && !filteredIds.has(node.value)) return null

    const hasChildren = !!(node.children && node.children.length)
    const isExpanded = this.expandedIds.has(node.value)
    const selectedValues = this.selectedValues

    const isChecked = !this.multiple
      ? selectedValues.has(node.value)
      : selectedValues.has(node.value) ||
        (hasChildren && collectValues(node).filter((v) => selectedValues.has(v)).length > 0)

    const isFullyChecked = !this.multiple
      ? false
      : selectedValues.has(node.value) ||
        (hasChildren && collectValues(node).every((v) => selectedValues.has(v)))

    const isIndeterminate = isChecked && !isFullyChecked

    const indent = `${depth * 20 + 8}px`

    return html`
      <div role="treeitem" aria-expanded=${hasChildren ? (isExpanded ? 'true' : 'false') : nothing}>
        <div
          data-tree-row
          data-tree-id=${node.value}
          class=${cn(
            'group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-sm pr-2 text-sm transition-colors select-none',
            'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
            node.disabled && 'cursor-not-allowed opacity-50',
            !this.multiple && selectedValues.has(node.value) && 'bg-accent text-accent-foreground font-medium',
          )}
          style=${styleMap({ paddingLeft: indent })}
          tabindex=${node.disabled ? -1 : 0}
          @click=${() => this.selectNode(node)}
        >
          ${hasChildren
            ? html`
                <button
                  type="button"
                  tabindex="-1"
                  aria-label=${isExpanded ? 'Collapse' : 'Expand'}
                  class=${cn(
                    'focus-visible:ring-ring flex size-4 shrink-0 items-center justify-center rounded transition-transform duration-150 focus-visible:ring-2 focus-visible:outline-none',
                    'hover:bg-foreground/10',
                    isExpanded && 'rotate-90',
                  )}
                  @click=${(e: Event) => {
                    e.stopPropagation()
                    this.toggleNode(node)
                  }}
                >
                  ${icon(ChevronRight, 'chevron-right', 'text-muted-foreground size-3.5')}
                </button>
              `
            : html`<span class="size-4 shrink-0"></span>`}

          ${this.multiple
            ? html`
                <input
                  type="checkbox"
                  .checked=${isFullyChecked || isChecked}
                  .indeterminate=${isIndeterminate}
                  ?disabled=${node.disabled}
                  class="border-input text-primary focus:ring-ring size-3.5 shrink-0 rounded focus:ring-1"
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${() => this.selectNode(node)}
                />
              `
            : nothing}

          <span class="flex-1 truncate">${node.label}</span>
        </div>

        ${hasChildren && isExpanded
          ? html`
              <div role="group">
                ${node.children!.map((child) => this.renderTreeNode(child, depth + 1, node.value))}
              </div>
            `
          : nothing}
      </div>
    `
  }

  render() {
    const data = this.data ?? []
    const multiple = this.multiple
    const currentValue = this.value

    let displayLabel = this.placeholder
    let hasVal = false

    if (multiple) {
      const vals = Array.isArray(currentValue) ? currentValue : []
      if (vals.length > 0) {
        hasVal = true
        const labels = findLabels(data, vals)
        if (labels.length <= 3) displayLabel = labels.join(', ')
        else displayLabel = `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`
      }
    } else if (currentValue != null) {
      hasVal = true
      const node = findNode(data, currentValue as string)
      displayLabel = node?.label ?? String(currentValue)
    }

    const filteredIds = this.filteredIds

    return html`
      <div part="base" class="relative w-full">
        <button
          part="trigger"
          type="button"
          role="combobox"
          aria-expanded=${this.isOpen ? 'true' : 'false'}
          aria-label=${this.accessibleLabel ?? nothing}
          ?disabled=${this.disabled || this.loading}
          data-slot="tree-select"
          class=${cn(treeSelectTriggerVariants({ size: this.size }))}
          @click=${this.toggleOpen}
        >
          <span class=${cn('flex-1 truncate text-left', hasVal ? 'text-foreground' : 'text-muted-foreground')}>
            ${displayLabel}
          </span>
          <span class="flex shrink-0 items-center gap-1">
            ${this.loading
              ? icon(Loader2, 'loader-2', 'text-muted-foreground size-4 animate-spin')
              : this.clearable && hasVal && !this.disabled
                ? html`
                    <span
                      role="button"
                      tabindex="0"
                      aria-label="Clear selection"
                      class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-4 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none cursor-pointer"
                      @click=${(e: Event) => this.clearAll(e)}
                    >
                      ${icon(X, 'x', 'size-4')}
                    </span>
                  `
                : html`
                    <span class=${cn('text-muted-foreground size-4 shrink-0 transition-transform duration-200', this.isOpen && 'rotate-180')}>
                      ${icon(ChevronDown, 'chevron-down', 'size-4')}
                    </span>
                  `}
          </span>
        </button>

        ${this.isOpen
          ? html`
              <div
                part="content"
                data-slot="tree-select-popover"
                style=${styleMap(this.pos)}
                class="bg-popover text-popover-foreground fixed inset-auto m-0 z-50 max-h-80 min-w-44 overflow-hidden rounded-md border shadow-md"
              >
                <div class="flex max-h-80 flex-col">
                  ${this.searchable
                    ? html`
                        <div class="border-b p-2">
                          <div class="relative">
                            <span class="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2 pointer-events-none">
                              ${icon(Search, 'search', 'size-4')}
                            </span>
                            <input
                              .value=${this.search}
                              placeholder=${this.searchPlaceholder}
                              aria-label="Search tree"
                              class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px] text-foreground placeholder:text-muted-foreground"
                              @input=${(e: Event) => (this.search = (e.target as HTMLInputElement).value)}
                            />
                          </div>
                        </div>
                      `
                    : nothing}

                  ${this.loading
                    ? html`
                        <div class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                          ${icon(Loader2, 'loader-2', 'size-4 animate-spin')}
                          Loading...
                        </div>
                      `
                    : data.length === 0 || (filteredIds && filteredIds.size === 0)
                      ? html`<div class="text-muted-foreground py-6 text-center text-sm">${this.emptyText}</div>`
                      : html`
                          <div class="flex-1 overflow-y-auto p-1 max-h-64" role="tree">
                            ${data.map((node) => this.renderTreeNode(node, 0))}
                          </div>
                        `}
                  ${multiple && Array.isArray(currentValue) && currentValue.length > 0
                    ? html`
                        <div class="flex items-center justify-between border-t px-2 py-1.5 text-xs">
                          <span class="text-muted-foreground">${currentValue.length} selected</span>
                          <button
                            type="button"
                            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded focus-visible:ring-2 focus-visible:outline-none"
                            @click=${() => this.clearAll()}
                          >
                            Clear all
                          </button>
                        </div>
                      `
                    : nothing}
                </div>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-tree-select') || customElements.define('uip-tree-select', UipTreeSelect)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tree-select': UipTreeSelect
  }
}

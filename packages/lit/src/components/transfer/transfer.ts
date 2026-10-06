import { LitElement, css, html, nothing } from 'lit'
import { ChevronLeft, ChevronRight, GripVertical, Search } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export interface TransferItem {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

export type TransferSide = 'left' | 'right'

/**
 * <uip-transfer> — Double-column transfer control with filtering, pagination,
 * drag-and-drop, and one-way mode.
 */
export class UipTransfer extends LitElement {
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
    dataSource: { type: Array, attribute: false },
    targetKeys: { type: Array, attribute: false },
    titles: { type: Array },
    showSearch: { type: Boolean, attribute: 'show-search' },
    height: { type: String },
    pagination: { type: Object },
    oneWay: { type: Boolean, attribute: 'one-way' },
    disabled: { type: Boolean },
    draggable: { type: Boolean },
    selectable: {
      type: Boolean,
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    leftSelectedKeys: { state: true },
    rightSelectedKeys: { state: true },
    leftSearch: { state: true },
    rightSearch: { state: true },
    leftPage: { state: true },
    rightPage: { state: true },
  }

  dataSource: TransferItem[] = []
  targetKeys: string[] = []
  titles: [string, string] = ['Source', 'Target']
  showSearch = false
  height: number | string = 320
  pagination: boolean | { pageSize: number } = false
  oneWay = false
  disabled = false
  draggable = false
  selectable = true

  leftSelectedKeys = new Set<string>()
  rightSelectedKeys = new Set<string>()
  leftSearch = ''
  rightSearch = ''
  leftPage = 1
  rightPage = 1

  private draggedKeys: string[] | null = null
  private draggedFrom: TransferSide | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'transfer')
  }

  private get pageSize(): number {
    if (!this.pagination) return 0
    if (typeof this.pagination === 'object' && this.pagination.pageSize) {
      return this.pagination.pageSize
    }
    return 10
  }

  private get targetKeySet(): Set<string> {
    return new Set(this.targetKeys)
  }

  private get sourceItems(): TransferItem[] {
    const targetSet = this.targetKeySet
    return this.dataSource.filter((item) => !targetSet.has(item.key))
  }

  private get targetItems(): TransferItem[] {
    const targetSet = this.targetKeySet
    return this.dataSource.filter((item) => targetSet.has(item.key))
  }

  private filterItems(items: TransferItem[], query: string): TransferItem[] {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q),
    )
  }

  private moveRight() {
    if (this.disabled) return
    const moving = Array.from(this.leftSelectedKeys)
    if (!moving.length) return
    const nextTargetKeys = [...this.targetKeys, ...moving]
    this.targetKeys = nextTargetKeys
    this.leftSelectedKeys = new Set()
    this.dispatchChanges(nextTargetKeys, 'right', moving)
  }

  private moveLeft() {
    if (this.disabled || this.oneWay) return
    const moving = Array.from(this.rightSelectedKeys)
    if (!moving.length) return
    const movingSet = new Set(moving)
    const nextTargetKeys = this.targetKeys.filter((k) => !movingSet.has(k))
    this.targetKeys = nextTargetKeys
    this.rightSelectedKeys = new Set()
    this.dispatchChanges(nextTargetKeys, 'left', moving)
  }

  private dispatchChanges(nextTargetKeys: string[], direction: 'left' | 'right', moved: string[]) {
    this.dispatchEvent(
      new CustomEvent('target-keys-change', {
        detail: { targetKeys: nextTargetKeys },
        bubbles: true,
        composed: true,
      }),
    )
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { targetKeys: nextTargetKeys, direction, moved },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  private toggleSelect(side: TransferSide, key: string, itemDisabled?: boolean) {
    if (this.disabled || itemDisabled) return
    const isLeft = side === 'left'
    const current = new Set(isLeft ? this.leftSelectedKeys : this.rightSelectedKeys)
    if (current.has(key)) current.delete(key)
    else current.add(key)

    if (isLeft) this.leftSelectedKeys = current
    else this.rightSelectedKeys = current

    this.dispatchEvent(
      new CustomEvent('select-change', {
        detail: {
          left: Array.from(this.leftSelectedKeys),
          right: Array.from(this.rightSelectedKeys),
        },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  private toggleSelectAll(side: TransferSide, items: TransferItem[]) {
    if (this.disabled) return
    const isLeft = side === 'left'
    const available = items.filter((i) => !i.disabled)
    const current = isLeft ? this.leftSelectedKeys : this.rightSelectedKeys
    const allSelected = available.length > 0 && available.every((i) => current.has(i.key))

    const next = new Set<string>()
    if (!allSelected) {
      available.forEach((i) => next.add(i.key))
    }

    if (isLeft) this.leftSelectedKeys = next
    else this.rightSelectedKeys = next

    this.requestUpdate()
  }

  private renderList(side: TransferSide) {
    const isLeft = side === 'left'
    const title = this.titles[isLeft ? 0 : 1] ?? (isLeft ? 'Source' : 'Target')
    const rawItems = isLeft ? this.sourceItems : this.targetItems
    const search = isLeft ? this.leftSearch : this.rightSearch
    const selectedKeys = isLeft ? this.leftSelectedKeys : this.rightSelectedKeys
    const filtered = this.filterItems(rawItems, search)

    const ps = this.pageSize
    const curPage = isLeft ? this.leftPage : this.rightPage
    const totalPages = ps > 0 ? Math.max(1, Math.ceil(filtered.length / ps)) : 1
    const paged = ps > 0 ? filtered.slice((curPage - 1) * ps, curPage * ps) : filtered

    const available = filtered.filter((i) => !i.disabled)
    const checkedCount = available.filter((i) => selectedKeys.has(i.key)).length
    const isAllChecked = available.length > 0 && checkedCount === available.length
    const isIndeterminate = checkedCount > 0 && !isAllChecked

    const heightStyle = typeof this.height === 'number' ? `${this.height}px` : this.height

    return html`
      <div
        class="border-border bg-card text-card-foreground flex flex-1 flex-col overflow-hidden rounded-lg border shadow-xs"
        style="height: ${heightStyle};"
      >
        <!-- Header -->
        <div class="border-border bg-muted/40 flex items-center justify-between border-b px-3 py-2 text-xs">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            ${this.selectable
              ? html`
                  <input
                    type="checkbox"
                    class="rounded border-input text-primary focus:ring-ring"
                    .checked=${isAllChecked}
                    .indeterminate=${isIndeterminate}
                    ?disabled=${this.disabled || available.length === 0}
                    @change=${() => this.toggleSelectAll(side, filtered)}
                  />
                `
              : nothing}
            <span class="font-medium">${title}</span>
          </label>
          <span class="text-muted-foreground tabular-nums">
            ${checkedCount > 0 ? `${checkedCount}/` : ''}${filtered.length}
          </span>
        </div>

        <!-- Search -->
        ${this.showSearch
          ? html`
              <div class="border-border border-b p-2">
                <div class="relative">
                  ${icon(Search, 'search', 'text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2')}
                  <input
                    type="text"
                    class="border-input bg-background focus:border-ring focus:ring-ring/30 h-7 w-full rounded-md pr-2 pl-7 text-xs outline-none focus:ring-2"
                    placeholder="Search..."
                    .value=${search}
                    @input=${(e: Event) => {
                      const val = (e.target as HTMLInputElement).value
                      if (isLeft) this.leftSearch = val
                      else this.rightSearch = val
                      this.dispatchEvent(
                        new CustomEvent('search', {
                          detail: { direction: side, query: val },
                          bubbles: true,
                          composed: true,
                        }),
                      )
                    }}
                  />
                </div>
              </div>
            `
          : nothing}

        <!-- List items -->
        <div
          class="flex-1 overflow-y-auto p-1 text-xs"
          @dragover=${(e: DragEvent) => {
            if (this.draggable && this.draggedFrom && this.draggedFrom !== side) {
              e.preventDefault()
            }
          }}
          @drop=${(e: DragEvent) => {
            if (this.draggable && this.draggedFrom && this.draggedFrom !== side) {
              e.preventDefault()
              if (isLeft) this.moveLeft()
              else this.moveRight()
            }
          }}
        >
          ${paged.length === 0
            ? html`<div class="text-muted-foreground flex h-32 items-center justify-center">No data</div>`
            : paged.map((item) => {
                const isSelected = selectedKeys.has(item.key)
                return html`
                  <div
                    class=${cn(
                      'hover:bg-muted/60 flex items-center gap-2 rounded px-2 py-1.5 transition-colors cursor-pointer select-none',
                      isSelected && 'bg-primary/10',
                      item.disabled && 'cursor-not-allowed opacity-50',
                    )}
                    draggable=${this.draggable && !item.disabled ? 'true' : 'false'}
                    @dragstart=${() => {
                      this.draggedKeys = [item.key]
                      this.draggedFrom = side
                    }}
                    @click=${() => this.toggleSelect(side, item.key, item.disabled)}
                  >
                    ${this.draggable
                      ? html`<span class="text-muted-foreground cursor-grab">${icon(GripVertical, 'grip-vertical', 'size-3.5')}</span>`
                      : nothing}
                    ${this.selectable
                      ? html`
                          <input
                            type="checkbox"
                            class="rounded border-input text-primary focus:ring-ring"
                            .checked=${isSelected}
                            ?disabled=${this.disabled || item.disabled}
                          />
                        `
                      : nothing}
                    <div class="min-w-0 flex-1">
                      <p class="truncate font-medium">${item.label}</p>
                      ${item.description
                        ? html`<p class="text-muted-foreground truncate text-[11px]">${item.description}</p>`
                        : nothing}
                    </div>
                  </div>
                `
              })}
        </div>

        <!-- Footer / Pagination -->
        ${ps > 0 && totalPages > 1
          ? html`
              <div class="border-border bg-muted/20 flex items-center justify-between border-t px-3 py-1.5 text-[11px]">
                <button
                  type="button"
                  class="hover:bg-accent focus-visible:ring-ring rounded p-1 disabled:opacity-40"
                  ?disabled=${curPage <= 1}
                  @click=${() => {
                    if (isLeft) this.leftPage = Math.max(1, curPage - 1)
                    else this.rightPage = Math.max(1, curPage - 1)
                  }}
                >
                  ${icon(ChevronLeft, 'chevron-left', 'size-3.5')}
                </button>
                <span class="text-muted-foreground tabular-nums">${curPage} / ${totalPages}</span>
                <button
                  type="button"
                  class="hover:bg-accent focus-visible:ring-ring rounded p-1 disabled:opacity-40"
                  ?disabled=${curPage >= totalPages}
                  @click=${() => {
                    if (isLeft) this.leftPage = Math.min(totalPages, curPage + 1)
                    else this.rightPage = Math.min(totalPages, curPage + 1)
                  }}
                >
                  ${icon(ChevronRight, 'chevron-right', 'size-3.5')}
                </button>
              </div>
            `
          : nothing}
        <slot name=${isLeft ? 'footer-left' : 'footer-right'}></slot>
      </div>
    `
  }

  render() {
    const leftHasSelected = this.leftSelectedKeys.size > 0
    const rightHasSelected = this.rightSelectedKeys.size > 0

    return html`
      <div part="base" class="flex flex-row items-center gap-3 w-full max-w-2xl">
        ${this.renderList('left')}

        <!-- Transfer Actions -->
        <div class="flex flex-col gap-1.5 shrink-0">
          <button
            type="button"
            class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md text-xs font-medium shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            ?disabled=${this.disabled || !leftHasSelected}
            aria-label="Transfer right"
            @click=${this.moveRight}
          >
            ${icon(ChevronRight, 'chevron-right', 'size-4')}
          </button>
          ${!this.oneWay
            ? html`
                <button
                  type="button"
                  class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md text-xs font-medium shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  ?disabled=${this.disabled || !rightHasSelected}
                  aria-label="Transfer left"
                  @click=${this.moveLeft}
                >
                  ${icon(ChevronLeft, 'chevron-left', 'size-4')}
                </button>
              `
            : nothing}
        </div>

        ${this.renderList('right')}
      </div>
    `
  }
}

customElements.get('uip-transfer') || customElements.define('uip-transfer', UipTransfer)

declare global {
  interface HTMLElementTagNameMap {
    'uip-transfer': UipTransfer
  }
}

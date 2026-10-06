import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { boardCardVariants, boardLaneVariants } from './board.variants'

export type BoardOrientation = 'horizontal' | 'vertical'
export type BoardDensity = 'default' | 'compact' | 'comfortable'

/* --------------------------------------------------------------------- Board */

export class UipBoard extends LitElement {
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
    orientation: { type: String },
    density: { type: String },
    draggingId: { state: true },
    dragOverLaneId: { state: true },
    selectedIds: { state: true },
  }

  orientation: BoardOrientation = 'horizontal'
  density: BoardDensity = 'default'

  draggingId: string | null = null
  dragOverLaneId: string | null = null
  selectedIds = new Set<string>()

  private cardLaneMap = new Map<string, string>()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'board')
  }

  setDragging(id: string | null) {
    this.draggingId = id
  }

  setDragOverLane(laneId: string | null) {
    this.dragOverLaneId = laneId
  }

  registerCardLane(cardId: string, laneId: string) {
    this.cardLaneMap.set(cardId, laneId)
  }

  moveItem(itemId: string | string[], toLaneId: string, toIndex = 0) {
    const ids = Array.isArray(itemId) ? itemId : [itemId]
    const fromLaneId = this.cardLaneMap.get(ids[0]) ?? ''
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          itemId: ids[0],
          itemIds: ids,
          from: fromLaneId,
          to: toLaneId,
          index: toIndex,
        },
        bubbles: true,
        composed: true,
      }),
    )
  }

  toggleSelection(cardId: string, additive = false) {
    const next = additive ? new Set(this.selectedIds) : new Set<string>()
    if (next.has(cardId)) next.delete(cardId)
    else next.add(cardId)
    this.selectedIds = next
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: { selectedIds: Array.from(next) },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  render() {
    return html`
      <div
        part="base"
        class=${cn(
          'w-full',
          this.orientation === 'horizontal' ? 'flex flex-row gap-4 overflow-x-auto' : 'flex flex-col gap-4',
        )}
      >
        <slot></slot>
      </div>
    `
  }
}

/* ---------------------------------------------------------------- Board Lane */

export class UipBoardLane extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: flex;
        flex: 1 1 0%;
        min-width: 240px;
      }
    `,
  ]

  static properties = {
    laneId: { type: String, attribute: 'lane-id' },
    tone: { type: String },
    isOver: { state: true },
  }

  laneId = ''
  tone: 'default' | 'plain' = 'default'
  isOver = false

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'board-lane')
  }

  private onDragOver(e: DragEvent) {
    e.preventDefault()
    this.isOver = true
    const board = this.closest('uip-board') as UipBoard | null
    board?.setDragOverLane(this.laneId)
  }

  private onDragLeave() {
    this.isOver = false
  }

  private onDrop(e: DragEvent) {
    e.preventDefault()
    this.isOver = false
    const rawData = e.dataTransfer?.getData('text/plain')
    if (rawData) {
      const board = this.closest('uip-board') as UipBoard | null
      try {
        const parsed = JSON.parse(rawData)
        const ids = Array.isArray(parsed) ? parsed : [parsed]
        board?.moveItem(ids, this.laneId)
      } catch {
        board?.moveItem(rawData, this.laneId)
      }
    }
  }

  render() {
    const state = this.isOver ? 'over' : 'idle'
    return html`
      <div
        part="base"
        data-lane-id=${this.laneId}
        class=${cn('w-full', boardLaneVariants({ tone: this.tone, state }))}
        @dragover=${this.onDragOver}
        @dragleave=${this.onDragLeave}
        @drop=${this.onDrop}
      >
        <slot></slot>
      </div>
    `
  }
}

/* --------------------------------------------------------- Board Lane Header */

export class UipBoardLaneHeader extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'board-lane-header')
  }

  render() {
    return html`
      <div part="base" class="flex items-center justify-between gap-2 px-1">
        <slot></slot>
      </div>
    `
  }
}

/* ----------------------------------------------------------- Board Lane Body */

export class UipBoardLaneBody extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
        flex: 1 1 0%;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'board-lane-body')
  }

  render() {
    return html`
      <div part="base" class="flex flex-1 flex-col gap-2 overflow-y-auto">
        <slot></slot>
      </div>
    `
  }
}

/* ---------------------------------------------------------- Board Lane Empty */

export class UipBoardLaneEmpty extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'board-lane-empty')
  }

  render() {
    return html`
      <div
        part="base"
        class="border-dashed border-border/70 text-muted-foreground flex h-20 items-center justify-center rounded-lg border-2 text-xs"
      >
        <slot>Empty lane</slot>
      </div>
    `
  }
}

/* ---------------------------------------------------------------- Board Card */

export class UipBoardCard extends LitElement {
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
    cardId: { type: String, attribute: 'card-id' },
    disabled: { type: Boolean },
    isDragging: { state: true },
    isSelected: { state: true },
  }

  cardId = ''
  disabled = false
  isDragging = false
  isSelected = false

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'board-card')

    const lane = this.closest('uip-board-lane') as UipBoardLane | null
    const board = this.closest('uip-board') as UipBoard | null
    if (lane && board && this.cardId) {
      board.registerCardLane(this.cardId, lane.laneId)
    }
  }

  private onDragStart(e: DragEvent) {
    if (this.disabled) return
    this.isDragging = true
    const board = this.closest('uip-board') as UipBoard | null
    const idsToDrag =
      board && board.selectedIds.has(this.cardId) ? Array.from(board.selectedIds) : [this.cardId]
    e.dataTransfer?.setData('text/plain', JSON.stringify(idsToDrag))
    board?.setDragging(this.cardId)
  }

  private onDragEnd() {
    this.isDragging = false
    const board = this.closest('uip-board') as UipBoard | null
    board?.setDragging(null)
  }

  private onClick(e: MouseEvent) {
    if (this.disabled) return
    const isAdditive = e.metaKey || e.ctrlKey || e.shiftKey
    const board = this.closest('uip-board') as UipBoard | null
    board?.toggleSelection(this.cardId, isAdditive)
    this.isSelected = Boolean(board?.selectedIds.has(this.cardId))
  }

  render() {
    const board = this.closest('uip-board') as UipBoard | null
    const selected = board?.selectedIds.has(this.cardId) ?? this.isSelected
    const state = this.isDragging ? 'dragging' : 'idle'

    return html`
      <div
        part="base"
        draggable=${!this.disabled}
        data-card-id=${this.cardId}
        class=${cn(
          boardCardVariants({ state }),
          selected && 'ring-2 ring-primary/60 border-primary/50',
          this.disabled && 'pointer-events-none opacity-40 grayscale',
        )}
        @dragstart=${this.onDragStart}
        @dragend=${this.onDragEnd}
        @click=${this.onClick}
      >
        <slot></slot>
      </div>
    `
  }
}

/* -------------------------------------------------------------- Registration */

customElements.get('uip-board') || customElements.define('uip-board', UipBoard)
customElements.get('uip-board-lane') || customElements.define('uip-board-lane', UipBoardLane)
customElements.get('uip-board-lane-header') || customElements.define('uip-board-lane-header', UipBoardLaneHeader)
customElements.get('uip-board-lane-body') || customElements.define('uip-board-lane-body', UipBoardLaneBody)
customElements.get('uip-board-lane-empty') || customElements.define('uip-board-lane-empty', UipBoardLaneEmpty)
customElements.get('uip-board-card') || customElements.define('uip-board-card', UipBoardCard)

declare global {
  interface HTMLElementTagNameMap {
    'uip-board': UipBoard
    'uip-board-lane': UipBoardLane
    'uip-board-lane-header': UipBoardLaneHeader
    'uip-board-lane-body': UipBoardLaneBody
    'uip-board-lane-empty': UipBoardLaneEmpty
    'uip-board-card': UipBoardCard
  }
}

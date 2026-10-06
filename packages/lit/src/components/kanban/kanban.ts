import { LitElement, css, html, nothing } from 'lit'
import { Plus } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { kanbanCardVariants, kanbanColumnVariants } from './kanban.variants'

export interface KanbanMoveEvent {
  cardId: string
  fromColumnId: string
  toColumnId: string
  toIndex?: number
}

/* -------------------------------------------------------------------- Kanban */

export class UipKanban extends LitElement {
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
    draggingCardId: { state: true },
    draggingColumnId: { state: true },
    overColumnId: { state: true },
  }

  draggingCardId: string | null = null
  draggingColumnId: string | null = null
  overColumnId: string | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban')
  }

  setDraggingCard(cardId: string | null, columnId: string | null) {
    this.draggingCardId = cardId
    this.draggingColumnId = columnId
  }

  setOverColumn(columnId: string | null) {
    this.overColumnId = columnId
  }

  moveCard(cardId: string, toColumnId: string, toIndex?: number) {
    const fromColumnId = this.draggingColumnId ?? ''
    this.dispatchEvent(
      new CustomEvent('card-move', {
        detail: { cardId, fromColumnId, toColumnId, toIndex },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    return html`
      <div part="base" class="w-full">
        <slot></slot>
      </div>
    `
  }
}

/* -------------------------------------------------------------- Kanban Board */

export class UipKanbanBoard extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban-board')
  }

  render() {
    return html`
      <div
        part="base"
        class="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20"
      >
        <slot></slot>
      </div>
    `
  }
}

/* ------------------------------------------------------------- Kanban Column */

export class UipKanbanColumn extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: flex;
        flex-shrink: 0;
      }
    `,
  ]

  static properties = {
    columnId: { type: String, attribute: 'column-id' },
    isOver: { state: true },
  }

  columnId = ''
  isOver = false

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban-column')
  }

  private onDragOver(e: DragEvent) {
    e.preventDefault()
    this.isOver = true
    const kanban = this.closest('uip-kanban') as UipKanban | null
    kanban?.setOverColumn(this.columnId)
  }

  private onDragLeave() {
    this.isOver = false
  }

  private onDrop(e: DragEvent) {
    e.preventDefault()
    this.isOver = false
    const cardId = e.dataTransfer?.getData('text/plain')
    if (cardId) {
      const kanban = this.closest('uip-kanban') as UipKanban | null
      kanban?.moveCard(cardId, this.columnId)
    }
  }

  render() {
    return html`
      <div
        part="base"
        data-column-id=${this.columnId}
        class=${kanbanColumnVariants({ isOver: this.isOver })}
        @dragover=${this.onDragOver}
        @dragleave=${this.onDragLeave}
        @drop=${this.onDrop}
      >
        <slot></slot>
      </div>
    `
  }
}

/* ------------------------------------------------------ Kanban Column Header */

export class UipKanbanColumnHeader extends LitElement {
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
    this.setAttribute('data-slot', 'kanban-column-header')
  }

  render() {
    return html`
      <div part="base" class="flex items-center justify-between gap-2 px-1 py-1">
        <slot></slot>
      </div>
    `
  }
}

/* --------------------------------------------------------- Kanban Column Dot */

export class UipKanbanColumnDot extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  static properties = {
    color: { type: String },
  }

  color = 'bg-primary'

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban-column-dot')
  }

  render() {
    return html`<span part="base" class=${cn('size-2 rounded-full shrink-0', this.color)}></span>`
  }
}

/* ------------------------------------------------------- Kanban Column Title */

export class UipKanbanColumnTitle extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban-column-title')
  }

  render() {
    return html`<h3 part="base" class="text-sm font-semibold text-foreground tracking-tight"><slot></slot></h3>`
  }
}

/* ------------------------------------------------------- Kanban Column Count */

export class UipKanbanColumnCount extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban-column-count')
  }

  render() {
    return html`
      <span
        part="base"
        class="bg-muted text-muted-foreground ml-1.5 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
      >
        <slot></slot>
      </span>
    `
  }
}

/* --------------------------------------------------------- Kanban Column Add */

export class UipKanbanColumnAdd extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban-column-add')
  }

  render() {
    return html`
      <button
        type="button"
        part="base"
        class="text-muted-foreground hover:text-foreground hover:bg-muted/80 focus-visible:ring-ring flex size-6 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Add card"
      >
        <slot>${icon(Plus, 'plus', 'size-4')}</slot>
      </button>
    `
  }
}

/* -------------------------------------------------------- Kanban Column Body */

export class UipKanbanColumnBody extends LitElement {
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
    this.setAttribute('data-slot', 'kanban-column-body')
  }

  render() {
    return html`
      <div part="base" class="flex flex-1 flex-col gap-2 overflow-y-auto">
        <slot></slot>
      </div>
    `
  }
}

/* ------------------------------------------------------- Kanban Column Empty */

export class UipKanbanColumnEmpty extends LitElement {
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
    this.setAttribute('data-slot', 'kanban-column-empty')
  }

  render() {
    return html`
      <div
        part="base"
        class="border-dashed border-border/80 text-muted-foreground/60 flex h-24 items-center justify-center rounded-lg border-2 text-xs"
      >
        <slot>No cards</slot>
      </div>
    `
  }
}

/* --------------------------------------------------------------- Kanban Card */

export class UipKanbanCard extends LitElement {
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
  }

  cardId = ''
  disabled = false
  isDragging = false

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'kanban-card')
  }

  private onDragStart(e: DragEvent) {
    if (this.disabled) return
    this.isDragging = true
    e.dataTransfer?.setData('text/plain', this.cardId)
    const col = this.closest('uip-kanban-column') as UipKanbanColumn | null
    const kanban = this.closest('uip-kanban') as UipKanban | null
    kanban?.setDraggingCard(this.cardId, col?.columnId ?? null)
  }

  private onDragEnd() {
    this.isDragging = false
    const kanban = this.closest('uip-kanban') as UipKanban | null
    kanban?.setDraggingCard(null, null)
  }

  render() {
    return html`
      <div
        part="base"
        draggable=${!this.disabled}
        data-card-id=${this.cardId}
        class=${cn(
          kanbanCardVariants({ isDragging: this.isDragging }),
          this.disabled && 'pointer-events-none opacity-50',
        )}
        @dragstart=${this.onDragStart}
        @dragend=${this.onDragEnd}
      >
        <slot></slot>
      </div>
    `
  }
}

/* -------------------------------------------------------- Kanban Card Header */

export class UipKanbanCardHeader extends LitElement {
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
    this.setAttribute('data-slot', 'kanban-card-header')
  }

  render() {
    return html`<div part="base" class="flex flex-col gap-1"><slot></slot></div>`
  }
}

/* --------------------------------------------------------- Kanban Card Title */

export class UipKanbanCardTitle extends LitElement {
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
    this.setAttribute('data-slot', 'kanban-card-title')
  }

  render() {
    return html`<p part="base" class="text-foreground text-sm leading-snug font-medium"><slot></slot></p>`
  }
}

/* --------------------------------------------------- Kanban Card Description */

export class UipKanbanCardDescription extends LitElement {
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
    this.setAttribute('data-slot', 'kanban-card-description')
  }

  render() {
    return html`<p part="base" class="text-muted-foreground line-clamp-2 text-xs"><slot></slot></p>`
  }
}

/* -------------------------------------------------------- Kanban Card Footer */

export class UipKanbanCardFooter extends LitElement {
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
    this.setAttribute('data-slot', 'kanban-card-footer')
  }

  render() {
    return html`
      <div part="base" class="text-muted-foreground mt-1 flex items-center justify-between gap-2 pt-1 text-xs">
        <slot></slot>
      </div>
    `
  }
}

/* -------------------------------------------------------------- Registration */

customElements.get('uip-kanban') || customElements.define('uip-kanban', UipKanban)
customElements.get('uip-kanban-board') || customElements.define('uip-kanban-board', UipKanbanBoard)
customElements.get('uip-kanban-column') || customElements.define('uip-kanban-column', UipKanbanColumn)
customElements.get('uip-kanban-column-header') || customElements.define('uip-kanban-column-header', UipKanbanColumnHeader)
customElements.get('uip-kanban-column-dot') || customElements.define('uip-kanban-column-dot', UipKanbanColumnDot)
customElements.get('uip-kanban-column-title') || customElements.define('uip-kanban-column-title', UipKanbanColumnTitle)
customElements.get('uip-kanban-column-count') || customElements.define('uip-kanban-column-count', UipKanbanColumnCount)
customElements.get('uip-kanban-column-add') || customElements.define('uip-kanban-column-add', UipKanbanColumnAdd)
customElements.get('uip-kanban-column-body') || customElements.define('uip-kanban-column-body', UipKanbanColumnBody)
customElements.get('uip-kanban-column-empty') || customElements.define('uip-kanban-column-empty', UipKanbanColumnEmpty)
customElements.get('uip-kanban-card') || customElements.define('uip-kanban-card', UipKanbanCard)
customElements.get('uip-kanban-card-header') || customElements.define('uip-kanban-card-header', UipKanbanCardHeader)
customElements.get('uip-kanban-card-title') || customElements.define('uip-kanban-card-title', UipKanbanCardTitle)
customElements.get('uip-kanban-card-description') || customElements.define('uip-kanban-card-description', UipKanbanCardDescription)
customElements.get('uip-kanban-card-footer') || customElements.define('uip-kanban-card-footer', UipKanbanCardFooter)

declare global {
  interface HTMLElementTagNameMap {
    'uip-kanban': UipKanban
    'uip-kanban-board': UipKanbanBoard
    'uip-kanban-column': UipKanbanColumn
    'uip-kanban-column-header': UipKanbanColumnHeader
    'uip-kanban-column-dot': UipKanbanColumnDot
    'uip-kanban-column-title': UipKanbanColumnTitle
    'uip-kanban-column-count': UipKanbanColumnCount
    'uip-kanban-column-add': UipKanbanColumnAdd
    'uip-kanban-column-body': UipKanbanColumnBody
    'uip-kanban-column-empty': UipKanbanColumnEmpty
    'uip-kanban-card': UipKanbanCard
    'uip-kanban-card-header': UipKanbanCardHeader
    'uip-kanban-card-title': UipKanbanCardTitle
    'uip-kanban-card-description': UipKanbanCardDescription
    'uip-kanban-card-footer': UipKanbanCardFooter
  }
}

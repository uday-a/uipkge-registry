import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { kanbanCardVariants, kanbanColumnVariants } from './kanban.variants'

export interface KanbanMoveEvent {
  cardId: string
  fromColumnId: string
  toColumnId: string
  toIndex?: number
}

/* ------------------------------------------------------------------ */
/* Kanban (root provider)                                             */
/* ------------------------------------------------------------------ */

/**
 * Angular port of UIPKGE Kanban (React parity). The root holds the drag state shared by
 * columns and cards (pointer drag via native HTML5 drag-and-drop, keyboard drag via Space /
 * arrows / Escape on a card) and narrates keyboard moves through a polite live region.
 * The consumer owns the data: every move is emitted through `cardMove`
 * `{ cardId, fromColumnId, toColumnId, toIndex? }` and the consumer re-renders.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban, [ui-kanban]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"kanban"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />
    <div data-slot="kanban-live-region" class="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {{ announcement() }}
    </div>`,
})
export class UiKanbanComponent {
  @Input('class') className?: string
  /** React `onCardMove`. */
  @Output() cardMove = new EventEmitter<KanbanMoveEvent>()

  readonly draggingCardId = signal<string | null>(null)
  readonly draggingColumnId = signal<string | null>(null)
  readonly overColumnId = signal<string | null>(null)
  /** Set while a card is held by keyboard (Space), not by pointer drag. */
  readonly grabbedCardId = signal<string | null>(null)
  readonly announcement = signal('')
  /**
   * True for one task after a keyboard move is emitted. Angular re-renders the moved card
   * by destroying / re-inserting its DOM node, which fires a blur that is not the user
   * leaving the card (React detaches its handlers first, so it never sees that blur).
   */
  moving = false

  private readonly appRef = inject(ApplicationRef)

  /** Emit a keyboard move and re-render at once (React flushes discrete events synchronously),
   *  so an immediate second arrow press reads the new card order. */
  emitMove(event: KanbanMoveEvent): void {
    this.moving = true
    setTimeout(() => (this.moving = false))
    this.cardMove.emit(event)
    this.appRef.tick()
  }

  get hostClass(): string {
    return cn('block w-full', this.className)
  }

  setDraggingCard(cardId: string | null, columnId: string | null): void {
    this.draggingCardId.set(cardId)
    this.draggingColumnId.set(columnId)
  }

  setOverColumn(columnId: string | null): void {
    this.overColumnId.set(columnId)
  }

  setGrabbedCard(cardId: string | null): void {
    this.grabbedCardId.set(cardId)
  }

  /** Speak a message through the board's polite live region. */
  announce(message: string): void {
    // Re-assigning the same string would not re-trigger the live region.
    this.announcement.update((current) => (current === message ? `${message} ` : message))
  }
}

/* ------------------------------------------------------------------ */
/* KanbanBoard                                                        */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-board, [ui-kanban-board]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-board"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanBoardComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('flex w-full items-start gap-4 overflow-x-auto pb-4', this.className)
  }
}

/* ------------------------------------------------------------------ */
/* KanbanColumn                                                       */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column, [ui-kanban-column]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"kanban-column"',
    role: 'group',
    '[attr.aria-label]': 'label ?? id',
    '[attr.data-column-id]': 'id',
    '[attr.data-over]': 'isOver ? "" : null',
    '[class]': 'hostClass',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
  template: `<ng-content />`,
})
export class UiKanbanColumnComponent {
  readonly kanban = inject(UiKanbanComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input({ required: true }) id!: string
  /** Accessible name for the column, also used in keyboard move announcements. Falls back to the id. */
  @Input() label?: string
  @Input('class') className?: string

  get isOver(): boolean {
    return this.kanban.overColumnId() === this.id
  }

  get hostClass(): string {
    return cn(kanbanColumnVariants({ isOver: this.isOver }), this.className)
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    if (this.kanban.overColumnId() !== this.id) this.kanban.setOverColumn(this.id)
  }

  onDragLeave(e: DragEvent): void {
    if (this.el.contains(e.relatedTarget as Node | null)) return
    if (this.kanban.overColumnId() === this.id) this.kanban.setOverColumn(null)
  }

  onDrop(e: DragEvent): void {
    e.preventDefault()
    const cardId = this.kanban.draggingCardId()
    const fromColumnId = this.kanban.draggingColumnId()
    if (cardId && fromColumnId) this.kanban.cardMove.emit({ cardId, fromColumnId, toColumnId: this.id })
    this.kanban.setDraggingCard(null, null)
    this.kanban.setOverColumn(null)
  }
}

/* ------------------------------------------------------------------ */
/* KanbanColumnHeader & sub-components                                */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column-header, [ui-kanban-column-header]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-column-header"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanColumnHeaderComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('flex items-center justify-between gap-2 px-1 py-0.5', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column-dot, [ui-kanban-column-dot]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-column-dot"', '[class]': 'hostClass' },
  template: ``,
})
export class UiKanbanColumnDotComponent {
  /** Any background utility. */
  @Input() color = 'bg-primary'
  @Input('class') className?: string
  get hostClass(): string {
    return cn('size-2 shrink-0 rounded-full', this.color, this.className)
  }
}

/** Put it on an <h3> for React's DOM. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column-title, [ui-kanban-column-title]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-column-title"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanColumnTitleComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('block text-foreground text-sm font-semibold tracking-tight', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column-count, [ui-kanban-column-count]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-column-count"', '[class]': 'hostClass' },
  template: `@if (count != null) {
      <ng-container>{{ count }}</ng-container>
    } @else {
      <ng-content />
    }`,
})
export class UiKanbanColumnCountComponent {
  /** Wins over projected content (React `count ?? children`). */
  @Input() count?: number | string | null
  @Input('class') className?: string
  get hostClass(): string {
    return cn(
      'bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums',
      this.className,
    )
  }
}

/** Put it on a <button> for React's DOM. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column-add, [ui-kanban-column-add]',
  standalone: true,
  host: { '[attr.type]': '"button"', '[attr.data-slot]': '"kanban-column-add"', '[class]': 'hostClass' },
  template: `<ng-content
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-plus size-3.5"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" /></svg
  ></ng-content>`,
})
export class UiKanbanColumnAddComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn(
      'text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none',
      this.className,
    )
  }
}

/* ------------------------------------------------------------------ */
/* KanbanColumnBody & Empty                                           */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column-body, [ui-kanban-column-body]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-column-body"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanColumnBodyComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('flex flex-1 flex-col gap-2 overflow-y-auto py-1', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-column-empty, [ui-kanban-column-empty]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-column-empty"', '[class]': 'hostClass' },
  template: `<ng-content>No cards</ng-content>`,
})
export class UiKanbanColumnEmptyComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn(
      'border-border/60 text-muted-foreground/60 flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-xs',
      this.className,
    )
  }
}

/* ------------------------------------------------------------------ */
/* KanbanCard & sub-components                                        */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-card, [ui-kanban-card]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"kanban-card"',
    '[attr.data-card-id]': 'id',
    '[attr.data-state]': 'isGrabbed ? "grabbed" : isDragging ? "dragging" : "idle"',
    '[attr.data-disabled]': 'disabled || null',
    '[attr.role]': 'canKeyboardDrag ? "button" : null',
    '[attr.tabindex]': 'canKeyboardDrag ? 0 : null',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.aria-roledescription]': 'canKeyboardDrag ? "draggable card" : null',
    '[attr.aria-pressed]': 'canKeyboardDrag ? isGrabbed : null',
    '[attr.draggable]': '!disabled',
    '[class]': 'hostClass',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd()',
    '(keydown)': 'onKeyDown($event)',
    '(blur)': 'onBlur()',
  },
  template: `<ng-content />`,
})
export class UiKanbanCardComponent implements AfterViewInit {
  readonly kanban = inject(UiKanbanComponent)
  readonly column = inject(UiKanbanColumnComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input({ required: true }) id!: string
  @Input({ transform: booleanAttribute }) disabled = false
  /** Disable the keyboard grab (Space / arrows) while leaving pointer dragging intact. */
  @Input({ transform: booleanAttribute }) keyboardDraggable = true
  @Input('class') className?: string

  constructor() {
    // The consumer owns the data, so a moved card is destroyed and re-created under its new
    // column; whichever instance is mounted while the card is held takes focus back.
    effect(() => {
      if (this.kanban.grabbedCardId() === this.id) queueMicrotask(() => this.refocus())
    })
  }

  get isGrabbed(): boolean {
    return this.kanban.grabbedCardId() === this.id
  }
  get isDragging(): boolean {
    return this.kanban.draggingCardId() === this.id || this.isGrabbed
  }
  get canKeyboardDrag(): boolean {
    return this.keyboardDraggable && !this.disabled
  }

  get hostClass(): string {
    return cn(
      kanbanCardVariants({ isDragging: this.isDragging }),
      this.disabled && 'pointer-events-none opacity-50',
      this.className,
    )
  }

  ngAfterViewInit(): void {
    if (this.isGrabbed) this.refocus()
  }

  private refocus(): void {
    if (this.isGrabbed && this.el.isConnected && document.activeElement !== this.el) this.el.focus()
  }

  onDragStart(e: DragEvent): void {
    if (this.disabled) {
      e.preventDefault()
      return
    }
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', this.id)
    }
    this.kanban.setDraggingCard(this.id, this.column.id)
  }

  onDragEnd(): void {
    this.kanban.setDraggingCard(null, null)
    this.kanban.setOverColumn(null)
  }

  private columnName(el: HTMLElement | null): string {
    return el?.getAttribute('aria-label') || el?.dataset['columnId'] || 'column'
  }

  /** Ordered columns of the board this card sits in. */
  private boardColumns(): HTMLElement[] {
    const board: ParentNode = this.el.closest('[data-slot="kanban"]') ?? document
    return Array.from(board.querySelectorAll<HTMLElement>('[data-slot="kanban-column"]'))
  }

  private grab(): void {
    this.kanban.setGrabbedCard(this.id)
    this.kanban.setDraggingCard(this.id, this.column.id)
    this.kanban.setOverColumn(this.column.id)
    this.kanban.announce('Picked up card. Use the arrow keys to move it, space to drop, escape to cancel.')
  }

  private release(cancelled: boolean): void {
    this.kanban.setGrabbedCard(null)
    this.kanban.setDraggingCard(null, null)
    this.kanban.setOverColumn(null)
    this.kanban.announce(cancelled ? 'Move cancelled.' : 'Card dropped.')
  }

  private moveToColumn(delta: -1 | 1): void {
    const columns = this.boardColumns()
    // The held card's column lives in the root: a second arrow press can land on this
    // instance before change detection has re-rendered it under its new column.
    const fromColumnId = this.kanban.draggingColumnId() ?? this.column.id
    const currentIdx = columns.findIndex((el) => el.dataset['columnId'] === fromColumnId)
    if (currentIdx === -1) return
    const target = columns[currentIdx + delta]
    // Deliberately not wrapping: running off the end of a board stops.
    const toColumnId = target?.dataset['columnId']
    if (!toColumnId) return
    this.kanban.emitMove({ cardId: this.id, fromColumnId, toColumnId })
    this.kanban.setDraggingCard(this.id, toColumnId)
    this.kanban.setOverColumn(toColumnId)
    this.kanban.announce(`Moved to ${this.columnName(target)}.`)
  }

  private moveWithinColumn(delta: -1 | 1): void {
    const columnEl = this.el.closest<HTMLElement>('[data-slot="kanban-column"]')
    if (!columnEl) return
    const cards = Array.from(columnEl.querySelectorAll<HTMLElement>('[data-slot="kanban-card"]'))
    const currentIdx = cards.findIndex((el) => el.dataset['cardId'] === this.id)
    if (currentIdx === -1) return
    const targetIdx = currentIdx + delta
    if (targetIdx < 0 || targetIdx > cards.length - 1) return
    this.kanban.emitMove({
      cardId: this.id,
      fromColumnId: this.column.id,
      toColumnId: this.column.id,
      toIndex: targetIdx,
    })
    this.kanban.announce(`Position ${targetIdx + 1} of ${cards.length}.`)
  }

  onKeyDown(e: KeyboardEvent): void {
    if (!this.canKeyboardDrag || e.defaultPrevented) return
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      if (this.isGrabbed) this.release(false)
      else this.grab()
      return
    }
    if (!this.isGrabbed) return
    if (e.key === 'Escape') {
      e.preventDefault()
      this.release(true)
      return
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      this.moveToColumn(e.key === 'ArrowLeft' ? -1 : 1)
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      this.moveWithinColumn(e.key === 'ArrowUp' ? -1 : 1)
    }
  }

  onBlur(): void {
    // A grabbed card that loses focus (click elsewhere, Tab) would otherwise stay held.
    if (!this.isGrabbed) return
    if (this.kanban.moving) {
      // Blur from the move re-render: the mounted instance takes focus back.
      setTimeout(() => this.refocus())
      return
    }
    this.release(true)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-card-header, [ui-kanban-card-header]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-card-header"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanCardHeaderComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('flex flex-col gap-1', this.className)
  }
}

/** Put it on a <p> for React's DOM. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-card-title, [ui-kanban-card-title]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-card-title"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanCardTitleComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('block text-foreground text-sm leading-snug font-medium', this.className)
  }
}

/** Put it on a <p> for React's DOM. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-card-description, [ui-kanban-card-description]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-card-description"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanCardDescriptionComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('text-muted-foreground line-clamp-2 text-xs', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kanban-card-footer, [ui-kanban-card-footer]',
  standalone: true,
  host: { '[attr.data-slot]': '"kanban-card-footer"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiKanbanCardFooterComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('text-muted-foreground mt-1 flex items-center justify-between gap-2 pt-1 text-xs', this.className)
  }
}

export { kanbanColumnVariants, kanbanCardVariants }
export type { KanbanColumnVariantsProps, KanbanCardVariantsProps } from './kanban.variants'

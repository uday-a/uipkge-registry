import {
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  boardCardVariants,
  boardLaneVariants,
  type BoardCardVariantsProps,
  type BoardLaneVariantsProps,
} from './board.variants'

export type BoardOrientation = 'horizontal' | 'vertical'
export type BoardDensity = 'compact' | 'default' | 'comfortable'

/** Drop event a board state helper emits on every move. */
export interface BoardDropEvent {
  /** First (anchor) item moved. For multi-item drops, see `itemIds`. */
  itemId: string
  /** All items moved in this drop, in their final visual order. */
  itemIds: string[]
  from: string
  to: string
  /** Insertion index of the first item in the target lane. */
  index: number
}

/** Predicate consumers pass to control which items each lane accepts. */
export type BoardAcceptsFn = (itemId: string, fromLaneId: string, toLaneId: string) => boolean
export type BoardMoveItemFn = (itemId: string | string[], toLaneId: string, toIndex?: number) => void

export interface BoardLaneRenderProps {
  isDragOver: boolean
  isAccepting: boolean
  disabled: boolean
}

const ALWAYS_ACCEPT: BoardAcceptsFn = () => true
const NOOP = () => {}
const EMPTY_IDS: readonly string[] = []
const EMPTY_SELECTION: ReadonlySet<string> = new Set<string>()

/* ------------------------------------------------------------------ */
/* Board (root)                                                        */
/* ------------------------------------------------------------------ */

/**
 * Angular port of UIPKGE Board (React parity). Like React, the primitive owns no data: the
 * consumer's board state is passed in (`draggingId`, `draggingIds`, `dragOverLaneId`,
 * `justMovedId`, `selectedIds`) together with the functions lanes and cards call
 * (`moveItem`, `toggleSelection`, `clearSelection`, the allowed-lanes / disabled-lane
 * registries and `isLaneAcceptingFor`). Lanes and cards read it through DI (React context).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-board, [ui-board]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"board"',
    '[attr.data-orientation]': 'orientation',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiBoardComponent {
  @Input() orientation: BoardOrientation = 'horizontal'
  @Input() density: BoardDensity = 'default'
  /** Animation preset class applied by BoardLaneBody. */
  @Input() motion = 'motion-list'
  /** Predicate run per drop. Defaults to always-accept. */
  @Input() accepts: BoardAcceptsFn = ALWAYS_ACCEPT
  /** Imperative move from the consumer's board state. */
  @Input() moveItem: BoardMoveItemFn = NOOP
  @Input() draggingId: string | null = null
  @Input() draggingIds: readonly string[] = EMPTY_IDS
  @Input() dragOverLaneId: string | null = null
  @Input() justMovedId: string | null = null
  @Input() selectedIds: ReadonlySet<string> = EMPTY_SELECTION
  @Input() toggleSelection: (itemId: string, additive?: boolean) => void = NOOP
  @Input() clearSelection: () => void = NOOP
  @Input() registerAllowedLanes: (cardId: string, lanes: readonly string[] | undefined) => void = NOOP
  @Input() unregisterAllowedLanes: (cardId: string) => void = NOOP
  @Input() registerLaneDisabled: (laneId: string, disabled: boolean) => void = NOOP
  @Input() unregisterLaneDisabled: (laneId: string) => void = NOOP
  @Input() isLaneAcceptingFor: (laneId: string) => boolean = () => true
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block w-full', this.className)
  }
}

/* ------------------------------------------------------------------ */
/* BoardLane                                                           */
/* ------------------------------------------------------------------ */

/** `<ng-template uiBoardLaneContent let-isDragOver="isDragOver">`: React's children-as-function. */
@Directive({ selector: 'ng-template[uiBoardLaneContent]', standalone: true })
export class UiBoardLaneContentDirective {
  readonly template = inject<TemplateRef<BoardLaneRenderProps>>(TemplateRef)
}

/** Renders the lane render-prop template with its state as context. */
@Directive({ selector: '[uiBoardLaneOutlet]', standalone: true })
export class UiBoardLaneOutletDirective implements OnChanges, OnDestroy {
  @Input('uiBoardLaneOutlet') template: TemplateRef<BoardLaneRenderProps> | null | undefined = null
  @Input('uiBoardLaneOutletContext') context!: BoardLaneRenderProps
  private readonly vcr = inject(ViewContainerRef)

  ngOnChanges(): void {
    this.vcr.clear()
    if (this.template) this.vcr.createEmbeddedView(this.template, this.context)
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-board-lane, [ui-board-lane]',
  standalone: true,
  imports: [UiBoardLaneOutletDirective],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"board-lane"',
    '[attr.data-board-lane]': '""',
    '[attr.data-lane-id]': 'id',
    '[attr.data-state]': 'state',
    '[attr.data-disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled || null',
    '[class]': 'hostClass',
    '(dragover)': 'laneDragOver.emit($event)',
    '(drop)': 'onDrop($event)',
    '(dragleave)': 'laneDragLeave.emit()',
  },
  template: `<ng-content />
    @if (contentTemplate) {
      <ng-container
        [uiBoardLaneOutlet]="contentTemplate.template"
        [uiBoardLaneOutletContext]="{ isDragOver, isAccepting, disabled }"
      />
    }`,
})
export class UiBoardLaneComponent implements OnChanges, OnDestroy {
  readonly board = inject(UiBoardComponent)
  @Input({ required: true }) id!: string
  @Input() tone: 'default' | 'plain' = 'default'
  /** Disable drops on this lane. Cards inside still render and stay draggable. */
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string
  /** React `onLaneDragOver`: emitted unconditionally so the consumer can set dragOverLaneId. */
  @Output() laneDragOver = new EventEmitter<DragEvent>()
  /** React `onLaneDrop` (not emitted on a disabled lane). */
  @Output() laneDrop = new EventEmitter<DragEvent>()
  /** React `onLaneDragLeave`. */
  @Output() laneDragLeave = new EventEmitter<void>()
  @ContentChild(UiBoardLaneContentDirective) contentTemplate?: UiBoardLaneContentDirective
  private registeredId?: string

  get isDragOver(): boolean {
    return this.board.dragOverLaneId === this.id
  }

  get isAccepting(): boolean {
    if (!this.board.draggingId) return false
    if (this.disabled) return false
    return this.board.isLaneAcceptingFor(this.id)
  }

  get state(): 'idle' | 'over' | 'rejecting' {
    return !this.isDragOver ? 'idle' : this.isAccepting ? 'over' : 'rejecting'
  }

  get hostClass(): string {
    return cn(
      boardLaneVariants({ tone: this.tone, state: this.state }),
      // Disabled lane dims only the lane chrome; cards inside stay legible.
      this.disabled && 'opacity-80 [&>[data-slot=board-lane-header]]:opacity-60',
      this.className,
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] || changes['disabled']) {
      if (this.registeredId !== undefined) this.board.unregisterLaneDisabled(this.registeredId)
      this.board.registerLaneDisabled(this.id, this.disabled)
      this.registeredId = this.id
    }
  }

  onDrop(e: DragEvent): void {
    if (this.disabled) {
      e.preventDefault()
      return
    }
    this.laneDrop.emit(e)
  }

  ngOnDestroy(): void {
    if (this.registeredId !== undefined) this.board.unregisterLaneDisabled(this.registeredId)
  }
}

/* ------------------------------------------------------------------ */
/* BoardLaneHeader / Body / Empty                                      */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-board-lane-header, [ui-board-lane-header]',
  standalone: true,
  host: { '[attr.data-uipkge]': '""', '[attr.data-slot]': '"board-lane-header"', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiBoardLaneHeaderComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('flex items-center justify-between gap-2', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-board-lane-body, [ui-board-lane-body]',
  standalone: true,
  host: { '[attr.data-uipkge]': '""', '[attr.data-slot]': '"board-lane-body"', '[class]': 'hostClass' },
  // The inner wrapper carries the motion preset class (React / Vue TransitionGroup target).
  template: `<div [class]="innerClass"><ng-content /></div>`,
})
export class UiBoardLaneBodyComponent {
  private readonly board = inject(UiBoardComponent, { optional: true })
  /** Override the animation preset class. Defaults to the board-level motion preset. */
  @Input() motion?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'flex min-h-0 flex-1 [scrollbar-width:thin] flex-col gap-2 overflow-y-auto px-0.5 py-1 pr-1',
      this.className,
    )
  }

  get innerClass(): string {
    return cn('relative flex flex-col gap-2', this.motion ?? this.board?.motion ?? 'motion-list')
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-board-lane-empty, [ui-board-lane-empty]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"board-lane-empty"',
    '[class]': 'hostClass',
    // React renders nothing when `when === false`.
    '[style.display]': 'when === false ? "none" : null',
  },
  template: `@if (when !== false) {
    <ng-content />
  }`,
})
export class UiBoardLaneEmptyComponent {
  /** Show only when this is true (consumer wires from `lane.length === 0`). */
  @Input() when?: boolean
  @Input('class') className?: string
  get hostClass(): string {
    return cn(
      'block text-muted-foreground/70 border-border/60 rounded-lg border border-dashed py-6 text-center text-xs',
      this.className,
    )
  }
}

/* ------------------------------------------------------------------ */
/* BoardCard                                                           */
/* ------------------------------------------------------------------ */

/**
 * A draggable card: `<div role="button">` so consumers can nest buttons / links inside.
 * Space grabs by keyboard, arrows then move it across lanes (skipping disabled lanes,
 * wrapping) or within its lane, Space / Escape drops. Enter emits `cardClick`;
 * Cmd / Ctrl / Shift + click toggles it in the selection.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-board-card, [ui-board-card]',
  standalone: true,
  host: {
    role: 'button',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"board-card"',
    '[attr.data-board-card]': '""',
    '[attr.data-board-card-id]': 'id',
    '[attr.data-state]': 'state',
    '[attr.data-selected]': 'isSelected || null',
    '[attr.data-disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.aria-pressed]': 'selectable ? isSelected : null',
    '[attr.draggable]': 'disabled ? false : true',
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.aria-roledescription]': 'keyboardDraggable && !disabled ? "draggable card" : null',
    '[class]': 'hostClass',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeyDown($event)',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'dragEnd.emit()',
  },
  template: `<ng-content />`,
})
export class UiBoardCardComponent implements OnChanges, OnDestroy {
  readonly board = inject(UiBoardComponent)
  readonly lane = inject(UiBoardLaneComponent)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input({ required: true }) id!: string
  /** Disable keyboard grab (e.g. for read-only boards). */
  @Input({ transform: booleanAttribute }) keyboardDraggable = true
  /** Disable the card entirely: non-draggable, non-clickable, dimmed. */
  @Input({ transform: booleanAttribute }) disabled = false
  /** Per-card allow-list of destination lane ids. */
  @Input() allowedLanes?: readonly string[]
  /** Show the click-to-select chrome (ring + cmd/shift-click multi-select). */
  @Input({ transform: booleanAttribute }) selectable = true
  @Input('class') className?: string
  /** React `onDragStart`. */
  @Output() dragStart = new EventEmitter<DragEvent>()
  /** React `onDragEnd`. */
  @Output() dragEnd = new EventEmitter<void>()
  /** React `onClick` (renamed: a `click` output would collide with the native DOM event). */
  @Output() cardClick = new EventEmitter<MouseEvent>()

  readonly isKeyboardGrabbed = signal(false)
  private registeredId?: string

  get isDragging(): boolean {
    return this.board.draggingIds.includes(this.id) || this.board.draggingId === this.id || this.isKeyboardGrabbed()
  }
  get isJustMoved(): boolean {
    return this.board.justMovedId === this.id
  }
  get isSelected(): boolean {
    return this.board.selectedIds.has(this.id)
  }
  get state(): 'idle' | 'dragging' | 'moved' {
    return this.isDragging ? 'dragging' : this.isJustMoved ? 'moved' : 'idle'
  }

  get hostClass(): string {
    return cn(
      boardCardVariants({ state: this.state }),
      this.isSelected && 'ring-primary/60 ring-offset-background ring-2 ring-offset-1',
      this.disabled && 'pointer-events-none cursor-not-allowed opacity-50 shadow-none grayscale hover:translate-y-0',
      this.className,
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] || changes['allowedLanes']) {
      if (this.registeredId !== undefined) this.board.unregisterAllowedLanes(this.registeredId)
      this.board.registerAllowedLanes(this.id, this.allowedLanes)
      this.registeredId = this.id
    }
  }

  ngOnDestroy(): void {
    if (this.registeredId !== undefined) this.board.unregisterAllowedLanes(this.registeredId)
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return
    // Enter activates the card (the native <button> default action).
    if (e.key === 'Enter') {
      e.preventDefault()
      this.cardClick.emit(new MouseEvent('click', { bubbles: true, cancelable: true }))
      return
    }
    if (!this.keyboardDraggable) return
    if (e.key === ' ') {
      e.preventDefault()
      this.isKeyboardGrabbed.update((v) => !v)
      return
    }
    if (e.key === 'Escape' && this.isKeyboardGrabbed()) {
      e.preventDefault()
      this.isKeyboardGrabbed.set(false)
      return
    }
    if (!this.isKeyboardGrabbed()) return
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const allLanes = Array.from(document.querySelectorAll<HTMLElement>('[data-board-lane]')).filter(
        (el) => !el.hasAttribute('data-disabled'),
      )
      const currentIdx = allLanes.findIndex((el) => el.dataset['laneId'] === this.lane.id)
      if (currentIdx === -1 || allLanes.length === 0) return
      const delta = e.key === 'ArrowLeft' ? -1 : 1
      const nextLane = allLanes[(currentIdx + delta + allLanes.length) % allLanes.length]
      const nextId = nextLane?.dataset['laneId']
      if (nextId) {
        this.board.moveItem(this.id, nextId)
        requestAnimationFrame(() => {
          document.querySelector<HTMLElement>(`[data-board-card-id="${this.id}"]`)?.focus()
        })
      }
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const laneEl = this.el.closest('[data-board-lane]')
      if (!laneEl) return
      const cards = Array.from(laneEl.querySelectorAll<HTMLElement>('[data-board-card]'))
      const currentIdx = cards.findIndex((el) => el.dataset['boardCardId'] === this.id)
      if (currentIdx === -1) return
      const delta = e.key === 'ArrowUp' ? -1 : 1
      const targetIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + delta))
      if (targetIdx !== currentIdx) this.board.moveItem(this.id, this.lane.id, targetIdx)
    }
  }

  onDragStart(e: DragEvent): void {
    if (this.disabled) {
      e.preventDefault()
      return
    }
    this.dragStart.emit(e)
  }

  onClick(e: MouseEvent): void {
    if (this.disabled) {
      e.preventDefault()
      return
    }
    // Cmd/Ctrl/Shift+click toggles the selection; plain click clears it and emits.
    if (this.selectable && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      e.preventDefault()
      this.board.toggleSelection(this.id, true)
      return
    }
    if (this.board.draggingIds.includes(this.id)) return
    if (this.board.selectedIds.size > 0) this.board.clearSelection()
    this.cardClick.emit(e)
  }
}

export { boardCardVariants, boardLaneVariants, type BoardCardVariantsProps, type BoardLaneVariantsProps }

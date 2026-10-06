import { Component, Input, signal } from '@angular/core'
import {
  UiBoardCardComponent,
  UiBoardComponent,
  UiBoardLaneBodyComponent,
  UiBoardLaneComponent,
  UiBoardLaneEmptyComponent,
  UiBoardLaneHeaderComponent,
} from '../../../../../packages/registry-angular/components/board/board.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import {
  UiAvatarComponent,
  UiAvatarFallbackComponent,
} from '../../../../../packages/registry-angular/components/avatar/avatar.component'

interface Task {
  id: string
  title: string
  who: string
  initials: string
}

const stages = ['todo', 'doing', 'review', 'done'] as const
type Stage = (typeof stages)[number]
const labels: Record<Stage, string> = {
  todo: 'To do',
  doing: 'In progress',
  review: 'Review',
  done: 'Done',
}
const dot: Record<Stage, string> = {
  todo: 'bg-slate-500',
  doing: 'bg-blue-500',
  review: 'bg-violet-500',
  done: 'bg-emerald-500',
}

// ─── Shared seed factory ──────────────────────────────────────────────────
function seed(): Record<string, Task[]> {
  return {
    todo: [
      { id: 't1', title: 'Draft onboarding email', who: 'Priya Nair', initials: 'PN' },
      { id: 't2', title: 'Schema for analytics events', who: 'Marcus Rivera', initials: 'MR' },
      { id: 't3', title: 'Annual review checklist', who: 'Diane Cho', initials: 'DC' },
    ],
    doing: [
      { id: 't4', title: 'Rework pricing page hero', who: 'Karan Nair', initials: 'KN' },
      { id: 't5', title: 'Wire OAuth refresh path', who: 'Sundar Krishnan', initials: 'SK' },
    ],
    review: [{ id: 't6', title: 'PR #482 — invoice export', who: 'Aditya Mehta', initials: 'AM' }],
    done: [
      { id: 't7', title: 'Q1 OKR alignment doc', who: 'Sarah Connor', initials: 'SC' },
      { id: 't8', title: 'Migrate static images to CDN', who: 'Pooja Iyer', initials: 'PI' },
    ],
  }
}

interface BoardChange {
  itemId: string
  itemIds: string[]
  from: string
  to: string
  index: number
}
interface BoardStateOptions {
  accepts?: (itemId: string, from: string, to: string) => boolean
  onChange?: (e: BoardChange) => void
}

/**
 * Demo-local board state (React's demo `useBoardState`): the registry Board primitive owns
 * no data, so each story keeps lanes + drag state here and passes it into <div ui-board>.
 */
class BoardState {
  readonly lanes: ReturnType<typeof signal<Record<string, Task[]>>>
  readonly draggingId = signal<string | null>(null)
  readonly draggingIds = signal<string[]>([])
  readonly dragOverLaneId = signal<string | null>(null)
  readonly justMovedId = signal<string | null>(null)
  readonly selectedIds = signal<ReadonlySet<string>>(new Set())
  private readonly allowedLanes = new Map<string, readonly string[] | undefined>()
  private readonly laneDisabled = new Map<string, boolean>()
  private dragFrom: string | null = null

  constructor(
    initial: Record<string, Task[]>,
    private readonly opts: BoardStateOptions = {},
  ) {
    this.lanes = signal(initial)
  }

  keys(): string[] {
    return Object.keys(this.lanes())
  }

  count(k: string): number {
    return this.lanes()[k]?.length ?? 0
  }

  private laneOf(id: string, l: Record<string, Task[]>): string | null {
    for (const k of Object.keys(l)) if (l[k]!.some((t) => t.id === id)) return k
    return null
  }

  readonly moveItem = (itemId: string | string[], toLaneId: string, toIndex?: number): void => {
    const ids = Array.isArray(itemId) ? itemId : [itemId]
    const prev = this.lanes()
    const next: Record<string, Task[]> = {}
    for (const k of Object.keys(prev)) next[k] = [...prev[k]!]
    const moving: Task[] = []
    let from: string | null = null
    for (const id of ids) {
      const src = this.laneOf(id, next)
      if (!src) continue
      from = from ?? src
      const idx = next[src]!.findIndex((t) => t.id === id)
      if (idx !== -1) moving.push(next[src]!.splice(idx, 1)[0]!)
    }
    const accepted = (() => {
      if (!moving.length || !next[toLaneId]) return false
      if (this.laneDisabled.get(toLaneId)) return false
      if (this.opts.accepts && from && !this.opts.accepts(moving[0]!.id, from, toLaneId)) return false
      for (const id of ids) {
        const allow = this.allowedLanes.get(id)
        if (allow && !allow.includes(toLaneId)) return false
      }
      return true
    })()
    if (accepted) {
      const at = typeof toIndex === 'number' ? toIndex : next[toLaneId]!.length
      next[toLaneId]!.splice(at, 0, ...moving)
      this.opts.onChange?.({
        itemId: moving[0]!.id,
        itemIds: moving.map((t) => t.id),
        from: from ?? toLaneId,
        to: toLaneId,
        index: at,
      })
      this.lanes.set(next)
    }
    this.justMovedId.set(ids[0]!)
    setTimeout(() => this.justMovedId.set(null), 700)
  }

  readonly toggleSelection = (id: string, additive?: boolean): void => {
    const next = new Set(additive ? this.selectedIds() : [])
    if (next.has(id)) next.delete(id)
    else next.add(id)
    this.selectedIds.set(next)
  }
  readonly clearSelection = (): void => this.selectedIds.set(new Set())
  readonly registerAllowedLanes = (id: string, l: readonly string[] | undefined): void => {
    this.allowedLanes.set(id, l)
  }
  readonly unregisterAllowedLanes = (id: string): void => {
    this.allowedLanes.delete(id)
  }
  readonly registerLaneDisabled = (id: string, d: boolean): void => {
    this.laneDisabled.set(id, d)
  }
  readonly unregisterLaneDisabled = (id: string): void => {
    this.laneDisabled.delete(id)
  }
  readonly isLaneAcceptingFor = (laneId: string): boolean => {
    if (this.laneDisabled.get(laneId)) return false
    const draggingId = this.draggingId()
    if (!draggingId) return true
    const allow = this.allowedLanes.get(draggingId)
    if (allow && !allow.includes(laneId)) return false
    const from = this.dragFrom
    if (this.opts.accepts && from && !this.opts.accepts(draggingId, from, laneId)) return false
    return true
  }

  onDragStart(e: DragEvent, id: string, from: string): void {
    this.dragFrom = from
    this.draggingId.set(id)
    const sel = this.selectedIds().has(id) ? Array.from(this.selectedIds()) : [id]
    this.draggingIds.set(sel)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
    }
  }
  onDragEnd(): void {
    this.draggingId.set(null)
    this.draggingIds.set([])
    this.dragOverLaneId.set(null)
    this.dragFrom = null
  }
  onLaneDragOver(e: DragEvent, laneId: string): void {
    if (this.isLaneAcceptingFor(laneId)) {
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    } else if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'none'
    }
    this.dragOverLaneId.set(laneId)
  }
  onLaneDragLeave(laneId: string): void {
    if (this.dragOverLaneId() === laneId) this.dragOverLaneId.set(null)
  }
  onLaneDrop(e: DragEvent, laneId: string): void {
    e.preventDefault()
    const dragged = this.draggingIds().length ? this.draggingIds() : this.draggingId() ? [this.draggingId()!] : []
    if (dragged.length) this.moveItem(dragged.length === 1 ? dragged[0]! : dragged, laneId)
    this.dragOverLaneId.set(null)
  }
}

/** Angular demo for the board page. Mirrors demos/react/board.tsx story by story. */
@Component({
  selector: 'angular-board-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBoardComponent,
    UiBoardLaneComponent,
    UiBoardLaneHeaderComponent,
    UiBoardLaneBodyComponent,
    UiBoardLaneEmptyComponent,
    UiBoardCardComponent,
    UiButtonComponent,
    UiBadgeComponent,
    UiAvatarComponent,
    UiAvatarFallbackComponent,
  ],
  template: `
    @switch (story) {
      @case ('1 · Four-lane board') {
        <div
          ui-board
          [draggingId]="b1.draggingId()"
          [draggingIds]="b1.draggingIds()"
          [dragOverLaneId]="b1.dragOverLaneId()"
          [justMovedId]="b1.justMovedId()"
          [selectedIds]="b1.selectedIds()"
          [moveItem]="b1.moveItem"
          [toggleSelection]="b1.toggleSelection"
          [clearSelection]="b1.clearSelection"
          [registerAllowedLanes]="b1.registerAllowedLanes"
          [unregisterAllowedLanes]="b1.unregisterAllowedLanes"
          [registerLaneDisabled]="b1.registerLaneDisabled"
          [unregisterLaneDisabled]="b1.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b1.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          @for (s of stages; track s) {
            <div
              ui-board-lane
              [id]="s"
              class="max-h-[420px]"
              (laneDragOver)="b1.onLaneDragOver($event, s)"
              (laneDragLeave)="b1.onLaneDragLeave(s)"
              (laneDrop)="b1.onLaneDrop($event, s)"
            >
              <div ui-board-lane-header>
                <div class="flex items-center gap-2">
                  <span [class]="'size-2 rounded-full ' + dot[s]"></span>
                  <span class="text-sm font-semibold">{{ labels[s] }}</span>
                  <span
                    class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                    >{{ b1.count(s) }}</span
                  >
                </div>
                <button ui-button variant="ghost" size="icon" class="size-7" aria-label="Add">
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
                    class="lucide lucide-plus size-3.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </div>
              <div ui-board-lane-body>
                @for (t of b1.lanes()[s]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    (dragStart)="b1.onDragStart($event, t.id, s)"
                    (dragEnd)="b1.onDragEnd()"
                  >
                    <div class="flex items-center gap-2">
                      <span ui-avatar class="size-7 shrink-0">
                        <span ui-avatar-fallback class="text-xs font-semibold">{{ t.initials }}</span>
                      </span>
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm leading-tight font-medium">{{ t.title }}</p>
                        <p class="text-muted-foreground text-xs">{{ t.who }}</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div ui-board-lane-empty [when]="b1.count(s) === 0">Drag a card here.</div>
            </div>
          }
        </div>
      }
      @case ('2 · Single-lane sortable list') {
        <div
          ui-board
          [draggingId]="b2.draggingId()"
          [draggingIds]="b2.draggingIds()"
          [dragOverLaneId]="b2.dragOverLaneId()"
          [justMovedId]="b2.justMovedId()"
          [selectedIds]="b2.selectedIds()"
          [moveItem]="b2.moveItem"
          [toggleSelection]="b2.toggleSelection"
          [clearSelection]="b2.clearSelection"
          [registerAllowedLanes]="b2.registerAllowedLanes"
          [unregisterAllowedLanes]="b2.unregisterAllowedLanes"
          [registerLaneDisabled]="b2.registerLaneDisabled"
          [unregisterLaneDisabled]="b2.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b2.isLaneAcceptingFor"
          class="max-w-md"
        >
          @for (s of ['list']; track s) {
            <div
              ui-board-lane
              [id]="s"
              (laneDragOver)="b2.onLaneDragOver($event, s)"
              (laneDragLeave)="b2.onLaneDragLeave(s)"
              (laneDrop)="b2.onLaneDrop($event, s)"
            >
              <div ui-board-lane-header>
                <span class="text-sm font-semibold">Today's queue</span>
                <span class="text-muted-foreground text-xs">drag to reorder</span>
              </div>
              <div ui-board-lane-body>
                @for (t of b2.lanes()[s]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    (dragStart)="b2.onDragStart($event, t.id, s)"
                    (dragEnd)="b2.onDragEnd()"
                  >
                    <p class="text-sm font-medium">{{ t.title }}</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">{{ t.who }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
      @case ('3 · Two lanes (before / after, draft / live, …)') {
        <div
          ui-board
          [draggingId]="b3.draggingId()"
          [draggingIds]="b3.draggingIds()"
          [dragOverLaneId]="b3.dragOverLaneId()"
          [justMovedId]="b3.justMovedId()"
          [selectedIds]="b3.selectedIds()"
          [moveItem]="b3.moveItem"
          [toggleSelection]="b3.toggleSelection"
          [clearSelection]="b3.clearSelection"
          [registerAllowedLanes]="b3.registerAllowedLanes"
          [unregisterAllowedLanes]="b3.unregisterAllowedLanes"
          [registerLaneDisabled]="b3.registerLaneDisabled"
          [unregisterLaneDisabled]="b3.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b3.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          @for (k of b3.keys(); track k) {
            <div
              ui-board-lane
              [id]="k"
              (laneDragOver)="b3.onLaneDragOver($event, k)"
              (laneDragLeave)="b3.onLaneDragLeave(k)"
              (laneDrop)="b3.onLaneDrop($event, k)"
            >
              <div ui-board-lane-header>
                <span class="text-sm font-semibold capitalize">{{ k }}</span>
                <span ui-badge variant="secondary" class="tabular-nums">{{ b3.count(k) }}</span>
              </div>
              <div ui-board-lane-body>
                @for (t of b3.lanes()[k]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    (dragStart)="b3.onDragStart($event, t.id, k)"
                    (dragEnd)="b3.onDragEnd()"
                  >
                    <p class="text-sm font-medium">{{ t.title }}</p>
                    <p class="text-muted-foreground text-xs">{{ t.who }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
      @case ('4 · Disabled lane') {
        <div
          ui-board
          [draggingId]="b4.draggingId()"
          [draggingIds]="b4.draggingIds()"
          [dragOverLaneId]="b4.dragOverLaneId()"
          [justMovedId]="b4.justMovedId()"
          [selectedIds]="b4.selectedIds()"
          [moveItem]="b4.moveItem"
          [toggleSelection]="b4.toggleSelection"
          [clearSelection]="b4.clearSelection"
          [registerAllowedLanes]="b4.registerAllowedLanes"
          [unregisterAllowedLanes]="b4.unregisterAllowedLanes"
          [registerLaneDisabled]="b4.registerLaneDisabled"
          [unregisterLaneDisabled]="b4.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b4.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          @for (s of stages; track s) {
            <div
              ui-board-lane
              [id]="s"
              [disabled]="s === 'done'"
              (laneDragOver)="b4.onLaneDragOver($event, s)"
              (laneDragLeave)="b4.onLaneDragLeave(s)"
              (laneDrop)="b4.onLaneDrop($event, s)"
            >
              <div ui-board-lane-header>
                <div class="flex items-center gap-2">
                  <span [class]="'size-2 rounded-full ' + dot[s]"></span>
                  <span class="text-sm font-semibold">{{ labels[s] }}</span>
                  @if (s === 'done') {
                    <span ui-badge variant="secondary" class="text-xs">locked</span>
                  }
                  <span
                    class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                    >{{ b4.count(s) }}</span
                  >
                </div>
              </div>
              <div ui-board-lane-body>
                @for (t of b4.lanes()[s]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    (dragStart)="b4.onDragStart($event, t.id, s)"
                    (dragEnd)="b4.onDragEnd()"
                  >
                    <p class="truncate text-sm font-medium">{{ t.title }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
      @case ('5 · Disabled card') {
        <div
          ui-board
          [draggingId]="b5.draggingId()"
          [draggingIds]="b5.draggingIds()"
          [dragOverLaneId]="b5.dragOverLaneId()"
          [justMovedId]="b5.justMovedId()"
          [selectedIds]="b5.selectedIds()"
          [moveItem]="b5.moveItem"
          [toggleSelection]="b5.toggleSelection"
          [clearSelection]="b5.clearSelection"
          [registerAllowedLanes]="b5.registerAllowedLanes"
          [unregisterAllowedLanes]="b5.unregisterAllowedLanes"
          [registerLaneDisabled]="b5.registerLaneDisabled"
          [unregisterLaneDisabled]="b5.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b5.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          @for (s of stages; track s) {
            <div
              ui-board-lane
              [id]="s"
              (laneDragOver)="b5.onLaneDragOver($event, s)"
              (laneDragLeave)="b5.onLaneDragLeave(s)"
              (laneDrop)="b5.onLaneDrop($event, s)"
            >
              <div ui-board-lane-header>
                <div class="flex items-center gap-2">
                  <span [class]="'size-2 rounded-full ' + dot[s]"></span>
                  <span class="text-sm font-semibold">{{ labels[s] }}</span>
                  <span
                    class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                    >{{ b5.count(s) }}</span
                  >
                </div>
              </div>
              <div ui-board-lane-body>
                @for (t of b5.lanes()[s]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    [disabled]="t.id === 't1' || t.id === 't7'"
                    (dragStart)="b5.onDragStart($event, t.id, s)"
                    (dragEnd)="b5.onDragEnd()"
                  >
                    <p class="truncate text-sm font-medium">{{ t.title }}</p>
                    @if (t.id === 't1' || t.id === 't7') {
                      <p class="text-muted-foreground mt-0.5 text-xs">🔒 locked</p>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
      @case ('6 · Per-card allowedLanes allow-list') {
        <div
          ui-board
          [draggingId]="b6.draggingId()"
          [draggingIds]="b6.draggingIds()"
          [dragOverLaneId]="b6.dragOverLaneId()"
          [justMovedId]="b6.justMovedId()"
          [selectedIds]="b6.selectedIds()"
          [moveItem]="b6.moveItem"
          [toggleSelection]="b6.toggleSelection"
          [clearSelection]="b6.clearSelection"
          [registerAllowedLanes]="b6.registerAllowedLanes"
          [unregisterAllowedLanes]="b6.unregisterAllowedLanes"
          [registerLaneDisabled]="b6.registerLaneDisabled"
          [unregisterLaneDisabled]="b6.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b6.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          @for (s of stages; track s) {
            <div
              ui-board-lane
              [id]="s"
              (laneDragOver)="b6.onLaneDragOver($event, s)"
              (laneDragLeave)="b6.onLaneDragLeave(s)"
              (laneDrop)="b6.onLaneDrop($event, s)"
            >
              <div ui-board-lane-header>
                <div class="flex items-center gap-2">
                  <span [class]="'size-2 rounded-full ' + dot[s]"></span>
                  <span class="text-sm font-semibold">{{ labels[s] }}</span>
                  <span
                    class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                    >{{ b6.count(s) }}</span
                  >
                </div>
              </div>
              <div ui-board-lane-body>
                @for (t of b6.lanes()[s]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    [allowedLanes]="t.id === 't1' ? reviewOnly : undefined"
                    [class]="t.id === 't1' ? 'border-info/60 bg-info/5' : ''"
                    (dragStart)="b6.onDragStart($event, t.id, s)"
                    (dragEnd)="b6.onDragEnd()"
                  >
                    <p class="truncate text-sm font-medium">{{ t.title }}</p>
                    @if (t.id === 't1') {
                      <p class="text-info mt-0.5 text-xs">→ only Review accepts this</p>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
      @case ('7 · Global accepts predicate') {
        <div
          ui-board
          [draggingId]="b7.draggingId()"
          [draggingIds]="b7.draggingIds()"
          [dragOverLaneId]="b7.dragOverLaneId()"
          [justMovedId]="b7.justMovedId()"
          [selectedIds]="b7.selectedIds()"
          [moveItem]="b7.moveItem"
          [toggleSelection]="b7.toggleSelection"
          [clearSelection]="b7.clearSelection"
          [registerAllowedLanes]="b7.registerAllowedLanes"
          [unregisterAllowedLanes]="b7.unregisterAllowedLanes"
          [registerLaneDisabled]="b7.registerLaneDisabled"
          [unregisterLaneDisabled]="b7.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b7.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          @for (s of stages; track s) {
            <div
              ui-board-lane
              [id]="s"
              (laneDragOver)="b7.onLaneDragOver($event, s)"
              (laneDragLeave)="b7.onLaneDragLeave(s)"
              (laneDrop)="b7.onLaneDrop($event, s)"
            >
              <div ui-board-lane-header>
                <div class="flex items-center gap-2">
                  <span [class]="'size-2 rounded-full ' + dot[s]"></span>
                  <span class="text-sm font-semibold">{{ labels[s] }}</span>
                  <span
                    class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                    >{{ b7.count(s) }}</span
                  >
                </div>
              </div>
              <div ui-board-lane-body>
                @for (t of b7.lanes()[s]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    (dragStart)="b7.onDragStart($event, t.id, s)"
                    (dragEnd)="b7.onDragEnd()"
                  >
                    <p class="truncate text-sm font-medium">{{ t.title }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
      @case ('8 · Multi-select drag') {
        <div
          ui-board
          [draggingId]="b8.draggingId()"
          [draggingIds]="b8.draggingIds()"
          [dragOverLaneId]="b8.dragOverLaneId()"
          [justMovedId]="b8.justMovedId()"
          [selectedIds]="b8.selectedIds()"
          [moveItem]="b8.moveItem"
          [toggleSelection]="b8.toggleSelection"
          [clearSelection]="b8.clearSelection"
          [registerAllowedLanes]="b8.registerAllowedLanes"
          [unregisterAllowedLanes]="b8.unregisterAllowedLanes"
          [registerLaneDisabled]="b8.registerLaneDisabled"
          [unregisterLaneDisabled]="b8.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b8.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          @for (s of stages; track s) {
            <div
              ui-board-lane
              [id]="s"
              (laneDragOver)="b8.onLaneDragOver($event, s)"
              (laneDragLeave)="b8.onLaneDragLeave(s)"
              (laneDrop)="b8.onLaneDrop($event, s)"
            >
              <div ui-board-lane-header>
                <div class="flex items-center gap-2">
                  <span [class]="'size-2 rounded-full ' + dot[s]"></span>
                  <span class="text-sm font-semibold">{{ labels[s] }}</span>
                  <span
                    class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                    >{{ b8.count(s) }}</span
                  >
                </div>
              </div>
              <div ui-board-lane-body>
                @for (t of b8.lanes()[s]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    (dragStart)="b8.onDragStart($event, t.id, s)"
                    (dragEnd)="b8.onDragEnd()"
                  >
                    <p class="truncate text-sm font-medium">{{ t.title }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
        <p class="text-muted-foreground mt-2 text-xs">
          Tip: cmd/ctrl/shift+click to add a card to the selection. Selected: {{ b8.selectedIds().size }}
        </p>
      }
      @case ('9 · Programmatic move (no DnD)') {
        <div
          ui-board
          [draggingId]="b9.draggingId()"
          [draggingIds]="b9.draggingIds()"
          [dragOverLaneId]="b9.dragOverLaneId()"
          [justMovedId]="b9.justMovedId()"
          [selectedIds]="b9.selectedIds()"
          [moveItem]="b9.moveItem"
          [toggleSelection]="b9.toggleSelection"
          [clearSelection]="b9.clearSelection"
          [registerAllowedLanes]="b9.registerAllowedLanes"
          [unregisterAllowedLanes]="b9.unregisterAllowedLanes"
          [registerLaneDisabled]="b9.registerLaneDisabled"
          [unregisterLaneDisabled]="b9.unregisterLaneDisabled"
          [isLaneAcceptingFor]="b9.isLaneAcceptingFor"
          class="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          @for (k of ['inbox', 'triaged']; track k) {
            <div
              ui-board-lane
              [id]="k"
              (laneDragOver)="b9.onLaneDragOver($event, k)"
              (laneDragLeave)="b9.onLaneDragLeave(k)"
              (laneDrop)="b9.onLaneDrop($event, k)"
            >
              <div ui-board-lane-header>
                <span class="text-sm font-semibold capitalize">{{ k }}</span>
                <span ui-badge variant="secondary">{{ b9.count(k) }}</span>
              </div>
              <div ui-board-lane-body>
                @for (t of b9.lanes()[k]; track t.id) {
                  <div
                    ui-board-card
                    [id]="t.id"
                    (dragStart)="b9.onDragStart($event, t.id, k)"
                    (dragEnd)="b9.onDragEnd()"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <p class="truncate text-sm font-medium">{{ t.title }}</p>
                      @if (k === 'inbox') {
                        <button
                          ui-button
                          size="sm"
                          variant="outline"
                          (click)="$event.stopPropagation(); b9.moveItem(t.id, 'triaged')"
                        >
                          Triage →
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
              <div ui-board-lane-empty [when]="b9.count(k) === 0">Empty.</div>
            </div>
          }
        </div>
      }
      @case ('10 · onChange audit log') {
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div
            ui-board
            [draggingId]="b10.draggingId()"
            [draggingIds]="b10.draggingIds()"
            [dragOverLaneId]="b10.dragOverLaneId()"
            [justMovedId]="b10.justMovedId()"
            [selectedIds]="b10.selectedIds()"
            [moveItem]="b10.moveItem"
            [toggleSelection]="b10.toggleSelection"
            [clearSelection]="b10.clearSelection"
            [registerAllowedLanes]="b10.registerAllowedLanes"
            [unregisterAllowedLanes]="b10.unregisterAllowedLanes"
            [registerLaneDisabled]="b10.registerLaneDisabled"
            [unregisterLaneDisabled]="b10.unregisterLaneDisabled"
            [isLaneAcceptingFor]="b10.isLaneAcceptingFor"
            class="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2"
          >
            @for (s of ['todo', 'done']; track s) {
              <div
                ui-board-lane
                [id]="s"
                (laneDragOver)="b10.onLaneDragOver($event, s)"
                (laneDragLeave)="b10.onLaneDragLeave(s)"
                (laneDrop)="b10.onLaneDrop($event, s)"
              >
                <div ui-board-lane-header>
                  <span class="text-sm font-semibold capitalize">{{ s }}</span>
                  <span ui-badge variant="secondary">{{ b10.count(s) }}</span>
                </div>
                <div ui-board-lane-body>
                  @for (t of b10.lanes()[s]; track t.id) {
                    <div
                      ui-board-card
                      [id]="t.id"
                      (dragStart)="b10.onDragStart($event, t.id, s)"
                      (dragEnd)="b10.onDragEnd()"
                    >
                      <p class="truncate text-sm font-medium">{{ t.title }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          <div class="rounded-md border p-3">
            <p class="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Audit log</p>
            @if (log().length) {
              <ul class="space-y-1">
                @for (line of log(); track $index) {
                  <li class="text-foreground/80 font-mono text-xs tabular-nums">{{ line }}</li>
                }
              </ul>
            } @else {
              <p class="text-muted-foreground text-xs">Drag a card to log an event.</p>
            }
          </div>
        </div>
      }
      @case ('11 · Keyboard a11y') {
        <div class="text-muted-foreground bg-muted/30 rounded-md border p-3 text-xs">
          Focus a card in any board above and use
          <kbd class="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Space</kbd> +
          <kbd class="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Arrow</kbd> keys.
        </div>
      }
    }
  `,
})
export class AngularBoardDemoComponent {
  @Input() story = '1 · Four-lane board'
  readonly stages = stages
  readonly labels = labels
  readonly dot = dot
  readonly reviewOnly = ['review']
  readonly log = signal<string[]>([])
  readonly b1 = new BoardState(seed())
  readonly b2 = new BoardState({
    list: [
      { id: 's1', title: 'Tighten dashboard KPI tiles', who: 'Priya', initials: 'P' },
      { id: 's2', title: 'Reduce time-to-first-byte', who: 'Marcus', initials: 'M' },
      { id: 's3', title: 'Update offer letter template', who: 'Diane', initials: 'D' },
      { id: 's4', title: 'Refactor session-token rotation', who: 'Sundar', initials: 'S' },
    ],
  })
  readonly b3 = new BoardState({
    backlog: [
      { id: 'd1', title: 'Sketch new dashboard hero', who: 'Karan', initials: 'K' },
      { id: 'd2', title: 'Audit time-off mock data', who: 'Marcus', initials: 'M' },
      { id: 'd3', title: 'Test print stylesheet', who: 'Diane', initials: 'D' },
    ],
    shipped: [{ id: 'd4', title: 'Onboarding tour v2', who: 'Priya', initials: 'P' }],
  })
  readonly b4 = new BoardState(seed())
  readonly b5 = new BoardState(seed())
  readonly b6 = new BoardState(seed())
  readonly b7 = new BoardState(seed(), { accepts: (_id, from, to) => !(from === 'done' && to === 'todo') })
  readonly b8 = new BoardState(seed())
  readonly b9 = new BoardState({
    inbox: [
      { id: 'p1', title: 'New ticket — exporter timeouts', who: 'System', initials: 'SY' },
      { id: 'p2', title: 'New ticket — sso for Acme', who: 'System', initials: 'SY' },
    ],
    triaged: [],
  })
  readonly b10 = new BoardState(
    { todo: seed().todo, done: seed().done },
    {
      onChange: ({ itemIds, from, to }) => {
        this.log.update((cur) =>
          [
            `[${new Date().toLocaleTimeString()}] ${itemIds.length === 1 ? itemIds[0] : `${itemIds.length} items`} · ${from} → ${to}`,
            ...cur,
          ].slice(0, 8),
        )
      },
    },
  )
}

import { useCallback, useMemo, useRef, useState } from 'react'
import Story from '../../components/story/Story'
import { Plus } from 'lucide-react'
import { Board, BoardCard, BoardLane, BoardLaneBody, BoardLaneEmpty, BoardLaneHeader } from '@react-registry/board'
import { Button } from '@react-registry/button'
import { Badge } from '@react-registry/badge'
import { Avatar, AvatarFallback } from '@react-registry/avatar'

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

/* ──────────────────────────────────────────────────────────────────────────
 * The React `@uipkge/board` registry exposes the Board primitive but NOT a
 * `useBoard` hook (the Vue registry ships `@/composables/useBoard`; the React
 * mirror leaves state to the consumer and drives the primitive through props:
 * draggingId/draggingIds/dragOverLaneId/justMovedId/selectedIds + moveItem +
 * the allowed-lanes / lane-disabled registries). This local hook reconstructs
 * that surface for the demo so every story stays faithful to the Vue version.
 * It is intentionally a demo-local helper — not a registry export.
 * ────────────────────────────────────────────────────────────────────────── */
interface BoardChange {
  itemId: string
  itemIds: string[]
  from: string
  to: string
  index: number
}
interface UseBoardOptions {
  accepts?: (itemId: string, from: string, to: string) => boolean
  onChange?: (e: BoardChange) => void
}

function useBoardState(initial: Record<string, Task[]>, opts: UseBoardOptions = {}) {
  const [lanes, setLanes] = useState<Record<string, Task[]>>(initial)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [draggingIds, setDraggingIds] = useState<string[]>([])
  const [dragOverLaneId, setDragOverLaneId] = useState<string | null>(null)
  const [justMovedId, setJustMovedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allowedLanesRef = useRef<Map<string, readonly string[] | undefined>>(new Map())
  const laneDisabledRef = useRef<Map<string, boolean>>(new Map())
  const dragFromRef = useRef<string | null>(null)
  const optsRef = useRef(opts)
  optsRef.current = opts

  const laneOf = useCallback((id: string, l: Record<string, Task[]>): string | null => {
    for (const k of Object.keys(l)) if (l[k]!.some((t) => t.id === id)) return k
    return null
  }, [])

  const moveItem = useCallback(
    (itemId: string | string[], toLaneId: string, toIndex?: number) => {
      const ids = Array.isArray(itemId) ? itemId : [itemId]
      setLanes((prev) => {
        const next: Record<string, Task[]> = {}
        for (const k of Object.keys(prev)) next[k] = [...prev[k]!]
        const moving: Task[] = []
        let from: string | null = null
        for (const id of ids) {
          const src = laneOf(id, next)
          if (!src) continue
          from = from ?? src
          const idx = next[src]!.findIndex((t) => t.id === id)
          if (idx !== -1) moving.push(next[src]!.splice(idx, 1)[0]!)
        }
        if (!moving.length || !next[toLaneId]) return prev
        if (laneDisabledRef.current.get(toLaneId)) return prev
        if (optsRef.current.accepts && from && !optsRef.current.accepts(moving[0]!.id, from, toLaneId)) return prev
        for (const id of ids) {
          const allow = allowedLanesRef.current.get(id)
          if (allow && !allow.includes(toLaneId)) return prev
        }
        const at = typeof toIndex === 'number' ? toIndex : next[toLaneId]!.length
        next[toLaneId]!.splice(at, 0, ...moving)
        optsRef.current.onChange?.({
          itemId: moving[0]!.id,
          itemIds: moving.map((t) => t.id),
          from: from ?? toLaneId,
          to: toLaneId,
          index: at,
        })
        return next
      })
      setJustMovedId(Array.isArray(itemId) ? itemId[0]! : itemId)
      setTimeout(() => setJustMovedId(null), 700)
    },
    [laneOf],
  )

  const toggleSelection = useCallback((id: string, additive?: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(additive ? prev : [])
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])
  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  const registerAllowedLanes = useCallback((id: string, l: readonly string[] | undefined) => {
    allowedLanesRef.current.set(id, l)
  }, [])
  const unregisterAllowedLanes = useCallback((id: string) => {
    allowedLanesRef.current.delete(id)
  }, [])
  const registerLaneDisabled = useCallback((id: string, d: boolean) => {
    laneDisabledRef.current.set(id, d)
  }, [])
  const unregisterLaneDisabled = useCallback((id: string) => {
    laneDisabledRef.current.delete(id)
  }, [])
  const isLaneAcceptingFor = useCallback(
    (laneId: string) => {
      if (laneDisabledRef.current.get(laneId)) return false
      if (!draggingId) return true
      const allow = allowedLanesRef.current.get(draggingId)
      if (allow && !allow.includes(laneId)) return false
      const from = dragFromRef.current
      if (optsRef.current.accepts && from && !optsRef.current.accepts(draggingId, from, laneId)) return false
      return true
    },
    [draggingId],
  )

  const handlers = useMemo(
    () => ({
      onDragStart: (e: React.DragEvent, id: string, from: string) => {
        dragFromRef.current = from
        setDraggingId(id)
        const sel = selectedIds.has(id) ? Array.from(selectedIds) : [id]
        setDraggingIds(sel)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', id)
      },
      onDragEnd: () => {
        setDraggingId(null)
        setDraggingIds([])
        setDragOverLaneId(null)
        dragFromRef.current = null
      },
      onLaneDragOver: (e: React.DragEvent, laneId: string) => {
        if (isLaneAcceptingFor(laneId)) {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
        } else {
          e.dataTransfer.dropEffect = 'none'
        }
        setDragOverLaneId(laneId)
      },
      onLaneDragLeave: (laneId: string) => {
        setDragOverLaneId((cur) => (cur === laneId ? null : cur))
      },
      onLaneDrop: (e: React.DragEvent, laneId: string) => {
        e.preventDefault()
        const dragged = draggingIds.length ? draggingIds : draggingId ? [draggingId] : []
        if (dragged.length) moveItem(dragged.length === 1 ? dragged[0]! : dragged, laneId)
        setDragOverLaneId(null)
      },
    }),
    [draggingId, draggingIds, selectedIds, isLaneAcceptingFor, moveItem],
  )

  return {
    lanes,
    state: { draggingId, draggingIds, dragOverLaneId, justMovedId, selectedIds },
    moveItem,
    toggleSelection,
    clearSelection,
    registerAllowedLanes,
    unregisterAllowedLanes,
    registerLaneDisabled,
    unregisterLaneDisabled,
    isLaneAcceptingFor,
    handlers,
  }
}

// Spread the external-state props onto <Board> in one shot for every story.
function boardProps(b: ReturnType<typeof useBoardState>) {
  return {
    draggingId: b.state.draggingId,
    draggingIds: b.state.draggingIds,
    dragOverLaneId: b.state.dragOverLaneId,
    justMovedId: b.state.justMovedId,
    selectedIds: b.state.selectedIds,
    moveItem: b.moveItem,
    toggleSelection: b.toggleSelection,
    clearSelection: b.clearSelection,
    registerAllowedLanes: b.registerAllowedLanes,
    unregisterAllowedLanes: b.unregisterAllowedLanes,
    registerLaneDisabled: b.registerLaneDisabled,
    unregisterLaneDisabled: b.unregisterLaneDisabled,
    isLaneAcceptingFor: b.isLaneAcceptingFor,
  }
}

const countOf = (l: Record<string, Task[]>, k: string) => l[k]?.length ?? 0

export default function BoardDemo() {
  const b1 = useBoardState(seed())
  const b2 = useBoardState({
    list: [
      { id: 's1', title: 'Tighten dashboard KPI tiles', who: 'Priya', initials: 'P' },
      { id: 's2', title: 'Reduce time-to-first-byte', who: 'Marcus', initials: 'M' },
      { id: 's3', title: 'Update offer letter template', who: 'Diane', initials: 'D' },
      { id: 's4', title: 'Refactor session-token rotation', who: 'Sundar', initials: 'S' },
    ],
  })
  const b3 = useBoardState({
    backlog: [
      { id: 'd1', title: 'Sketch new dashboard hero', who: 'Karan', initials: 'K' },
      { id: 'd2', title: 'Audit time-off mock data', who: 'Marcus', initials: 'M' },
      { id: 'd3', title: 'Test print stylesheet', who: 'Diane', initials: 'D' },
    ],
    shipped: [{ id: 'd4', title: 'Onboarding tour v2', who: 'Priya', initials: 'P' }],
  })
  const b4 = useBoardState(seed())
  const b5 = useBoardState(seed())
  const b6 = useBoardState(seed())
  const b7 = useBoardState(seed(), { accepts: (_id, from, to) => !(from === 'done' && to === 'todo') })
  const b8 = useBoardState(seed())
  const b9 = useBoardState({
    inbox: [
      { id: 'p1', title: 'New ticket — exporter timeouts', who: 'System', initials: 'SY' },
      { id: 'p2', title: 'New ticket — sso for Acme', who: 'System', initials: 'SY' },
    ],
    triaged: [],
  })
  const [log, setLog] = useState<string[]>([])
  const b10 = useBoardState(
    { todo: seed().todo, done: seed().done },
    {
      onChange: ({ itemIds, from, to }) => {
        setLog((cur) =>
          [
            `[${new Date().toLocaleTimeString()}] ${itemIds.length === 1 ? itemIds[0] : `${itemIds.length} items`} · ${from} → ${to}`,
            ...cur,
          ].slice(0, 8),
        )
      },
    },
  )

  return (
    <>
      {/* 1. Default ─────────────────────────────────────────────────────── */}
      <Story
        title="1 · Four-lane board"
        description="The basic shape: Board wraps a grid of BoardLanes, each lane composes BoardLaneHeader / BoardLaneBody / BoardLaneEmpty. Drag a card between any two columns — siblings reflow via the motion-list preset, the landed card gets a brief ring."
      >
        <Board {...boardProps(b1)} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => (
            <BoardLane
              key={s}
              id={s}
              className="max-h-[420px]"
              onLaneDragOver={(e) => b1.handlers.onLaneDragOver(e, s)}
              onLaneDragLeave={() => b1.handlers.onLaneDragLeave(s)}
              onLaneDrop={(e) => b1.handlers.onLaneDrop(e, s)}
            >
              <BoardLaneHeader>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${dot[s]}`} />
                  <span className="text-sm font-semibold">{labels[s]}</span>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {countOf(b1.lanes, s)}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Add">
                  <Plus className="size-3.5" />
                </Button>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b1.lanes[s]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    onDragStart={(e) => b1.handlers.onDragStart(e, t.id, s)}
                    onDragEnd={b1.handlers.onDragEnd}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 shrink-0">
                        <AvatarFallback className="text-xs font-semibold">{t.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm leading-tight font-medium">{t.title}</p>
                        <p className="text-muted-foreground text-xs">{t.who}</p>
                      </div>
                    </div>
                  </BoardCard>
                ))}
              </BoardLaneBody>
              <BoardLaneEmpty when={countOf(b1.lanes, s) === 0}>Drag a card here.</BoardLaneEmpty>
            </BoardLane>
          ))}
        </Board>
      </Story>

      {/* 2. Single lane ────────────────────────────────────────────────── */}
      <Story
        title="2 · Single-lane sortable list"
        description="One lane = a reorderable list. Same drop math, same insertion-index. The Board primitive collapses freely from N lanes to 1 by virtue of being layout-agnostic."
      >
        <Board {...boardProps(b2)} className="max-w-md">
          <BoardLane
            id="list"
            onLaneDragOver={(e) => b2.handlers.onLaneDragOver(e, 'list')}
            onLaneDragLeave={() => b2.handlers.onLaneDragLeave('list')}
            onLaneDrop={(e) => b2.handlers.onLaneDrop(e, 'list')}
          >
            <BoardLaneHeader>
              <span className="text-sm font-semibold">Today's queue</span>
              <span className="text-muted-foreground text-xs">drag to reorder</span>
            </BoardLaneHeader>
            <BoardLaneBody>
              {b2.lanes.list!.map((t) => (
                <BoardCard
                  key={t.id}
                  id={t.id}
                  onDragStart={(e) => b2.handlers.onDragStart(e, t.id, 'list')}
                  onDragEnd={b2.handlers.onDragEnd}
                >
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{t.who}</p>
                </BoardCard>
              ))}
            </BoardLaneBody>
          </BoardLane>
        </Board>
      </Story>

      {/* 3. Dual lanes ──────────────────────────────────────────────────── */}
      <Story
        title="3 · Two lanes (before / after, draft / live, …)"
        description="Same shape, two lanes. Useful for promote / publish flows, draft → live swaps, comparison boards."
      >
        <Board {...boardProps(b3)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Object.keys(b3.lanes).map((k) => (
            <BoardLane
              key={k}
              id={k}
              onLaneDragOver={(e) => b3.handlers.onLaneDragOver(e, k)}
              onLaneDragLeave={() => b3.handlers.onLaneDragLeave(k)}
              onLaneDrop={(e) => b3.handlers.onLaneDrop(e, k)}
            >
              <BoardLaneHeader>
                <span className="text-sm font-semibold capitalize">{k}</span>
                <Badge variant="secondary" className="tabular-nums">
                  {countOf(b3.lanes, k)}
                </Badge>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b3.lanes[k]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    onDragStart={(e) => b3.handlers.onDragStart(e, t.id, k)}
                    onDragEnd={b3.handlers.onDragEnd}
                  >
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-muted-foreground text-xs">{t.who}</p>
                  </BoardCard>
                ))}
              </BoardLaneBody>
            </BoardLane>
          ))}
        </Board>
      </Story>

      {/* 4. Disabled lane ──────────────────────────────────────────────── */}
      <Story
        title="4 · Disabled lane"
        description='Pass :disabled on a BoardLane to reject all drops on it. The lane keeps its cards (and their drag) but the drop target goes inert and dims. Here "Done" is locked — try dragging anything onto it.'
      >
        <Board {...boardProps(b4)} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => (
            <BoardLane
              key={s}
              id={s}
              disabled={s === 'done'}
              onLaneDragOver={(e) => b4.handlers.onLaneDragOver(e, s)}
              onLaneDragLeave={() => b4.handlers.onLaneDragLeave(s)}
              onLaneDrop={(e) => b4.handlers.onLaneDrop(e, s)}
            >
              <BoardLaneHeader>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${dot[s]}`} />
                  <span className="text-sm font-semibold">{labels[s]}</span>
                  {s === 'done' && (
                    <Badge variant="secondary" className="text-xs">
                      locked
                    </Badge>
                  )}
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {countOf(b4.lanes, s)}
                  </span>
                </div>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b4.lanes[s]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    onDragStart={(e) => b4.handlers.onDragStart(e, t.id, s)}
                    onDragEnd={b4.handlers.onDragEnd}
                  >
                    <p className="truncate text-sm font-medium">{t.title}</p>
                  </BoardCard>
                ))}
              </BoardLaneBody>
            </BoardLane>
          ))}
        </Board>
      </Story>

      {/* 5. Disabled card ──────────────────────────────────────────────── */}
      <Story
        title="5 · Disabled card"
        description="Mark a card :disabled to lock it in place — no drag, no click, dimmed + grayscaled. Useful for archived items, server-policy locked records, or a step you haven't unlocked yet."
      >
        <Board {...boardProps(b5)} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => (
            <BoardLane
              key={s}
              id={s}
              onLaneDragOver={(e) => b5.handlers.onLaneDragOver(e, s)}
              onLaneDragLeave={() => b5.handlers.onLaneDragLeave(s)}
              onLaneDrop={(e) => b5.handlers.onLaneDrop(e, s)}
            >
              <BoardLaneHeader>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${dot[s]}`} />
                  <span className="text-sm font-semibold">{labels[s]}</span>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {countOf(b5.lanes, s)}
                  </span>
                </div>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b5.lanes[s]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    disabled={t.id === 't1' || t.id === 't7'}
                    onDragStart={(e) => b5.handlers.onDragStart(e, t.id, s)}
                    onDragEnd={b5.handlers.onDragEnd}
                  >
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    {(t.id === 't1' || t.id === 't7') && (
                      <p className="text-muted-foreground mt-0.5 text-xs">🔒 locked</p>
                    )}
                  </BoardCard>
                ))}
              </BoardLaneBody>
            </BoardLane>
          ))}
        </Board>
      </Story>

      {/* 6. Per-card allowedLanes ──────────────────────────────────────── */}
      <Story
        title="6 · Per-card allowedLanes allow-list"
        description={
          'Pass :allowed-lanes on any BoardCard to whitelist its destinations. Other lanes silently reject the drop (with `dropEffect = "none"`). Try the highlighted blue card — it only accepts "review" as a destination.'
        }
      >
        <Board {...boardProps(b6)} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => (
            <BoardLane
              key={s}
              id={s}
              onLaneDragOver={(e) => b6.handlers.onLaneDragOver(e, s)}
              onLaneDragLeave={() => b6.handlers.onLaneDragLeave(s)}
              onLaneDrop={(e) => b6.handlers.onLaneDrop(e, s)}
            >
              <BoardLaneHeader>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${dot[s]}`} />
                  <span className="text-sm font-semibold">{labels[s]}</span>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {countOf(b6.lanes, s)}
                  </span>
                </div>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b6.lanes[s]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    allowedLanes={t.id === 't1' ? ['review'] : undefined}
                    className={t.id === 't1' ? 'border-info/60 bg-info/5' : ''}
                    onDragStart={(e) => b6.handlers.onDragStart(e, t.id, s)}
                    onDragEnd={b6.handlers.onDragEnd}
                  >
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    {t.id === 't1' && <p className="text-info mt-0.5 text-xs">→ only Review accepts this</p>}
                  </BoardCard>
                ))}
              </BoardLaneBody>
            </BoardLane>
          ))}
        </Board>
      </Story>

      {/* 7. accepts predicate ──────────────────────────────────────────── */}
      <Story
        title="7 · Global accepts predicate"
        description={
          'Pass an :accepts function to useBoard to encode rules across the whole board. Here we block any drop from "done" back to "todo" — try dragging "Q1 OKR alignment doc" from Done over Todo.'
        }
      >
        <Board {...boardProps(b7)} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => (
            <BoardLane
              key={s}
              id={s}
              onLaneDragOver={(e) => b7.handlers.onLaneDragOver(e, s)}
              onLaneDragLeave={() => b7.handlers.onLaneDragLeave(s)}
              onLaneDrop={(e) => b7.handlers.onLaneDrop(e, s)}
            >
              <BoardLaneHeader>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${dot[s]}`} />
                  <span className="text-sm font-semibold">{labels[s]}</span>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {countOf(b7.lanes, s)}
                  </span>
                </div>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b7.lanes[s]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    onDragStart={(e) => b7.handlers.onDragStart(e, t.id, s)}
                    onDragEnd={b7.handlers.onDragEnd}
                  >
                    <p className="truncate text-sm font-medium">{t.title}</p>
                  </BoardCard>
                ))}
              </BoardLaneBody>
            </BoardLane>
          ))}
        </Board>
      </Story>

      {/* 8. Multi-select drag ──────────────────────────────────────────── */}
      <Story
        title="8 · Multi-select drag"
        description="Cmd/Ctrl/Shift+click cards to add them to a selection (you'll see a ring on each). Then grab any selected card — every selected card moves to the drop target together, preserving relative order. Plain click clears the selection (and emits @click to your detail handler)."
      >
        <Board {...boardProps(b8)} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => (
            <BoardLane
              key={s}
              id={s}
              onLaneDragOver={(e) => b8.handlers.onLaneDragOver(e, s)}
              onLaneDragLeave={() => b8.handlers.onLaneDragLeave(s)}
              onLaneDrop={(e) => b8.handlers.onLaneDrop(e, s)}
            >
              <BoardLaneHeader>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${dot[s]}`} />
                  <span className="text-sm font-semibold">{labels[s]}</span>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {countOf(b8.lanes, s)}
                  </span>
                </div>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b8.lanes[s]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    onDragStart={(e) => b8.handlers.onDragStart(e, t.id, s)}
                    onDragEnd={b8.handlers.onDragEnd}
                  >
                    <p className="truncate text-sm font-medium">{t.title}</p>
                  </BoardCard>
                ))}
              </BoardLaneBody>
            </BoardLane>
          ))}
        </Board>
        <p className="text-muted-foreground mt-2 text-xs">
          Tip: cmd/ctrl/shift+click to add a card to the selection. Selected: {b8.state.selectedIds.size}
        </p>
      </Story>

      {/* 9. Programmatic moveItem ──────────────────────────────────────── */}
      <Story
        title="9 · Programmatic move (no DnD)"
        description="moveItem() is exposed for keyboard a11y, undo, or server-pushed updates. Here, a Triage button calls moveItem(id, 'triaged') with no drag at all — same animation, same onChange."
      >
        <Board {...boardProps(b9)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {['inbox', 'triaged'].map((k) => (
            <BoardLane
              key={k}
              id={k}
              onLaneDragOver={(e) => b9.handlers.onLaneDragOver(e, k)}
              onLaneDragLeave={() => b9.handlers.onLaneDragLeave(k)}
              onLaneDrop={(e) => b9.handlers.onLaneDrop(e, k)}
            >
              <BoardLaneHeader>
                <span className="text-sm font-semibold capitalize">{k}</span>
                <Badge variant="secondary">{countOf(b9.lanes, k)}</Badge>
              </BoardLaneHeader>
              <BoardLaneBody>
                {b9.lanes[k]!.map((t) => (
                  <BoardCard
                    key={t.id}
                    id={t.id}
                    onDragStart={(e) => b9.handlers.onDragStart(e, t.id, k)}
                    onDragEnd={b9.handlers.onDragEnd}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      {k === 'inbox' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            b9.moveItem(t.id, 'triaged')
                          }}
                        >
                          Triage →
                        </Button>
                      )}
                    </div>
                  </BoardCard>
                ))}
              </BoardLaneBody>
              <BoardLaneEmpty when={countOf(b9.lanes, k) === 0}>Empty.</BoardLaneEmpty>
            </BoardLane>
          ))}
        </Board>
      </Story>

      {/* 10. onChange + audit ──────────────────────────────────────────── */}
      <Story
        title="10 · onChange audit log"
        description="useBoard fires onChange({ itemId, itemIds, from, to, index }) on every move — pointer drag, keyboard move, or programmatic moveItem. Wire this to your store, your analytics, your audit log."
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Board {...boardProps(b10)} className="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2">
            {['todo', 'done'].map((s) => (
              <BoardLane
                key={s}
                id={s}
                onLaneDragOver={(e) => b10.handlers.onLaneDragOver(e, s)}
                onLaneDragLeave={() => b10.handlers.onLaneDragLeave(s)}
                onLaneDrop={(e) => b10.handlers.onLaneDrop(e, s)}
              >
                <BoardLaneHeader>
                  <span className="text-sm font-semibold capitalize">{s}</span>
                  <Badge variant="secondary">{countOf(b10.lanes, s)}</Badge>
                </BoardLaneHeader>
                <BoardLaneBody>
                  {b10.lanes[s]!.map((t) => (
                    <BoardCard
                      key={t.id}
                      id={t.id}
                      onDragStart={(e) => b10.handlers.onDragStart(e, t.id, s)}
                      onDragEnd={b10.handlers.onDragEnd}
                    >
                      <p className="truncate text-sm font-medium">{t.title}</p>
                    </BoardCard>
                  ))}
                </BoardLaneBody>
              </BoardLane>
            ))}
          </Board>
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Audit log</p>
            {log.length ? (
              <ul className="space-y-1">
                {log.map((line, i) => (
                  <li key={i} className="text-foreground/80 font-mono text-xs tabular-nums">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-xs">Drag a card to log an event.</p>
            )}
          </div>
        </div>
      </Story>

      {/* 11. Keyboard a11y ──────────────────────────────────────────────── */}
      <Story
        title="11 · Keyboard a11y"
        description="Every BoardCard is reachable via Tab. Press Space to grab — the card gets aria-grabbed and a visible ring. While grabbed: ArrowLeft / ArrowRight switches lanes, ArrowUp / ArrowDown reorders within the lane. Press Space again (or Escape) to drop. Try it on any board above."
      >
        <div className="text-muted-foreground bg-muted/30 rounded-md border p-3 text-xs">
          Focus a card in any board above and use{' '}
          <kbd className="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Space</kbd> +{' '}
          <kbd className="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Arrow</kbd> keys.
        </div>
      </Story>
    </>
  )
}

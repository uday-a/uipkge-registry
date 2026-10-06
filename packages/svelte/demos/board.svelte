<script lang="ts">
  import {
    Board,
    BoardCard,
    BoardLane,
    BoardLaneBody,
    BoardLaneEmpty,
    BoardLaneHeader,
  } from '@svelte-registry/board'
  import { Button } from '@svelte-registry/button'
  import { Badge } from '@svelte-registry/badge'
  import { Plus } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  interface Task {
    id: string
    title: string
    who: string
    initials: string
  }

  interface DropEvent {
    itemId: string
    itemIds: string[]
    from: string
    to: string
    index: number
  }

  // Local port of the `use-board` state helper (insertion-index drop math,
  // multi-select drag, allow-lists, disabled lanes, accepts predicate).
  // Called at top level so runes work inside.
  function createBoard<TItem extends { id: string }>(opts: {
    getLanes: () => Record<string, TItem[]>
    setLanes: (lanes: Record<string, TItem[]>) => void
    accepts?: (itemId: string, fromLaneId: string, toLaneId: string) => boolean
    onChange?: (event: DropEvent) => void
    highlightMs?: number
  }) {
    const accepts = opts.accepts ?? (() => true)
    const highlightMs = opts.highlightMs ?? 600

    const state = $state({
      draggingId: null as string | null,
      draggingIds: [] as readonly string[],
      dragOverLaneId: null as string | null,
      justMovedId: null as string | null,
      selectedIds: new Set<string>() as ReadonlySet<string>,
    })

    let sourceLaneByDragId = $state<string | null>(null)
    let highlightTimer: ReturnType<typeof setTimeout> | null = null

    const allowedLanesByCard = new Map<string, readonly string[]>()
    const disabledLanes = new Set<string>()

    function findItem(itemId: string): { item: TItem; laneId: string; index: number } | null {
      const lanes = opts.getLanes()
      for (const laneId of Object.keys(lanes)) {
        const idx = lanes[laneId]!.findIndex((it) => it.id === itemId)
        if (idx !== -1) return { item: lanes[laneId]![idx]!, laneId, index: idx }
      }
      return null
    }

    function isAllowed(itemId: string, fromLaneId: string, toLaneId: string): boolean {
      if (disabledLanes.has(toLaneId)) return false
      const allow = allowedLanesByCard.get(itemId)
      if (allow && !allow.includes(toLaneId)) return false
      return accepts(itemId, fromLaneId, toLaneId)
    }

    function flashMoved(itemId: string) {
      state.justMovedId = itemId
      if (highlightTimer) clearTimeout(highlightTimer)
      highlightTimer = setTimeout(() => {
        if (state.justMovedId === itemId) state.justMovedId = null
      }, highlightMs)
    }

    function moveItem(itemId: string | string[], toLaneId: string, toIndex?: number) {
      const ids = Array.isArray(itemId) ? itemId : [itemId]
      if (ids.length === 0) return

      const resolved = ids
        .map((id) => findItem(id))
        .filter((x): x is { item: TItem; laneId: string; index: number } => !!x)
      if (resolved.length === 0) return

      // All-or-nothing: if ANY item is rejected by the destination, the
      // whole move aborts — matches the dragover visual.
      const allAllowed = resolved.every((r) => isAllowed(r.item.id, r.laneId, toLaneId))
      if (!allAllowed) return
      const movable = resolved

      const lanes = { ...opts.getLanes() }
      const byLane = new Map<string, number[]>()
      for (const r of movable) {
        if (!byLane.has(r.laneId)) byLane.set(r.laneId, [])
        byLane.get(r.laneId)!.push(r.index)
      }
      for (const [laneId, indices] of byLane.entries()) {
        const next = [...lanes[laneId]!]
        indices
          .sort((a, b) => b - a)
          .forEach((idx) => next.splice(idx, 1))
        lanes[laneId] = next
      }

      const inserts = movable.map((r) => r.item)
      const dest = [...(lanes[toLaneId] ?? [])]
      const insertAt = Math.max(0, Math.min(dest.length, toIndex ?? dest.length))
      dest.splice(insertAt, 0, ...inserts)
      lanes[toLaneId] = dest
      opts.setLanes(lanes)

      flashMoved(movable[0]!.item.id)
      opts.onChange?.({
        itemId: movable[0]!.item.id,
        itemIds: movable.map((r) => r.item.id),
        from: movable[0]!.laneId,
        to: toLaneId,
        index: insertAt,
      })
    }

    function computeInsertIndex(e: DragEvent, laneId: string): number {
      const laneEl = (e.currentTarget as HTMLElement | null) ?? null
      if (!laneEl) return opts.getLanes()[laneId]?.length ?? 0
      const cards = Array.from(laneEl.querySelectorAll<HTMLElement>('[data-board-card]'))
      const dragging = new Set(state.draggingIds)
      const otherCards = cards.filter((c) => {
        const id = c.getAttribute('data-board-card-id')
        return id ? !dragging.has(id) : true
      })
      for (let i = 0; i < otherCards.length; i++) {
        const rect = otherCards[i]!.getBoundingClientRect()
        const midpoint = rect.top + rect.height / 2
        if (e.clientY < midpoint) return i
      }
      return otherCards.length
    }

    function toggleSelection(itemId: string, additive = false) {
      const next = new Set(state.selectedIds)
      if (additive) {
        if (next.has(itemId)) next.delete(itemId)
        else next.add(itemId)
      } else {
        next.clear()
        next.add(itemId)
      }
      state.selectedIds = next
    }

    function clearSelection() {
      if (state.selectedIds.size === 0) return
      state.selectedIds = new Set<string>()
    }

    const handlers = {
      onDragStart(e: DragEvent, itemId: string, laneId: string) {
        const inSelection = state.selectedIds.has(itemId)
        const ids = inSelection && state.selectedIds.size > 1 ? Array.from(state.selectedIds) : [itemId]
        if (!inSelection) clearSelection()
        state.draggingId = itemId
        state.draggingIds = ids
        sourceLaneByDragId = laneId
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', itemId)
          e.dataTransfer.effectAllowed = 'move'
        }
      },
      onLaneDragOver(e: DragEvent, laneId: string) {
        if (!state.draggingId) return
        const fromLane = sourceLaneByDragId ?? laneId
        const allOk = state.draggingIds.every((id) => isAllowed(id, fromLane, laneId))
        state.dragOverLaneId = laneId
        if (!allOk) {
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'none'
          return
        }
        e.preventDefault()
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
      },
      onLaneDragLeave(laneId: string) {
        if (state.dragOverLaneId === laneId) state.dragOverLaneId = null
      },
      onLaneDrop(e: DragEvent, laneId: string) {
        e.preventDefault()
        const fallbackId = e.dataTransfer?.getData('text/plain') || state.draggingId
        const ids = state.draggingIds.length > 0 ? state.draggingIds : fallbackId ? [fallbackId] : []
        if (ids.length === 0) return
        const insertAt = computeInsertIndex(e, laneId)
        moveItem([...ids], laneId, insertAt)
        state.draggingId = null
        state.draggingIds = []
        state.dragOverLaneId = null
        sourceLaneByDragId = null
      },
      onDragEnd() {
        state.draggingId = null
        state.draggingIds = []
        state.dragOverLaneId = null
        sourceLaneByDragId = null
      },
    }

    return {
      state,
      handlers,
      moveItem,
      toggleSelection,
      clearSelection,
      accepts,
      registerAllowedLanes: (cardId: string, lanes: readonly string[] | undefined) => {
        if (lanes && lanes.length > 0) allowedLanesByCard.set(cardId, lanes)
        else allowedLanesByCard.delete(cardId)
      },
      unregisterAllowedLanes: (cardId: string) => {
        allowedLanesByCard.delete(cardId)
      },
      registerLaneDisabled: (laneId: string, disabled: boolean) => {
        if (disabled) disabledLanes.add(laneId)
        else disabledLanes.delete(laneId)
      },
      unregisterLaneDisabled: (laneId: string) => {
        disabledLanes.delete(laneId)
      },
      isLaneAcceptingFor: (laneId: string) => {
        if (!state.draggingId) return false
        const fromLane = sourceLaneByDragId ?? laneId
        return state.draggingIds.every((id) => isAllowed(id, fromLane, laneId))
      },
    }
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

  // ─── Shared seed factory ──────────────────────────────────────────
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

  // ─── Story 1: default 4-lane board ────────────────────────────────
  let lanes1 = $state(seed())
  const b1 = createBoard<Task>({ getLanes: () => lanes1, setLanes: (v) => (lanes1 = v) })

  // ─── Story 2: single-lane sortable list ───────────────────────────
  let lanes2 = $state<Record<string, Task[]>>({
    list: [
      { id: 's1', title: 'Tighten dashboard KPI tiles', who: 'Priya', initials: 'P' },
      { id: 's2', title: 'Reduce time-to-first-byte', who: 'Marcus', initials: 'M' },
      { id: 's3', title: 'Update offer letter template', who: 'Diane', initials: 'D' },
      { id: 's4', title: 'Refactor session-token rotation', who: 'Sundar', initials: 'S' },
    ],
  })
  const b2 = createBoard<Task>({ getLanes: () => lanes2, setLanes: (v) => (lanes2 = v) })

  // ─── Story 3: dual lanes (before / after) ─────────────────────────
  let lanes3 = $state<Record<string, Task[]>>({
    backlog: [
      { id: 'd1', title: 'Sketch new dashboard hero', who: 'Karan', initials: 'K' },
      { id: 'd2', title: 'Audit time-off mock data', who: 'Marcus', initials: 'M' },
      { id: 'd3', title: 'Test print stylesheet', who: 'Diane', initials: 'D' },
    ],
    shipped: [{ id: 'd4', title: 'Onboarding tour v2', who: 'Priya', initials: 'P' }],
  })
  const b3 = createBoard<Task>({ getLanes: () => lanes3, setLanes: (v) => (lanes3 = v) })

  // ─── Story 4: disabled lane (can't drop here) ─────────────────────
  let lanes4 = $state(seed())
  const b4 = createBoard<Task>({ getLanes: () => lanes4, setLanes: (v) => (lanes4 = v) })

  // ─── Story 5: disabled card (can't drag this one) ─────────────────
  let lanes5 = $state(seed())
  const b5 = createBoard<Task>({ getLanes: () => lanes5, setLanes: (v) => (lanes5 = v) })

  // ─── Story 6: per-card allowedLanes ───────────────────────────────
  let lanes6 = $state(seed())
  const b6 = createBoard<Task>({ getLanes: () => lanes6, setLanes: (v) => (lanes6 = v) })

  // ─── Story 7: accepts predicate ───────────────────────────────────
  let lanes7 = $state(seed())
  const b7 = createBoard<Task>({
    getLanes: () => lanes7,
    setLanes: (v) => (lanes7 = v),
    accepts: (_id, from, to) => !(from === 'done' && to === 'todo'),
  })

  // ─── Story 8: multi-select ────────────────────────────────────────
  let lanes8 = $state(seed())
  const b8 = createBoard<Task>({ getLanes: () => lanes8, setLanes: (v) => (lanes8 = v) })

  // ─── Story 9: programmatic moveItem ───────────────────────────────
  let lanes9 = $state<Record<string, Task[]>>({
    inbox: [
      { id: 'p1', title: 'New ticket — exporter timeouts', who: 'System', initials: 'SY' },
      { id: 'p2', title: 'New ticket — sso for Acme', who: 'System', initials: 'SY' },
    ],
    triaged: [],
  })
  const b9 = createBoard<Task>({ getLanes: () => lanes9, setLanes: (v) => (lanes9 = v) })
  function triage(id: string) {
    b9.moveItem(id, 'triaged')
  }

  // ─── Story 10: onChange + audit log ───────────────────────────────
  let lanes10 = $state(seed())
  let log = $state<string[]>([])
  const b10 = createBoard<Task>({
    getLanes: () => lanes10,
    setLanes: (v) => (lanes10 = v),
    onChange: ({ itemIds, from, to }) => {
      log.unshift(
        `[${new Date().toLocaleTimeString()}] ${itemIds.length === 1 ? itemIds[0] : `${itemIds.length} items`} · ${from} → ${to}`,
      )
      log = log.slice(0, 8)
    },
  })

  // Reusable lane-count helper used by every story
  const counts = (lanes: Record<string, Task[]>) =>
    Object.fromEntries(Object.keys(lanes).map((k) => [k, lanes[k]?.length ?? 0]))

  // Counts for the 4-lane stories
  const counts1 = $derived(counts(lanes1))
  const counts4 = $derived(counts(lanes4))
  const counts5 = $derived(counts(lanes5))
  const counts6 = $derived(counts(lanes6))
  const counts7 = $derived(counts(lanes7))
  const counts8 = $derived(counts(lanes8))
  const counts10 = $derived(counts(lanes10))
</script>

<!-- 1. Default -->
{#if story === '1 · Four-lane board'}
  <Board
    draggingId={b1.state.draggingId}
    draggingIds={b1.state.draggingIds}
    dragOverLaneId={b1.state.dragOverLaneId}
    justMovedId={b1.state.justMovedId}
    selectedIds={b1.state.selectedIds}
    moveItem={b1.moveItem}
    toggleSelection={b1.toggleSelection}
    clearSelection={b1.clearSelection}
    registerAllowedLanes={b1.registerAllowedLanes}
    unregisterAllowedLanes={b1.unregisterAllowedLanes}
    registerLaneDisabled={b1.registerLaneDisabled}
    unregisterLaneDisabled={b1.unregisterLaneDisabled}
    isLaneAcceptingFor={b1.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
  >
    {#each stages as s (s)}
      <BoardLane
        id={s}
        class="max-h-[420px]"
        ondragover={(e) => b1.handlers.onLaneDragOver(e, s)}
        ondragleave={() => b1.handlers.onLaneDragLeave(s)}
        ondrop={(e) => b1.handlers.onLaneDrop(e, s)}
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full {dot[s]}"></span>
            <span class="text-sm font-semibold">{labels[s]}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {counts1[s]}
            </span>
          </div>
          <Button variant="ghost" size="icon" class="size-7" aria-label="Add"><Plus class="size-3.5" /></Button>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes1[s] ?? [] as t (t.id)}
            <BoardCard
              id={t.id}
              ondragstart={(e) => b1.handlers.onDragStart(e, t.id, s)}
              ondragend={b1.handlers.onDragEnd}
            >
              <div class="flex items-center gap-2">
                <span class="relative flex size-7 shrink-0 overflow-hidden rounded-full">
                  <span class="bg-muted flex size-full items-center justify-center rounded-full text-xs font-semibold">
                    {t.initials}
                  </span>
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm leading-tight font-medium">{t.title}</p>
                  <p class="text-muted-foreground text-xs">{t.who}</p>
                </div>
              </div>
            </BoardCard>
          {/each}
        </BoardLaneBody>
        <BoardLaneEmpty when={(lanes1[s]?.length ?? 0) === 0}>Drag a card here.</BoardLaneEmpty>
      </BoardLane>
    {/each}
  </Board>
{/if}

<!-- 2. Single lane -->
{#if story === '2 · Single-lane sortable list'}
  <Board
    draggingId={b2.state.draggingId}
    draggingIds={b2.state.draggingIds}
    dragOverLaneId={b2.state.dragOverLaneId}
    justMovedId={b2.state.justMovedId}
    selectedIds={b2.state.selectedIds}
    moveItem={b2.moveItem}
    toggleSelection={b2.toggleSelection}
    clearSelection={b2.clearSelection}
    registerAllowedLanes={b2.registerAllowedLanes}
    unregisterAllowedLanes={b2.unregisterAllowedLanes}
    registerLaneDisabled={b2.registerLaneDisabled}
    unregisterLaneDisabled={b2.unregisterLaneDisabled}
    isLaneAcceptingFor={b2.isLaneAcceptingFor}
    class="max-w-md"
  >
    <BoardLane
      id="list"
      ondragover={(e) => b2.handlers.onLaneDragOver(e, 'list')}
      ondragleave={() => b2.handlers.onLaneDragLeave('list')}
      ondrop={(e) => b2.handlers.onLaneDrop(e, 'list')}
    >
      <BoardLaneHeader>
        <span class="text-sm font-semibold">Today's queue</span>
        <span class="text-muted-foreground text-xs">drag to reorder</span>
      </BoardLaneHeader>
      <BoardLaneBody>
        {#each lanes2.list ?? [] as t (t.id)}
          <BoardCard id={t.id} ondragstart={(e) => b2.handlers.onDragStart(e, t.id, 'list')} ondragend={b2.handlers.onDragEnd}>
            <p class="text-sm font-medium">{t.title}</p>
            <p class="text-muted-foreground mt-0.5 text-xs">{t.who}</p>
          </BoardCard>
        {/each}
      </BoardLaneBody>
    </BoardLane>
  </Board>
{/if}

<!-- 3. Dual lanes -->
{#if story === '3 · Two lanes (before / after, draft / live, …)'}
  <Board
    draggingId={b3.state.draggingId}
    draggingIds={b3.state.draggingIds}
    dragOverLaneId={b3.state.dragOverLaneId}
    justMovedId={b3.state.justMovedId}
    selectedIds={b3.state.selectedIds}
    moveItem={b3.moveItem}
    toggleSelection={b3.toggleSelection}
    clearSelection={b3.clearSelection}
    registerAllowedLanes={b3.registerAllowedLanes}
    unregisterAllowedLanes={b3.unregisterAllowedLanes}
    registerLaneDisabled={b3.registerLaneDisabled}
    unregisterLaneDisabled={b3.unregisterLaneDisabled}
    isLaneAcceptingFor={b3.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2"
  >
    {#each Object.keys(lanes3) as k (k)}
      <BoardLane
        id={k}
        ondragover={(e) => b3.handlers.onLaneDragOver(e, k)}
        ondragleave={() => b3.handlers.onLaneDragLeave(k)}
        ondrop={(e) => b3.handlers.onLaneDrop(e, k)}
      >
        <BoardLaneHeader>
          <span class="text-sm font-semibold capitalize">{k}</span>
          <Badge variant="secondary" class="tabular-nums">{lanes3[k]?.length ?? 0}</Badge>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes3[k] ?? [] as t (t.id)}
            <BoardCard id={t.id} ondragstart={(e) => b3.handlers.onDragStart(e, t.id, k)} ondragend={b3.handlers.onDragEnd}>
              <p class="text-sm font-medium">{t.title}</p>
              <p class="text-muted-foreground text-xs">{t.who}</p>
            </BoardCard>
          {/each}
        </BoardLaneBody>
      </BoardLane>
    {/each}
  </Board>
{/if}

<!-- 4. Disabled lane -->
{#if story === '4 · Disabled lane'}
  <Board
    draggingId={b4.state.draggingId}
    draggingIds={b4.state.draggingIds}
    dragOverLaneId={b4.state.dragOverLaneId}
    justMovedId={b4.state.justMovedId}
    selectedIds={b4.state.selectedIds}
    moveItem={b4.moveItem}
    toggleSelection={b4.toggleSelection}
    clearSelection={b4.clearSelection}
    registerAllowedLanes={b4.registerAllowedLanes}
    unregisterAllowedLanes={b4.unregisterAllowedLanes}
    registerLaneDisabled={b4.registerLaneDisabled}
    unregisterLaneDisabled={b4.unregisterLaneDisabled}
    isLaneAcceptingFor={b4.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
  >
    {#each stages as s (s)}
      <BoardLane
        id={s}
        disabled={s === 'done'}
        ondragover={(e) => b4.handlers.onLaneDragOver(e, s)}
        ondragleave={() => b4.handlers.onLaneDragLeave(s)}
        ondrop={(e) => b4.handlers.onLaneDrop(e, s)}
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full {dot[s]}"></span>
            <span class="text-sm font-semibold">{labels[s]}</span>
            {#if s === 'done'}
              <Badge variant="secondary" class="text-xs">locked</Badge>
            {/if}
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {counts4[s]}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes4[s] ?? [] as t (t.id)}
            <BoardCard id={t.id} ondragstart={(e) => b4.handlers.onDragStart(e, t.id, s)} ondragend={b4.handlers.onDragEnd}>
              <p class="truncate text-sm font-medium">{t.title}</p>
            </BoardCard>
          {/each}
        </BoardLaneBody>
      </BoardLane>
    {/each}
  </Board>
{/if}

<!-- 5. Disabled card -->
{#if story === '5 · Disabled card'}
  <Board
    draggingId={b5.state.draggingId}
    draggingIds={b5.state.draggingIds}
    dragOverLaneId={b5.state.dragOverLaneId}
    justMovedId={b5.state.justMovedId}
    selectedIds={b5.state.selectedIds}
    moveItem={b5.moveItem}
    toggleSelection={b5.toggleSelection}
    clearSelection={b5.clearSelection}
    registerAllowedLanes={b5.registerAllowedLanes}
    unregisterAllowedLanes={b5.unregisterAllowedLanes}
    registerLaneDisabled={b5.registerLaneDisabled}
    unregisterLaneDisabled={b5.unregisterLaneDisabled}
    isLaneAcceptingFor={b5.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
  >
    {#each stages as s (s)}
      <BoardLane
        id={s}
        ondragover={(e) => b5.handlers.onLaneDragOver(e, s)}
        ondragleave={() => b5.handlers.onLaneDragLeave(s)}
        ondrop={(e) => b5.handlers.onLaneDrop(e, s)}
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full {dot[s]}"></span>
            <span class="text-sm font-semibold">{labels[s]}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {counts5[s]}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes5[s] ?? [] as t (t.id)}
            <BoardCard
              id={t.id}
              disabled={t.id === 't1' || t.id === 't7'}
              ondragstart={(e) => b5.handlers.onDragStart(e, t.id, s)}
              ondragend={b5.handlers.onDragEnd}
            >
              <p class="truncate text-sm font-medium">{t.title}</p>
              {#if t.id === 't1' || t.id === 't7'}
                <p class="text-muted-foreground mt-0.5 text-xs">🔒 locked</p>
              {/if}
            </BoardCard>
          {/each}
        </BoardLaneBody>
      </BoardLane>
    {/each}
  </Board>
{/if}

<!-- 6. Per-card allowedLanes -->
{#if story === '6 · Per-card allowedLanes allow-list'}
  <Board
    draggingId={b6.state.draggingId}
    draggingIds={b6.state.draggingIds}
    dragOverLaneId={b6.state.dragOverLaneId}
    justMovedId={b6.state.justMovedId}
    selectedIds={b6.state.selectedIds}
    moveItem={b6.moveItem}
    toggleSelection={b6.toggleSelection}
    clearSelection={b6.clearSelection}
    registerAllowedLanes={b6.registerAllowedLanes}
    unregisterAllowedLanes={b6.unregisterAllowedLanes}
    registerLaneDisabled={b6.registerLaneDisabled}
    unregisterLaneDisabled={b6.unregisterLaneDisabled}
    isLaneAcceptingFor={b6.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
  >
    {#each stages as s (s)}
      <BoardLane
        id={s}
        ondragover={(e) => b6.handlers.onLaneDragOver(e, s)}
        ondragleave={() => b6.handlers.onLaneDragLeave(s)}
        ondrop={(e) => b6.handlers.onLaneDrop(e, s)}
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full {dot[s]}"></span>
            <span class="text-sm font-semibold">{labels[s]}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {counts6[s]}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes6[s] ?? [] as t (t.id)}
            <BoardCard
              id={t.id}
              allowedLanes={t.id === 't1' ? ['review'] : undefined}
              class={t.id === 't1' ? 'border-info/60 bg-info/5' : ''}
              ondragstart={(e) => b6.handlers.onDragStart(e, t.id, s)}
              ondragend={b6.handlers.onDragEnd}
            >
              <p class="truncate text-sm font-medium">{t.title}</p>
              {#if t.id === 't1'}
                <p class="text-info mt-0.5 text-xs">→ only Review accepts this</p>
              {/if}
            </BoardCard>
          {/each}
        </BoardLaneBody>
      </BoardLane>
    {/each}
  </Board>
{/if}

<!-- 7. accepts predicate -->
{#if story === '7 · Global accepts predicate'}
  <Board
    draggingId={b7.state.draggingId}
    draggingIds={b7.state.draggingIds}
    dragOverLaneId={b7.state.dragOverLaneId}
    justMovedId={b7.state.justMovedId}
    selectedIds={b7.state.selectedIds}
    moveItem={b7.moveItem}
    toggleSelection={b7.toggleSelection}
    clearSelection={b7.clearSelection}
    registerAllowedLanes={b7.registerAllowedLanes}
    unregisterAllowedLanes={b7.unregisterAllowedLanes}
    registerLaneDisabled={b7.registerLaneDisabled}
    unregisterLaneDisabled={b7.unregisterLaneDisabled}
    isLaneAcceptingFor={b7.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
  >
    {#each stages as s (s)}
      <BoardLane
        id={s}
        ondragover={(e) => b7.handlers.onLaneDragOver(e, s)}
        ondragleave={() => b7.handlers.onLaneDragLeave(s)}
        ondrop={(e) => b7.handlers.onLaneDrop(e, s)}
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full {dot[s]}"></span>
            <span class="text-sm font-semibold">{labels[s]}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {counts7[s]}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes7[s] ?? [] as t (t.id)}
            <BoardCard id={t.id} ondragstart={(e) => b7.handlers.onDragStart(e, t.id, s)} ondragend={b7.handlers.onDragEnd}>
              <p class="truncate text-sm font-medium">{t.title}</p>
            </BoardCard>
          {/each}
        </BoardLaneBody>
      </BoardLane>
    {/each}
  </Board>
{/if}

<!-- 8. Multi-select drag -->
{#if story === '8 · Multi-select drag'}
  <Board
    draggingId={b8.state.draggingId}
    draggingIds={b8.state.draggingIds}
    dragOverLaneId={b8.state.dragOverLaneId}
    justMovedId={b8.state.justMovedId}
    selectedIds={b8.state.selectedIds}
    moveItem={b8.moveItem}
    toggleSelection={b8.toggleSelection}
    clearSelection={b8.clearSelection}
    registerAllowedLanes={b8.registerAllowedLanes}
    unregisterAllowedLanes={b8.unregisterAllowedLanes}
    registerLaneDisabled={b8.registerLaneDisabled}
    unregisterLaneDisabled={b8.unregisterLaneDisabled}
    isLaneAcceptingFor={b8.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
  >
    {#each stages as s (s)}
      <BoardLane
        id={s}
        ondragover={(e) => b8.handlers.onLaneDragOver(e, s)}
        ondragleave={() => b8.handlers.onLaneDragLeave(s)}
        ondrop={(e) => b8.handlers.onLaneDrop(e, s)}
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full {dot[s]}"></span>
            <span class="text-sm font-semibold">{labels[s]}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {counts8[s]}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes8[s] ?? [] as t (t.id)}
            <BoardCard id={t.id} ondragstart={(e) => b8.handlers.onDragStart(e, t.id, s)} ondragend={b8.handlers.onDragEnd}>
              <p class="truncate text-sm font-medium">{t.title}</p>
            </BoardCard>
          {/each}
        </BoardLaneBody>
      </BoardLane>
    {/each}
  </Board>
  <p class="text-muted-foreground mt-2 text-xs">
    Tip: cmd/ctrl/shift+click to add a card to the selection. Selected: {b8.state.selectedIds.size}
  </p>
{/if}

<!-- 9. Programmatic moveItem -->
{#if story === '9 · Programmatic move (no DnD)'}
  <Board
    draggingId={b9.state.draggingId}
    draggingIds={b9.state.draggingIds}
    dragOverLaneId={b9.state.dragOverLaneId}
    justMovedId={b9.state.justMovedId}
    selectedIds={b9.state.selectedIds}
    moveItem={b9.moveItem}
    toggleSelection={b9.toggleSelection}
    clearSelection={b9.clearSelection}
    registerAllowedLanes={b9.registerAllowedLanes}
    unregisterAllowedLanes={b9.unregisterAllowedLanes}
    registerLaneDisabled={b9.registerLaneDisabled}
    unregisterLaneDisabled={b9.unregisterLaneDisabled}
    isLaneAcceptingFor={b9.isLaneAcceptingFor}
    class="grid grid-cols-1 gap-3 md:grid-cols-2"
  >
    {#each ['inbox', 'triaged'] as k (k)}
      <BoardLane
        id={k}
        ondragover={(e) => b9.handlers.onLaneDragOver(e, k)}
        ondragleave={() => b9.handlers.onLaneDragLeave(k)}
        ondrop={(e) => b9.handlers.onLaneDrop(e, k)}
      >
        <BoardLaneHeader>
          <span class="text-sm font-semibold capitalize">{k}</span>
          <Badge variant="secondary">{lanes9[k]?.length ?? 0}</Badge>
        </BoardLaneHeader>
        <BoardLaneBody>
          {#each lanes9[k] ?? [] as t (t.id)}
            <BoardCard id={t.id} ondragstart={(e) => b9.handlers.onDragStart(e, t.id, k)} ondragend={b9.handlers.onDragEnd}>
              <div class="flex items-center justify-between gap-2">
                <p class="truncate text-sm font-medium">{t.title}</p>
                {#if k === 'inbox'}
                  <Button
                    size="sm"
                    variant="outline"
                    onclick={(e) => {
                      e.stopPropagation()
                      triage(t.id)
                    }}
                  >
                    Triage →
                  </Button>
                {/if}
              </div>
            </BoardCard>
          {/each}
        </BoardLaneBody>
        <BoardLaneEmpty when={(lanes9[k]?.length ?? 0) === 0}>Empty.</BoardLaneEmpty>
      </BoardLane>
    {/each}
  </Board>
{/if}

<!-- 10. onChange + audit -->
{#if story === '10 · onChange audit log'}
  <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
    <Board
      draggingId={b10.state.draggingId}
      draggingIds={b10.state.draggingIds}
      dragOverLaneId={b10.state.dragOverLaneId}
      justMovedId={b10.state.justMovedId}
      selectedIds={b10.state.selectedIds}
      moveItem={b10.moveItem}
      toggleSelection={b10.toggleSelection}
      clearSelection={b10.clearSelection}
      registerAllowedLanes={b10.registerAllowedLanes}
      unregisterAllowedLanes={b10.unregisterAllowedLanes}
      registerLaneDisabled={b10.registerLaneDisabled}
      unregisterLaneDisabled={b10.unregisterLaneDisabled}
      isLaneAcceptingFor={b10.isLaneAcceptingFor}
      class="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2"
    >
      {#each ['todo', 'done'] as s (s)}
        <BoardLane
          id={s}
          ondragover={(e) => b10.handlers.onLaneDragOver(e, s)}
          ondragleave={() => b10.handlers.onLaneDragLeave(s)}
          ondrop={(e) => b10.handlers.onLaneDrop(e, s)}
        >
          <BoardLaneHeader>
            <span class="text-sm font-semibold capitalize">{s}</span>
            <Badge variant="secondary">{counts10[s]}</Badge>
          </BoardLaneHeader>
          <BoardLaneBody>
            {#each lanes10[s] ?? [] as t (t.id)}
              <BoardCard
                id={t.id}
                ondragstart={(e) => b10.handlers.onDragStart(e, t.id, s)}
                ondragend={b10.handlers.onDragEnd}
              >
                <p class="truncate text-sm font-medium">{t.title}</p>
              </BoardCard>
            {/each}
          </BoardLaneBody>
        </BoardLane>
      {/each}
    </Board>
    <div class="rounded-md border p-3">
      <p class="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Audit log</p>
      {#if log.length}
        <ul class="space-y-1">
          {#each log as line, i (i)}
            <li class="text-foreground/80 font-mono text-xs tabular-nums">
              {line}
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-muted-foreground text-xs">Drag a card to log an event.</p>
      {/if}
    </div>
  </div>
{/if}

<!-- 11. Keyboard a11y -->
{#if story === '11 · Keyboard a11y'}
  <div class="text-muted-foreground bg-muted/30 rounded-md border p-3 text-xs">
    Focus a card in any board above and use
    <kbd class="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Space</kbd> +
    <kbd class="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Arrow</kbd> keys.
  </div>
{/if}

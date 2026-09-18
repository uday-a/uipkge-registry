<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Board, BoardCard, BoardLane, BoardLaneBody, BoardLaneEmpty, BoardLaneHeader } from '@/components/ui/board'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useBoard } from '@/composables/useBoard'

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

// ─── Story 1: default 4-lane board ────────────────────────────────────────
const lanes1 = ref(seed())
const b1 = useBoard<Task>({ lanes: lanes1 as unknown as Ref<Record<string, Task[]>> })

// ─── Story 2: single-lane sortable list ──────────────────────────────────
const lanes2 = ref<Record<string, Task[]>>({
  list: [
    { id: 's1', title: 'Tighten dashboard KPI tiles', who: 'Priya', initials: 'P' },
    { id: 's2', title: 'Reduce time-to-first-byte', who: 'Marcus', initials: 'M' },
    { id: 's3', title: 'Update offer letter template', who: 'Diane', initials: 'D' },
    { id: 's4', title: 'Refactor session-token rotation', who: 'Sundar', initials: 'S' },
  ],
})
const b2 = useBoard<Task>({ lanes: lanes2 as unknown as Ref<Record<string, Task[]>> })

// ─── Story 3: dual lanes (before / after) ────────────────────────────────
const lanes3 = ref<Record<string, Task[]>>({
  backlog: [
    { id: 'd1', title: 'Sketch new dashboard hero', who: 'Karan', initials: 'K' },
    { id: 'd2', title: 'Audit time-off mock data', who: 'Marcus', initials: 'M' },
    { id: 'd3', title: 'Test print stylesheet', who: 'Diane', initials: 'D' },
  ],
  shipped: [{ id: 'd4', title: 'Onboarding tour v2', who: 'Priya', initials: 'P' }],
})
const b3 = useBoard<Task>({ lanes: lanes3 as unknown as Ref<Record<string, Task[]>> })

// ─── Story 4: disabled lane (can't drop here) ────────────────────────────
const lanes4 = ref(seed())
const b4 = useBoard<Task>({ lanes: lanes4 as unknown as Ref<Record<string, Task[]>> })

// ─── Story 5: disabled card (can't drag this one) ────────────────────────
const lanes5 = ref(seed())
const b5 = useBoard<Task>({ lanes: lanes5 as unknown as Ref<Record<string, Task[]>> })

// ─── Story 6: per-card allowedLanes (Story Six only lets t1 go to review) ─
const lanes6 = ref(seed())
const b6 = useBoard<Task>({ lanes: lanes6 as unknown as Ref<Record<string, Task[]>> })

// ─── Story 7: accepts predicate (reject "done" -> "todo" regressions) ────
const lanes7 = ref(seed())
const b7 = useBoard<Task>({
  lanes: lanes7 as unknown as Ref<Record<string, Task[]>>,
  accepts: (_id, from, to) => !(from === 'done' && to === 'todo'),
})

// ─── Story 8: multi-select (cmd/shift+click → drag many at once) ─────────
const lanes8 = ref(seed())
const b8 = useBoard<Task>({ lanes: lanes8 as unknown as Ref<Record<string, Task[]>> })

// ─── Story 9: programmatic moveItem (no DnD — just buttons) ──────────────
const lanes9 = ref<Record<string, Task[]>>({
  inbox: [
    { id: 'p1', title: 'New ticket — exporter timeouts', who: 'System', initials: 'SY' },
    { id: 'p2', title: 'New ticket — sso for Acme', who: 'System', initials: 'SY' },
  ],
  triaged: [],
})
const b9 = useBoard<Task>({ lanes: lanes9 as unknown as Ref<Record<string, Task[]>> })
function triage(id: string) {
  b9.moveItem(id, 'triaged')
}

// ─── Story 10: onChange + audit log ──────────────────────────────────────
const lanes10 = ref(seed())
const log = ref<string[]>([])
const b10 = useBoard<Task>({
  lanes: lanes10 as unknown as Ref<Record<string, Task[]>>,
  onChange: ({ itemIds, from, to }) => {
    log.value.unshift(
      `[${new Date().toLocaleTimeString()}] ${itemIds.length === 1 ? itemIds[0] : `${itemIds.length} items`} · ${from} → ${to}`,
    )
    log.value = log.value.slice(0, 8)
  },
})

// Reusable lane-count helper used by every story
const counts = (lanes: Record<string, Task[]>) =>
  Object.fromEntries(Object.keys(lanes).map((k) => [k, lanes[k]?.length ?? 0]))

// Counts for the 4-lane stories
const counts1 = computed(() => counts(lanes1.value))
const counts4 = computed(() => counts(lanes4.value))
const counts5 = computed(() => counts(lanes5.value))
const counts6 = computed(() => counts(lanes6.value))
const counts7 = computed(() => counts(lanes7.value))
const counts8 = computed(() => counts(lanes8.value))
const counts10 = computed(() => counts(lanes10.value))
</script>

<template>
  <!-- 1. Default ─────────────────────────────────────────────────────── -->
  <Story
    title="1 · Four-lane board"
    description="The basic shape: Board wraps a grid of BoardLanes, each lane composes BoardLaneHeader / BoardLaneBody / BoardLaneEmpty. Drag a card between any two columns — siblings reflow via the motion-list preset, the landed card gets a brief ring."
  >
    <Board
      :dragging-id="b1.state.draggingId"
      :dragging-ids="b1.state.draggingIds"
      :drag-over-lane-id="b1.state.dragOverLaneId"
      :just-moved-id="b1.state.justMovedId"
      :selected-ids="b1.state.selectedIds"
      :move-item="b1.moveItem"
      :toggle-selection="b1.toggleSelection"
      :clear-selection="b1.clearSelection"
      :register-allowed-lanes="b1.registerAllowedLanes"
      :unregister-allowed-lanes="b1.unregisterAllowedLanes"
      :register-lane-disabled="b1.registerLaneDisabled"
      :unregister-lane-disabled="b1.unregisterLaneDisabled"
      :is-lane-accepting-for="b1.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      <BoardLane
        v-for="s in stages"
        :key="s"
        :id="s"
        class="max-h-[420px]"
        @dragover="(e: DragEvent) => b1.handlers.onLaneDragOver(e, s)"
        @dragleave="b1.handlers.onLaneDragLeave(s)"
        @drop="(e: DragEvent) => b1.handlers.onLaneDrop(e, s)"
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span :class="['size-2 rounded-full', dot[s]]" />
            <span class="text-sm font-semibold">{{ labels[s] }}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {{ counts1[s] }}
            </span>
          </div>
          <Button variant="ghost" size="icon" class="size-7" aria-label="Add"><Plus class="size-3.5" /></Button>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes1[s]"
            :key="t.id"
            :id="t.id"
            @dragstart="(e: DragEvent) => b1.handlers.onDragStart(e, t.id, s)"
            @dragend="b1.handlers.onDragEnd"
          >
            <div class="flex items-center gap-2">
              <Avatar class="size-7 shrink-0"
                ><AvatarFallback class="text-xs font-semibold">{{ t.initials }}</AvatarFallback></Avatar
              >
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm leading-tight font-medium">{{ t.title }}</p>
                <p class="text-muted-foreground text-xs">{{ t.who }}</p>
              </div>
            </div>
          </BoardCard>
        </BoardLaneBody>
        <BoardLaneEmpty :when="(lanes1[s]?.length ?? 0) === 0">Drag a card here.</BoardLaneEmpty>
      </BoardLane>
    </Board>
  </Story>

  <!-- 2. Single lane ────────────────────────────────────────────────── -->
  <Story
    title="2 · Single-lane sortable list"
    description="One lane = a reorderable list. Same drop math, same insertion-index. The Board primitive collapses freely from N lanes to 1 by virtue of being layout-agnostic."
  >
    <Board
      :dragging-id="b2.state.draggingId"
      :dragging-ids="b2.state.draggingIds"
      :drag-over-lane-id="b2.state.dragOverLaneId"
      :just-moved-id="b2.state.justMovedId"
      :selected-ids="b2.state.selectedIds"
      :move-item="b2.moveItem"
      :toggle-selection="b2.toggleSelection"
      :clear-selection="b2.clearSelection"
      :register-allowed-lanes="b2.registerAllowedLanes"
      :unregister-allowed-lanes="b2.unregisterAllowedLanes"
      :register-lane-disabled="b2.registerLaneDisabled"
      :unregister-lane-disabled="b2.unregisterLaneDisabled"
      :is-lane-accepting-for="b2.isLaneAcceptingFor"
      class="max-w-md"
    >
      <BoardLane
        id="list"
        @dragover="(e: DragEvent) => b2.handlers.onLaneDragOver(e, 'list')"
        @dragleave="b2.handlers.onLaneDragLeave('list')"
        @drop="(e: DragEvent) => b2.handlers.onLaneDrop(e, 'list')"
      >
        <BoardLaneHeader>
          <span class="text-sm font-semibold">Today's queue</span>
          <span class="text-muted-foreground text-xs">drag to reorder</span>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes2.list"
            :key="t.id"
            :id="t.id"
            @dragstart="(e: DragEvent) => b2.handlers.onDragStart(e, t.id, 'list')"
            @dragend="b2.handlers.onDragEnd"
          >
            <p class="text-sm font-medium">{{ t.title }}</p>
            <p class="text-muted-foreground mt-0.5 text-xs">{{ t.who }}</p>
          </BoardCard>
        </BoardLaneBody>
      </BoardLane>
    </Board>
  </Story>

  <!-- 3. Dual lanes ──────────────────────────────────────────────────── -->
  <Story
    title="3 · Two lanes (before / after, draft / live, …)"
    description="Same shape, two lanes. Useful for promote / publish flows, draft → live swaps, comparison boards."
  >
    <Board
      :dragging-id="b3.state.draggingId"
      :dragging-ids="b3.state.draggingIds"
      :drag-over-lane-id="b3.state.dragOverLaneId"
      :just-moved-id="b3.state.justMovedId"
      :selected-ids="b3.state.selectedIds"
      :move-item="b3.moveItem"
      :toggle-selection="b3.toggleSelection"
      :clear-selection="b3.clearSelection"
      :register-allowed-lanes="b3.registerAllowedLanes"
      :unregister-allowed-lanes="b3.unregisterAllowedLanes"
      :register-lane-disabled="b3.registerLaneDisabled"
      :unregister-lane-disabled="b3.unregisterLaneDisabled"
      :is-lane-accepting-for="b3.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2"
    >
      <BoardLane
        v-for="(_, k) in lanes3"
        :key="k"
        :id="k as string"
        @dragover="(e: DragEvent) => b3.handlers.onLaneDragOver(e, k as string)"
        @dragleave="b3.handlers.onLaneDragLeave(k as string)"
        @drop="(e: DragEvent) => b3.handlers.onLaneDrop(e, k as string)"
      >
        <BoardLaneHeader>
          <span class="text-sm font-semibold capitalize">{{ k }}</span>
          <Badge variant="secondary" class="tabular-nums">{{ lanes3[k as string]?.length ?? 0 }}</Badge>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes3[k as string]"
            :key="t.id"
            :id="t.id"
            @dragstart="(e: DragEvent) => b3.handlers.onDragStart(e, t.id, k as string)"
            @dragend="b3.handlers.onDragEnd"
          >
            <p class="text-sm font-medium">{{ t.title }}</p>
            <p class="text-muted-foreground text-xs">{{ t.who }}</p>
          </BoardCard>
        </BoardLaneBody>
      </BoardLane>
    </Board>
  </Story>

  <!-- 4. Disabled lane ──────────────────────────────────────────────── -->
  <Story
    title="4 · Disabled lane"
    description='Pass :disabled on a BoardLane to reject all drops on it. The lane keeps its cards (and their drag) but the drop target goes inert and dims. Here "Done" is locked — try dragging anything onto it.'
  >
    <Board
      :dragging-id="b4.state.draggingId"
      :dragging-ids="b4.state.draggingIds"
      :drag-over-lane-id="b4.state.dragOverLaneId"
      :just-moved-id="b4.state.justMovedId"
      :selected-ids="b4.state.selectedIds"
      :move-item="b4.moveItem"
      :toggle-selection="b4.toggleSelection"
      :clear-selection="b4.clearSelection"
      :register-allowed-lanes="b4.registerAllowedLanes"
      :unregister-allowed-lanes="b4.unregisterAllowedLanes"
      :register-lane-disabled="b4.registerLaneDisabled"
      :unregister-lane-disabled="b4.unregisterLaneDisabled"
      :is-lane-accepting-for="b4.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      <BoardLane
        v-for="s in stages"
        :key="s"
        :id="s"
        :disabled="s === 'done'"
        @dragover="(e: DragEvent) => b4.handlers.onLaneDragOver(e, s)"
        @dragleave="b4.handlers.onLaneDragLeave(s)"
        @drop="(e: DragEvent) => b4.handlers.onLaneDrop(e, s)"
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span :class="['size-2 rounded-full', dot[s]]" />
            <span class="text-sm font-semibold">{{ labels[s] }}</span>
            <Badge v-if="s === 'done'" variant="secondary" class="text-xs">locked</Badge>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {{ counts4[s] }}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes4[s]"
            :key="t.id"
            :id="t.id"
            @dragstart="(e: DragEvent) => b4.handlers.onDragStart(e, t.id, s)"
            @dragend="b4.handlers.onDragEnd"
          >
            <p class="truncate text-sm font-medium">{{ t.title }}</p>
          </BoardCard>
        </BoardLaneBody>
      </BoardLane>
    </Board>
  </Story>

  <!-- 5. Disabled card ──────────────────────────────────────────────── -->
  <Story
    title="5 · Disabled card"
    description="Mark a card :disabled to lock it in place — no drag, no click, dimmed + grayscaled. Useful for archived items, server-policy locked records, or a step you haven't unlocked yet."
  >
    <Board
      :dragging-id="b5.state.draggingId"
      :dragging-ids="b5.state.draggingIds"
      :drag-over-lane-id="b5.state.dragOverLaneId"
      :just-moved-id="b5.state.justMovedId"
      :selected-ids="b5.state.selectedIds"
      :move-item="b5.moveItem"
      :toggle-selection="b5.toggleSelection"
      :clear-selection="b5.clearSelection"
      :register-allowed-lanes="b5.registerAllowedLanes"
      :unregister-allowed-lanes="b5.unregisterAllowedLanes"
      :register-lane-disabled="b5.registerLaneDisabled"
      :unregister-lane-disabled="b5.unregisterLaneDisabled"
      :is-lane-accepting-for="b5.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      <BoardLane
        v-for="s in stages"
        :key="s"
        :id="s"
        @dragover="(e: DragEvent) => b5.handlers.onLaneDragOver(e, s)"
        @dragleave="b5.handlers.onLaneDragLeave(s)"
        @drop="(e: DragEvent) => b5.handlers.onLaneDrop(e, s)"
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span :class="['size-2 rounded-full', dot[s]]" />
            <span class="text-sm font-semibold">{{ labels[s] }}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {{ counts5[s] }}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes5[s]"
            :key="t.id"
            :id="t.id"
            :disabled="t.id === 't1' || t.id === 't7'"
            @dragstart="(e: DragEvent) => b5.handlers.onDragStart(e, t.id, s)"
            @dragend="b5.handlers.onDragEnd"
          >
            <p class="truncate text-sm font-medium">{{ t.title }}</p>
            <p v-if="t.id === 't1' || t.id === 't7'" class="text-muted-foreground mt-0.5 text-xs">🔒 locked</p>
          </BoardCard>
        </BoardLaneBody>
      </BoardLane>
    </Board>
  </Story>

  <!-- 6. Per-card allowedLanes ──────────────────────────────────────── -->
  <Story
    title="6 · Per-card allowedLanes allow-list"
    description='Pass :allowed-lanes on any BoardCard to whitelist its destinations. Other lanes silently reject the drop (with `dropEffect = "none"`). Try the highlighted blue card — it only accepts "review" as a destination.'
  >
    <Board
      :dragging-id="b6.state.draggingId"
      :dragging-ids="b6.state.draggingIds"
      :drag-over-lane-id="b6.state.dragOverLaneId"
      :just-moved-id="b6.state.justMovedId"
      :selected-ids="b6.state.selectedIds"
      :move-item="b6.moveItem"
      :toggle-selection="b6.toggleSelection"
      :clear-selection="b6.clearSelection"
      :register-allowed-lanes="b6.registerAllowedLanes"
      :unregister-allowed-lanes="b6.unregisterAllowedLanes"
      :register-lane-disabled="b6.registerLaneDisabled"
      :unregister-lane-disabled="b6.unregisterLaneDisabled"
      :is-lane-accepting-for="b6.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      <BoardLane
        v-for="s in stages"
        :key="s"
        :id="s"
        @dragover="(e: DragEvent) => b6.handlers.onLaneDragOver(e, s)"
        @dragleave="b6.handlers.onLaneDragLeave(s)"
        @drop="(e: DragEvent) => b6.handlers.onLaneDrop(e, s)"
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span :class="['size-2 rounded-full', dot[s]]" />
            <span class="text-sm font-semibold">{{ labels[s] }}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {{ counts6[s] }}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes6[s]"
            :key="t.id"
            :id="t.id"
            :allowed-lanes="t.id === 't1' ? ['review'] : undefined"
            :class="t.id === 't1' ? 'border-info/60 bg-info/5' : ''"
            @dragstart="(e: DragEvent) => b6.handlers.onDragStart(e, t.id, s)"
            @dragend="b6.handlers.onDragEnd"
          >
            <p class="truncate text-sm font-medium">{{ t.title }}</p>
            <p v-if="t.id === 't1'" class="text-info mt-0.5 text-xs">→ only Review accepts this</p>
          </BoardCard>
        </BoardLaneBody>
      </BoardLane>
    </Board>
  </Story>

  <!-- 7. accepts predicate ──────────────────────────────────────────── -->
  <Story
    title="7 · Global accepts predicate"
    description='Pass an :accepts function to useBoard to encode rules across the whole board. Here we block any drop from "done" back to "todo" — try dragging "Q1 OKR alignment doc" from Done over Todo.'
  >
    <Board
      :dragging-id="b7.state.draggingId"
      :dragging-ids="b7.state.draggingIds"
      :drag-over-lane-id="b7.state.dragOverLaneId"
      :just-moved-id="b7.state.justMovedId"
      :selected-ids="b7.state.selectedIds"
      :move-item="b7.moveItem"
      :toggle-selection="b7.toggleSelection"
      :clear-selection="b7.clearSelection"
      :register-allowed-lanes="b7.registerAllowedLanes"
      :unregister-allowed-lanes="b7.unregisterAllowedLanes"
      :register-lane-disabled="b7.registerLaneDisabled"
      :unregister-lane-disabled="b7.unregisterLaneDisabled"
      :is-lane-accepting-for="b7.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      <BoardLane
        v-for="s in stages"
        :key="s"
        :id="s"
        @dragover="(e: DragEvent) => b7.handlers.onLaneDragOver(e, s)"
        @dragleave="b7.handlers.onLaneDragLeave(s)"
        @drop="(e: DragEvent) => b7.handlers.onLaneDrop(e, s)"
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span :class="['size-2 rounded-full', dot[s]]" />
            <span class="text-sm font-semibold">{{ labels[s] }}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {{ counts7[s] }}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes7[s]"
            :key="t.id"
            :id="t.id"
            @dragstart="(e: DragEvent) => b7.handlers.onDragStart(e, t.id, s)"
            @dragend="b7.handlers.onDragEnd"
          >
            <p class="truncate text-sm font-medium">{{ t.title }}</p>
          </BoardCard>
        </BoardLaneBody>
      </BoardLane>
    </Board>
  </Story>

  <!-- 8. Multi-select drag ──────────────────────────────────────────── -->
  <Story
    title="8 · Multi-select drag"
    description="Cmd/Ctrl/Shift+click cards to add them to a selection (you'll see a ring on each). Then grab any selected card — every selected card moves to the drop target together, preserving relative order. Plain click clears the selection (and emits @click to your detail handler)."
  >
    <Board
      :dragging-id="b8.state.draggingId"
      :dragging-ids="b8.state.draggingIds"
      :drag-over-lane-id="b8.state.dragOverLaneId"
      :just-moved-id="b8.state.justMovedId"
      :selected-ids="b8.state.selectedIds"
      :move-item="b8.moveItem"
      :toggle-selection="b8.toggleSelection"
      :clear-selection="b8.clearSelection"
      :register-allowed-lanes="b8.registerAllowedLanes"
      :unregister-allowed-lanes="b8.unregisterAllowedLanes"
      :register-lane-disabled="b8.registerLaneDisabled"
      :unregister-lane-disabled="b8.unregisterLaneDisabled"
      :is-lane-accepting-for="b8.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      <BoardLane
        v-for="s in stages"
        :key="s"
        :id="s"
        @dragover="(e: DragEvent) => b8.handlers.onLaneDragOver(e, s)"
        @dragleave="b8.handlers.onLaneDragLeave(s)"
        @drop="(e: DragEvent) => b8.handlers.onLaneDrop(e, s)"
      >
        <BoardLaneHeader>
          <div class="flex items-center gap-2">
            <span :class="['size-2 rounded-full', dot[s]]" />
            <span class="text-sm font-semibold">{{ labels[s] }}</span>
            <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
              {{ counts8[s] }}
            </span>
          </div>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes8[s]"
            :key="t.id"
            :id="t.id"
            @dragstart="(e: DragEvent) => b8.handlers.onDragStart(e, t.id, s)"
            @dragend="b8.handlers.onDragEnd"
          >
            <p class="truncate text-sm font-medium">{{ t.title }}</p>
          </BoardCard>
        </BoardLaneBody>
      </BoardLane>
    </Board>
    <p class="text-muted-foreground mt-2 text-xs">
      Tip: cmd/ctrl/shift+click to add a card to the selection. Selected: {{ b8.state.selectedIds.size }}
    </p>
  </Story>

  <!-- 9. Programmatic moveItem ──────────────────────────────────────── -->
  <Story
    title="9 · Programmatic move (no DnD)"
    description="moveItem() is exposed for keyboard a11y, undo, or server-pushed updates. Here, a Triage button calls moveItem(id, 'triaged') with no drag at all — same animation, same onChange."
  >
    <Board
      :dragging-id="b9.state.draggingId"
      :dragging-ids="b9.state.draggingIds"
      :drag-over-lane-id="b9.state.dragOverLaneId"
      :just-moved-id="b9.state.justMovedId"
      :selected-ids="b9.state.selectedIds"
      :move-item="b9.moveItem"
      :toggle-selection="b9.toggleSelection"
      :clear-selection="b9.clearSelection"
      :register-allowed-lanes="b9.registerAllowedLanes"
      :unregister-allowed-lanes="b9.unregisterAllowedLanes"
      :register-lane-disabled="b9.registerLaneDisabled"
      :unregister-lane-disabled="b9.unregisterLaneDisabled"
      :is-lane-accepting-for="b9.isLaneAcceptingFor"
      class="grid grid-cols-1 gap-3 md:grid-cols-2"
    >
      <BoardLane
        v-for="k in ['inbox', 'triaged']"
        :key="k"
        :id="k"
        @dragover="(e: DragEvent) => b9.handlers.onLaneDragOver(e, k)"
        @dragleave="b9.handlers.onLaneDragLeave(k)"
        @drop="(e: DragEvent) => b9.handlers.onLaneDrop(e, k)"
      >
        <BoardLaneHeader>
          <span class="text-sm font-semibold capitalize">{{ k }}</span>
          <Badge variant="secondary">{{ lanes9[k]?.length ?? 0 }}</Badge>
        </BoardLaneHeader>
        <BoardLaneBody>
          <BoardCard
            v-for="t in lanes9[k]"
            :key="t.id"
            :id="t.id"
            @dragstart="(e: DragEvent) => b9.handlers.onDragStart(e, t.id, k)"
            @dragend="b9.handlers.onDragEnd"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="truncate text-sm font-medium">{{ t.title }}</p>
              <Button v-if="k === 'inbox'" size="sm" variant="outline" @click.stop="triage(t.id)"> Triage → </Button>
            </div>
          </BoardCard>
        </BoardLaneBody>
        <BoardLaneEmpty :when="(lanes9[k]?.length ?? 0) === 0">Empty.</BoardLaneEmpty>
      </BoardLane>
    </Board>
  </Story>

  <!-- 10. onChange + audit ──────────────────────────────────────────── -->
  <Story
    title="10 · onChange audit log"
    description="useBoard fires onChange({ itemId, itemIds, from, to, index }) on every move — pointer drag, keyboard move, or programmatic moveItem. Wire this to your store, your analytics, your audit log."
  >
    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Board
        :dragging-id="b10.state.draggingId"
        :dragging-ids="b10.state.draggingIds"
        :drag-over-lane-id="b10.state.dragOverLaneId"
        :just-moved-id="b10.state.justMovedId"
        :selected-ids="b10.state.selectedIds"
        :move-item="b10.moveItem"
        :toggle-selection="b10.toggleSelection"
        :clear-selection="b10.clearSelection"
        :register-allowed-lanes="b10.registerAllowedLanes"
        :unregister-allowed-lanes="b10.unregisterAllowedLanes"
        :register-lane-disabled="b10.registerLaneDisabled"
        :unregister-lane-disabled="b10.unregisterLaneDisabled"
        :is-lane-accepting-for="b10.isLaneAcceptingFor"
        class="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2"
      >
        <BoardLane
          v-for="s in ['todo', 'done']"
          :key="s"
          :id="s"
          @dragover="(e: DragEvent) => b10.handlers.onLaneDragOver(e, s)"
          @dragleave="b10.handlers.onLaneDragLeave(s)"
          @drop="(e: DragEvent) => b10.handlers.onLaneDrop(e, s)"
        >
          <BoardLaneHeader>
            <span class="text-sm font-semibold capitalize">{{ s }}</span>
            <Badge variant="secondary">{{ counts10[s] }}</Badge>
          </BoardLaneHeader>
          <BoardLaneBody>
            <BoardCard
              v-for="t in lanes10[s]"
              :key="t.id"
              :id="t.id"
              @dragstart="(e: DragEvent) => b10.handlers.onDragStart(e, t.id, s)"
              @dragend="b10.handlers.onDragEnd"
            >
              <p class="truncate text-sm font-medium">{{ t.title }}</p>
            </BoardCard>
          </BoardLaneBody>
        </BoardLane>
      </Board>
      <div class="rounded-md border p-3">
        <p class="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Audit log</p>
        <ul v-if="log.length" class="space-y-1">
          <li v-for="(line, i) in log" :key="i" class="text-foreground/80 font-mono text-xs tabular-nums">
            {{ line }}
          </li>
        </ul>
        <p v-else class="text-muted-foreground text-xs">Drag a card to log an event.</p>
      </div>
    </div>
  </Story>

  <!-- 11. Keyboard a11y ──────────────────────────────────────────────── -->
  <Story
    title="11 · Keyboard a11y"
    description="Every BoardCard is reachable via Tab. Press Space to grab — the card gets aria-grabbed and a visible ring. While grabbed: ArrowLeft / ArrowRight switches lanes, ArrowUp / ArrowDown reorders within the lane. Press Space again (or Escape) to drop. Try it on any board above."
  >
    <div class="text-muted-foreground bg-muted/30 rounded-md border p-3 text-xs">
      Focus a card in any board above and use
      <kbd class="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Space</kbd> +
      <kbd class="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs">Arrow</kbd> keys.
    </div>
  </Story>
</template>

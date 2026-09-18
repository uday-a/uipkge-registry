<script setup lang="ts">
/**
 * Popover variant of DataTableFilterSheet. Same filter UI (text /
 * multiselect / date) packed into a Popover instead of a side Sheet.
 * Slot in via `filterMode="popover"` on <DataTable>.
 *
 * Trigger button is rendered inline by the toolbar; this component owns
 * the popover surface and content.
 *
 * ── Draft semantics ──────────────────────────────────────────────────
 * Unlike the Sheet (which mutates live TanStack column filters and rolls
 * back on cancel via a parent snapshot), this popover stages every edit
 * inside a local `draft` map. Real `columnFilters` are never touched
 * until the user clicks Apply -- at which point we emit `commit-draft`
 * with the full draft and the parent walks the entries calling
 * `setFilterValue` per column. Closing the popover (Escape / click out)
 * simply discards the draft.
 *
 * Why: ticking a checkbox inside the popover used to write straight to
 * `columnFilters`, causing the underlying table to flash filtered before
 * the user committed. Truly staging the edits avoids that flash and
 * makes "Reset" / per-section "Clear" behave intuitively (they clear
 * the draft, not the live table).
 */
import type { Table } from '@tanstack/vue-table'
import type { FilterDefinition, FilterOption } from './DataTable.vue'
import type { DateValue } from '@internationalized/date'
import type { DateRange as RekaDateRange } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { CalendarDate } from '@internationalized/date'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, SlidersHorizontal, X } from 'lucide-vue-next'

type DraftDateValue = { from?: string; to?: string }
type DraftValue = string[] | string | DraftDateValue | undefined
type Draft = Record<string, DraftValue>

function resolveOption(opt: string | FilterOption): FilterOption {
  if (typeof opt === 'string') return { value: opt, label: opt }
  return opt
}

const props = defineProps<{
  table: Table<any>
  filters: FilterDefinition[]
  activeFilterCount: number
  isAnyFilterActive: boolean
  isServerSide: boolean
  getMultiSelectValue: (column: string) => string[]
  getDateRangeValue: (column: string) => { from?: string; to?: string }
  formatDateRange: (column: string) => string
  getCalendarModel: (column: string) => any
}>()

const open = ref(false)

const emit = defineEmits<{
  (e: 'clear-all'): void
  // Committed draft on Apply -- a `Record<columnId, value>` where each
  // value is the final shape TanStack's `setFilterValue` expects
  // (multiselect: string[]|undefined, text: string|undefined,
  //  date: {from?,to?}|undefined).
  (e: 'commit-draft', draft: Draft): void
  (e: 'open'): void
}>()

// ── Draft state ──────────────────────────────────────────────────────
// Seeded from real column filter values when the popover opens; cleared
// when it closes. All in-popover UI binds to this map -- never to the
// live TanStack filter values directly.
const draft = ref<Draft>({})

function seedDraft() {
  const next: Draft = {}
  for (const f of props.filters) {
    if (f.type === 'multiselect' || f.type === 'select') {
      next[f.column] = [...props.getMultiSelectValue(f.column)]
    } else if (f.type === 'date') {
      const dr = props.getDateRangeValue(f.column)
      next[f.column] = { from: dr.from, to: dr.to }
    } else if (f.type === 'text') {
      const v = props.table.getColumn(f.column)?.getFilterValue() as string | undefined
      next[f.column] = v ?? ''
    }
  }
  draft.value = next
}

function getDraftMulti(column: string): string[] {
  const v = draft.value[column]
  return Array.isArray(v) ? v : []
}

function getDraftText(column: string): string {
  const v = draft.value[column]
  return typeof v === 'string' ? v : ''
}

function getDraftDate(column: string): DraftDateValue {
  const v = draft.value[column]
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as DraftDateValue
  return {}
}

function toggleDraftMulti(column: string, option: string) {
  const current = getDraftMulti(column)
  const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option]
  draft.value = { ...draft.value, [column]: next }
}

function setDraftText(column: string, value: string) {
  draft.value = { ...draft.value, [column]: value }
}

function clearDraftSection(filter: FilterDefinition) {
  if (filter.type === 'multiselect' || filter.type === 'select') {
    draft.value = { ...draft.value, [filter.column]: [] }
  } else if (filter.type === 'date') {
    draft.value = { ...draft.value, [filter.column]: {} }
  } else if (filter.type === 'text') {
    draft.value = { ...draft.value, [filter.column]: '' }
  }
}

function resetDraft() {
  const next: Draft = {}
  for (const f of props.filters) {
    if (f.type === 'multiselect' || f.type === 'select') next[f.column] = []
    else if (f.type === 'date') next[f.column] = {}
    else if (f.type === 'text') next[f.column] = ''
  }
  draft.value = next
}

// ── Date helpers (local; popover is fully self-contained for draft) ──
function stringToDateValue(str: string | undefined): DateValue | undefined {
  if (!str) return undefined
  const [y, m, d] = str.split('-').map(Number)
  if (y === undefined || m === undefined || d === undefined) return undefined
  return new CalendarDate(y, m, d)
}

function dateValueToString(dv: DateValue | undefined): string {
  if (!dv) return ''
  return `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`
}

function getDraftCalendarModel(column: string): RekaDateRange {
  const dr = getDraftDate(column)
  return {
    start: stringToDateValue(dr.from) as DateValue,
    end: stringToDateValue(dr.to) as DateValue,
  }
}

function onDraftCalendarUpdate(column: string, val: RekaDateRange) {
  const from = val?.start ? dateValueToString(val.start) : undefined
  const to = val?.end ? dateValueToString(val.end) : undefined
  draft.value = { ...draft.value, [column]: { from, to } }
}

function formatDraftDateRange(column: string): string {
  const dr = getDraftDate(column)
  if (dr.from && dr.to) return `${dr.from} - ${dr.to}`
  if (dr.from) return `From ${dr.from}`
  if (dr.to) return `Until ${dr.to}`
  return ''
}

// ── Active section detection (draft, not live) ───────────────────────
function isDraftSectionActive(filter: FilterDefinition): boolean {
  if (filter.type === 'multiselect' || filter.type === 'select') {
    return getDraftMulti(filter.column).length > 0
  }
  if (filter.type === 'date') {
    const dr = getDraftDate(filter.column)
    return !!(dr.from || dr.to)
  }
  if (filter.type === 'text') {
    return !!getDraftText(filter.column)
  }
  return false
}

// `Reset` is disabled when the draft has nothing to clear.
const isDraftDirty = computed(() => props.filters.some(isDraftSectionActive))

// ── Popover lifecycle ────────────────────────────────────────────────
watch(open, (isOpen, wasOpen) => {
  if (isOpen && !wasOpen) {
    seedDraft()
    emit('open')
    return
  }
  if (!isOpen && wasOpen) {
    // Close-without-apply: nothing to do. Real column filters were never
    // mutated by the popover; the draft is local and can be left to
    // garbage-collect (next open re-seeds from live state).
    draft.value = {}
  }
})

function applyAndClose() {
  // Snapshot the draft so the parent receives a stable object even if
  // the close watcher fires before they finish consuming it.
  const snapshot: Draft = {}
  for (const f of props.filters) {
    const v = draft.value[f.column]
    if (f.type === 'multiselect' || f.type === 'select') {
      const arr = Array.isArray(v) ? v : []
      snapshot[f.column] = arr.length > 0 ? arr : undefined
    } else if (f.type === 'date') {
      const dr = v && typeof v === 'object' && !Array.isArray(v) ? (v as DraftDateValue) : {}
      snapshot[f.column] = dr.from || dr.to ? { from: dr.from, to: dr.to } : undefined
    } else if (f.type === 'text') {
      const s = typeof v === 'string' ? v : ''
      snapshot[f.column] = s || undefined
    }
  }
  emit('commit-draft', snapshot)
  open.value = false
}

function onResetClick() {
  resetDraft()
}

const filterScrollRef = ref<HTMLElement | null>(null)

watch(open, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      filterScrollRef.value?.scrollTo({ top: 0 })
    }, 50)
  }
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        :class="[
          'h-8 gap-2',
          activeFilterCount > 0 ? 'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10' : '',
        ]"
      >
        <SlidersHorizontal class="size-4" />
        Filters
        <Badge
          v-if="activeFilterCount > 0"
          class="bg-primary text-primary-foreground ml-0.5 size-5 rounded-full p-0 text-xs font-semibold"
        >
          {{ activeFilterCount }}
        </Badge>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="flex max-h-[min(560px,80vh)] w-96 flex-col overflow-hidden p-0">
      <!-- Header -->
      <div class="border-b px-4 pt-4 pb-3">
        <div class="flex items-center gap-3">
          <div class="bg-muted flex size-7 items-center justify-center rounded-md">
            <SlidersHorizontal class="text-muted-foreground size-4" />
          </div>
          <div class="flex-1">
            <p class="text-sm leading-none font-semibold">Filters</p>
            <p class="text-muted-foreground mt-1 text-xs">
              <template v-if="activeFilterCount > 0">
                {{ activeFilterCount }} active
                <template v-if="!isServerSide">
                  &middot; {{ table.getFilteredRowModel().rows.length }} result{{
                    table.getFilteredRowModel().rows.length !== 1 ? 's' : ''
                  }}
                </template>
              </template>
              <template v-else> Narrow down results </template>
            </p>
          </div>
        </div>
      </div>

      <!-- Scrollable filter sections -->
      <div ref="filterScrollRef" class="flex-1 overflow-y-auto">
        <div class="space-y-2 p-3">
          <template v-for="filter in filters" :key="filter.column">
            <!-- Text filter -->
            <div v-if="filter.type === 'text'" class="bg-muted/40 rounded-lg p-3">
              <div class="mb-2 flex items-center justify-between">
                <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{
                  filter.label
                }}</Label>
                <button
                  v-if="getDraftText(filter.column)"
                  type="button"
                  class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  @click="clearDraftSection(filter)"
                >
                  Clear
                </button>
              </div>
              <Input
                :placeholder="`Filter by ${filter.label.toLowerCase()}...`"
                :model-value="getDraftText(filter.column)"
                class="h-8 text-sm"
                @update:model-value="setDraftText(filter.column, ($event as string) ?? '')"
              />
            </div>

            <!-- Multiselect / Select filter -->
            <div
              v-else-if="filter.type === 'multiselect' || filter.type === 'select'"
              class="rounded-lg p-3 transition-colors"
              :class="[
                getDraftMulti(filter.column).length > 0 ? 'bg-primary/[0.04] ring-primary/20 ring-1' : 'bg-muted/40',
              ]"
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{
                    filter.label
                  }}</Label>
                  <Badge
                    v-if="getDraftMulti(filter.column).length > 0"
                    variant="secondary"
                    class="bg-primary/15 text-primary h-4 rounded-full px-2 text-xs font-semibold"
                  >
                    {{ getDraftMulti(filter.column).length }}
                  </Badge>
                </div>
                <button
                  v-if="getDraftMulti(filter.column).length > 0"
                  type="button"
                  class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  @click="clearDraftSection(filter)"
                >
                  Clear
                </button>
              </div>
              <Command
                class="[&_[data-slot=command-input-wrapper]]:border-input overflow-visible bg-transparent [&_[data-slot=command-input-wrapper]]:h-8 [&_[data-slot=command-input-wrapper]]:rounded-md [&_[data-slot=command-input-wrapper]]:border [&_[data-slot=command-input-wrapper]]:px-3"
              >
                <CommandInput class="h-7 text-sm" :placeholder="`Search ${filter.label.toLowerCase()}...`" />
                <CommandList class="mt-1 max-h-36">
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup class="p-0">
                    <CommandItem
                      v-for="rawOpt in filter.options"
                      :key="resolveOption(rawOpt).value"
                      :value="resolveOption(rawOpt).label"
                      class="rounded-md px-2 py-2 text-sm"
                      @select="toggleDraftMulti(filter.column, resolveOption(rawOpt).value)"
                    >
                      <div
                        class="flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors"
                        :class="[
                          getDraftMulti(filter.column).includes(resolveOption(rawOpt).value)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/40 [&_svg]:invisible',
                        ]"
                      >
                        <Check class="size-3" />
                      </div>
                      <component
                        :is="resolveOption(rawOpt).icon"
                        v-if="resolveOption(rawOpt).icon"
                        class="text-muted-foreground size-4"
                      />
                      <span>{{ resolveOption(rawOpt).label }}</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            <!-- Date range filter -->
            <div
              v-else-if="filter.type === 'date'"
              class="rounded-lg p-3 transition-colors"
              :class="[
                getDraftDate(filter.column).from || getDraftDate(filter.column).to
                  ? 'bg-primary/[0.04] ring-primary/20 ring-1'
                  : 'bg-muted/40',
              ]"
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{
                    filter.label
                  }}</Label>
                  <Badge
                    v-if="getDraftDate(filter.column).from || getDraftDate(filter.column).to"
                    variant="secondary"
                    class="bg-primary/15 text-primary h-auto rounded-full px-2 py-0 text-xs font-medium"
                  >
                    {{ formatDraftDateRange(filter.column) }}
                  </Badge>
                </div>
                <button
                  v-if="getDraftDate(filter.column).from || getDraftDate(filter.column).to"
                  type="button"
                  class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  @click="clearDraftSection(filter)"
                >
                  Clear
                </button>
              </div>
              <div class="flex justify-center overflow-hidden rounded-md border">
                <RangeCalendar
                  :model-value="getDraftCalendarModel(filter.column)"
                  :number-of-months="1"
                  class="p-2"
                  @update:model-value="onDraftCalendarUpdate(filter.column, $event as RekaDateRange)"
                />
              </div>
            </div>
          </template>

          <!-- Consumer-supplied custom filter UI -->
          <slot name="custom-filters" />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-2 border-t px-3 py-3">
        <Button variant="outline" size="sm" class="h-8 flex-1" :disabled="!isDraftDirty" @click="onResetClick">
          <X class="size-4" />
          Reset
        </Button>
        <Button size="sm" class="h-8 flex-1" @click="applyAndClose"> Apply </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>

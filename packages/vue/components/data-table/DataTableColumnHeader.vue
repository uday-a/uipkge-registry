<script setup lang="ts" generic="TData, TValue">
/**
 * Sortable / hideable header cell for TanStack DataTable columns. Use it from
 * a column definition like:
 *   header: ({ column }) => h(DataTableColumnHeader, { column, label: 'Email' })
 *
 * Click on the label cycles sort asc → desc → none.
 *
 * Optional per-column filter:
 *   header: ({ column }) => h(DataTableColumnHeader, {
 *     column,
 *     label: 'Status',
 *     filter: { column: 'status', label: 'Status', type: 'multiselect', options: [...] }
 *   })
 *
 * When `filter` is provided, a funnel icon renders next to the sort button.
 * Click opens a popover with the right filter UI for the type (text / select
 * / multiselect / date). The funnel shows a primary-coloured dot when the
 * column has an active filter.
 */
import { computed, ref, watch } from 'vue'
import type { Column } from '@tanstack/vue-table'
import { ArrowUp, ArrowUpDown, Check, Filter, FilterX } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { parseDate, CalendarDate, type DateValue } from '@internationalized/date'

interface FilterOption {
  value: string
  label: string
}
interface FilterDefinition {
  column: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date'
  options?: (string | FilterOption)[]
}

const props = defineProps<{
  column: Column<TData, TValue>
  label: string
  align?: 'left' | 'right' | 'center'
  filter?: FilterDefinition
  class?: string
}>()

const align = computed(() => props.align ?? 'left')

function next() {
  const current = props.column.getIsSorted()
  if (!current) props.column.toggleSorting(false)
  else if (current === 'asc') props.column.toggleSorting(true)
  else props.column.clearSorting()
}

function resolveOption(opt: string | FilterOption): FilterOption {
  return typeof opt === 'string' ? { value: opt, label: opt } : opt
}

// Filter state read directly off the TanStack column so the popover stays
// reactive to external clears (toolbar "Clear all", row-level edits, etc.).
const open = ref(false)
const filterValue = computed(() => props.column.getFilterValue())

const isFilterActive = computed(() => {
  const v = filterValue.value
  if (v === undefined || v === null || v === '') return false
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'object') return Object.keys(v).length > 0
  return true
})

// Text-input bound separately so we can apply on blur / Enter rather than
// thrashing the column filter on every keystroke.
const textDraft = ref('')
watch(open, (isOpen) => {
  if (isOpen && props.filter?.type === 'text') {
    textDraft.value = (filterValue.value as string) ?? ''
  }
})

function applyText() {
  props.column.setFilterValue(textDraft.value || undefined)
}

function clearText() {
  textDraft.value = ''
  props.column.setFilterValue(undefined)
}

function toggleMultiselect(value: string) {
  const current = (filterValue.value as string[]) ?? []
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
  props.column.setFilterValue(next.length > 0 ? next : undefined)
}

function selectOne(value: string) {
  props.column.setFilterValue(value || undefined)
  open.value = false
}

function clearFilter() {
  props.column.setFilterValue(undefined)
  textDraft.value = ''
}

// Date-range bridging. The column stores ISO strings; the calendar wants
// CalendarDate instances. Reads/writes both shapes.
const dateModel = computed({
  get() {
    const v = filterValue.value as { from?: string; to?: string } | undefined
    if (!v?.from && !v?.to) return undefined
    try {
      return {
        start: v.from ? parseDate(v.from) : undefined,
        end: v.to ? parseDate(v.to) : undefined,
      }
    } catch {
      return undefined
    }
  },
  set(next: { start?: DateValue; end?: DateValue } | undefined) {
    const isoFrom = next?.start ? (next.start as CalendarDate).toString() : undefined
    const isoTo = next?.end ? (next.end as CalendarDate).toString() : undefined
    if (!isoFrom && !isoTo) {
      props.column.setFilterValue(undefined)
    } else {
      props.column.setFilterValue({ from: isoFrom, to: isoTo })
    }
  },
})

function selectedLabels(): string[] {
  const f = props.filter
  if (!f?.options) return []
  const selected = (filterValue.value as string[]) ?? []
  return f.options
    .map(resolveOption)
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label)
}
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center gap-0.5',
        align === 'right' && 'justify-end',
        align === 'center' && 'justify-center',
        props.class,
      )
    "
  >
    <button
      type="button"
      v-if="column.getCanSort()"
      class="group text-muted-foreground hover:text-foreground hover:bg-muted/60 -mx-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm font-medium transition-colors duration-150"
      :aria-label="`Sort by ${label}`"
      @click="next"
    >
      <span>{{ label }}</span>
      <ArrowUp
        v-if="column.getIsSorted()"
        class="text-foreground size-3.5 transition-transform duration-200 ease-in-out"
        :class="column.getIsSorted() === 'desc' ? 'rotate-180' : 'rotate-0'"
      />
      <ArrowUpDown v-else class="size-3.5 opacity-40 transition-opacity duration-150 group-hover:opacity-70" />
    </button>
    <span v-else class="text-muted-foreground text-sm font-medium">{{ label }}</span>

    <!-- Optional per-column header filter -->
    <Popover v-if="filter" v-model:open="open">
      <PopoverTrigger as-child>
        <button
          type="button"
          :class="
            cn(
              'text-muted-foreground relative inline-flex size-6 items-center justify-center rounded transition-colors',
              'hover:text-foreground hover:bg-muted/60',
              isFilterActive && 'text-foreground',
            )
          "
          :aria-label="`Filter ${label}`"
        >
          <Filter class="size-3.5" />
          <span
            v-if="isFilterActive"
            aria-hidden
            class="bg-primary absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent class="w-64 p-0" align="start">
        <div class="border-border flex items-center justify-between border-b px-3 py-2 text-xs font-medium">
          <span>Filter · {{ filter.label }}</span>
          <button
            type="button"
            v-if="isFilterActive"
            class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            @click="clearFilter"
          >
            <FilterX class="size-3" />
            Clear
          </button>
        </div>

        <!-- TEXT -->
        <div v-if="filter.type === 'text'" class="space-y-2 p-3">
          <Input
            v-model="textDraft"
            :placeholder="`Search ${filter.label.toLowerCase()}…`"
            class="h-8"
            @keydown.enter="
              () => {
                applyText()
                open = false
              }
            "
            @blur="applyText"
          />
          <div class="flex gap-2">
            <Button
              size="sm"
              class="h-8 flex-1"
              @click="
                () => {
                  applyText()
                  open = false
                }
              "
              >Apply</Button
            >
            <Button size="sm" variant="outline" class="h-8" @click="clearText()">Clear</Button>
          </div>
        </div>

        <!-- SELECT / MULTISELECT -->
        <Command v-else-if="filter.type === 'select' || filter.type === 'multiselect'" class="max-h-72">
          <CommandInput :placeholder="`Search ${filter.label.toLowerCase()}…`" class="h-8" />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              <template v-for="opt in filter.options ?? []" :key="resolveOption(opt).value">
                <CommandItem
                  :value="resolveOption(opt).value"
                  @select="
                    filter.type === 'multiselect'
                      ? toggleMultiselect(resolveOption(opt).value)
                      : selectOne(resolveOption(opt).value)
                  "
                >
                  <div
                    v-if="filter.type === 'multiselect'"
                    :class="
                      cn(
                        'border-primary/50 mr-2 flex size-4 items-center justify-center rounded-sm border transition-colors',
                        ((filterValue as string[]) ?? []).includes(resolveOption(opt).value)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50',
                      )
                    "
                  >
                    <Check class="size-3" />
                  </div>
                  <Check
                    v-else
                    :class="cn('mr-2 size-4', filterValue === resolveOption(opt).value ? 'opacity-100' : 'opacity-0')"
                  />
                  <span>{{ resolveOption(opt).label }}</span>
                </CommandItem>
              </template>
            </CommandGroup>
          </CommandList>
        </Command>

        <!-- DATE RANGE -->
        <div v-else-if="filter.type === 'date'" class="p-2">
          <RangeCalendar v-model="dateModel as any" />
          <div class="flex gap-2 px-1 pt-2">
            <Button size="sm" class="h-8 flex-1" @click="open = false">Apply</Button>
            <Button size="sm" variant="outline" class="h-8" @click="clearFilter">Clear</Button>
          </div>
        </div>

        <!-- Active selection summary -->
        <div
          v-if="isFilterActive && (filter.type === 'multiselect' || filter.type === 'select')"
          class="border-border text-muted-foreground border-t px-3 py-2 text-xs"
        >
          <span v-if="filter.type === 'multiselect'">
            {{ selectedLabels().length }} selected:
            <span class="text-foreground">{{ selectedLabels().join(', ') }}</span>
          </span>
          <span v-else>
            <span class="text-foreground">{{ filterValue }}</span>
          </span>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

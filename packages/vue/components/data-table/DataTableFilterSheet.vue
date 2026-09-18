<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { FilterDefinition, FilterOption } from './DataTable.vue'
import { ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, SlidersHorizontal, X } from 'lucide-vue-next'

function resolveOption(opt: string | FilterOption): FilterOption {
  if (typeof opt === 'string') return { value: opt, label: opt }
  return opt
}

withDefaults(
  defineProps<{
    table: Table<any>
    filters: FilterDefinition[]
    activeFilterCount: number
    isAnyFilterActive: boolean
    isServerSide: boolean
    /** Strip section bgs / rings / dividers / SheetContent side border. */
    borderless?: boolean
    getMultiSelectValue: (column: string) => string[]
    getDateRangeValue: (column: string) => { from?: string; to?: string }
    formatDateRange: (column: string) => string
    getCalendarModel: (column: string) => any
  }>(),
  { borderless: false },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (e: 'apply' | 'clear-all'): void
  (e: 'toggle-multiselect', column: string, value: string): void
  (e: 'clear-filter' | 'clear-date-filter', filter: FilterDefinition): void
  (e: 'calendar-update', column: string, value: any): void
  (e: 'text-filter-update', column: string, value: string | undefined): void
}>()

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
  <Sheet v-model:open="open">
    <SheetContent :class="['flex flex-col gap-0 p-0 sm:max-w-md', borderless ? 'border-0' : '']">
      <!-- Header -->
      <div :class="[borderless ? 'px-5 pt-5 pb-2' : 'border-b px-5 pt-5 pb-4']">
        <div class="flex items-center gap-3">
          <div class="bg-muted flex size-9 items-center justify-center rounded-lg">
            <SlidersHorizontal class="text-muted-foreground size-4" />
          </div>
          <div class="flex-1">
            <SheetHeader class="space-y-0.5 p-0">
              <SheetTitle class="text-sm font-semibold"> Filters </SheetTitle>
              <SheetDescription class="text-xs">
                <template v-if="activeFilterCount > 0">
                  {{ activeFilterCount }} active filter{{ activeFilterCount > 1 ? 's' : '' }}
                  <template v-if="!isServerSide">
                    &middot;
                    {{ table.getFilteredRowModel().rows.length }} result{{
                      table.getFilteredRowModel().rows.length !== 1 ? 's' : ''
                    }}
                  </template>
                </template>
                <template v-else> Narrow down results </template>
              </SheetDescription>
            </SheetHeader>
          </div>
        </div>
      </div>

      <!-- Scrollable filter sections -->
      <div ref="filterScrollRef" class="flex-1 overflow-y-auto">
        <div class="space-y-2 p-4">
          <template v-for="filter in filters" :key="filter.column">
            <!-- Text filter -->
            <div v-if="filter.type === 'text'" :class="[borderless ? 'py-2' : 'bg-muted/40 rounded-lg p-3']">
              <div class="mb-2 flex items-center justify-between">
                <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{
                  filter.label
                }}</Label>
                <button
                  v-if="table.getColumn(filter.column)?.getFilterValue() as string"
                  type="button"
                  class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  @click="emit('text-filter-update', filter.column, undefined)"
                >
                  Clear
                </button>
              </div>
              <Input
                :placeholder="`Filter by ${filter.label.toLowerCase()}...`"
                :model-value="(table.getColumn(filter.column)?.getFilterValue() as string) ?? ''"
                class="h-8 text-sm"
                @update:model-value="emit('text-filter-update', filter.column, ($event as string) || undefined)"
              />
            </div>

            <!-- Multiselect / Select filter -->
            <div
              v-else-if="filter.type === 'multiselect' || filter.type === 'select'"
              :class="
                borderless
                  ? 'py-2 transition-colors'
                  : [
                      'rounded-lg p-3 transition-colors',
                      getMultiSelectValue(filter.column).length > 0
                        ? 'bg-primary/[0.04] ring-primary/20 ring-1'
                        : 'bg-muted/40',
                    ]
              "
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{
                    filter.label
                  }}</Label>
                  <Badge
                    v-if="getMultiSelectValue(filter.column).length > 0"
                    variant="secondary"
                    class="bg-primary/15 text-primary h-4 rounded-full px-2 text-xs font-semibold"
                  >
                    {{ getMultiSelectValue(filter.column).length }}
                  </Badge>
                </div>
                <button
                  v-if="getMultiSelectValue(filter.column).length > 0"
                  type="button"
                  class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  @click="emit('clear-filter', filter)"
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
                      @select="emit('toggle-multiselect', filter.column, resolveOption(rawOpt).value)"
                    >
                      <div
                        class="flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors"
                        :class="[
                          getMultiSelectValue(filter.column).includes(resolveOption(rawOpt).value)
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
              :class="
                borderless
                  ? 'py-2 transition-colors'
                  : [
                      'rounded-lg p-3 transition-colors',
                      getDateRangeValue(filter.column).from || getDateRangeValue(filter.column).to
                        ? 'bg-primary/[0.04] ring-primary/20 ring-1'
                        : 'bg-muted/40',
                    ]
              "
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{
                    filter.label
                  }}</Label>
                  <Badge
                    v-if="getDateRangeValue(filter.column).from || getDateRangeValue(filter.column).to"
                    variant="secondary"
                    class="bg-primary/15 text-primary h-auto rounded-full px-1.5 py-0 text-xs font-medium"
                  >
                    {{ formatDateRange(filter.column) }}
                  </Badge>
                </div>
                <button
                  v-if="getDateRangeValue(filter.column).from || getDateRangeValue(filter.column).to"
                  type="button"
                  class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  @click="emit('clear-date-filter', filter)"
                >
                  Clear
                </button>
              </div>
              <div :class="['flex justify-center overflow-hidden', borderless ? '' : 'rounded-md border']">
                <RangeCalendar
                  :model-value="getCalendarModel(filter.column)"
                  :number-of-months="1"
                  class="p-2"
                  @update:model-value="emit('calendar-update', filter.column, $event)"
                />
              </div>
            </div>
          </template>

          <!-- Consumer-supplied custom filter UI -->
          <slot name="custom-filters" />
        </div>
      </div>

      <!-- Footer -->
      <div :class="['flex gap-2 px-4 py-3', borderless ? '' : 'border-t']">
        <Button variant="outline" size="sm" class="flex-1" :disabled="!isAnyFilterActive" @click="emit('clear-all')">
          <X class="size-4" />
          Reset All
        </Button>
        <Button size="sm" class="flex-1" @click="emit('apply')">
          <template v-if="isServerSide"> Apply Filters </template>
          <template v-else>
            Show {{ table.getFilteredRowModel().rows.length }} result{{
              table.getFilteredRowModel().rows.length !== 1 ? 's' : ''
            }}
          </template>
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>

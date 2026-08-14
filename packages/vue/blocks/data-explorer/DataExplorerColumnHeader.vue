<script setup lang="ts" generic="T extends ExplorerRow">
// A table header cell that carries its own controls: sort, filter, pin, move,
// group and hide -- the control sits on the column it acts on, so there is no
// separate bar to keep in sync with the columns beneath it.
//
// The cell always shows where it stands -- an arrow (and its rank, under
// multi-sort) when it is sorted, a solid funnel when a filter is on it --
// because a table that is quietly filtered is a table people misread.
import { computed, ref, watch } from 'vue'
import {
  ArrowDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  EyeOff,
  Filter,
  Layers,
  PinOff,
  X,
} from './data-explorer-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useExplorerLabels } from './data-explorer-labels'
import {
  OPERATOR_LABEL_KEYS,
  OPERATORS_BY_KIND,
  PLACEHOLDER_LABEL_KEYS,
  type ColumnKind,
  type ExplorerColumn,
  type ExplorerRow,
  type ExplorerFilter,
  type ExplorerOperator,
  type ExplorerSort,
} from './data-explorer-types'

const props = withDefaults(
  defineProps<{
    column: ExplorerColumn<T>
    kind: ColumnKind
    align: 'left' | 'right' | 'center'
    sorts: ExplorerSort[]
    filter?: ExplorerFilter
    sortable?: boolean
    filterable?: boolean
    pin?: 'left' | 'right' | null
    pinnable?: boolean
    hideable?: boolean
    groupable?: boolean
    grouped?: boolean
  }>(),
  {
    filter: undefined,
    sortable: true,
    filterable: true,
    pin: null,
    pinnable: true,
    hideable: true,
    groupable: false,
    grouped: false,
  },
)

const emit = defineEmits<{
  (e: 'sort', dir: 'asc' | 'desc' | null): void
  (e: 'filter', filter: ExplorerFilter | null): void
  (e: 'pin', side: 'left' | 'right' | null): void
  (e: 'group'): void
  (e: 'hide'): void
}>()

const { labels, t } = useExplorerLabels()

const open = ref(false)
const operators = computed(() => OPERATORS_BY_KIND[props.kind])
// Draft state so a half-typed filter never fires a query per keystroke.
const draftOperator = ref<ExplorerOperator>(props.filter?.operator ?? operators.value[0] ?? 'contains')
const draftValue = ref(props.filter?.value ?? '')

// Reopening shows what is actually applied, not the last abandoned draft.
watch(open, (isOpen) => {
  if (!isOpen) return
  draftOperator.value = props.filter?.operator ?? operators.value[0] ?? 'contains'
  draftValue.value = props.filter?.value ?? ''
})

const sortIndex = computed(() => props.sorts.findIndex((s) => s.key === props.column.key))
const activeSort = computed(() => (sortIndex.value >= 0 ? props.sorts[sortIndex.value] : null))
const needsValue = computed(() => draftOperator.value !== 'empty')
const canApply = computed(() => !needsValue.value || draftValue.value.trim().length > 0)
const hasMenu = computed(
  () => props.sortable || props.filterable || props.pinnable || props.hideable || props.groupable,
)

function applySort(dir: 'asc' | 'desc' | null) {
  emit('sort', dir)
  open.value = false
}

function applyFilter() {
  if (!canApply.value) return
  emit('filter', {
    column: props.column.key,
    operator: draftOperator.value,
    value: needsValue.value ? draftValue.value.trim() : '',
  })
  open.value = false
}

function clearFilter() {
  emit('filter', null)
  open.value = false
}

function act(fn: () => void) {
  fn()
  open.value = false
}
</script>

<template>
  <!-- A column with nothing to configure is a plain label -- no popover,
       no affordance, no dead click target. -->
  <span
    v-if="!hasMenu"
    class="text-muted-foreground inline-flex items-center px-0 text-xs font-medium whitespace-nowrap"
  >
    <slot>{{ column.label }}</slot>
  </span>

  <Popover v-else v-model:open="open">
    <Tooltip :disabled="!column.description">
      <TooltipTrigger as-child>
        <PopoverTrigger as-child>
          <Button
            variant="ghost"
            size="xs"
            :class="[
              'text-muted-foreground hover:text-foreground -mx-2 gap-1 px-2 font-medium',
              align === 'right' ? 'ml-auto' : '',
              activeSort || filter || grouped ? 'text-foreground' : '',
            ]"
            :aria-label="t('columnOptions', { label: column.label })"
          >
            <!-- Never truncate the label: the column sizes to fit its header
                 rather than the header shrinking to fit four-character data. -->
            <span class="whitespace-nowrap"
              ><slot>{{ column.label }}</slot></span
            >
            <template v-if="activeSort">
              <ArrowUp v-if="activeSort.dir === 'asc'" class="text-foreground size-3 shrink-0" aria-hidden="true" />
              <ArrowDown v-else class="text-foreground size-3 shrink-0" aria-hidden="true" />
              <span v-if="sorts.length > 1" class="text-muted-foreground -ml-0.5 text-xs tabular-nums">{{
                sortIndex + 1
              }}</span>
            </template>
            <Layers v-if="grouped" class="text-foreground size-3 shrink-0" aria-hidden="true" />
            <!-- Always rendered on a filterable column: the funnel is how a
                 column says it can be filtered at all, and it turns solid when
                 a filter is applied. Sort-only columns show nothing. -->
            <Filter
              v-if="filterable"
              :class="['size-3 shrink-0', filter ? 'text-foreground' : 'text-muted-foreground/50']"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
      </TooltipTrigger>
      <TooltipContent v-if="column.description" side="top">{{ column.description }}</TooltipContent>
    </Tooltip>

    <PopoverContent align="start" class="w-64 p-1">
      <template v-if="sortable">
        <Button
          size="xs"
          variant="ghost"
          role="menuitemradio"
          :aria-checked="activeSort?.dir === 'asc'"
          :class="['w-full justify-start', activeSort?.dir === 'asc' ? 'bg-accent' : '']"
          @click="applySort('asc')"
        >
          <ArrowUp class="size-3.5" aria-hidden="true" />
          {{ t('sortAsc') }}
        </Button>
        <Button
          size="xs"
          variant="ghost"
          role="menuitemradio"
          :aria-checked="activeSort?.dir === 'desc'"
          :class="['w-full justify-start', activeSort?.dir === 'desc' ? 'bg-accent' : '']"
          @click="applySort('desc')"
        >
          <ArrowDown class="size-3.5" aria-hidden="true" />
          {{ t('sortDesc') }}
        </Button>
        <Button
          v-if="activeSort"
          size="xs"
          variant="ghost"
          class="text-muted-foreground w-full justify-start"
          @click="applySort(null)"
        >
          <X class="size-3.5" aria-hidden="true" />
          {{ t('clearSort') }}
        </Button>
      </template>

      <template v-if="filterable">
        <Separator v-if="sortable" class="my-1" />
        <div class="space-y-1.5 p-1">
          <Select v-model="draftOperator">
            <SelectTrigger size="sm" class="w-full" :aria-label="t('filterBy', { label: column.label })">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="op in operators" :key="op" :value="op" class="text-xs">
                {{ labels[OPERATOR_LABEL_KEYS[op]] }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            v-if="needsValue"
            v-model="draftValue"
            maxlength="64"
            size="small"
            :placeholder="labels[PLACEHOLDER_LABEL_KEYS[kind]]"
            :aria-label="t('filterValue', { label: column.label })"
            @keydown.enter.prevent="applyFilter"
          />

          <div class="flex items-center gap-1.5">
            <Button size="xs" class="flex-1" :disabled="!canApply" @click="applyFilter">{{ t('apply') }}</Button>
            <Button v-if="filter" variant="ghost" size="xs" class="text-muted-foreground" @click="clearFilter">
              <X class="size-3" aria-hidden="true" />
              {{ t('clear') }}
            </Button>
          </div>
        </div>
      </template>

      <template v-if="pinnable || groupable || hideable">
        <Separator v-if="sortable || filterable" class="my-1" />
        <template v-if="pinnable">
          <Button
            v-if="pin"
            size="xs"
            variant="ghost"
            class="w-full justify-start"
            @click="act(() => emit('pin', null))"
          >
            <PinOff class="size-3.5" aria-hidden="true" />
            {{ t('unpin') }}
          </Button>
          <template v-else>
            <Button size="xs" variant="ghost" class="w-full justify-start" @click="act(() => emit('pin', 'left'))">
              <ArrowLeftToLine class="size-3.5" aria-hidden="true" />
              {{ t('pinLeft') }}
            </Button>
            <Button size="xs" variant="ghost" class="w-full justify-start" @click="act(() => emit('pin', 'right'))">
              <ArrowRightToLine class="size-3.5" aria-hidden="true" />
              {{ t('pinRight') }}
            </Button>
          </template>
        </template>
        <Button
          v-if="groupable"
          size="xs"
          variant="ghost"
          class="w-full justify-start"
          @click="act(() => emit('group'))"
        >
          <Layers class="size-3.5" aria-hidden="true" />
          {{ grouped ? t('ungroup') : t('groupBy', { label: column.label }) }}
        </Button>
        <Button
          v-if="hideable"
          size="xs"
          variant="ghost"
          class="text-muted-foreground w-full justify-start"
          @click="act(() => emit('hide'))"
        >
          <EyeOff class="size-3.5" aria-hidden="true" />
          {{ t('hideColumn') }}
        </Button>
      </template>
    </PopoverContent>
  </Popover>
</template>

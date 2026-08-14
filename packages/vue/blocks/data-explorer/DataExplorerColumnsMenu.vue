<script setup lang="ts" generic="T extends ExplorerRow">
// The columns popover: show/hide, pin and reorder every column from one list,
// with a reset back to the configured defaults. Per-column versions of these
// live in the header menu; this is the overview.
import { computed, useId } from 'vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronUp, Columns3, Pin, PinOff, RotateCcw } from './data-explorer-icons'
import { useExplorerLabels } from './data-explorer-labels'
import type { ExplorerColumn, ExplorerRow } from './data-explorer-types'

const props = defineProps<{
  columns: ExplorerColumn<T>[]
  order: string[]
  hidden: Set<string>
  pins: Record<string, 'left' | 'right'>
}>()

const emit = defineEmits<{
  (e: 'toggle', key: string): void
  (e: 'pin', key: string, side: 'left' | 'right' | null): void
  (e: 'move', key: string, dir: 'left' | 'right'): void
  (e: 'reset'): void
}>()

const ordered = computed(() => {
  const byKey = new Map(props.columns.map((c) => [c.key, c]))
  const listed = props.order.map((k) => byKey.get(k)).filter((c): c is ExplorerColumn<T> => !!c)
  return [...listed, ...props.columns.filter((c) => !props.order.includes(c.key))].filter((c) => c.type !== 'actions')
})

// Several explorers can share a page; label ids must not collide.
const uid = useId()
const { t } = useExplorerLabels()

const hiddenCount = computed(() => ordered.value.filter((c) => props.hidden.has(c.key)).length)

function pinOf(c: ExplorerColumn<T>) {
  return props.pins[c.key] ?? c.pin ?? null
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="xs" :aria-label="t('columns')">
        <Columns3 class="text-muted-foreground size-3.5" aria-hidden="true" />
        <span class="hidden sm:inline">{{ t('columns') }}</span>
        <span v-if="hiddenCount" class="text-muted-foreground tabular-nums">−{{ hiddenCount }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="w-72 p-1">
      <div role="group" :aria-label="t('columns')" class="max-h-80 space-y-0.5 overflow-y-auto">
        <div
          v-for="(c, i) in ordered"
          :key="c.key"
          class="hover:bg-accent/60 flex items-center gap-2 rounded-sm py-1 pr-1 pl-2"
        >
          <Checkbox
            :id="`${uid}-col-${c.key}`"
            :model-value="!hidden.has(c.key)"
            :disabled="c.hideable === false"
            size="sm"
            @update:model-value="emit('toggle', c.key)"
          />
          <label :for="`${uid}-col-${c.key}`" class="min-w-0 flex-1 cursor-pointer truncate text-xs">
            {{ c.label }}
          </label>
          <span v-if="pinOf(c)" class="text-muted-foreground text-xs">{{ pinOf(c) }}</span>
          <Button
            variant="ghost"
            size="icon-2xs"
            :aria-label="pinOf(c) ? t('unpinColumn', { label: c.label }) : t('pinColumn', { label: c.label })"
            @click="emit('pin', c.key, pinOf(c) ? null : 'left')"
          >
            <PinOff v-if="pinOf(c)" class="size-3" aria-hidden="true" />
            <Pin v-else class="text-muted-foreground size-3" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-2xs"
            :aria-label="t('moveUp', { label: c.label })"
            :disabled="i === 0"
            @click="emit('move', c.key, 'left')"
          >
            <ChevronUp class="text-muted-foreground size-3" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-2xs"
            :aria-label="t('moveDown', { label: c.label })"
            :disabled="i === ordered.length - 1"
            @click="emit('move', c.key, 'right')"
          >
            <ChevronDown class="text-muted-foreground size-3" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <Separator class="my-1" />
      <Button variant="ghost" size="xs" class="text-muted-foreground w-full justify-start" @click="emit('reset')">
        <RotateCcw class="size-3" aria-hidden="true" />
        {{ t('resetColumns') }}
      </Button>
    </PopoverContent>
  </Popover>
</template>

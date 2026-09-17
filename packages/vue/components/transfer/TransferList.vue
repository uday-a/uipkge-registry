<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { GripVertical, Search } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TRANSFER_INJECTION_KEY, type TransferItem, type TransferSide } from './context'

const props = defineProps<{
  side: TransferSide
  title: string
  items: TransferItem[]
  selected: string[]
}>()

const emits = defineEmits<{
  (e: 'update:selected', keys: string[]): void
  (e: 'search', query: string): void
}>()

const _maybeCtx = inject(TRANSFER_INJECTION_KEY, null)
if (!_maybeCtx) throw new Error('TransferList must be used inside <Transfer>.')
const ctx: NonNullable<typeof _maybeCtx> = _maybeCtx

const query = ref('')
const page = ref(1)

const filtered = computed(() => {
  if (!query.value) return props.items
  return props.items.filter((i) => ctx.filterFn(query.value, i))
})

const effectivePageSize = computed(() => ctx.pageSize.value ?? Math.max(1, filtered.value.length))
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / effectivePageSize.value)))

const visible = computed(() => {
  if (!ctx.pageSize.value) return filtered.value
  const start = (page.value - 1) * effectivePageSize.value
  return filtered.value.slice(start, start + effectivePageSize.value)
})

watch(filtered, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

const visibleEnabledKeys = computed(() => visible.value.filter((i) => !i.disabled).map((i) => i.key))
const selectedSet = computed(() => new Set(props.selected))

const visibleSelectedCount = computed(() => visibleEnabledKeys.value.filter((k) => selectedSet.value.has(k)).length)

const masterChecked = computed(
  () => visibleEnabledKeys.value.length > 0 && visibleSelectedCount.value === visibleEnabledKeys.value.length,
)

const masterIndeterminate = computed(
  () => visibleSelectedCount.value > 0 && visibleSelectedCount.value < visibleEnabledKeys.value.length,
)

function toggleAll(checked: boolean) {
  let next = [...props.selected]
  if (checked) {
    for (const k of visibleEnabledKeys.value) {
      if (!selectedSet.value.has(k)) next.push(k)
    }
  } else {
    next = next.filter((k) => !visibleEnabledKeys.value.includes(k))
  }
  emits('update:selected', next)
}

function toggleItem(item: TransferItem, checked: boolean) {
  if (item.disabled || ctx.disabled.value) return
  let next = [...props.selected]
  if (checked) {
    if (!next.includes(item.key)) next.push(item.key)
  } else {
    next = next.filter((k) => k !== item.key)
  }
  emits('update:selected', next)
  lastAnchor.value = item.key
}

const lastAnchor = ref<string | null>(null)

function onRowClick(e: MouseEvent, item: TransferItem) {
  if (item.disabled || ctx.disabled.value) return
  // With checkbox visible, click toggles (matches checkbox UX).
  if (ctx.selectable.value) {
    toggleItem(item, !selectedSet.value.has(item.key))
    return
  }
  // No checkbox: desktop list pattern — plain=replace, cmd/ctrl=toggle, shift=range.
  const enabledKeys = visible.value.filter((i) => !i.disabled).map((i) => i.key)
  if (e.shiftKey && lastAnchor.value && enabledKeys.includes(lastAnchor.value)) {
    const start = enabledKeys.indexOf(lastAnchor.value)
    const end = enabledKeys.indexOf(item.key)
    const [lo, hi] = start < end ? [start, end] : [end, start]
    emits('update:selected', enabledKeys.slice(lo, hi + 1))
    return
  }
  if (e.metaKey || e.ctrlKey) {
    let next = [...props.selected]
    if (selectedSet.value.has(item.key)) next = next.filter((k) => k !== item.key)
    else next.push(item.key)
    emits('update:selected', next)
    lastAnchor.value = item.key
    return
  }
  emits('update:selected', [item.key])
  lastAnchor.value = item.key
}

function getOptionRows(from: HTMLElement): HTMLElement[] {
  const list = from.closest('[role="listbox"]')
  if (!list) return []
  return Array.from(list.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'))
}

function focusOption(el: HTMLElement | null | undefined) {
  el?.focus()
}

function onRowKeydown(e: KeyboardEvent, item: TransferItem) {
  const target = e.currentTarget as HTMLElement

  // Arrow navigation within the list.
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const rows = getOptionRows(target)
    const idx = rows.indexOf(target)
    if (idx < 0) return
    focusOption(e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1])
    return
  }

  if (e.key === 'Home') {
    e.preventDefault()
    focusOption(getOptionRows(target)[0])
    return
  }

  if (e.key === 'End') {
    e.preventDefault()
    const rows = getOptionRows(target)
    focusOption(rows[rows.length - 1])
    return
  }

  // Keys to transfer: current multi-selection, or just the focused item.
  function keysToTransfer(): string[] {
    if (selectedSet.value.has(item.key) && props.selected.length > 0) {
      return props.selected.filter((k) => {
        const i = props.items.find((x) => x.key === k)
        return i && !i.disabled
      })
    }
    return item.disabled ? [] : [item.key]
  }

  // Ctrl/Cmd+Enter transfers selected items (or the focused item if none selected).
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    if (item.disabled || ctx.disabled.value) return
    const keys = keysToTransfer()
    if (!keys.length) return
    if (props.side === 'left') ctx.moveRight(keys)
    else if (!ctx.oneWay.value) ctx.moveLeft(keys)
    return
  }

  // Alt+Arrow transfers without redesigning the button strip.
  if (e.key === 'ArrowRight' && e.altKey && props.side === 'left') {
    e.preventDefault()
    if (item.disabled || ctx.disabled.value) return
    const keys = keysToTransfer()
    if (keys.length) ctx.moveRight(keys)
    return
  }

  if (e.key === 'ArrowLeft' && e.altKey && props.side === 'right' && !ctx.oneWay.value) {
    e.preventDefault()
    if (item.disabled || ctx.disabled.value) return
    const keys = keysToTransfer()
    if (keys.length) ctx.moveLeft(keys)
    return
  }

  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  if (item.disabled || ctx.disabled.value) return
  if (ctx.selectable.value) {
    toggleItem(item, !selectedSet.value.has(item.key))
    return
  }
  // Keyboard without modifiers: toggle single-item selection (desktop replace).
  emits('update:selected', selectedSet.value.has(item.key) && props.selected.length === 1 ? [] : [item.key])
  lastAnchor.value = item.key
}

function onSearch(v: string) {
  query.value = v
  page.value = 1
  emits('search', v)
}

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

const heightStyle = computed(() => ({
  height: typeof ctx.height.value === 'number' ? ctx.height.value + 'px' : ctx.height.value,
}))

// ----- DnD -----

const dropIndicator = ref<{ key: string; position: 'before' | 'after' } | null>(null)
const draggingKeys = ref<Set<string>>(new Set())

const isDropTarget = computed(() => {
  const p = ctx.dragPayload.value
  if (!p) return false
  // left list rejects drops when oneWay
  if (props.side === 'left' && ctx.oneWay.value && p.fromSide === 'right') return false
  // left → left is a no-op (parent owns dataSource order)
  if (props.side === 'left' && p.fromSide === 'left') return false
  return true
})

function onItemDragStart(e: DragEvent, item: TransferItem) {
  if (!ctx.draggable.value || item.disabled || ctx.disabled.value) {
    e.preventDefault()
    return
  }
  // If the dragged row is part of the current selection, drag the whole selection.
  // Else, drag just this row (and clear selection visually for clarity).
  const keys = selectedSet.value.has(item.key)
    ? props.selected.filter((k) => {
        const i = props.items.find((x) => x.key === k)
        return i && !i.disabled
      })
    : [item.key]
  draggingKeys.value = new Set(keys)
  ctx.startDrag({ keys, fromSide: props.side })
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    // Required by Firefox to actually start the drag.
    try {
      e.dataTransfer.setData('text/plain', keys.join(','))
    } catch {
      /* noop */
    }
  }
}

function onItemDragEnd() {
  draggingKeys.value = new Set()
  dropIndicator.value = null
  ctx.endDrag()
}

function onItemDragOver(e: DragEvent, item: TransferItem) {
  if (!isDropTarget.value) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  if (props.side !== 'right') {
    // left list: no insertion indicator, drop just removes from target
    return
  }
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const after = e.clientY > rect.top + rect.height / 2
  dropIndicator.value = { key: item.key, position: after ? 'after' : 'before' }
}

function onItemDrop(e: DragEvent, item: TransferItem) {
  if (!isDropTarget.value) return
  e.preventDefault()
  e.stopPropagation()
  if (props.side === 'right') {
    const after = dropIndicator.value?.position === 'after'
    const idx = props.items.findIndex((x) => x.key === item.key)
    const beforeKey = after ? (props.items[idx + 1]?.key ?? null) : item.key
    ctx.drop('right', beforeKey)
  } else {
    ctx.drop('left', null)
  }
  dropIndicator.value = null
}

function onListDragOver(e: DragEvent) {
  if (!isDropTarget.value) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

function onListDrop(e: DragEvent) {
  if (!isDropTarget.value) return
  e.preventDefault()
  // Empty zone or below all items → append (right) / remove (left).
  ctx.drop(props.side, null)
  dropIndicator.value = null
}

function onListDragLeave(e: DragEvent) {
  // Clear indicator only when leaving the list container, not when crossing item rows.
  const related = e.relatedTarget as Node | null
  const current = e.currentTarget as Node
  if (!related || !current.contains(related)) {
    dropIndicator.value = null
  }
}
</script>

<template>
  <div
    class="bg-card flex flex-col overflow-hidden rounded-md border transition-colors"
    :class="[ctx.dragPayload.value && isDropTarget && 'ring-ring/40 ring-1']"
  >
    <div class="bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
      <div class="flex min-w-0 items-center gap-2">
        <Checkbox
          v-if="ctx.selectable.value"
          :model-value="masterIndeterminate ? 'indeterminate' : masterChecked"
          :disabled="ctx.disabled.value || visibleEnabledKeys.length === 0"
          :aria-label="`Select all in ${title}`"
          @update:model-value="toggleAll($event === true)"
        />
        <span class="truncate text-sm font-medium">{{ title }}</span>
      </div>
      <span class="text-muted-foreground text-xs tabular-nums"> {{ selected.length }}/{{ items.length }} </span>
    </div>

    <div v-if="ctx.showSearch.value" class="border-b p-2">
      <div class="relative">
        <Search
          class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          :model-value="query"
          placeholder="Search"
          :aria-label="`Search ${title}`"
          class="h-8 pl-8"
          @update:model-value="(v) => onSearch(String(v ?? ''))"
        />
      </div>
    </div>

    <ScrollArea
      :style="heightStyle"
      class="flex-1"
      @dragover="onListDragOver"
      @drop="onListDrop"
      @dragleave="onListDragLeave"
    >
      <ul role="listbox" :aria-label="title" aria-multiselectable="true" class="py-1">
        <li
          v-for="item in visible"
          :key="item.key"
          role="option"
          :aria-selected="selectedSet.has(item.key)"
          :aria-disabled="item.disabled || undefined"
          :tabindex="item.disabled || ctx.disabled.value ? -1 : 0"
          :draggable="ctx.draggable.value && !item.disabled && !ctx.disabled.value"
          :class="[
            'hover:bg-accent focus-visible:ring-ring relative flex min-h-11 cursor-pointer items-start gap-2 px-3 py-3 text-sm select-none focus-visible:ring-2 focus-visible:outline-none',
            item.disabled && 'cursor-not-allowed opacity-50',
            draggingKeys.has(item.key) && 'opacity-40',
            !ctx.selectable.value && selectedSet.has(item.key) && 'bg-accent',
          ]"
          @click="(e) => onRowClick(e, item)"
          @keydown="(e) => onRowKeydown(e, item)"
          @dragstart="(e) => onItemDragStart(e, item)"
          @dragend="onItemDragEnd"
          @dragover="(e) => onItemDragOver(e, item)"
          @drop="(e) => onItemDrop(e, item)"
        >
          <span
            v-if="
              dropIndicator && dropIndicator.key === item.key && dropIndicator.position === 'before' && side === 'right'
            "
            class="bg-primary pointer-events-none absolute -top-px right-2 left-2 h-0.5 rounded-full"
            aria-hidden="true"
          />
          <span
            v-if="
              dropIndicator && dropIndicator.key === item.key && dropIndicator.position === 'after' && side === 'right'
            "
            class="bg-primary pointer-events-none absolute right-2 -bottom-px left-2 h-0.5 rounded-full"
            aria-hidden="true"
          />
          <Checkbox
            v-if="ctx.selectable.value"
            :model-value="selectedSet.has(item.key)"
            :disabled="item.disabled || ctx.disabled.value"
            @update:model-value="toggleItem(item, $event === true)"
            @click.stop
          />
          <div class="min-w-0 flex-1">
            <div class="truncate">{{ item.label }}</div>
            <div v-if="item.description" class="text-muted-foreground truncate text-xs">
              {{ item.description }}
            </div>
          </div>
          <GripVertical
            v-if="ctx.draggable.value && !item.disabled"
            class="text-muted-foreground/60 mt-0.5 size-3.5 shrink-0"
            aria-hidden="true"
          />
        </li>
        <li v-if="visible.length === 0" class="text-muted-foreground px-3 py-6 text-center text-sm">No items</li>
      </ul>
    </ScrollArea>

    <div
      v-if="ctx.pageSize.value && totalPages > 1"
      class="flex items-center justify-center gap-2 border-t p-2 text-xs"
    >
      <button
        type="button"
        class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="page <= 1"
        :aria-label="`Previous page of ${title}`"
        @click="prevPage"
      >
        Prev
      </button>
      <span class="tabular-nums" aria-live="polite">{{ page }} / {{ totalPages }}</span>
      <button
        type="button"
        class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="page >= totalPages"
        :aria-label="`Next page of ${title}`"
        @click="nextPage"
      >
        Next
      </button>
    </div>

    <div v-if="$slots.footer" class="border-t p-2">
      <slot name="footer" />
    </div>
  </div>
</template>

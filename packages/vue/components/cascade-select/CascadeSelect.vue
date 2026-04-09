<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { Check, ChevronDown, ChevronRight, Loader2, Search, X } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { CascadeOption } from './types'

interface Props {
  modelValue?: string[] | null
  options: CascadeOption[]
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'default' | 'lg'
  separator?: string
  searchPlaceholder?: string
  emptyText?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  searchable: true,
  clearable: true,
  disabled: false,
  loading: false,
  size: 'default',
  separator: ' / ',
  searchPlaceholder: 'Search...',
  emptyText: 'No options.',
})

const emits = defineEmits<{
  'update:modelValue': [value: string[] | null]
  change: [value: string[] | null, path: CascadeOption[]]
  clear: []
}>()

const isOpen = ref(false)
const activePath = ref<number[]>([])
const search = ref('')

// Sync active path with modelValue when opened
watch(isOpen, (open) => {
  if (open && props.modelValue?.length) {
    activePath.value = findPathIndices(props.options, props.modelValue)
  } else if (open) {
    activePath.value = []
  }
  if (!open) search.value = ''
})

function findPathIndices(options: CascadeOption[], values: string[]): number[] {
  const indices: number[] = []
  let current = options
  for (const val of values) {
    const idx = current.findIndex((o) => o.value === val)
    if (idx === -1) return indices
    indices.push(idx)
    const next = current[idx].children
    if (!next?.length) break
    current = next
  }
  return indices
}

function getOptionsAtLevel(level: number): CascadeOption[] {
  let current = props.options
  for (let i = 0; i < level; i++) {
    const idx = activePath.value[i]
    if (idx == null || !current[idx]?.children?.length) return []
    current = current[idx].children!
  }
  return current
}

function selectAtLevel(level: number, index: number) {
  const option = getOptionsAtLevel(level)[index]
  if (option?.disabled) return
  const next = [...activePath.value]
  next[level] = index
  next.splice(level + 1)
  activePath.value = next

  // If leaf node, emit the value
  if (!option?.children?.length) {
    const path = buildPathFromIndices(next)
    const values = path.map((p) => p.value)
    emits('update:modelValue', values)
    emits('change', values, path)
    isOpen.value = false
  }
}

function buildPathFromIndices(indices: number[]): CascadeOption[] {
  const path: CascadeOption[] = []
  let current = props.options
  for (const idx of indices) {
    if (idx == null || !current[idx]) break
    const opt = current[idx]
    path.push(opt)
    if (!opt.children?.length) break
    current = opt.children
  }
  return path
}

const selectedPath = computed<CascadeOption[]>(() => {
  if (!props.modelValue?.length) return []
  return buildPathFromIndices(findPathIndices(props.options, props.modelValue))
})

const displayLabel = computed(() => {
  if (selectedPath.value.length === 0) return props.placeholder
  return selectedPath.value.map((p) => p.label).join(props.separator)
})

const hasValue = computed(() => selectedPath.value.length > 0)

function clearAll(event?: Event) {
  event?.stopPropagation()
  if (props.disabled) return
  emits('clear')
  emits('update:modelValue', null)
  emits('change', null, [])
  activePath.value = []
}

function onTriggerKeydown(e: KeyboardEvent) {
  // Escape clears the value when the popover is closed (open Escape is
  // handled by Popover). Replaces the old nested clear button for keyboard.
  if (e.key === 'Escape' && !isOpen.value && props.clearable && hasValue.value && !props.disabled) {
    e.preventDefault()
    clearAll()
  }
}

// Search: flatten the tree and match
const searchResults = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return null
  const results: { path: CascadeOption[]; values: string[] }[] = []
  const walk = (options: CascadeOption[], path: CascadeOption[], values: string[]) => {
    for (const opt of options) {
      const newPath = [...path, opt]
      const newValues = [...values, opt.value]
      if (opt.label.toLowerCase().includes(q) && !opt.children?.length) {
        results.push({ path: newPath, values: newValues })
      }
      if (opt.children?.length) {
        walk(opt.children, newPath, newValues)
      }
    }
  }
  walk(props.options, [], [])
  return results
})

function selectSearchResult(result: { path: CascadeOption[]; values: string[] }) {
  emits('update:modelValue', result.values)
  emits('change', result.values, result.path)
  isOpen.value = false
  search.value = ''
}

const sizeClasses = {
  sm: 'h-8 text-xs px-2.5',
  default: 'h-9 text-sm px-3',
  lg: 'h-11 text-base px-4',
}

const triggerClasses = computed(() =>
  cn(
    'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none',
    'hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[props.size],
    props.class,
  ),
)

const levels = computed(() => {
  const result: { options: CascadeOption[]; level: number }[] = [{ options: props.options, level: 0 }]
  for (let i = 0; i < activePath.value.length; i++) {
    const idx = activePath.value[i]
    const current = result[i].options
    if (idx == null || !current[idx]?.children?.length) break
    result.push({ options: current[idx].children!, level: i + 1 })
  }
  return result
})
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        role="combobox"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :disabled="disabled || loading"
        data-uipkge
        data-slot="cascade-select"
        :class="triggerClasses"
        @keydown="onTriggerKeydown"
      >
        <span :class="['flex-1 truncate text-left', hasValue ? 'text-foreground' : 'text-muted-foreground']">
          {{ displayLabel }}
        </span>
        <span class="flex shrink-0 items-center gap-1">
          <Loader2 v-if="loading" class="text-muted-foreground size-4 animate-spin" />
          <!-- Decorative clear affordance (not a nested button). Nested
               interactive content inside the combobox button is invalid HTML
               and confuses assistive tech. Click clears; Escape also clears
               when the popover is closed (see @keydown on the trigger). -->
          <span
            v-else-if="clearable && hasValue && !disabled"
            aria-hidden="true"
            class="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded transition-colors"
            @click.stop="clearAll"
          >
            <X class="size-4" />
          </span>
          <ChevronDown
            v-else
            class="text-muted-foreground size-4 shrink-0 transition-transform duration-200"
            :class="isOpen ? 'rotate-180' : ''"
          />
        </span>
      </button>
    </PopoverTrigger>

    <PopoverContent class="p-0" align="start" :side-offset="4" :style="{ width: 'var(--reka-popover-trigger-width)' }">
      <div class="flex max-h-80 flex-col">
        <div v-if="searchable" class="border-b p-2">
          <div class="relative">
            <Search class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              v-model="search"
              :placeholder="searchPlaceholder"
              aria-label="Search options"
              class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
            />
          </div>
        </div>

        <div v-if="loading" class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
          <Loader2 class="size-4 animate-spin" />
          Loading...
        </div>

        <!-- Search results -->
        <div v-else-if="searchResults" class="flex-1 overflow-y-auto p-1">
          <div v-if="searchResults.length === 0" class="text-muted-foreground py-6 text-center text-sm">
            {{ emptyText }}
          </div>
          <button
            v-for="(result, i) in searchResults"
            :key="i"
            type="button"
            class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:outline-none"
            @click="selectSearchResult(result)"
          >
            <span class="flex-1 truncate">{{ result.path.map((p) => p.label).join(separator) }}</span>
          </button>
        </div>

        <!-- Cascading panels — horizontal scroll -->
        <div v-else class="flex flex-1 overflow-x-auto overflow-y-hidden">
          <div
            v-for="lvl in levels"
            :key="lvl.level"
            class="max-w-56 min-w-44 shrink-0 overflow-y-auto border-r p-1 last:border-r-0"
          >
            <button
              v-for="(opt, idx) in lvl.options"
              :key="opt.value"
              type="button"
              :disabled="opt.disabled"
              :class="
                cn(
                  'flex w-full items-center justify-between gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none',
                  'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  activePath[lvl.level] === idx && 'bg-accent text-accent-foreground font-medium',
                )
              "
              @click="selectAtLevel(lvl.level, idx)"
            >
              <span class="flex-1 truncate">{{ opt.label }}</span>
              <Check v-if="activePath[lvl.level] === idx && !opt.children?.length" class="size-4 shrink-0" />
              <ChevronRight v-else-if="opt.children?.length" class="text-muted-foreground size-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

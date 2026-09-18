<script setup lang="ts" generic="O extends MentionOption">
import { computed, nextTick, onBeforeUnmount, ref, useId } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { getCaretRect, type CaretRect } from './caret-position'
import type { MentionOption } from '.'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: O[] | Record<string, O[]>
    triggers?: string[]
    triggerPrefixes?: Record<string, string>
    prefix?: string
    rows?: number
    loading?: boolean
    loadOptions?: (query: string, trigger: string) => Promise<O[]>
    format?: (option: O, trigger: string) => string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    modelValue: '',
    options: () => [] as any,
    triggers: () => ['@'],
    prefix: '@',
    rows: 4,
    loading: false,
    placeholder: '',
    disabled: false,
    readonly: false,
  },
)

const listboxId = useId()
function optionId(i: number) {
  return `${listboxId}-opt-${i}`
}

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', option: O): void
  (e: 'search', payload: { trigger: string; query: string }): void
}>()

const textarea = ref<HTMLTextAreaElement | null>(null)
const open = ref(false)
const activeTrigger = ref('')
const query = ref('')
const triggerIndex = ref(-1)
const highlightedIndex = ref(0)
const asyncResults = ref<O[]>([])
const isAsyncLoading = ref(false)

const caretRect = ref<CaretRect | null>(null)

const currentOptionsList = computed<O[]>(() => {
  if (!props.options) return []
  if (Array.isArray(props.options)) return props.options as O[]
  if (typeof props.options === 'object') {
    const list = (props.options as Record<string, O[]>)[activeTrigger.value]
    return list ?? []
  }
  return []
})

const filtered = computed((): O[] => {
  if (props.loadOptions) return asyncResults.value as O[]
  const source = currentOptionsList.value
  if (!query.value) return source
  const q = query.value.toLowerCase()
  return source.filter(
    (o) =>
      o.label.toLowerCase().includes(q) ||
      o.value.toLowerCase().includes(q) ||
      (o.email && o.email.toLowerCase().includes(q)),
  )
})

const totalLoading = computed(() => props.loading || isAsyncLoading.value)

function findActiveMention(value: string, caret: number): { trigger: string; index: number; query: string } | null {
  for (let i = caret - 1; i >= 0; i--) {
    const ch = value[i]!
    if (props.triggers.includes(ch)) {
      const before = i === 0 ? '' : value[i - 1]!
      if (i === 0 || /\s/.test(before)) {
        return { trigger: ch, index: i, query: value.substring(i + 1, caret) }
      }
      return null
    }
    if (/\s/.test(ch)) return null
  }
  return null
}

function updateAnchor() {
  if (!textarea.value) return
  caretRect.value = getCaretRect(textarea.value, textarea.value.selectionStart ?? 0)
}

let asyncToken = 0
async function runAsync(trigger: string, q: string) {
  if (!props.loadOptions) return
  const token = ++asyncToken
  isAsyncLoading.value = true
  try {
    const results = await props.loadOptions(q, trigger)
    if (token === asyncToken) asyncResults.value = results
  } finally {
    if (token === asyncToken) isAsyncLoading.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function scheduleAsync(trigger: string, q: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => runAsync(trigger, q), 200)
}

function onInput(e: Event) {
  const ta = e.target as HTMLTextAreaElement
  emits('update:modelValue', ta.value)

  const match = findActiveMention(ta.value, ta.selectionStart ?? 0)
  if (match) {
    open.value = true
    activeTrigger.value = match.trigger
    triggerIndex.value = match.index
    query.value = match.query
    highlightedIndex.value = firstEnabledIndex()
    emits('search', { trigger: match.trigger, query: match.query })
    if (props.loadOptions) scheduleAsync(match.trigger, match.query)
    nextTick(updateAnchor)
  } else {
    open.value = false
  }
}

function firstEnabledIndex() {
  const i = filtered.value.findIndex((o) => !o.disabled)
  return i === -1 ? 0 : i
}

function moveHighlight(delta: number) {
  const len = filtered.value.length
  if (len === 0) return
  let i = highlightedIndex.value
  for (let n = 0; n < len; n++) {
    i = (i + delta + len) % len
    if (!filtered.value[i]?.disabled) {
      highlightedIndex.value = i
      nextTick(() => {
        document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' })
      })
      return
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  // Escape must work even when there are no matches / still loading.
  if (e.key === 'Escape') {
    e.preventDefault()
    open.value = false
    return
  }
  if (filtered.value.length === 0) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    moveHighlight(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    moveHighlight(-1)
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    const opt = filtered.value[highlightedIndex.value]
    if (opt && !opt.disabled) insert(opt)
  }
}

function defaultFormat(option: O, trigger: string) {
  const resolvedPrefix = props.triggerPrefixes?.[trigger] ?? trigger ?? props.prefix ?? '@'
  return `${resolvedPrefix}${option.value} `
}

function insert(option: O) {
  const ta = textarea.value
  if (!ta) return
  const value = props.modelValue
  const caret = ta.selectionStart ?? 0
  const before = value.substring(0, triggerIndex.value)
  const after = value.substring(caret)
  const token = (props.format ?? defaultFormat)(option, activeTrigger.value)
  const next = before + token + after
  emits('update:modelValue', next)
  emits('select', option)
  open.value = false
  nextTick(() => {
    const pos = before.length + token.length
    ta.focus()
    ta.setSelectionRange(pos, pos)
  })
}

const anchorStyle = computed(() => {
  if (!caretRect.value) return { display: 'none' }
  return {
    position: 'fixed' as const,
    top: `${caretRect.value.top + caretRect.value.height}px`,
    left: `${caretRect.value.left}px`,
    width: '0px',
    height: '0px',
    pointerEvents: 'none' as const,
  }
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div :class="cn('relative w-full', props.class)" data-uipkge data-slot="mentions">
    <textarea
      ref="textarea"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      role="combobox"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-activedescendant="open && filtered.length > 0 ? optionId(highlightedIndex) : undefined"
      class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-16 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      @input="onInput"
      @keydown="onKeydown"
      @scroll="updateAnchor"
    />
    <Popover :open="open" @update:open="open = $event">
      <PopoverAnchor as-child>
        <div :style="anchorStyle" aria-hidden="true" />
      </PopoverAnchor>
      <PopoverContent
        align="start"
        :side-offset="4"
        class="border-border/80 w-64 rounded-lg p-1 shadow-md"
        @open-auto-focus="(e: Event) => e.preventDefault()"
      >
        <div :id="listboxId">
          <slot name="header" :trigger="activeTrigger" :query="query" />

          <div v-if="totalLoading" class="text-muted-foreground px-2 py-3 text-sm" role="status">
            <slot name="loading">Loading...</slot>
          </div>
          <div v-else-if="filtered.length === 0" class="text-muted-foreground px-2 py-3 text-sm" role="status">
            <slot name="empty" :trigger="activeTrigger" :query="query">No matches</slot>
          </div>
          <ul v-else class="max-h-64 overflow-auto" role="listbox" aria-label="Mentions">
            <li
              v-for="(opt, i) in filtered"
              :id="optionId(i)"
              :key="opt.value"
              role="option"
              :aria-selected="i === highlightedIndex"
              :aria-disabled="opt.disabled || undefined"
              :class="[
                'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                i === highlightedIndex && !opt.disabled ? 'bg-accent text-accent-foreground' : '',
                opt.disabled ? 'cursor-not-allowed opacity-50' : '',
              ]"
              @mouseenter="!opt.disabled && (highlightedIndex = i)"
              @mousedown.prevent="!opt.disabled && insert(opt)"
            >
              <slot name="option" :option="opt" :index="i" :active="i === highlightedIndex" :trigger="activeTrigger">
                <img v-if="opt.avatar" :src="opt.avatar" alt="" class="size-6 rounded-full object-cover" />
                <div class="min-w-0 flex-1">
                  <div class="truncate font-medium">{{ opt.label }}</div>
                  <div v-if="opt.description || opt.email" class="text-muted-foreground truncate text-xs">
                    {{ opt.description || opt.email }}
                  </div>
                </div>
              </slot>
            </li>
          </ul>

          <slot name="footer" :trigger="activeTrigger" :count="filtered.length" />
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

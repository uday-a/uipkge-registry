<script setup lang="ts" generic="T extends Record<string, unknown> | string | number">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { Check, ChevronDown, Loader2, X } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import CommandSearchSync from './CommandSearchSync.vue'
import { Badge } from '@/components/ui/badge'
import { readKey } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { AdvanceSelectFieldNames } from './types'

interface Props {
  modelValue?: unknown | unknown[]
  options: T[]

  // Mode
  mode?: 'single' | 'multiple' | 'tags'

  // Field mapping
  fieldNames?: AdvanceSelectFieldNames

  // Appearance
  size?: 'sm' | 'default' | 'lg'
  variant?: 'outlined' | 'filled' | 'borderless'
  status?: 'default' | 'error' | 'warning'
  placeholder?: string

  // Search
  showSearch?: boolean
  searchValue?: string
  autoClearSearchValue?: boolean
  filterOption?: boolean | ((input: string, option: T) => boolean)
  optionFilterProp?: string | string[]
  filterSort?: (optionA: T, optionB: T, info: { searchValue: string }) => number

  // Multiple/Tags
  maxCount?: number
  maxTagCount?: number
  maxTagTextLength?: number
  maxTagPlaceholder?: string | ((omittedValues: T[]) => string)
  tokenSeparators?: string[]
  hideSelected?: boolean
  allowCreate?: boolean

  // State
  disabled?: boolean
  loading?: boolean
  allowClear?: boolean
  open?: boolean
  defaultOpen?: boolean
  defaultActiveFirstOption?: boolean

  // Customization
  notFoundContent?: string
  loadingText?: string
  listHeight?: number
  virtual?: boolean

  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'single',
  fieldNames: () => ({}),
  size: 'default',
  variant: 'outlined',
  status: 'default',
  placeholder: 'Select...',
  showSearch: false,
  autoClearSearchValue: true,
  filterOption: true,
  optionFilterProp: 'label',
  maxTagCount: undefined,
  maxTagTextLength: undefined,
  tokenSeparators: () => [],
  hideSelected: false,
  allowCreate: false,
  disabled: false,
  loading: false,
  allowClear: true,
  defaultOpen: false,
  defaultActiveFirstOption: true,
  notFoundContent: 'No results.',
  loadingText: 'Loading...',
  listHeight: 300,
  virtual: true,
})

const emits = defineEmits<{
  'update:modelValue': [value: unknown | unknown[]]
  'update:open': [open: boolean]
  'update:searchValue': [value: string]
  change: [value: unknown | unknown[], option: T | T[]]
  select: [value: unknown, option: T]
  deselect: [value: unknown, option: T]
  search: [value: string]
  clear: []
  openChange: [open: boolean]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  popupScroll: [event: Event]
  inputKeyDown: [event: KeyboardEvent]
}>()

const isOpen = ref(props.defaultOpen)

watch(
  () => props.open,
  (v) => {
    if (v !== undefined) isOpen.value = v
  },
)

watch(isOpen, (v) => {
  emits('update:open', v)
  emits('openChange', v)
})

const internalQuery = ref('')
const query = computed({
  get: () => props.searchValue ?? internalQuery.value,
  set: (v) => {
    internalQuery.value = v
    emits('update:searchValue', v)
    emits('search', v)
  },
})

const inputRef = ref<HTMLInputElement>()

const valueKey = computed(() => props.fieldNames.value ?? 'value')
const labelKey = computed(() => props.fieldNames.label ?? 'label')
const groupKey = computed(() => props.fieldNames.group ?? 'group')
const disabledKey = computed(() => props.fieldNames.disabled ?? 'disabled')

function getValue(o: T): unknown {
  return readKey(o, valueKey.value, o)
}
function getLabel(o: T): string {
  return String(readKey(o, labelKey.value, ''))
}
function getGroup(o: T): string | undefined {
  const g = readKey(o, groupKey.value)
  return g == null ? undefined : String(g)
}
function isDisabled(o: T): boolean {
  return Boolean(readKey(o, disabledKey.value, false))
}

const isMultiple = computed(() => props.mode === 'multiple' || props.mode === 'tags')

const selectedValues = computed(() => {
  if (props.modelValue == null) return []
  if (isMultiple.value) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return [props.modelValue]
})

const selectedSet = computed(() => new Set(selectedValues.value))

const selectedOptions = computed(() => {
  return selectedValues.value.map((v) => {
    const found = props.options.find((o) => getValue(o) === v)
    if (found) return found
    // For created tags not in options, create a minimal option object
    return { [labelKey.value]: String(v), [valueKey.value]: v } as T
  })
})

function getOptionByValue(v: unknown): T | undefined {
  return props.options.find((o) => getValue(o) === v)
}

function matchesFilter(o: T, q: string): boolean {
  if (typeof props.filterOption === 'function') {
    return props.filterOption(q, o)
  }
  if (props.filterOption === false) return true
  const label = getLabel(o).toLowerCase()
  const search = q.toLowerCase()
  const propsToSearch = Array.isArray(props.optionFilterProp) ? props.optionFilterProp : [props.optionFilterProp]
  for (const prop of propsToSearch) {
    if (prop === 'label' && label.includes(search)) return true
    const val = String(readKey(o, prop, '')).toLowerCase()
    if (val.includes(search)) return true
  }
  return false
}

const filteredOptions = computed(() => {
  let result = props.options
  const q = query.value.trim()

  if (q) {
    result = result.filter((o) => matchesFilter(o, q))
  }

  if (props.hideSelected && isMultiple.value) {
    result = result.filter((o) => !selectedSet.value.has(getValue(o)))
  }

  if (q && props.filterSort) {
    result = [...result].sort((a, b) => props.filterSort!(a, b, { searchValue: q }))
  }

  return result
})

const grouped = computed(() => {
  const groups = new Map<string, T[]>()
  for (const opt of filteredOptions.value) {
    const key = getGroup(opt) ?? ''
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(opt)
  }
  return Array.from(groups, ([heading, items]) => ({ heading, items }))
})

const atMax = computed(() => {
  if (typeof props.maxCount !== 'number') return false
  const count = Array.isArray(props.modelValue) ? props.modelValue.length : props.modelValue ? 1 : 0
  return count >= props.maxCount
})

const visibleTags = computed(() => {
  if (!isMultiple.value) return []
  const opts = selectedOptions.value
  if (typeof props.maxTagCount === 'number') {
    return opts.slice(0, props.maxTagCount)
  }
  return opts
})

const hiddenTagCount = computed(() => {
  if (!isMultiple.value) return 0
  const opts = selectedOptions.value
  if (typeof props.maxTagCount === 'number') {
    return Math.max(0, opts.length - props.maxTagCount)
  }
  return 0
})

function displayLabel(o: T): string {
  let label = getLabel(o)
  if (props.maxTagTextLength && label.length > props.maxTagTextLength) {
    label = label.slice(0, props.maxTagTextLength) + '...'
  }
  return label
}

function selectOption(option: T) {
  if (isDisabled(option)) return
  const v = getValue(option)

  if (!isMultiple.value) {
    emits('update:modelValue', v)
    emits('change', v, option)
    emits('select', v, option)
    isOpen.value = false
    if (props.autoClearSearchValue) {
      query.value = ''
    }
    return
  }

  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  if (selectedSet.value.has(v)) {
    const next = current.filter((x) => x !== v)
    emits('update:modelValue', next)
    emits('change', next, option)
    emits('deselect', v, option)
  } else {
    if (atMax.value) return
    const next = [...current, v]
    emits('update:modelValue', next)
    emits('change', next, option)
    emits('select', v, option)
  }

  if (props.autoClearSearchValue) {
    query.value = ''
  }
}

function removeTag(value: unknown, event: Event) {
  event.stopPropagation()
  if (props.disabled) return
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const next = current.filter((x) => x !== value)
  const option = getOptionByValue(value)
  emits('update:modelValue', next)
  emits('change', next, option as T)
  if (option) emits('deselect', value, option)
}

function clearAll(event?: Event) {
  event?.stopPropagation()
  if (props.disabled) return
  emits('clear')
  if (isMultiple.value) {
    emits('update:modelValue', [])
    emits('change', [], [])
  } else {
    emits('update:modelValue', null)
    emits('change', null, undefined as unknown as T)
  }
  query.value = ''
}

function createTag() {
  if (!props.allowCreate && props.mode !== 'tags') return
  const q = query.value.trim()
  if (!q) return
  // Check if already exists
  const exists = props.options.some((o) => getLabel(o) === q || String(getValue(o)) === q)
  if (exists) return

  if (!isMultiple.value) {
    emits('update:modelValue', q)
    emits('change', q, { [labelKey.value]: q, [valueKey.value]: q } as T)
    emits('select', q, { [labelKey.value]: q, [valueKey.value]: q } as T)
    isOpen.value = false
    query.value = ''
    return
  }

  if (atMax.value) return
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const next = [...current, q]
  const newOption = { [labelKey.value]: q, [valueKey.value]: q } as T
  emits('update:modelValue', next)
  emits('change', next, newOption)
  emits('select', q, newOption)
  query.value = ''
}

function handleInputKeydown(event: KeyboardEvent) {
  emits('inputKeyDown', event)
  if (event.key === 'Enter' && query.value.trim() && props.mode === 'tags') {
    event.preventDefault()
    createTag()
  }
  if (props.tokenSeparators.length && props.mode === 'tags') {
    if (props.tokenSeparators.includes(event.key)) {
      event.preventDefault()
      createTag()
    }
  }
}

function handleFocus(event: FocusEvent) {
  emits('focus', event)
}

function handleBlur(event: FocusEvent) {
  emits('blur', event)
}

function handlePopupScroll(event: Event) {
  emits('popupScroll', event)
}

// Watch modelValue to clear query when closed
watch(
  () => props.modelValue,
  () => {
    if (!isOpen.value && props.autoClearSearchValue) {
      query.value = ''
    }
  },
)

watch(
  () => isOpen.value,
  (open) => {
    if (!open && props.autoClearSearchValue) {
      query.value = ''
    }
  },
)

const sizeClasses = {
  sm: 'h-8 text-xs px-2.5 py-1',
  default: 'h-9 text-sm px-3 py-1.5',
  lg: 'h-11 text-base px-4 py-2',
}

const variantClasses = {
  outlined:
    'border-input bg-transparent shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  filled:
    'border-transparent bg-muted/50 shadow-none focus-visible:bg-muted focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  borderless:
    'border-transparent bg-transparent shadow-none focus-visible:bg-muted/30 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
}

const statusClasses = {
  default: '',
  error:
    'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive',
  warning: 'border-warning focus-visible:border-warning focus-visible:ring-warning/20',
}

const triggerBaseClasses = computed(() =>
  cn(
    'flex w-full items-center justify-between gap-2 rounded-md border text-sm transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[props.size],
    variantClasses[props.variant],
    statusClasses[props.status],
    props.class,
  ),
)

const isEmpty = computed(() => {
  if (isMultiple.value) {
    return !Array.isArray(props.modelValue) || props.modelValue.length === 0
  }
  return props.modelValue == null || props.modelValue === ''
})

const showClear = computed(() => {
  return props.allowClear && !isEmpty.value && !props.disabled && !props.loading
})

const showSearchInput = computed(() => {
  return props.showSearch || props.mode === 'tags'
})
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-invalid="status === 'error' ? true : undefined"
        :disabled="disabled || loading"
        data-uipkge
        data-slot="advance-select"
        :class="triggerBaseClasses"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <!-- Prefix slot -->
        <span v-if="$slots.prefix" class="shrink-0">
          <slot name="prefix" />
        </span>

        <!-- Multiple mode tags -->
        <div
          v-if="isMultiple"
          class="flex flex-1 flex-nowrap items-center gap-1 overflow-x-auto"
          style="scrollbar-width: none; -ms-overflow-style: none"
        >
          <template v-if="selectedOptions.length">
            <slot
              name="tag"
              v-for="opt in visibleTags"
              :key="String(getValue(opt))"
              :value="getValue(opt)"
              :label="displayLabel(opt)"
              :closable="!disabled"
              :on-close="(e: Event) => removeTag(getValue(opt), e)"
            >
              <Badge variant="secondary" class="bg-muted text-foreground h-6 gap-1 pr-1 pl-2 text-xs font-normal">
                <span class="truncate">{{ displayLabel(opt) }}</span>
                <span
                  v-if="!disabled"
                  role="button"
                  tabindex="0"
                  class="hover:bg-muted-foreground/20 inline-flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors"
                  :aria-label="`Remove ${getLabel(opt)}`"
                  @click="removeTag(getValue(opt), $event)"
                  @keydown.enter.prevent="removeTag(getValue(opt), $event)"
                  @keydown.space.prevent="removeTag(getValue(opt), $event)"
                >
                  <X class="size-3" />
                </span>
              </Badge>
            </slot>
            <Badge
              v-if="hiddenTagCount > 0"
              variant="secondary"
              class="bg-muted text-foreground h-6 text-xs font-normal"
            >
              <template v-if="typeof maxTagPlaceholder === 'function'">
                {{ maxTagPlaceholder(selectedOptions.slice(maxTagCount ?? 0)) }}
              </template>
              <template v-else-if="maxTagPlaceholder">
                {{ maxTagPlaceholder }}
              </template>
              <template v-else> +{{ hiddenTagCount }} </template>
            </Badge>
          </template>
          <span v-else class="text-muted-foreground truncate">{{ placeholder }}</span>
        </div>

        <!-- Single mode display -->
        <template v-else>
          <slot name="label" :value="props.modelValue" :label="selectedOptions[0] ? getLabel(selectedOptions[0]) : ''">
            <span
              :class="[
                'flex-1 truncate text-left',
                selectedOptions.length ? 'text-foreground' : 'text-muted-foreground',
              ]"
            >
              {{ selectedOptions[0] ? getLabel(selectedOptions[0]) : placeholder }}
            </span>
          </slot>
        </template>

        <!-- Suffix area -->
        <span class="flex shrink-0 items-center gap-1">
          <slot name="suffix" />

          <Loader2 v-if="loading" class="text-muted-foreground size-4 animate-spin" />

          <span
            v-else-if="showClear"
            role="button"
            tabindex="0"
            class="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center rounded transition-colors"
            aria-label="Clear selection"
            @click="clearAll"
            @keydown.enter.prevent="clearAll"
            @keydown.space.prevent="clearAll"
          >
            <slot name="clearIcon">
              <X class="size-4" aria-hidden="true" />
            </slot>
          </span>

          <slot v-else name="suffixIcon">
            <ChevronDown class="text-muted-foreground size-4 opacity-50" />
          </slot>
        </span>
      </button>
    </PopoverTrigger>

    <PopoverContent
      class="p-0"
      align="start"
      :side-offset="4"
      :style="{ width: 'var(--reka-popover-trigger-width)', maxHeight: `${listHeight}px` }"
      @scroll="handlePopupScroll"
    >
      <Command :should-filter="false" class="flex flex-col overflow-hidden">
        <CommandSearchSync @update:search="query = $event" />
        <CommandInput v-if="showSearchInput" v-model="query" :placeholder="placeholder" @keydown="handleInputKeydown" />

        <CommandList class="flex-1 overflow-y-auto">
          <CommandEmpty v-if="!loading && filteredOptions.length === 0">
            <slot name="empty">
              {{ notFoundContent }}
            </slot>
          </CommandEmpty>

          <div v-if="loading && filteredOptions.length === 0" class="py-6 text-center text-sm">
            {{ loadingText }}
          </div>

          <template v-for="(group, gi) in grouped" :key="group.heading || gi">
            <CommandSeparator v-if="gi > 0" />
            <CommandGroup :heading="group.heading || undefined">
              <CommandItem
                v-for="(opt, idx) in group.items"
                :key="String(getValue(opt))"
                :value="String(getValue(opt))"
                :disabled="isDisabled(opt) || (atMax && !selectedSet.has(getValue(opt)))"
                :data-active="gi === 0 && idx === 0 && defaultActiveFirstOption ? 'true' : undefined"
                :style="virtual && props.options.length > 100 ? { contentVisibility: 'auto' } : undefined"
                @select="selectOption(opt)"
              >
                <Check
                  :class="cn('mr-2 size-4 shrink-0', selectedSet.has(getValue(opt)) ? 'opacity-100' : 'opacity-0')"
                />
                <slot name="option" :option="opt" :index="idx">
                  {{ getLabel(opt) }}
                </slot>
              </CommandItem>
            </CommandGroup>
          </template>

          <!-- Create new option in tags / allowCreate modes -->
          <CommandItem
            v-if="
              query.trim() &&
              (allowCreate || mode === 'tags') &&
              !props.options.some((o) => getLabel(o) === query.trim())
            "
            :value="`create:${query}`"
            @select="createTag"
          >
            <Check class="mr-2 size-4 opacity-0" />
            Create "{{ query.trim() }}"
          </CommandItem>
        </CommandList>

        <!-- Footer for multiple mode -->
        <div
          v-if="isMultiple && selectedOptions.length"
          class="flex items-center justify-between border-t px-2 py-1.5 text-xs"
        >
          <span class="text-muted-foreground">{{ selectedOptions.length }} selected</span>
          <button type="button" class="text-muted-foreground hover:text-foreground" @click="clearAll">Clear all</button>
        </div>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped>
[data-slot='advance-select'] .overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>

<script setup lang="ts">
// One key/value row inside the record-detail <dl>. `select-all` is the point
// of the value side: these are IDs and timestamps people copy out, and one
// click should take the whole value rather than a word of it.
import { computed, ref } from 'vue'
import { Check, Copy } from './data-explorer-icons'
import { Button } from '@/components/ui/button'
import { fmtValue } from './data-explorer-core'
import { useExplorerLabels } from './data-explorer-labels'

const props = withDefaults(
  defineProps<{
    label: string
    value: unknown
    /** Off inside a plain (non-scrolling) list where row hover means nothing. */
    hover?: boolean
    copyable?: boolean
  }>(),
  {
    hover: true,
    copyable: true,
  },
)

const { t } = useExplorerLabels()

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const isEmpty = computed(() => props.value === null || props.value === undefined || props.value === '')

const copyText = computed(() => {
  if (isEmpty.value) return ''
  if (typeof props.value === 'object') {
    try {
      return JSON.stringify(props.value, null, 2)
    } catch {
      return String(props.value)
    }
  }
  return String(props.value)
})

async function handleCopy(e: MouseEvent) {
  e.stopPropagation()
  if (!copyText.value) return
  try {
    await navigator.clipboard.writeText(copyText.value)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    // Clipboard blocked (insecure context / permissions) -- fail quietly.
  }
}
</script>

<template>
  <div
    :class="[
      'group relative flex items-baseline justify-between gap-4 text-sm transition-colors',
      props.hover ? 'hover:bg-muted/40 -mx-1.5 rounded px-1.5 py-0.5' : '',
    ]"
  >
    <dt class="text-muted-foreground shrink-0 font-mono text-xs">{{ label }}</dt>
    <dd class="min-w-0 pr-6 text-right font-mono text-xs break-all tabular-nums select-all">
      <slot>{{ fmtValue(value) }}</slot>
    </dd>
    <Button
      v-if="copyable && !isEmpty"
      variant="ghost"
      size="icon-2xs"
      :class="[
        'absolute top-1/2 right-0 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
        copied ? 'text-success opacity-100' : '',
      ]"
      :aria-label="copied ? t('copied') : t('copy', { label })"
      @click="handleCopy"
    >
      <Check v-if="copied" class="size-2.5" aria-hidden="true" />
      <Copy v-else class="text-muted-foreground size-2.5" aria-hidden="true" />
    </Button>
  </div>
</template>

<script setup lang="ts" generic="T extends ExplorerRow">
// One typed cell. The `type` picks a renderer; a `#cell-<key>` slot on the
// block replaces it entirely. Text-like types share the two-line pattern:
// primary value, optional sub line, hover-revealed copy control.
import { computed, nextTick, ref, watch } from 'vue'
import { Check, Copy, ExternalLink, Minus, MoreHorizontal, Pencil } from './data-explorer-icons'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { fmtDateTime, fmtValue, formatCell, getSub, initials, sparklinePath } from './data-explorer-core'
import { useExplorerLabels } from './data-explorer-labels'
import {
  TONE_DOT_CLASSES,
  type ExplorerColumn,
  type ExplorerRow,
  type ExplorerRowAction,
  type StatusTone,
} from './data-explorer-types'

const props = withDefaults(
  defineProps<{
    column: ExplorerColumn<T>
    row: T
    value: unknown
    actions?: ExplorerRowAction<T>[]
    editable?: boolean
  }>(),
  { actions: () => [], editable: false },
)

const emit = defineEmits<{
  (e: 'edit', value: unknown): void
}>()

const { t } = useExplorerLabels()

const type = computed(() => props.column.type ?? 'text')
const text = computed(() => formatCell(props.column, props.value, props.row))
const sub = computed(() => getSub(props.row, props.column))
const isEmpty = computed(
  () => props.value === null || props.value === undefined || props.value === '' || text.value === '—',
)

const badge = computed(() => {
  const m = props.column.badgeMap?.[String(props.value)]
  return m ?? { label: fmtValue(props.value), tone: (isEmpty.value ? 'muted' : 'info') as StatusTone }
})

const avatar = computed(() => {
  const v = props.value
  if (v && typeof v === 'object')
    return { name: String((v as { name?: string }).name ?? ''), src: (v as { src?: string }).src }
  return { name: String(v ?? ''), src: undefined }
})

const series = computed(() => (Array.isArray(props.value) ? (props.value as number[]).map(Number) : []))
const SPARK_W = 96
const SPARK_H = 24
const sparkPath = computed(() => sparklinePath(series.value, SPARK_W, SPARK_H))
const sparkLast = computed(() => {
  if (series.value.length < 2) return null
  const min = Math.min(...series.value)
  const max = Math.max(...series.value)
  const span = max - min || 1
  const last = series.value[series.value.length - 1]!
  return { x: SPARK_W, y: SPARK_H - ((last - min) / span) * (SPARK_H - 2) - 1 }
})

const tags = computed(() => (Array.isArray(props.value) ? props.value.map(String) : []))
const maxTags = computed(() => props.column.maxTags ?? 3)

const deltaClass = computed(() => {
  if (!props.column.delta || isEmpty.value) return 'text-muted-foreground'
  const n = Number(props.value)
  if (n > 0) return 'text-destructive'
  if (n < 0) return 'text-success'
  return 'text-muted-foreground'
})

// ── Copy ────────────────────────────────────────────────────────────────

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null
async function copy(e: MouseEvent) {
  e.stopPropagation()
  const v = type.value === 'text' ? text.value : String(props.value ?? '')
  if (!v || v === '—') return
  try {
    await navigator.clipboard.writeText(v)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    // Clipboard blocked (insecure context / permissions) -- fail quietly.
  }
}

// ── Inline edit ─────────────────────────────────────────────────────────

const editing = ref(false)
const draft = ref('')
const editInput = ref<{ $el?: HTMLElement } | null>(null)
const editKind = computed(() =>
  props.column.editable === 'number' || ['number', 'currency', 'percent'].includes(type.value) ? 'number' : 'text',
)

// An editable cell owns its clicks: a single click must not open the row's
// detail, or the double-click that starts editing lands behind a sheet.
function stopIfEditable(e: Event) {
  if (props.editable) e.stopPropagation()
}

function startEdit(e: Event) {
  if (!props.editable) return
  e.stopPropagation()
  draft.value = isEmpty.value ? '' : String(props.value)
  editing.value = true
}

watch(editing, async (on) => {
  if (!on) return
  await nextTick()
  const root = editInput.value?.$el
  const input = root?.tagName?.toLowerCase() === 'input' ? (root as HTMLInputElement) : root?.querySelector('input')
  input?.focus()
  input?.select()
})

function commitEdit() {
  if (!editing.value) return
  const next = editKind.value === 'number' ? (draft.value.trim() === '' ? null : Number(draft.value)) : draft.value
  editing.value = false
  if (editKind.value === 'number' && next !== null && Number.isNaN(next as number)) return
  if (next !== props.value) emit('edit', next)
}

function cancelEdit() {
  editing.value = false
}
</script>

<template>
  <!-- Editing: the cell becomes the input; Enter commits, Escape cancels. -->
  <div v-if="editing" class="-my-1" @click.stop @keydown.stop>
    <Input
      ref="editInput"
      v-model="draft"
      size="small"
      class="h-7"
      :type="editKind === 'number' ? 'number' : 'text'"
      :aria-label="t('edit', { label: column.label })"
      @keydown.enter.prevent="commitEdit"
      @keydown.esc.prevent="cancelEdit"
      @blur="commitEdit"
    />
  </div>

  <!-- Badge: a dot from the semantic tone plus the word -- colour alone is
       never the only signal. -->
  <Badge v-else-if="type === 'badge'" variant="outline" class="gap-1.5">
    <span :class="cn('size-1.5 shrink-0 rounded-full', TONE_DOT_CLASSES[badge.tone])" aria-hidden="true" />
    <span class="truncate">{{ badge.label }}</span>
  </Badge>

  <span v-else-if="type === 'dot'" class="inline-flex min-w-0 items-center gap-1.5">
    <span :class="cn('size-1.5 shrink-0 rounded-full', TONE_DOT_CLASSES[badge.tone])" aria-hidden="true" />
    <span class="truncate">{{ badge.label }}</span>
  </span>

  <div v-else-if="type === 'progress'" class="flex items-center gap-2" @click="stopIfEditable" @dblclick="startEdit">
    <Progress :model-value="Number(value) || 0" class="h-1.5" :aria-label="`${column.label} ${text}`" />
    <span class="text-muted-foreground w-9 shrink-0 text-right tabular-nums">{{
      isEmpty ? '—' : `${Math.round(Number(value))}%`
    }}</span>
  </div>

  <svg
    v-else-if="type === 'sparkline'"
    :viewBox="`0 0 ${SPARK_W} ${SPARK_H}`"
    :width="SPARK_W"
    :height="SPARK_H"
    class="text-muted-foreground block overflow-visible"
    role="img"
    :aria-label="`${column.label}: ${series.join(', ')}`"
  >
    <title>{{ series.join(', ') }}</title>
    <path
      v-if="sparkPath"
      :d="sparkPath"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <circle v-if="sparkLast" :cx="sparkLast.x" :cy="sparkLast.y" r="2" class="fill-foreground" />
    <line
      v-if="!sparkPath"
      x1="0"
      :y1="SPARK_H / 2"
      :x2="SPARK_W"
      :y2="SPARK_H / 2"
      stroke="currentColor"
      stroke-dasharray="2 3"
    />
  </svg>

  <div v-else-if="type === 'avatar'" class="flex min-w-0 items-center gap-2">
    <Avatar size="sm" class="shrink-0">
      <AvatarImage v-if="avatar.src" :src="avatar.src" :alt="avatar.name" />
      <AvatarFallback class="text-xs">{{ initials(avatar.name) || '?' }}</AvatarFallback>
    </Avatar>
    <div class="min-w-0">
      <span class="block truncate" :title="avatar.name">{{ avatar.name || '—' }}</span>
      <span v-if="sub" class="text-muted-foreground block truncate text-xs" :title="sub">{{ sub }}</span>
    </div>
  </div>

  <a
    v-else-if="type === 'link' && !isEmpty"
    :href="column.href ? column.href(row) : String(value)"
    target="_blank"
    rel="noreferrer"
    class="text-foreground inline-flex max-w-full items-center gap-1 underline-offset-4 hover:underline"
    @click.stop
  >
    <span class="truncate">{{ text }}</span>
    <ExternalLink class="text-muted-foreground size-3 shrink-0" aria-hidden="true" />
  </a>

  <div v-else-if="type === 'tags'" class="flex min-w-0 flex-wrap items-center gap-1">
    <Badge v-for="t in tags.slice(0, maxTags)" :key="t" variant="secondary" class="max-w-32">
      <span class="truncate">{{ t }}</span>
    </Badge>
    <span v-if="tags.length > maxTags" class="text-muted-foreground text-xs tabular-nums"
      >+{{ tags.length - maxTags }}</span
    >
    <span v-if="!tags.length" class="text-muted-foreground">—</span>
  </div>

  <span v-else-if="type === 'boolean'" class="inline-flex items-center">
    <Check v-if="value === true" class="text-success size-3.5" aria-hidden="true" />
    <Minus v-else class="text-muted-foreground size-3.5" aria-hidden="true" />
    <span class="sr-only">{{ value === true ? t('yes') : t('no') }}</span>
  </span>

  <DropdownMenu v-else-if="type === 'actions'">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon-xs"
        class="text-muted-foreground -my-1"
        :aria-label="t('rowActions')"
        @click.stop
      >
        <MoreHorizontal class="size-3.5" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44" @click.stop>
      <DropdownMenuItem
        v-for="a in actions"
        :key="a.label"
        :variant="a.variant"
        :disabled="a.disabled"
        class="text-xs"
        @select="a.onSelect(row)"
      >
        <component :is="a.icon" v-if="a.icon" class="size-3.5" aria-hidden="true" />
        {{ a.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Numbers and dates: tabular so columns of them line up. -->
  <span
    v-else-if="['number', 'currency', 'percent', 'bytes', 'duration'].includes(type)"
    :class="
      cn(
        'group/cell inline-flex max-w-full items-center gap-1 tabular-nums',
        column.delta ? `font-medium ${deltaClass}` : '',
        isEmpty && !column.delta ? 'text-muted-foreground' : '',
      )
    "
    @click="stopIfEditable"
    @dblclick="startEdit"
  >
    <span class="truncate">{{ text }}</span>
    <Button
      v-if="editable"
      variant="ghost"
      size="icon-2xs"
      class="-my-1 shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-100 focus-visible:opacity-100"
      :aria-label="t('edit', { label: column.label })"
      @click="startEdit"
    >
      <Pencil class="text-muted-foreground size-2.5" aria-hidden="true" />
    </Button>
  </span>

  <div
    v-else-if="['date', 'datetime', 'relative'].includes(type)"
    class="tabular-nums"
    @click="stopIfEditable"
    @dblclick="startEdit"
  >
    <span class="block" :title="type === 'relative' ? fmtDateTime(value) : undefined">{{ text }}</span>
    <span v-if="sub" class="text-muted-foreground block text-xs">{{ sub }}</span>
  </div>

  <!-- Text: primary + optional sub line, each with a hover-revealed copy. -->
  <div v-else class="min-w-0" @click="stopIfEditable" @dblclick="startEdit">
    <div :class="cn('group/cell flex min-w-0 items-center justify-between gap-1.5', sub ? 'font-medium' : '')">
      <span
        :class="
          cn(
            'block min-w-0 flex-1',
            column.wrap ? 'break-words whitespace-normal' : 'truncate',
            column.mono ? 'font-mono' : '',
            isEmpty ? 'text-muted-foreground font-normal' : '',
          )
        "
        :title="text"
        >{{ text }}</span
      >
      <Button
        v-if="editable"
        variant="ghost"
        size="icon-2xs"
        class="-mr-1 shrink-0 opacity-0 transition-opacity group-focus-within/cell:opacity-100 group-hover/cell:opacity-100 focus-visible:opacity-100"
        :aria-label="t('edit', { label: column.label })"
        @click="startEdit"
      >
        <Pencil class="text-muted-foreground size-2.5" aria-hidden="true" />
      </Button>
      <Button
        v-if="column.copyable && !isEmpty"
        variant="ghost"
        size="icon-2xs"
        class="-mr-1 shrink-0 opacity-0 transition-opacity group-focus-within/cell:opacity-100 group-hover/cell:opacity-100 focus-visible:opacity-100"
        :aria-label="copied ? t('copied') : t('copy', { label: column.label })"
        @click="copy"
      >
        <Check v-if="copied" class="text-success size-2.5" aria-hidden="true" />
        <Copy v-else class="text-muted-foreground size-2.5" aria-hidden="true" />
      </Button>
    </div>
    <span
      v-if="sub"
      :class="cn('text-muted-foreground block min-w-0 truncate text-xs font-normal', column.subMono ? 'font-mono' : '')"
      :title="sub"
      >{{ sub }}</span
    >
  </div>
</template>

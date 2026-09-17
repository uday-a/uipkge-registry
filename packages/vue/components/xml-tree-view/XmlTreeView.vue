<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { Search, CodeXml, FoldVertical, UnfoldVertical, AlertCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import XmlTreeNode from './XmlTreeNode.vue'
import { parseXml, countElements, isExpandable, type XmlNode } from './types'

export type { XmlNode } from './types'

interface Props {
  /** Raw XML string to parse and display. */
  data: string
  expandDepth?: number
  maxDepth?: number
  showSearch?: boolean
  showToolbar?: boolean
  /** Override path root label; defaults to the document element name. */
  rootLabel?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  expandDepth: 1,
  maxDepth: 100,
  showSearch: true,
  showToolbar: true,
})

const emit = defineEmits<{
  copy: [value: string, path: string]
}>()

const expanded = ref<Set<string>>(new Set())
const search = ref('')
const copiedPath = ref<string | null>(null)

const parsed = computed(() => parseXml(props.data))
const root = computed(() => parsed.value.root)
const parseError = computed(() => parsed.value.error)

function pathKey(path: string[]): string {
  return path.length ? '/' + path.join('/') : '/'
}

function walkExpandable(
  node: XmlNode,
  path: string[],
  depth: number,
  max: number,
  visit: (path: string[], node: XmlNode) => void,
) {
  if (depth >= max) return
  if (isExpandable(node)) {
    visit(path, node)
    const counts = new Map<string, number>()
    const totals = new Map<string, number>()
    for (const c of node.children) {
      if (c.type === 'element') totals.set(c.name, (totals.get(c.name) ?? 0) + 1)
    }
    node.children.forEach((child, i) => {
      let segment: string
      if (child.type === 'element') {
        const n = (counts.get(child.name) ?? 0) + 1
        counts.set(child.name, n)
        const total = totals.get(child.name) ?? 1
        segment = total > 1 ? `${child.name}[${n}]` : child.name
      } else if (child.type === 'comment') {
        segment = `comment()[${i}]`
      } else {
        segment = `text()[${i}]`
      }
      walkExpandable(child, [...path, segment], depth + 1, max, visit)
    })
  }
}

function defaultExpanded(): Set<string> {
  const next = new Set<string>()
  const r = root.value
  if (!r) return next
  // Root is always at path [] with key "/"
  walkExpandable(r, [], 0, props.expandDepth, (path) => {
    next.add(pathKey(path))
  })
  return next
}

watch(
  () => [props.data, props.expandDepth],
  () => {
    expanded.value = defaultExpanded()
  },
  { immediate: true },
)

function toggle(path: string[]) {
  const key = pathKey(path)
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}

function isExpanded(path: string[]): boolean {
  return expanded.value.has(pathKey(path))
}

function expandAll() {
  const next = new Set<string>()
  const r = root.value
  if (!r) {
    expanded.value = next
    return
  }
  walkExpandable(r, [], 0, props.maxDepth, (path) => {
    next.add(pathKey(path))
  })
  expanded.value = next
}

function collapseAll() {
  expanded.value = new Set()
}

function matchesSearch(node: XmlNode): boolean {
  if (!search.value) return true
  const term = search.value.toLowerCase()
  const walk = (n: XmlNode): boolean => {
    if (n.type === 'element') {
      if (n.name.toLowerCase().includes(term)) return true
      if (n.attributes.some((a) => a.name.toLowerCase().includes(term) || a.value.toLowerCase().includes(term)))
        return true
      return n.children.some(walk)
    }
    return n.text.toLowerCase().includes(term)
  }
  return walk(node)
}

// Auto-expand nodes that contain search matches
watch(search, (q) => {
  if (!q) {
    expanded.value = defaultExpanded()
    return
  }
  const next = new Set<string>()
  const r = root.value
  if (!r) {
    expanded.value = next
    return
  }
  walkExpandable(r, [], 0, props.maxDepth, (path, node) => {
    if (matchesSearch(node)) next.add(pathKey(path))
  })
  expanded.value = next
})

const tagColor = 'text-violet-600 dark:text-violet-400'
const attrNameColor = 'text-blue-600 dark:text-blue-400'
const attrValueColor = 'text-emerald-600 dark:text-emerald-400'
const textColor = 'text-emerald-600 dark:text-emerald-400'
const commentColor = 'text-muted-foreground'
const punctColor = 'text-muted-foreground'

async function copyValue(value: string, path: string[]) {
  const p = pathKey(path)
  try {
    await navigator.clipboard.writeText(value)
    copiedPath.value = p
    emit('copy', value, p)
    setTimeout(() => {
      if (copiedPath.value === p) copiedPath.value = null
    }, 1200)
  } catch {
    // clipboard unavailable
  }
}

const effectiveRootLabel = computed(() => {
  if (props.rootLabel) return props.rootLabel
  return root.value?.name ?? 'xml'
})

const summary = computed(() => {
  if (parseError.value) return 'Parse error'
  if (!root.value) return 'Empty'
  const n = countElements(root.value)
  return `${root.value.name} · ${n} element${n === 1 ? '' : 's'}`
})

const searchMatchCount = computed(() => {
  if (!search.value || !root.value) return 0
  let count = 0
  const term = search.value.toLowerCase()
  const walk = (n: XmlNode) => {
    if (n.type === 'element') {
      if (n.name.toLowerCase().includes(term)) count++
      for (const a of n.attributes) {
        if (a.name.toLowerCase().includes(term) || a.value.toLowerCase().includes(term)) count++
      }
      n.children.forEach(walk)
      return
    }
    if (n.text.toLowerCase().includes(term)) count++
  }
  walk(root.value)
  return count
})
</script>

<template>
  <div
    data-uipkge
    data-slot="xml-tree-view"
    :class="cn('bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm', props.class)"
  >
    <!-- Toolbar -->
    <div v-if="showToolbar || showSearch" class="border-border flex items-center gap-2 border-b px-3 py-2">
      <div class="flex items-center gap-1.5">
        <CodeXml class="text-muted-foreground size-4" />
        <span class="text-muted-foreground text-xs">{{ summary }}</span>
      </div>
      <div class="ml-auto flex items-center gap-1">
        <div v-if="showSearch && !parseError" class="relative">
          <Search class="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
          <input
            v-model="search"
            type="text"
            placeholder="Filter..."
            aria-label="Filter XML tree"
            class="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2"
          />
        </div>
        <span v-if="search && !parseError" class="text-muted-foreground text-xs">
          {{ searchMatchCount }} match{{ searchMatchCount === 1 ? '' : 'es' }}
        </span>
        <button
          v-if="!parseError"
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
          title="Expand all"
          aria-label="Expand all"
          @click="expandAll"
        >
          <UnfoldVertical class="size-4" />
        </button>
        <button
          v-if="!parseError"
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
          title="Collapse all"
          aria-label="Collapse all"
          @click="collapseAll"
        >
          <FoldVertical class="size-4" />
        </button>
      </div>
    </div>

    <!-- Parse error -->
    <div v-if="parseError" class="text-destructive flex items-start gap-2 p-4 text-sm">
      <AlertCircle class="mt-0.5 size-4 shrink-0" />
      <div class="min-w-0">
        <p class="font-sans font-medium">Invalid XML</p>
        <p class="text-muted-foreground mt-1 font-mono text-xs break-words">{{ parseError }}</p>
      </div>
    </div>

    <!-- Tree -->
    <div v-else-if="root" class="min-h-0 flex-1 overflow-auto p-2" role="tree" :aria-label="effectiveRootLabel">
      <XmlTreeNode
        :node="root"
        :path="[]"
        :is-root="true"
        :search="search"
        :max-depth="maxDepth"
        :matches-search="matchesSearch"
        :is-expanded="isExpanded"
        :toggle="toggle"
        :tag-color="tagColor"
        :attr-name-color="attrNameColor"
        :attr-value-color="attrValueColor"
        :text-color="textColor"
        :comment-color="commentColor"
        :punct-color="punctColor"
        :copied-path="copiedPath"
        @copy="copyValue"
      />
    </div>
  </div>
</template>

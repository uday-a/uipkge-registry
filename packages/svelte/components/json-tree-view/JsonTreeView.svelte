<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { JsonTreeType, JsonValue } from './types'

  export type { JsonValue } from './types'

  export interface JsonTreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'oncopy'> {
    data: JsonValue
    expandDepth?: number
    maxDepth?: number
    showSearch?: boolean
    showToolbar?: boolean
    rootLabel?: string
    /** Fires after a value is copied: the copied string and its path key. */
    oncopy?: (value: string, path: string) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Braces, FoldVertical, Search, UnfoldVertical } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import JsonTreeNode from './JsonTreeNode.svelte'

  let {
    class: className,
    data,
    expandDepth = 1,
    maxDepth = 100,
    showSearch = true,
    showToolbar = true,
    rootLabel = 'root',
    oncopy,
    ref = $bindable(null),
    ...restProps
  }: JsonTreeViewProps = $props()

  let expanded = $state<Set<string>>(new Set())
  let search = $state('')
  let copiedPath = $state<string | null>(null)

  function pathKey(path: (string | number)[]): string {
    return path.length ? path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('') : '$'
  }

  function defaultExpanded(): Set<string> {
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= expandDepth) return
      if (val !== null && typeof val === 'object') {
        next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(data)
    return next
  }

  $effect(() => {
    void data
    void expandDepth
    expanded = defaultExpanded()
  })

  function toggle(path: (string | number)[]) {
    const key = pathKey(path)
    const next = new Set(expanded)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    expanded = next
  }

  function isExpanded(path: (string | number)[]): boolean {
    return expanded.has(pathKey(path))
  }

  function expandAll() {
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= maxDepth) return
      if (val !== null && typeof val === 'object') {
        next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(data)
    expanded = next
  }

  function collapseAll() {
    expanded = new Set()
  }

  // Auto-expand nodes that contain search matches
  $effect(() => {
    const q = search
    if (!q) {
      expanded = defaultExpanded()
      return
    }
    const next = new Set<string>()
    const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
      if (depth >= maxDepth) return
      if (val !== null && typeof val === 'object') {
        if (matchesSearch(val)) next.add(pathKey(path))
        const entries = Array.isArray(val) ? val.map((v, i) => [i, v] as const) : Object.entries(val)
        for (const [k, v] of entries) {
          walk(v as JsonValue, [...path, k], depth + 1)
        }
      }
    }
    walk(data)
    expanded = next
  })

  function matchesSearch(val: JsonValue): boolean {
    if (!search) return true
    const term = search.toLowerCase()
    const walk = (v: JsonValue): boolean => {
      if (v === null) return 'null'.includes(term)
      if (typeof v === 'string') return v.toLowerCase().includes(term)
      if (typeof v === 'number' || typeof v === 'boolean') return String(v).includes(term)
      if (Array.isArray(v)) return v.some(walk)
      if (typeof v === 'object') return Object.entries(v).some(([k, val]) => k.toLowerCase().includes(term) || walk(val))
      return false
    }
    return walk(val)
  }

  function typeOf(val: JsonValue): JsonTreeType {
    if (val === null) return 'null'
    if (Array.isArray(val)) return 'array'
    return typeof val as 'object' | 'string' | 'number' | 'boolean'
  }

  function formatValue(val: JsonValue): string {
    if (val === null) return 'null'
    if (typeof val === 'string') return JSON.stringify(val)
    return String(val)
  }

  const typeColor: Record<string, string> = {
    string: 'text-emerald-600 dark:text-emerald-400',
    number: 'text-blue-600 dark:text-blue-400',
    boolean: 'text-amber-600 dark:text-amber-400',
    null: 'text-muted-foreground italic',
    object: 'text-foreground',
    array: 'text-foreground',
  }

  const keyColor = 'text-violet-600 dark:text-violet-400'

  async function copyValue(val: JsonValue, path: (string | number)[]) {
    const str = typeof val === 'string' ? val : JSON.stringify(val, null, 2)
    const p = pathKey(path)
    try {
      await navigator.clipboard.writeText(str)
      copiedPath = p
      oncopy?.(str, p)
      setTimeout(() => {
        if (copiedPath === p) copiedPath = null
      }, 1200)
    } catch {
      // clipboard unavailable
    }
  }

  const summary = $derived.by(() => {
    const t = typeOf(data)
    if (t === 'array') return `Array(${(data as JsonValue[]).length})`
    if (t === 'object') return `Object(${Object.keys(data as object).length})`
    return t
  })

  const searchMatchCount = $derived.by(() => {
    if (!search) return 0
    const term = search.toLowerCase()
    let count = 0
    const walk = (v: JsonValue) => {
      if (v === null) {
        if ('null'.includes(term)) count++
        return
      }
      if (typeof v === 'string') {
        if (v.toLowerCase().includes(term)) count++
        return
      }
      if (typeof v === 'number' || typeof v === 'boolean') {
        if (String(v).includes(search)) count++
        return
      }
      if (Array.isArray(v)) {
        v.forEach(walk)
        return
      }
      if (typeof v === 'object') {
        Object.entries(v).forEach(([k, val]) => {
          if (k.toLowerCase().includes(term)) count++
          walk(val)
        })
      }
    }
    walk(data)
    return count
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="json-tree-view"
  class={cn('bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm', className)}
  {...restProps}
>
  <!-- Toolbar -->
  {#if showToolbar || showSearch}
    <div class="border-border flex items-center gap-2 border-b px-3 py-2">
      <div class="flex items-center gap-1.5">
        <Braces class="text-muted-foreground size-4" />
        <span class="text-muted-foreground text-xs">{summary}</span>
      </div>
      <div class="ml-auto flex items-center gap-1">
        {#if showSearch}
          <div class="relative">
            <Search class="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
            <input
              bind:value={search}
              type="text"
              placeholder="Filter..."
              aria-label="Filter JSON tree"
              class="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2"
            />
          </div>
        {/if}
        {#if search}
          <span class="text-muted-foreground text-xs">
            {searchMatchCount} match{searchMatchCount === 1 ? '' : 'es'}
          </span>
        {/if}
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
          title="Expand all"
          aria-label="Expand all"
          onclick={expandAll}
        >
          <UnfoldVertical class="size-4" />
        </button>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
          title="Collapse all"
          aria-label="Collapse all"
          onclick={collapseAll}
        >
          <FoldVertical class="size-4" />
        </button>
      </div>
    </div>
  {/if}

  <!-- Tree -->
  <div class="min-h-0 flex-1 overflow-auto p-2" role="tree" aria-label={rootLabel}>
    <JsonTreeNode
      {data}
      path={[]}
      label={rootLabel}
      isRoot={true}
      {search}
      {maxDepth}
      {matchesSearch}
      {isExpanded}
      {toggle}
      {typeOf}
      {formatValue}
      {typeColor}
      {keyColor}
      {copiedPath}
      oncopy={copyValue}
    />
  </div>
</div>

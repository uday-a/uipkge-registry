<script lang="ts" module>
  import type { JsonTreeType, JsonValue } from './types'

  export interface JsonTreeNodeProps {
    data: JsonValue
    path: (string | number)[]
    label: string
    isRoot?: boolean
    search?: string
    maxDepth?: number
    matchesSearch: (val: JsonValue) => boolean
    isExpanded: (path: (string | number)[]) => boolean
    toggle: (path: (string | number)[]) => void
    typeOf: (val: JsonValue) => JsonTreeType
    formatValue: (val: JsonValue) => string
    typeColor: Record<string, string>
    keyColor: string
    copiedPath?: string | null
    oncopy?: (value: JsonValue, path: (string | number)[]) => void
  }
</script>

<script lang="ts">
  import { Check, ChevronDown, ChevronRight, Copy } from '@lucide/svelte'
  // Self-reference for recursive rendering.
  import JsonTreeNode from './JsonTreeNode.svelte'

  let {
    data,
    path,
    label,
    isRoot = false,
    search = '',
    maxDepth = 100,
    matchesSearch,
    isExpanded,
    toggle,
    typeOf,
    formatValue,
    typeColor,
    keyColor,
    copiedPath = null,
    oncopy,
  }: JsonTreeNodeProps = $props()

  function pathKey(p: (string | number)[]): string {
    return p.length ? p.map((seg) => (typeof seg === 'number' ? `[${seg}]` : `.${seg}`)).join('') : '$'
  }

  const key = $derived(pathKey(path))
  const type = $derived(typeOf(data))
  const open = $derived(isExpanded(path))
  const isContainer = $derived(type === 'object' || type === 'array')
  const dimmed = $derived(!!search && !matchesSearch(data))

  const entries = $derived.by((): [string | number, JsonValue][] => {
    if (Array.isArray(data)) return data.map((v, i): [number, JsonValue] => [i, v])
    if (data !== null && typeof data === 'object') return Object.entries(data) as [string, JsonValue][]
    return []
  })

  const count = $derived(entries.length)
  const indent = $derived(isRoot ? 0 : 20)

  // Collapsed preview: show first few items inline
  const collapsedPreview = $derived.by(() => {
    if (open || !isContainer) return ''
    const items = entries.slice(0, 3)
    const parts = items.map(([k, v]) => {
      const vt = typeOf(v)
      let valStr: string
      if (vt === 'string') valStr = `"${String(v).slice(0, 20)}"`
      else if (vt === 'array') valStr = '[…]'
      else if (vt === 'object') valStr = '{…}'
      else valStr = formatValue(v)
      return `${Array.isArray(data) ? '' : `"${k}": `}${valStr}`
    })
    const suffix = count > 3 ? ', …' : ''
    const openBracket = type === 'array' ? '[' : '{'
    const close = type === 'array' ? ']' : '}'
    return `${openBracket}${parts.join(', ')}${suffix}${close}`
  })

  const parentKey = $derived(path.length ? pathKey(path.slice(0, -1)) : null)

  function handleCopy() {
    oncopy?.(data, path)
  }

  function getTreeRows(from: HTMLElement): HTMLElement[] {
    const tree = from.closest('[role="tree"]')
    if (!tree) return []
    return Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]'))
  }

  function focusRow(row: HTMLElement | null | undefined) {
    row?.focus()
  }

  function handleRowKeydown(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    const target = e.currentTarget

    if (e.key === 'Enter' || e.key === ' ') {
      if (isContainer) {
        e.preventDefault()
        toggle(path)
      } else {
        e.preventDefault()
        handleCopy()
      }
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (isContainer && !open) {
        toggle(path)
      } else if (isContainer && open) {
        const rows = getTreeRows(target)
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (isContainer && open) {
        toggle(path)
      } else if (parentKey) {
        const tree = target.closest('[role="tree"]')
        const parent = tree?.querySelector<HTMLElement>(
          `[data-tree-row][data-tree-id="${CSS.escape(parentKey)}"]`,
        )
        focusRow(parent)
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const rows = getTreeRows(target)
      const idx = rows.indexOf(target)
      if (idx < 0) return
      focusRow(e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1])
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      focusRow(getTreeRows(target)[0])
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      const rows = getTreeRows(target)
      focusRow(rows[rows.length - 1])
    }
  }
</script>

<!-- svelte-ignore a11y_role_has_required_aria_props: rows are navigable, not selectable — aria-selected would mislead -->
<div
  data-dimmed={dimmed ? '' : undefined}
  class={dimmed ? 'opacity-30' : ''}
  role="treeitem"
  aria-expanded={isContainer ? open : undefined}
>
  <!-- Container header row (object/array) -->
  {#if isContainer}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_static_element_interactions: tree row with full roving keyboard support -->
    <div
      data-tree-row
      data-tree-id={key}
      data-tree-parent={parentKey ?? undefined}
      tabindex="0"
      class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      style="padding-left: {indent}px"
      onclick={() => toggle(path)}
      onkeydown={handleRowKeydown}
    >
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-4 shrink-0 items-center justify-center rounded"
        aria-expanded={open}
        aria-label={open ? 'Collapse' : 'Expand'}
        tabindex="-1"
        onclick={(e) => {
          e.stopPropagation()
          toggle(path)
        }}
      >
        {#if open}
          <ChevronDown class="size-3.5" />
        {:else}
          <ChevronRight class="size-3.5" />
        {/if}
      </button>
      <span class="{keyColor} select-none">
        {isRoot ? label : `"${label}"`}
      </span>
      <span class="text-muted-foreground">:</span>
      {#if open}
        <span class="text-muted-foreground select-none">{type === 'array' ? '[' : '{'}</span>
      {:else}
        <span class="text-muted-foreground select-none">{collapsedPreview}</span>
      {/if}
      {#if open}
        <span class="text-muted-foreground ml-0.5 text-xs">{count} {count === 1 ? 'item' : 'items'}</span>
      {/if}
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
        title="Copy value"
        aria-label="Copy value"
        tabindex="-1"
        onclick={(e) => {
          e.stopPropagation()
          handleCopy()
        }}
      >
        {#if copiedPath === key}
          <Check class="size-3 text-emerald-500" />
        {:else}
          <Copy class="size-3" />
        {/if}
      </button>
    </div>
  {/if}

  <!-- Container children -->
  {#if isContainer && open}
    <div role="group">
      {#each entries as [k, v] (String(k))}
        <JsonTreeNode
          data={v}
          path={[...path, k]}
          label={String(k)}
          isRoot={false}
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
          {oncopy}
        />
      {/each}
      <div class="text-muted-foreground py-0.5 select-none" style="padding-left: {indent}px">
        {type === 'array' ? ']' : '}'}
      </div>
    </div>
  {/if}

  <!-- Primitive leaf -->
  {#if !isContainer}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_static_element_interactions: tree row with full roving keyboard support -->
    <div
      data-tree-row
      data-tree-id={key}
      data-tree-parent={parentKey ?? undefined}
      tabindex="0"
      class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      style="padding-left: {indent}px"
      onclick={handleCopy}
      onkeydown={handleRowKeydown}
    >
      <span class="inline-flex size-4 shrink-0"></span>
      {#if isRoot}
        <span class="text-muted-foreground select-none">{label}</span>
      {:else}
        <span class="{keyColor} select-none">"{label}"</span>
      {/if}
      <span class="text-muted-foreground">:</span>
      <span class="{typeColor[type] ?? 'text-foreground'} rounded text-left font-mono">
        {formatValue(data)}
      </span>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
        title="Copy value"
        aria-label="Copy value"
        tabindex="-1"
        onclick={(e) => {
          e.stopPropagation()
          handleCopy()
        }}
      >
        {#if copiedPath === key}
          <Check class="size-3 text-emerald-500" />
        {:else}
          <Copy class="size-3" />
        {/if}
      </button>
    </div>
  {/if}
</div>

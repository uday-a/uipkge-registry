<script lang="ts" module>
  import type { XmlNode } from './types'

  export interface XmlTreeNodeProps {
    node: XmlNode
    path: string[]
    isRoot?: boolean
    search?: string
    maxDepth?: number
    matchesSearch: (node: XmlNode) => boolean
    isExpanded: (path: string[]) => boolean
    toggle: (path: string[]) => void
    tagColor: string
    attrNameColor: string
    attrValueColor: string
    textColor: string
    commentColor: string
    punctColor: string
    copiedPath?: string | null
    oncopy: (value: string, path: string[]) => void
  }
</script>

<script lang="ts">
  import { Check, ChevronDown, ChevronRight, Copy } from '@lucide/svelte'
  import { isExpandable, serializeXml } from './types'
  import XmlTreeNodeSelf from './XmlTreeNode.svelte'

  let {
    node,
    path,
    isRoot = false,
    search = '',
    maxDepth = 100,
    matchesSearch,
    isExpanded,
    toggle,
    tagColor,
    attrNameColor,
    attrValueColor,
    textColor,
    commentColor,
    punctColor,
    copiedPath = null,
    oncopy,
  }: XmlTreeNodeProps = $props()

  function pathKey(p: string[]): string {
    return p.length ? '/' + p.join('/') : '/'
  }

  const key = $derived(pathKey(path))
  const open = $derived(isExpanded(path))
  const expandable = $derived(isExpandable(node))
  const dimmed = $derived(!!search && !matchesSearch(node))
  const indent = $derived(isRoot ? 0 : 20)

  const parentKey = $derived(path.length ? pathKey(path.slice(0, -1)) : null)

  /** Child path segments with sibling indices for duplicate tag names. */
  const childEntries = $derived.by(() => {
    const counts = new Map<string, number>()
    const totals = new Map<string, number>()
    for (const c of node.children) {
      if (c.type === 'element') {
        totals.set(c.name, (totals.get(c.name) ?? 0) + 1)
      }
    }
    return node.children.map((child, i) => {
      let segment: string
      if (child.type === 'element') {
        const n = (counts.get(child.name) ?? 0) + 1
        counts.set(child.name, n)
        const total = totals.get(child.name) ?? 1
        segment = total > 1 ? `${child.name}[${n}]` : child.name
      } else if (child.type === 'comment') {
        segment = `comment()[${i}]`
      } else if (child.type === 'cdata') {
        segment = `text()[${i}]`
      } else {
        segment = `text()[${i}]`
      }
      return { child, segment, path: [...path, segment] as string[] }
    })
  })

  const childCount = $derived(node.children.filter((c) => c.type === 'element').length)

  const collapsedPreview = $derived.by(() => {
    if (open || !expandable) return ''
    const tags = node.children.filter((c) => c.type === 'element').slice(0, 3)
    const parts = tags.map((c) => `<${c.name}${c.attributes.length ? ' …' : ''}>`)
    const suffix = childCount > 3 ? ' …' : ''
    return parts.join(' ') + suffix
  })

  const textOnlyChild = $derived.by(() => {
    if (node.type !== 'element') return null
    if (node.children.length === 1 && node.children[0]!.type === 'text') {
      return node.children[0]!.text
    }
    return null
  })

  function onCopy() {
    const value = node.type === 'element' ? serializeXml(node) : node.text
    oncopy(value, path)
  }

  function getTreeRows(from: HTMLElement): HTMLElement[] {
    const tree = from.closest('[role="tree"]')
    if (!tree) return []
    return Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]'))
  }

  function focusRow(row: HTMLElement | null | undefined) {
    row?.focus()
  }

  function handleRowKeydown(e: KeyboardEvent) {
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (expandable) toggle(path)
      else onCopy()
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (expandable && !open) {
        toggle(path)
      } else if (expandable && open) {
        const rows = getTreeRows(target)
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (expandable && open) {
        toggle(path)
      } else if (parentKey) {
        const tree = target.closest('[role="tree"]')
        const parent = tree?.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(parentKey)}"]`)
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

  const rowClass =
    'group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none'
  const copyBtnClass =
    'text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1'
</script>

<div
  data-dimmed={dimmed ? '' : undefined}
  class={dimmed ? 'opacity-30' : ''}
  role="treeitem"
  aria-expanded={expandable ? open : undefined}
  aria-selected={false}
>
  {#if node.type === 'element'}
    <!-- Expandable element header -->
    {#if expandable}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        data-tree-row
        data-tree-id={key}
        data-tree-parent={parentKey ?? undefined}
        tabindex="0"
        class={rowClass}
        style:padding-left={`${indent}px`}
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
        <span class={punctColor + ' select-none'}>&lt;</span>
        <span class={tagColor + ' select-none'}>{node.name}</span>
        {#each node.attributes as attr (attr.name)}
          <span class="select-none">&nbsp;</span>
          <span class={attrNameColor + ' select-none'}>{attr.name}</span>
          <span class={punctColor + ' select-none'}>=</span>
          <span class={attrValueColor + ' select-none'}>"{attr.value}"</span>
        {/each}
        <span class={punctColor + ' select-none'}>&gt;</span>
        {#if open}
          <span class="text-muted-foreground ml-0.5 text-xs">
            {childCount} {childCount === 1 ? 'child' : 'children'}
          </span>
        {:else}
          <span class="text-muted-foreground ml-1 truncate text-xs select-none">{collapsedPreview}</span>
        {/if}
        <button
          type="button"
          class={copyBtnClass}
          title="Copy subtree"
          aria-label="Copy subtree"
          tabindex="-1"
          onclick={(e) => {
            e.stopPropagation()
            onCopy()
          }}
        >
          {#if copiedPath === key}
            <Check class="size-3 text-emerald-500" />
          {:else}
            <Copy class="size-3" />
          {/if}
        </button>
      </div>

      <!-- Expandable children -->
      {#if open}
        <div role="group">
          {#each childEntries as entry (entry.segment)}
            <XmlTreeNodeSelf
              node={entry.child}
              path={entry.path}
              isRoot={false}
              {search}
              maxDepth={maxDepth}
              {matchesSearch}
              {isExpanded}
              {toggle}
              {tagColor}
              {attrNameColor}
              {attrValueColor}
              {textColor}
              {commentColor}
              {punctColor}
              {copiedPath}
              {oncopy}
            />
          {/each}
          <div class="flex items-center gap-0.5 py-0.5 select-none" style:padding-left={`${indent}px`}>
            <span class="inline-flex size-4 shrink-0"></span>
            <span class={punctColor}>&lt;/</span>
            <span class={tagColor}>{node.name}</span>
            <span class={punctColor}>&gt;</span>
          </div>
        </div>
      {/if}
    {:else}
      <!-- Inline element: text-only or empty / self-closing -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        data-tree-row
        data-tree-id={key}
        data-tree-parent={parentKey ?? undefined}
        tabindex="0"
        class={rowClass}
        style:padding-left={`${indent}px`}
        onclick={onCopy}
        onkeydown={handleRowKeydown}
      >
        <span class="inline-flex size-4 shrink-0"></span>
        <span class={punctColor + ' select-none'}>&lt;</span>
        <span class={tagColor + ' select-none'}>{node.name}</span>
        {#each node.attributes as attr (attr.name)}
          <span class="select-none">&nbsp;</span>
          <span class={attrNameColor + ' select-none'}>{attr.name}</span>
          <span class={punctColor + ' select-none'}>=</span>
          <span class={attrValueColor + ' select-none'}>"{attr.value}"</span>
        {/each}
        {#if textOnlyChild !== null}
          <span class={punctColor + ' select-none'}>&gt;</span>
          <span class={textColor + ' truncate'}>{textOnlyChild}</span>
          <span class={punctColor + ' shrink-0 select-none'}>&lt;/</span>
          <span class={tagColor + ' shrink-0 select-none'}>{node.name}</span>
          <span class={punctColor + ' shrink-0 select-none'}>&gt;</span>
        {:else}
          <span class={punctColor + ' select-none'}> /&gt;</span>
        {/if}
        <button
          type="button"
          class={copyBtnClass}
          title="Copy value"
          aria-label="Copy value"
          tabindex="-1"
          onclick={(e) => {
            e.stopPropagation()
            onCopy()
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
  {:else if node.type === 'comment'}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      data-tree-row
      data-tree-id={key}
      data-tree-parent={parentKey ?? undefined}
      tabindex="0"
      class={rowClass}
      style:padding-left={`${indent}px`}
      onclick={onCopy}
      onkeydown={handleRowKeydown}
    >
      <span class="inline-flex size-4 shrink-0"></span>
      <span class={commentColor + ' truncate italic select-none'}>&lt;!--{node.text}--&gt;</span>
      <button
        type="button"
        class={copyBtnClass}
        title="Copy comment"
        aria-label="Copy comment"
        tabindex="-1"
        onclick={(e) => {
          e.stopPropagation()
          onCopy()
        }}
      >
        {#if copiedPath === key}
          <Check class="size-3 text-emerald-500" />
        {:else}
          <Copy class="size-3" />
        {/if}
      </button>
    </div>
  {:else if node.type === 'cdata'}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      data-tree-row
      data-tree-id={key}
      data-tree-parent={parentKey ?? undefined}
      tabindex="0"
      class={rowClass}
      style:padding-left={`${indent}px`}
      onclick={onCopy}
      onkeydown={handleRowKeydown}
    >
      <span class="inline-flex size-4 shrink-0"></span>
      <span class={punctColor + ' select-none'}>&lt;![CDATA[</span>
      <span class={textColor + ' truncate'}>{node.text}</span>
      <span class={punctColor + ' shrink-0 select-none'}>]]&gt;</span>
      <button
        type="button"
        class={copyBtnClass}
        title="Copy CDATA"
        aria-label="Copy CDATA"
        tabindex="-1"
        onclick={(e) => {
          e.stopPropagation()
          onCopy()
        }}
      >
        {#if copiedPath === key}
          <Check class="size-3 text-emerald-500" />
        {:else}
          <Copy class="size-3" />
        {/if}
      </button>
    </div>
  {:else}
    <!-- Bare text (rare when not folded into parent) -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      data-tree-row
      data-tree-id={key}
      data-tree-parent={parentKey ?? undefined}
      tabindex="0"
      class={rowClass}
      style:padding-left={`${indent}px`}
      onclick={onCopy}
      onkeydown={handleRowKeydown}
    >
      <span class="inline-flex size-4 shrink-0"></span>
      <span class={textColor + ' truncate'}>{node.text}</span>
      <button
        type="button"
        class={copyBtnClass}
        title="Copy text"
        aria-label="Copy text"
        tabindex="-1"
        onclick={(e) => {
          e.stopPropagation()
          onCopy()
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

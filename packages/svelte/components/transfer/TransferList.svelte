<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { TransferItem, TransferSide } from './context'

  export interface TransferListProps {
    side: TransferSide
    title: string
    items: TransferItem[]
    selected: string[]
    onselectedchange?: (keys: string[]) => void
    onsearch?: (query: string) => void
    footer?: Snippet
  }
</script>

<script lang="ts">
  import { GripVertical, Search } from '@lucide/svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Input } from '$lib/components/ui/input'
  import { ScrollArea } from '$lib/components/ui/scroll-area'
  import { getTransferContext } from './context'

  let { side, title, items, selected, onselectedchange, onsearch, footer }: TransferListProps = $props()

  const ctx = getTransferContext()

  let query = $state('')
  let page = $state(1)

  const filtered = $derived(!query ? items : items.filter((i) => ctx.filterFn(query, i)))

  const effectivePageSize = $derived(ctx.pageSize ?? Math.max(1, filtered.length))
  const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / effectivePageSize)))

  const visible = $derived.by(() => {
    if (!ctx.pageSize) return filtered
    const start = (page - 1) * effectivePageSize
    return filtered.slice(start, start + effectivePageSize)
  })

  $effect(() => {
    if (page > totalPages) page = totalPages
  })

  const visibleEnabledKeys = $derived(visible.filter((i) => !i.disabled).map((i) => i.key))
  const selectedSet = $derived(new Set(selected))

  const visibleSelectedCount = $derived(visibleEnabledKeys.filter((k) => selectedSet.has(k)).length)

  const masterChecked = $derived(
    visibleEnabledKeys.length > 0 && visibleSelectedCount === visibleEnabledKeys.length,
  )

  const masterIndeterminate = $derived(
    visibleSelectedCount > 0 && visibleSelectedCount < visibleEnabledKeys.length,
  )

  function emitSelected(keys: string[]) {
    onselectedchange?.(keys)
  }

  function toggleAll(checked: boolean) {
    let next = [...selected]
    if (checked) {
      for (const k of visibleEnabledKeys) {
        if (!selectedSet.has(k)) next.push(k)
      }
    } else {
      next = next.filter((k) => !visibleEnabledKeys.includes(k))
    }
    emitSelected(next)
  }

  function toggleItem(item: TransferItem, checked: boolean) {
    if (item.disabled || ctx.disabled) return
    let next = [...selected]
    if (checked) {
      if (!next.includes(item.key)) next.push(item.key)
    } else {
      next = next.filter((k) => k !== item.key)
    }
    emitSelected(next)
    lastAnchor = item.key
  }

  let lastAnchor = $state<string | null>(null)

  function onRowClick(e: MouseEvent, item: TransferItem) {
    if (item.disabled || ctx.disabled) return
    // With checkbox visible, click toggles (matches checkbox UX).
    if (ctx.selectable) {
      toggleItem(item, !selectedSet.has(item.key))
      return
    }
    // No checkbox: desktop list pattern — plain=replace, cmd/ctrl=toggle, shift=range.
    const enabledKeys = visible.filter((i) => !i.disabled).map((i) => i.key)
    if (e.shiftKey && lastAnchor && enabledKeys.includes(lastAnchor)) {
      const start = enabledKeys.indexOf(lastAnchor)
      const end = enabledKeys.indexOf(item.key)
      const [lo, hi] = start < end ? [start, end] : [end, start]
      emitSelected(enabledKeys.slice(lo, hi + 1))
      return
    }
    if (e.metaKey || e.ctrlKey) {
      let next = [...selected]
      if (selectedSet.has(item.key)) next = next.filter((k) => k !== item.key)
      else next.push(item.key)
      emitSelected(next)
      lastAnchor = item.key
      return
    }
    emitSelected([item.key])
    lastAnchor = item.key
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
      if (selectedSet.has(item.key) && selected.length > 0) {
        return selected.filter((k) => {
          const i = items.find((x) => x.key === k)
          return i && !i.disabled
        })
      }
      return item.disabled ? [] : [item.key]
    }

    // Ctrl/Cmd+Enter transfers selected items (or the focused item if none selected).
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (item.disabled || ctx.disabled) return
      const keys = keysToTransfer()
      if (!keys.length) return
      if (side === 'left') ctx.moveRight(keys)
      else if (!ctx.oneWay) ctx.moveLeft(keys)
      return
    }

    // Alt+Arrow transfers without redesigning the button strip.
    if (e.key === 'ArrowRight' && e.altKey && side === 'left') {
      e.preventDefault()
      if (item.disabled || ctx.disabled) return
      const keys = keysToTransfer()
      if (keys.length) ctx.moveRight(keys)
      return
    }

    if (e.key === 'ArrowLeft' && e.altKey && side === 'right' && !ctx.oneWay) {
      e.preventDefault()
      if (item.disabled || ctx.disabled) return
      const keys = keysToTransfer()
      if (keys.length) ctx.moveLeft(keys)
      return
    }

    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    if (item.disabled || ctx.disabled) return
    if (ctx.selectable) {
      toggleItem(item, !selectedSet.has(item.key))
      return
    }
    // Keyboard without modifiers: toggle single-item selection (desktop replace).
    emitSelected(selectedSet.has(item.key) && selected.length === 1 ? [] : [item.key])
    lastAnchor = item.key
  }

  function onSearch(v: string) {
    query = v
    page = 1
    onsearch?.(v)
  }

  function prevPage() {
    if (page > 1) page--
  }

  function nextPage() {
    if (page < totalPages) page++
  }

  const heightStyle = $derived(
    `height: ${typeof ctx.height === 'number' ? ctx.height + 'px' : ctx.height}`,
  )

  // ----- DnD -----

  let dropIndicator = $state<{ key: string; position: 'before' | 'after' } | null>(null)
  let draggingKeys = $state<Set<string>>(new Set())

  const isDropTarget = $derived.by(() => {
    const p = ctx.dragPayload
    if (!p) return false
    // left list rejects drops when oneWay
    if (side === 'left' && ctx.oneWay && p.fromSide === 'right') return false
    // left → left is a no-op (parent owns dataSource order)
    if (side === 'left' && p.fromSide === 'left') return false
    return true
  })

  function onItemDragStart(e: DragEvent, item: TransferItem) {
    if (!ctx.draggable || item.disabled || ctx.disabled) {
      e.preventDefault()
      return
    }
    // If the dragged row is part of the current selection, drag the whole selection.
    // Else, drag just this row (and clear selection visually for clarity).
    const keys = selectedSet.has(item.key)
      ? selected.filter((k) => {
          const i = items.find((x) => x.key === k)
          return i && !i.disabled
        })
      : [item.key]
    draggingKeys = new Set(keys)
    ctx.startDrag({ keys, fromSide: side })
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
    draggingKeys = new Set()
    dropIndicator = null
    ctx.endDrag()
  }

  function onItemDragOver(e: DragEvent, item: TransferItem) {
    if (!isDropTarget) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    if (side !== 'right') {
      // left list: no insertion indicator, drop just removes from target
      return
    }
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const after = e.clientY > rect.top + rect.height / 2
    dropIndicator = { key: item.key, position: after ? 'after' : 'before' }
  }

  function onItemDrop(e: DragEvent, item: TransferItem) {
    if (!isDropTarget) return
    e.preventDefault()
    e.stopPropagation()
    if (side === 'right') {
      const after = dropIndicator?.position === 'after'
      const idx = items.findIndex((x) => x.key === item.key)
      const beforeKey = after ? (items[idx + 1]?.key ?? null) : item.key
      ctx.drop('right', beforeKey)
    } else {
      ctx.drop('left', null)
    }
    dropIndicator = null
  }

  function onListDragOver(e: DragEvent) {
    if (!isDropTarget) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  }

  function onListDrop(e: DragEvent) {
    if (!isDropTarget) return
    e.preventDefault()
    // Empty zone or below all items → append (right) / remove (left).
    ctx.drop(side, null)
    dropIndicator = null
  }

  function onListDragLeave(e: DragEvent) {
    // Clear indicator only when leaving the list container, not when crossing item rows.
    const related = e.relatedTarget as Node | null
    const current = e.currentTarget as Node
    if (!related || !current.contains(related)) {
      dropIndicator = null
    }
  }
</script>

<div
  class="flex flex-col overflow-hidden rounded-md border bg-card transition-colors {ctx.dragPayload &&
  isDropTarget
    ? 'ring-1 ring-ring/40'
    : ''}"
>
  <div class="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
    <div class="flex min-w-0 items-center gap-2">
      {#if ctx.selectable}
        <Checkbox
          checked={masterIndeterminate ? 'indeterminate' : masterChecked}
          disabled={ctx.disabled || visibleEnabledKeys.length === 0}
          aria-label={`Select all in ${title}`}
          onCheckedChange={(v: boolean | 'indeterminate') => toggleAll(v === true)}
        />
      {/if}
      <span class="truncate text-sm font-medium">{title}</span>
    </div>
    <span class="text-xs text-muted-foreground tabular-nums"> {selected.length}/{items.length} </span>
  </div>

  {#if ctx.showSearch}
    <div class="border-b p-2">
      <div class="relative">
        <Search
          class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={query}
          placeholder="Search"
          aria-label={`Search ${title}`}
          class="h-8 pl-8"
          oninput={(e: Event) => onSearch((e.currentTarget as HTMLInputElement).value)}
        />
      </div>
    </div>
  {/if}

  <ScrollArea
    style={heightStyle}
    class="flex-1"
    ondragover={onListDragOver}
    ondrop={onListDrop}
    ondragleave={onListDragLeave}
  >
    <ul role="listbox" aria-label={title} aria-multiselectable="true" class="py-1">
      {#each visible as item (item.key)}
        <li
          role="option"
          aria-selected={selectedSet.has(item.key)}
          aria-disabled={item.disabled || undefined}
          tabindex={item.disabled || ctx.disabled ? -1 : 0}
          draggable={ctx.draggable && !item.disabled && !ctx.disabled}
          class="relative flex min-h-11 cursor-pointer items-start gap-2 px-3 py-3 text-sm select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none {item.disabled
            ? 'cursor-not-allowed opacity-50'
            : ''} {draggingKeys.has(item.key) ? 'opacity-40' : ''} {!ctx.selectable &&
          selectedSet.has(item.key)
            ? 'bg-accent'
            : ''}"
          onclick={(e) => onRowClick(e, item)}
          onkeydown={(e) => onRowKeydown(e, item)}
          ondragstart={(e) => onItemDragStart(e, item)}
          ondragend={onItemDragEnd}
          ondragover={(e) => onItemDragOver(e, item)}
          ondrop={(e) => onItemDrop(e, item)}
        >
          {#if dropIndicator && dropIndicator.key === item.key && dropIndicator.position === 'before' && side === 'right'}
            <span
              class="pointer-events-none absolute -top-px right-2 left-2 h-0.5 rounded-full bg-primary"
              aria-hidden="true"
            ></span>
          {/if}
          {#if dropIndicator && dropIndicator.key === item.key && dropIndicator.position === 'after' && side === 'right'}
            <span
              class="pointer-events-none absolute right-2 -bottom-px left-2 h-0.5 rounded-full bg-primary"
              aria-hidden="true"
            ></span>
          {/if}
          {#if ctx.selectable}
            <Checkbox
              checked={selectedSet.has(item.key)}
              disabled={item.disabled || ctx.disabled}
              onCheckedChange={(v: boolean | 'indeterminate') => toggleItem(item, v === true)}
              onclick={(e: MouseEvent) => e.stopPropagation()}
            />
          {/if}
          <div class="min-w-0 flex-1">
            <div class="truncate">{item.label}</div>
            {#if item.description}
              <div class="truncate text-xs text-muted-foreground">
                {item.description}
              </div>
            {/if}
          </div>
          {#if ctx.draggable && !item.disabled}
            <GripVertical class="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" />
          {/if}
        </li>
      {/each}
      {#if visible.length === 0}
        <li class="px-3 py-6 text-center text-sm text-muted-foreground">No items</li>
      {/if}
    </ul>
  </ScrollArea>

  {#if ctx.pageSize && totalPages > 1}
    <div class="flex items-center justify-center gap-2 border-t p-2 text-xs">
      <button
        type="button"
        class="rounded px-2 py-1 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        disabled={page <= 1}
        aria-label={`Previous page of ${title}`}
        onclick={prevPage}
      >
        Prev
      </button>
      <span class="tabular-nums" aria-live="polite">{page} / {totalPages}</span>
      <button
        type="button"
        class="rounded px-2 py-1 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        disabled={page >= totalPages}
        aria-label={`Next page of ${title}`}
        onclick={nextPage}
      >
        Next
      </button>
    </div>
  {/if}

  {#if footer}
    <div class="border-t p-2">
      {@render footer()}
    </div>
  {/if}
</div>

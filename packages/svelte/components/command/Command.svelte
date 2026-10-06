<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { CommandFilter } from './context'

  export interface CommandProps extends HTMLAttributes<HTMLDivElement> {
    /** Selected value. Updated on item select. */
    value?: string
    onValueChange?: (value: string) => void
    /** Custom filter — mirrors cmdk `filter`. Omit for the default normalized-substring match. */
    filter?: CommandFilter
    /** When false, skip filtering entirely (consumer filters externally). Mirrors cmdk `shouldFilter`. Default true. */
    shouldFilter?: boolean
    /** When true, arrow navigation wraps around the ends. Mirrors cmdk `loop`. Default false. */
    loop?: boolean
    ref?: HTMLDivElement | null
  }

  let commandIdCounter = 0
</script>

<script lang="ts">
  import { SvelteMap, SvelteSet } from 'svelte/reactivity'
  import { cn } from '$lib/utils'
  import { normalizeSearch, setCommandContext, type CommandItemRegistration } from './context'

  let {
    class: className,
    value = $bindable(''),
    onValueChange,
    filter,
    shouldFilter = true,
    loop = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: CommandProps = $props()

  commandIdCounter += 1
  const listId = `uipkge-command-list-${commandIdCounter}`

  let search = $state('')
  let highlightedId = $state<string | null>(null)
  let listEl: HTMLElement | null = null

  const allItems = new SvelteMap<string, CommandItemRegistration>()
  const allGroups = new SvelteMap<string, SvelteSet<string>>()

  const isFiltering = $derived(!!search && shouldFilter)

  const scores = $derived.by(() => {
    const map = new Map<string, boolean>()
    if (!isFiltering) {
      for (const id of allItems.keys()) map.set(id, true)
      return map
    }
    const q = normalizeSearch(search)
    for (const [id, entry] of allItems) {
      if (filter) {
        const result = filter(entry.value, search, entry.keywords)
        map.set(id, typeof result === 'number' ? result > 0 : result)
      } else {
        map.set(id, normalizeSearch(entry.text || entry.value).includes(q))
      }
    }
    return map
  })

  const visibleGroups = $derived.by(() => {
    const set = new Set<string>()
    if (!isFiltering) {
      for (const id of allGroups.keys()) set.add(id)
      return set
    }
    for (const [groupId, members] of allGroups) {
      for (const itemId of members) {
        if (scores.get(itemId)) {
          set.add(groupId)
          break
        }
      }
    }
    return set
  })

  const count = $derived(isFiltering ? [...scores.values()].filter(Boolean).length : allItems.size)
  const activeDescendant = $derived(highlightedId ? `${listId}-item-${highlightedId}` : undefined)

  /** Visible, enabled ids in DOM order (falls back to registration order). */
  function orderedVisibleIds(): string[] {
    if (!listEl) return [...scores].filter(([, v]) => v).map(([id]) => id)
    const ids: string[] = []
    for (const el of listEl.querySelectorAll('[data-command-item-id]')) {
      const id = el.getAttribute('data-command-item-id')!
      const entry = allItems.get(id)
      if (entry && !entry.disabled && (scores.get(id) ?? true)) ids.push(id)
    }
    return ids
  }

  function moveHighlight(direction: 1 | -1) {
    const ids = orderedVisibleIds()
    if (!ids.length) return
    const current = highlightedId ? ids.indexOf(highlightedId) : -1
    let next: number
    if (current === -1) {
      next = direction === 1 ? 0 : ids.length - 1
    } else if (loop) {
      next = (current + direction + ids.length) % ids.length
    } else {
      // cmdk default: clamp at the ends instead of wrapping.
      next = Math.min(ids.length - 1, Math.max(0, current + direction))
    }
    highlightedId = ids[next]!
    listEl?.querySelector(`[data-command-item-id="${highlightedId}"]`)?.scrollIntoView({ block: 'nearest' })
  }

  function selectItem(id: string) {
    const entry = allItems.get(id)
    if (!entry || entry.disabled) return
    value = entry.value
    onValueChange?.(entry.value)
    search = ''
    highlightedId = null
    entry.onSelect(entry.value)
  }

  function selectHighlighted() {
    if (highlightedId) selectItem(highlightedId)
  }

  setCommandContext({
    get search() {
      return search
    },
    setSearch(v) {
      search = v
      highlightedId = null
    },
    get count() {
      return count
    },
    get listId() {
      return listId
    },
    get activeDescendant() {
      return activeDescendant
    },
    isItemVisible: (id) => (isFiltering ? (scores.get(id) ?? true) : true),
    isGroupVisible: (groupId) => (isFiltering ? visibleGroups.has(groupId) : true),
    isHighlighted: (id) => highlightedId === id,
    setHighlighted: (id) => {
      highlightedId = id
    },
    registerItem(id, entry) {
      // Idempotent: the item $effect re-runs when registration itself
      // invalidates its deps, so a redundant write would ping-pong forever
      // (effect_update_depth_exceeded). The onSelect closure is fresh on every
      // run by construction, so compare data fields and swap the fn silently.
      const prev = allItems.get(id)
      if (
        prev &&
        prev.value === entry.value &&
        prev.text === entry.text &&
        prev.disabled === entry.disabled &&
        prev.groupId === entry.groupId &&
        (prev.keywords ?? []).join('\n') === (entry.keywords ?? []).join('\n')
      ) {
        prev.onSelect = entry.onSelect
        return
      }
      allItems.set(id, entry)
      if (entry.groupId) {
        let members = allGroups.get(entry.groupId)
        if (!members) {
          members = new SvelteSet<string>()
          allGroups.set(entry.groupId, members)
        }
        members.add(id)
      }
    },
    unregisterItem(id) {
      if (!allItems.has(id)) return
      allItems.delete(id)
      if (highlightedId === id) highlightedId = null
    },
    registerGroup(id) {
      if (!allGroups.has(id)) allGroups.set(id, new SvelteSet<string>())
    },
    unregisterGroup(id) {
      if (!allGroups.has(id)) return
      allGroups.delete(id)
    },
    moveHighlight,
    selectHighlighted,
    selectItem,
    setListElement(el) {
      listEl = el
    },
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="command"
  class={cn('bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md', className)}
  {...restProps}
>
  {@render children?.()}
</div>

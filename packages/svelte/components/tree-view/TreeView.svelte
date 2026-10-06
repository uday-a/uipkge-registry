<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TreeViewItem } from './types'

  // Omit DOM event props shadowed by component callbacks (item payloads, not events).
  export interface TreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect' | 'ontoggle'> {
    items: TreeViewItem[]
    showIcons?: boolean
    showCheckboxes?: boolean
    defaultExpanded?: boolean
    selectedId?: string | null
    onselect?: (item: TreeViewItem) => void
    ontoggle?: (item: TreeViewItem) => void
    onSelectedIdChange?: (id: string | null) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { cn } from '$lib/utils'
  import { setTreeViewContext } from './context'
  import TreeViewNode from './TreeViewNode.svelte'

  let {
    items,
    showIcons = true,
    showCheckboxes = false,
    defaultExpanded = false,
    selectedId = $bindable(null),
    onselect,
    ontoggle,
    onSelectedIdChange,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: TreeViewProps = $props()

  let expandedIds = $state<Set<string>>(new Set())

  function toggle(item: TreeViewItem) {
    if (item.disabled) return
    const next = new Set(expandedIds)
    if (next.has(item.id)) next.delete(item.id)
    else next.add(item.id)
    expandedIds = next
    ontoggle?.(item)
  }

  function select(item: TreeViewItem) {
    if (item.disabled) return
    selectedId = item.id
    onselect?.(item)
    onSelectedIdChange?.(item.id)
  }

  // Getters keep the child rows reactive to parent state without a .svelte.ts store.
  setTreeViewContext({
    get expandedIds() {
      return expandedIds
    },
    get selectedId() {
      return selectedId
    },
    get showIcons() {
      return showIcons
    },
    get showCheckboxes() {
      return showCheckboxes
    },
    toggle,
    select,
  })

  onMount(() => {
    if (!defaultExpanded) return
    const next = new Set<string>()
    const walk = (list: TreeViewItem[]) => {
      for (const it of list) {
        if (it.children?.length) {
          next.add(it.id)
          walk(it.children)
        }
      }
    }
    walk(items)
    expandedIds = next
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="tree-view"
  role="tree"
  class={cn('text-sm', className)}
  {...restProps}
>
  {#each items as item, i (item.id)}
    <TreeViewNode {item} depth={0} isLast={i === items.length - 1} />
  {/each}
</div>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import type { TransferItem } from './context'

  // Omit DOM event props shadowed by component callbacks (onchange/onsearch carry payloads, not events).
  export interface TransferProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange' | 'onsearch'> {
    targetKeys?: string[]
    dataSource: TransferItem[]
    titles?: [string, string]
    showSearch?: boolean
    filterFn?: (query: string, item: TransferItem) => boolean
    height?: number | string
    pagination?: boolean | { pageSize: number }
    oneWay?: boolean
    disabled?: boolean
    draggable?: boolean
    selectable?: boolean
    footerLeft?: Snippet
    footerRight?: Snippet
    onTargetKeysChange?: (keys: string[]) => void
    onchange?: (keys: string[], direction: 'left' | 'right', moved: string[]) => void
    onsearch?: (payload: { direction: 'left' | 'right'; query: string }) => void
    onselectchange?: (payload: { left: string[]; right: string[] }) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import TransferList from './TransferList.svelte'
  import TransferOperation from './TransferOperation.svelte'
  import { setTransferContext, type TransferDragPayload, type TransferSide } from './context'

  let {
    targetKeys = $bindable([]),
    dataSource,
    titles = ['Source', 'Target'],
    showSearch = false,
    filterFn,
    height = 320,
    pagination = false,
    oneWay = false,
    disabled = false,
    draggable = false,
    selectable = true,
    footerLeft,
    footerRight,
    onTargetKeysChange,
    onchange,
    onsearch,
    onselectchange,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: TransferProps = $props()

  function setTargetKeys(next: string[]) {
    targetKeys = next
    onTargetKeysChange?.(next)
  }

  const dataMap = $derived(new Map(dataSource.map((i) => [i.key, i])))

  const sourceItems = $derived(dataSource.filter((i) => !targetKeys.includes(i.key)))

  // When draggable, target order follows targetKeys exactly so reorder persists.
  // Otherwise keep legacy dataSource ordering for backwards compat.
  const targetItems = $derived.by((): TransferItem[] => {
    if (draggable) {
      const out: TransferItem[] = []
      for (const k of targetKeys) {
        const item = dataMap.get(k)
        if (item) out.push(item)
      }
      return out
    }
    return dataSource.filter((i) => targetKeys.includes(i.key))
  })

  let selectedLeft = $state<string[]>([])
  let selectedRight = $state<string[]>([])

  const pageSize = $derived.by((): number | null => {
    if (pagination === false) return null
    if (pagination === true) return 10
    return pagination.pageSize
  })

  function defaultFilter(q: string, item: TransferItem) {
    return item.label.toLowerCase().includes(q.toLowerCase())
  }

  let dragPayload = $state<TransferDragPayload | null>(null)

  function startDrag(payload: TransferDragPayload) {
    dragPayload = payload
  }

  function endDrag() {
    dragPayload = null
  }

  function drop(toSide: TransferSide, beforeKey: string | null) {
    const payload = dragPayload
    dragPayload = null
    if (!payload || disabled) return
    const keys = payload.keys.filter((k) => {
      const item = dataMap.get(k)
      return item && !item.disabled
    })
    if (keys.length === 0) return

    // left → left: reorder source not supported (parent owns dataSource order). No-op.
    if (payload.fromSide === 'left' && toSide === 'left') return

    // right → left: remove from targetKeys (skip when oneWay).
    if (payload.fromSide === 'right' && toSide === 'left') {
      if (oneWay) return
      const removeSet = new Set(keys)
      const next = targetKeys.filter((k) => !removeSet.has(k))
      selectedRight = selectedRight.filter((k) => !removeSet.has(k))
      setTargetKeys(next)
      onchange?.(next, 'left', keys)
      onselectchange?.({ left: selectedLeft, right: selectedRight })
      return
    }

    // → right: insert (cross-list move) or reorder (within-target).
    const movingSet = new Set(keys)
    const without = targetKeys.filter((k) => !movingSet.has(k))
    let insertAt = without.length
    if (beforeKey != null) {
      const idx = without.indexOf(beforeKey)
      if (idx >= 0) insertAt = idx
    }
    const next = [...without.slice(0, insertAt), ...keys, ...without.slice(insertAt)]
    if (payload.fromSide === 'left') {
      const movedSet = new Set(keys)
      selectedLeft = selectedLeft.filter((k) => !movedSet.has(k))
      setTargetKeys(next)
      onchange?.(next, 'right', keys)
      onselectchange?.({ left: selectedLeft, right: selectedRight })
    } else {
      // right → right: pure reorder, no change event (target set unchanged).
      setTargetKeys(next)
    }
  }

  function onLeftSelected(keys: string[]) {
    selectedLeft = keys
    onselectchange?.({ left: keys, right: selectedRight })
  }

  function onRightSelected(keys: string[]) {
    selectedRight = keys
    onselectchange?.({ left: selectedLeft, right: keys })
  }

  function moveRight(keys?: string[]) {
    if (disabled) return
    const moved = keys?.length ? [...keys] : [...selectedLeft]
    if (moved.length === 0) return
    const next = [...targetKeys, ...moved.filter((k) => !targetKeys.includes(k))]
    selectedLeft = selectedLeft.filter((k) => !moved.includes(k))
    setTargetKeys(next)
    onchange?.(next, 'right', moved)
    onselectchange?.({ left: selectedLeft, right: selectedRight })
  }

  function moveLeft(keys?: string[]) {
    if (disabled || oneWay) return
    const moved = keys?.length ? [...keys] : [...selectedRight]
    if (moved.length === 0) return
    const remove = new Set(moved)
    const next = targetKeys.filter((k) => !remove.has(k))
    selectedRight = selectedRight.filter((k) => !remove.has(k))
    setTargetKeys(next)
    onchange?.(next, 'left', moved)
    onselectchange?.({ left: selectedLeft, right: selectedRight })
  }

  setTransferContext({
    get disabled() {
      return disabled
    },
    get showSearch() {
      return showSearch
    },
    get height() {
      return height
    },
    get pageSize() {
      return pageSize
    },
    get filterFn() {
      return filterFn ?? defaultFilter
    },
    get draggable() {
      return draggable
    },
    get selectable() {
      return selectable
    },
    get oneWay() {
      return oneWay
    },
    get dragPayload() {
      return dragPayload
    },
    startDrag,
    endDrag,
    drop,
    moveRight,
    moveLeft,
  })
</script>

<div bind:this={ref} data-uipkge data-slot="transfer" class={cn('flex items-stretch gap-3', className)} {...restProps}>
  <div class="min-w-0 flex-1">
    <TransferList
      side="left"
      title={titles[0]}
      items={sourceItems}
      selected={selectedLeft}
      onselectedchange={onLeftSelected}
      onsearch={(query) => onsearch?.({ direction: 'left', query })}
      footer={footerLeft}
    />
  </div>
  <TransferOperation
    canMoveRight={selectedLeft.length > 0 && !disabled}
    canMoveLeft={selectedRight.length > 0 && !disabled}
    {oneWay}
    onmoveright={() => moveRight()}
    onmoveleft={() => moveLeft()}
  />
  <div class="min-w-0 flex-1">
    <TransferList
      side="right"
      title={titles[1]}
      items={targetItems}
      selected={selectedRight}
      onselectedchange={onRightSelected}
      onsearch={(query) => onsearch?.({ direction: 'right', query })}
      footer={footerRight}
    />
  </div>
</div>

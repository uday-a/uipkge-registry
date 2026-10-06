<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** Imperative handle — grab it with `bind:this` (React `VirtualListHandle` parity). */
  export interface VirtualListHandle {
    scrollToOffset: (px: number) => void
    scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' }) => void
    getVisibleRange: () => [number, number]
  }

  export interface VirtualListProps<T extends Record<string, unknown>>
    extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    children?: Snippet<[{ item: T; index: number }]>
    items: T[]
    itemSize: number | ((item: T, index: number) => number)
    height: number | string
    overscan?: number
    keyField?: string
    direction?: 'vertical' | 'horizontal'
    as?: string
    onscroll?: (event: Event) => void
    onrangechange?: (range: [number, number]) => void
  }
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import { cn } from '$lib/utils'

  let {
    children,
    items,
    itemSize,
    height,
    overscan = 3,
    keyField = 'id',
    direction = 'vertical',
    as = 'div',
    onscroll,
    onrangechange,
    class: className,
    ...restProps
  }: VirtualListProps<T> = $props()

  let scrollEl: HTMLElement | null = $state(null)
  let scrollOffset = $state(0)
  let viewportSize = $state(typeof height === 'number' ? height : Number.parseInt(String(height), 10) || 0)

  const isVertical = $derived(direction === 'vertical')

  const offsets = $derived.by(() => {
    const out: number[] = [0]
    for (let i = 0; i < items.length; i++) {
      const s = typeof itemSize === 'function' ? itemSize(items[i]!, i) : itemSize
      out.push(out[i]! + s)
    }
    return out
  })

  const totalSize = $derived(offsets[items.length] ?? 0)

  function findIndex(target: number): number {
    const o = offsets
    let lo = 0
    let hi = o.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (o[mid]! <= target) lo = mid
      else hi = mid - 1
    }
    return lo
  }

  const range = $derived.by((): [number, number] => {
    if (!items.length || viewportSize === 0) return [0, 0]
    const start = Math.max(0, findIndex(scrollOffset) - overscan)
    const end = Math.min(items.length, findIndex(scrollOffset + viewportSize) + 1 + overscan)
    return [start, end]
  })

  const visible = $derived(items.slice(range[0], range[1]))
  const offsetStart = $derived(offsets[range[0]] ?? 0)

  // Mirror Vue's non-immediate watcher: only fire when the window actually moves.
  let prevRange: [number, number] = [0, 0]
  let rangePrimed = false
  $effect(() => {
    const r = range
    if (!rangePrimed) {
      rangePrimed = true
      prevRange = r
      return
    }
    if (r[0] !== prevRange[0] || r[1] !== prevRange[1]) {
      prevRange = r
      onrangechange?.(r)
    }
  })

  function onScroll(e: Event) {
    const el = e.target as HTMLElement
    scrollOffset = isVertical ? el.scrollTop : el.scrollLeft
    onscroll?.(e)
  }

  function measure() {
    if (!scrollEl) return
    const measured = isVertical ? scrollEl.clientHeight : scrollEl.clientWidth
    const fallback = typeof height === 'number' ? height : Number.parseInt(String(height), 10) || 0
    viewportSize = measured || fallback
  }

  $effect(() => {
    const el = scrollEl
    // Track height so resizes re-measure (post-flush, like Vue's flush: 'post' watcher).
    const _h = height
    if (!el) return
    queueMicrotask(measure)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  })

  function sizeOf(item: T, i: number) {
    return typeof itemSize === 'function' ? itemSize(item, i) : itemSize
  }

  function getKey(item: T, fallback: number): string | number {
    const k = item[keyField] as string | number | undefined
    return k ?? fallback
  }

  export function scrollToOffset(px: number) {
    if (!scrollEl) return
    if (isVertical) scrollEl.scrollTop = px
    else scrollEl.scrollLeft = px
  }

  export function scrollToIndex(i: number, options: { align?: 'start' | 'center' | 'end' } = {}) {
    const align = options.align ?? 'start'
    const start = offsets[i] ?? 0
    const size = (offsets[i + 1] ?? start) - start
    let target = start
    if (align === 'center') target = start - viewportSize / 2 + size / 2
    else if (align === 'end') target = start - viewportSize + size
    scrollToOffset(Math.max(0, target))
  }

  export function getVisibleRange(): [number, number] {
    return range
  }

  const containerStyle = $derived.by((): Record<string, string> => {
    const h = typeof height === 'number' ? `${height}px` : height
    return isVertical ? { height: h, overflowY: 'auto' } : { width: h, overflowX: 'auto' }
  })

  const innerStyle = $derived.by((): Record<string, string> =>
    isVertical
      ? { height: `${totalSize}px`, position: 'relative', width: '100%' }
      : { width: `${totalSize}px`, position: 'relative', height: '100%' },
  )

  const offsetStyle = $derived.by((): Record<string, string> =>
    isVertical
      ? { transform: `translateY(${offsetStart}px)` }
      : { transform: `translateX(${offsetStart}px)`, height: '100%', display: 'flex' },
  )

  function rowStyle(item: T, index: number): string {
    return isVertical ? `height: ${sizeOf(item, index)}px` : `width: ${sizeOf(item, index)}px; flex-shrink: 0`
  }

  function styleAttr(style: Record<string, string>): string {
    return Object.entries(style)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}: ${v}`)
      .join('; ')
  }
</script>

<svelte:element
  this={as}
  bind:this={scrollEl}
  data-uipkge
  data-slot="virtual-list"
  class={cn('w-full', className)}
  style={styleAttr(containerStyle)}
  onscroll={onScroll}
  {...restProps}
>
  <div style={styleAttr(innerStyle)}>
    <div style={styleAttr(offsetStyle)}>
      {#each visible as item, i (getKey(item, range[0] + i))}
        <div style={rowStyle(item, range[0] + i)}>
          {@render children?.({ item, index: range[0] + i })}
        </div>
      {/each}
    </div>
  </div>
</svelte:element>

<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PaginationItem {
    type: 'page' | 'ellipsis'
    value?: number
  }

  export interface PaginationSlotProps {
    page: number
    pageCount: number
  }

  export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    /** Controlled page (1-based). Pair with `bind:page` or `onPageChange`. */
    page?: number | undefined
    defaultPage?: number
    /** Total row count across all pages. */
    total?: number
    itemsPerPage?: number
    siblingCount?: number
    showEdges?: boolean
    disabled?: boolean
    ariaLabel?: string
    children?: Snippet<[PaginationSlotProps]>
    onPageChange?: (page: number) => void
    ref?: HTMLElement | null
  }

  export interface PaginationContext {
    readonly page: number
    readonly pageCount: number
    readonly disabled: boolean
    readonly items: PaginationItem[]
    goTo: (value: number) => void
    goFirst: () => void
    goPrev: () => void
    goNext: () => void
    goLast: () => void
  }

  export const PAGINATION_CTX = Symbol('uipkge-pagination')

  /** Page/ellipsis window around the current page. Edges always win; a gap of exactly one page renders the page, not dots. */
  export function buildPaginationItems(
    page: number,
    pageCount: number,
    siblingCount = 1,
    showEdges = false,
  ): PaginationItem[] {
    const total = Math.max(1, pageCount)
    const current = Math.min(Math.max(page, 1), total)
    const siblings = Math.max(0, siblingCount)
    const start = Math.max(1, current - siblings)
    const end = Math.min(total, current + siblings)
    const items: PaginationItem[] = []
    if (showEdges) {
      if (start > 1) {
        items.push({ type: 'page', value: 1 })
        if (start > 2) items.push({ type: 'ellipsis' })
      }
      for (let v = start; v <= end; v++) items.push({ type: 'page', value: v })
      if (end < total) {
        if (end < total - 1) items.push({ type: 'ellipsis' })
        items.push({ type: 'page', value: total })
      }
      return items
    }
    if (start > 1) items.push({ type: 'ellipsis' })
    for (let v = start; v <= end; v++) items.push({ type: 'page', value: v })
    if (end < total) items.push({ type: 'ellipsis' })
    return items
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    page = $bindable(undefined),
    defaultPage = 1,
    total = 0,
    itemsPerPage = 10,
    siblingCount = 1,
    showEdges = false,
    disabled = false,
    ariaLabel = 'Pagination',
    children,
    onPageChange,
    ref = $bindable(null),
    ...restProps
  }: PaginationProps = $props()

  // svelte-ignore state_referenced_locally -- uncontrolled seed: later defaultPage changes must not reset the page.
  let internalPage = $state(defaultPage)
  const pageCount = $derived(Math.max(1, Math.ceil(total / Math.max(1, itemsPerPage))))
  const currentPage = $derived(Math.min(Math.max(page ?? internalPage, 1), pageCount))
  const items = $derived(buildPaginationItems(currentPage, pageCount, siblingCount, showEdges))

  function setPage(value: number) {
    if (disabled) return
    const next = Math.min(Math.max(value, 1), pageCount)
    if (page === undefined) internalPage = next
    page = next
    onPageChange?.(next)
  }

  // Getters stay reactive: consumers read them inside $derived / templates.
  setContext<PaginationContext>(PAGINATION_CTX, {
    get page() {
      return currentPage
    },
    get pageCount() {
      return pageCount
    },
    get disabled() {
      return disabled
    },
    get items() {
      return items
    },
    goTo: setPage,
    goFirst: () => setPage(1),
    goPrev: () => setPage(currentPage - 1),
    goNext: () => setPage(currentPage + 1),
    goLast: () => setPage(pageCount),
  })
</script>

<nav
  bind:this={ref}
  aria-label={ariaLabel}
  data-uipkge
  data-slot="pagination"
  class={cn('flex items-center gap-1', className)}
  {...restProps}
>
  {@render children?.({ page: currentPage, pageCount })}
</nav>

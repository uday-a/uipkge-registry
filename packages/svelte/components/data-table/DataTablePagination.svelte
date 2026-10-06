<script lang="ts" module>
  import type { Table } from '@tanstack/table-core'

  export interface DataTablePaginationProps {
    table: Table<any>
    totalRows: number
    isServerSide: boolean
    borderless?: boolean
  }
</script>

<script lang="ts">
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select'

  let { table, totalRows, isServerSide, borderless = false }: DataTablePaginationProps = $props()

  const selected = $derived(table.getFilteredSelectedRowModel().rows.length)
  const total = $derived(isServerSide ? totalRows : table.getFilteredRowModel().rows.length)
</script>

<div
  class={[
    'flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between',
    borderless ? '' : 'border-t px-4',
  ].join(' ')}
>
  <div class="text-muted-foreground text-sm tabular-nums">
    <span class="text-foreground font-medium">{selected}</span> of {total} row(s) selected
  </div>
  <div class="flex flex-wrap items-center gap-4 sm:gap-6">
    <div class="flex items-center gap-2">
      <p class="text-sm font-medium whitespace-nowrap">Rows per page</p>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value))
          table.setPageIndex(0)
        }}
      >
        <SelectTrigger class="h-8 w-[4.5rem]">
          <SelectValue placeholder={`${table.getState().pagination.pageSize}`} />
        </SelectTrigger>
        <SelectContent side="top">
          {#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
            <SelectItem value={`${pageSize}`}>{pageSize}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
    </div>
    <div class="text-sm font-medium whitespace-nowrap tabular-nums">
      Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
    </div>
    <div class="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        class="hidden size-8 lg:flex"
        disabled={!table.getCanPreviousPage()}
        onclick={() => table.setPageIndex(0)}
      >
        <ChevronsLeft class="size-4" aria-hidden="true" />
        <span class="sr-only">First page</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="size-8"
        disabled={!table.getCanPreviousPage()}
        onclick={() => table.previousPage()}
      >
        <ChevronLeft class="size-4" aria-hidden="true" />
        <span class="sr-only">Previous page</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="size-8"
        disabled={!table.getCanNextPage()}
        onclick={() => table.nextPage()}
      >
        <ChevronRight class="size-4" aria-hidden="true" />
        <span class="sr-only">Next page</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="hidden size-8 lg:flex"
        disabled={!table.getCanNextPage()}
        onclick={() => table.setPageIndex(table.getPageCount() - 1)}
      >
        <ChevronsRight class="size-4" aria-hidden="true" />
        <span class="sr-only">Last page</span>
      </Button>
    </div>
  </div>
</div>

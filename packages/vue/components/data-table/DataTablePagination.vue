<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    table: Table<any>
    totalRows: number
    isServerSide: boolean
    borderless?: boolean
  }>(),
  { borderless: false },
)
</script>

<template>
  <div
    :class="[
      'flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between',
      borderless ? '' : 'border-t px-4',
    ]"
  >
    <div class="text-muted-foreground text-sm tabular-nums">
      <span class="text-foreground font-medium">{{ table.getFilteredSelectedRowModel().rows.length }}</span>
      of
      {{ isServerSide ? totalRows : table.getFilteredRowModel().rows.length }}
      row(s) selected
    </div>
    <div class="flex flex-wrap items-center gap-4 sm:gap-6">
      <div class="flex items-center gap-2">
        <p class="text-sm font-medium whitespace-nowrap">Rows per page</p>
        <Select
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="
            (value) => {
              table.setPageSize(Number(value))
              table.setPageIndex(0)
            }
          "
        >
          <SelectTrigger class="h-8 w-[4.5rem]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [10, 20, 30, 40, 50]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="text-sm font-medium whitespace-nowrap tabular-nums">
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ Math.max(table.getPageCount(), 1) }}
      </div>
      <div class="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          class="hidden size-8 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <ChevronsLeft class="size-4" aria-hidden="true" />
          <span class="sr-only">First page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <ChevronLeft class="size-4" aria-hidden="true" />
          <span class="sr-only">Previous page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <ChevronRight class="size-4" aria-hidden="true" />
          <span class="sr-only">Next page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="hidden size-8 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <ChevronsRight class="size-4" aria-hidden="true" />
          <span class="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  </div>
</template>

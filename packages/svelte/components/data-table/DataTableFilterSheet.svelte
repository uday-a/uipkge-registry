<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { Table } from '@tanstack/table-core'
  import type { DateRange } from '$lib/components/ui/range-calendar'
  import type { FilterDefinition } from './types'

  export interface DataTableFilterSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<any>
    filters: FilterDefinition[]
    activeFilterCount: number
    isAnyFilterActive: boolean
    isServerSide: boolean
    /** Strip section bgs / rings / dividers / SheetContent side border. */
    borderless?: boolean
    getMultiSelectValue: (column: string) => string[]
    getDateRangeValue: (column: string) => { from?: string; to?: string }
    formatDateRange: (column: string) => string
    getCalendarModel: (column: string) => DateRange | undefined
    onApply: () => void
    onClearAll: () => void
    onToggleMultiselect: (column: string, value: string) => void
    onClearFilter: (filter: FilterDefinition) => void
    onClearDateFilter: (filter: FilterDefinition) => void
    onCalendarUpdate: (column: string, value: DateRange | undefined) => void
    onTextFilterUpdate: (column: string, value: string | undefined) => void
    customFilters?: Snippet
  }
</script>

<script lang="ts">
  import { Check, SlidersHorizontal, X } from '@lucide/svelte'
  import { Input } from '$lib/components/ui/input'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Label } from '$lib/components/ui/label'
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '$lib/components/ui/sheet'
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from '$lib/components/ui/command'
  import DataTableRangeCalendar from './DataTableRangeCalendar.svelte'
  import { resolveOption } from './types'

  let {
    open,
    onOpenChange,
    table,
    filters,
    activeFilterCount,
    isAnyFilterActive,
    isServerSide,
    borderless = false,
    getMultiSelectValue,
    getDateRangeValue,
    formatDateRange,
    getCalendarModel,
    onApply,
    onClearAll,
    onToggleMultiselect,
    onClearFilter,
    onClearDateFilter,
    onCalendarUpdate,
    onTextFilterUpdate,
    customFilters,
  }: DataTableFilterSheetProps = $props()

  let filterScrollEl = $state<HTMLDivElement | null>(null)

  $effect(() => {
    if (open) {
      const t = setTimeout(() => {
        filterScrollEl?.scrollTo({ top: 0 })
      }, 50)
      return () => clearTimeout(t)
    }
  })

  const filteredRowCount = $derived(table.getFilteredRowModel().rows.length)
</script>

<Sheet {open} {onOpenChange}>
  <SheetContent class={['flex flex-col gap-0 p-0 sm:max-w-[400px]', borderless ? 'border-0' : ''].join(' ')}>
    <!-- Header -->
    <div class={borderless ? 'px-5 pt-5 pb-2' : 'border-b px-5 pt-5 pb-4'}>
      <div class="flex items-center gap-3">
        <div class="bg-muted flex size-9 items-center justify-center rounded-lg">
          <SlidersHorizontal class="text-muted-foreground size-4" />
        </div>
        <div class="flex-1">
          <SheetHeader class="space-y-0.5 p-0">
            <SheetTitle class="text-sm font-semibold">Filters</SheetTitle>
            <SheetDescription class="text-xs">
              {#if activeFilterCount > 0}
                {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}{#if !isServerSide}{' '}&middot;
                  {filteredRowCount} result{filteredRowCount !== 1 ? 's' : ''}{/if}
              {:else}
                Narrow down results
              {/if}
            </SheetDescription>
          </SheetHeader>
        </div>
      </div>
    </div>

    <!-- Scrollable filter sections -->
    <div bind:this={filterScrollEl} class="flex-1 overflow-y-auto">
      <div class="space-y-2 p-4">
        {#each filters as filter (filter.column)}
          {@const textValue = (table.getColumn(filter.column)?.getFilterValue() as string) ?? ''}
          {@const multi = getMultiSelectValue(filter.column)}
          {@const dr = getDateRangeValue(filter.column)}
          {@const hasDate = !!(dr.from || dr.to)}

          {#if filter.type === 'text'}
            <div class={borderless ? 'py-2' : 'bg-muted/40 rounded-lg p-3'}>
              <div class="mb-2 flex items-center justify-between">
                <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {filter.label}
                </Label>
                {#if textValue}
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    onclick={() => onTextFilterUpdate(filter.column, undefined)}
                  >
                    Clear
                  </button>
                {/if}
              </div>
              <Input
                placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                value={textValue}
                class="h-8 text-sm"
                onValueChange={(v) => onTextFilterUpdate(filter.column, v || undefined)}
              />
            </div>
          {:else if filter.type === 'multiselect' || filter.type === 'select'}
            <div
              class={borderless
                ? 'py-2 transition-colors'
                : [
                    'rounded-lg p-3 transition-colors',
                    multi.length > 0 ? 'bg-primary/[0.04] ring-primary/20 ring-1' : 'bg-muted/40',
                  ].join(' ')}
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {filter.label}
                  </Label>
                  {#if multi.length > 0}
                    <Badge
                      variant="secondary"
                      class="bg-primary/15 text-primary h-4 rounded-full px-1.5 text-xs font-semibold"
                    >
                      {multi.length}
                    </Badge>
                  {/if}
                </div>
                {#if multi.length > 0}
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    onclick={() => onClearFilter(filter)}
                  >
                    Clear
                  </button>
                {/if}
              </div>
              <Command
                class="[&_[data-slot=command-input-wrapper]]:border-input overflow-visible bg-transparent [&_[data-slot=command-input-wrapper]]:h-8 [&_[data-slot=command-input-wrapper]]:rounded-md [&_[data-slot=command-input-wrapper]]:border [&_[data-slot=command-input-wrapper]]:px-2.5"
              >
                <CommandInput class="h-7 text-sm" placeholder={`Search ${filter.label.toLowerCase()}...`} />
                <CommandList class="mt-1 max-h-[132px]">
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup class="p-0">
                    {#each filter.options ?? [] as rawOpt (resolveOption(rawOpt).value)}
                      {@const opt = resolveOption(rawOpt)}
                      {@const OptIcon = opt.icon}
                      <CommandItem
                        value={opt.label}
                        class="rounded-md px-2 py-1.5 text-sm"
                        onSelect={() => onToggleMultiselect(filter.column, opt.value)}
                      >
                        <div
                          class={[
                            'flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
                            multi.includes(opt.value)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/40 [&_svg]:invisible',
                          ].join(' ')}
                        >
                          <Check class="size-3" />
                        </div>
                        {#if OptIcon}<OptIcon class="text-muted-foreground size-4" />{/if}
                        <span>{opt.label}</span>
                      </CommandItem>
                    {/each}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          {:else if filter.type === 'date'}
            <div
              class={borderless
                ? 'py-2 transition-colors'
                : [
                    'rounded-lg p-3 transition-colors',
                    hasDate ? 'bg-primary/[0.04] ring-primary/20 ring-1' : 'bg-muted/40',
                  ].join(' ')}
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {filter.label}
                  </Label>
                  {#if hasDate}
                    <Badge
                      variant="secondary"
                      class="bg-primary/15 text-primary h-auto rounded-full px-1.5 py-0 text-xs font-medium"
                    >
                      {formatDateRange(filter.column)}
                    </Badge>
                  {/if}
                </div>
                {#if hasDate}
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    onclick={() => onClearDateFilter(filter)}
                  >
                    Clear
                  </button>
                {/if}
              </div>
              <div class={['flex justify-center overflow-hidden', borderless ? '' : 'rounded-md border'].join(' ')}>
                <DataTableRangeCalendar
                  value={getCalendarModel(filter.column)}
                  numberOfMonths={1}
                  class="p-2"
                  onValueChange={(range) => onCalendarUpdate(filter.column, range)}
                />
              </div>
            </div>
          {/if}
        {/each}

        <!-- Consumer-supplied custom filter UI -->
        {@render customFilters?.()}
      </div>
    </div>

    <!-- Footer -->
    <div class={['flex gap-2 px-4 py-3', borderless ? '' : 'border-t'].join(' ')}>
      <Button variant="outline" size="sm" class="flex-1" disabled={!isAnyFilterActive} onclick={onClearAll}>
        <X class="size-3.5" />
        Reset All
      </Button>
      <Button size="sm" class="flex-1" onclick={onApply}>
        {#if isServerSide}
          Apply Filters
        {:else}
          Show {filteredRowCount} result{filteredRowCount !== 1 ? 's' : ''}
        {/if}
      </Button>
    </div>
  </SheetContent>
</Sheet>

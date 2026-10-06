<!--
  Sortable / hideable header cell for TanStack DataTable columns. Use it from
  a column definition like:
    header: ({ column }) => renderComponent(DataTableColumnHeader, { column, label: 'Email' })

  Click on the label cycles sort asc → desc → none.

  Optional per-column filter:
    header: ({ column }) =>
      renderComponent(DataTableColumnHeader, {
        column,
        label: 'Status',
        filter: { column: 'status', label: 'Status', type: 'multiselect', options: [...] },
      })

  When `filter` is provided, a funnel icon renders next to the sort button.
  Click opens a popover with the right filter UI for the type (text / select
  / multiselect / date). The funnel shows a primary-coloured dot when the
  column has an active filter.
-->
<script lang="ts" module>
  import type { Column } from '@tanstack/table-core'

  interface FilterOption {
    value: string
    label: string
  }
  interface FilterDefinition {
    column: string
    label: string
    type: 'text' | 'select' | 'multiselect' | 'date'
    options?: (string | FilterOption)[]
  }

  export interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    label: string
    align?: 'left' | 'right' | 'center'
    filter?: FilterDefinition
    class?: string
  }

  function resolveOption(opt: string | FilterOption): FilterOption {
    return typeof opt === 'string' ? { value: opt, label: opt } : opt
  }
</script>

<script lang="ts" generics="TData, TValue">
  import { untrack } from 'svelte'
  import { ArrowUp, ArrowUpDown, Check, Filter, FilterX } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'
  import type { DateRange } from '$lib/components/ui/range-calendar'
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from '$lib/components/ui/command'
  import DataTableRangeCalendar from './DataTableRangeCalendar.svelte'
  import { dateToIso, isoRangeToCalendar } from './date-utils'

  let { column, label, align = 'left', filter, class: className }: DataTableColumnHeaderProps<TData, TValue> = $props()

  let open = $state(false)

  function next() {
    const current = column.getIsSorted()
    if (!current) column.toggleSorting(false)
    else if (current === 'asc') column.toggleSorting(true)
    else column.clearSorting()
  }

  const filterValue = $derived(column.getFilterValue())

  const isFilterActive = $derived.by(() => {
    const v = filterValue
    if (v === undefined || v === null || v === '') return false
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.keys(v).length > 0
    return true
  })

  // Text-input bound separately so we can apply on blur / Enter rather than
  // thrashing the column filter on every keystroke.
  let textDraft = $state('')
  $effect(() => {
    if (open && filter?.type === 'text') {
      textDraft = untrack(() => (filterValue as string) ?? '')
    }
  })

  function applyText() {
    column.setFilterValue(textDraft || undefined)
  }

  function clearText() {
    textDraft = ''
    column.setFilterValue(undefined)
  }

  function toggleMultiselect(value: string) {
    const current = (filterValue as string[]) ?? []
    const nextVal = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    column.setFilterValue(nextVal.length > 0 ? nextVal : undefined)
  }

  function selectOne(value: string) {
    column.setFilterValue(value || undefined)
    open = false
  }

  function clearFilter() {
    column.setFilterValue(undefined)
    textDraft = ''
  }

  // Date-range bridging. The column stores ISO strings; the calendar wants
  // native Date instances. Reads/writes both shapes.
  const dateModel = $derived(isoRangeToCalendar(filterValue as { from?: string; to?: string } | undefined))

  function onDateSelect(range: DateRange | undefined) {
    const isoFrom = range?.start ? dateToIso(range.start) : undefined
    const isoTo = range?.end ? dateToIso(range.end) : undefined
    if (!isoFrom && !isoTo) {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue({ from: isoFrom, to: isoTo })
    }
  }

  function selectedLabels(): string[] {
    if (!filter?.options) return []
    const selected = (filterValue as string[]) ?? []
    return filter.options
      .map(resolveOption)
      .filter((o) => selected.includes(o.value))
      .map((o) => o.label)
  }
</script>

<div
  class={cn(
    'flex items-center gap-0.5',
    align === 'right' && 'justify-end',
    align === 'center' && 'justify-center',
    className,
  )}
>
  {#if column.getCanSort()}
    <button
      type="button"
      class="group text-muted-foreground hover:text-foreground hover:bg-muted/60 -mx-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm font-medium transition-colors duration-150"
      aria-label={`Sort by ${label}`}
      onclick={next}
    >
      <span>{label}</span>
      {#if column.getIsSorted()}
        <ArrowUp
          class={cn(
            'text-foreground size-3.5 transition-transform duration-200 ease-in-out',
            column.getIsSorted() === 'desc' ? 'rotate-180' : 'rotate-0',
          )}
        />
      {:else}
        <ArrowUpDown class="size-3.5 opacity-40 transition-opacity duration-150 group-hover:opacity-70" />
      {/if}
    </button>
  {:else}
    <span class="text-muted-foreground text-sm font-medium">{label}</span>
  {/if}

  <!-- Optional per-column header filter -->
  {#if filter}
    <Popover bind:open>
      <PopoverTrigger>
        {#snippet child({ props })}
          <button
            {...props}
            type="button"
            class={cn(
              'text-muted-foreground relative inline-flex size-6 items-center justify-center rounded transition-colors',
              'hover:text-foreground hover:bg-muted/60',
              isFilterActive && 'text-foreground',
            )}
            aria-label={`Filter ${label}`}
          >
            <Filter class="size-3.5" />
            {#if isFilterActive}
              <span aria-hidden="true" class="bg-primary absolute -top-0.5 -right-0.5 size-1.5 rounded-full"></span>
            {/if}
          </button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent class="w-72 p-0" align="start">
        <div class="border-border flex items-center justify-between border-b px-3 py-2 text-xs font-medium">
          <span>Filter · {filter.label}</span>
          {#if isFilterActive}
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              onclick={clearFilter}
            >
              <FilterX class="size-3" />
              Clear
            </button>
          {/if}
        </div>

        <!-- TEXT -->
        {#if filter.type === 'text'}
          <div class="space-y-2 p-3">
            <Input
              value={textDraft}
              placeholder={`Search ${filter.label.toLowerCase()}…`}
              class="h-8"
              onValueChange={(v) => (textDraft = v)}
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  applyText()
                  open = false
                }
              }}
              onfocusout={applyText}
            />
            <div class="flex gap-2">
              <Button
                size="sm"
                class="h-8 flex-1"
                onclick={() => {
                  applyText()
                  open = false
                }}
              >
                Apply
              </Button>
              <Button size="sm" variant="outline" class="h-8" onclick={clearText}>Clear</Button>
            </div>
          </div>
        {/if}

        <!-- SELECT / MULTISELECT -->
        {#if filter.type === 'select' || filter.type === 'multiselect'}
          <Command class="max-h-[280px]">
            <CommandInput placeholder={`Search ${filter.label.toLowerCase()}…`} class="h-8" />
            <CommandList>
              <CommandEmpty>No matches.</CommandEmpty>
              <CommandGroup>
                {#each filter.options ?? [] as opt (resolveOption(opt).value)}
                  {@const o = resolveOption(opt)}
                  <CommandItem
                    value={o.value}
                    onSelect={() => (filter.type === 'multiselect' ? toggleMultiselect(o.value) : selectOne(o.value))}
                  >
                    {#if filter.type === 'multiselect'}
                      <div
                        class={cn(
                          'border-primary/50 mr-2 flex size-4 items-center justify-center rounded-sm border transition-colors',
                          ((filterValue as string[]) ?? []).includes(o.value)
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50',
                        )}
                      >
                        <Check class="size-3" />
                      </div>
                    {:else}
                      <Check class={cn('mr-2 size-4', filterValue === o.value ? 'opacity-100' : 'opacity-0')} />
                    {/if}
                    <span>{o.label}</span>
                  </CommandItem>
                {/each}
              </CommandGroup>
            </CommandList>
          </Command>
        {/if}

        <!-- DATE RANGE -->
        {#if filter.type === 'date'}
          <div class="p-2">
            <DataTableRangeCalendar value={dateModel} onValueChange={onDateSelect} />
            <div class="flex gap-2 px-1 pt-2">
              <Button size="sm" class="h-8 flex-1" onclick={() => (open = false)}>Apply</Button>
              <Button size="sm" variant="outline" class="h-8" onclick={clearFilter}>Clear</Button>
            </div>
          </div>
        {/if}

        <!-- Active selection summary -->
        {#if isFilterActive && (filter.type === 'multiselect' || filter.type === 'select')}
          <div class="border-border text-muted-foreground border-t px-3 py-2 text-xs">
            {#if filter.type === 'multiselect'}
              <span>
                {selectedLabels().length} selected:
                <span class="text-foreground">{selectedLabels().join(', ')}</span>
              </span>
            {:else}
              <span>
                <span class="text-foreground">{filterValue as string}</span>
              </span>
            {/if}
          </div>
        {/if}
      </PopoverContent>
    </Popover>
  {/if}
</div>

<!--
  Popover variant of DataTableFilterSheet. Same filter UI (text /
  multiselect / date) packed into a Popover instead of a side Sheet.
  Slot in via `filterMode="popover"` on <DataTable>.

  Trigger button is rendered inline by the toolbar; this component owns
  the popover surface and content.

  ── Draft semantics ──────────────────────────────────────────────────
  Unlike the Sheet (which mutates live TanStack column filters and rolls
  back on cancel via a parent snapshot), this popover stages every edit
  inside a local `draft` map. Real `columnFilters` are never touched
  until the user clicks Apply -- at which point we call `onCommitDraft`
  with the full draft and the parent walks the entries calling
  `setFilterValue` per column. Closing the popover (Escape / click out)
  simply discards the draft.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { Table } from '@tanstack/table-core'
  import type { DateRange } from '$lib/components/ui/range-calendar'
  import type { FilterDefinition } from './types'

  type DraftDateValue = { from?: string; to?: string }
  type DraftValue = string[] | string | DraftDateValue | undefined
  type Draft = Record<string, DraftValue>

  export interface DataTableFilterPopoverProps {
    table: Table<any>
    filters: FilterDefinition[]
    activeFilterCount: number
    isAnyFilterActive: boolean
    isServerSide: boolean
    getMultiSelectValue: (column: string) => string[]
    getDateRangeValue: (column: string) => { from?: string; to?: string }
    formatDateRange: (column: string) => string
    getCalendarModel: (column: string) => DateRange | undefined
    // Committed draft on Apply -- a `Record<columnId, value>` where each
    // value is the final shape TanStack's `setFilterValue` expects.
    onCommitDraft: (draft: Draft) => void
    onClearAll: () => void
    customFilters?: Snippet
  }
</script>

<script lang="ts">
  import { Check, SlidersHorizontal, X } from '@lucide/svelte'
  import { Input } from '$lib/components/ui/input'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Label } from '$lib/components/ui/label'
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'
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
  import { dateToIso, isoRangeToCalendar } from './date-utils'

  let {
    table,
    filters,
    activeFilterCount,
    isServerSide,
    getMultiSelectValue,
    getDateRangeValue,
    onCommitDraft,
    customFilters,
  }: DataTableFilterPopoverProps = $props()

  let open = $state(false)
  let draft = $state<Draft>({})
  let filterScrollEl = $state<HTMLDivElement | null>(null)

  function seedDraft(): Draft {
    const next: Draft = {}
    for (const f of filters) {
      if (f.type === 'multiselect' || f.type === 'select') {
        next[f.column] = [...getMultiSelectValue(f.column)]
      } else if (f.type === 'date') {
        const dr = getDateRangeValue(f.column)
        next[f.column] = { from: dr.from, to: dr.to }
      } else if (f.type === 'text') {
        const v = table.getColumn(f.column)?.getFilterValue() as string | undefined
        next[f.column] = v ?? ''
      }
    }
    return next
  }

  function getDraftMulti(column: string): string[] {
    const v = draft[column]
    return Array.isArray(v) ? v : []
  }

  function getDraftText(column: string): string {
    const v = draft[column]
    return typeof v === 'string' ? v : ''
  }

  function getDraftDate(column: string): DraftDateValue {
    const v = draft[column]
    if (v && typeof v === 'object' && !Array.isArray(v)) return v as DraftDateValue
    return {}
  }

  function toggleDraftMulti(column: string, option: string) {
    const current = getDraftMulti(column)
    const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option]
    draft = { ...draft, [column]: next }
  }

  function setDraftText(column: string, value: string) {
    draft = { ...draft, [column]: value }
  }

  function clearDraftSection(filter: FilterDefinition) {
    if (filter.type === 'multiselect' || filter.type === 'select') {
      draft = { ...draft, [filter.column]: [] }
    } else if (filter.type === 'date') {
      draft = { ...draft, [filter.column]: {} }
    } else if (filter.type === 'text') {
      draft = { ...draft, [filter.column]: '' }
    }
  }

  function resetDraft() {
    const next: Draft = {}
    for (const f of filters) {
      if (f.type === 'multiselect' || f.type === 'select') next[f.column] = []
      else if (f.type === 'date') next[f.column] = {}
      else if (f.type === 'text') next[f.column] = ''
    }
    draft = next
  }

  // ── Date helpers (local; popover is fully self-contained for draft) ──
  function getDraftCalendarModel(column: string): DateRange | undefined {
    return isoRangeToCalendar(getDraftDate(column))
  }

  function onDraftCalendarUpdate(column: string, val: DateRange | undefined) {
    const from = val?.start ? dateToIso(val.start) : undefined
    const to = val?.end ? dateToIso(val.end) : undefined
    draft = { ...draft, [column]: { from, to } }
  }

  function formatDraftDateRange(column: string): string {
    const dr = getDraftDate(column)
    if (dr.from && dr.to) return `${dr.from} - ${dr.to}`
    if (dr.from) return `From ${dr.from}`
    if (dr.to) return `Until ${dr.to}`
    return ''
  }

  function isDraftSectionActive(filter: FilterDefinition): boolean {
    if (filter.type === 'multiselect' || filter.type === 'select') {
      return getDraftMulti(filter.column).length > 0
    }
    if (filter.type === 'date') {
      const dr = getDraftDate(filter.column)
      return !!(dr.from || dr.to)
    }
    if (filter.type === 'text') {
      return !!getDraftText(filter.column)
    }
    return false
  }

  // `Reset` is disabled when the draft has nothing to clear.
  const isDraftDirty = $derived(filters.some(isDraftSectionActive))

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      draft = seedDraft()
      open = true
      setTimeout(() => filterScrollEl?.scrollTo({ top: 0 }), 50)
    } else {
      // Close-without-apply: nothing to commit. Real column filters were never
      // mutated by the popover; the draft is local and discarded.
      draft = {}
      open = false
    }
  }

  function applyAndClose() {
    const snapshot: Draft = {}
    for (const f of filters) {
      const v = draft[f.column]
      if (f.type === 'multiselect' || f.type === 'select') {
        const arr = Array.isArray(v) ? v : []
        snapshot[f.column] = arr.length > 0 ? arr : undefined
      } else if (f.type === 'date') {
        const dr = v && typeof v === 'object' && !Array.isArray(v) ? (v as DraftDateValue) : {}
        snapshot[f.column] = dr.from || dr.to ? { from: dr.from, to: dr.to } : undefined
      } else if (f.type === 'text') {
        const s = typeof v === 'string' ? v : ''
        snapshot[f.column] = s || undefined
      }
    }
    onCommitDraft(snapshot)
    open = false
  }

  const filteredRowCount = $derived(table.getFilteredRowModel().rows.length)
</script>

<Popover {open} onOpenChange={handleOpenChange}>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        size="sm"
        class={[
          'h-8 gap-2',
          activeFilterCount > 0 ? 'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10' : '',
        ].join(' ')}
      >
        <SlidersHorizontal class="size-4" />
        Filters
        {#if activeFilterCount > 0}
          <Badge class="bg-primary text-primary-foreground ml-0.5 size-5 rounded-full p-0 text-xs font-semibold">
            {activeFilterCount}
          </Badge>
        {/if}
      </Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent align="start" class="flex max-h-[min(560px,80vh)] w-[380px] flex-col overflow-hidden p-0">
    <!-- Header -->
    <div class="border-b px-4 pt-3.5 pb-3">
      <div class="flex items-center gap-2.5">
        <div class="bg-muted flex size-7 items-center justify-center rounded-md">
          <SlidersHorizontal class="text-muted-foreground size-3.5" />
        </div>
        <div class="flex-1">
          <p class="text-sm leading-none font-semibold">Filters</p>
          <p class="text-muted-foreground mt-1 text-xs">
            {#if activeFilterCount > 0}
              {activeFilterCount} active{#if !isServerSide}{' '}&middot; {filteredRowCount} result{filteredRowCount !== 1
                  ? 's'
                  : ''}{/if}
            {:else}
              Narrow down results
            {/if}
          </p>
        </div>
      </div>
    </div>

    <!-- Scrollable filter sections -->
    <div bind:this={filterScrollEl} class="flex-1 overflow-y-auto">
      <div class="space-y-2 p-3">
        {#each filters as filter (filter.column)}
          {#if filter.type === 'text'}
            <div class="bg-muted/40 rounded-lg p-2.5">
              <div class="mb-2 flex items-center justify-between">
                <Label class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {filter.label}
                </Label>
                {#if getDraftText(filter.column)}
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    onclick={() => clearDraftSection(filter)}
                  >
                    Clear
                  </button>
                {/if}
              </div>
              <Input
                placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                value={getDraftText(filter.column)}
                class="h-8 text-sm"
                onValueChange={(v) => setDraftText(filter.column, v ?? '')}
              />
            </div>
          {:else if filter.type === 'multiselect' || filter.type === 'select'}
            {@const multi = getDraftMulti(filter.column)}
            <div
              class={[
                'rounded-lg p-2.5 transition-colors',
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
                    onclick={() => clearDraftSection(filter)}
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
                        onSelect={() => toggleDraftMulti(filter.column, opt.value)}
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
            {@const dr = getDraftDate(filter.column)}
            {@const hasDate = !!(dr.from || dr.to)}
            <div
              class={[
                'rounded-lg p-2.5 transition-colors',
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
                      {formatDraftDateRange(filter.column)}
                    </Badge>
                  {/if}
                </div>
                {#if hasDate}
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    onclick={() => clearDraftSection(filter)}
                  >
                    Clear
                  </button>
                {/if}
              </div>
              <div class="flex justify-center overflow-hidden rounded-md border">
                <DataTableRangeCalendar
                  value={getDraftCalendarModel(filter.column)}
                  numberOfMonths={1}
                  class="p-2"
                  onValueChange={(range) => onDraftCalendarUpdate(filter.column, range)}
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
    <div class="flex gap-2 border-t px-3 py-2.5">
      <Button variant="outline" size="sm" class="h-8 flex-1" disabled={!isDraftDirty} onclick={resetDraft}>
        <X class="size-3.5" />
        Reset
      </Button>
      <Button size="sm" class="h-8 flex-1" onclick={applyAndClose}>Apply</Button>
    </div>
  </PopoverContent>
</Popover>

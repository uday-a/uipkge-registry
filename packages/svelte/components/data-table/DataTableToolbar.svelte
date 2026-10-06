<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { Table } from '@tanstack/table-core'
  import type { DateRange } from '$lib/components/ui/range-calendar'
  import type { FilterDefinition } from './types'

  export interface DataTableToolbarProps {
    table: Table<any>
    filterColumn: string
    filterPlaceholder: string
    filters: FilterDefinition[]
    filterMode: 'inline' | 'modal' | 'popover'
    enableSearch?: boolean
    enableColumnVisibility?: boolean
    enableExport?: boolean
    enableDensityToggle?: boolean
    density?: 'compact' | 'cozy' | 'comfortable'
    borderless?: boolean
    activeFilterCount: number
    isAnyFilterActive: boolean
    isServerSide: boolean
    getMultiSelectValue: (column: string) => string[]
    getDateRangeValue: (column: string) => { from?: string; to?: string }
    getFilterSelectedLabels: (filter: FilterDefinition) => string[]
    formatDateRange: (column: string) => string
    getCalendarModel: (column: string) => DateRange | undefined
    onSearch: (value: string) => void
    onOpenFilterSheet: () => void
    onApplyFilters: () => void
    onClearAllFilters: () => void
    onToggleMultiselect: (column: string, value: string) => void
    onClearFilter: (filter: FilterDefinition) => void
    onClearDateFilter: (filter: FilterDefinition) => void
    onCalendarUpdate: (column: string, value: DateRange | undefined) => void
    onTextFilterUpdate: (column: string, value: string | undefined) => void
    onCommitFilters: (draft: Record<string, any>) => void
    onExportCsv: () => void
    onExportJson: () => void
    onCopyTsv?: () => void
    onCopyMarkdown?: () => void
    onDensityChange: (value: 'compact' | 'cozy' | 'comfortable') => void
    toolbarExtra?: Snippet
    customFilters?: Snippet
  }
</script>

<script lang="ts">
  import {
    CalendarIcon,
    Check,
    ChevronDown,
    Columns3,
    Download,
    Plus,
    Rows3,
    Search,
    SlidersHorizontal,
    X,
  } from '@lucide/svelte'
  import { Input } from '$lib/components/ui/input'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Separator } from '$lib/components/ui/separator'
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu'
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
  } from '$lib/components/ui/command'
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'
  import DataTableRangeCalendar from './DataTableRangeCalendar.svelte'
  import DataTableFilterPopover from './DataTableFilterPopover.svelte'
  import { resolveOption } from './types'

  let {
    table,
    filterColumn,
    filterPlaceholder,
    filters,
    filterMode,
    enableSearch = true,
    enableColumnVisibility = true,
    enableExport = false,
    enableDensityToggle = false,
    density = 'cozy',
    borderless = false,
    activeFilterCount,
    isAnyFilterActive,
    isServerSide,
    getMultiSelectValue,
    getDateRangeValue,
    getFilterSelectedLabels,
    formatDateRange,
    getCalendarModel,
    onSearch,
    onOpenFilterSheet,
    onClearAllFilters,
    onToggleMultiselect,
    onClearFilter,
    onClearDateFilter,
    onCalendarUpdate,
    onTextFilterUpdate,
    onCommitFilters,
    onExportCsv,
    onExportJson,
    onCopyTsv,
    onCopyMarkdown,
    onDensityChange,
    toolbarExtra,
    customFilters,
  }: DataTableToolbarProps = $props()
</script>

<div class={['flex flex-col gap-2 py-3', borderless ? '' : 'border-b px-4'].join(' ')}>
  <!-- flex-wrap so faceted chips reflow instead of overflowing on narrow tables -->
  <div class="flex flex-wrap items-center gap-2">
    <!-- Search only renders when filterColumn maps to an actual column. -->
    {#if enableSearch && filterColumn && table.getColumn(filterColumn)}
      <div class="relative w-full max-w-xs min-w-[12rem] flex-1 sm:flex-none">
        <Search
          class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          class="h-8 pl-8"
          placeholder={filterPlaceholder}
          aria-label={filterPlaceholder || 'Search table'}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
          onValueChange={(v) => onSearch(v)}
        />
      </div>
    {/if}

    <!-- ── INLINE filter mode ── -->
    {#if filterMode === 'inline'}
      {#each filters as filter (filter.column)}
        {#if filter.type === 'multiselect' || filter.type === 'select'}
          {@const multi = getMultiSelectValue(filter.column)}
          <Popover>
            <PopoverTrigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  size="sm"
                  class={[
                    'h-8 border-dashed',
                    multi.length > 0 ? 'border-primary/40 bg-primary/5 border-solid' : '',
                  ].join(' ')}
                >
                  <Plus class="size-4" aria-hidden="true" />
                  {filter.label}
                  {#if multi.length > 0}
                    <Separator orientation="vertical" class="mx-1 h-4" />
                    <div class="flex gap-1">
                      {#if multi.length > 2}
                        <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                          {multi.length} selected
                        </Badge>
                      {:else}
                        {#each getFilterSelectedLabels(filter) as label (label)}
                          <Badge variant="secondary" class="rounded-sm px-1 font-normal">{label}</Badge>
                        {/each}
                      {/if}
                    </div>
                  {/if}
                </Button>
              {/snippet}
            </PopoverTrigger>
            <PopoverContent class="w-52 p-0" align="start">
              <Command>
                <CommandInput placeholder={`Search ${filter.label.toLowerCase()}...`} />
                <CommandList>
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup>
                    {#each filter.options ?? [] as rawOpt (resolveOption(rawOpt).value)}
                      {@const opt = resolveOption(rawOpt)}
                      {@const OptIcon = opt.icon}
                      <CommandItem value={opt.label} onSelect={() => onToggleMultiselect(filter.column, opt.value)}>
                        <div
                          class={[
                            'border-primary flex size-4 shrink-0 items-center justify-center rounded-sm border',
                            multi.includes(opt.value)
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          ].join(' ')}
                        >
                          <Check class="size-3" />
                        </div>
                        {#if OptIcon}<OptIcon class="text-muted-foreground size-4" />{/if}
                        <span>{opt.label}</span>
                      </CommandItem>
                    {/each}
                  </CommandGroup>
                  {#if multi.length > 0}
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        value="__clear__"
                        class="justify-center text-center"
                        onSelect={() => onClearFilter(filter)}
                      >
                        Clear filter
                      </CommandItem>
                    </CommandGroup>
                  {/if}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        {:else if filter.type === 'date'}
          {@const dr = getDateRangeValue(filter.column)}
          {@const hasDate = !!(dr.from || dr.to)}
          <Popover>
            <PopoverTrigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  size="sm"
                  class={['h-8 border-dashed', hasDate ? 'border-primary/40 bg-primary/5 border-solid' : ''].join(' ')}
                >
                  <CalendarIcon class="size-4" aria-hidden="true" />
                  {filter.label}
                  {#if hasDate}
                    <Separator orientation="vertical" class="mx-1 h-4" />
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                      {formatDateRange(filter.column)}
                    </Badge>
                  {/if}
                </Button>
              {/snippet}
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0" align="start">
              <DataTableRangeCalendar
                value={getCalendarModel(filter.column)}
                numberOfMonths={2}
                onValueChange={(range) => onCalendarUpdate(filter.column, range)}
              />
              {#if hasDate}
                <div class="border-t p-2">
                  <Button variant="ghost" size="sm" class="h-7 w-full text-xs" onclick={() => onClearDateFilter(filter)}>
                    Clear dates
                  </Button>
                </div>
              {/if}
            </PopoverContent>
          </Popover>
        {:else if filter.type === 'text'}
          {@const textValue = table.getColumn(filter.column)?.getFilterValue() as string | undefined}
          <Popover>
            <PopoverTrigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  size="sm"
                  class={['h-8 border-dashed', textValue ? 'border-primary/40 bg-primary/5 border-solid' : ''].join(
                    ' ',
                  )}
                >
                  <Plus class="size-4" aria-hidden="true" />
                  {filter.label}
                  {#if textValue}
                    <Separator orientation="vertical" class="mx-1 h-4" />
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal">{textValue}</Badge>
                  {/if}
                </Button>
              {/snippet}
            </PopoverTrigger>
            <PopoverContent class="w-60 p-3" align="start">
              <div class="space-y-2">
                <p class="text-sm font-medium">{filter.label}</p>
                <Input
                  placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                  value={(table.getColumn(filter.column)?.getFilterValue() as string) ?? ''}
                  class="h-8 text-sm"
                  onValueChange={(v) => onTextFilterUpdate(filter.column, v || undefined)}
                />
              </div>
            </PopoverContent>
          </Popover>
        {/if}
      {/each}
    {/if}

    <!-- ── MODAL filter mode (Sheet from the right) ── -->
    {#if filterMode === 'modal'}
      <Button
        variant="outline"
        size="sm"
        class={[
          'h-8',
          activeFilterCount > 0 ? 'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10' : '',
        ].join(' ')}
        onclick={onOpenFilterSheet}
      >
        <SlidersHorizontal class="size-4" aria-hidden="true" />
        Filters
        {#if activeFilterCount > 0}
          <Badge class="bg-primary text-primary-foreground ml-0.5 size-5 rounded-full p-0 text-xs font-semibold">
            {activeFilterCount}
          </Badge>
        {/if}
      </Button>
    {/if}

    <!-- ── POPOVER filter mode ── -->
    {#if filterMode === 'popover' && filters.length > 0}
      <DataTableFilterPopover
        {table}
        {filters}
        {activeFilterCount}
        {isAnyFilterActive}
        {isServerSide}
        {getMultiSelectValue}
        {getDateRangeValue}
        {formatDateRange}
        {getCalendarModel}
        onCommitDraft={(d) => onCommitFilters(d)}
        onClearAll={onClearAllFilters}
        {customFilters}
      />
    {/if}

    <!-- Inline custom filters (when filterMode === 'inline') -->
    {#if filterMode === 'inline'}
      {@render customFilters?.()}
    {/if}

    <!-- Toolbar extras (e.g. group-by selector, density toggle) -->
    {@render toolbarExtra?.()}

    <!-- Reset button -->
    {#if isAnyFilterActive}
      <Button variant="ghost" size="sm" class="h-8 px-2" onclick={onClearAllFilters}>
        Reset
        <X class="size-4" aria-hidden="true" />
      </Button>
    {/if}

    <!-- Right cluster: export / density / columns -->
    {#if enableExport || enableDensityToggle || enableColumnVisibility}
      <div class="ml-auto flex items-center gap-2">
        {#if enableExport}
          <DropdownMenu>
            <DropdownMenuTrigger>
              {#snippet child({ props })}
                <Button {...props} variant="outline" size="sm" class="h-8">
                  <Download class="size-4" />
                  Export
                  <ChevronDown class="size-4 opacity-60" />
                </Button>
              {/snippet}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onExportCsv}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onSelect={onExportJson}>Export as JSON</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onCopyTsv?.()}>Copy as TSV (Excel / Sheets)</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onCopyMarkdown?.()}>Copy as Markdown</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        {/if}

        {#if enableDensityToggle}
          <DropdownMenu>
            <DropdownMenuTrigger>
              {#snippet child({ props })}
                <Button {...props} variant="outline" size="sm" class="h-8" aria-label={`Row density: ${density}`}>
                  <Rows3 class="size-4" aria-hidden="true" />
                  <span class="capitalize">{density}</span>
                </Button>
              {/snippet}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={density}
                onValueChange={(v) => onDensityChange(v as 'compact' | 'cozy' | 'comfortable')}
              >
                <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="cozy">Cozy</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        {/if}

        {#if enableColumnVisibility}
          <DropdownMenu>
            <DropdownMenuTrigger>
              {#snippet child({ props })}
                <Button {...props} variant="outline" size="sm" class="h-8">
                  <Columns3 class="size-4" aria-hidden="true" />
                  View
                </Button>
              {/snippet}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-44">
              {#each table.getAllColumns().filter((column) => column.getCanHide()) as column (column.id)}
                <DropdownMenuCheckboxItem
                  class="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              {/each}
            </DropdownMenuContent>
          </DropdownMenu>
        {/if}
      </div>
    {/if}
  </div>
</div>

<script lang="ts" module>
  import type { CascadeOption } from './types'

  export interface CascadeSelectProps {
    /** Selected value path (one entry per level). Two-way bindable (`bind:value`). */
    value?: string[] | null
    options: CascadeOption[]
    placeholder?: string
    searchable?: boolean
    clearable?: boolean
    disabled?: boolean
    loading?: boolean
    size?: 'sm' | 'default' | 'lg'
    separator?: string
    searchPlaceholder?: string
    emptyText?: string
    class?: string
    onchange?: (value: string[] | null, path: CascadeOption[]) => void
    onclear?: () => void
    /** The trigger button, via `bind:ref`. */
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { Check, ChevronDown, ChevronRight, Loader2, Search, X } from '@lucide/svelte'
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'
  import { cn } from '$lib/utils'

  let {
    value = $bindable<string[] | null | undefined>(undefined),
    options,
    placeholder = 'Select...',
    searchable = true,
    clearable = true,
    disabled = false,
    loading = false,
    size = 'default',
    separator = ' / ',
    searchPlaceholder = 'Search...',
    emptyText = 'No options.',
    class: className,
    onchange,
    onclear,
    ref = $bindable(null),
  }: CascadeSelectProps = $props()

  let isOpen = $state(false)
  let activePath = $state<number[]>([])
  let search = $state('')

  // Sync active path with value when opened
  let prevOpen = false
  $effect(() => {
    if (isOpen !== prevOpen) {
      prevOpen = isOpen
      if (isOpen) {
        activePath = value?.length ? findPathIndices(options, value) : []
      } else {
        search = ''
      }
    }
  })

  function findPathIndices(opts: CascadeOption[], values: string[]): number[] {
    const indices: number[] = []
    let current = opts
    for (const val of values) {
      const idx = current.findIndex((o) => o.value === val)
      if (idx === -1) return indices
      indices.push(idx)
      const next = current[idx]?.children
      if (!next?.length) break
      current = next
    }
    return indices
  }

  function getOptionsAtLevel(level: number): CascadeOption[] {
    let current = options
    for (let i = 0; i < level; i++) {
      const idx = activePath[i]
      if (idx == null || !current[idx]?.children?.length) return []
      current = current[idx].children!
    }
    return current
  }

  function selectAtLevel(level: number, index: number) {
    const option = getOptionsAtLevel(level)[index]
    if (option?.disabled) return
    const next = [...activePath]
    next[level] = index
    next.splice(level + 1)
    activePath = next

    // If leaf node, emit the value
    if (!option?.children?.length) {
      const path = buildPathFromIndices(next)
      const values = path.map((p) => p.value)
      value = values
      onchange?.(values, path)
      isOpen = false
    }
  }

  function buildPathFromIndices(indices: number[]): CascadeOption[] {
    const path: CascadeOption[] = []
    let current = options
    for (const idx of indices) {
      if (idx == null || !current[idx]) break
      const opt = current[idx]
      path.push(opt)
      if (!opt.children?.length) break
      current = opt.children
    }
    return path
  }

  const selectedPath = $derived.by((): CascadeOption[] => {
    if (!value?.length) return []
    return buildPathFromIndices(findPathIndices(options, value))
  })

  const displayLabel = $derived(
    selectedPath.length === 0 ? placeholder : selectedPath.map((p) => p.label).join(separator),
  )

  const hasValue = $derived(selectedPath.length > 0)

  function clearAll(event?: Event) {
    event?.stopPropagation()
    if (disabled) return
    onclear?.()
    value = null
    onchange?.(null, [])
    activePath = []
  }

  function onTriggerKeydown(e: KeyboardEvent) {
    // Escape clears the value when the popover is closed (open Escape is
    // handled by Popover). Replaces the old nested clear button for keyboard.
    if (e.key === 'Escape' && !isOpen && clearable && hasValue && !disabled) {
      e.preventDefault()
      clearAll()
    }
  }

  // Search: flatten the tree and match
  const searchResults = $derived.by(() => {
    const q = search.trim().toLowerCase()
    if (!q) return null
    const results: { path: CascadeOption[]; values: string[] }[] = []
    const walk = (opts: CascadeOption[], path: CascadeOption[], values: string[]) => {
      for (const opt of opts) {
        const newPath = [...path, opt]
        const newValues = [...values, opt.value]
        if (opt.label.toLowerCase().includes(q) && !opt.children?.length) {
          results.push({ path: newPath, values: newValues })
        }
        if (opt.children?.length) {
          walk(opt.children, newPath, newValues)
        }
      }
    }
    walk(options, [], [])
    return results
  })

  function selectSearchResult(result: { path: CascadeOption[]; values: string[] }) {
    value = result.values
    onchange?.(result.values, result.path)
    isOpen = false
    search = ''
  }

  const sizeClasses = {
    sm: 'h-8 text-xs px-2.5',
    default: 'h-9 text-sm px-3',
    lg: 'h-11 text-base px-4',
  }

  const triggerClasses = $derived(
    cn(
      'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size],
      className,
    ),
  )

  const levels = $derived.by(() => {
    const result: { options: CascadeOption[]; level: number }[] = [{ options, level: 0 }]
    for (let i = 0; i < activePath.length; i++) {
      const idx = activePath[i]
      const current = result[i]?.options
      if (idx == null || !current?.[idx]?.children?.length) break
      result.push({ options: current[idx].children!, level: i + 1 })
    }
    return result
  })

  // Match the panel width to the trigger. The Svelte popover port has no
  // `--reka-popover-trigger-width` var, so measure the trigger directly.
  let triggerWidth = $state<number | null>(null)
  $effect(() => {
    const el = ref
    if (!el) return
    const update = () => {
      triggerWidth = el.offsetWidth
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  })
</script>

<Popover bind:open={isOpen}>
  <PopoverTrigger>
    {#snippet child({ props }: { props: Record<string, unknown> })}
      <button
        {...props}
        bind:this={ref}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled || loading}
        data-uipkge
        data-slot="cascade-select"
        class={triggerClasses}
        onkeydown={onTriggerKeydown}
      >
        <span class={cn('flex-1 truncate text-left', hasValue ? 'text-foreground' : 'text-muted-foreground')}>
          {displayLabel}
        </span>
        <span class="flex shrink-0 items-center gap-1">
          {#if loading}
            <Loader2 class="text-muted-foreground size-4 animate-spin" />
          {:else if clearable && hasValue && !disabled}
            <!-- Decorative clear affordance (not a nested button). Nested
                 interactive content inside the combobox button is invalid HTML
                 and confuses assistive tech. Click clears; Escape also clears
                 when the popover is closed (see onkeydown on the trigger). -->
            <span
              aria-hidden="true"
              class="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded transition-colors"
              onclick={(e) => clearAll(e)}
            >
              <X class="size-4" />
            </span>
          {:else}
            <ChevronDown
              class={cn('text-muted-foreground size-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
            />
          {/if}
        </span>
      </button>
    {/snippet}
  </PopoverTrigger>

  <PopoverContent class="p-0" align="start" sideOffset={4}>
    <div class="flex max-h-80 flex-col" style={triggerWidth ? `width: ${triggerWidth}px` : undefined}>
      {#if searchable}
        <div class="border-b p-2">
          <div class="relative">
            <Search class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              bind:value={search}
              placeholder={searchPlaceholder}
              aria-label="Search options"
              class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
            />
          </div>
        </div>
      {/if}

      {#if loading}
        <div class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
          <Loader2 class="size-4 animate-spin" />
          Loading...
        </div>
      {:else if searchResults}
        <!-- Search results -->
        <div class="flex-1 overflow-y-auto p-1">
          {#if searchResults.length === 0}
            <div class="text-muted-foreground py-6 text-center text-sm">
              {emptyText}
            </div>
          {:else}
            {#each searchResults as result, i (i)}
              <button
                type="button"
                class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:outline-none"
                onclick={() => selectSearchResult(result)}
              >
                <span class="flex-1 truncate">{result.path.map((p) => p.label).join(separator)}</span>
              </button>
            {/each}
          {/if}
        </div>
      {:else}
        <!-- Cascading panels — horizontal scroll -->
        <div class="flex flex-1 overflow-x-auto overflow-y-hidden">
          {#each levels as lvl (lvl.level)}
            <div class="max-w-56 min-w-44 shrink-0 overflow-y-auto border-r p-1 last:border-r-0">
              {#each lvl.options as opt, idx (opt.value)}
                <button
                  type="button"
                  disabled={opt.disabled}
                  class={cn(
                    'flex w-full items-center justify-between gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none',
                    'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    activePath[lvl.level] === idx && 'bg-accent text-accent-foreground font-medium',
                  )}
                  onclick={() => selectAtLevel(lvl.level, idx)}
                >
                  <span class="flex-1 truncate">{opt.label}</span>
                  {#if activePath[lvl.level] === idx && !opt.children?.length}
                    <Check class="size-4 shrink-0" />
                  {:else if opt.children?.length}
                    <ChevronRight class="text-muted-foreground size-3.5 shrink-0" />
                  {/if}
                </button>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </PopoverContent>
</Popover>

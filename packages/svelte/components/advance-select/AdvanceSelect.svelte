<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { AdvanceSelectFieldNames } from './types'

  export interface AdvanceSelectProps<T = Record<string, unknown> | string | number>
    extends Omit<HTMLButtonAttributes, 'value' | 'prefix'> {
    value?: unknown | unknown[]
    options: T[]

    // Mode
    mode?: 'single' | 'multiple' | 'tags'

    // Field mapping
    fieldNames?: AdvanceSelectFieldNames

    // Appearance
    size?: 'sm' | 'default' | 'lg'
    variant?: 'outlined' | 'filled' | 'borderless'
    status?: 'default' | 'error' | 'warning'
    placeholder?: string

    // Search
    showSearch?: boolean
    searchValue?: string
    autoClearSearchValue?: boolean
    filterOption?: boolean | ((input: string, option: T) => boolean)
    optionFilterProp?: string | string[]
    filterSort?: (optionA: T, optionB: T, info: { searchValue: string }) => number

    // Multiple/Tags
    maxCount?: number
    maxTagCount?: number
    maxTagTextLength?: number
    maxTagPlaceholder?: string | ((omittedValues: T[]) => string)
    tokenSeparators?: string[]
    hideSelected?: boolean
    allowCreate?: boolean

    // State
    disabled?: boolean
    loading?: boolean
    allowClear?: boolean
    open?: boolean
    defaultOpen?: boolean
    defaultActiveFirstOption?: boolean

    // Customization
    notFoundContent?: string
    loadingText?: string
    listHeight?: number
    virtual?: boolean

    // Snippets (Svelte counterparts of the Vue slots)
    prefix?: Snippet
    suffix?: Snippet
    suffixIcon?: Snippet
    clearIcon?: Snippet
    tag?: Snippet<[{ value: unknown; label: string; closable: boolean; onClose: (e: Event) => void }]>
    label?: Snippet<[{ value: unknown | unknown[]; label: string }]>
    option?: Snippet<[{ option: T; index: number }]>
    /** Primary empty-content API (React `emptyContent` parity). Wins over `empty` when both are set. */
    emptyContent?: Snippet
    /** @deprecated Use `emptyContent`. Kept as an alias — both stay functional. */
    empty?: Snippet

    ref?: HTMLButtonElement | null
    /** Primary value-change API (React `onValueChange` parity). Fires alongside `onChange`. */
    onValueChange?: (value: unknown | unknown[], option: T | T[] | undefined) => void
    /** @deprecated Use `onValueChange`. Kept as an alias — both stay functional and fire together. */
    onChange?: (value: unknown | unknown[], option: T | T[] | undefined) => void
    onSelect?: (value: unknown, option: T) => void
    onDeselect?: (value: unknown, option: T) => void
    /** Primary search API (React `onSearchChange` parity). Fires alongside `onSearch`. */
    onSearchChange?: (value: string) => void
    /** @deprecated Use `onSearchChange`. Kept as an alias — both stay functional and fire together. */
    onSearch?: (value: string) => void
    onClear?: () => void
    onOpenChange?: (open: boolean) => void
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    onPopupScroll?: (event: Event) => void
    onInputKeyDown?: (event: KeyboardEvent) => void
  }
</script>

<script lang="ts" generics="T extends Record<string, unknown> | string | number">
  import type { FocusEventHandler } from 'svelte/elements'
  import { tick } from 'svelte'
  import { Check, ChevronDown, LoaderCircle, Search, X } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { readKey } from './types'

  // Self-contained combobox: the Vue twin composes the popover + command +
  // badge + select registry items, which have no Svelte ports yet, so the
  // dropdown panel, search field, and tag pills are hand-rolled here with
  // class strings mirrored from those items. Revisit once they land.

  let {
    value = $bindable(),
    options,
    mode = 'single',
    fieldNames = {},
    size = 'default',
    variant = 'outlined',
    status = 'default',
    placeholder = 'Select...',
    showSearch = false,
    searchValue = $bindable(),
    autoClearSearchValue = true,
    filterOption = true,
    optionFilterProp = 'label',
    filterSort,
    maxCount,
    maxTagCount = undefined,
    maxTagTextLength = undefined,
    maxTagPlaceholder,
    tokenSeparators = [],
    hideSelected = false,
    allowCreate = false,
    disabled = false,
    loading = false,
    allowClear = true,
    open = $bindable(),
    defaultOpen = false,
    defaultActiveFirstOption = true,
    notFoundContent = 'No results.',
    loadingText = 'Loading...',
    listHeight = 300,
    virtual = true,
    class: className,
    prefix,
    suffix,
    suffixIcon,
    clearIcon,
    tag,
    label,
    option,
    emptyContent,
    empty,
    ref = $bindable(null),
    onValueChange,
    onChange,
    onSelect,
    onDeselect,
    onSearchChange,
    onSearch,
    onClear,
    onOpenChange,
    onFocus,
    onBlur,
    onPopupScroll,
    onInputKeyDown,
    onfocus,
    onblur,
    ...restProps
  }: AdvanceSelectProps<T> = $props()

  function emitChange(value: unknown | unknown[], option: T | T[] | undefined) {
    onValueChange?.(value, option)
    onChange?.(value, option)
  }

  function emitSearch(value: string) {
    onSearchChange?.(value)
    onSearch?.(value)
  }

  // Snapshot once: later `defaultOpen` changes must not reopen a user-closed panel.
  const getInitialOpen = () => open ?? defaultOpen
  let internalOpen = $state(getInitialOpen())

  // Controlled mode: a bound `open` always wins over internal state.
  $effect.pre(() => {
    if (open === undefined || open === internalOpen) return
    setOpen(open)
  })

  let internalQuery = $state('')
  const query = $derived(searchValue ?? internalQuery)

  function setQuery(v: string) {
    internalQuery = v
    searchValue = v
    emitSearch(v)
  }

  let wrapperEl: HTMLDivElement | null = $state(null)
  let searchInput: HTMLInputElement | null = $state(null)

  const valueKey = $derived(fieldNames.value ?? 'value')
  const labelKey = $derived(fieldNames.label ?? 'label')
  const groupKey = $derived(fieldNames.group ?? 'group')
  const disabledKey = $derived(fieldNames.disabled ?? 'disabled')

  function getValue(o: T): unknown {
    return readKey(o, valueKey, o)
  }
  function getLabel(o: T): string {
    return String(readKey(o, labelKey, ''))
  }
  function getGroup(o: T): string | undefined {
    const g = readKey(o, groupKey)
    return g == null ? undefined : String(g)
  }
  function isDisabled(o: T): boolean {
    return Boolean(readKey(o, disabledKey, false))
  }

  const isMultiple = $derived(mode === 'multiple' || mode === 'tags')

  const selectedValues = $derived.by(() => {
    if (value == null) return []
    if (isMultiple) {
      return Array.isArray(value) ? value : []
    }
    return [value]
  })

  const selectedSet = $derived(new Set(selectedValues))

  const selectedOptions = $derived(
    selectedValues.map((v) => {
      const found = options.find((o) => getValue(o) === v)
      if (found) return found
      // For created tags not in options, create a minimal option object
      return { [labelKey]: String(v), [valueKey]: v } as T
    }),
  )

  function getOptionByValue(v: unknown): T | undefined {
    return options.find((o) => getValue(o) === v)
  }

  function matchesFilter(o: T, q: string): boolean {
    if (typeof filterOption === 'function') {
      return filterOption(q, o)
    }
    if (filterOption === false) return true
    const labelText = getLabel(o).toLowerCase()
    const search = q.toLowerCase()
    const propsToSearch = Array.isArray(optionFilterProp) ? optionFilterProp : [optionFilterProp]
    for (const prop of propsToSearch) {
      if (prop === 'label' && labelText.includes(search)) return true
      const val = String(readKey(o, prop, '')).toLowerCase()
      if (val.includes(search)) return true
    }
    return false
  }

  const filteredOptions = $derived.by(() => {
    let result = options
    const q = query.trim()

    if (q) {
      result = result.filter((o) => matchesFilter(o, q))
    }

    if (hideSelected && isMultiple) {
      result = result.filter((o) => !selectedSet.has(getValue(o)))
    }

    if (q && filterSort) {
      const sort = filterSort
      result = [...result].sort((a, b) => sort(a, b, { searchValue: q }))
    }

    return result
  })

  const grouped = $derived.by(() => {
    const groups = new Map<string, T[]>()
    for (const opt of filteredOptions) {
      const key = getGroup(opt) ?? ''
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(opt)
    }
    return Array.from(groups, ([heading, items]) => ({ heading, items }))
  })

  const atMax = $derived.by(() => {
    if (typeof maxCount !== 'number') return false
    const count = Array.isArray(value) ? value.length : value ? 1 : 0
    return count >= maxCount
  })

  const visibleTags = $derived.by(() => {
    if (!isMultiple) return []
    if (typeof maxTagCount === 'number') {
      return selectedOptions.slice(0, maxTagCount)
    }
    return selectedOptions
  })

  const hiddenTagCount = $derived.by(() => {
    if (!isMultiple) return 0
    if (typeof maxTagCount === 'number') {
      return Math.max(0, selectedOptions.length - maxTagCount)
    }
    return 0
  })

  function displayLabel(o: T): string {
    let text = getLabel(o)
    if (maxTagTextLength && text.length > maxTagTextLength) {
      text = text.slice(0, maxTagTextLength) + '...'
    }
    return text
  }

  const showCreate = $derived(
    query.trim() !== '' &&
      (allowCreate || mode === 'tags') &&
      !options.some((o) => getLabel(o) === query.trim()),
  )

  interface SelectableEntry {
    kind: 'option' | 'create'
    option?: T
    disabled: boolean
  }

  const selectables = $derived.by((): SelectableEntry[] => {
    const entries: SelectableEntry[] = filteredOptions.map((opt) => ({
      kind: 'option',
      option: opt,
      disabled: isDisabled(opt) || (atMax && !selectedSet.has(getValue(opt))),
    }))
    if (showCreate) entries.push({ kind: 'create', disabled: false })
    return entries
  })

  let activeIndex = $state(-1)

  function resetActive() {
    activeIndex = defaultActiveFirstOption && selectables.length > 0 ? 0 : -1
    // Never land on a disabled entry.
    if (activeIndex >= 0 && selectables[activeIndex]?.disabled) moveActive(1)
  }

  // Reset (and clamp) the highlight whenever the list or query changes.
  $effect(() => {
    query
    internalOpen
    selectables.length
    if (!internalOpen) return
    if (activeIndex > selectables.length - 1) activeIndex = selectables.length - 1
    if (activeIndex >= 0 && selectables[activeIndex]?.disabled) moveActive(1)
  })

  function moveActive(delta: 1 | -1) {
    if (selectables.length === 0) return
    let next = activeIndex
    for (let i = 0; i < selectables.length; i++) {
      next = (next + delta + selectables.length) % selectables.length
      if (!selectables[next]?.disabled) {
        activeIndex = next
        return
      }
    }
  }

  function flatIndexOf(opt: T): number {
    return selectables.findIndex((e) => e.kind === 'option' && e.option === opt)
  }

  function setOpen(v: boolean) {
    if (v === internalOpen) return
    internalOpen = v
    open = v
    if (v) {
      resetActive()
      tick().then(() => searchInput?.focus())
    } else if (autoClearSearchValue && query) {
      setQuery('')
    }
    onOpenChange?.(v)
  }

  function selectOption(opt: T) {
    if (isDisabled(opt)) return
    const v = getValue(opt)

    if (!isMultiple) {
      value = v
      emitChange(v, opt)
      onSelect?.(v, opt)
      setOpen(false)
      if (autoClearSearchValue) setQuery('')
      return
    }

    const current = Array.isArray(value) ? [...value] : []
    if (selectedSet.has(v)) {
      const next = current.filter((x) => x !== v)
      value = next
      emitChange(next, opt)
      onDeselect?.(v, opt)
    } else {
      if (atMax) return
      const next = [...current, v]
      value = next
      emitChange(next, opt)
      onSelect?.(v, opt)
    }

    if (autoClearSearchValue) setQuery('')
  }

  function selectActive() {
    const entry = selectables[activeIndex]
    if (!entry || entry.disabled) return
    if (entry.kind === 'create') createTag()
    else if (entry.option) selectOption(entry.option)
  }

  function removeTag(tagValue: unknown, event: Event) {
    event.stopPropagation()
    if (disabled) return
    const current = Array.isArray(value) ? [...value] : []
    const next = current.filter((x) => x !== tagValue)
    const opt = getOptionByValue(tagValue)
    value = next
    emitChange(next, opt)
    if (opt) onDeselect?.(tagValue, opt)
  }

  function clearAll(event?: Event) {
    event?.stopPropagation()
    if (disabled) return
    onClear?.()
    if (isMultiple) {
      value = []
      emitChange([], [])
    } else {
      value = null
      emitChange(null, undefined)
    }
    setQuery('')
  }

  function createTag() {
    if (!allowCreate && mode !== 'tags') return
    const q = query.trim()
    if (!q) return
    // Check if already exists
    const exists = options.some((o) => getLabel(o) === q || String(getValue(o)) === q)
    if (exists) return

    if (!isMultiple) {
      value = q
      const newOption = { [labelKey]: q, [valueKey]: q } as T
      emitChange(q, newOption)
      onSelect?.(q, newOption)
      setOpen(false)
      setQuery('')
      return
    }

    if (atMax) return
    const current = Array.isArray(value) ? [...value] : []
    const next = [...current, q]
    const newOption = { [labelKey]: q, [valueKey]: q } as T
    value = next
    emitChange(next, newOption)
    onSelect?.(q, newOption)
    setQuery('')
  }

  function handleInputKeydown(event: KeyboardEvent) {
    onInputKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveActive(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive(-1)
    } else if (event.key === 'Enter') {
      if (mode === 'tags' && query.trim()) {
        event.preventDefault()
        createTag()
      } else if (activeIndex >= 0) {
        event.preventDefault()
        selectActive()
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    } else if (tokenSeparators.length && mode === 'tags' && tokenSeparators.includes(event.key)) {
      event.preventDefault()
      createTag()
    }
  }

  function handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!internalOpen) setOpen(true)
      else moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Escape' && internalOpen) {
      event.preventDefault()
      setOpen(false)
    }
  }

  function handleWindowClick(event: MouseEvent) {
    if (internalOpen && wrapperEl && !wrapperEl.contains(event.target as Node)) {
      setOpen(false)
    }
  }

  const handleFocus: FocusEventHandler<HTMLButtonElement> = (event) => {
    onfocus?.(event)
    onFocus?.(event)
  }

  const handleBlur: FocusEventHandler<HTMLButtonElement> = (event) => {
    onblur?.(event)
    onBlur?.(event)
  }

  function handlePopupScroll(event: Event) {
    onPopupScroll?.(event)
  }

  const sizeClasses = {
    sm: 'h-8 text-xs px-2.5 py-1',
    default: 'h-9 text-sm px-3 py-1.5',
    lg: 'h-11 text-base px-4 py-2',
  }

  const variantClasses = {
    outlined:
      'border-input bg-transparent shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    filled:
      'border-transparent bg-muted/50 shadow-none focus-visible:bg-muted focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    borderless:
      'border-transparent bg-transparent shadow-none focus-visible:bg-muted/30 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  }

  const statusClasses = {
    default: '',
    error:
      'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive',
    warning: 'border-warning focus-visible:border-warning focus-visible:ring-warning/20',
  }

  const triggerBaseClasses = $derived(
    cn(
      'flex w-full items-center justify-between gap-2 rounded-md border text-sm transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size],
      variantClasses[variant],
      statusClasses[status],
      className,
    ),
  )

  const isEmpty = $derived.by(() => {
    if (isMultiple) {
      return !Array.isArray(value) || value.length === 0
    }
    return value == null || value === ''
  })

  const showClear = $derived(allowClear && !isEmpty && !disabled && !loading)
  const showSearchInput = $derived(showSearch || mode === 'tags')

  const optionItemClasses =
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

  const listboxId = $props.id()
</script>

<svelte:window onclick={handleWindowClick} />

<div bind:this={wrapperEl} class="relative">
  <button
    bind:this={ref}
    type="button"
    role="combobox"
    aria-expanded={internalOpen}
    aria-controls={listboxId}
    aria-invalid={status === 'error' ? true : undefined}
    disabled={disabled || loading}
    data-uipkge=""
    data-slot="advance-select"
    class={triggerBaseClasses}
    onclick={() => {
      if (!disabled && !loading) setOpen(!internalOpen)
    }}
    onkeydown={handleTriggerKeydown}
    onfocus={handleFocus}
    onblur={handleBlur}
    {...restProps}
  >
    <!-- Prefix snippet -->
    {#if prefix}
      <span class="shrink-0">
        {@render prefix()}
      </span>
    {/if}

    <!-- Multiple mode tags -->
    {#if isMultiple}
      <div class="flex flex-1 flex-nowrap items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {#if selectedOptions.length}
          {#each visibleTags as opt (String(getValue(opt)))}
            {#if tag}
              {@render tag({
                value: getValue(opt),
                label: displayLabel(opt),
                closable: !disabled,
                onClose: (e: Event) => removeTag(getValue(opt), e),
              })}
            {:else}
              <span
                class={cn(
                  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:size-3 gap-1 transition-colors duration-200',
                  'border-transparent bg-secondary text-secondary-foreground',
                  'bg-muted text-foreground h-6 gap-1 pr-1 pl-2 font-normal',
                )}
              >
                <span class="truncate">{displayLabel(opt)}</span>
                {#if !disabled}
                  <span
                    role="button"
                    tabindex="0"
                    class="hover:bg-muted-foreground/20 inline-flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${getLabel(opt)}`}
                    onclick={(e) => removeTag(getValue(opt), e)}
                    onkeydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        removeTag(getValue(opt), e)
                      }
                    }}
                  >
                    <X class="size-3" />
                  </span>
                {/if}
              </span>
            {/if}
          {/each}
          {#if hiddenTagCount > 0}
            <span
              class={cn(
                'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors duration-200',
                'border-transparent bg-secondary text-secondary-foreground',
                'bg-muted text-foreground h-6 font-normal',
              )}
            >
              {#if typeof maxTagPlaceholder === 'function'}
                {maxTagPlaceholder(selectedOptions.slice(maxTagCount ?? 0))}
              {:else if maxTagPlaceholder}
                {maxTagPlaceholder}
              {:else}
                +{hiddenTagCount}
              {/if}
            </span>
          {/if}
        {:else}
          <span class="text-muted-foreground truncate">{placeholder}</span>
        {/if}
      </div>
    {:else}
      {#if label}
        {@render label({ value, label: selectedOptions[0] ? getLabel(selectedOptions[0]) : '' })}
      {:else}
        <span class={cn('flex-1 truncate text-left', selectedOptions.length ? 'text-foreground' : 'text-muted-foreground')}>
          {selectedOptions[0] ? getLabel(selectedOptions[0]) : placeholder}
        </span>
      {/if}
    {/if}

    <!-- Suffix area -->
    <span class="flex shrink-0 items-center gap-1">
      {#if suffix}
        {@render suffix()}
      {/if}

      {#if loading}
        <LoaderCircle class="text-muted-foreground size-4 animate-spin" />
      {:else if showClear}
        <span
          role="button"
          tabindex="0"
          class="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center rounded transition-colors"
          aria-label="Clear selection"
          onclick={(e) => clearAll(e)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              clearAll(e)
            }
          }}
        >
          {#if clearIcon}
            {@render clearIcon()}
          {:else}
            <X class="size-4" aria-hidden="true" />
          {/if}
        </span>
      {:else if suffixIcon}
        {@render suffixIcon()}
      {:else}
        <ChevronDown class="text-muted-foreground size-4 opacity-50" />
      {/if}
    </span>
  </button>

  {#if internalOpen}
    <div
      id={listboxId}
      role="listbox"
      aria-multiselectable={isMultiple || undefined}
      data-uipkge=""
      data-slot="advance-select-list"
      data-state="open"
      class="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 absolute top-full right-0 left-0 z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md outline-none"
      style:max-height={`${listHeight}px`}
      onscroll={handlePopupScroll}
    >
      <div class="flex max-h-[inherit] flex-col overflow-hidden">
        {#if showSearchInput}
          <div data-slot="advance-select-search" class="flex h-9 shrink-0 items-center gap-2 border-b px-3">
            <Search class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
            <input
              bind:this={searchInput}
              value={query}
              {placeholder}
              role="searchbox"
              aria-label="Search options"
              data-slot="advance-select-search-input"
              class="placeholder:text-muted-foreground flex h-9 w-full rounded-md bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              oninput={(e) => setQuery(e.currentTarget.value)}
              onkeydown={handleInputKeydown}
            />
          </div>
        {/if}

        <div class="max-h-[300px] flex-1 scroll-py-1 overflow-x-hidden overflow-y-auto p-1">
          {#if !loading && filteredOptions.length === 0 && !showCreate}
            <div class="py-6 text-center text-sm" data-slot="advance-select-empty">
              {#if emptyContent}
                {@render emptyContent()}
              {:else if empty}
                {@render empty()}
              {:else}
                {notFoundContent}
              {/if}
            </div>
          {/if}

          {#if loading && filteredOptions.length === 0}
            <div class="py-6 text-center text-sm">
              {loadingText}
            </div>
          {/if}

          {#each grouped as group, gi (group.heading || gi)}
            {#if gi > 0}
              <div class="bg-border -mx-1 my-1 h-px" role="separator"></div>
            {/if}
            <div role="group" aria-label={group.heading || undefined} class="text-foreground overflow-hidden p-1">
              {#if group.heading}
                <div class="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                  {group.heading}
                </div>
              {/if}
              {#each group.items as opt, idx (String(getValue(opt)))}
                {@const entryDisabled = isDisabled(opt) || (atMax && !selectedSet.has(getValue(opt)))}
                {@const flatIndex = flatIndexOf(opt)}
                <div
                  role="option"
                  tabindex="-1"
                  aria-selected={selectedSet.has(getValue(opt))}
                  data-highlighted={flatIndex === activeIndex || undefined}
                  data-disabled={entryDisabled || undefined}
                  data-slot="advance-select-option"
                  class={optionItemClasses}
                  style:content-visibility={virtual && options.length > 100 ? 'auto' : undefined}
                  onclick={() => selectOption(opt)}
                  onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      selectOption(opt)
                    }
                  }}
                  onmousemove={() => {
                    if (!entryDisabled && flatIndex >= 0) activeIndex = flatIndex
                  }}
                >
                  <Check class={cn('mr-2 size-4 shrink-0', selectedSet.has(getValue(opt)) ? 'opacity-100' : 'opacity-0')} />
                  {#if option}
                    {@render option({ option: opt, index: idx })}
                  {:else}
                    {getLabel(opt)}
                  {/if}
                </div>
              {/each}
            </div>
          {/each}

          <!-- Create new option in tags / allowCreate modes -->
          {#if showCreate}
            {@const createIndex = selectables.length - 1}
            <div
              role="option"
              tabindex="-1"
              aria-selected="false"
              data-highlighted={createIndex === activeIndex || undefined}
              data-slot="advance-select-option"
              class={optionItemClasses}
              onclick={createTag}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  createTag()
                }
              }}
              onmousemove={() => {
                activeIndex = createIndex
              }}
            >
              <Check class="mr-2 size-4 opacity-0" />
              Create "{query.trim()}"
            </div>
          {/if}
        </div>

        <!-- Footer for multiple mode -->
        {#if isMultiple && selectedOptions.length}
          <div class="flex shrink-0 items-center justify-between border-t px-2 py-1.5 text-xs">
            <span class="text-muted-foreground">{selectedOptions.length} selected</span>
            <button type="button" class="text-muted-foreground hover:text-foreground" onclick={(e) => clearAll(e)}>
              Clear all
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

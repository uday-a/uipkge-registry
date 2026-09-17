'use client'

import * as React from 'react'
import { Check, ChevronDown, Loader2, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { readKey } from './types'
import type { AdvanceSelectFieldNames } from './types'

export interface AdvanceSelectProps<T extends Record<string, unknown> | string | number> {
  value?: unknown | unknown[]
  onValueChange?: (value: unknown | unknown[], option: T | T[]) => void
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
  onSearchChange?: (value: string) => void
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
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  defaultActiveFirstOption?: boolean

  // Customization
  notFoundContent?: React.ReactNode
  loadingText?: React.ReactNode
  listHeight?: number
  virtual?: boolean

  className?: string

  // Render slots
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  suffixIcon?: React.ReactNode
  clearIcon?: React.ReactNode
  renderLabel?: (info: { value: unknown; label: string }) => React.ReactNode
  renderTag?: (info: {
    value: unknown
    label: string
    closable: boolean
    onClose: (e: React.MouseEvent | Event) => void
  }) => React.ReactNode
  renderOption?: (info: { option: T; index: number }) => React.ReactNode
  emptyContent?: React.ReactNode

  // Events
  onSelect?: (value: unknown, option: T) => void
  onDeselect?: (value: unknown, option: T) => void
  onClear?: () => void
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
  onPopupScroll?: (event: React.UIEvent) => void
  onInputKeyDown?: (event: React.KeyboardEvent) => void
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

function AdvanceSelect<T extends Record<string, unknown> | string | number>({
  value: modelValue,
  onValueChange,
  options,
  mode = 'single',
  fieldNames = {},
  size = 'default',
  variant = 'outlined',
  status = 'default',
  placeholder = 'Select...',
  showSearch = false,
  searchValue,
  onSearchChange,
  autoClearSearchValue = true,
  filterOption = true,
  optionFilterProp = 'label',
  filterSort,
  maxCount,
  maxTagCount,
  maxTagTextLength,
  maxTagPlaceholder,
  tokenSeparators = [],
  hideSelected = false,
  allowCreate = false,
  disabled = false,
  loading = false,
  allowClear = true,
  open,
  onOpenChange,
  defaultOpen = false,
  defaultActiveFirstOption = true,
  notFoundContent = 'No results.',
  loadingText = 'Loading...',
  listHeight = 300,
  virtual = true,
  className,
  prefix,
  suffix,
  suffixIcon,
  clearIcon,
  renderLabel,
  renderTag,
  renderOption,
  emptyContent,
  onSelect,
  onDeselect,
  onClear,
  onFocus,
  onBlur,
  onPopupScroll,
  onInputKeyDown,
}: AdvanceSelectProps<T>) {
  const isOpenControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen)
  const isOpen = isOpenControlled ? open : internalOpen

  function setOpen(v: boolean) {
    if (!isOpenControlled) setInternalOpen(v)
    onOpenChange?.(v)
  }

  const isQueryControlled = searchValue !== undefined
  const [internalQuery, setInternalQuery] = React.useState('')
  const query = isQueryControlled ? (searchValue as string) : internalQuery

  function setQuery(v: string) {
    if (!isQueryControlled) setInternalQuery(v)
    onSearchChange?.(v)
  }

  const valueKey = fieldNames.value ?? 'value'
  const labelKey = fieldNames.label ?? 'label'
  const groupKey = fieldNames.group ?? 'group'
  const disabledKey = fieldNames.disabled ?? 'disabled'

  const getValue = React.useCallback((o: T): unknown => readKey(o, valueKey, o), [valueKey])
  const getLabel = React.useCallback((o: T): string => String(readKey(o, labelKey, '')), [labelKey])
  const getGroup = React.useCallback(
    (o: T): string | undefined => {
      const g = readKey(o, groupKey)
      return g == null ? undefined : String(g)
    },
    [groupKey],
  )
  const isDisabledOption = React.useCallback((o: T): boolean => Boolean(readKey(o, disabledKey, false)), [disabledKey])

  const isMultiple = mode === 'multiple' || mode === 'tags'

  const selectedValues = React.useMemo<unknown[]>(() => {
    if (modelValue == null) return []
    if (isMultiple) {
      return Array.isArray(modelValue) ? modelValue : []
    }
    return [modelValue]
  }, [modelValue, isMultiple])

  const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues])

  const selectedOptions = React.useMemo<T[]>(() => {
    return selectedValues.map((v) => {
      const found = options.find((o) => getValue(o) === v)
      if (found) return found
      // For created tags not in options, create a minimal option object
      return { [labelKey]: String(v), [valueKey]: v } as T
    })
  }, [selectedValues, options, getValue, labelKey, valueKey])

  function getOptionByValue(v: unknown): T | undefined {
    return options.find((o) => getValue(o) === v)
  }

  function matchesFilter(o: T, q: string): boolean {
    if (typeof filterOption === 'function') {
      return filterOption(q, o)
    }
    if (filterOption === false) return true
    const label = getLabel(o).toLowerCase()
    const search = q.toLowerCase()
    const propsToSearch = Array.isArray(optionFilterProp) ? optionFilterProp : [optionFilterProp]
    for (const prop of propsToSearch) {
      if (prop === 'label' && label.includes(search)) return true
      const val = String(readKey(o, prop, '')).toLowerCase()
      if (val.includes(search)) return true
    }
    return false
  }

  const filteredOptions = React.useMemo<T[]>(() => {
    let result = options
    const q = query.trim()

    if (q) {
      result = result.filter((o) => matchesFilter(o, q))
    }

    if (hideSelected && isMultiple) {
      result = result.filter((o) => !selectedSet.has(getValue(o)))
    }

    if (q && filterSort) {
      result = [...result].sort((a, b) => filterSort(a, b, { searchValue: q }))
    }

    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, query, hideSelected, isMultiple, selectedSet, getValue, filterSort, filterOption, optionFilterProp])

  const grouped = React.useMemo(() => {
    const groups = new Map<string, T[]>()
    for (const opt of filteredOptions) {
      const key = getGroup(opt) ?? ''
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(opt)
    }
    return Array.from(groups, ([heading, items]) => ({ heading, items }))
  }, [filteredOptions, getGroup])

  const atMax = React.useMemo(() => {
    if (typeof maxCount !== 'number') return false
    const count = Array.isArray(modelValue) ? modelValue.length : modelValue ? 1 : 0
    return count >= maxCount
  }, [maxCount, modelValue])

  const visibleTags = React.useMemo<T[]>(() => {
    if (!isMultiple) return []
    const opts = selectedOptions
    if (typeof maxTagCount === 'number') {
      return opts.slice(0, maxTagCount)
    }
    return opts
  }, [isMultiple, selectedOptions, maxTagCount])

  const hiddenTagCount = React.useMemo(() => {
    if (!isMultiple) return 0
    const opts = selectedOptions
    if (typeof maxTagCount === 'number') {
      return Math.max(0, opts.length - maxTagCount)
    }
    return 0
  }, [isMultiple, selectedOptions, maxTagCount])

  function displayLabel(o: T): string {
    let label = getLabel(o)
    if (maxTagTextLength && label.length > maxTagTextLength) {
      label = label.slice(0, maxTagTextLength) + '...'
    }
    return label
  }

  function selectOption(option: T) {
    if (isDisabledOption(option)) return
    const v = getValue(option)

    if (!isMultiple) {
      onValueChange?.(v, option)
      onSelect?.(v, option)
      setOpen(false)
      if (autoClearSearchValue) setQuery('')
      return
    }

    const current = Array.isArray(modelValue) ? [...modelValue] : []
    if (selectedSet.has(v)) {
      const next = current.filter((x) => x !== v)
      onValueChange?.(next, option)
      onDeselect?.(v, option)
    } else {
      if (atMax) return
      const next = [...current, v]
      onValueChange?.(next, option)
      onSelect?.(v, option)
    }

    if (autoClearSearchValue) setQuery('')
  }

  function removeTag(value: unknown, event: React.SyntheticEvent | Event) {
    event.stopPropagation()
    if (disabled) return
    const current = Array.isArray(modelValue) ? [...modelValue] : []
    const next = current.filter((x) => x !== value)
    const option = getOptionByValue(value)
    onValueChange?.(next, option as T)
    if (option) onDeselect?.(value, option)
  }

  function clearAll(event?: React.SyntheticEvent | Event) {
    event?.stopPropagation()
    if (disabled) return
    onClear?.()
    if (isMultiple) {
      onValueChange?.([], [])
    } else {
      onValueChange?.(null, undefined as unknown as T)
    }
    setQuery('')
  }

  function createTag() {
    if (!allowCreate && mode !== 'tags') return
    const q = query.trim()
    if (!q) return
    const exists = options.some((o) => getLabel(o) === q || String(getValue(o)) === q)
    if (exists) return

    if (!isMultiple) {
      const newOption = { [labelKey]: q, [valueKey]: q } as T
      onValueChange?.(q, newOption)
      onSelect?.(q, newOption)
      setOpen(false)
      setQuery('')
      return
    }

    if (atMax) return
    const current = Array.isArray(modelValue) ? [...modelValue] : []
    const next = [...current, q]
    const newOption = { [labelKey]: q, [valueKey]: q } as T
    onValueChange?.(next, newOption)
    onSelect?.(q, newOption)
    setQuery('')
  }

  function handleInputKeydown(event: React.KeyboardEvent) {
    onInputKeyDown?.(event)
    if (event.key === 'Enter' && query.trim() && mode === 'tags') {
      event.preventDefault()
      createTag()
    }
    if (tokenSeparators.length && mode === 'tags') {
      if (tokenSeparators.includes(event.key)) {
        event.preventDefault()
        createTag()
      }
    }
  }

  // Clear query when the popover closes.
  React.useEffect(() => {
    if (!isOpen && autoClearSearchValue) setQuery('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const triggerBaseClasses = cn(
    'flex w-full items-center justify-between gap-2 rounded-md border text-sm transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[size],
    variantClasses[variant],
    statusClasses[status],
    className,
  )

  const isEmpty = isMultiple
    ? !Array.isArray(modelValue) || modelValue.length === 0
    : modelValue == null || modelValue === ''

  const showClear = allowClear && !isEmpty && !disabled && !loading
  const showSearchInput = showSearch || mode === 'tags'

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-invalid={status === 'error' ? true : undefined}
          disabled={disabled || loading}
          data-uipkge=""
          data-slot="advance-select"
          className={triggerBaseClasses}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {/* Prefix */}
          {prefix && <span className="shrink-0">{prefix}</span>}

          {/* Multiple mode tags */}
          {isMultiple ? (
            <div
              className="flex flex-1 flex-nowrap items-center gap-1 overflow-x-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
              {selectedOptions.length ? (
                <>
                  {visibleTags.map((opt) =>
                    renderTag ? (
                      <React.Fragment key={String(getValue(opt))}>
                        {renderTag({
                          value: getValue(opt),
                          label: displayLabel(opt),
                          closable: !disabled,
                          onClose: (e) => removeTag(getValue(opt), e),
                        })}
                      </React.Fragment>
                    ) : (
                      <Badge
                        key={String(getValue(opt))}
                        variant="secondary"
                        className="bg-muted text-foreground h-6 gap-1 pr-1 pl-2 text-xs font-normal"
                      >
                        <span className="truncate">{displayLabel(opt)}</span>
                        {!disabled && (
                          <span
                            role="button"
                            tabIndex={0}
                            className="hover:bg-muted-foreground/20 inline-flex items-center justify-center rounded-full p-0.5 transition-colors"
                            aria-label={`Remove ${getLabel(opt)}`}
                            onClick={(e) => removeTag(getValue(opt), e)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                removeTag(getValue(opt), e)
                              }
                            }}
                          >
                            <X className="size-3" />
                          </span>
                        )}
                      </Badge>
                    ),
                  )}
                  {hiddenTagCount > 0 && (
                    <Badge variant="secondary" className="bg-muted text-foreground h-6 text-xs font-normal">
                      {typeof maxTagPlaceholder === 'function'
                        ? maxTagPlaceholder(selectedOptions.slice(maxTagCount ?? 0))
                        : maxTagPlaceholder
                          ? maxTagPlaceholder
                          : `+${hiddenTagCount}`}
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground truncate">{placeholder}</span>
              )}
            </div>
          ) : /* Single mode display */
          renderLabel ? (
            renderLabel({
              value: modelValue,
              label: selectedOptions[0] ? getLabel(selectedOptions[0]) : '',
            })
          ) : (
            <span
              className={cn(
                'flex-1 truncate text-left',
                selectedOptions.length ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {selectedOptions[0] ? getLabel(selectedOptions[0]) : placeholder}
            </span>
          )}

          {/* Suffix area */}
          <span className="flex shrink-0 items-center gap-1">
            {suffix}

            {loading ? (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            ) : showClear ? (
              <span
                role="button"
                tabIndex={0}
                className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center rounded transition-colors"
                aria-label="Clear selection"
                onClick={clearAll}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    clearAll(e)
                  }
                }}
              >
                {clearIcon ?? <X className="size-4" aria-hidden="true" />}
              </span>
            ) : (
              (suffixIcon ?? <ChevronDown className="text-muted-foreground size-4 opacity-50" />)
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        align="start"
        sideOffset={4}
        style={{ width: 'var(--radix-popover-trigger-width)', maxHeight: `${listHeight}px` }}
        onScroll={onPopupScroll}
      >
        <Command shouldFilter={false} className="flex flex-col overflow-hidden">
          {showSearchInput && (
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder}
              onKeyDown={handleInputKeydown}
            />
          )}

          <CommandList className="flex-1 overflow-y-auto">
            {!loading && filteredOptions.length === 0 && <CommandEmpty>{emptyContent ?? notFoundContent}</CommandEmpty>}

            {loading && filteredOptions.length === 0 && <div className="py-6 text-center text-sm">{loadingText}</div>}

            {grouped.map((group, gi) => (
              <React.Fragment key={group.heading || gi}>
                {gi > 0 && <CommandSeparator />}
                <CommandGroup heading={group.heading || undefined}>
                  {group.items.map((opt, idx) => (
                    <CommandItem
                      key={String(getValue(opt))}
                      value={String(getValue(opt))}
                      disabled={isDisabledOption(opt) || (atMax && !selectedSet.has(getValue(opt)))}
                      data-active={gi === 0 && idx === 0 && defaultActiveFirstOption ? 'true' : undefined}
                      style={
                        virtual && options.length > 100
                          ? ({ contentVisibility: 'auto' } as React.CSSProperties)
                          : undefined
                      }
                      onSelect={() => selectOption(opt)}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4 shrink-0',
                          selectedSet.has(getValue(opt)) ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {renderOption ? renderOption({ option: opt, index: idx }) : getLabel(opt)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}

            {/* Create new option in tags / allowCreate modes */}
            {query.trim() && (allowCreate || mode === 'tags') && !options.some((o) => getLabel(o) === query.trim()) && (
              <CommandItem value={`create:${query}`} onSelect={createTag}>
                <Check className="mr-2 size-4 opacity-0" />
                Create &quot;{query.trim()}&quot;
              </CommandItem>
            )}
          </CommandList>

          {/* Footer for multiple mode */}
          {isMultiple && selectedOptions.length > 0 && (
            <div className="flex items-center justify-between border-t px-2 py-1.5 text-xs">
              <span className="text-muted-foreground">{selectedOptions.length} selected</span>
              <button type="button" className="text-muted-foreground hover:text-foreground" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
AdvanceSelect.displayName = 'AdvanceSelect'

export { AdvanceSelect }

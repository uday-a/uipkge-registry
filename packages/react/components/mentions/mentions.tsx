'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { getCaretRect, type CaretRect } from './caret-position'

export interface MentionOption {
  value: string
  label: string
  description?: string
  avatar?: string
  disabled?: boolean
}

export interface MentionsProps<O extends MentionOption = MentionOption> {
  /** Controlled textarea value. */
  value?: string
  /** Fires with the next textarea value on every input + on insert. */
  onValueChange?: (value: string) => void
  options?: O[]
  triggers?: string[]
  prefix?: string
  rows?: number
  loading?: boolean
  loadOptions?: (query: string, trigger: string) => Promise<O[]>
  format?: (option: O, trigger: string) => string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
  /** Fires when an option is committed into the text. */
  onSelect?: (option: O) => void
  /** Fires whenever the active mention query changes. */
  onSearch?: (payload: { trigger: string; query: string }) => void
}

function MentionsInner<O extends MentionOption = MentionOption>(
  {
    value = '',
    onValueChange,
    options = [] as unknown as O[],
    triggers = ['@'],
    prefix = '@',
    rows = 4,
    loading = false,
    loadOptions,
    format,
    placeholder = '',
    disabled = false,
    readOnly = false,
    className,
    onSelect,
    onSearch,
  }: MentionsProps<O>,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null)
  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
    },
    [ref],
  )

  const [open, setOpen] = React.useState(false)
  const [activeTrigger, setActiveTrigger] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [triggerIndex, setTriggerIndex] = React.useState(-1)
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const [asyncResults, setAsyncResults] = React.useState<O[]>([])
  const [isAsyncLoading, setIsAsyncLoading] = React.useState(false)
  const [caretRect, setCaretRect] = React.useState<CaretRect | null>(null)
  const listboxId = React.useId()
  const optionId = (i: number) => `${listboxId}-opt-${i}`

  const filtered = React.useMemo<O[]>(() => {
    if (loadOptions) return asyncResults
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
  }, [loadOptions, asyncResults, query, options])

  const totalLoading = loading || isAsyncLoading

  function firstEnabledIndex(list: O[] = filtered) {
    const i = list.findIndex((o) => !o.disabled)
    return i === -1 ? 0 : i
  }

  function moveHighlight(delta: number) {
    const len = filtered.length
    if (len === 0) return
    setHighlightedIndex((current) => {
      let i = current
      for (let n = 0; n < len; n++) {
        i = (i + delta + len) % len
        if (!filtered[i]?.disabled) {
          requestAnimationFrame(() => {
            document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' })
          })
          return i
        }
      }
      return current
    })
  }

  function findActiveMention(val: string, caret: number): { trigger: string; index: number; query: string } | null {
    for (let i = caret - 1; i >= 0; i--) {
      const ch = val[i]!
      if (triggers.includes(ch)) {
        const before = i === 0 ? '' : val[i - 1]!
        if (i === 0 || /\s/.test(before)) {
          return { trigger: ch, index: i, query: val.substring(i + 1, caret) }
        }
        return null
      }
      if (/\s/.test(ch)) return null
    }
    return null
  }

  const updateAnchor = React.useCallback(() => {
    if (!innerRef.current) return
    setCaretRect(getCaretRect(innerRef.current, innerRef.current.selectionStart ?? 0))
  }, [])

  const asyncToken = React.useRef(0)
  const runAsync = React.useCallback(
    async (trigger: string, q: string) => {
      if (!loadOptions) return
      const token = ++asyncToken.current
      setIsAsyncLoading(true)
      try {
        const results = await loadOptions(q, trigger)
        if (token === asyncToken.current) setAsyncResults(results)
      } finally {
        if (token === asyncToken.current) setIsAsyncLoading(false)
      }
    },
    [loadOptions],
  )

  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleAsync = React.useCallback(
    (trigger: string, q: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => runAsync(trigger, q), 200)
    },
    [runAsync],
  )

  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const ta = e.target
    onValueChange?.(ta.value)

    const match = findActiveMention(ta.value, ta.selectionStart ?? 0)
    if (match) {
      setOpen(true)
      setActiveTrigger(match.trigger)
      setTriggerIndex(match.index)
      setQuery(match.query)
      // Highlight is reset after filtered recompute; start at first non-disabled.
      setHighlightedIndex(0)
      onSearch?.({ trigger: match.trigger, query: match.query })
      if (loadOptions) scheduleAsync(match.trigger, match.query)
      requestAnimationFrame(updateAnchor)
    } else {
      setOpen(false)
    }
  }

  // Keep highlight on an enabled option when the filtered list changes.
  React.useEffect(() => {
    if (!open || filtered.length === 0) return
    if (filtered[highlightedIndex]?.disabled) {
      setHighlightedIndex(firstEnabledIndex(filtered))
    }
  }, [filtered, open, highlightedIndex])

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!open) return
    // Escape must work even when there are no matches / still loading.
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (filtered.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveHighlight(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveHighlight(-1)
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      const opt = filtered[highlightedIndex]
      if (opt && !opt.disabled) insert(opt)
    }
  }

  function defaultFormat(option: O, _trigger: string) {
    return `${prefix}${option.value} `
  }

  function insert(option: O) {
    const ta = innerRef.current
    if (!ta) return
    const caret = ta.selectionStart ?? 0
    const before = value.substring(0, triggerIndex)
    const after = value.substring(caret)
    const token = (format ?? defaultFormat)(option, activeTrigger)
    const next = before + token + after
    onValueChange?.(next)
    onSelect?.(option)
    setOpen(false)
    requestAnimationFrame(() => {
      const pos = before.length + token.length
      ta.focus()
      ta.setSelectionRange(pos, pos)
    })
  }

  const anchorStyle: React.CSSProperties = caretRect
    ? {
        position: 'fixed',
        top: `${caretRect.top + caretRect.height}px`,
        left: `${caretRect.left}px`,
        width: '0px',
        height: '0px',
        pointerEvents: 'none',
      }
    : { display: 'none' }

  return (
    <div className={cn('relative w-full', className)} data-uipkge="" data-slot="mentions">
      <textarea
        ref={setRefs}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && filtered.length > 0 ? optionId(highlightedIndex) : undefined}
        className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-16 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onChange={onInput}
        onKeyDown={onKeyDown}
        onScroll={updateAnchor}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div style={anchorStyle} aria-hidden="true" />
        </PopoverAnchor>
        <PopoverContent align="start" sideOffset={4} className="w-64 p-1" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div id={listboxId}>
            {totalLoading ? (
              <div className="text-muted-foreground px-2 py-3 text-sm" role="status">
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-muted-foreground px-2 py-3 text-sm" role="status">
                No matches
              </div>
            ) : (
              <ul className="max-h-64 overflow-auto" role="listbox" aria-label="Mentions">
                {filtered.map((opt, i) => (
                  <li
                    id={optionId(i)}
                    key={opt.value}
                    role="option"
                    aria-selected={i === highlightedIndex}
                    aria-disabled={opt.disabled || undefined}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm',
                      i === highlightedIndex && !opt.disabled ? 'bg-accent text-accent-foreground' : '',
                      opt.disabled ? 'cursor-not-allowed opacity-50' : '',
                    )}
                    onMouseEnter={() => {
                      if (!opt.disabled) setHighlightedIndex(i)
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      if (!opt.disabled) insert(opt)
                    }}
                  >
                    {opt.avatar && <img src={opt.avatar} alt="" className="size-6 rounded-full" />}
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{opt.label}</div>
                      {opt.description && (
                        <div className="text-muted-foreground truncate text-xs">{opt.description}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// forwardRef erases the generic; the cast restores the generic call signature so
// consumers can still get type inference on `options`/`onSelect`.
const Mentions = React.forwardRef(MentionsInner) as <O extends MentionOption = MentionOption>(
  props: MentionsProps<O> & { ref?: React.ForwardedRef<HTMLTextAreaElement> },
) => React.ReactElement

export { Mentions }

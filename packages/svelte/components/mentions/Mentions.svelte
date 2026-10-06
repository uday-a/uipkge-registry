<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLTextareaAttributes } from 'svelte/elements'
  import type { MentionOption } from './index'

  // `onselect` is omitted: the native select-event handler collides with the
  // (option) select callback.
  export interface MentionsProps<O extends MentionOption = MentionOption>
    extends Omit<HTMLTextareaAttributes, 'value' | 'prefix' | 'onselect'> {
    value?: string
    onValueChange?: (value: string) => void
    options?: O[] | Record<string, O[]>
    triggers?: string[]
    triggerPrefixes?: Record<string, string>
    prefix?: string
    loading?: boolean
    loadOptions?: (query: string, trigger: string) => Promise<O[]>
    format?: (option: O, trigger: string) => string
    onselect?: (option: O) => void
    onsearch?: (payload: { trigger: string; query: string }) => void
    header?: Snippet<[{ trigger: string; query: string }]>
    loadingSnippet?: Snippet
    empty?: Snippet<[{ trigger: string; query: string }]>
    option?: Snippet<[{ option: O; index: number; active: boolean; trigger: string }]>
    footer?: Snippet<[{ trigger: string; count: number }]>
    ref?: HTMLTextAreaElement | null
  }

  let mentionIdCounter = 0
</script>

<script lang="ts" generics="O extends MentionOption">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { getCaretRect } from './caret-position'

  let {
    class: className,
    value = $bindable(''),
    onValueChange,
    options = [],
    triggers = ['@'],
    triggerPrefixes,
    prefix = '@',
    rows = 4,
    loading = false,
    loadOptions,
    format,
    placeholder = '',
    disabled = false,
    readonly = false,
    onselect,
    onsearch,
    header,
    loadingSnippet,
    empty,
    option,
    footer,
    oninput,
    onkeydown,
    onscroll,
    ref = $bindable(null),
    ...restProps
  }: MentionsProps<O> = $props()

  const listboxId = `mentions-listbox-${++mentionIdCounter}`
  function optionId(i: number) {
    return `${listboxId}-opt-${i}`
  }

  let textarea: HTMLTextAreaElement | null = $state(null)
  let open = $state(false)
  let activeTrigger = $state('')
  let query = $state('')
  let triggerIndex = $state(-1)
  let highlightedIndex = $state(0)
  let asyncResults = $state<O[]>([])
  let isAsyncLoading = $state(false)
  // Caret-anchored dropdown offset relative to the wrapper.
  let anchorTop = $state(0)
  let anchorLeft = $state(0)

  $effect(() => {
    ref = textarea
  })

  const currentOptionsList = $derived.by((): O[] => {
    if (!options) return []
    if (Array.isArray(options)) return options as O[]
    if (typeof options === 'object') {
      const list = (options as Record<string, O[]>)[activeTrigger]
      return list ?? []
    }
    return []
  })

  const filtered = $derived.by((): O[] => {
    if (loadOptions) return asyncResults as O[]
    const source = currentOptionsList
    if (!query) return source
    const q = query.toLowerCase()
    return source.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.email && o.email.toLowerCase().includes(q)),
    )
  })

  const totalLoading = $derived(loading || isAsyncLoading)

  function findActiveMention(text: string, caret: number): { trigger: string; index: number; query: string } | null {
    for (let i = caret - 1; i >= 0; i--) {
      const ch = text[i]!
      if (triggers.includes(ch)) {
        const before = i === 0 ? '' : text[i - 1]!
        if (i === 0 || /\s/.test(before)) {
          return { trigger: ch, index: i, query: text.substring(i + 1, caret) }
        }
        return null
      }
      if (/\s/.test(ch)) return null
    }
    return null
  }

  function updateAnchor() {
    if (!textarea) return
    const rect = getCaretRect(textarea, textarea.selectionStart ?? 0)
    const wrap = textarea.getBoundingClientRect()
    // Position the panel just under the caret line, clamped inside the wrapper.
    anchorTop = Math.min(rect.top - wrap.top + rect.height + 4, Math.max(0, wrap.height - 8))
    anchorLeft = Math.max(0, Math.min(rect.left - wrap.left, Math.max(0, wrap.width - 256)))
  }

  let asyncToken = 0
  async function runAsync(trigger: string, q: string) {
    if (!loadOptions) return
    const token = ++asyncToken
    isAsyncLoading = true
    try {
      const results = await loadOptions(q, trigger)
      if (token === asyncToken) asyncResults = results
    } finally {
      if (token === asyncToken) isAsyncLoading = false
    }
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function scheduleAsync(trigger: string, q: string) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => runAsync(trigger, q), 200)
  }

  function firstEnabledIndex() {
    const i = filtered.findIndex((o) => !o.disabled)
    return i === -1 ? 0 : i
  }

  function handleInput(e: Event) {
    const ta = e.target as HTMLTextAreaElement
    value = ta.value
    onValueChange?.(value)

    const match = findActiveMention(ta.value, ta.selectionStart ?? 0)
    if (match) {
      open = true
      activeTrigger = match.trigger
      triggerIndex = match.index
      query = match.query
      highlightedIndex = firstEnabledIndex()
      onsearch?.({ trigger: match.trigger, query: match.query })
      if (loadOptions) scheduleAsync(match.trigger, match.query)
      tick().then(updateAnchor)
    } else {
      open = false
    }
  }

  function moveHighlight(delta: number) {
    const len = filtered.length
    if (len === 0) return
    let i = highlightedIndex
    for (let n = 0; n < len; n++) {
      i = (i + delta + len) % len
      if (!filtered[i]?.disabled) {
        highlightedIndex = i
        tick().then(() => {
          document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' })
        })
        return
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (open) {
      // Escape must work even when there are no matches / still loading.
      if (e.key === 'Escape') {
        e.preventDefault()
        open = false
      } else if (filtered.length > 0) {
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
    }
  }

  function defaultFormat(opt: O, trigger: string) {
    const resolvedPrefix = triggerPrefixes?.[trigger] ?? trigger ?? prefix ?? '@'
    return `${resolvedPrefix}${opt.value} `
  }

  function insert(opt: O) {
    const ta = textarea
    if (!ta) return
    const caret = ta.selectionStart ?? 0
    const before = value.substring(0, triggerIndex)
    const after = value.substring(caret)
    const token = (format ?? defaultFormat)(opt, activeTrigger)
    value = before + token + after
    onValueChange?.(value)
    onselect?.(opt)
    open = false
    tick().then(() => {
      const pos = before.length + token.length
      ta.focus()
      ta.setSelectionRange(pos, pos)
    })
  }

  // Close on outside pointer down (the hand-rolled dropdown has no portal).
  $effect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (textarea && !textarea.parentElement?.contains(e.target as Node)) open = false
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  })

  $effect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  })
</script>

<div class={cn('relative w-full', className)} data-uipkge="" data-slot="mentions">
  <textarea
    bind:this={textarea}
    {value}
    {rows}
    {placeholder}
    {disabled}
    {readonly}
    role="combobox"
    aria-autocomplete="list"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listboxId}
    aria-activedescendant={open && filtered.length > 0 ? optionId(highlightedIndex) : undefined}
    class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-16 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    oninput={(e) => {
      handleInput(e)
      oninput?.(e)
    }}
    onkeydown={(e) => {
      handleKeydown(e)
      onkeydown?.(e)
    }}
    onscroll={(e) => {
      updateAnchor()
      onscroll?.(e)
    }}
    {...restProps}
  ></textarea>
  {#if open}
    <!-- Hand-rolled replacement for Popover + PopoverAnchor + PopoverContent:
         no headless float library is installed in the Svelte registry yet, so
         the listbox is absolutely positioned at the caret inside the wrapper. -->
    <div
      data-slot="mentions-content"
      role="presentation"
      class="bg-popover text-popover-foreground border-border/80 absolute z-50 w-64 rounded-lg border p-1 shadow-md"
      style:top="{anchorTop}px"
      style:left="{anchorLeft}px"
    >
      <div id={listboxId}>
        {#if header}
          {@render header({ trigger: activeTrigger, query })}
        {/if}

        {#if totalLoading}
          <div class="text-muted-foreground px-2 py-3 text-sm" role="status">
            {#if loadingSnippet}
              {@render loadingSnippet()}
            {:else}
              Loading...
            {/if}
          </div>
        {:else if filtered.length === 0}
          <div class="text-muted-foreground px-2 py-3 text-sm" role="status">
            {#if empty}
              {@render empty({ trigger: activeTrigger, query })}
            {:else}
              No matches
            {/if}
          </div>
        {:else}
          <ul class="max-h-64 overflow-auto" role="listbox" aria-label="Mentions">
            {#each filtered as opt, i (opt.value)}
              <li
                id={optionId(i)}
                role="option"
                aria-selected={i === highlightedIndex}
                aria-disabled={opt.disabled || undefined}
                class={[
                  'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  i === highlightedIndex && !opt.disabled ? 'bg-accent text-accent-foreground' : '',
                  opt.disabled ? 'cursor-not-allowed opacity-50' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onmouseenter={() => {
                  if (!opt.disabled) highlightedIndex = i
                }}
                onmousedown={(e) => {
                  e.preventDefault()
                  if (!opt.disabled) insert(opt)
                }}
              >
                {#if option}
                  {@render option({ option: opt, index: i, active: i === highlightedIndex, trigger: activeTrigger })}
                {:else}
                  {#if opt.avatar}
                    <img src={opt.avatar} alt="" class="size-6 rounded-full object-cover" />
                  {/if}
                  <div class="min-w-0 flex-1">
                    <div class="truncate font-medium">{opt.label}</div>
                    {#if opt.description || opt.email}
                      <div class="text-muted-foreground truncate text-xs">
                        {opt.description || opt.email}
                      </div>
                    {/if}
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}

        {#if footer}
          {@render footer({ trigger: activeTrigger, count: filtered.length })}
        {/if}
      </div>
    </div>
  {/if}
</div>

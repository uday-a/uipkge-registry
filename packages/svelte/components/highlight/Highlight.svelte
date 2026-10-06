<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface HighlightProps extends HTMLAttributes<HTMLSpanElement> {
    /** Text to search within. */
    text: string
    /** Query string or RegExp to highlight. */
    query: string | RegExp
    /** HTML tag used to wrap matched substrings. Default 'mark'. */
    highlightTag?: 'mark' | 'span'
    /** Class applied to each highlight wrapper. */
    highlightClass?: string
    /** Inline style applied to each highlight wrapper. */
    highlightStyle?: string
    /** Case-sensitive matching. Default false. */
    caseSensitive?: boolean
    /** Match whole words only. Default false. */
    wholeWord?: boolean
    /** Cap the number of highlights rendered. 0 = unlimited. Default 0. */
    maxHighlights?: number
    /** Total match count before maxHighlights cap. Mirrors the Vue `matchCount` emit.
     *  NOTE: React's `onMatchCount` reports the *rendered* count instead — the
     *  React names for these two payloads are `onTotalMatchCount` (total) and
     *  `onMatchCount` (rendered), i.e. swapped relative to the Vue-legacy
     *  names kept here. Both payloads are available; pick by payload. */
    onMatchCount?: (count: number) => void
    /** Alias of `onMatchCount` under React's name: total matches before the
     *  `maxHighlights` cap (React `onTotalMatchCount` parity). */
    onTotalMatchCount?: (count: number) => void
    /** Highlights actually rendered after maxHighlights cap. Mirrors the Vue `renderedMatchCount` emit.
     *  Same payload as React's `onMatchCount` (rendered). */
    onRenderedMatchCount?: (count: number) => void
  }

  interface Segment {
    text: string
    match: boolean
  }

  function buildPattern(query: string | RegExp, caseSensitive: boolean, wholeWord: boolean): RegExp | null {
    if (!query) return null
    if (query instanceof RegExp) {
      const flags = query.flags.includes('g') ? query.flags : query.flags + 'g'
      return new RegExp(query.source, flags)
    }
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const body = wholeWord ? `\\b${escaped}\\b` : escaped
    return new RegExp(body, caseSensitive ? 'g' : 'gi')
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    text,
    query,
    highlightTag = 'mark',
    highlightClass,
    highlightStyle,
    caseSensitive = false,
    wholeWord = false,
    maxHighlights = 0,
    onMatchCount,
    onTotalMatchCount,
    onRenderedMatchCount,
    ...restProps
  }: HighlightProps = $props()

  const segments = $derived.by((): Segment[] => {
    if (!text) return []
    const pattern = buildPattern(query, caseSensitive, wholeWord)
    if (!pattern) return [{ text, match: false }]

    const out: Segment[] = []
    let last = 0
    let count = 0
    let m: RegExpExecArray | null
    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), match: false })
      out.push({ text: m[0], match: true })
      last = m.index + m[0].length
      count++
      if (maxHighlights > 0 && count >= maxHighlights) break
      if (m[0] === '') pattern.lastIndex++
    }
    if (last < text.length) out.push({ text: text.slice(last), match: false })

    return out
  })

  const totalMatchCount = $derived.by(() => {
    if (!text) return 0
    const pattern = buildPattern(query, caseSensitive, wholeWord)
    if (!pattern) return 0

    let total = 0
    let m: RegExpExecArray | null
    while ((m = pattern.exec(text)) !== null) {
      total++
      if (m[0] === '') pattern.lastIndex++
    }
    return total
  })

  const renderedMatchCount = $derived(segments.filter((s) => s.match).length)

  // Mirror the Vue emits (fired on mount + whenever the counts change). The
  // callbacks run untracked so inline parent closures don't retrigger the effect.
  $effect(() => {
    const total = totalMatchCount
    untrack(() => {
      onMatchCount?.(total)
      onTotalMatchCount?.(total)
    })
  })
  $effect(() => {
    const rendered = renderedMatchCount
    untrack(() => onRenderedMatchCount?.(rendered))
  })
</script>

<span data-uipkge data-slot="highlight" {...restProps} class={cn(className)}>
  {#each segments as seg, i (i)}
    {#if seg.match}
      <svelte:element
        this={highlightTag}
        data-slot="highlight-match"
        class={cn(
          'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground rounded px-0.5 font-medium',
          highlightClass,
        )}
        style={highlightStyle}
        >{seg.text}</svelte:element
      >
    {:else}
      {seg.text}
    {/if}
  {/each}
</span>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
    /** Source code to display. */
    code: string
    /** Language label shown in the header. */
    language?: string
    /** Render line numbers in the gutter. */
    showLineNumbers?: boolean
    /** Maximum height of the code body before scrolling kicks in. CSS length (e.g. '400px'). */
    maxHeight?: string
    /** Render expanded on first paint. Default true. */
    defaultExpanded?: boolean
    /** Show the language label / copy / collapse header. */
    showHeader?: boolean
  }

  export interface HighlightSegment {
    content: string
    style?: string
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { Check, ChevronDown, ChevronUp, Copy } from '@lucide/svelte'
  import { codeToTokens, type BundledLanguage, type ThemedToken } from 'shiki/bundle/web'
  import { cn } from '$lib/utils'
  import { Button } from '$lib/components/ui/button'

  let {
    class: className,
    code,
    language = 'vue',
    showLineNumbers = true,
    maxHeight = '400px',
    defaultExpanded = true,
    showHeader = true,
    ...restProps
  }: CodeBlockProps = $props()

  // Intentional one-shot seed: the header toggle owns expansion after mount.
  // svelte-ignore state_referenced_locally
  let isExpanded = $state(defaultExpanded)
  let copyStatus = $state<'idle' | 'copied' | 'error'>('idle')
  let highlightedSegments: HighlightSegment[] | null = $state(null)
  let copyResetTimer: ReturnType<typeof setTimeout> | undefined
  let highlightRequest = 0

  const bodyId = `code-block-${Math.random().toString(36).slice(2, 9)}`
  const lines = $derived(code.split('\n'))
  const bodyVisible = $derived(!showHeader || isExpanded)
  const copyLabel = $derived(copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Copy failed' : 'Copy')

  function serializeStyle(style: ThemedToken['htmlStyle']): string | undefined {
    if (!style) return undefined
    if (typeof style === 'string') return style
    return Object.entries(style)
      .map(([key, value]) => `${key}:${value}`)
      .join(';')
  }

  function toHighlightSegments(tokens: ThemedToken[][], source: string): HighlightSegment[] {
    const segments: HighlightSegment[] = []
    let cursor = 0

    for (const token of tokens.flat()) {
      if (token.offset > cursor) segments.push({ content: source.slice(cursor, token.offset) })
      segments.push({ content: token.content, style: serializeStyle(token.htmlStyle) })
      cursor = token.offset + token.content.length
    }

    if (cursor < source.length) segments.push({ content: source.slice(cursor) })
    return segments
  }

  $effect(() => {
    const source = code
    const lang = language
    const request = ++highlightRequest
    highlightedSegments = null

    // Fire-and-forget: the request counter guards against out-of-order
    // completion when code/language change in quick succession.
    codeToTokens(source, {
      lang: lang.toLowerCase() as BundledLanguage,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    }).then(
      ({ tokens }) => {
        if (request === highlightRequest) highlightedSegments = toHighlightSegments(tokens, source)
      },
      () => {
        if (request === highlightRequest) highlightedSegments = null
      },
    )
  })

  function scheduleCopyStatusReset() {
    clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => (copyStatus = 'idle'), 1600)
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code)
      copyStatus = 'copied'
    } catch (e) {
      copyStatus = 'error'
      console.warn('Clipboard write failed', e)
    } finally {
      scheduleCopyStatusReset()
    }
  }

  onDestroy(() => {
    highlightRequest++
    clearTimeout(copyResetTimer)
  })
</script>

<div
  data-uipkge
  data-slot="code-block"
  class={cn('group border-border bg-muted/20 relative overflow-hidden rounded-lg border', className)}
  {...restProps}
>
  <!-- Header -->
  {#if showHeader}
    <div class="border-border bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
      <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {language}
      </span>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="xs" class="h-7 gap-1.5 px-2" onclick={copyToClipboard}>
          {#if copyStatus === 'copied'}
            <Check class="text-success size-3" aria-hidden="true" />
          {:else}
            <Copy class="size-3" aria-hidden="true" />
          {/if}
          <span class={cn('text-xs', copyStatus === 'error' && 'text-destructive')} aria-live="polite" aria-atomic="true">
            {copyLabel}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="xs"
          class="h-7 gap-1.5 px-2"
          aria-expanded={isExpanded}
          aria-controls={bodyId}
          onclick={() => (isExpanded = !isExpanded)}
        >
          {#if isExpanded}
            <ChevronUp class="size-3" aria-hidden="true" />
          {:else}
            <ChevronDown class="size-3" aria-hidden="true" />
          {/if}
          <span class="text-xs">{isExpanded ? 'Hide' : 'Show'} code</span>
        </Button>
      </div>
    </div>
  {/if}

  <!-- Code body. Shiki token offsets let the highlighted spans preserve the
       original source exactly, including whitespace between tokens. -->
  <!-- Focusable scroll region with an accessible name, mirroring the Vue twin. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    id={bodyId}
    role="region"
    aria-label={`${language} code sample`}
    tabindex="0"
    class={cn(
      'bg-background/40 focus-visible:ring-ring overflow-auto font-mono text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
      !bodyVisible && 'hidden',
    )}
    style="max-height: {maxHeight};"
  >
    <div class="flex w-max min-w-full">
      {#if showLineNumbers}
        <div
          aria-hidden="true"
          class="text-muted-foreground/60 border-border/60 bg-muted/30 sticky left-0 border-r px-3 py-3 text-right tabular-nums select-none"
        >
          {#each lines as _, i (i)}
            <span class="block">{i + 1}</span>
          {/each}
        </div>
      {/if}
      <pre class="m-0 min-w-max flex-1"><code class="block cursor-text whitespace-pre px-4 py-3">{#if highlightedSegments}{#each highlightedSegments as segment, i (i)}<span
              data-syntax-token
              class="text-[var(--shiki-light)] dark:text-[var(--shiki-dark)]"
              style={segment.style}
            >{segment.content}</span>{/each}{:else}{code}{/if}</code></pre>
    </div>
  </div>
</div>

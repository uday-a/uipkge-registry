<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TerminalLine {
    /** Prompt prefix shown before the command. Omit for output-only lines. */
    prompt?: string
    /** Command text shown after the prompt. */
    command?: string
    /** Output lines rendered below the command. */
    output?: string
    /** Override the line type: 'command' renders prompt+command, 'output' renders plain text. */
    type?: 'command' | 'output'
  }

  export interface ResolvedTerminalLine {
    prompt: string
    command?: string
    output?: string
    type: 'command' | 'output'
  }

  export interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
    /** Command history to render. */
    lines: TerminalLine[]
    /** Window title shown in the title bar. Default 'bash'. */
    title?: string
    /** Prompt character. Default '$'. */
    promptChar?: string
    /** Color theme. Default 'dark'. */
    theme?: 'dark' | 'light'
    /** Auto-scroll to bottom when new lines arrive. Default true. */
    autoScroll?: boolean
    /** Animate lines typing in one-by-one. Default false. */
    typing?: boolean
    /** Typing speed in ms per line. Default 120. */
    typingSpeed?: number
    /** Max height before scrolling. Default '400px'. */
    maxHeight?: string
    /** Custom line renderer — the Svelte counterpart of the Vue `line` slot. */
    line?: Snippet<[{ line: ResolvedTerminalLine; index: number }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    lines,
    title = 'bash',
    promptChar = '$',
    theme = 'dark',
    autoScroll = true,
    typing = false,
    typingSpeed = 120,
    maxHeight = '400px',
    class: className,
    line,
    ref = $bindable(null),
    ...restProps
  }: TerminalProps = $props()

  let bodyEl: HTMLDivElement | null = $state(null)
  // Settled by the effect below on mount and whenever lines change.
  let visibleCount = $state(0)

  const resolvedLines: ResolvedTerminalLine[] = $derived(
    lines.map((l) => ({
      ...l,
      type: l.type ?? (l.prompt || l.command ? 'command' : 'output'),
      prompt: l.prompt ?? (l.type === 'output' ? '' : promptChar),
    })),
  )

  const shownLines = $derived(resolvedLines.slice(0, visibleCount))

  function scrollToBottom() {
    if (!autoScroll || !bodyEl) return
    tick().then(() => {
      if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight
    })
  }

  $effect(() => {
    const len = lines.length
    if (typing) {
      // Reset typing animation when lines change.
      visibleCount = 0
      let cancelled = false
      let timer: ReturnType<typeof setTimeout>
      const tickFn = () => {
        if (cancelled) return
        if (visibleCount < len) {
          visibleCount++
          scrollToBottom()
          timer = setTimeout(tickFn, typingSpeed)
        }
      }
      timer = setTimeout(tickFn, typingSpeed)
      return () => {
        cancelled = true
        clearTimeout(timer)
      }
    } else {
      visibleCount = len
      scrollToBottom()
    }
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="terminal"
  data-theme={theme}
  class={cn(
    'relative overflow-hidden rounded-lg border font-mono text-sm shadow-sm',
    theme === 'dark' ? 'bg-card text-card-foreground border-border' : 'bg-muted border-border',
    className,
  )}
  {...restProps}
>
  <!-- Title bar -->
  <div class={cn('flex items-center gap-2 border-b px-4 py-2.5', 'border-border bg-muted')}>
    <div class="flex gap-1.5">
      <span class="bg-destructive size-3 rounded-full"></span>
      <span class="bg-warning size-3 rounded-full"></span>
      <span class="bg-success size-3 rounded-full"></span>
    </div>
    <span class={cn('text-muted-foreground ml-2 text-xs')}>{title}</span>
  </div>

  <!-- Body -->
  <div bind:this={bodyEl} class="overflow-auto p-4 leading-relaxed" style:max-height={maxHeight}>
    {#each shownLines as resolvedLine, i (i)}
      <div data-slot="terminal-line" class="break-words whitespace-pre-wrap">
        {#if line}
          {@render line({ line: resolvedLine, index: i })}
        {:else}
          {#if resolvedLine.type === 'command'}
            <div data-slot="terminal-command" class="flex flex-wrap items-baseline gap-x-1.5">
              <span class={cn('text-success shrink-0 font-semibold')}>{resolvedLine.prompt}</span>
              <span>{resolvedLine.command}</span>
            </div>
          {/if}
          {#if resolvedLine.output}
            <div data-slot="terminal-output" class="text-muted-foreground">{resolvedLine.output}</div>
          {/if}
        {/if}
      </div>
    {/each}
  </div>
</div>

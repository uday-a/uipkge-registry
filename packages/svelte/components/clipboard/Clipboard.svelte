<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export type ClipboardState = 'idle' | 'success' | 'error'

  // `oncopy` / `onerror` intentionally shadow the DOM clipboard/error event
  // handlers: this button fires copy-lifecycle callbacks, not DOM events.
  export interface ClipboardProps extends Omit<HTMLButtonAttributes, 'oncopy' | 'onerror' | 'children'> {
    /** Text to copy to the clipboard. */
    text?: string
    /** Optional visible label next to the icon. */
    label?: string
    /** Hide the copy icon (useful when a label is shown). */
    hideIcon?: boolean
    /** Tooltip text shown on hover before copying. */
    tooltip?: string
    /** Feedback text shown after a successful copy. */
    successText?: string
    /** Feedback text shown after a failed copy. */
    errorText?: string
    /** How long (ms) the success/error feedback stays before resetting. */
    timeout?: number
    /** Show the feedback as a tooltip rather than swapping the icon. */
    feedbackTooltip?: boolean
    /** The rendered button, via `bind:ref`. */
    ref?: HTMLButtonElement | null
    /** Custom copy UI. Receives `{ state }`. */
    children?: Snippet<[{ state: ClipboardState }]>
    /** Fires when a copy is attempted. */
    oncopy?: (text: string) => void
    /** Fires after a successful copy. */
    onsuccess?: (text: string) => void
    /** Fires after a failed copy. */
    onerror?: (error: Error) => void
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { Check, Copy } from '@lucide/svelte'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '$lib/components/ui/tooltip'
  import { cn } from '$lib/utils'

  let {
    class: className,
    text = '',
    label = '',
    disabled = false,
    hideIcon = false,
    tooltip = 'Copy',
    successText = 'Copied!',
    errorText = 'Failed',
    timeout = 2000,
    feedbackTooltip = true,
    ref = $bindable(null),
    children,
    oncopy,
    onsuccess,
    onerror,
    ...restProps
  }: ClipboardProps = $props()

  let state = $state<ClipboardState>('idle')
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function setFeedback(nextState: ClipboardState) {
    state = nextState
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      state = 'idle'
    }, timeout)
  }

  async function copy() {
    if (disabled) return
    const value = text
    oncopy?.(value)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        // Legacy fallback for non-secure contexts.
        const ta = document.createElement('textarea')
        ta.value = value
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        if (!ok) throw new Error('execCommand copy failed')
      }
      setFeedback('success')
      onsuccess?.(value)
    } catch (err) {
      setFeedback('error')
      onerror?.(err as Error)
    }
  }

  const currentTooltip = $derived(state === 'success' ? successText : state === 'error' ? errorText : tooltip)

  onDestroy(() => {
    if (resetTimer) clearTimeout(resetTimer)
  })
</script>

<TooltipProvider delayDuration={300}>
  <Tooltip>
    <TooltipTrigger>
      {#snippet child({ props }: { props: Record<string, unknown> })}
        <button
          bind:this={ref}
          type="button"
          {...props}
          data-uipkge
          data-slot="clipboard"
          data-feedback-state={state}
          {disabled}
          class={cn(
            'inline-flex items-center gap-2 rounded-md text-sm transition-colors',
            'text-muted-foreground hover:text-foreground',
            'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          aria-label={currentTooltip}
          onclick={(e) => {
            // Preserve a trigger-provided click handler (e.g. click-to-open
            // tooltips) alongside the copy action.
            const triggerClick = props.onclick as ((e: MouseEvent) => void) | undefined
            triggerClick?.(e)
            copy()
          }}
          {...restProps}
        >
          {#if !hideIcon}
            <span data-slot="clipboard-icon" class="inline-flex">
              {#if state === 'success'}
                <Check class="size-4 text-emerald-500" />
              {:else}
                <Copy class="size-4" />
              {/if}
            </span>
          {/if}
          {#if label}
            <span data-slot="clipboard-label">{label}</span>
          {/if}
          {@render children?.({ state })}
        </button>
      {/snippet}
    </TooltipTrigger>
    {#if feedbackTooltip || state === 'idle'}
      <TooltipContent>
        {currentTooltip}
      </TooltipContent>
    {/if}
  </Tooltip>
</TooltipProvider>

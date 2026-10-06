<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BlockUiProps extends HTMLAttributes<HTMLDivElement> {
    /** Primary blocked API (React `blocking` parity). Bind it (`bind:blocking`). Wins over `value` when both are set. */
    blocking?: boolean
    /** Blocked state. Bind it (`bind:value`) to toggle from the parent.
     * @deprecated Use `blocking`. Kept as an alias — both stay functional. */
    value?: boolean
    message?: string
    opacity?: number
    overlayColor?: string
    blur?: boolean
    showSpinner?: boolean
    /** Override the default spinner icon. */
    icon?: Snippet
    /** Rich message content. Wins over the `message` string when provided. */
    messageSnippet?: Snippet
    /** The wrapper <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { fade } from 'svelte/transition'
  import { cn } from '$lib/utils'
  import { Spinner } from '$lib/components/ui/spinner'
  import { blockUiVariants } from './block-ui.variants'

  let {
    class: className,
    blocking = $bindable<boolean | undefined>(),
    value = $bindable<boolean | undefined>(),
    message = 'Loading...',
    opacity = 0.6,
    overlayColor = '',
    blur = false,
    showSpinner = true,
    icon,
    messageSnippet,
    children,
    ref = $bindable(null),
    ...restProps
  }: BlockUiProps = $props()

  const blocked = $derived(blocking ?? value ?? false)

  const overlayStyle = $derived(
    `--block-ui-opacity: ${opacity}; opacity: var(--block-ui-opacity)${overlayColor ? `; background-color: ${overlayColor}` : ''}`,
  )
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="block-ui"
  data-blocked={blocked ? '' : undefined}
  class={cn(blockUiVariants(), className)}
  {...restProps}
>
  <!-- Wrapped content — always non-interactive while blocked (not only when blur is on). -->
  <div
    class={cn('block-ui-content', blocked && 'pointer-events-none', blur && blocked && 'blur-sm transition-[filter]')}
    inert={blocked || undefined}
    aria-hidden={blocked || undefined}
  >
    {@render children?.()}
  </div>

  <!-- Blocking overlay -->
  {#if blocked}
    <div
      class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
      transition:fade={{ duration: 200 }}
    >
      <!-- Background layer (opacity only affects this layer) -->
      <div class="absolute inset-0" class:bg-background={!overlayColor} style={overlayStyle}></div>
      <!-- Content layer (spinner + message stay fully opaque) -->
      {#if icon}
        {@render icon()}
      {:else if showSpinner}
        <Spinner size="lg" />
      {/if}
      <!-- Message snippet may contain block markup — keep it out of a <p>. -->
      {#if messageSnippet}
        <div class="text-foreground text-sm font-medium">
          {@render messageSnippet()}
        </div>
      {:else if message}
        <p class="text-foreground text-sm font-medium">{message}</p>
      {/if}
    </div>
  {/if}
</div>

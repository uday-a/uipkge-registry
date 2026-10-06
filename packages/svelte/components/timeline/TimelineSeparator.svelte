<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TimelineSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    hideConnector?: boolean
    /** Custom marker dot — the Svelte counterpart of the Vue `dot` slot. */
    dot?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getTimelineItemContext } from './context.svelte'

  let {
    class: className,
    hideConnector = false,
    dot,
    ref = $bindable(null),
    ...restProps
  }: TimelineSeparatorProps = $props()

  const item = getTimelineItemContext()
  const direction = $derived(item?.direction ?? 'vertical')
  const isLast = $derived(item?.isLast ?? true)
  const showConnector = $derived(!hideConnector && !isLast)
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="timeline-separator"
  class={cn(
    'relative flex shrink-0 items-center',
    direction === 'vertical' ? 'w-4 flex-col self-stretch' : 'h-4 flex-row items-center self-stretch',
    className,
  )}
  {...restProps}
>
  <div
    data-slot="timeline-separator-marker"
    class="bg-primary ring-background relative z-10 flex size-4 items-center justify-center rounded-full shadow-2xs ring-4"
  >
    {#if dot}
      {@render dot()}
    {:else}
      <div class="bg-primary-foreground size-1.5 rounded-full"></div>
    {/if}
  </div>

  {#if showConnector}
    <div
      aria-hidden="true"
      data-slot="timeline-media-connector"
      class={cn('bg-border', direction === 'vertical' ? 'my-1.5 w-0.5 flex-1' : 'mx-1.5 h-0.5 flex-1')}
    ></div>
  {/if}
</div>

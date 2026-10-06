<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface CalendarPrevButtonProps extends HTMLButtonAttributes {
    /** Overrides the default chevron icon. */
    icon?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronLeft } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { Button } from '$lib/components/ui/button'
  import { buttonVariants } from '$lib/components/ui/button/button.variants'
  import { CALENDAR_CONTEXT_KEY, type CalendarState } from './calendar-state.svelte'

  let { class: className, icon, children, ref = $bindable(null), ...restProps }: CalendarPrevButtonProps = $props()

  const state = getContext<CalendarState | undefined>(CALENDAR_CONTEXT_KEY)
</script>

<Button
  type="button"
  variant="outline"
  bind:ref
  data-slot="calendar-prev-button"
  aria-label="Previous month"
  disabled={state ? !state.canGoPrev : undefined}
  class={cn(
    buttonVariants({ variant: 'outline' }),
    'size-9 bg-transparent p-0 opacity-70 hover:opacity-100 focus-visible:opacity-100',
    className,
  )}
  onclick={() => state?.goPrev()}
  {...restProps}
>
  {#if icon}
    {@render icon()}
  {:else if children}
    {@render children()}
  {:else}
    <ChevronLeft class="size-4" aria-hidden="true" />
  {/if}
</Button>

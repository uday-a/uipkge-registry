<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface KanbanColumnAddProps extends HTMLButtonAttributes {
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { Plus } from '@lucide/svelte'

  let {
    class: className,
    type = 'button',
    children,
    ref = $bindable(null),
    ...restProps
  }: KanbanColumnAddProps = $props()
</script>

<button
  bind:this={ref}
  {type}
  data-slot="kanban-column-add"
  class={cn(
    'text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none',
    className,
  )}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <Plus class="size-3.5" />
  {/if}
</button>

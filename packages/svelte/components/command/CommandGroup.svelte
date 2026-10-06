<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
    heading?: string
    ref?: HTMLDivElement | null
  }

  let commandGroupIdCounter = 0
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { getCommandContext, setCommandGroupContext } from './context'

  let { class: className, heading, children, ref = $bindable(null), ...restProps }: CommandGroupProps = $props()

  commandGroupIdCounter += 1
  const id = `g${commandGroupIdCounter}`

  const ctx = getCommandContext()
  setCommandGroupContext(id)

  $effect(() => {
    // untrack: keep the register write from subscribing this effect to the
    // command's group map (effect_update_depth_exceeded). Registration is idempotent.
    untrack(() => ctx.registerGroup(id))
    return () => ctx.unregisterGroup(id)
  })

  const visible = $derived(ctx.isGroupVisible(id))
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="command-group"
  role="group"
  aria-label={heading}
  hidden={!visible}
  class={cn('text-foreground overflow-hidden p-1', className)}
  {...restProps}
>
  {#if heading}
    <div data-uipkge data-slot="command-group-heading" class="text-muted-foreground px-2 py-1.5 text-xs font-medium">
      {heading}
    </div>
  {/if}
  {@render children?.()}
</div>

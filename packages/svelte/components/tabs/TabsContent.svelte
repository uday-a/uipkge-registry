<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    forceMount?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getTabsContext } from './context'

  let { class: className, value, forceMount = false, children, ref = $bindable(null), ...restProps }: TabsContentProps =
    $props()

  const ctx = getTabsContext()
  const isActive = $derived(ctx?.current() === value)
</script>

{#if forceMount || isActive}
  <div
    bind:this={ref}
    role="tabpanel"
    id={ctx?.contentId(value)}
    aria-labelledby={ctx?.triggerId(value)}
    tabindex={0}
    hidden={!isActive || undefined}
    data-uipkge=""
    data-slot="tabs-content"
    data-state={isActive ? 'active' : 'inactive'}
    class={cn(
      'ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:blur-in-2 motion-safe:data-[state=active]:slide-in-from-bottom-1 motion-safe:data-[state=active]:ease-emphasized flex-1 focus-visible:ring-2 focus-visible:ring-[3px] focus-visible:outline-none motion-safe:data-[state=active]:duration-200',
      className,
    )}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

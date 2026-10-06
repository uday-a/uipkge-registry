<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface VerticalTabsTriggerProps extends HTMLButtonAttributes {
    children?: Snippet
    value: string
    disabled?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getVerticalTabsContext, sanitizeId } from './VerticalTabs.svelte'

  let { children, value, disabled = false, class: className, ...restProps }: VerticalTabsTriggerProps = $props()

  const ctx = getVerticalTabsContext('VerticalTabsTrigger')

  const active = $derived(ctx.getValue() === value)
  const triggerId = $derived(`${ctx.rootId}-trigger-${sanitizeId(value)}`)
  const contentId = $derived(`${ctx.rootId}-content-${sanitizeId(value)}`)

  function handleClick() {
    if (!disabled) ctx.select(value)
  }
</script>

<button
  type="button"
  data-uipkge
  data-slot="vertical-tabs-trigger"
  data-value={value}
  data-state={active ? 'active' : 'inactive'}
  data-disabled={disabled ? '' : undefined}
  id={triggerId}
  role="tab"
  aria-selected={active}
  aria-controls={contentId}
  tabindex={active ? 0 : -1}
  {disabled}
  class={cn(
    // z-10 keeps label above the sliding indicator; active surface paints on the list
    // indicator when the parent list has data-animated=true. Static active chrome
    // restores when data-animated=false (group-data variants below).
    'group/trigger text-muted-foreground relative z-10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-[color,background-color] duration-150',
    'hover:bg-muted/60 hover:text-foreground',
    'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=active]:text-foreground',
    'group-data-[animated=false]/list:data-[state=active]:bg-muted',
    // Static primary rail (only when list animation is off).
    `before:bg-primary before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:opacity-0 before:content-['']`,
    'group-data-[animated=false]/list:data-[state=active]:before:opacity-100',
    '[&>svg]:size-4 [&>svg]:shrink-0',
    className,
  )}
  onclick={handleClick}
  {...restProps}
>
  {@render children?.()}
</button>

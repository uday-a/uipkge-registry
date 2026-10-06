<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CommandItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Unique value for the item. Used for selection and as the filter fallback. */
    value?: string
    /** Extra search terms passed to a custom `filter` — mirrors cmdk item `keywords`. */
    keywords?: string[]
    disabled?: boolean
    onSelect?: (value: string) => void
    ref?: HTMLDivElement | null
  }

  let commandItemIdCounter = 0
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { getCommandContext, getCommandGroupContext } from './context'

  let {
    class: className,
    value: valueProp = '',
    keywords,
    disabled = false,
    onSelect,
    children,
    ref = $bindable(null),
    onclick,
    onmouseenter,
    ...restProps
  }: CommandItemProps = $props()

  commandItemIdCounter += 1
  const id = `c${commandItemIdCounter}`

  const ctx = getCommandContext()
  const groupId = getCommandGroupContext()

  $effect(() => {
    const text = ref?.textContent ?? valueProp ?? ''
    // untrack: the register write must not subscribe this effect to the
    // command's item map (effect_update_depth_exceeded). Registration is idempotent.
    untrack(() =>
      ctx.registerItem(id, {
        value: valueProp,
        text,
        disabled,
        groupId,
        keywords,
        onSelect: (v) => onSelect?.(v),
      }),
    )
    return () => ctx.unregisterItem(id)
  })

  const visible = $derived(ctx.isItemVisible(id))
  const highlighted = $derived(ctx.isHighlighted(id))

  type OnClick = NonNullable<HTMLAttributes<HTMLDivElement>['onclick']>
  type OnMouseEnter = NonNullable<HTMLAttributes<HTMLDivElement>['onmouseenter']>

  const handleClick: OnClick = (e) => {
    onclick?.(e)
    if (e.defaultPrevented || disabled) return
    ctx.selectItem(id)
  }

  const handleMouseEnter: OnMouseEnter = (e) => {
    onmouseenter?.(e)
    if (!disabled) ctx.setHighlighted(id)
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="command-item"
  role="option"
  id={`${ctx.listId}-item-${id}`}
  data-command-item-id={id}
  data-value={valueProp}
  data-highlighted={highlighted ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  aria-selected={highlighted}
  aria-disabled={disabled || undefined}
  hidden={!visible}
  class={cn(
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
>
  {@render children?.()}
</div>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuTriggerProps extends HTMLAttributes<HTMLSpanElement> {
    disabled?: boolean
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { getContextMenuContext } from './context'

  type OnContextMenu = NonNullable<HTMLAttributes<HTMLSpanElement>['oncontextmenu']>

  let {
    class: className,
    disabled = false,
    children,
    ref = $bindable(null),
    oncontextmenu,
    ...restProps
  }: ContextMenuTriggerProps = $props()

  const ctx = getContextMenuContext()

  $effect(() => {
    ctx.registerTrigger(ref)
    return () => ctx.registerTrigger(null)
  })

  const handleContextMenu: OnContextMenu = (e) => {
    oncontextmenu?.(e)
    if (e.defaultPrevented || disabled) return
    e.preventDefault()
    ctx.openAt({ x: e.clientX, y: e.clientY })
  }
</script>

<span
  bind:this={ref}
  data-uipkge
  data-slot="context-menu-trigger"
  data-state={ctx.open ? 'open' : 'closed'}
  data-disabled={disabled ? '' : undefined}
  class={className}
  {...restProps}
  oncontextmenu={handleContextMenu}
>
  {@render children?.()}
</span>

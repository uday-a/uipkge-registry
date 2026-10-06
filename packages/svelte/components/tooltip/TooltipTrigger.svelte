<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type SpanAttrs = HTMLAttributes<HTMLSpanElement>
  type TriggerPointerEvent = Parameters<NonNullable<SpanAttrs['onpointerenter']>>[0]
  type TriggerFocusEvent = Parameters<NonNullable<SpanAttrs['onfocus']>>[0]
  type TriggerKeydownEvent = Parameters<NonNullable<SpanAttrs['onkeydown']>>[0]

  export interface TooltipTriggerProps extends HTMLAttributes<HTMLSpanElement> {
    /** Render your own element with the trigger handlers instead of the
     *  default wrapping span — the Svelte counterpart of `asChild`. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getTooltipRootState } from './context.svelte'

  let {
    class: className,
    child,
    children,
    ref = $bindable(null),
    onpointerenter,
    onpointerleave,
    onfocus,
    onblur,
    onkeydown,
    ...restProps
  }: TooltipTriggerProps = $props()

  const root = getTooltipRootState()
  const describedBy = $derived(root?.open ? root.id : undefined)

  function handlePointerEnter(event: TriggerPointerEvent) {
    onpointerenter?.(event)
    if (!event.defaultPrevented) root?.scheduleOpen()
  }

  function handlePointerLeave(event: TriggerPointerEvent) {
    onpointerleave?.(event)
    if (!event.defaultPrevented) root?.cancelScheduledOpen()
  }

  function handleFocus(event: TriggerFocusEvent) {
    onfocus?.(event)
    if (!event.defaultPrevented) root?.setOpen(true)
  }

  function handleBlur(event: TriggerFocusEvent) {
    onblur?.(event)
    if (!event.defaultPrevented) root?.setOpen(false)
  }

  function handleKeydown(event: TriggerKeydownEvent) {
    onkeydown?.(event)
    if (event.key === 'Escape' && root?.open) root.setOpen(false)
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'tooltip-trigger',
    'data-state': root?.open ? 'open' : 'closed',
    'aria-describedby': describedBy,
    class: cn('inline-block', className),
    onpointerenter: handlePointerEnter,
    onpointerleave: handlePointerLeave,
    onfocus: handleFocus,
    onblur: handleBlur,
    onkeydown: handleKeydown,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <!-- The wrapper span lets tooltips fire on disabled controls inside it.
       Positioning anchors to the Tooltip root, not this span. -->
  <span bind:this={ref} {...mergedProps}>
    {@render children?.()}
  </span>
{/if}

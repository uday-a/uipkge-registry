<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface PopoverTriggerProps extends HTMLButtonAttributes {
    /** Render your own element with the trigger's props instead of emitting a
     *  <button> — the Svelte counterpart of React's `asChild`. Spread `props`
     *  onto your element. Positioning anchors to the wrapping span. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from './context'

  const ctx = getContext<PopoverContextValue>(POPOVER_CONTEXT_KEY)

  let {
    class: className,
    type = 'button',
    child,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: PopoverTriggerProps = $props()

  const isOpen = $derived(ctx.isOpen())

  // In child mode the node is the `contents` wrapper span, which has no box and
  // can't take focus — register the consumer's element (its first child)
  // instead, so positioning, outside-click and focus return use the real
  // trigger, as with React's asChild.
  function registerTrigger(node: HTMLElement) {
    const el = (child ? (node.firstElementChild as HTMLElement | null) : null) ?? node
    ctx.registerTrigger(el)
    return {
      destroy: () => ctx.unregisterTrigger(el),
    }
  }

  function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    onclick?.(e)
    if (e.defaultPrevented) return
    ctx.toggle()
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'popover-trigger',
    id: ctx.triggerId,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
    'aria-controls': ctx.contentId,
    'data-state': isOpen ? 'open' : 'closed',
    class: cn(className),
    onclick: handleClick,
    ...restProps,
  })
</script>

{#if child}
  <!-- `contents` keeps this wrapper out of layout, so the consumer's element
       sits in its parent's flex/grid exactly like React's asChild. -->
  <span use:registerTrigger data-uipkge="" data-slot="popover-trigger" class="contents">
    {@render child({ props: mergedProps })}
  </span>
{:else}
  <button use:registerTrigger bind:this={ref} {type} {...mergedProps}>{@render children?.()}</button>
{/if}

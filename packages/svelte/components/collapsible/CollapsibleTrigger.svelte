<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface CollapsibleTriggerProps extends HTMLButtonAttributes {
    /**
     * Render your own element with the trigger's props instead of emitting a
     * `<button>` — the Svelte counterpart of React's `asChild`. Spread `props`
     * onto your element.
     */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    /** The rendered `<button>`, via `bind:ref`. Stays null in `child` mode. */
    ref?: HTMLButtonElement | null
    children?: Snippet
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import type { MouseEventHandler } from 'svelte/elements'
  import type { CollapsibleContext } from './Collapsible.svelte'

  let { child, ref = $bindable(null), children, onclick: onclickProp, ...restProps }: CollapsibleTriggerProps =
    $props()

  const ctx = getContext<CollapsibleContext | null>('collapsibleContext')

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    ctx?.toggle()
    onclickProp?.(event)
  }

  // `onclick` is chained (toggle + consumer handler) so `child` buttons work
  // with a bare `{...props}` spread. It is safe to list before `...restProps`
  // — the consumer's own `onclick` was destructured out as `onclickProp`.
  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'collapsible-trigger',
    'data-state': ctx?.isOpen ? 'open' : 'closed',
    'aria-expanded': ctx?.isOpen ?? false,
    'aria-controls': ctx?.contentId,
    disabled: ctx?.disabled,
    onclick: handleClick,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button bind:this={ref} type="button" {...mergedProps}>
    {@render children?.()}
  </button>
{/if}

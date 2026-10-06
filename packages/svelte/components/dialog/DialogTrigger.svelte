<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface DialogTriggerProps extends HTMLButtonAttributes {
    /** Render your own element as the trigger instead of a <button>. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getDialogContext } from './context'

  type OnClick = NonNullable<HTMLButtonAttributes['onclick']>

  let {
    class: className,
    type = 'button',
    child,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: DialogTriggerProps = $props()

  const ctx = getDialogContext()

  const openDialog: OnClick = (e) => {
    onclick?.(e)
    if (e.defaultPrevented) return
    ctx.setOpen(true)
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'dialog-trigger',
    class: className,
    type,
    onclick: openDialog,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button bind:this={ref} {...mergedProps}>{@render children?.()}</button>
{/if}

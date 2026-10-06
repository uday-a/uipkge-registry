<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface DialogCloseProps extends HTMLButtonAttributes {
    /** Render your own element as the close control instead of a <button>. */
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
  }: DialogCloseProps = $props()

  const ctx = getDialogContext()

  const closeDialog: OnClick = (e) => {
    onclick?.(e)
    if (e.defaultPrevented) return
    ctx.setOpen(false)
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'dialog-close',
    class: className,
    type,
    onclick: closeDialog,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button bind:this={ref} {...mergedProps}>{@render children?.()}</button>
{/if}

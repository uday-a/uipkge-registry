<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface SheetCloseProps extends HTMLButtonAttributes {
    /** Render your own element that closes the sheet — spread `props` onto it. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getSheetContext } from './context'

  let {
    class: className,
    child,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: SheetCloseProps = $props()

  const ctx = getSheetContext()

  function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    ctx?.setOpen(false)
    onclick?.(e)
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'sheet-close',
    class: cn(className),
    onclick: handleClick,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button bind:this={ref} type="button" {...mergedProps}>{@render children?.()}</button>
{/if}

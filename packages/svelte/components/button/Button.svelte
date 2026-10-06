<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { ButtonVariants } from './button.variants'

  export interface ButtonProps extends HTMLButtonAttributes {
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    /** Render your own element with the button's props and styles instead of
     *  emitting a <button> — the Svelte counterpart of React's `asChild`. Use it
     *  to give an <a> full button styling: spread `props` onto your element. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    /** The rendered <button>, via `bind:ref`. Stays null in `child` mode — use
     *  `bind:this` on your own element there. */
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { buttonVariants } from './button.variants'

  let {
    class: className,
    variant = 'default',
    size = 'default',
    type = 'button',
    child,
    children,
    ref = $bindable(null),
    ...restProps
  }: ButtonProps = $props()

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'button',
    'data-variant': variant,
    'data-size': size,
    class: cn(buttonVariants({ variant, size }), className),
    ...restProps,
  })
</script>

{#if child}
  <!-- Default type="button" avoids accidental form submits. `child` leaves type
       to the consumer's element (e.g. <a>) and must not receive it. -->
  {@render child({ props: mergedProps })}
{:else}
  <button bind:this={ref} {type} {...mergedProps}>{@render children?.()}</button>
{/if}

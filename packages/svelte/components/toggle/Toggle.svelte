<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { ToggleVariants } from './toggle.variants'

  type ToggleClickEvent = Parameters<NonNullable<HTMLButtonAttributes['onclick']>>[0]

  export interface ToggleProps extends HTMLButtonAttributes {
    variant?: ToggleVariants['variant']
    size?: ToggleVariants['size']
    /** Controlled pressed state. Bind it for two-way updates. */
    pressed?: boolean
    /** Initial pressed state for uncontrolled use. */
    defaultPressed?: boolean
    /** Called with the new pressed state after every toggle. */
    onPressedChange?: (pressed: boolean) => void
    /** Render your own element with the toggle's props and styles instead of
     *  emitting a <button> — the Svelte counterpart of React's `asChild`. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { toggleVariants } from './toggle.variants'

  let {
    class: className,
    variant = 'default',
    size = 'default',
    defaultPressed = false,
    pressed = $bindable(defaultPressed),
    disabled = false,
    child,
    children,
    ref = $bindable(null),
    onPressedChange,
    onclick,
    ...restProps
  }: ToggleProps = $props()

  function handleClick(event: ToggleClickEvent) {
    if (disabled) return
    pressed = !pressed
    onPressedChange?.(pressed)
    onclick?.(event)
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'toggle',
    'data-variant': variant,
    'data-size': size,
    'data-state': pressed ? 'on' : 'off',
    'aria-pressed': pressed,
    disabled,
    class: cn(toggleVariants({ variant, size }), className),
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

<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface NumberFieldIncrementProps extends HTMLButtonAttributes {
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { Plus } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getNumberFieldContext } from './NumberFieldContext'

  let {
    class: className,
    disabled,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: NumberFieldIncrementProps = $props()

  const uiContext = getNumberFieldContext()
  const isRight = $derived(uiContext.getControlsPosition() === 'right')
  const size = $derived(uiContext.getSize())

  const iconSize = $derived(size === 'small' ? 'h-3 w-3' : size === 'large' ? 'h-5 w-5' : 'h-4 w-4')

  const atBound = $derived.by(() => {
    const v = uiContext.getValue()
    const max = uiContext.getMax()
    return v !== undefined && max !== undefined && v >= max
  })
  const isDisabled = $derived(Boolean(disabled) || uiContext.isDisabled() || uiContext.isReadonly() || atBound)
</script>

<button
  bind:this={ref}
  type="button"
  tabindex="-1"
  data-uipkge=""
  data-slot="increment"
  aria-label="Increase"
  disabled={isDisabled}
  class={cn(
    'focus-visible:ring-ring inline-flex shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30',
    !isRight && 'absolute top-1/2 right-0 z-10 -translate-y-1/2',
    !isRight && size === 'small' && 'p-1.5',
    !isRight && size === 'middle' && 'p-3',
    !isRight && size === 'large' && 'p-4',
    isRight && 'hover:bg-accent col-start-2 row-start-1 h-full w-auto rounded-none border-l p-0 px-2',
    className,
  )}
  onclick={(e) => {
    uiContext.handleIncrease()
    onclick?.(e)
  }}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <Plus class={iconSize} aria-hidden="true" />
  {/if}
</button>

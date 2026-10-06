<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NumberFieldContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getNumberFieldContext } from './NumberFieldContext'

  let { class: className, children, ref = $bindable(null), ...restProps }: NumberFieldContentProps = $props()

  const uiContext = getNumberFieldContext()
  const isRight = $derived(uiContext.getControlsPosition() === 'right')
</script>

<div
  bind:this={ref}
  class={cn(
    'relative',
    isRight &&
      'border-input focus-within:ring-ring inline-grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr] items-stretch overflow-hidden rounded-md border focus-within:ring-1',
    !isRight &&
      '[&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-9 [&>[data-slot=input]]:has-[[data-slot=increment]]:pr-9',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>

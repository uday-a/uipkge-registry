<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
    align?: 'left' | 'center' | 'right'
    gap?: 'sm' | 'md' | 'lg'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    align = 'right',
    gap = 'md',
    children,
    ref = $bindable(null),
    ...restProps
  }: FormActionsProps = $props()

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="form-actions"
  class={cn('flex flex-wrap items-center', alignClasses[align], gapClasses[gap], className)}
  {...restProps}
>
  {@render children?.()}
</div>

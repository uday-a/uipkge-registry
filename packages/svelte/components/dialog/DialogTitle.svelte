<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    ref?: HTMLHeadingElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getDialogContextOrNull } from './context'

  let { class: className, children, ref = $bindable(null), ...restProps }: DialogTitleProps = $props()

  const ctx = getDialogContextOrNull()
</script>

<h2
  bind:this={ref}
  data-uipkge
  data-slot="dialog-title"
  id={ctx?.titleId}
  class={cn('text-lg leading-none font-semibold', className)}
  {...restProps}
>
  {@render children?.()}
</h2>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TagsInputItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { setTagsInputItem } from './context'

  let { class: className, value, children, ref = $bindable(null), ...restProps }: TagsInputItemProps = $props()

  setTagsInputItem(() => value)
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="tags-input-item"
  data-value={value}
  class={cn(
    'bg-secondary data-[state=active]:ring-ring ring-offset-background flex h-5 items-center rounded-md data-[state=active]:ring-2 data-[state=active]:ring-offset-2',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>

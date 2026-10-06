<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectItemTextProps extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  let { children, ...restProps }: SelectItemTextProps = $props()
</script>

<span data-uipkge data-slot="select-item-text" {...restProps}>
  {@render children?.()}
</span>

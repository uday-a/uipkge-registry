<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  let { children, ...restProps }: SelectGroupProps = $props()
</script>

<div data-uipkge data-slot="select-group" role="group" {...restProps}>
  {@render children?.()}
</div>

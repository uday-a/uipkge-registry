<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  let { class: className, children, ref = $bindable(null), ...restProps }: BreadcrumbProps = $props()
</script>

<nav bind:this={ref} aria-label="breadcrumb" data-uipkge data-slot="breadcrumb" class={className} {...restProps}>
  {@render children?.()}
</nav>

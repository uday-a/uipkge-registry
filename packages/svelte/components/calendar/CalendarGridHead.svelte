<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CalendarGridHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
    ref?: HTMLTableSectionElement | null
  }
</script>

<script lang="ts">
  let { class: className, children, ref = $bindable(null), ...restProps }: CalendarGridHeadProps = $props()
</script>

<thead bind:this={ref} data-uipkge data-slot="calendar-grid-head" class={className} {...restProps}>
  {@render children?.()}
</thead>

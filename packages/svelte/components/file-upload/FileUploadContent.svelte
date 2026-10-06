<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FileUploadContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: FileUploadContentProps = $props()
</script>

<div bind:this={ref} class={cn('space-y-2', className)} data-uipkge data-slot="file-upload-content" {...restProps}>
  {@render children?.()}
</div>

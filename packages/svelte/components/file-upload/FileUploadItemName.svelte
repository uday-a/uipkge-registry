<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FileUploadItemNameProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: FileUploadItemNameProps = $props()
</script>

<p bind:this={ref} class={cn('truncate text-sm font-medium', className)} data-uipkge data-slot="file-upload-item-name" {...restProps}>
  {@render children?.()}
</p>

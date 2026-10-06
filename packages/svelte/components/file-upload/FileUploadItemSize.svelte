<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FileUploadItemSizeProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: FileUploadItemSizeProps = $props()
</script>

<span bind:this={ref} class={cn('text-muted-foreground text-xs', className)} data-uipkge data-slot="file-upload-item-size" {...restProps}>
  {@render children?.()}
</span>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FileUploadTriggerProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: FileUploadTriggerProps = $props()
</script>

<div bind:this={ref} class={cn('cursor-pointer', className)} data-uipkge data-slot="file-upload-trigger" {...restProps}>
  {@render children?.()}
</div>

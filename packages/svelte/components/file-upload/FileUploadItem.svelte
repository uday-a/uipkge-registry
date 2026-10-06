<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FileUploadItemProps extends HTMLAttributes<HTMLDivElement> {
    file: File
    onremove?: () => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { File as FileIcon, X } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let { class: className, file, onremove, children, ref = $bindable(null), ...restProps }: FileUploadItemProps = $props()
</script>

<div
  bind:this={ref}
  class={cn('bg-muted/50 flex items-center gap-3 rounded-md border p-3', className)}
  data-uipkge
  data-slot="file-upload-item"
  {...restProps}
>
  <FileIcon class="text-muted-foreground size-8 shrink-0" />
  <div class="min-w-0 flex-1">
    {#if children}
      {@render children()}
    {:else}
      <p class="truncate text-sm font-medium">{file.name}</p>
      <p class="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</p>
    {/if}
  </div>
  <button
    type="button"
    class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto rounded-sm transition-colors duration-200 focus-visible:ring-1 focus-visible:outline-none"
    onclick={() => onremove?.()}
  >
    <X class="size-4" aria-hidden="true" />
    <span class="sr-only">Remove file</span>
  </button>
</div>

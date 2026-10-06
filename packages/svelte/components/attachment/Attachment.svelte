<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AttachmentProps extends HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    state?: 'idle' | 'uploading' | 'processing' | 'error' | 'done'
    size?: 'default' | 'sm' | 'xs'
    orientation?: 'horizontal' | 'vertical'
    media?: 'file' | 'image' | 'code'
    src?: string
    alt?: string
    removable?: boolean
    ref?: HTMLDivElement | null
    onRemove?: () => void
  }
</script>

<script lang="ts">
  import { FileCode, FileText, Image as ImageIcon, LoaderCircle, X } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { attachmentMediaVariants, attachmentVariants } from './attachment.variants'

  let {
    title,
    description,
    state = 'done',
    size = 'default',
    orientation = 'horizontal',
    media = 'file',
    src,
    alt = '',
    removable = false,
    class: className,
    ref = $bindable(null),
    onRemove,
    ...restProps
  }: AttachmentProps = $props()

  const busy = $derived(state === 'uploading' || state === 'processing')
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="attachment"
  data-state={state}
  data-size={size}
  data-orientation={orientation}
  class={cn(attachmentVariants({ size, orientation }), className)}
  {...restProps}
>
  <div data-slot="attachment-media" class={cn(attachmentMediaVariants({ size }))}>
    {#if src && media === 'image' && !busy}
      <img {src} {alt} class="size-full object-cover" />
    {:else if busy}
      <LoaderCircle class="size-4 motion-safe:animate-spin" aria-hidden="true" />
    {:else if media === 'code'}
      <FileCode aria-hidden="true" />
    {:else if media === 'image'}
      <ImageIcon aria-hidden="true" />
    {:else}
      <FileText aria-hidden="true" />
    {/if}
  </div>
  <div data-slot="attachment-content" class="min-w-0 flex-1 leading-tight">
    <span data-slot="attachment-title" class={cn('block truncate font-medium', busy && 'animate-pulse')}>
      {title}
    </span>
    {#if description}
      <span
        data-slot="attachment-description"
        class={cn('text-muted-foreground mt-0.5 block truncate text-xs', state === 'error' && 'text-destructive/80')}
      >
        {description}
      </span>
    {/if}
  </div>
  {#if removable}
    <button
      type="button"
      data-slot="attachment-remove"
      class="text-muted-foreground hover:bg-accent hover:text-foreground relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-md"
      aria-label={`Remove ${title}`}
      onclick={() => onRemove?.()}
    >
      <X class="size-3.5" />
    </button>
  {/if}
</div>

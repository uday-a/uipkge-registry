<script lang="ts" module>
  import type { ToasterProps as SvelteSonnerToasterProps } from 'svelte-sonner'

  // Type intersection, not `interface extends`: ToasterProps carries mapped
  // helper types that an interface heritage clause silently drops members from.
  export type SonnerProps = SvelteSonnerToasterProps & {
    class?: string
  }
</script>

<script lang="ts">
  import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert, X } from '@lucide/svelte'
  import { Toaster as Sonner } from 'svelte-sonner'
  import { cn } from '$lib/utils'

  // Sonner cadence — UX_MICROINTERACTIONS.md research:
  // 4000ms default, bottom-right position so swipe-right dismiss reads
  // naturally, max 3 visible (older stack with scale offset), rich colors
  // so success/error/info/warning each get distinct variants.
  let {
    class: className,
    position = 'bottom-right',
    duration = 4000,
    visibleToasts = 3,
    richColors = true,
    closeButton = false,
    expand = false,
    ...restProps
  }: SonnerProps = $props()
</script>

{#snippet successIcon()}
  <CircleCheck class="size-4" aria-hidden="true" />
{/snippet}

{#snippet infoIcon()}
  <Info class="size-4" aria-hidden="true" />
{/snippet}

{#snippet warningIcon()}
  <TriangleAlert class="size-4" aria-hidden="true" />
{/snippet}

{#snippet errorIcon()}
  <OctagonX class="size-4" aria-hidden="true" />
{/snippet}

{#snippet loadingIcon()}
  <LoaderCircle class="size-4 motion-safe:animate-spin" aria-hidden="true" />
{/snippet}

{#snippet closeIcon()}
  <X class="size-4" aria-hidden="true" />
{/snippet}

<Sonner
  class={cn('toaster group', className)}
  style="--normal-bg:var(--popover);--normal-text:var(--popover-foreground);--normal-border:var(--border);--border-radius:var(--radius)"
  {position}
  {duration}
  {visibleToasts}
  {richColors}
  {closeButton}
  {expand}
  {successIcon}
  {infoIcon}
  {warningIcon}
  {errorIcon}
  {loadingIcon}
  {closeIcon}
  {...restProps}
/>

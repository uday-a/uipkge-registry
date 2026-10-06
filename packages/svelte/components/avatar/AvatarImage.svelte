<script lang="ts" module>
  import type { HTMLImgAttributes } from 'svelte/elements'

  export interface AvatarImageProps extends HTMLImgAttributes {
    ref?: HTMLImageElement | null
  }
</script>

<script lang="ts">
  import type { EventHandler } from 'svelte/elements'
  import { getContext, hasContext, onMount } from 'svelte'
  import { cn } from '$lib/utils'
  import { AVATAR_CONTEXT_KEY, type AvatarContextState } from './context.svelte'

  let {
    class: className,
    src,
    alt,
    // Radix's React AvatarImage has no lazy default; lazily-loaded avatars below
    // the fold would sit on their fallback initials and diverge from the React
    // mirror, so eager is the parity-correct default.
    loading = 'eager',
    ref = $bindable(null),
    onload,
    onerror,
    ...restProps
  }: AvatarImageProps = $props()

  const ctx = hasContext(AVATAR_CONTEXT_KEY) ? getContext<AvatarContextState>(AVATAR_CONTEXT_KEY) : undefined
  const status = $derived(ctx?.status ?? 'idle')

  // Runs before mount (like Vue's immediate watcher): mark loading as soon as
  // a src exists so the fallback shows while the image fetches.
  $effect.pre(() => {
    ctx?.setStatus(src ? 'loading' : 'idle')
  })

  // An image that finished before this component attached its listener never
  // fires `load`/`error`, so reconcile from the element state on mount: a
  // complete image with pixels is loaded; a complete image without them failed.
  // (`bind:this` below has already assigned `ref` when onMount runs.)
  onMount(() => {
    const el = ref
    if (!el?.complete) return
    ctx?.setStatus(el.naturalWidth > 0 ? 'loaded' : 'error')
  })

  const handleError: EventHandler<Event, Element> = (event) => {
    ctx?.setStatus('error')
    onerror?.(event)
  }

  const handleLoad: EventHandler<Event, Element> = (event) => {
    ctx?.setStatus('loaded')
    onload?.(event)
  }
</script>

{#if src && status !== 'error'}
  <img
    bind:this={ref}
    {src}
    {alt}
    {loading}
    class={cn('aspect-square size-full object-cover', className)}
    data-uipkge=""
    data-slot="avatar-image"
    onload={handleLoad}
    onerror={handleError}
    {...restProps}
  />
{/if}

<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type ImgPlaceholder = 'skeleton' | 'none'

  export interface ImgProps extends HTMLAttributes<HTMLDivElement> {
    src: string
    srcset?: string
    sizes?: string
    alt: string
    aspectRatio?: string | number
    width?: string | number
    height?: string | number
    placeholder?: ImgPlaceholder
    cover?: boolean
    eager?: boolean
    fallback?: string
    transition?: boolean
    imgClass?: string
    /** Custom error content. Defaults to the `fallback` image, then an "Image unavailable" note. */
    fallbackSnippet?: Snippet
    onload?: (event: Event) => void
    onerror?: (event: Event) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { Skeleton } from '$lib/components/ui/skeleton'

  let {
    src,
    srcset,
    sizes,
    alt,
    aspectRatio,
    width,
    height,
    placeholder = 'skeleton',
    cover = true,
    eager = false,
    fallback,
    transition = true,
    class: className,
    imgClass,
    fallbackSnippet,
    onload,
    onerror,
    ref = $bindable(null),
    ...restProps
  }: ImgProps = $props()

  let loadState = $state<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  // svelte-ignore state_referenced_locally — the initial value is intentionally a snapshot of `eager`.
  let visible = $state(eager)

  const containerStyle = $derived.by(() => {
    const out: Record<string, string> = {}
    if (aspectRatio !== undefined) out.aspectRatio = String(aspectRatio)
    if (width !== undefined) out.width = typeof width === 'number' ? `${width}px` : width
    if (height !== undefined) out.height = typeof height === 'number' ? `${height}px` : height
    return Object.entries(out)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')
  })

  $effect(() => {
    // Reset whenever the source changes; hold off-viewport images until near view.
    void src
    loadState = 'idle'
    if (eager) {
      visible = true
      return
    }
    visible = false
    if (typeof IntersectionObserver === 'undefined' || !ref) {
      visible = true
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible = true
            observer.disconnect()
            return
          }
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(ref)
    return () => observer.disconnect()
  })

  $effect(() => {
    if (visible && loadState === 'idle') loadState = 'loading'
  })

  function handleLoad(e: Event) {
    loadState = 'loaded'
    onload?.(e)
  }

  function handleError(e: Event) {
    loadState = 'error'
    onerror?.(e)
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="lazy-image"
  class={cn('bg-muted relative overflow-hidden', className)}
  style={containerStyle}
  {...restProps}
>
  {#if placeholder === 'skeleton' && loadState !== 'loaded' && loadState !== 'error'}
    <Skeleton class="absolute inset-0 size-full rounded-none" />
  {/if}

  {#if visible && loadState !== 'error'}
    <img
      {src}
      {srcset}
      {sizes}
      {alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      class={cn(
        'block size-full',
        cover ? 'object-cover' : 'object-contain',
        transition && 'transition-opacity duration-300',
        loadState === 'loaded' ? 'opacity-100' : 'opacity-0',
        imgClass,
      )}
      onload={handleLoad}
      onerror={handleError}
    />
  {/if}

  {#if loadState === 'error'}
    {#if fallbackSnippet}
      {@render fallbackSnippet()}
    {:else if fallback}
      <img
        src={fallback}
        {alt}
        class={cn('block size-full', cover ? 'object-cover' : 'object-contain', imgClass)}
      />
    {:else}
      <div
        role="img"
        class="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs"
        aria-label="Image failed to load"
      >
        <span aria-hidden="true">Image unavailable</span>
      </div>
    {/if}
  {/if}
</div>

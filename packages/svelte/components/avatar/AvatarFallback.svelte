<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
    size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
    color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'error' | 'muted'
    text?: string
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { getContext, hasContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { avatarFallbackVariants } from './avatar.variants'
  import { AVATAR_CONTEXT_KEY, type AvatarContextState } from './context.svelte'

  let {
    class: className,
    size = 'default',
    color = 'default',
    text,
    children,
    ref = $bindable(null),
    ...restProps
  }: AvatarFallbackProps = $props()

  // Show fallback until a sibling AvatarImage reports loaded (Radix composition).
  const ctx = hasContext(AVATAR_CONTEXT_KEY) ? getContext<AvatarContextState>(AVATAR_CONTEXT_KEY) : undefined
  const visible = $derived(!ctx || ctx.status !== 'loaded')

  const rootClasses = $derived(cn(avatarFallbackVariants({ size, color }), className))
</script>

{#if visible}
  <span bind:this={ref} class={rootClasses} data-uipkge="" data-slot="avatar-fallback" {...restProps}>
    {#if text}
      {text}
    {:else}
      {@render children?.()}
    {/if}
  </span>
{/if}

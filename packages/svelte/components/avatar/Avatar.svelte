<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
    size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
    rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'error' | 'muted'
    variant?: 'default' | 'outlined' | 'soft'
    tile?: boolean
    disabled?: boolean
    loading?: boolean
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements'
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { avatarVariants } from './avatar.variants'
  import { AVATAR_CONTEXT_KEY, AvatarContextState } from './context.svelte'

  let {
    class: className,
    size,
    rounded,
    color,
    variant,
    tile = false,
    disabled = false,
    loading = false,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: AvatarProps = $props()

  // Sibling AvatarFallback shows until a sibling AvatarImage reports loaded.
  setContext(AVATAR_CONTEXT_KEY, new AvatarContextState())

  const handleClick: MouseEventHandler<HTMLSpanElement> = (event) => {
    if (!disabled) {
      onclick?.(event)
    }
  }

  const rootClasses = $derived(
    cn(
      avatarVariants({ size, rounded, color, variant }),
      tile ? 'rounded-none' : '',
      disabled ? 'cursor-not-allowed opacity-50' : '',
      loading ? 'animate-pulse' : '',
      className,
    ),
  )
</script>

<span bind:this={ref} class={rootClasses} data-uipkge="" data-slot="avatar" onclick={handleClick} {...restProps}>
  {@render children?.()}
</span>

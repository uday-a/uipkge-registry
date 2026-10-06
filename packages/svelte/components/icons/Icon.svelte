<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inherit'

  /**
   * Universal Icon component supporting multiple icon libraries:
   * - Lucide (default, via children)
   * - Font Awesome (via class:fa-* and class)
   * - Material Design Icons (via class:mdi-* and class)
   * - Heroicons (via children)
   * - Custom SVG (via src prop)
   */
  export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    size?: IconSize
    color?: string
    /** For img-based icons. */
    src?: string
    alt?: string
    rotation?: number | string
    flip?: 'horizontal' | 'vertical' | 'both'
    /** Accessible label. */
    label?: string
    ariaLabel?: string
    inline?: boolean
    children?: Snippet
  }

  const sizeClasses: Record<IconSize, string> = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
    xl: 'size-8',
    '2xl': 'size-12',
    inherit: 'size-full',
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    size = 'md',
    color,
    src,
    alt,
    rotation,
    flip,
    label,
    ariaLabel,
    inline = true,
    children,
    ...restProps
  }: IconProps = $props()

  const rotationDeg = $derived(
    !rotation ? undefined : typeof rotation === 'string' ? parseInt(rotation) : rotation,
  )

  const flipClasses = $derived(
    !flip ? '' : flip === 'horizontal' ? '-scale-x-100' : flip === 'vertical' ? '-scale-y-100' : '-scale-x-100 -scale-y-100',
  )

  const styleValue = $derived.by(() => {
    const parts: string[] = []
    if (color) parts.push(`color: ${color}`)
    if (rotationDeg) parts.push(`transform: rotate(${rotationDeg}deg)`)
    return parts.length ? parts.join('; ') : undefined
  })

  const imgAlt = $derived(alt || label || '')
  const imgLabel = $derived(ariaLabel || label || undefined)
</script>

{#if src}
  <!-- Image-based icon (Material Design, custom URLs, etc.) -->
  <img
    data-uipkge
    data-slot="icon"
    {...restProps}
    {src}
    alt={imgAlt}
    class={cn(
      'shrink-0 object-contain',
      inline ? 'inline-block' : 'block',
      size !== 'inherit' ? sizeClasses[size] : '',
      flipClasses,
      className,
    )}
    style={styleValue}
    aria-label={imgLabel}
    role="img"
  />
{:else}
  <!-- Snippet-based icon (Lucide, Heroicons, inline SVG) -->
  <span
    data-uipkge
    data-slot="icon"
    {...restProps}
    class={cn(
      'shrink-0 items-center justify-center',
      inline ? 'inline-flex' : 'flex',
      size !== 'inherit' ? sizeClasses[size] : '',
      flipClasses,
      className,
    )}
    style={styleValue}
    aria-label={imgLabel}
    role={ariaLabel || label ? 'img' : undefined}
    aria-hidden={!(ariaLabel || label) ? 'true' : undefined}
  >
    {@render children?.()}
  </span>
{/if}

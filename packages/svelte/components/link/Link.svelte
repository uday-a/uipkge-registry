<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import type { LinkVariants } from './link.variants'

  export interface LinkProps extends HTMLAnchorAttributes {
    underline?: LinkVariants['underline']
    color?: LinkVariants['color']
    size?: LinkVariants['size']
    disabled?: boolean
    /** Router destination (React `to` parity). Alias for `href` — wins when both are set. */
    to?: string
    /** Open external href in a new tab. Defaults to true for http(s) hrefs. */
    external?: boolean
    left?: Snippet
    right?: Snippet
    children?: Snippet
    /** Render your own element with the link's props and styles instead of
     *  emitting an <a> — the Svelte counterpart of React's `asChild` (and the
     *  idiomatic cover for React's polymorphic `as`). */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    /** The rendered <a>, via `bind:ref`. Stays null in `child` mode. */
    ref?: HTMLAnchorElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { linkVariants } from './link.variants'

  let {
    class: className,
    underline = 'hover',
    color = 'primary',
    size = 'default',
    disabled = false,
    to,
    external,
    href,
    child,
    children,
    left,
    right,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: LinkProps = $props()

  const resolvedHref = $derived(to ?? href)
  const isExternal = $derived(external ?? (typeof resolvedHref === 'string' && /^https?:\/\//.test(resolvedHref)))

  type AnchorClick = Parameters<Exclude<LinkProps['onclick'], null | undefined>>[0]

  function handleClick(e: AnchorClick) {
    if (disabled) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    onclick?.(e)
  }

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'link',
    'data-underline': underline,
    'data-color': color,
    'data-size': size,
    'data-disabled': disabled ? '' : undefined,
    href: disabled ? undefined : resolvedHref,
    'aria-disabled': disabled ? ('true' as const) : undefined,
    tabindex: disabled ? -1 : undefined,
    ...(isExternal && !disabled ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    class: cn(linkVariants({ underline, color, size }), disabled && 'pointer-events-none opacity-50', className),
    onclick: handleClick,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <a bind:this={ref} {...mergedProps}>
    {@render left?.()}
    {@render children?.()}
    {@render right?.()}
  </a>
{/if}

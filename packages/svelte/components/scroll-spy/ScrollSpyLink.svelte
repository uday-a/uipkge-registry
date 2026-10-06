<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  export interface ScrollSpyLinkProps extends HTMLAnchorAttributes {
    href: string
    title?: string
    depth?: number
    children?: Snippet
    ref?: HTMLAnchorElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { SCROLL_SPY_ITEM_DEPTH_KEY, resolveScrollSpyColor, getScrollSpyContextOptional } from './context'

  let { class: className, href, title, depth, children, ref = $bindable(null), ...restProps }: ScrollSpyLinkProps =
    $props()

  const ctx = getScrollSpyContextOptional()
  const itemDepth = getContext<number | undefined>(SCROLL_SPY_ITEM_DEPTH_KEY) ?? 1
  const selfDepth = $derived(depth ?? itemDepth)

  const isActive = $derived(ctx?.isItemActive(href) ?? false)
  const isParentActive = $derived(ctx?.isItemParentActive(href) ?? false)
  const isScrolled = $derived(ctx?.isItemScrolled(href) ?? false)

  const isCircuit = $derived(ctx !== null && ctx.turn !== 'straight')
  const isLeftWithRightRail = $derived(ctx?.position === 'left' && ctx?.railPosition === 'right')
  const hasIndicatorBar = $derived(
    ctx !== null && ctx.turn === 'straight' && (ctx.indicator !== 'segment' || ctx.keepScrolled),
  )

  const handleColor = $derived(resolveScrollSpyColor(ctx?.color ?? 'primary'))

  const borderActiveClass = $derived.by(() => {
    if (hasIndicatorBar) {
      if (isActive || isParentActive) return 'text-foreground font-medium'
      if (isScrolled) return 'text-foreground/85'
      return 'text-muted-foreground hover:text-foreground'
    }
    if (isActive) return cn(handleColor.borderClass, 'text-foreground font-medium')
    if (isParentActive) return 'border-border/50 text-foreground font-medium'
    if (isScrolled) return 'border-border/70 text-foreground/85'
    return 'text-muted-foreground hover:border-foreground/40 hover:text-foreground'
  })

  const activeBorderStyle = $derived.by(() => {
    if (isCircuit || hasIndicatorBar || (!isActive && !isParentActive && !isScrolled)) return undefined
    const w = ctx?.resolvedLineWidth ?? 2.5
    if (isLeftWithRightRail) {
      return `border-right-width: ${w}px; margin-right: -${w}px;${isActive && handleColor.customColor ? ` border-color: ${handleColor.customColor};` : ''}`
    }
    return `border-left-width: ${w}px; margin-left: -${w}px;${isActive && handleColor.customColor ? ` border-color: ${handleColor.customColor};` : ''}`
  })

  function onClick(e: MouseEvent) {
    e.preventDefault()
    if (!ctx) return
    ctx.scrollToHref(href)
  }
</script>

<a
  bind:this={ref}
  {href}
  data-slot="scroll-spy-link"
  aria-current={isActive ? 'location' : undefined}
  data-active={isActive ? 'true' : 'false'}
  data-parent-active={isParentActive ? 'true' : 'false'}
  data-scrolled={isScrolled ? 'true' : 'false'}
  data-depth={selfDepth}
  style={activeBorderStyle}
  class={cn(
    'group block rounded-none leading-snug no-underline transition-[color,border-color,background-color,opacity,border-width,margin] duration-200 ease-out',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    isCircuit
      ? [
          'py-1',
          isLeftWithRightRail
            ? [
                'text-right',
                selfDepth <= 1 && 'pr-4 pl-2 text-sm',
                selfDepth === 2 && 'pr-7 pl-2 text-xs',
                selfDepth === 3 && 'pr-10 pl-2 text-xs',
                selfDepth >= 4 && 'pr-12 pl-2 text-xs',
              ]
            : [
                selfDepth <= 1 && 'pr-2 pl-4 text-sm',
                selfDepth === 2 && 'pr-2 pl-7 text-xs',
                selfDepth === 3 && 'pr-2 pl-10 text-xs',
                selfDepth >= 4 && 'pr-2 pl-12 text-xs',
              ],
          isActive || isParentActive
            ? 'text-foreground font-medium'
            : isScrolled
              ? 'text-foreground/85'
              : 'text-muted-foreground hover:text-foreground',
        ]
      : isLeftWithRightRail
        ? [
            '-mr-px border-r border-transparent py-0.5 pr-3 pl-2 text-right',
            selfDepth <= 1 && 'text-sm',
            selfDepth === 2 && 'pr-6 text-xs',
            selfDepth === 3 && 'pr-9 text-xs',
            selfDepth >= 4 && 'pr-11 text-xs',
            borderActiveClass,
          ]
        : [
            '-ml-px border-l border-transparent py-0.5 pr-2 pl-3',
            selfDepth <= 1 && 'text-sm',
            selfDepth === 2 && 'pl-6 text-xs',
            selfDepth === 3 && 'pl-9 text-xs',
            selfDepth >= 4 && 'pl-11 text-xs',
            borderActiveClass,
          ],
    className,
  )}
  onclick={onClick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    {title}
  {/if}
</a>

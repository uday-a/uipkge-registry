<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { BackTopVariants } from './back-top.variants'

  export interface BackTopProps extends Omit<HTMLButtonAttributes, 'onclick'> {
    /** Merged with the internal scroll-to-top behavior. */
    onclick?: (e: MouseEvent) => void
    /** Visibility threshold in pixels. Button appears once scroll passes it. */
    threshold?: number
    /** Target container. Defaults to the window. Pass a CSS selector or an HTMLElement. */
    target?: string | HTMLElement | Window
    /** Scroll behavior: 'smooth' or 'auto' (instant). */
    behavior?: ScrollBehavior
    /** Size variant. */
    size?: BackTopVariants['size']
    /** Edge anchor position. */
    position?: BackTopVariants['position']
    /** Distance from the viewport edge (px). */
    offset?: number
    /** Use absolute positioning (for section-level containers) instead of fixed (viewport). */
    absolute?: boolean
    /** Accessible label. */
    ariaLabel?: string
    /** Override the default arrow icon. */
    icon?: Snippet
    /** The rendered <button>, via `bind:ref`. */
    ref?: HTMLButtonElement | null
    /** Fires whenever the button toggles visibility. */
    onvisiblechange?: (visible: boolean) => void
  }
</script>

<script lang="ts">
  import { scale } from 'svelte/transition'
  import { ArrowUp } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { backTopVariants } from './back-top.variants'

  let {
    class: className,
    threshold = 200,
    target = undefined,
    behavior = 'smooth',
    size = 'default',
    position = 'bottom-right',
    offset = 24,
    absolute = false,
    ariaLabel = 'Scroll to top',
    icon,
    children,
    ref = $bindable(null),
    type = 'button',
    onclick,
    onvisiblechange,
    ...restProps
  }: BackTopProps = $props()

  // Destructured (not rendered): BackTop has no default slot — this keeps a
  // stray `children` prop out of the button's spread attributes.
  void children

  let visible = $state(false)

  function resolveTarget(t: BackTopProps['target']): HTMLElement | Window | null {
    if (typeof window === 'undefined') return null
    if (t === undefined || t === null) return window
    if (typeof t === 'string') {
      const el = document.querySelector<HTMLElement>(t)
      return el ?? window
    }
    return t
  }

  function getScrollTop(el: HTMLElement | Window): number {
    if (el === window) {
      return window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0
    }
    return (el as HTMLElement).scrollTop
  }

  function scrollToTop(el: HTMLElement | Window) {
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behaviorValue: ScrollBehavior = reduceMotion ? 'auto' : behavior
    if (el === window) {
      window.scrollTo({ top: 0, behavior: behaviorValue })
    } else {
      ;(el as HTMLElement).scrollTo({ top: 0, behavior: behaviorValue })
    }
  }

  function handleClick(e: MouseEvent) {
    onclick?.(e)
    const el = resolveTarget(target)
    if (el) scrollToTop(el)
  }

  const positionStyle = $derived.by(() => {
    const offsetVar = `var(--back-top-offset, ${offset}px)`
    const edges =
      position === 'bottom-left'
        ? (['left', 'bottom'] as const)
        : position === 'top-right'
          ? (['right', 'top'] as const)
          : position === 'top-left'
            ? (['left', 'top'] as const)
            : (['right', 'bottom'] as const)
    return `${edges[0]}: ${offsetVar}; ${edges[1]}: ${offsetVar}; --back-top-offset: ${offset}px`
  })

  // Re-subscribes when `target` changes (mirrors the Vue watch on target).
  $effect(() => {
    const el = resolveTarget(target)
    if (!el) return
    const onScroll = () => {
      // `>=` so threshold={0} always shows (size/position demos, forced-visible cases).
      const next = getScrollTop(el) >= threshold
      if (next !== visible) {
        visible = next
        onvisiblechange?.(next)
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    // If target is a container, also listen to window scroll for safety on resize.
    if (el !== window) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    onScroll()
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (el !== window) {
        window.removeEventListener('scroll', onScroll)
      }
    }
  })
</script>

{#if visible}
  <button
    bind:this={ref}
    type={type}
    data-uipkge=""
    data-slot="back-top"
    data-state={visible ? 'open' : 'closed'}
    data-size={size}
    data-position={position}
    aria-label={ariaLabel}
    class={cn(backTopVariants({ size, position }), absolute ? 'absolute' : 'fixed', className)}
    style={positionStyle}
    onclick={handleClick}
    transition:scale={{ duration: 200, start: 0.9 }}
    {...restProps}
  >
    {#if icon}
      {@render icon()}
    {:else}
      <ArrowUp aria-hidden="true" />
    {/if}
  </button>
{/if}

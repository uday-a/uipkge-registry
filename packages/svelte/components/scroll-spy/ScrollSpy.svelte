<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type {
    ScrollSpyColor,
    ScrollSpyIndicatorMode,
    ScrollSpyLineWidth,
    ScrollSpyPosition,
    ScrollSpyRailPosition,
    ScrollSpyTurn,
    ScrollSpyVariant,
  } from './context'

  export interface ScrollSpyItemData {
    href: string
    title: string
    depth?: number
    children?: ScrollSpyItemData[]
  }

  export interface ScrollSpyProps extends HTMLAttributes<HTMLElement> {
    modelValue?: string
    items?: ScrollSpyItemData[]
    title?: string
    offsetTop?: number
    bounds?: number
    scrollContainer?: HTMLElement | string | null
    affix?: boolean
    variant?: ScrollSpyVariant
    turn?: ScrollSpyTurn
    indicator?: ScrollSpyIndicatorMode
    keepScrolled?: boolean
    highlightParent?: boolean
    lineWidth?: ScrollSpyLineWidth
    color?: ScrollSpyColor
    position?: ScrollSpyPosition
    railPosition?: ScrollSpyRailPosition
    onChange?: (value: string) => void
    onProgress?: (value: number) => void
    children?: Snippet
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { SCROLL_SPY_CONTEXT_KEY, type RegisteredItem, type ScrollSpyContext } from './context'
  import ScrollSpyTitle from './ScrollSpyTitle.svelte'
  import ScrollSpyList from './ScrollSpyList.svelte'
  import ScrollSpyIndicator from './ScrollSpyIndicator.svelte'
  import ScrollSpyItemComp from './ScrollSpyItem.svelte'
  import ScrollSpyLink from './ScrollSpyLink.svelte'
  import ScrollSpyStepper from './ScrollSpyStepper.svelte'

  let {
    class: className,
    modelValue = $bindable(''),
    items = [],
    title,
    offsetTop = 0,
    bounds = 5,
    scrollContainer = null,
    affix = false,
    variant,
    turn,
    indicator = 'line',
    keepScrolled = false,
    highlightParent = true,
    lineWidth = 'default',
    color = 'primary',
    position = 'right',
    railPosition,
    onChange,
    onProgress,
    children,
    ref = $bindable(null),
    ...restProps
  }: ScrollSpyProps = $props()

  const resolvedPosition = $derived(position ?? 'right')
  const resolvedRailPosition = $derived.by(() => {
    if (railPosition) return railPosition
    return position === 'left' ? 'right' : 'left'
  })

  const resolvedTurn = $derived.by(() => {
    if (turn) return turn
    if (variant === 'angle' || variant === 'rounded') return 'rounded'
    if (variant === 'sharp') return 'sharp'
    if (variant === 'line' || variant === 'default') return 'straight'
    return 'straight'
  })

  const resolvedVariant = $derived.by(() => {
    if (variant) return variant
    if (turn === 'sharp') return 'angle'
    if (turn === 'rounded') return 'rounded'
    if (position === 'top' || position === 'bottom') return 'stepper'
    return 'line'
  })

  const resolvedIndicator = $derived(indicator ?? 'line')

  let internalActive = $state(modelValue || (items[0]?.href ?? ''))
  const activeValue = $derived(modelValue || internalActive)

  function setActiveValue(val: string) {
    if (internalActive !== val) {
      internalActive = val
      modelValue = val
      onChange?.(val)
    }
  }

  function flattenItems(rawItems: ScrollSpyItemData[]): RegisteredItem[] {
    const result: RegisteredItem[] = []
    function walk(list: ScrollSpyItemData[], depth = 1, parentVal: string | null = null) {
      for (const it of list) {
        result.push({
          value: it.href,
          depth: it.depth ?? depth,
          el: null,
          title: it.title,
          parentValue: parentVal,
        })
        if (it.children && it.children.length > 0) {
          walk(it.children, depth + 1, it.href)
        }
      }
    }
    walk(rawItems)
    return result
  }

  let registeredItems = $state<RegisteredItem[]>(items && items.length > 0 ? flattenItems(items) : [])
  let listEl = $state<HTMLElement | null>(null)
  let resolvedContainer = $state<HTMLElement | Window | null>(null)
  let readingProgress = $state(0)

  function resolveContainer(): HTMLElement | Window | null {
    if (typeof window === 'undefined') return null
    const sc = scrollContainer
    if (!sc) return window
    if (typeof sc === 'function') {
      return ((sc as () => HTMLElement | Window | null)() ?? window) as HTMLElement | Window
    }
    if (typeof sc === 'string') {
      return (document.querySelector(sc) as HTMLElement) ?? window
    }
    return sc as HTMLElement | Window
  }

  function registerItem(item: RegisteredItem) {
    const existingIdx = registeredItems.findIndex((i) => i.value === item.value)
    if (existingIdx >= 0) {
      registeredItems[existingIdx] = {
        ...registeredItems[existingIdx]!,
        ...item,
        title: item.title ?? registeredItems[existingIdx]!.title,
      }
    } else {
      registeredItems.push(item)
    }
    if (!activeValue && registeredItems.length > 0) {
      setActiveValue(registeredItems[0]!.value)
    }
  }

  // Re-flatten when the items prop changes, preserving measured elements.
  $effect(() => {
    const newItems = items
    if (newItems && newItems.length > 0) {
      const flattened = flattenItems(newItems)
      const existingMap = new Map(registeredItems.map((i) => [i.value, i]))
      registeredItems = flattened.map((item) => {
        const existing = existingMap.get(item.value)
        return {
          ...item,
          el: existing?.el ?? null,
          title: item.title ?? existing?.title,
        }
      })
      if (!activeValue && registeredItems.length > 0) {
        setActiveValue(registeredItems[0]!.value)
      }
    }
  })

  function unregisterItem(value: string) {
    registeredItems = registeredItems.filter((i) => i.value !== value)
  }

  function scrollToHref(href: string) {
    setActiveValue(href)
    const container = resolvedContainer || resolveContainer()
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto'

    if (container && container !== window) {
      const cEl = container as HTMLElement
      const target = cEl.querySelector(href) as HTMLElement | null
      if (target) {
        const cRect = cEl.getBoundingClientRect()
        const tRect = target.getBoundingClientRect()
        const top = cEl.scrollTop + (tRect.top - cRect.top) - offsetTop
        cEl.scrollTo({ top, behavior })
      }
    } else {
      const target = document.querySelector(href) as HTMLElement | null
      if (target) {
        const top = window.scrollY + target.getBoundingClientRect().top - offsetTop
        window.scrollTo({ top, behavior })
      }
    }

    if (typeof history !== 'undefined') {
      history.replaceState(null, '', href)
    }
  }

  function goToPrev() {
    const list = registeredItems
    const active = activeValue
    const idx = list.findIndex((i) => i.value === active || i.value.replace(/^#/, '') === active.replace(/^#/, ''))
    if (idx > 0 && list[idx - 1]) {
      scrollToHref(list[idx - 1]!.value)
    }
  }

  function goToNext() {
    const list = registeredItems
    const active = activeValue
    const idx = list.findIndex((i) => i.value === active || i.value.replace(/^#/, '') === active.replace(/^#/, ''))
    if (idx >= 0 && idx < list.length - 1 && list[idx + 1]) {
      scrollToHref(list[idx + 1]!.value)
    }
  }

  const activeIndex = $derived.by(() => {
    const current = activeValue
    if (!current) return -1
    const clean = current.replace(/^#/, '')
    return registeredItems.findIndex((i) => i.value === current || i.value.replace(/^#/, '') === clean)
  })

  function isItemActive(value: string): boolean {
    if (!value || !activeValue) return false
    const cleanVal = value.replace(/^#/, '')
    const cleanActive = activeValue.replace(/^#/, '')
    return cleanVal === cleanActive
  }

  function isItemParentActive(value: string): boolean {
    if (!highlightParent || !value || !activeValue) return false
    const cleanVal = value.replace(/^#/, '')
    const cleanActive = activeValue.replace(/^#/, '')
    if (cleanVal === cleanActive) return false

    const activeItem = registeredItems.find(
      (i) => i.value === activeValue || i.value.replace(/^#/, '') === cleanActive,
    )
    let parent = activeItem?.parentValue
    while (parent) {
      if (parent === value || parent.replace(/^#/, '') === cleanVal) return true
      const pItem = registeredItems.find((i) => i.value === parent || i.value.replace(/^#/, '') === parent!.replace(/^#/, ''))
      parent = pItem?.parentValue
    }
    return false
  }

  function isItemScrolled(value: string): boolean {
    if (!keepScrolled || activeIndex < 0) return false
    const cleanVal = value.replace(/^#/, '')
    const idx = registeredItems.findIndex((i) => i.value === value || i.value.replace(/^#/, '') === cleanVal)
    return idx >= 0 && idx <= activeIndex
  }

  const resolvedLineWidth = $derived.by(() => {
    const lw = lineWidth
    if (typeof lw === 'number') return Math.max(1, lw)
    if (lw === 'thin') return 1.5
    if (lw === 'thick') return 3.5
    return 2.5
  })

  const ctx: ScrollSpyContext = {
    get activeValue() {
      return activeValue
    },
    setActiveValue,
    get scrollProgress() {
      return readingProgress
    },
    registerItem,
    unregisterItem,
    get variant() {
      return resolvedVariant
    },
    get turn() {
      return resolvedTurn
    },
    get indicator() {
      return resolvedIndicator
    },
    get keepScrolled() {
      return keepScrolled
    },
    get highlightParent() {
      return highlightParent
    },
    get lineWidth() {
      return lineWidth
    },
    get resolvedLineWidth() {
      return resolvedLineWidth
    },
    get color() {
      return color
    },
    get position() {
      return resolvedPosition
    },
    get railPosition() {
      return resolvedRailPosition
    },
    get scrollContainer() {
      return resolvedContainer
    },
    get offsetTop() {
      return offsetTop
    },
    get items() {
      return registeredItems
    },
    getListEl: () => listEl,
    setListEl: (el) => {
      listEl = el
    },
    scrollToHref,
    goToPrev,
    goToNext,
    isItemActive,
    isItemParentActive,
    isItemScrolled,
  }
  setContext(SCROLL_SPY_CONTEXT_KEY, ctx)

  // Scroll Spy tracking for both local container and window, plus reading progress
  function recomputeActive() {
    const container = resolvedContainer
    if (!container || registeredItems.length === 0) return

    const isWin = container === window
    let currentScroll = 0
    let maxScroll = 0

    if (isWin) {
      currentScroll = window.scrollY
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    } else {
      const cEl = container as HTMLElement
      currentScroll = cEl.scrollTop
      maxScroll = Math.max(1, cEl.scrollHeight - cEl.clientHeight)
    }

    const prog = Math.min(1, Math.max(0, currentScroll / maxScroll))
    readingProgress = prog
    onProgress?.(prog)

    const containerTop = isWin ? 0 : (container as HTMLElement).getBoundingClientRect().top
    const triggerThreshold = containerTop + offsetTop + bounds + 40

    let currentTarget = ''

    for (const item of registeredItems) {
      const selector = item.value.startsWith('#') ? item.value : `#${item.value}`
      const target = isWin ? document.querySelector(selector) : (container as HTMLElement).querySelector(selector)

      if (!target) continue
      const targetRect = target.getBoundingClientRect()
      if (targetRect.top <= triggerThreshold) {
        currentTarget = item.value
      } else if (currentTarget) {
        break
      }
    }

    const atBottom = isWin
      ? window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6
      : (container as HTMLElement).scrollTop + (container as HTMLElement).clientHeight >=
        (container as HTMLElement).scrollHeight - 6

    if (atBottom && registeredItems.length > 0) {
      currentTarget = registeredItems[registeredItems.length - 1]!.value
    }

    if (!currentTarget && registeredItems.length > 0) {
      currentTarget = registeredItems[0]!.value
    }

    if (currentTarget && currentTarget !== activeValue) {
      setActiveValue(currentTarget)
    }
  }

  let rafScroll = 0
  function onScroll() {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafScroll)
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      rafScroll = requestAnimationFrame(() => {
        recomputeActive()
      })
    } else {
      recomputeActive()
    }
  }

  function bindScrollListener() {
    unbindScrollListener()
    resolvedContainer = resolveContainer()
    const c = resolvedContainer
    if (c && typeof (c as EventTarget).addEventListener === 'function') {
      ;(c as EventTarget).addEventListener('scroll', onScroll, { passive: true })
    }
  }

  function unbindScrollListener() {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafScroll)
    }
    const c = resolvedContainer
    if (c && typeof (c as EventTarget).removeEventListener === 'function') {
      ;(c as EventTarget).removeEventListener('scroll', onScroll)
    }
  }

  $effect(() => {
    // Re-bind when the scroll container identity changes.
    void scrollContainer
    bindScrollListener()
    recomputeActive()
    const mountTimer = setTimeout(() => {
      bindScrollListener()
      recomputeActive()
    }, 100)
    return () => {
      clearTimeout(mountTimer)
      unbindScrollListener()
    }
  })
</script>

<nav
  bind:this={ref}
  data-uipkge
  data-slot="scroll-spy"
  data-position={resolvedPosition}
  data-rail-position={resolvedRailPosition}
  data-variant={resolvedVariant}
  data-turn={resolvedTurn}
  data-indicator={resolvedIndicator}
  data-keep-scrolled={keepScrolled ? 'true' : undefined}
  data-highlight-parent={highlightParent ? 'true' : undefined}
  data-line-width={lineWidth}
  data-color={color}
  aria-label="Scroll spy navigation"
  class={cn(
    'relative flex text-sm',
    resolvedPosition === 'top' || resolvedPosition === 'bottom' ? 'w-full flex-col' : 'flex-col',
    affix && (resolvedPosition === 'bottom' ? 'sticky bottom-4' : 'sticky'),
    className,
  )}
  style={affix && resolvedPosition !== 'bottom' ? `top: ${offsetTop}px` : undefined}
  {...restProps}
>
  {#if items && items.length > 0}
    <!-- Top Sticky Stepper Mode -->
    {#if resolvedPosition === 'top'}
      <ScrollSpyStepper />
    {:else if resolvedPosition !== 'bottom'}
      <!-- Standard Left or Right Vertical Rail -->
      {#if title}
        <ScrollSpyTitle>{title}</ScrollSpyTitle>
      {/if}
      <ScrollSpyList>
        <ScrollSpyIndicator />
        {#each items as item, itemIdx (item.href)}
          <ScrollSpyItemComp
            value={item.href}
            depth={item.depth ?? 1}
            class={itemIdx > 0 && items[itemIdx - 1]?.children?.length ? 'mt-2' : undefined}
          >
            <ScrollSpyLink href={item.href} title={item.title} />
          </ScrollSpyItemComp>
          {#each (item.children ?? []) as child, childIdx (child.href)}
            <ScrollSpyItemComp
              value={child.href}
              depth={child.depth ?? 2}
              class={childIdx === 0 || (childIdx > 0 && item.children?.[childIdx - 1]?.children?.length)
                ? 'mt-2'
                : undefined}
            >
              <ScrollSpyLink href={child.href} title={child.title} />
            </ScrollSpyItemComp>
            {#each (child.children ?? []) as grandchild, gIdx (grandchild.href)}
              <ScrollSpyItemComp value={grandchild.href} depth={grandchild.depth ?? 3} class={gIdx === 0 ? 'mt-2' : undefined}>
                <ScrollSpyLink href={grandchild.href} title={grandchild.title} />
              </ScrollSpyItemComp>
            {/each}
          {/each}
        {/each}
      </ScrollSpyList>
    {/if}

    <!-- Bottom Floating Stepper Capsule Mode -->
    {#if resolvedPosition === 'bottom'}
      <ScrollSpyStepper />
    {/if}
  {:else}
    {@render children?.()}
  {/if}
</nav>

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { RegisteredContent } from './NavigationMenuContext'

  export interface NavigationMenuProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled open item value. When omitted the menu is uncontrolled. */
    value?: string
    defaultValue?: string
    /** Render the shared viewport panel. Disable for per-item flyouts. */
    viewport?: boolean
    /** Hover delay (ms) before opening when nothing is open. */
    delayDuration?: number
    /** Grace window (ms) after closing during which hover opens instantly. */
    skipDelayDuration?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { setNavigationMenuRootContext } from './NavigationMenuContext'
  import NavigationMenuViewport from './NavigationMenuViewport.svelte'

  let {
    class: className,
    value = $bindable(),
    defaultValue,
    viewport = true,
    delayDuration = 200,
    skipDelayDuration = 300,
    children,
    ref = $bindable(null),
    onmouseleave,
    ...restProps
  }: NavigationMenuProps = $props()

  let seeded = false
  $effect.pre(() => {
    if (!seeded && value === undefined && defaultValue !== undefined) value = defaultValue
    seeded = true
  })

  let rootEl: HTMLDivElement | null = $state(null)
  let contentEl: HTMLElement | null = $state(null)
  $effect(() => {
    ref = rootEl
  })

  const triggers: Array<{ value: string; getEl: () => HTMLElement | null }> = []
  let contents = $state<Record<string, RegisteredContent | undefined>>({})
  let prevValue: string | undefined = undefined
  let lastCloseAt = 0
  let openTimer: ReturnType<typeof setTimeout> | null = null

  function setValue(next: string | undefined, refocusTrigger = false) {
    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = null
    }
    if (value !== next) {
      prevValue = value
      value = next
      if (next === undefined) lastCloseAt = Date.now()
    }
    if (refocusTrigger && prevValue !== undefined) {
      const target = prevValue
      requestAnimationFrame(() => triggers.find((t) => t.value === target)?.getEl()?.focus())
    }
  }

  function orderOf(v: string | undefined): number {
    if (v === undefined) return -1
    const i = triggers.findIndex((t) => t.value === v)
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }

  setNavigationMenuRootContext({
    getValue: () => value,
    setValue,
    isViewportEnabled: () => viewport,
    getRootEl: () => rootEl,
    getContentEl: () => contentEl,
    setContentEl: (el) => {
      contentEl = el
    },
    registerTrigger(triggerValue, getEl) {
      const entry = { value: triggerValue, getEl }
      triggers.push(entry)
      return () => {
        const i = triggers.indexOf(entry)
        if (i >= 0) triggers.splice(i, 1)
      }
    },
    focusSiblingTrigger(triggerValue, dir) {
      const live = triggers.filter((t) => t.getEl()?.isConnected)
      if (live.length === 0) return null
      let next: number
      if (dir === 'first') next = 0
      else if (dir === 'last') next = live.length - 1
      else {
        const index = Math.max(0, live.findIndex((t) => t.value === triggerValue))
        next = (index + dir + live.length) % live.length
      }
      const target = live[next]!
      target.getEl()?.focus()
      return target.value
    },
    registerContent(contentValue, content) {
      contents[contentValue] = content
      return () => {
        if (contents[contentValue] === content) delete contents[contentValue]
      }
    },
    getContent: (v) => contents[v],
    getMotion: (v) => {
      if (prevValue === undefined || v === prevValue) return undefined
      return orderOf(v) > orderOf(prevValue) ? 'from-start' : 'from-end'
    },
    openWithDelay: (triggerValue) => {
      if (value === triggerValue) return
      if (openTimer) clearTimeout(openTimer)
      // Instant when something is already open or inside the skip window.
      if (value !== undefined || Date.now() - lastCloseAt < skipDelayDuration) {
        prevValue = value
        value = triggerValue
        return
      }
      openTimer = setTimeout(() => {
        openTimer = null
        prevValue = value
        value = triggerValue
      }, delayDuration)
    },
    cancelDelayedOpen: () => {
      if (openTimer) {
        clearTimeout(openTimer)
        openTimer = null
      }
    },
  })

  $effect(() => {
    return () => {
      if (openTimer) clearTimeout(openTimer)
    }
  })

  // Outside pointer down closes the open panel.
  $effect(() => {
    if (value === undefined) return
    function onPointerDown(e: PointerEvent) {
      if (rootEl && !rootEl.contains(e.target as Node)) {
        prevValue = value
        value = undefined
        lastCloseAt = Date.now()
      }
    }
    const t = setTimeout(() => document.addEventListener('pointerdown', onPointerDown), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  })
</script>

<div
  bind:this={rootEl}
  data-uipkge=""
  data-slot="navigation-menu"
  data-viewport={viewport}
  data-orientation="horizontal"
  class={cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', className)}
  onmouseleave={(e) => {
    setValue(undefined)
    onmouseleave?.(e)
  }}
  {...restProps}
>
  {@render children?.()}
  {#if viewport}
    <NavigationMenuViewport />
  {/if}
</div>

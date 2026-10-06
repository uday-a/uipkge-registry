<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled open menu id. When omitted the menubar is uncontrolled. */
    value?: string
    defaultValue?: string
    /** When false, arrow keys stop at the first/last trigger instead of wrapping. */
    loop?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { setMenubarRootContext } from './MenubarContext'

  let {
    class: className,
    value = $bindable(),
    defaultValue,
    loop = true,
    children,
    ref = $bindable(null),
    ...restProps
  }: MenubarProps = $props()

  let seeded = false
  $effect.pre(() => {
    if (!seeded && value === undefined && defaultValue !== undefined) {
      value = defaultValue
    }
    seeded = true
  })

  let rootEl: HTMLDivElement | null = $state(null)
  $effect(() => {
    ref = rootEl
  })

  const triggers: Array<{ id: string; getEl: () => HTMLElement | null }> = []

  function focusTriggerById(id: string) {
    triggers.find((t) => t.id === id)?.getEl()?.focus()
  }

  setMenubarRootContext({
    getOpenMenu: () => value ?? null,
    setOpenMenu: (id, refocusTrigger = false) => {
      const prev = value ?? null
      value = id ?? undefined
      if (refocusTrigger && prev) {
        requestAnimationFrame(() => focusTriggerById(prev))
      }
    },
    registerTrigger(id, getEl) {
      const entry = { id, getEl }
      triggers.push(entry)
      return () => {
        const i = triggers.indexOf(entry)
        if (i >= 0) triggers.splice(i, 1)
      }
    },
    focusSiblingTrigger(id, dir) {
      const live = triggers.filter((t) => t.getEl()?.isConnected)
      if (live.length === 0) return null
      const index = Math.max(0, live.findIndex((t) => t.id === id))
      let next = index + dir
      if (loop) next = (next + live.length) % live.length
      else next = Math.min(live.length - 1, Math.max(0, next))
      const target = live[next]!
      target.getEl()?.focus()
      return target.id
    },
    getRootEl: () => rootEl,
  })

  // Outside pointer down closes the open menu (no portal here — the open
  // content renders inline inside its menu, so "outside root" is the test).
  $effect(() => {
    if (value == null) return
    function onPointerDown(e: PointerEvent) {
      if (rootEl && !rootEl.contains(e.target as Node)) value = undefined
    }
    // Register async so the opening click itself doesn't immediately close.
    const t = setTimeout(() => document.addEventListener('pointerdown', onPointerDown), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  })
</script>

<div
  bind:this={rootEl}
  role="menubar"
  aria-orientation="horizontal"
  data-uipkge=""
  data-slot="menubar"
  class={cn('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs', className)}
  {...restProps}
>
  {@render children?.()}
</div>

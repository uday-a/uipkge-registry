<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type ResizableDirection = 'horizontal' | 'vertical'

  export interface ResizablePanelSpec {
    defaultSize?: number
    minSize?: number
    maxSize?: number
  }

  /** Context shared with ResizablePanel / ResizableHandle. Getters stay reactive in children. */
  export interface ResizableGroupContext {
    readonly direction: ResizableDirection
    readonly disabled: boolean
    sizeOf: (id: string) => number
    registerPanel: (id: string, spec: ResizablePanelSpec) => void
    unregisterPanel: (id: string) => void
    resize: (beforeId: string, afterId: string, delta: number) => void
    panelIdAt: (index: number) => string | undefined
    panelCount: () => number
  }

  export interface ResizablePanelGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Split direction. Default 'horizontal'. */
    direction?: ResizableDirection
    /** When `true`, handles cannot be dragged. */
    disabled?: boolean
    /** Called with the ordered panel sizes (percent) after every resize commit. */
    onLayoutChange?: (sizes: number[]) => void
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    direction = 'horizontal',
    disabled = false,
    onLayoutChange,
    children,
    ref = $bindable(null),
    ...restProps
  }: ResizablePanelGroupProps = $props()

  let root: HTMLDivElement | null = null
  // Explicit sizes written by drag/keyboard commits, keyed by panel id.
  let overrides = $state<Record<string, number>>({})
  let specs = $state<Record<string, ResizablePanelSpec>>({})
  // Bump to recompute order after mount/unmount (DOM order is the source of truth).
  let registryVersion = $state(0)

  $effect(() => {
    ref = root
  })

  /** Panel ids in DOM order. */
  function orderedIds(): string[] {
    if (!root) return Object.keys(specs)
    return [...root.querySelectorAll(':scope > [data-slot="resizable-panel"]')]
      .map((el) => el.getAttribute('data-panel-id'))
      .filter((id): id is string => id != null && id in specs)
  }

  /** Resolved layout: overrides win, then defaultSize, remainder split equally, normalized to 100. */
  const layout = $derived.by(() => {
    registryVersion
    const ids = orderedIds()
    const explicit = new Map<string, number>()
    let remainder = 100
    const flexible: string[] = []
    for (const id of ids) {
      const spec = specs[id]!
      const pinned = overrides[id] ?? spec.defaultSize
      if (pinned != null) {
        explicit.set(id, pinned)
        remainder -= pinned
      } else {
        flexible.push(id)
      }
    }
    if (flexible.length > 0) {
      const share = remainder / flexible.length
      for (const id of flexible) explicit.set(id, share)
    }
    const total = [...explicit.values()].reduce((a, b) => a + b, 0) || 1
    return ids.map((id) => ({ id, size: ((explicit.get(id) ?? 0) / total) * 100 }))
  })

  function sizeOf(id: string): number {
    return layout.find((p) => p.id === id)?.size ?? 0
  }

  function emitLayout() {
    onLayoutChange?.(layout.map((p) => Math.round(p.size * 100) / 100))
  }

  function resize(beforeId: string, afterId: string, delta: number) {
    if (disabled || delta === 0) return
    const before = layout.find((p) => p.id === beforeId)
    const after = layout.find((p) => p.id === afterId)
    if (!before || !after) return
    const beforeSpec = specs[beforeId] ?? {}
    const afterSpec = specs[afterId] ?? {}
    const beforeMin = beforeSpec.minSize ?? 0
    const beforeMax = beforeSpec.maxSize ?? 100
    const afterMin = afterSpec.minSize ?? 0
    const afterMax = afterSpec.maxSize ?? 100
    // Clamp the delta so neither panel leaves its [min, max] window.
    const clamped = Math.min(
      Math.max(delta, beforeMin - before.size, after.size - afterMax),
      beforeMax - before.size,
      after.size - afterMin,
    )
    if (clamped === 0) return
    overrides = {
      ...overrides,
      [beforeId]: before.size + clamped,
      [afterId]: after.size - clamped,
    }
    emitLayout()
  }

  setContext<ResizableGroupContext>('resizableGroup', {
    get direction() {
      return direction
    },
    get disabled() {
      return disabled
    },
    sizeOf,
    registerPanel: (id, spec) => {
      specs = { ...specs, [id]: spec }
      registryVersion += 1
    },
    unregisterPanel: (id) => {
      const { [id]: _removedSpec, ...restSpecs } = specs
      void _removedSpec
      specs = restSpecs
      const { [id]: _removedOverride, ...restOverrides } = overrides
      void _removedOverride
      overrides = restOverrides
      registryVersion += 1
    },
    resize,
    panelIdAt: (index) => orderedIds()[index],
    panelCount: () => orderedIds().length,
  })
</script>

<div
  bind:this={root}
  data-uipkge=""
  data-slot="resizable-panel-group"
  data-orientation={direction}
  data-disabled={disabled || undefined}
  class={cn('flex h-full w-full data-[orientation=vertical]:flex-col', className)}
  {...restProps}
>
  {@render children?.()}
</div>

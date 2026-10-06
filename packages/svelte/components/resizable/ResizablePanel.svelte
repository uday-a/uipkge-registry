<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ResizableGroupContext } from './ResizablePanelGroup.svelte'

  export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
    /** Stable id used for layout bookkeeping + handle aria-controls. Auto-generated when omitted. */
    id?: string
    /** Initial size in percent. Panels without one split the remainder equally. */
    defaultSize?: number
    /** Minimum size in percent. */
    minSize?: number
    /** Maximum size in percent. */
    maxSize?: number
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    id: idProp = undefined,
    defaultSize = undefined,
    minSize = undefined,
    maxSize = undefined,
    children,
    ref = $bindable(null),
    ...restProps
  }: ResizablePanelProps = $props()

  const group = getContext<ResizableGroupContext | undefined>('resizableGroup')
  const autoId = $props.id()
  const panelId = $derived(idProp ?? `resizable-panel-${autoId}`)

  $effect(() => {
    if (!group) return
    group.registerPanel(panelId, { defaultSize, minSize, maxSize })
    return () => group.unregisterPanel(panelId)
  })

  const size = $derived(group?.sizeOf(panelId) ?? 0)
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="resizable-panel"
  data-panel-id={panelId}
  id={panelId}
  style="flex: {size} 1 0px; min-height: 0; min-width: 0;"
  class={cn('relative', className)}
  {...restProps}
>
  {@render children?.()}
</div>

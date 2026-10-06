<script lang="ts" module>
  import { getContext, setContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface VerticalTabsProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    /** Controlled active value. Omit for uncontrolled mode with `defaultValue`. */
    value?: string
    /** Initial active value in uncontrolled mode. */
    defaultValue?: string
    onValueChange?: (value: string) => void
  }

  export interface VerticalTabsContext {
    getValue: () => string | undefined
    select: (value: string) => void
    rootId: string
  }

  const VERTICAL_TABS_KEY = Symbol('vertical-tabs')

  export function setVerticalTabsContext(ctx: VerticalTabsContext) {
    setContext(VERTICAL_TABS_KEY, ctx)
  }

  export function getVerticalTabsContext(component: string): VerticalTabsContext {
    const ctx = getContext<VerticalTabsContext | undefined>(VERTICAL_TABS_KEY)
    if (!ctx) throw new Error(`<${component}> must be used inside <VerticalTabs>`)
    return ctx
  }

  /** Keep value-derived element ids valid when values contain spaces or symbols. */
  export function sanitizeId(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-')
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { children, value = $bindable(), defaultValue, onValueChange, class: className, ...restProps }: VerticalTabsProps =
    $props()

  const rootId = $props.id()

  let internal = $state(defaultValue)
  const current = $derived(value ?? internal)

  function select(v: string) {
    if (value === undefined) internal = v
    onValueChange?.(v)
  }

  setVerticalTabsContext({
    getValue: () => current,
    select,
    rootId,
  })
</script>

<div
  data-uipkge
  data-slot="vertical-tabs"
  data-orientation="vertical"
  class={cn('flex w-full gap-6', className)}
  {...restProps}
>
  {@render children?.()}
</div>

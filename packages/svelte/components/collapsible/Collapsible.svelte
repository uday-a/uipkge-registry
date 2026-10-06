<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Controlled open state. Bindable (`bind:open`); falls back to internal state seeded by `defaultOpen`. */
    open?: boolean
    /** Initial open state when `open` is unbound. */
    defaultOpen?: boolean
    /** When `true`, the trigger cannot toggle the content. */
    disabled?: boolean
    /** Fires when the open state changes. */
    onOpenChange?: (open: boolean) => void
    children?: Snippet<[{ open: boolean }]>
  }

  /** Hand-rolled collapsible context (replaces reka-ui's CollapsibleRoot state). */
  export interface CollapsibleContext {
    readonly isOpen: boolean
    readonly disabled: boolean
    readonly contentId: string
    toggle: () => void
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'

  let {
    class: className,
    open = $bindable(),
    defaultOpen = false,
    disabled = false,
    onOpenChange,
    children,
    ...restProps
  }: CollapsibleProps = $props()

  // Intentional one-shot seed: later `defaultOpen` changes must not clobber user toggles.
  // svelte-ignore state_referenced_locally
  let internalOpen = $state(defaultOpen)
  const isOpen = $derived(open ?? internalOpen)

  const contentId = `collapsible-${Math.random().toString(36).slice(2, 9)}`

  function toggle() {
    if (disabled) return
    const next = !isOpen
    if (open === undefined) internalOpen = next
    open = next
    onOpenChange?.(next)
  }

  setContext<CollapsibleContext>('collapsibleContext', {
    get isOpen() {
      return isOpen
    },
    get disabled() {
      return disabled
    },
    get contentId() {
      return contentId
    },
    toggle,
  })
</script>

<div data-uipkge data-slot="collapsible" data-state={isOpen ? 'open' : 'closed'} class={className} {...restProps}>
  {@render children?.({ open: isOpen })}
</div>

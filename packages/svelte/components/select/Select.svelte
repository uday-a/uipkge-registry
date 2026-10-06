<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SelectProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled value. Omit + use `defaultValue` for uncontrolled. */
    value?: string
    defaultValue?: string
    /** Controlled open state. Omit + use `defaultOpen` for uncontrolled. */
    open?: boolean
    defaultOpen?: boolean
    disabled?: boolean
    /** Renders a hidden input so the value submits with native forms. */
    name?: string
    required?: boolean
    onValueChange?: (value: string) => void
    onOpenChange?: (open: boolean) => void
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext, untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { SELECT_CONTEXT_KEY, type SelectContext, type SelectItemData } from './select-context'

  let {
    class: className,
    value = $bindable<string | undefined>(),
    defaultValue,
    open = $bindable<boolean | undefined>(),
    defaultOpen = false,
    disabled = false,
    name,
    required = false,
    onValueChange,
    onOpenChange,
    children,
    ref = $bindable(null),
    ...restProps
  }: SelectProps = $props()

  let innerValue = $state<string | undefined>(defaultValue)
  let innerOpen = $state(defaultOpen)
  let highlighted = $state<string | undefined>(undefined)
  let items = $state<SelectItemData[]>([])
  let triggerEl = $state<HTMLElement | null>(null)

  const currentValue = $derived(value ?? innerValue)
  const currentOpen = $derived(open ?? innerOpen)

  const triggerId = `select-trigger-${Math.random().toString(36).slice(2, 9)}`
  const contentId = `select-content-${Math.random().toString(36).slice(2, 9)}`

  function setOpen(next: boolean) {
    if (disabled) return
    innerOpen = next
    open = next
    onOpenChange?.(next)
    if (next) {
      const enabled = items.filter((i) => !i.disabled)
      const selected = enabled.find((i) => i.value === currentValue)
      highlighted = (selected ?? enabled[0])?.value
    } else {
      highlighted = undefined
    }
  }

  function selectValue(next: string) {
    innerValue = next
    value = next
    onValueChange?.(next)
    setOpen(false)
    focusTrigger()
  }

  function moveHighlight(direction: 1 | -1) {
    const enabled = items.filter((i) => !i.disabled)
    if (enabled.length === 0) return
    const idx = enabled.findIndex((i) => i.value === highlighted)
    const next = idx < 0 ? (direction === 1 ? 0 : enabled.length - 1) : (idx + direction + enabled.length) % enabled.length
    highlighted = enabled[next]!.value
  }

  function highlightFirst() {
    highlighted = items.find((i) => !i.disabled)?.value
  }

  function highlightLast() {
    const enabled = items.filter((i) => !i.disabled)
    highlighted = enabled[enabled.length - 1]?.value
  }

  // Called from each SelectItem's $effect. Untracked so reading `items` here
  // doesn't make every item's effect depend on the whole list — otherwise each
  // registration re-ran all items' effects (effect_update_depth_exceeded).
  function registerItem(item: SelectItemData) {
    untrack(() => {
      const idx = items.findIndex((i) => i.value === item.value)
      if (idx >= 0) items[idx] = item
      else items.push(item)
    })
  }

  function unregisterItem(itemValue: string) {
    untrack(() => {
      items = items.filter((i) => i.value !== itemValue)
    })
  }

  function registerTrigger(el: HTMLElement | null) {
    triggerEl = el
  }

  function focusTrigger() {
    triggerEl?.focus()
  }

  const ctx: SelectContext = {
    get open() {
      return currentOpen
    },
    get value() {
      return currentValue
    },
    get highlighted() {
      return highlighted
    },
    get disabled() {
      return disabled
    },
    get items() {
      return items
    },
    get triggerId() {
      return triggerId
    },
    get contentId() {
      return contentId
    },
    get triggerEl() {
      return triggerEl
    },
    setOpen,
    selectValue,
    setHighlighted: (v) => (highlighted = v),
    moveHighlight,
    highlightFirst,
    highlightLast,
    registerItem,
    unregisterItem,
    registerTrigger,
    focusTrigger,
  }
  setContext(SELECT_CONTEXT_KEY, ctx)
</script>

<div bind:this={ref} data-uipkge data-slot="select" data-state={currentOpen ? 'open' : 'closed'} class={cn('relative', className)} {...restProps}>
  {@render children?.()}
  {#if name}
    <input type="hidden" {name} value={currentValue ?? ''} {required} />
  {/if}
</div>

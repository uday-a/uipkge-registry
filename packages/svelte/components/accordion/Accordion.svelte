<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'separated' | 'ghost'
    type?: 'single' | 'multiple'
    /** Controlled open value. Pair with `bind:value`. */
    value?: string | string[] | undefined
    /** Uncontrolled initial value. */
    defaultValue?: string | string[]
    collapsible?: boolean
    disabled?: boolean
    dir?: 'ltr' | 'rtl'
    orientation?: 'horizontal' | 'vertical'
    /** Render your own root element with the accordion's props and styles. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLDivElement | null
    onValueChange?: (value: string | string[] | undefined) => void
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { accordionVariants } from './accordion.variants'
  import { ACCORDION_ROOT_KEY, type AccordionRootContext } from './context'

  let {
    class: className,
    variant = 'default',
    type = 'single',
    value = $bindable(),
    defaultValue,
    collapsible = false,
    disabled = false,
    dir,
    orientation = 'vertical',
    child,
    children,
    ref = $bindable(null),
    onValueChange,
    ...restProps
  }: AccordionProps = $props()

  function normalizeSingle(v: string | string[] | undefined): string | undefined {
    return Array.isArray(v) ? v[0] : v
  }

  function normalizeMultiple(v: string | string[] | undefined): string[] {
    if (v === undefined) return []
    return Array.isArray(v) ? [...v] : [v]
  }

  // Snapshot once: later `type` / `defaultValue` changes must not reset user state.
  const getInitialState = () => {
    const initial = value ?? defaultValue
    return {
      single: type === 'single' ? normalizeSingle(initial) : undefined,
      multiple: type === 'multiple' ? normalizeMultiple(initial) : [],
    }
  }
  const initialState = getInitialState()
  let internalSingle = $state<string | undefined>(initialState.single)
  let internalMultiple = $state<string[]>(initialState.multiple)

  // Controlled mode: a bound `value` always wins over internal state.
  $effect.pre(() => {
    if (value === undefined) return
    if (type === 'single') internalSingle = normalizeSingle(value)
    else internalMultiple = normalizeMultiple(value)
  })

  function isOpen(itemValue: string): boolean {
    return type === 'single' ? internalSingle === itemValue : internalMultiple.includes(itemValue)
  }

  function toggle(itemValue: string) {
    if (type === 'single') {
      const next = internalSingle === itemValue ? (collapsible ? undefined : itemValue) : itemValue
      internalSingle = next
      value = next
      onValueChange?.(next)
    } else {
      const next = internalMultiple.includes(itemValue)
        ? internalMultiple.filter((v) => v !== itemValue)
        : [...internalMultiple, itemValue]
      internalMultiple = next
      value = next
      onValueChange?.(next)
    }
  }

  // Trigger registry for WAI-ARIA arrow-key navigation. Registration order
  // follows mount order, which matches DOM order for static item lists.
  const triggers: HTMLElement[] = []

  function registerTrigger(el: HTMLElement) {
    if (!triggers.includes(el)) triggers.push(el)
  }

  function unregisterTrigger(el: HTMLElement) {
    const i = triggers.indexOf(el)
    if (i >= 0) triggers.splice(i, 1)
  }

  function focusSiblingTrigger(current: HTMLElement, target: 1 | -1 | 'first' | 'last') {
    if (triggers.length === 0) return
    const i = triggers.indexOf(current)
    if (target === 'first') triggers[0]?.focus()
    else if (target === 'last') triggers[triggers.length - 1]?.focus()
    else triggers[(i + target + triggers.length) % triggers.length]?.focus()
  }

  setContext<AccordionRootContext>(ACCORDION_ROOT_KEY, {
    get variant() {
      return variant
    },
    get type() {
      return type
    },
    get collapsible() {
      return collapsible
    },
    get disabled() {
      return disabled
    },
    get orientation() {
      return orientation
    },
    isOpen,
    toggle,
    registerTrigger,
    unregisterTrigger,
    focusSiblingTrigger,
  })

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'accordion',
    'data-variant': variant,
    'data-orientation': orientation,
    dir,
    class: cn(accordionVariants({ variant }), className),
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <div bind:this={ref} {...mergedProps}>{@render children?.()}</div>
{/if}

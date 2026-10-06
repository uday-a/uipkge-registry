<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FloatLabelProps extends HTMLAttributes<HTMLDivElement> {
    label: string
    required?: boolean
    disabled?: boolean
    ref?: HTMLDivElement | null
  }

  // Client-only counter for generated control ids. Assigned in onMount (never
  // during SSR) so server and client markup stay identical.
  let nextControlId = 0
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    label,
    required = false,
    disabled = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: FloatLabelProps = $props()

  let isFocused = $state(false)
  let hasValue = $state(false)
  let controlId = $state<string | undefined>(undefined)

  const isFloating = $derived(isFocused || hasValue)

  function checkValue(target: EventTarget | null) {
    const el = target as HTMLElement | null
    if (!el) return
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      hasValue = !!el.value
    } else if (el instanceof HTMLSelectElement) {
      hasValue = !!el.value
    } else {
      const input = el.querySelector?.('input, textarea, select') as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null
      if (input) hasValue = !!input.value
    }
  }

  function handleFocusin(event: FocusEvent) {
    isFocused = true
    checkValue(event.target)
  }

  function handleFocusout(event: FocusEvent) {
    isFocused = false
    checkValue(event.target)
  }

  function handleInput(event: Event) {
    checkValue(event.target)
  }

  // Check for prefilled value on mount + associate label with the control.
  onMount(() => {
    if (!ref) return
    const input = ref.querySelector('input, textarea, select') as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null
    if (!input) return
    hasValue = !!input.value
    if (input.id) {
      controlId = input.id
    } else {
      nextControlId += 1
      input.id = `float-label-${nextControlId}`
      controlId = input.id
    }
  })

  const wrapperClasses = $derived(cn('relative flex flex-col', disabled && 'cursor-not-allowed opacity-50', className))

  const labelClasses = $derived(
    cn(
      'text-muted-foreground pointer-events-none absolute left-3 z-10 bg-transparent px-1 text-sm transition-[color,background-color,top,translate,scale] duration-200',
      !isFloating && 'top-1/2 -translate-y-1/2',
      isFloating && 'bg-background text-foreground top-0 -translate-y-1/2 scale-75',
      isFocused && 'text-ring',
      required && "after:text-destructive after:ml-0.5 after:content-['*']",
    ),
  )
</script>

<div
  bind:this={ref}
  class={wrapperClasses}
  data-uipkge
  data-slot="float-label"
  data-floating={isFloating}
  onfocusin={handleFocusin}
  onfocusout={handleFocusout}
  oninput={handleInput}
  onchange={handleInput}
  {...restProps}
>
  <label for={controlId} class={labelClasses}>
    {label}
  </label>
  {@render children?.()}
</div>

<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type ToggleGroupItemClickEvent = Parameters<NonNullable<HTMLButtonAttributes['onclick']>>[0]

  export interface ToggleGroupItemProps extends HTMLButtonAttributes {
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    value: string
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { toggleVariants } from '$lib/components/ui/toggle/toggle.variants'
  import { getToggleGroupContext } from './context.svelte'

  let {
    class: className,
    variant,
    size,
    value: itemValue,
    disabled = false,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: ToggleGroupItemProps = $props()

  const ctx = getToggleGroupContext()

  const effectiveVariant = $derived(ctx?.variant ?? variant)
  const effectiveSize = $derived(ctx?.size ?? size)
  const effectiveSpacing = $derived(ctx?.spacing)
  const selected = $derived(ctx?.isSelected(itemValue) ?? false)

  function handleClick(event: ToggleGroupItemClickEvent) {
    onclick?.(event)
    if (disabled || event.defaultPrevented) return
    ctx?.select(itemValue)
  }
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge=""
  data-slot="toggle-group-item"
  data-variant={effectiveVariant}
  data-size={effectiveSize}
  data-spacing={effectiveSpacing}
  data-state={selected ? 'on' : 'off'}
  aria-pressed={selected}
  {disabled}
  class={cn(
    toggleVariants({
      variant: effectiveVariant,
      size: effectiveSize,
    }),
    // z-10 keeps label/icons above the sliding indicator. When the parent
    // has data-animated=true (single-select), on-state surface lives on the
    // indicator — suppress item bg so the pill can slide cleanly.
    'relative z-10 w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
    'group-data-[animated=true]/toggle-group:data-[state=on]:bg-transparent group-data-[animated=true]/toggle-group:data-[state=on]:hover:bg-transparent',
    // first/last-of-type (not first/last-child): sliding indicator is a sibling span
    // and must not steal end-cap rounding or the outline left border.
    'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first-of-type:rounded-l-md data-[spacing=0]:last-of-type:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first-of-type:border-l',
    className,
  )}
  onclick={handleClick}
  {...restProps}
>
  {@render children?.()}
</button>

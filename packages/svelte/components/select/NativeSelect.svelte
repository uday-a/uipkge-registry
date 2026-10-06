<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes, HTMLSelectAttributes } from 'svelte/elements'

  export interface NativeSelectOption {
    label: string
    value: string | number
    disabled?: boolean
  }

  export interface NativeSelectProps extends HTMLAttributes<HTMLDivElement> {
    value?: string | number
    defaultValue?: string | number
    options?: (NativeSelectOption | string)[]
    /** Primary sizing API (React parity). Wins over `size` when both are set. */
    sizeVariant?: 'sm' | 'md' | 'lg'
    /** @deprecated Use `sizeVariant`. Kept as an alias — both stay functional. */
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    selectClass?: string
    /** Native select passthrough attributes (name, required, aria-*). */
    selectAttributes?: HTMLSelectAttributes
    onValueChange?: (value: string) => void
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { ChevronDown } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = $bindable<string | number | undefined>(),
    defaultValue,
    options,
    sizeVariant,
    size,
    disabled = false,
    selectClass,
    selectAttributes,
    onValueChange,
    children,
    ref = $bindable(null),
    ...restProps
  }: NativeSelectProps = $props()

  const effectiveSize = $derived(sizeVariant ?? size ?? 'md')

  let inner = $state<string | number | undefined>(defaultValue)
  const current = $derived(value ?? inner)

  const sizeClasses: Record<string, string> = {
    sm: 'h-8 text-xs pl-2.5 pr-8',
    md: 'h-9 text-sm pl-3 pr-9',
    lg: 'h-11 text-base pl-4 pr-10',
  }

  const iconSizes: Record<string, string> = {
    sm: 'size-3.5 right-2.5',
    md: 'size-4 right-3',
    lg: 'size-5 right-3.5',
  }

  const normalizedOptions = $derived.by(() => {
    if (!options) return []
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt, disabled: false }
      }
      return opt
    })
  })

  function onChange(e: Event) {
    const next = (e.target as HTMLSelectElement).value
    inner = next
    value = next
    onValueChange?.(next)
  }
</script>

<div bind:this={ref} data-uipkge data-slot="native-select-wrapper" class={cn('relative inline-flex w-full items-center', className)} {...restProps}>
  <select
    data-slot="native-select"
    {disabled}
    value={current}
    class={cn(
      'border-input bg-background w-full appearance-none rounded-md border shadow-xs transition-[color,box-shadow]',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
      'disabled:bg-muted/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[effectiveSize],
      selectClass,
    )}
    onchange={onChange}
    {...selectAttributes}
  >
    {#if normalizedOptions.length > 0}
      {#each normalizedOptions as opt (String(opt.value))}
        <option value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      {/each}
    {:else}
      {@render children?.()}
    {/if}
  </select>
  <ChevronDown
    data-slot="native-select-icon"
    aria-hidden="true"
    class={cn('text-muted-foreground pointer-events-none absolute transition-opacity', disabled && 'opacity-50', iconSizes[effectiveSize])}
  />
</div>

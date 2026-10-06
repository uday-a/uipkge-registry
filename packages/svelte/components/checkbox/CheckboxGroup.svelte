<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CheckboxOption {
    label: string
    value: string
    disabled?: boolean
  }

  export interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Checked values. Bindable (`bind:value`). */
    value?: string[]
    /** Initial checked values when `value` is unbound. */
    defaultValue?: string[]
    /** When `true`, prevents interaction with all checkboxes. */
    disabled?: boolean
    /** Whether the group is in an error state. */
    error?: boolean
    /** Error messages to display. */
    errorMessages?: string | string[]
    /** Label for the group. */
    label?: string
    /** Hint text for the group. */
    hint?: string
    /** The orientation of the checkboxes. */
    orientation?: 'horizontal' | 'vertical'
    /** Whether to show a border around the group. */
    bordered?: boolean
    /** Density of the checkboxes. */
    density?: 'compact' | 'default' | 'comfortable'
    /** Options to render as checkboxes automatically. */
    options?: (string | CheckboxOption)[]
    /** Name attribute for all checkboxes in the group. */
    name?: string
    /** Inline layout (alias for horizontal). */
    inline?: boolean
    /** Fires when the checked values change. */
    onValueChange?: (value: string[]) => void
    children?: Snippet<[{ value: string[] }]>
  }

  /** Hand-rolled group context (replaces reka-ui's CheckboxGroupRoot state). */
  export interface CheckboxGroupContext {
    readonly name: string | undefined
    readonly disabled: boolean
    isSelected: (value: string) => boolean
    toggle: (value: string) => void
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import Checkbox from './Checkbox.svelte'

  let {
    class: className,
    value = $bindable(),
    defaultValue = [],
    disabled = false,
    error = false,
    errorMessages,
    label,
    hint,
    orientation = 'vertical',
    bordered = false,
    density = 'default',
    options,
    name,
    inline = false,
    onValueChange,
    children,
    ...restProps
  }: CheckboxGroupProps = $props()

  // Intentional one-shot seed: later `defaultValue` changes must not clobber user selection.
  // svelte-ignore state_referenced_locally
  let internalValue = $state<string[]>([...defaultValue])
  const resolved = $derived(value ?? internalValue)

  const actualOrientation = $derived(inline ? 'horizontal' : orientation)

  function isSelected(v: string) {
    return resolved.includes(v)
  }

  function toggle(v: string) {
    if (disabled) return
    const next = isSelected(v) ? resolved.filter((item) => item !== v) : [...resolved, v]
    if (value === undefined) internalValue = next
    value = next
    onValueChange?.(next)
  }

  setContext<CheckboxGroupContext>('checkboxGroupContext', {
    get name() {
      return name
    },
    get disabled() {
      return disabled
    },
    isSelected,
    toggle,
  })
</script>

<div
  role="group"
  data-uipkge
  data-slot="checkbox-group"
  data-orientation={actualOrientation}
  class={cn(
    'flex flex-col gap-2',
    actualOrientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
    bordered && 'rounded-lg border p-4',
    className,
  )}
  {...restProps}
>
  {#if label}
    <span class="text-sm font-medium">{label}</span>
  {/if}

  {#if hint && !error}
    <p class="text-muted-foreground text-xs">{hint}</p>
  {/if}

  <div class={cn('flex gap-4', actualOrientation === 'horizontal' ? 'flex-row flex-wrap items-center' : 'flex-col')}>
    {#if options && options.length > 0}
      {#each options as option, i (typeof option === 'string' ? option : `${option.value}-${i}`)}
        <Checkbox
          value={typeof option === 'string' ? option : option.value}
          label={typeof option === 'string' ? option : option.label}
          disabled={disabled || (typeof option === 'string' ? undefined : option.disabled)}
          {name}
          {density}
        />
      {/each}
    {:else if children}
      {@render children({ value: resolved })}
    {/if}
  </div>

  {#if error || errorMessages}
    <div class="flex flex-col gap-0.5">
      {#if typeof errorMessages === 'string'}
        <p class="text-destructive text-xs">{errorMessages}</p>
      {:else}
        {#each errorMessages ?? [] as msg (msg)}
          <p class="text-destructive text-xs">{msg}</p>
        {/each}
      {/if}
    </div>
  {/if}
</div>

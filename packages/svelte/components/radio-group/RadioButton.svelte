<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { RadioGroupContext } from './RadioGroup.svelte'

  export interface RadioButtonProps extends HTMLButtonAttributes {
    value: any
    /** Size of the button radio. Defaults to the group's size. */
    size?: 'small' | 'middle' | 'large'
    /** Visual variant. Defaults to the group's buttonVariant. */
    variant?: 'outline' | 'solid'
    /** Label text */
    label?: string
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext, untrack } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    value,
    size = undefined,
    variant = undefined,
    label = undefined,
    disabled = undefined,
    children,
    onclick: onclickProp,
    ref = $bindable(null),
    ...restProps
  }: RadioButtonProps = $props()

  const group = getContext<RadioGroupContext | undefined>('radioGroup')

  let el: HTMLButtonElement | null = null

  $effect(() => {
    ref = el
  })

  const effectiveSize = $derived(size ?? group?.size ?? 'middle')
  const effectiveVariant = $derived(variant ?? group?.buttonVariant ?? 'outline')
  const effectiveDisabled = $derived(disabled ?? group?.disabled ?? false)
  const checked = $derived(group?.current === value)
  const tabbable = $derived(group ? group.tabbableValue === value : true)

  $effect(() => {
    if (!el || !group) return
    const node = el
    const v = value
    const d = effectiveDisabled
    // untrack: keep the register write from subscribing this effect to the
    // group's `registered` state (effect_update_depth_exceeded). See RadioGroup.
    untrack(() => group.register(v, d, node))
    return () => group.unregister(node)
  })

  const sizeClasses = {
    small: 'h-7 px-2.5 text-xs',
    middle: 'h-8 px-4 text-sm',
    large: 'h-10 px-4.5 text-base',
  }

  const variantClasses = {
    outline: cn(
      'border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50',
      'data-[state=checked]:border-primary data-[state=checked]:text-primary',
      'disabled:hover:bg-transparent',
    ),
    solid: cn(
      'border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50',
      'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'disabled:hover:bg-transparent',
    ),
  }

  const groupClasses = $derived(
    group?.orientation === 'vertical'
      ? 'rounded-md w-full justify-start'
      : cn('rounded-none first:rounded-l-md last:rounded-r-md', 'border-l-0 first:border-l', '-ml-px first:ml-0'),
  )
</script>

<button
  bind:this={el}
  type="button"
  role="radio"
  data-uipkge=""
  data-slot="radio-button"
  data-value={typeof value === 'string' ? value : undefined}
  data-state={checked ? 'checked' : 'unchecked'}
  data-disabled={effectiveDisabled || undefined}
  aria-checked={checked}
  disabled={effectiveDisabled}
  tabindex={tabbable ? 0 : -1}
  class={cn(
    'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-200',
    'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[effectiveSize],
    variantClasses[effectiveVariant],
    groupClasses,
    className,
  )}
  {...restProps}
  onclick={(e) => {
    if (!effectiveDisabled) group?.select(value)
    onclickProp?.(e)
  }}
>
  {#if children}
    {@render children()}
  {:else}
    {label ?? value}
  {/if}
</button>

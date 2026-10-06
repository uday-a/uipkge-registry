<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface InputGroupButtonProps extends HTMLButtonAttributes {
    variant?: 'default' | 'secondary' | 'ghost' | 'outline'
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    variant = 'ghost',
    type = 'button',
    disabled,
    children,
    ref = $bindable(null),
    ...restProps
  }: InputGroupButtonProps = $props()

  const variantClasses: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border-l border-input hover:bg-accent hover:text-accent-foreground',
  }
</script>

<button
  bind:this={ref}
  {type}
  data-uipkge=""
  data-slot="input-group-button"
  data-variant={variant}
  {disabled}
  class={cn(
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 px-3 text-sm font-medium transition-colors select-none',
    'first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]',
    'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</button>

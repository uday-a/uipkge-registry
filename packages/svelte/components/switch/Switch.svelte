<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface SwitchProps extends HTMLButtonAttributes {
    /** Controlled checked state. Bind with `bind:checked`. */
    checked?: boolean
    /** Initial state for uncontrolled usage. */
    defaultChecked?: boolean
    size?: 'sm' | 'default' | 'lg'
    checkedChildren?: string
    unCheckedChildren?: string
    loading?: boolean
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string
    /** Snippet overrides for the track labels. Presence implies `hasChildren` layout. */
    checkedSnippet?: Snippet
    uncheckedSnippet?: Snippet
    /** Thumb content override. Receives the current checked state. */
    thumb?: Snippet<[{ checked: boolean }]>
    ref?: HTMLButtonElement | null
    onCheckedChange?: (checked: boolean) => void
  }
</script>

<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements'
  import { Loader2 } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    defaultChecked = false,
    checked = $bindable(defaultChecked),
    size = 'default',
    checkedChildren,
    unCheckedChildren,
    loading = false,
    color,
    checkedSnippet,
    uncheckedSnippet,
    thumb,
    ref = $bindable(null),
    onCheckedChange,
    disabled,
    onclick,
    ...restProps
  }: SwitchProps = $props()

  function setChecked(next: boolean, notify = true) {
    checked = next
    if (notify) onCheckedChange?.(next)
  }

  const toggle: MouseEventHandler<HTMLButtonElement> = (event) => {
    onclick?.(event)
    if (event.defaultPrevented) return
    if (disabled || loading) return
    setChecked(!checked)
  }

  const hasChildren = $derived(Boolean(checkedChildren || unCheckedChildren || checkedSnippet || uncheckedSnippet))

  const sizeClasses = $derived.by(() => {
    const height = { sm: 'h-4', default: 'h-5', lg: 'h-6' }[size]
    if (hasChildren) {
      const width = { sm: 'min-w-8 w-fit', default: 'min-w-10 w-fit', lg: 'min-w-13 w-fit' }[size]
      return `${height} ${width}`
    }
    const width = { sm: 'w-6', default: 'w-8', lg: 'w-11' }[size]
    return `${height} ${width}`
  })

  const thumbSizes = { sm: 'size-3', default: 'size-4', lg: 'size-5' } as const
  const thumbTranslate = {
    sm: 'data-[state=checked]:translate-x-[calc(100%-2px)]',
    default: 'data-[state=checked]:translate-x-[calc(100%-2px)]',
    lg: 'data-[state=checked]:translate-x-[calc(100%-5px)]',
  } as const
  const textSizes = { sm: 'text-[0.5rem]', default: 'text-xs', lg: 'text-xs' } as const
  const thumbIconSizes = { sm: 'size-2', default: 'size-3', lg: 'size-3' } as const

  const colorMap: Record<string, string> = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--destructive)',
    info: 'var(--info)',
  }
</script>

<button
  bind:this={ref}
  type="button"
  role="switch"
  aria-checked={checked}
  data-uipkge=""
  data-slot="switch"
  data-state={checked ? 'checked' : 'unchecked'}
  data-size={size}
  disabled={disabled || loading}
  style="--switch-checked-bg: {color ? colorMap[color] || color : 'var(--primary)'}"
  class={cn(
    'peer focus-visible:ring-ring/50 focus-visible:border-ring data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 relative inline-flex shrink-0 items-center overflow-hidden rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--switch-checked-bg)]',
    'touch-manipulation enabled:active:scale-[0.97] enabled:active:duration-100 motion-safe:transition-[background-color,border-color,box-shadow,transform,scale] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
    sizeClasses,
    className,
  )}
  onclick={toggle}
  {...restProps}
>
  {#if hasChildren}
    <div
      class={cn(
        'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        checked ? 'translate-x-0 opacity-100' : '-translate-x-0.5 opacity-0',
        textSizes[size],
      )}
    >
      <span class="text-primary-foreground truncate font-medium">
        {#if checkedSnippet}{@render checkedSnippet()}{:else}{checkedChildren}{/if}
      </span>
    </div>
    <div
      class={cn(
        'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        !checked ? 'translate-x-0 opacity-100' : 'translate-x-0.5 opacity-0',
        textSizes[size],
      )}
    >
      <span class="text-muted-foreground truncate font-medium">
        {#if uncheckedSnippet}{@render uncheckedSnippet()}{:else}{unCheckedChildren}{/if}
      </span>
    </div>
  {/if}

  <span
    data-uipkge=""
    data-slot="switch-thumb"
    data-state={checked ? 'checked' : 'unchecked'}
    class={cn(
      'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none z-10 flex items-center justify-center rounded-full shadow-sm ring-0 data-[state=unchecked]:translate-x-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1.15,0.36,1)] motion-reduce:transition-none',
      thumbSizes[size],
      thumbTranslate[size],
    )}
  >
    {#if loading}
      <Loader2 class={cn(thumbIconSizes[size], 'text-muted-foreground motion-safe:animate-spin')} />
    {:else if thumb}
      {@render thumb({ checked })}
    {/if}
  </span>
</button>

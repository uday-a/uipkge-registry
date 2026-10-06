<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type RadioOption = string | { label: string; value: string; disabled?: boolean }

  /** Context shared with RadioGroupItem / RadioButton. Getters stay reactive in children. */
  export interface RadioGroupContext {
    readonly current: unknown
    readonly disabled: boolean
    readonly size: 'small' | 'middle' | 'large'
    readonly optionType: 'default' | 'button'
    readonly buttonVariant: 'outline' | 'solid'
    readonly orientation: 'horizontal' | 'vertical'
    readonly tabbableValue: unknown
    select: (value: unknown) => void
    register: (value: unknown, disabled: boolean, el: HTMLElement) => void
    unregister: (el: HTMLElement) => void
  }

  // Omit `children`: the snippet carries the group value, which narrows the base `Snippet` type.
  export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** The controlled value. Bindable. */
    value?: any
    /** Initial value for uncontrolled use. */
    defaultValue?: any
    /** Called with the new value after every commit. */
    onValueChange?: (value: any) => void
    /** When `true`, prevents the user from interacting with the radio group */
    disabled?: boolean
    /** The orientation of the radio items */
    orientation?: 'horizontal' | 'vertical'
    /** When `true`, keyboard navigation will loop from last item to first, and vice versa */
    loop?: boolean
    /** Label for the radio group */
    label?: string
    /** Hint text for the radio group */
    hint?: string
    /** Error messages to display */
    errorMessages?: string | string[]
    /** Whether to show error state */
    error?: boolean
    /** Density of the radio items */
    density?: 'compact' | 'default' | 'comfortable'
    /** Whether the radio group appears flat */
    flat?: boolean
    /** Whether to show a border around the group */
    bordered?: boolean
    /** The reading direction */
    dir?: 'ltr' | 'rtl'
    /** Array of options to render automatically */
    options?: RadioOption[]
    /** Size of button-style radios */
    size?: 'small' | 'middle' | 'large'
    /** Type of options to render */
    optionType?: 'default' | 'button'
    /** Visual variant for button-style radios */
    buttonVariant?: 'outline' | 'solid'
    /** Form field name. Renders a hidden input so the value submits with native forms. */
    name?: string
    /** Marks the group as required for assistive tech. */
    required?: boolean
    children?: Snippet<[{ value: unknown }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import RadioButton from './RadioButton.svelte'
  import RadioGroupItem from './RadioGroupItem.svelte'

  let {
    class: className,
    value = $bindable(),
    defaultValue = undefined,
    onValueChange,
    disabled = false,
    orientation = 'vertical',
    loop = true,
    label = undefined,
    hint = undefined,
    errorMessages = undefined,
    error = false,
    density = 'default',
    flat = false,
    bordered = false,
    dir = undefined,
    options = undefined,
    size = 'middle',
    optionType = 'default',
    buttonVariant = 'outline',
    name = undefined,
    required = false,
    children,
    onkeydown: onkeydownProp,
    ref = $bindable(null),
    ...restProps
  }: RadioGroupProps = $props()

  let root: HTMLDivElement | null = null
  // Uncontrolled seed: intentionally the initial `defaultValue` only.
  // svelte-ignore state_referenced_locally
  let internal = $state<any>(defaultValue)
  let registered = $state<{ value: unknown; disabled: boolean; el: HTMLElement }[]>([])

  // `bind:this` can only target one variable; mirror the root onto `ref`.
  $effect(() => {
    ref = root
  })

  const current = $derived(value ?? internal)

  const tabbableValue = $derived.by(() => {
    if (registered.some((r) => r.value === current && !r.disabled)) return current
    return registered.find((r) => !r.disabled)?.value
  })

  function select(next: unknown) {
    if (disabled) return
    internal = next
    value = next
    onValueChange?.(next)
  }

  setContext<RadioGroupContext>('radioGroup', {
    get current() {
      return current
    },
    get disabled() {
      return disabled
    },
    get size() {
      return size
    },
    get optionType() {
      return optionType
    },
    get buttonVariant() {
      return buttonVariant
    },
    get orientation() {
      return orientation
    },
    get tabbableValue() {
      return tabbableValue
    },
    select,
    register: (v, d, el) => {
      // Idempotent: the item $effect re-runs when registration itself
      // invalidates its deps, so a redundant write would ping-pong forever
      // (effect_update_depth_exceeded). Skip the write when nothing changed.
      const existing = registered.find((r) => r.el === el)
      if (existing && existing.value === v && existing.disabled === d) return
      registered = [...registered.filter((r) => r.el !== el), { value: v, disabled: d, el }]
    },
    unregister: (el) => {
      if (!registered.some((r) => r.el === el)) return
      registered = registered.filter((r) => r.el !== el)
    },
  })

  function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    if (!target?.matches?.('[role="radio"]')) return
    if (!root) return
    const items = [...root.querySelectorAll<HTMLButtonElement>('[role="radio"]')]
    if (items.length === 0) return
    const index = items.indexOf(target as HTMLButtonElement)
    if (index === -1) return

    const isEnabled = (i: number) => !items[i]!.hasAttribute('data-disabled')
    /** Step past disabled items, wrapping when `loop` is on. -1 = nowhere to go. */
    function step(from: number, direction: 1 | -1): number {
      let i = from
      for (let k = 0; k < items.length; k++) {
        i += direction
        if (i < 0) {
          if (!loop) return -1
          i = items.length - 1
        } else if (i >= items.length) {
          if (!loop) return -1
          i = 0
        }
        if (isEnabled(i)) return i
      }
      return -1
    }

    const rtl = dir === 'rtl'
    const horizontal = orientation === 'horizontal'
    let next = -1
    if (event.key === 'Home') next = items.findIndex((_, i) => isEnabled(i))
    else if (event.key === 'End') {
      next = -1
      for (let i = items.length - 1; i >= 0; i--) {
        if (isEnabled(i)) {
          next = i
          break
        }
      }
    }
    else if (horizontal && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      const forward = event.key === 'ArrowRight' ? !rtl : rtl
      next = step(index, forward ? 1 : -1)
    } else if (!horizontal && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      next = step(index, event.key === 'ArrowDown' ? 1 : -1)
    } else return

    if (next === -1) return
    event.preventDefault()
    const el = items[next]!
    el.focus()
    // The real (possibly non-string) value round-trips via registration,
    // matched by element identity; fall back to the data-value attribute.
    const candidate = registered.find((r) => r.el === el)?.value
    select(candidate !== undefined ? candidate : el.getAttribute('data-value'))
  }

  // Density classes
  const densityClasses = {
    compact: 'gap-1',
    default: 'gap-3',
    comfortable: 'gap-4',
  }

  const hasError = $derived.by(() => {
    if (error) return true
    if (errorMessages && (typeof errorMessages === 'string' ? errorMessages : errorMessages.length > 0)) return true
    return false
  })

  function normalizeOption(option: RadioOption): { label: string; value: string; disabled?: boolean } {
    if (typeof option === 'string') {
      return { label: option, value: option }
    }
    return option
  }
</script>

<!--
  `class` is forwarded ONLY to the radiogroup root below (per shadcn
  convention). Applying it on the outer wrapper as well caused grid-*
  utilities to fight the wrapper's `flex flex-col`, so consumers had
  to fall back to column-count hacks. Forwarding to one element keeps
  layout intent unambiguous.
-->
<div class="flex flex-col gap-2">
  {#if label}
    <span class="text-sm font-medium">
      {label}
    </span>
  {/if}

  {#if hint && !hasError}
    <p class="text-muted-foreground text-xs">
      {hint}
    </p>
  {/if}

  <div
    bind:this={root}
    role="radiogroup"
    data-uipkge=""
    data-slot="radio-group"
    data-orientation={orientation}
    aria-disabled={disabled || undefined}
    aria-required={required || undefined}
    aria-invalid={hasError || undefined}
    {dir}
    class={cn(
      'grid gap-3',
      orientation === 'horizontal' && 'flex flex-row items-center gap-4',
      optionType === 'button' && orientation === 'horizontal' && 'flex flex-row items-stretch gap-0',
      optionType === 'button' && orientation === 'vertical' && 'flex flex-col items-stretch gap-0',
      optionType !== 'button' && densityClasses[density],
      bordered && 'rounded-lg border p-4',
      className,
    )}
    {...restProps}
    onkeydown={(e) => {
      handleKeydown(e)
      onkeydownProp?.(e)
    }}
  >
    {#if name}
      <input type="hidden" {name} value={current == null ? '' : String(current)} />
    {/if}
    {#if options && options.length > 0}
      {#if optionType === 'button'}
        {#each options as option (normalizeOption(option).value)}
          {@const opt = normalizeOption(option)}
          <RadioButton value={opt.value} disabled={opt.disabled} label={opt.label} />
        {/each}
      {:else}
        {#each options as option (normalizeOption(option).value)}
          {@const opt = normalizeOption(option)}
          <div class="flex items-center gap-2">
            <RadioGroupItem id={opt.value} value={opt.value} disabled={opt.disabled} />
            <label
              for={opt.value}
              class={cn('cursor-pointer text-sm font-medium select-none', opt.disabled && 'cursor-not-allowed opacity-50')}
            >
              {opt.label}
            </label>
          </div>
        {/each}
      {/if}
    {/if}

    {@render children?.({ value: current })}
  </div>

  {#if hasError}
    <div class="flex flex-col gap-0.5">
      {#if typeof errorMessages === 'string'}
        <p class="text-destructive text-xs">
          {errorMessages}
        </p>
      {:else}
        {#each errorMessages ?? [] as msg, i (i)}
          <p class="text-destructive text-xs">
            {msg}
          </p>
        {/each}
      {/if}
    </div>
  {/if}
</div>

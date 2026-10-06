<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements'

  export interface PinInputSlotProps extends Omit<HTMLInputAttributes, 'type' | 'value'> {
    index: number
    /** Override the inherited mask flag for this slot. */
    mask?: boolean
    ref?: HTMLInputElement | null
  }
</script>

<script lang="ts">
  import { getContext, tick, untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { PIN_INPUT_CTX, type PinInputContext } from './PinInput.svelte'

  let { class: className, index, mask, ref = $bindable(null), ...restProps }: PinInputSlotProps = $props()

  const ctx = getContext<PinInputContext | undefined>(PIN_INPUT_CTX)
  if (!ctx) throw new Error('PinInputSlot must be used inside <PinInput>')

  const slotValue = $derived(ctx.value[index] ?? '')
  const effectiveMask = $derived(mask ?? ctx.mask)
  const inputType = $derived(effectiveMask ? 'password' : 'text')
  const sizeClasses = $derived(
    ctx.size === 'sm' ? 'h-8 w-8 text-sm' : ctx.size === 'lg' ? 'h-12 w-12 text-xl' : 'h-10 w-10 text-base',
  )
  const statusClasses = $derived(
    ctx.status === 'error'
      ? 'border-destructive focus:border-destructive focus:ring-destructive/40 text-destructive'
      : ctx.status === 'warning'
        ? 'border-warning focus:border-warning focus:ring-warning/40 text-warning'
        : ctx.status === 'success'
          ? 'border-success focus:border-success focus:ring-success/40 text-success'
          : '',
  )

  $effect(() => {
    // untrack: the register write must not subscribe this effect to the
    // group's slot map (effect_update_depth_exceeded). Registration is idempotent.
    if (ref) untrack(() => ctx.register(index, ref as HTMLInputElement))
    return () => ctx.unregister(index)
  })

  // Quiet slot pop when a character lands.
  let isPopping = $state(false)
  let isFirstValue = true
  let prevValue: string | undefined = undefined

  $effect(() => {
    const next = slotValue
    // First run captures the mount value (empty or prefilled) without animating.
    if (isFirstValue) {
      isFirstValue = false
      prevValue = next
      return
    }
    if (next !== '' && next !== prevValue) {
      // Restart the animation even on rapid sequential digits.
      isPopping = false
      tick().then(() => {
        isPopping = true
      })
    }
    prevValue = next
  })
</script>

<input
  bind:this={ref}
  {...restProps}
  value={slotValue}
  type={inputType}
  inputmode={ctx.type === 'number' ? 'numeric' : 'text'}
  autocomplete={ctx.otp ? 'one-time-code' : undefined}
  placeholder={ctx.placeholder || undefined}
  disabled={ctx.disabled}
  data-uipkge
  data-slot="pin-input-slot"
  data-index={index}
  aria-label={`Digit ${index + 1}`}
  class={cn(
    'border-input bg-background text-foreground relative -ml-px flex items-center justify-center border text-center shadow-xs outline-none first:ml-0 first:rounded-l-md last:rounded-r-md',
    'transition-[border-color,box-shadow,color,transform] duration-150 ease-out',
    'focus:border-ring focus:ring-ring/40 focus:relative focus:z-10 focus:ring-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    isPopping && 'pin-slot-pop',
    sizeClasses,
    statusClasses,
    className,
  )}
  oninput={(e) => ctx.handleSlotInput(index, e.currentTarget.value)}
  onkeydown={(e) => ctx.handleSlotKeyDown(e, index)}
  onpaste={(e) => ctx.handleSlotPaste(e, index)}
  onfocus={(e) => e.currentTarget.select()}
  onanimationend={(e) => {
    if (e.target === ref) isPopping = false
  }}
/>

<style>
  /* Quieter than payment-card char pop — whole slot, short overshoot. */
  @keyframes pin-slot-pop {
    0% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.06);
    }
    100% {
      transform: scale(1);
    }
  }

  [data-slot='pin-input-slot'].pin-slot-pop {
    animation: pin-slot-pop 200ms cubic-bezier(0.22, 1.25, 0.36, 1) both;
    z-index: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot='pin-input-slot'].pin-slot-pop {
      animation: none !important;
    }
    [data-slot='pin-input-slot'] {
      transition-duration: 0ms !important;
    }
  }
</style>

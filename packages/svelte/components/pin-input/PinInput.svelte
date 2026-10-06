<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type PinInputStatus = 'error' | 'warning' | 'success' | 'default'
  export type PinInputSize = 'sm' | 'md' | 'lg'
  export type PinInputType = 'text' | 'number'

  export interface PinInputProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled slot values. Pair with `bind:value`. */
    value?: string[] | undefined
    defaultValue?: string[]
    /** Slot count (React `maxLength` parity). Wins over `length` when both are set. Defaults to the number of registered slots. */
    maxLength?: number
    /** Slot count. Defaults to the number of registered slots.
     * @deprecated Use `maxLength`. Kept as an alias — both stay functional. */
    length?: number
    placeholder?: string
    otp?: boolean
    mask?: boolean
    autoSubmit?: boolean
    status?: PinInputStatus
    size?: PinInputSize
    type?: PinInputType
    disabled?: boolean
    /** Form field name. Rendered as a hidden input carrying the joined code. */
    name?: string
    children?: Snippet
    onComplete?: (value: string) => void
    onValueChange?: (value: string[]) => void
    ref?: HTMLDivElement | null
  }

  export interface PinInputContext {
    readonly value: string[]
    readonly placeholder: string
    readonly mask: boolean
    readonly status: PinInputStatus
    readonly size: PinInputSize
    readonly type: PinInputType
    readonly otp: boolean
    readonly disabled: boolean
    readonly length: number
    register: (index: number, el: HTMLInputElement) => void
    unregister: (index: number) => void
    handleSlotInput: (index: number, raw: string) => void
    handleSlotKeyDown: (event: KeyboardEvent, index: number) => void
    handleSlotPaste: (event: ClipboardEvent, index: number) => void
    focusSlot: (index: number) => void
  }

  export const PIN_INPUT_CTX = Symbol('uipkge-pin-input')
</script>

<script lang="ts">
  import { setContext, tick } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = $bindable(undefined),
    defaultValue = [],
    maxLength,
    length,
    placeholder = '',
    otp = true,
    mask = false,
    autoSubmit = false,
    status = 'default',
    size = 'md',
    type = 'text',
    disabled = false,
    name,
    children,
    onComplete,
    onValueChange,
    ref = $bindable(null),
    ...restProps
  }: PinInputProps = $props()

  // svelte-ignore state_referenced_locally -- uncontrolled seed: later defaultValue changes must not clobber typing.
  let internalValue = $state<string[]>([...defaultValue])
  const currentValue = $derived(value ?? internalValue)
  const slotEls = new Map<number, HTMLInputElement>()
  let slotCount = $state(0)
  const effectiveLength = $derived((maxLength ?? length) ?? Math.max(slotCount, currentValue.length, 1))
  const joinedValue = $derived(
    Array.from({ length: effectiveLength }, (_, i) => currentValue[i] ?? '').join(''),
  )

  let wasComplete = false

  function setValue(next: string[]) {
    const sized = Array.from({ length: effectiveLength }, (_, i) => next[i] ?? '')
    if (value === undefined) internalValue = sized
    value = sized
    onValueChange?.(sized)
    const complete = sized.length > 0 && sized.every((c) => c !== '')
    if (complete && !wasComplete) {
      wasComplete = true
      const joined = sized.join('')
      onComplete?.(joined)
      if (autoSubmit) {
        document.dispatchEvent(new CustomEvent('pin-submit', { detail: joined, bubbles: true }))
      }
    } else if (!complete) {
      wasComplete = false
    }
  }

  function focusSlot(index: number) {
    const el = slotEls.get(Math.min(Math.max(index, 0), effectiveLength - 1))
    el?.focus()
    el?.select()
  }

  function filterChars(raw: string): string {
    return type === 'number' ? raw.replace(/\D/g, '') : raw.replace(/\s/g, '')
  }

  function distribute(index: number, chars: string) {
    if (!chars) {
      const next = [...currentValue]
      next[index] = ''
      setValue(next)
      return
    }
    const next = Array.from({ length: effectiveLength }, (_, i) => currentValue[i] ?? '')
    let i = index
    for (const ch of chars) {
      if (i >= effectiveLength) break
      next[i] = ch
      i++
    }
    setValue(next)
    focusSlot(Math.min(i, effectiveLength - 1))
  }

  function handleSlotInput(index: number, raw: string) {
    if (disabled) return
    // No maxlength on the slot: a single char sets + advances, an empty string
    // clears, and multi-char input (paste, SMS autofill, replace-all) fans out
    // across this slot and the ones after it.
    const chars = filterChars(raw)
    if (chars.length > 1) {
      distribute(index, chars)
      return
    }
    const next = [...currentValue]
    next[index] = chars
    setValue(next)
    if (chars) focusSlot(index + 1)
  }

  function handleSlotKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && (currentValue[index] ?? '') === '' && index > 0) {
      event.preventDefault()
      const next = [...currentValue]
      next[index - 1] = ''
      setValue(next)
      focusSlot(index - 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusSlot(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusSlot(index + 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusSlot(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusSlot(effectiveLength - 1)
    } else if (event.key === 'Delete') {
      const next = [...currentValue]
      next[index] = ''
      setValue(next)
    }
  }

  function handleSlotPaste(event: ClipboardEvent, index: number) {
    if (disabled) return
    const text = filterChars(event.clipboardData?.getData('text') ?? '')
    if (!text) return
    event.preventDefault()
    distribute(index, text)
  }

  function register(index: number, el: HTMLInputElement) {
    // Idempotent: the slot $effect re-runs when registration itself
    // invalidates its deps, so a redundant write would ping-pong forever
    // (effect_update_depth_exceeded). Skip the write when nothing changed.
    if (slotEls.get(index) === el) return
    slotEls.set(index, el)
    slotCount = slotEls.size
  }

  function unregister(index: number) {
    if (!slotEls.has(index)) return
    slotEls.delete(index)
    slotCount = slotEls.size
  }

  setContext<PinInputContext>(PIN_INPUT_CTX, {
    get value() {
      return currentValue
    },
    get placeholder() {
      return placeholder
    },
    get mask() {
      return mask
    },
    get status() {
      return status
    },
    get size() {
      return size
    },
    get type() {
      return type
    },
    get otp() {
      return otp
    },
    get disabled() {
      return disabled
    },
    get length() {
      return effectiveLength
    },
    register,
    unregister,
    handleSlotInput,
    handleSlotKeyDown,
    handleSlotPaste,
    focusSlot,
  })

  // One-shot shake when status transitions into error (not on mount / not continuous).
  let isShaking = $state(false)
  // svelte-ignore state_referenced_locally -- transition tracker, deliberately seeded from the mount-time status.
  let prevStatus = status

  $effect(() => {
    if (status === 'error' && prevStatus !== 'error') {
      isShaking = false
      tick().then(() => {
        isShaking = true
      })
    }
    prevStatus = status
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="pin-input"
  data-status={status === 'default' ? undefined : status}
  role="group"
  class={cn(
    'flex items-center gap-2 disabled:cursor-not-allowed has-disabled:opacity-50',
    isShaking && 'pin-input-shake',
    className,
  )}
  onanimationend={(e) => {
    if (e.target === ref) isShaking = false
  }}
  {...restProps}
>
  {@render children?.()}
  {#if name}
    <input type="hidden" {name} value={joinedValue} {disabled} />
  {/if}
</div>

<style>
  @keyframes pin-input-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-5px);
    }
    40% {
      transform: translateX(5px);
    }
    60% {
      transform: translateX(-3px);
    }
    80% {
      transform: translateX(3px);
    }
  }

  [data-slot='pin-input'].pin-input-shake {
    animation: pin-input-shake 380ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot='pin-input'].pin-input-shake {
      animation: none !important;
    }
  }
</style>

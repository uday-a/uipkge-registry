<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements'

  export type MaskTokens = Record<string, RegExp>

  export interface MaskedInputValidatePayload {
    isValid: boolean
    isComplete: boolean
    rawValue: string
    maskedValue: string
  }

  export interface MaskedInputProps extends Omit<HTMLInputAttributes, 'value' | 'placeholder'> {
    value?: string
    mask: string
    replacement?: string
    tokens?: MaskTokens
    placeholderChar?: string
    placeholder?: string
    showMask?: boolean
    invalid?: boolean
    error?: string | boolean
    errorMessage?: string
    validate?: (masked: string, raw: string) => boolean | string
    onValueChange?: (value: string) => void
    oncomplete?: (value: string) => void
    onvalidate?: (payload: MaskedInputValidatePayload) => void
    ref?: HTMLInputElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'

  const DEFAULT_TOKENS: MaskTokens = {
    '#': /^[0-9]$/,
    A: /^[a-zA-Z]$/,
    '*': /^[a-zA-Z0-9]$/,
  }

  let {
    class: className,
    value = $bindable(''),
    mask,
    replacement = '#',
    tokens,
    placeholderChar = '_',
    placeholder,
    showMask = true,
    disabled,
    readonly,
    invalid,
    error,
    errorMessage,
    validate,
    onValueChange,
    oncomplete,
    onvalidate,
    oninput,
    onkeydown,
    onfocus,
    onblur,
    onpaste,
    ref = $bindable(null),
    ...restProps
  }: MaskedInputProps = $props()

  let inputEl: HTMLInputElement | null = $state(null)
  let isFocused = $state(false)

  $effect(() => {
    ref = inputEl
  })

  const activeTokens = $derived<MaskTokens>({ ...DEFAULT_TOKENS, ...(tokens ?? {}) })

  // Mapping of mask index -> token character (for editable slots)
  const editableSlots = $derived.by(() => {
    const slots: Array<{ index: number; tokenChar: string }> = []
    for (let i = 0; i < mask.length; i++) {
      const char = mask[i]!
      if (char === replacement || activeTokens[char]) {
        slots.push({ index: i, tokenChar: char === replacement ? replacement : char })
      }
    }
    return slots
  })

  const editablePositions = $derived(editableSlots.map((s) => s.index))
  const maxLength = $derived(editablePositions.length)

  function getSlotPattern(slotIndex: number): RegExp {
    const slot = editableSlots[slotIndex]
    if (!slot) return /.*/
    return activeTokens[slot.tokenChar] ?? activeTokens[replacement] ?? /.*/
  }

  function isValidCharForSlot(char: string, slotIndex: number): boolean {
    return getSlotPattern(slotIndex).test(char)
  }

  function unmask(input: string): string {
    let result = ''
    let slotIndex = 0
    for (const char of input) {
      if (char === placeholderChar || char === ' ') continue
      if (slotIndex < maxLength && isValidCharForSlot(char, slotIndex)) {
        result += char
        slotIndex++
      }
    }
    return result
  }

  function applyMask(rawValue: string): string {
    let result = ''
    let rawIndex = 0

    for (let i = 0; i < mask.length; i++) {
      const isEditable = editablePositions.includes(i)
      if (isEditable) {
        const slotIdx = editablePositions.indexOf(i)
        if (rawIndex < rawValue.length && isValidCharForSlot(rawValue[rawIndex]!, slotIdx)) {
          result += rawValue[rawIndex]
          rawIndex++
        } else if (showMask && (isFocused || !placeholder || value)) {
          result += placeholderChar
        } else {
          break
        }
      } else {
        result += mask[i]
      }
    }

    return result
  }

  const isComplete = $derived(unmask(value ?? '').length === maxLength)

  const validationError = $derived.by(() => {
    if (!validate) return null
    const currentMasked = value ?? ''
    const currentRaw = unmask(currentMasked)
    const result = validate(currentMasked, currentRaw)
    if (typeof result === 'string') return result
    if (result === false) return 'Invalid format'
    return null
  })

  const isInvalid = $derived(
    Boolean(invalid || error === true || (typeof error === 'string' && error.length > 0) || validationError),
  )

  const displayErrorMessage = $derived(
    typeof error === 'string' && error.length > 0 ? error : (errorMessage ?? validationError),
  )

  // Completion + validation notifications (mirror the Vue watchers)
  let wasComplete = false
  $effect(() => {
    if (isComplete && !wasComplete) oncomplete?.(value ?? '')
    wasComplete = isComplete
  })
  $effect(() => {
    const current = value ?? ''
    onvalidate?.({
      isValid: !isInvalid,
      isComplete: isComplete,
      rawValue: unmask(current),
      maskedValue: current,
    })
  })

  function getNextEditablePos(currentPos: number): number {
    for (const pos of editablePositions) {
      if (pos >= currentPos) return pos
    }
    return editablePositions[editablePositions.length - 1] ?? mask.length
  }

  function getPrevEditablePos(currentPos: number): number {
    for (let i = editablePositions.length - 1; i >= 0; i--) {
      const p = editablePositions[i]
      if (p !== undefined && p < currentPos) return p
    }
    return editablePositions[0] ?? 0
  }

  function findRawIndexAtCursor(cursorPos: number): number {
    let rawIndex = 0
    for (let i = 0; i < cursorPos && i < mask.length; i++) {
      if (editablePositions.includes(i)) rawIndex++
    }
    return rawIndex
  }

  function findCursorPosFromRaw(rawIndex: number): number {
    if (rawIndex >= editablePositions.length) return mask.length
    return editablePositions[rawIndex] ?? mask.length
  }

  function updateValue(next: string) {
    value = next
    onValueChange?.(next)
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    const oldValue = value ?? ''
    const newValue = target.value
    const cursorPos = target.selectionStart ?? 0

    // Filter raw characters strictly through token validation
    const rawNew = unmask(newValue)
    const rawOld = unmask(oldValue)
    const clampedRaw = rawNew.slice(0, maxLength)
    const masked = applyMask(clampedRaw)

    let newCursorPos: number
    if (clampedRaw.length > rawOld.length) {
      const addedIndex = clampedRaw.length - 1
      newCursorPos = findCursorPosFromRaw(addedIndex) + 1
      newCursorPos = getNextEditablePos(newCursorPos)
    } else if (clampedRaw.length < rawOld.length) {
      newCursorPos = getPrevEditablePos(cursorPos) + 1
    } else {
      newCursorPos = cursorPos
    }

    updateValue(masked)
    // Keep the DOM in sync when the masked output equals the old value (Svelte
    // only writes back on change).
    target.value = masked

    tick().then(() => {
      inputEl?.setSelectionRange(newCursorPos, newCursorPos)
    })
  }

  function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement
    const cursorPos = target.selectionStart ?? 0

    // Block non-matching characters right away if single printable key
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const rawIndex = findRawIndexAtCursor(cursorPos)
      if (rawIndex >= maxLength) {
        event.preventDefault()
        return
      }
      if (!isValidCharForSlot(event.key, rawIndex)) {
        event.preventDefault()
        return
      }
    }

    if (event.key === 'Backspace') {
      const raw = unmask(value ?? '')
      const rawIndex = findRawIndexAtCursor(cursorPos)

      if (rawIndex > 0) {
        const newRaw = raw.slice(0, rawIndex - 1) + raw.slice(rawIndex)
        updateValue(applyMask(newRaw))

        const newPos = findCursorPosFromRaw(rawIndex - 1)
        tick().then(() => {
          inputEl?.setSelectionRange(newPos, newPos)
        })
      }
      event.preventDefault()
    } else if (event.key === 'Delete') {
      const raw = unmask(value ?? '')
      const rawIndex = findRawIndexAtCursor(cursorPos)

      if (rawIndex < raw.length) {
        const newRaw = raw.slice(0, rawIndex) + raw.slice(rawIndex + 1)
        updateValue(applyMask(newRaw))

        const newPos = findCursorPosFromRaw(rawIndex)
        tick().then(() => {
          inputEl?.setSelectionRange(newPos, newPos)
        })
      }
      event.preventDefault()
    } else if (event.key === 'ArrowLeft') {
      const newPos = getPrevEditablePos(cursorPos)
      tick().then(() => {
        inputEl?.setSelectionRange(newPos, newPos)
      })
      event.preventDefault()
    } else if (event.key === 'ArrowRight') {
      const newPos = getNextEditablePos(cursorPos + 1)
      tick().then(() => {
        inputEl?.setSelectionRange(newPos, newPos)
      })
      event.preventDefault()
    }
  }

  function handleFocus() {
    isFocused = true
    if (!value && showMask) {
      updateValue(applyMask(''))
    }
    tick().then(() => {
      const firstEditable = editablePositions[0] ?? 0
      inputEl?.setSelectionRange(firstEditable, firstEditable)
    })
  }

  function handleBlur() {
    isFocused = false
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const pasted = event.clipboardData?.getData('text') ?? ''
    const raw = unmask(value ?? '')
    const cursorPos = inputEl?.selectionStart ?? 0
    const rawIndex = findRawIndexAtCursor(cursorPos)

    // Filter pasted content strictly
    let filteredPasted = ''
    let currSlot = rawIndex
    for (const char of pasted) {
      if (currSlot < maxLength && isValidCharForSlot(char, currSlot)) {
        filteredPasted += char
        currSlot++
      }
    }

    const newRaw = (raw.slice(0, rawIndex) + filteredPasted + raw.slice(rawIndex)).slice(0, maxLength)
    updateValue(applyMask(newRaw))

    const newPos = findCursorPosFromRaw(Math.min(rawIndex + filteredPasted.length, maxLength))
    tick().then(() => {
      inputEl?.setSelectionRange(newPos, newPos)
    })
  }

  const displayValue = $derived.by(() => {
    if (!value && !isFocused && placeholder) return ''
    if (!value && !showMask) return ''
    return value ?? ''
  })
</script>

<div class="relative w-full" data-slot="masked-input-wrapper">
  <input
    bind:this={inputEl}
    value={displayValue}
    {placeholder}
    data-uipkge=""
    data-slot="masked-input"
    {disabled}
    {readonly}
    aria-invalid={isInvalid ? 'true' : undefined}
    class={cn(
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      isInvalid && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 text-destructive',
      className,
    )}
    oninput={(e) => {
      handleInput(e)
      oninput?.(e)
    }}
    onkeydown={(e) => {
      handleKeydown(e)
      onkeydown?.(e)
    }}
    onfocus={(e) => {
      handleFocus()
      onfocus?.(e)
    }}
    onblur={(e) => {
      handleBlur()
      onblur?.(e)
    }}
    onpaste={(e) => {
      handlePaste(e)
      onpaste?.(e)
    }}
    {...restProps}
  />
  {#if displayErrorMessage}
    <p data-slot="masked-input-error" class="text-destructive mt-1.5 text-xs font-medium" role="alert">
      {displayErrorMessage}
    </p>
  {/if}
</div>

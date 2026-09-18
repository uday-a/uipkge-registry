'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type MaskTokens = Record<string, RegExp>

const DEFAULT_TOKENS: MaskTokens = {
  '#': /^[0-9]$/,
  A: /^[a-zA-Z]$/,
  '*': /^[a-zA-Z0-9]$/,
}

export interface MaskedInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  /** Controlled masked value (e.g. `(212) 555-____`). */
  value?: string
  defaultValue?: string
  /** Mask template — `replacement` chars are editable, everything else is literal. */
  mask: string
  /** The character in `mask` that marks an editable slot. */
  replacement?: string
  /** Custom token regex mapping for editable slots. Defaults: `#` -> digits, `A` -> letters, `*` -> alphanumeric. */
  tokens?: MaskTokens
  /** Character shown for unfilled editable slots when `showMask` is on. */
  placeholderChar?: string
  /** Render the literal mask (separators + placeholders) even when empty. */
  showMask?: boolean
  /** Invalid visual state. */
  invalid?: boolean
  /** Error message or error boolean flag. */
  error?: string | boolean
  /** Explicit error message string. */
  errorMessage?: string
  /** Custom validation function. */
  validate?: (masked: string, raw: string) => boolean | string
  /** Fires with the masked string on every edit. */
  onValueChange?: (value: string) => void
  /** Fires with the masked string once every editable slot is filled. */
  onComplete?: (value: string) => void
  /** Fires validation status payload on edit. */
  onValidate?: (payload: { isValid: boolean; isComplete: boolean; rawValue: string; maskedValue: string }) => void
  className?: string
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      value,
      defaultValue,
      mask,
      replacement = '#',
      tokens,
      placeholderChar = '_',
      placeholder,
      showMask = true,
      invalid,
      error,
      errorMessage,
      validate,
      onValueChange,
      onComplete,
      onValidate,
      disabled,
      readOnly,
      className,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
      ...rest
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref],
    )

    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState<string>(defaultValue ?? '')
    const [isFocused, setIsFocused] = React.useState(false)
    const modelValue = isControlled ? value : internal

    const activeTokens = React.useMemo<MaskTokens>(
      () => ({
        ...DEFAULT_TOKENS,
        ...(tokens ?? {}),
      }),
      [tokens],
    )

    const editableSlots = React.useMemo(() => {
      const slots: Array<{ index: number; tokenChar: string }> = []
      for (let i = 0; i < mask.length; i++) {
        const char = mask[i]!
        if (char === replacement || activeTokens[char]) {
          slots.push({ index: i, tokenChar: char === replacement ? replacement : char })
        }
      }
      return slots
    }, [mask, replacement, activeTokens])

    const editablePositions = React.useMemo(() => editableSlots.map((s) => s.index), [editableSlots])
    const maxLength = editablePositions.length

    const getSlotPattern = React.useCallback(
      (slotIndex: number): RegExp => {
        const slot = editableSlots[slotIndex]
        if (!slot) return /.*/
        return activeTokens[slot.tokenChar] ?? activeTokens[replacement] ?? /.*/
      },
      [editableSlots, activeTokens, replacement],
    )

    const isValidCharForSlot = React.useCallback(
      (char: string, slotIndex: number): boolean => {
        const regex = getSlotPattern(slotIndex)
        return regex.test(char)
      },
      [getSlotPattern],
    )

    const unmask = React.useCallback(
      (val: string): string => {
        let result = ''
        let slotIndex = 0
        for (const char of val) {
          if (char === placeholderChar || char === ' ') continue
          if (slotIndex < maxLength && isValidCharForSlot(char, slotIndex)) {
            result += char
            slotIndex++
          }
        }
        return result
      },
      [placeholderChar, maxLength, isValidCharForSlot],
    )

    const applyMask = React.useCallback(
      (rawValue: string): string => {
        let result = ''
        let rawIndex = 0
        for (let i = 0; i < mask.length; i++) {
          const isEditable = editablePositions.includes(i)
          if (isEditable) {
            const slotIdx = editablePositions.indexOf(i)
            if (rawIndex < rawValue.length && isValidCharForSlot(rawValue[rawIndex]!, slotIdx)) {
              result += rawValue[rawIndex]
              rawIndex++
            } else if (showMask && (isFocused || !placeholder || modelValue)) {
              result += placeholderChar
            } else {
              break
            }
          } else {
            result += mask[i]
          }
        }
        return result
      },
      [mask, editablePositions, isValidCharForSlot, showMask, isFocused, placeholder, modelValue, placeholderChar],
    )

    const isComplete = React.useMemo(() => {
      const raw = unmask(modelValue ?? '')
      return raw.length === maxLength
    }, [modelValue, unmask, maxLength])

    const validationError = React.useMemo(() => {
      if (!validate) return null
      const current = modelValue ?? ''
      const raw = unmask(current)
      const res = validate(current, raw)
      if (typeof res === 'string') return res
      if (res === false) return 'Invalid format'
      return null
    }, [validate, modelValue, unmask])

    const isInvalid = Boolean(
      invalid || error === true || (typeof error === 'string' && error.length > 0) || validationError,
    )
    const displayErrorMessage = typeof error === 'string' && error.length > 0 ? error : errorMessage || validationError

    React.useEffect(() => {
      if (isComplete) onComplete?.(modelValue ?? '')
    }, [isComplete, modelValue, onComplete])

    React.useEffect(() => {
      const raw = unmask(modelValue ?? '')
      onValidate?.({
        isValid: !isInvalid,
        isComplete,
        rawValue: raw,
        maskedValue: modelValue ?? '',
      })
    }, [modelValue, isInvalid, isComplete, unmask, onValidate])

    const getNextEditablePos = React.useCallback(
      (currentPos: number): number => {
        for (const pos of editablePositions) {
          if (pos >= currentPos) return pos
        }
        return editablePositions[editablePositions.length - 1] ?? mask.length
      },
      [editablePositions, mask.length],
    )

    const getPrevEditablePos = React.useCallback(
      (currentPos: number): number => {
        for (let i = editablePositions.length - 1; i >= 0; i--) {
          const p = editablePositions[i]
          if (p !== undefined && p < currentPos) return p
        }
        return editablePositions[0] ?? 0
      },
      [editablePositions],
    )

    const findRawIndexAtCursor = React.useCallback(
      (cursorPos: number): number => {
        let rawIndex = 0
        for (let i = 0; i < cursorPos && i < mask.length; i++) {
          if (editablePositions.includes(i)) rawIndex++
        }
        return rawIndex
      },
      [mask.length, editablePositions],
    )

    const findCursorPosFromRaw = React.useCallback(
      (rawIndex: number): number => {
        if (rawIndex >= editablePositions.length) return mask.length
        return editablePositions[rawIndex] ?? mask.length
      },
      [editablePositions, mask.length],
    )

    const updateValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange],
    )

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target
      const oldValue = modelValue ?? ''
      const newValue = target.value
      const cursorPos = target.selectionStart ?? 0

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

      requestAnimationFrame(() => {
        if (innerRef.current) {
          innerRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      })
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return

      const target = event.currentTarget
      const cursorPos = target.selectionStart ?? 0

      // Block non-matching character immediately on keystroke
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const rawIndex = findRawIndexAtCursor(cursorPos)
        if (rawIndex >= maxLength || !isValidCharForSlot(event.key, rawIndex)) {
          event.preventDefault()
          return
        }
      }

      if (event.key === 'Backspace') {
        const raw = unmask(modelValue ?? '')
        const rawIndex = findRawIndexAtCursor(cursorPos)
        if (rawIndex > 0) {
          const newRaw = raw.slice(0, rawIndex - 1) + raw.slice(rawIndex)
          const masked = applyMask(newRaw)
          updateValue(masked)
          const newPos = findCursorPosFromRaw(rawIndex - 1)
          requestAnimationFrame(() => {
            innerRef.current?.setSelectionRange(newPos, newPos)
          })
        }
        event.preventDefault()
      } else if (event.key === 'Delete') {
        const raw = unmask(modelValue ?? '')
        const rawIndex = findRawIndexAtCursor(cursorPos)
        if (rawIndex < raw.length) {
          const newRaw = raw.slice(0, rawIndex) + raw.slice(rawIndex + 1)
          const masked = applyMask(newRaw)
          updateValue(masked)
          const newPos = findCursorPosFromRaw(rawIndex)
          requestAnimationFrame(() => {
            innerRef.current?.setSelectionRange(newPos, newPos)
          })
        }
        event.preventDefault()
      } else if (event.key === 'ArrowLeft') {
        const newPos = getPrevEditablePos(cursorPos)
        requestAnimationFrame(() => {
          innerRef.current?.setSelectionRange(newPos, newPos)
        })
        event.preventDefault()
      } else if (event.key === 'ArrowRight') {
        const newPos = getNextEditablePos(cursorPos + 1)
        requestAnimationFrame(() => {
          innerRef.current?.setSelectionRange(newPos, newPos)
        })
        event.preventDefault()
      }
    }

    const handlePasteEvent = (event: React.ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(event)
      if (event.defaultPrevented) return

      event.preventDefault()
      const pasted = event.clipboardData?.getData('text') ?? ''
      const raw = unmask(modelValue ?? '')
      const cursorPos = innerRef.current?.selectionStart ?? 0
      const rawIndex = findRawIndexAtCursor(cursorPos)

      let filteredPasted = ''
      let currSlot = rawIndex
      for (const char of pasted) {
        if (currSlot < maxLength && isValidCharForSlot(char, currSlot)) {
          filteredPasted += char
          currSlot++
        }
      }

      const newRaw = (raw.slice(0, rawIndex) + filteredPasted + raw.slice(rawIndex)).slice(0, maxLength)
      const masked = applyMask(newRaw)
      updateValue(masked)

      const newPos = findCursorPosFromRaw(Math.min(rawIndex + filteredPasted.length, maxLength))
      requestAnimationFrame(() => {
        innerRef.current?.setSelectionRange(newPos, newPos)
      })
    }

    const handleFocusEvent = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (!modelValue && showMask) {
        updateValue(applyMask(''))
      }
      requestAnimationFrame(() => {
        const firstEditable = editablePositions[0] ?? 0
        innerRef.current?.setSelectionRange(firstEditable, firstEditable)
      })
      onFocus?.(e)
    }

    const handleBlurEvent = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const displayValue =
      !modelValue && !isFocused && placeholder ? '' : !modelValue && !showMask ? '' : (modelValue ?? '')

    return (
      <div className="relative w-full" data-slot="masked-input-wrapper">
        <input
          ref={setRefs}
          value={displayValue}
          placeholder={placeholder}
          data-uipkge
          data-slot="masked-input"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isInvalid ? 'true' : undefined}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            isInvalid &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 text-destructive',
            className,
          )}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocusEvent}
          onBlur={handleBlurEvent}
          onPaste={handlePasteEvent}
          {...rest}
        />
        {displayErrorMessage && (
          <p data-slot="masked-input-error" className="text-destructive mt-1.5 text-xs font-medium" role="alert">
            {displayErrorMessage}
          </p>
        )}
      </div>
    )
  },
)

MaskedInput.displayName = 'MaskedInput'

export { MaskedInput }

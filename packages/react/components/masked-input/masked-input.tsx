'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

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
  /** Character shown for unfilled editable slots when `showMask` is on. */
  placeholderChar?: string
  /** Render the literal mask (separators + placeholders) even when empty. */
  showMask?: boolean
  /** Fires with the masked string on every edit. */
  onValueChange?: (value: string) => void
  /** Fires with the masked string once every editable slot is filled. */
  onComplete?: (value: string) => void
  className?: string
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      value,
      defaultValue,
      mask,
      replacement = '#',
      placeholderChar = '_',
      showMask = true,
      onValueChange,
      onComplete,
      disabled,
      readOnly,
      className,
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
    const modelValue = isControlled ? value : internal

    // Positions in the mask that are editable (not separators).
    const editablePositions = React.useMemo(() => {
      const positions: number[] = []
      for (let i = 0; i < mask.length; i++) {
        if (mask[i] === replacement) positions.push(i)
      }
      return positions
    }, [mask, replacement])

    const maxLength = editablePositions.length

    const isSeparatorChar = React.useCallback(
      (char: string): boolean => {
        for (let i = 0; i < mask.length; i++) {
          if (mask[i] !== replacement && mask[i] === char) return true
        }
        return false
      },
      [mask, replacement],
    )

    const unmask = React.useCallback(
      (val: string): string => {
        let result = ''
        for (const char of val) {
          if (char !== placeholderChar && char !== ' ' && !isSeparatorChar(char)) result += char
        }
        return result
      },
      [placeholderChar, isSeparatorChar],
    )

    const applyMask = React.useCallback(
      (rawValue: string): string => {
        const chars = rawValue.split('')
        let result = ''
        let charIndex = 0
        for (let i = 0; i < mask.length; i++) {
          if (mask[i] === replacement) {
            if (charIndex < chars.length) {
              result += chars[charIndex]
              charIndex++
            } else if (showMask) {
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
      [mask, replacement, showMask, placeholderChar],
    )

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
          if (mask[i] === replacement) rawIndex++
        }
        return rawIndex
      },
      [mask, replacement],
    )

    const findCursorPosFromRaw = React.useCallback(
      (rawIndex: number): number => {
        let count = 0
        for (let i = 0; i < mask.length; i++) {
          if (mask[i] === replacement) {
            if (count === rawIndex) return i
            count++
          }
        }
        return mask.length
      },
      [mask, replacement],
    )

    const emit = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
        if (unmask(next).length === maxLength) onComplete?.(next)
      },
      [isControlled, onValueChange, onComplete, unmask, maxLength],
    )

    const setCursor = React.useCallback((pos: number) => {
      // Defer to after the controlled re-render commits the new value.
      requestAnimationFrame(() => {
        innerRef.current?.setSelectionRange(pos, pos)
      })
    }, [])

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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

      emit(masked)
      setCursor(newCursorPos)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      const target = event.currentTarget
      const cursorPos = target.selectionStart ?? 0

      if (event.key === 'Backspace') {
        const raw = unmask(modelValue ?? '')
        const rawIndex = findRawIndexAtCursor(cursorPos)
        if (rawIndex > 0) {
          const newRaw = raw.slice(0, rawIndex - 1) + raw.slice(rawIndex)
          emit(applyMask(newRaw))
          setCursor(findCursorPosFromRaw(rawIndex - 1) + 1)
        }
        event.preventDefault()
      } else if (event.key === 'Delete') {
        const raw = unmask(modelValue ?? '')
        const rawIndex = findRawIndexAtCursor(cursorPos)
        if (rawIndex < raw.length) {
          const newRaw = raw.slice(0, rawIndex) + raw.slice(rawIndex + 1)
          emit(applyMask(newRaw))
          setCursor(findCursorPosFromRaw(rawIndex) + 1)
        }
        event.preventDefault()
      } else if (event.key === 'ArrowLeft') {
        const newPos = getPrevEditablePos(cursorPos)
        setCursor(newPos + 1)
        event.preventDefault()
      } else if (event.key === 'ArrowRight') {
        const newPos = getNextEditablePos(cursorPos + 1)
        setCursor(newPos + 1)
        event.preventDefault()
      }
    }

    function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
      if (!modelValue && showMask) emit(applyMask(''))
      // Place the caret at the first editable slot (not after it).
      const firstEditable = editablePositions[0] ?? 0
      setCursor(firstEditable)
      rest.onFocus?.(event)
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
      event.preventDefault()
      const pasted = event.clipboardData?.getData('text') ?? ''
      const raw = unmask(modelValue ?? '')
      const cursorPos = innerRef.current?.selectionStart ?? 0
      const rawIndex = findRawIndexAtCursor(cursorPos)
      const newRaw = raw.slice(0, rawIndex) + unmask(pasted) + raw.slice(rawIndex)
      const clamped = newRaw.slice(0, maxLength)
      emit(applyMask(clamped))
      setCursor(findCursorPosFromRaw(Math.min(rawIndex + unmask(pasted).length, maxLength)) + 1)
    }

    const displayValue = !modelValue && !showMask ? '' : (modelValue ?? '')

    return (
      <input
        {...rest}
        ref={setRefs}
        value={displayValue}
        data-uipkge=""
        data-slot="masked-input"
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onPaste={handlePaste}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
      />
    )
  },
)
MaskedInput.displayName = 'MaskedInput'

export { MaskedInput }

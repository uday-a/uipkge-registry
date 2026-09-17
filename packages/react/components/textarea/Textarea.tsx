'use client'

import * as React from 'react'
import { Loader, Check, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export interface TextareaProps {
  // Core
  value?: string | number
  defaultValue?: string | number
  onValueChange?: (value: string) => void
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  success?: string
  messages?: string[]
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  autoFocus?: boolean
  name?: string
  id?: string

  // Variants (Vuetify-style)
  variant?: 'outlined' | 'filled' | 'solo' | 'underlined' | 'plain'
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  density?: 'compact' | 'comfortable' | 'default'

  // Appearance
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle' | 'full'

  // Auto size (Ant Design API)
  autoSize?: boolean | { minRows?: number; maxRows?: number }

  // Legacy auto grow / resize
  autoGrow?: boolean
  noResize?: boolean
  autoResize?: boolean

  // Rows -- accept both number and string ("3" vs rows={3}).
  rows?: number | string
  rowHeight?: number

  // Prefix/Suffix
  prefix?: string
  suffix?: string

  // Counter (legacy)
  counter?: boolean | number

  // Show count (Ant Design API)
  showCount?: boolean | { formatter?: (count: number, maxLength?: number) => string }

  // Max length
  maxLength?: number

  // Allow clear
  allowClear?: boolean

  // Validation
  rules?: Array<(value: any) => true | string>
  errorMessages?: string | string[]
  successMessages?: string | string[]
  validateOn?: 'blur' | 'input' | 'submit' | 'lazy' | 'blurlazy' | 'inputlazy'

  // States
  loading?: boolean
  persistentHint?: boolean
  persistentError?: boolean
  persistentPlaceholder?: boolean
  persistentPrefix?: boolean
  persistentSuffix?: boolean

  // Misc
  className?: string
  inputClassName?: string
  labelClassName?: string
  hintClassName?: string
  bgColor?: string
  flat?: boolean
  bordered?: boolean

  // Browser
  spellCheck?: boolean
  autoComplete?: string

  // Direction
  direction?: 'ltr' | 'rtl'

  // Events
  onClear?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void

  children?: React.ReactNode
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, forwardedRef) => {
  const {
    value,
    defaultValue,
    onValueChange,
    label,
    placeholder,
    hint,
    error,
    success,
    disabled,
    readOnly,
    required,
    autoFocus,
    name,
    id,
    variant = 'outlined',
    density = 'default',
    rounded = 'none',
    autoSize,
    autoGrow = false,
    noResize = false,
    autoResize = false,
    rows = 3,
    rowHeight = 24,
    prefix,
    suffix,
    counter,
    showCount,
    maxLength,
    allowClear,
    rules,
    errorMessages,
    successMessages,
    validateOn,
    loading,
    persistentHint = false,
    persistentPrefix,
    persistentSuffix,
    className,
    inputClassName,
    labelClassName,
    hintClassName,
    bgColor,
    spellCheck,
    autoComplete,
    onClear,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    children,
  } = props

  const reactId = React.useId()
  const textareaId = id ?? `textarea-${reactId}`
  const descriptionId = `${textareaId}-description`

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
    },
    [forwardedRef],
  )

  // Internal state
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string | number>(defaultValue ?? '')
  const internalValue = isControlled ? value! : internal

  const [focused, setFocused] = React.useState(false)
  const [internalErrorMessages, setInternalErrorMessages] = React.useState<string[]>([])
  const [, setValidated] = React.useState(false)

  // Auto size
  const autoSizeEnabled = autoSize !== undefined
  const anyAutoResize = autoSizeEnabled || autoResize || autoGrow

  const autoSizeConfig = React.useMemo<{ minRows?: number; maxRows?: number }>(() => {
    if (typeof autoSize === 'object') return autoSize
    return {}
  }, [autoSize])

  const minHeightPx = React.useRef(0)
  const maxHeightPx = React.useRef(Infinity)

  const autoResizeFn = React.useCallback(() => {
    if (!textareaRef.current) return
    if (!anyAutoResize) return

    const el = textareaRef.current

    el.style.height = 'auto'
    let newHeight = el.scrollHeight

    if (minHeightPx.current && newHeight < minHeightPx.current) {
      newHeight = minHeightPx.current
    }

    if (newHeight > maxHeightPx.current) {
      newHeight = maxHeightPx.current
      el.style.overflowY = 'auto'
    } else {
      el.style.overflowY = 'hidden'
    }

    el.style.height = `${newHeight}px`
  }, [anyAutoResize])

  const measureHeights = React.useCallback(() => {
    if (!textareaRef.current) return
    if (!autoSizeEnabled) return

    const el = textareaRef.current
    const originalValue = el.value
    const originalRows = el.rows
    const originalOverflow = el.style.overflowY

    el.value = ''
    el.style.overflowY = 'hidden'

    const { minRows, maxRows } = autoSizeConfig

    if (minRows) {
      el.rows = minRows
      minHeightPx.current = el.scrollHeight
    } else {
      minHeightPx.current = 0
    }

    if (maxRows) {
      el.rows = maxRows
      maxHeightPx.current = el.scrollHeight
    } else {
      maxHeightPx.current = Infinity
    }

    el.value = originalValue
    el.rows = originalRows
    el.style.overflowY = originalOverflow

    autoResizeFn()
  }, [autoSizeEnabled, autoSizeConfig, autoResizeFn])

  // Auto grow functionality (legacy)
  const rowsNum = Number(rows) || 3

  const computedRows = React.useMemo(() => {
    if (autoSizeEnabled || autoResize) return rowsNum
    if (!autoGrow) return rowsNum
    if (!textareaRef.current) return rowsNum

    const lineHeight = rowHeight
    const computedHeight = textareaRef.current.scrollHeight
    const newRows = Math.ceil((computedHeight - lineHeight) / lineHeight) + 1
    return Math.max(rowsNum, newRows)
  }, [autoSizeEnabled, autoResize, autoGrow, rowsNum, rowHeight, internalValue])

  // Validation
  const validate = React.useCallback(() => {
    if (!rules || rules.length === 0) {
      setValidated(true)
      return true
    }
    const next: string[] = []
    for (const rule of rules) {
      const result = rule(internalValue)
      if (result !== true) {
        next.push(result as string)
      }
    }
    setInternalErrorMessages(next)
    const ok = next.length === 0
    setValidated(ok)
    return ok
  }, [rules, internalValue])

  // Handle input
  const setValue = (next: string) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value
    setValue(next)
    if (anyAutoResize) {
      autoResizeFn()
    }
    if (validateOn === 'input' || validateOn === 'inputlazy') {
      // Validate against the value just typed — rules close over internalValue
      // which may still be stale on this tick for controlled mode, so run rules
      // against `next` inline when needed.
      if (!rules || rules.length === 0) {
        setValidated(true)
      } else {
        const messages: string[] = []
        for (const rule of rules) {
          const result = rule(next)
          if (result !== true) messages.push(result as string)
        }
        setInternalErrorMessages(messages)
        setValidated(messages.length === 0)
      }
    }
  }

  // Handle clear
  const handleClear = () => {
    setValue('')
    onClear?.()
    requestAnimationFrame(() => {
      autoResizeFn()
      textareaRef.current?.focus()
    })
  }

  // Handle focus/blur
  const handleFocus = () => {
    setFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setFocused(false)
    if (validateOn === 'blur' || validateOn === 'blurlazy') {
      validate()
    }
    onBlur?.()
  }

  // Compute error/success messages
  const computedErrorMessages = React.useMemo(() => {
    if (errorMessages) {
      return Array.isArray(errorMessages) ? errorMessages : [errorMessages]
    }
    if (error) {
      return [error]
    }
    return internalErrorMessages
  }, [errorMessages, error, internalErrorMessages])

  const computedSuccessMessages = React.useMemo(() => {
    if (successMessages) {
      return Array.isArray(successMessages) ? successMessages : [successMessages]
    }
    if (success) {
      return [success]
    }
    return []
  }, [successMessages, success])

  const hasError = computedErrorMessages.length > 0
  // Success messages from the consumer are authoritative (do not gate on a dead validated flag).
  const hasSuccess = computedSuccessMessages.length > 0

  // Counter (legacy)
  const computedCounter = React.useMemo(() => {
    if (typeof counter === 'number') return counter
    if (counter) return maxLength ?? 100
    return null
  }, [counter, maxLength])

  const currentLength = String(internalValue ?? '').length

  // Show count (Ant Design API)
  const showCountEnabled = showCount !== undefined && showCount !== false

  const showCountConfig = React.useMemo<{ formatter?: (count: number, maxLength?: number) => string }>(() => {
    if (typeof showCount === 'object') return showCount
    return {}
  }, [showCount])

  const countText = React.useMemo(() => {
    const formatter = showCountConfig.formatter
    if (formatter) {
      return formatter(currentLength, maxLength)
    }
    if (maxLength !== undefined) {
      return `${currentLength} / ${maxLength}`
    }
    return `${currentLength}`
  }, [showCountConfig, currentLength, maxLength])

  // Allow clear
  const showClear = allowClear && !disabled && !readOnly && String(internalValue ?? '').length > 0

  // Variant classes
  const variantClasses = React.useMemo(() => {
    const base = 'w-full transition-colors duration-200'

    switch (variant) {
      case 'outlined':
        return cn(
          base,
          'border-2 rounded-lg',
          focused ? 'border-primary ring-2 ring-primary/20' : 'border-input',
          hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        )
      case 'filled':
        return cn(
          base,
          'border-b-2 bg-muted/50 rounded-t-lg',
          focused ? 'border-primary bg-muted' : 'border-transparent',
          hasError && 'border-destructive',
        )
      case 'solo':
        return cn(
          base,
          'rounded-lg shadow-sm',
          focused ? 'shadow-md' : 'shadow-sm',
          'bg-card border border-transparent',
        )
      case 'underlined':
        return cn(
          base,
          'border-b-2 rounded-none border-x-0 border-t-0 px-0',
          focused ? 'border-primary' : 'border-muted-foreground/30',
          hasError && 'border-destructive',
        )
      case 'plain':
        return cn(base, 'border-0 bg-transparent')
      default:
        return base
    }
  }, [variant, focused, hasError])

  // Density classes
  const densityClasses = React.useMemo(() => {
    switch (density) {
      case 'compact':
        return 'text-sm min-h-[32px]'
      case 'comfortable':
        return 'text-base min-h-[40px]'
      case 'default':
      default:
        return 'text-base min-h-[48px]'
    }
  }, [density])

  // Resize classes
  const resizeClasses = React.useMemo(() => {
    if (noResize) return 'resize-none'
    if (anyAutoResize) return 'resize-none'
    return 'resize-y'
  }, [noResize, anyAutoResize])

  // Watch for programmatic value changes to trigger auto-resize
  React.useEffect(() => {
    if (anyAutoResize) {
      requestAnimationFrame(() => autoResizeFn())
    }
  }, [internalValue, anyAutoResize, autoResizeFn])

  React.useEffect(() => {
    requestAnimationFrame(() => {
      measureHeights()
      if (anyAutoResize) {
        autoResizeFn()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cn('relative space-y-2', className)}>
      {/* Label */}
      {label && (
        <Label
          htmlFor={textareaId}
          className={cn(
            'text-foreground text-sm font-medium',
            labelClassName,
            focused && 'text-primary',
            hasError && 'text-destructive',
          )}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}

      {/* Control wrapper */}
      <div
        className={cn(
          'relative flex items-center',
          variantClasses,
          densityClasses,
          disabled && 'pointer-events-none opacity-50',
          readOnly && !disabled && 'cursor-default',
          rounded !== 'none' && `rounded-${rounded}`,
        )}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        {/* Prefix */}
        {prefix && (
          <span
            className={cn(
              'text-muted-foreground pointer-events-none absolute top-3 left-3 text-sm',
              !persistentPrefix && !focused && 'opacity-50',
            )}
          >
            {prefix}
          </span>
        )}

        {/* Textarea */}
        <textarea
          id={textareaId}
          ref={setRefs}
          value={internalValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          spellCheck={spellCheck}
          maxLength={maxLength}
          rows={computedRows}
          aria-describedby={hasError || hasSuccess || hint ? descriptionId : undefined}
          aria-invalid={hasError || undefined}
          className={cn(
            'w-full flex-1 resize-y bg-transparent outline-none',
            densityClasses,
            resizeClasses,
            prefix ? 'pl-16' : 'pl-3',
            suffix ? 'pr-16' : showClear ? 'pr-10' : 'pr-3',
            showCountEnabled && 'pb-6',
            'py-2',
            inputClassName,
          )}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => onKeyDown?.(e)}
          onKeyUp={(e) => onKeyUp?.(e)}
        />

        {/* Suffix */}
        {suffix && (
          <span
            className={cn(
              'text-muted-foreground pointer-events-none absolute top-3 right-3 text-sm',
              !persistentSuffix && !focused && 'opacity-50',
            )}
          >
            {suffix}
          </span>
        )}

        {/* Clear button */}
        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Clear"
            className={cn(
              'text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-3 flex items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
              suffix ? 'right-10' : 'right-3',
            )}
            onClick={handleClear}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="absolute top-3 right-3 flex items-center justify-center">
            <Loader className="text-muted-foreground size-4 animate-spin" />
          </div>
        )}

        {/* Success/Error indicators */}
        {hasSuccess && !loading && (
          <div className="text-success absolute top-3 right-3 flex items-center justify-center">
            <Check className="size-4" aria-hidden="true" />
          </div>
        )}
        {hasError && !loading && (
          <div className="text-destructive absolute top-3 right-3 flex items-center justify-center">
            <AlertCircle className="size-4" aria-hidden="true" />
          </div>
        )}

        {/* Show count */}
        {showCountEnabled && (
          <div
            className={cn(
              'text-muted-foreground pointer-events-none absolute right-3 bottom-1.5 text-xs',
              maxLength !== undefined && currentLength > maxLength && 'text-destructive',
            )}
          >
            {countText}
          </div>
        )}
      </div>

      {/* Messages (hint, error, success) */}
      <div id={descriptionId} className="mt-1.5">
        {/* Hint */}
        {hint && (!hasError || persistentHint) && !focused && (
          <p className={cn('text-muted-foreground text-sm', hintClassName)}>{hint}</p>
        )}

        {/* Error messages */}
        {computedErrorMessages.map((msg, i) => (
          <p key={`error-${i}`} className="text-destructive flex items-center gap-1 text-sm" role="alert">
            <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
            {msg}
          </p>
        ))}

        {/* Success messages */}
        {computedSuccessMessages.map((msg, i) => (
          <p key={`success-${i}`} className="text-success flex items-center gap-1 text-sm">
            <Check className="size-3 shrink-0" aria-hidden="true" />
            {msg}
          </p>
        ))}

        {/* Counter (legacy) */}
        {computedCounter !== null && (
          <div
            className={cn(
              'text-muted-foreground mt-1 text-right text-xs',
              currentLength > computedCounter && 'text-destructive',
            )}
          >
            {currentLength} / {computedCounter}
          </div>
        )}
      </div>

      {children}
    </div>
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }

'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type PinInputStatus = 'error' | 'warning' | 'success' | 'default'
type PinInputSize = 'sm' | 'md' | 'lg'

interface PinInputContextValue {
  mask: boolean
  status: PinInputStatus
  size: PinInputSize
}

const PinInputUiContext = React.createContext<PinInputContextValue>({
  mask: false,
  status: 'default',
  size: 'md',
})

const STYLE_ID = 'pin-input-styles'
const STYLE_CONTENT = `
@keyframes pin-slot-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes pin-char-pop {
  0% { opacity: 0.55; transform: scale(0.88); }
  55% { opacity: 1; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes pin-input-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}
[data-slot='pin-input-slot'].pin-slot-pop {
  animation: pin-slot-pop 200ms cubic-bezier(0.22, 1.25, 0.36, 1) both;
  z-index: 1;
}
[data-slot='pin-input-slot'] .pin-char-pop {
  display: inline-block;
  transform-origin: center center;
  animation: pin-char-pop 200ms cubic-bezier(0.22, 1.25, 0.36, 1) both;
}
/* Class may live on OTPInput's container (no data-slot) or a root wrapper. */
.pin-input-shake {
  animation: pin-input-shake 380ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='pin-input-slot'].pin-slot-pop,
  [data-slot='pin-input-slot'] .pin-char-pop,
  .pin-input-shake {
    animation: none !important;
  }
  [data-slot='pin-input-slot'] {
    transition-duration: 0ms !important;
  }
}
`

function ensurePinInputStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLE_CONTENT
  document.head.appendChild(style)
}

export interface PinInputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof OTPInput>,
  'render' | 'children' | 'maxLength' | 'size'
> {
  /** Number of slots. Maps to input-otp's `maxLength`. */
  maxLength?: number
  /** Render the typed characters as dots instead of plain text. */
  mask?: boolean
  status?: PinInputStatus
  size?: PinInputSize
  /** Fires with the joined string once every slot is filled. */
  onComplete?: (value: string) => void
  children?: React.ReactNode
  className?: string
  containerClassName?: string
}

const PinInput = React.forwardRef<React.ElementRef<typeof OTPInput>, PinInputProps>(
  (
    {
      className,
      containerClassName,
      maxLength = 6,
      mask = false,
      status = 'default',
      size = 'md',
      onComplete,
      children,
      ...props
    },
    ref,
  ) => {
    React.useLayoutEffect(() => {
      ensurePinInputStyles()
    }, [])

    // One-shot shake when status transitions into error (not on mount).
    const [isShaking, setIsShaking] = React.useState(false)
    const prevStatus = React.useRef(status)
    const isFirstStatus = React.useRef(true)

    React.useEffect(() => {
      if (isFirstStatus.current) {
        isFirstStatus.current = false
        prevStatus.current = status
        return
      }
      if (status === 'error' && prevStatus.current !== 'error') {
        setIsShaking(false)
        // Restart animation on the next frame.
        const id = requestAnimationFrame(() => setIsShaking(true))
        prevStatus.current = status
        return () => cancelAnimationFrame(id)
      }
      prevStatus.current = status
    }, [status])

    // Shake class lives on OTPInput's container div; clear via timeout (no event target there).
    React.useEffect(() => {
      if (!isShaking) return
      const t = window.setTimeout(() => setIsShaking(false), 400)
      return () => window.clearTimeout(t)
    }, [isShaking])

    return (
      <PinInputUiContext.Provider value={{ mask, status, size }}>
        <OTPInput
          ref={ref}
          data-uipkge=""
          data-slot="pin-input"
          data-status={status === 'default' ? undefined : status}
          maxLength={maxLength}
          onComplete={onComplete}
          containerClassName={cn(
            'flex items-center gap-2 has-disabled:opacity-50',
            isShaking && 'pin-input-shake',
            containerClassName,
          )}
          className={cn('disabled:cursor-not-allowed', className)}
          {...props}
        >
          {children}
        </OTPInput>
      </PinInputUiContext.Provider>
    )
  },
)
PinInput.displayName = 'PinInput'

const PinInputGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="pin-input-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  ),
)
PinInputGroup.displayName = 'PinInputGroup'

const sizeClassMap: Record<PinInputSize, string> = {
  sm: 'h-8 w-8 text-sm',
  lg: 'h-12 w-12 text-xl',
  md: 'h-10 w-10 text-base',
}

const statusClassMap: Record<PinInputStatus, string> = {
  error: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/40 text-destructive',
  warning: 'border-warning focus-within:border-warning focus-within:ring-warning/40 text-warning',
  success: 'border-success focus-within:border-success focus-within:ring-success/40 text-success',
  default: '',
}

export interface PinInputSlotProps extends React.ComponentPropsWithoutRef<'div'> {
  index: number
  /** Override the inherited mask flag for this slot. */
  mask?: boolean
}

const PinInputSlot = React.forwardRef<HTMLDivElement, PinInputSlotProps>(
  ({ index, mask: maskProp, className, ...props }, ref) => {
    const ui = React.useContext(PinInputUiContext)
    const inputContext = React.useContext(OTPInputContext)
    const slot = inputContext.slots[index]
    const char = slot?.char ?? null
    const isActive = slot?.isActive ?? false
    const effectiveMask = maskProp ?? ui.mask

    // Quiet pop when a character lands (including paste into this slot).
    const [popGen, setPopGen] = React.useState(0)
    const [isPopping, setIsPopping] = React.useState(false)
    const prevChar = React.useRef(char)
    const isFirst = React.useRef(true)

    React.useLayoutEffect(() => {
      if (isFirst.current) {
        isFirst.current = false
        prevChar.current = char
        return
      }
      if (char != null && char !== '' && char !== prevChar.current) {
        setPopGen((g) => g + 1)
        setIsPopping(true)
      }
      prevChar.current = char
    }, [char])

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="pin-input-slot"
        data-active={isActive ? '' : undefined}
        className={cn(
          'border-input bg-background text-foreground relative -ml-px flex items-center justify-center border text-center shadow-xs outline-none first:ml-0 first:rounded-l-md last:rounded-r-md',
          'transition-[border-color,box-shadow,color,transform] duration-150 ease-out',
          'focus-within:border-ring focus-within:ring-ring/40 focus-within:relative focus-within:z-10 focus-within:ring-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isActive && 'border-ring ring-ring/40 z-10 ring-2',
          isPopping && 'pin-slot-pop',
          sizeClassMap[ui.size],
          statusClassMap[ui.status],
          className,
        )}
        onAnimationEnd={(event) => {
          // Only clear on the slot animation — child char-pop can bubble first.
          if (event.target === event.currentTarget && event.animationName === 'pin-slot-pop') {
            setIsPopping(false)
          }
        }}
        {...props}
      >
        {char != null &&
          (effectiveMask ? (
            <span
              key={`mask-${popGen}`}
              className={cn('bg-foreground size-2 rounded-full', popGen > 0 && 'pin-char-pop')}
            />
          ) : (
            <span key={`char-${char}-${popGen}`} className={cn(popGen > 0 && 'pin-char-pop')}>
              {char}
            </span>
          ))}
      </div>
    )
  },
)
PinInputSlot.displayName = 'PinInputSlot'

const PinInputSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} data-uipkge="" data-slot="pin-input-separator" role="separator" {...props}>
      {children ?? <Minus aria-hidden="true" />}
    </div>
  ),
)
PinInputSeparator.displayName = 'PinInputSeparator'

export { PinInput, PinInputGroup, PinInputSlot, PinInputSeparator }

'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export type ClipboardState = 'idle' | 'success' | 'error'

export interface ClipboardProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onCopy' | 'onError'
> {
  /** Text to copy to the clipboard. */
  text?: string
  /** Optional visible label next to the icon. */
  label?: string
  /** Disable the button (no copy, no tooltip). */
  disabled?: boolean
  /** Hide the copy icon (useful when a label is shown). */
  hideIcon?: boolean
  /** Tooltip text shown on hover before copying. */
  tooltip?: string
  /** Feedback text shown after a successful copy. */
  successText?: string
  /** Feedback text shown after a failed copy. */
  errorText?: string
  /** How long (ms) the success/error feedback stays before resetting. */
  timeout?: number
  /** Show the feedback as a tooltip rather than swapping the icon. */
  feedbackTooltip?: boolean
  /** Fired before the copy attempt with the text being copied. */
  onCopy?: (text: string) => void
  /** Fired after a successful copy. */
  onSuccess?: (text: string) => void
  /** Fired after a failed copy. */
  onError?: (error: Error) => void
  /** Render-prop children receiving the current state, or static nodes. */
  children?: React.ReactNode | ((state: ClipboardState) => React.ReactNode)
}

const Clipboard = React.forwardRef<HTMLButtonElement, ClipboardProps>(
  (
    {
      text = '',
      label = '',
      disabled = false,
      hideIcon = false,
      tooltip = 'Copy',
      successText = 'Copied!',
      errorText = 'Failed',
      timeout = 2000,
      feedbackTooltip = true,
      onCopy,
      onSuccess,
      onError,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [state, setState] = React.useState<ClipboardState>('idle')
    const resetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const setFeedback = React.useCallback(
      (nextState: ClipboardState) => {
        setState(nextState)
        if (resetTimer.current) clearTimeout(resetTimer.current)
        resetTimer.current = setTimeout(() => {
          setState('idle')
        }, timeout)
      },
      [timeout],
    )

    // Match the Vue onBeforeUnmount fix: clear any pending reset timer on unmount.
    React.useEffect(() => {
      return () => {
        if (resetTimer.current) clearTimeout(resetTimer.current)
      }
    }, [])

    const copy = React.useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        onClick?.(e)
        const value = text
        onCopy?.(value)
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value)
          } else {
            // Legacy fallback for non-secure contexts.
            const ta = document.createElement('textarea')
            ta.value = value
            ta.style.position = 'fixed'
            ta.style.opacity = '0'
            document.body.appendChild(ta)
            ta.select()
            const ok = document.execCommand('copy')
            document.body.removeChild(ta)
            if (!ok) throw new Error('execCommand copy failed')
          }
          setFeedback('success')
          onSuccess?.(value)
        } catch (err) {
          setFeedback('error')
          onError?.(err as Error)
        }
      },
      [disabled, text, onCopy, onSuccess, onError, onClick, setFeedback],
    )

    const currentTooltip = state === 'success' ? successText : state === 'error' ? errorText : tooltip

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              ref={ref}
              data-uipkge=""
              data-slot="clipboard"
              data-feedback-state={state}
              disabled={disabled}
              aria-label={currentTooltip}
              onClick={copy}
              className={cn(
                'inline-flex items-center gap-2 rounded-md text-sm transition-colors',
                'text-muted-foreground hover:text-foreground',
                'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className,
              )}
              {...props}
            >
              {!hideIcon && (
                <span data-slot="clipboard-icon" className="inline-flex">
                  {state === 'success' ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                </span>
              )}
              {label && <span data-slot="clipboard-label">{label}</span>}
              {typeof children === 'function' ? children(state) : children}
            </button>
          </TooltipTrigger>
          {(feedbackTooltip || state === 'idle') && <TooltipContent>{currentTooltip}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    )
  },
)
Clipboard.displayName = 'Clipboard'

export { Clipboard }

'use client'

import * as React from 'react'
import { Eraser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signaturePadVariants } from './signature-pad.variants'

export interface SignaturePadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** PNG data URL of the current canvas contents, or null when empty. The
   *  React equivalent of the Vue `v-model` binding — pair with `onModelChange`. */
  modelValue?: string | null
  width?: number
  height?: number
  penColor?: string
  penThickness?: number
  backgroundColor?: string
  exportFormat?: string
  disabled?: boolean
  readonly?: boolean
  showClearButton?: boolean
  clearLabel?: string
  /** Fired with the new data URL (or null) whenever the signature changes. */
  onModelChange?: (value: string | null) => void
  /** Fired when a stroke begins. */
  onBegin?: () => void
  /** Fired when a stroke ends. */
  onEnd?: () => void
  /** Fired with the new data URL (or null) on every change (same payload as onModelChange). */
  onChange?: (value: string | null) => void
  /** Render-prop for custom action controls. Mirrors the Vue `actions` slot. */
  actions?: (state: { clear: () => void; exportSignature: () => void; empty: boolean }) => React.ReactNode
}

export interface SignaturePadRef {
  clear: () => void
  exportSignature: () => void
  toDataURL: () => void
  pointCount: number
  isEmpty: boolean
}

/** Resolve theme CSS variables (and legacy `hsl(var(--x))`) to a paint color canvas accepts. */
function resolveColor(input: string | undefined, cssVar: string): string {
  let candidate = (input || '').trim()
  if (!candidate) candidate = `var(${cssVar})`
  const hslWrapped = candidate.match(/^hsl\(\s*(var\(--[^)]+\))\s*\)$/i)
  if (hslWrapped) candidate = hslWrapped[1]
  if (candidate.startsWith('var(')) {
    const name = candidate.match(/var\((--[^),]+)/)?.[1]
    if (name && typeof document !== 'undefined') {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      if (v) return v
    }
  }
  return candidate
}

const SignaturePad = React.forwardRef<SignaturePadRef, SignaturePadProps>(
  (
    {
      modelValue,
      width = 400,
      height = 200,
      // Empty → resolve --foreground / --background (theme-aware; works in dark mode).
      penColor = '',
      penThickness = 2,
      backgroundColor = '',
      exportFormat = 'image/png',
      disabled = false,
      readonly = false,
      showClearButton = true,
      clearLabel = 'Clear',
      className,
      onModelChange,
      onBegin,
      onEnd,
      onChange,
      actions,
      ...props
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null)
    const isDrawingRef = React.useRef(false)
    const lastPosRef = React.useRef({ x: 0, y: 0 })
    // Sync ref so export on pointer-up sees ink set in the same event turn
    // (React state would still be stale until the next render).
    const hasInkRef = React.useRef(false)

    const [pointCount, setPointCount] = React.useState(0)
    const [hasInk, setHasInk] = React.useState(false)

    // Keep the latest callbacks without re-running the canvas setup effect.
    const callbacksRef = React.useRef({ onModelChange, onBegin, onEnd, onChange })
    callbacksRef.current = { onModelChange, onBegin, onEnd, onChange }

    const isInteractive = !disabled && !readonly

    const setupCanvas = React.useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const context = canvas.getContext('2d')
      if (!context) return
      context.scale(dpr, dpr)
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.strokeStyle = resolveColor(penColor, '--foreground')
      context.lineWidth = penThickness
      context.fillStyle = resolveColor(backgroundColor, '--background')
      context.fillRect(0, 0, width, height)
      ctxRef.current = context
      setPointCount(0)
      hasInkRef.current = false
      setHasInk(false)
    }, [width, height, penColor, penThickness, backgroundColor])

    const getPointerPos = React.useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        // Map CSS pixels → logical canvas coords if the element is CSS-scaled.
        const scaleX = width / (rect.width || width)
        const scaleY = height / (rect.height || height)
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        }
      },
      [width, height],
    )

    const exportSignature = React.useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const { onModelChange, onChange } = callbacksRef.current
      if (!hasInkRef.current) {
        onModelChange?.(null)
        onChange?.(null)
        return
      }
      const dataUrl = canvas.toDataURL(exportFormat)
      onModelChange?.(dataUrl)
      onChange?.(dataUrl)
    }, [exportFormat])

    const clear = React.useCallback(() => {
      const canvas = canvasRef.current
      const context = ctxRef.current
      if (!canvas || !context) return
      context.fillStyle = resolveColor(backgroundColor, '--background')
      context.fillRect(0, 0, width, height)
      setPointCount(0)
      hasInkRef.current = false
      setHasInk(false)
      callbacksRef.current.onModelChange?.(null)
      callbacksRef.current.onChange?.(null)
    }, [backgroundColor, width, height])

    React.useImperativeHandle(
      ref,
      (): SignaturePadRef => ({
        clear,
        exportSignature,
        toDataURL: exportSignature,
        pointCount,
        isEmpty: !hasInk,
      }),
      [clear, exportSignature, pointCount, hasInk],
    )

    React.useEffect(() => {
      setupCanvas()
      return () => {
        ctxRef.current = null
      }
    }, [setupCanvas])

    // modelValue is read-only from the outside; we do not paint it back onto
    // the canvas (mirrors the Vue component, which also never restores ink).

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isInteractive || !ctxRef.current) return
      e.preventDefault()
      isDrawingRef.current = true
      const { x, y } = getPointerPos(e)
      lastPosRef.current = { x, y }
      ctxRef.current.beginPath()
      ctxRef.current.moveTo(x, y)
      setPointCount((c) => c + 1)
      hasInkRef.current = true
      setHasInk(true)
      callbacksRef.current.onBegin?.()
      canvasRef.current?.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current || !ctxRef.current) return
      e.preventDefault()
      const { x, y } = getPointerPos(e)
      const { x: lastX, y: lastY } = lastPosRef.current
      ctxRef.current.beginPath()
      ctxRef.current.moveTo(lastX, lastY)
      ctxRef.current.lineTo(x, y)
      ctxRef.current.stroke()
      lastPosRef.current = { x, y }
      setPointCount((c) => c + 1)
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return
      isDrawingRef.current = false
      ctxRef.current?.closePath()
      canvasRef.current?.releasePointerCapture(e.pointerId)
      exportSignature()
      callbacksRef.current.onEnd?.()
    }

    return (
      <div
        data-uipkge=""
        data-slot="signature-pad"
        data-disabled={disabled ? '' : undefined}
        data-readonly={readonly ? '' : undefined}
        className={cn(signaturePadVariants(), className)}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className={cn('block touch-none rounded-md', !isInteractive && 'pointer-events-none')}
          style={{ touchAction: 'none' }}
          aria-label={`Signature pad${disabled ? ' (disabled)' : readonly ? ' (readonly)' : ''}`}
          aria-disabled={disabled || undefined}
          role="img"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {showClearButton && isInteractive ? (
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="text-muted-foreground text-xs tabular-nums">{pointCount} points</span>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              disabled={!hasInk}
              onClick={clear}
            >
              <Eraser className="size-4" />
              {clearLabel}
            </button>
          </div>
        ) : null}
        {actions ? actions({ clear, exportSignature, empty: !hasInk }) : null}
      </div>
    )
  },
)
SignaturePad.displayName = 'SignaturePad'

export { SignaturePad }

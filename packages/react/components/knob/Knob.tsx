'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface KnobProps {
  /** Controlled value */
  value?: number
  /** Default value when uncontrolled */
  defaultValue?: number
  /** Emitted when the value changes */
  onValueChange?: (value: number) => void
  /** Also fired on every committed change (parity with the Vue `change` event) */
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: number
  strokeWidth?: number
  valueColor?: string
  rangeColor?: string
  disabled?: boolean
  readonly?: boolean
  showValue?: boolean
  className?: string
  /** Accessible name for the slider. Prefer over a visible label when none is nearby. */
  'aria-label'?: string
  /** Custom renderer for the centered value text. */
  renderValue?: (value: number) => React.ReactNode
}

const startAngle = -Math.PI * 0.75
const endAngle = Math.PI * 0.75
const sweep = endAngle - startAngle

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  const x2 = cx + r * Math.cos(a2)
  const y2 = cy + r * Math.sin(a2)
  const large = a2 - a1 > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

const Knob = React.forwardRef<SVGSVGElement, KnobProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      size = 100,
      strokeWidth = 14,
      valueColor = 'var(--primary)',
      rangeColor = 'var(--muted)',
      disabled = false,
      readonly = false,
      showValue = true,
      className,
      'aria-label': ariaLabel = 'Value',
      renderValue,
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined
    const [internal, setInternal] = React.useState(defaultValue)
    const rawValue = isControlled ? controlledValue! : internal

    const svgRef = React.useRef<SVGSVGElement | null>(null)
    const setRefs = React.useCallback(
      (node: SVGSVGElement | null) => {
        svgRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<SVGSVGElement | null>).current = node
      },
      [ref],
    )
    const [isDragging, setIsDragging] = React.useState(false)

    const value = clamp(rawValue, min, max)
    const percent = max === min ? 0 : (value - min) / (max - min)

    const rangePath = arcPath(50, 50, 40, startAngle, endAngle)
    const valuePath = arcPath(50, 50, 40, startAngle, startAngle + sweep * percent)

    function snap(v: number) {
      const stepped = Math.round((v - min) / step) * step + min
      return clamp(stepped, min, max)
    }

    function setValue(v: number) {
      if (disabled || readonly) return
      const next = snap(v)
      if (next === rawValue) return
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
      onChange?.(next)
    }

    function angleFromEvent(e: React.PointerEvent): number {
      const rect = svgRef.current!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      return Math.atan2(e.clientY - cy, e.clientX - cx)
    }

    function angleToValue(angle: number): number {
      let a = angle - startAngle
      if (a < 0) a += Math.PI * 2
      if (a > sweep) {
        return a < (Math.PI * 2 + sweep) / 2 ? max : min
      }
      return min + (a / sweep) * (max - min)
    }

    function onPointerDown(e: React.PointerEvent) {
      if (disabled || readonly) return
      ;(e.target as Element).setPointerCapture(e.pointerId)
      setIsDragging(true)
      setValue(angleToValue(angleFromEvent(e)))
    }

    function onPointerMove(e: React.PointerEvent) {
      if (!isDragging) return
      setValue(angleToValue(angleFromEvent(e)))
    }

    function onPointerUp(e: React.PointerEvent) {
      if (!isDragging) return
      setIsDragging(false)
      ;(e.target as Element).releasePointerCapture(e.pointerId)
    }

    function onKeyDown(e: React.KeyboardEvent) {
      if (disabled || readonly) return
      const big = step * 10
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault()
          setValue(value + step)
          break
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault()
          setValue(value - step)
          break
        case 'PageUp':
          e.preventDefault()
          setValue(value + big)
          break
        case 'PageDown':
          e.preventDefault()
          setValue(value - big)
          break
        case 'Home':
          e.preventDefault()
          setValue(min)
          break
        case 'End':
          e.preventDefault()
          setValue(max)
          break
      }
    }

    function onWheel(e: React.WheelEvent) {
      if (disabled || readonly) return
      // Note: React's synthetic wheel listener is passive, so preventDefault is
      // a no-op here. A native non-passive listener is attached below to stop
      // the page from scrolling while the knob has focus / is hovered.
      setValue(value + (e.deltaY < 0 ? step : -step))
    }

    // Attach a non-passive wheel listener so e.preventDefault() actually blocks
    // page scroll — React's onWheel is passive and can't cancel the scroll.
    React.useEffect(() => {
      const node = svgRef.current
      if (!node) return
      const handler = (e: WheelEvent) => {
        if (disabled || readonly) return
        e.preventDefault()
      }
      node.addEventListener('wheel', handler, { passive: false })
      return () => node.removeEventListener('wheel', handler)
    }, [disabled, readonly])

    return (
      <svg
        ref={setRefs}
        data-uipkge=""
        data-slot="knob"
        className={cn(
          'focus-visible:ring-ring inline-block touch-none rounded-full outline-none select-none focus-visible:ring-2',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && !readonly && 'cursor-pointer',
          className,
        )}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled || undefined}
        aria-readonly={readonly || undefined}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
      >
        <path d={rangePath} stroke={rangeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
        <path d={valuePath} stroke={valueColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
        {showValue && (
          <text x="50" y="55" textAnchor="middle" fontSize="18" className="fill-foreground font-medium">
            {renderValue ? renderValue(value) : value}
          </text>
        )}
      </svg>
    )
  },
)
Knob.displayName = 'Knob'

export { Knob }

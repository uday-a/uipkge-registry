'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_PRESETS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ffffff',
  '#d4d4d4',
  '#737373',
  '#171717',
]

export interface ColorPickerProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  /** Override the swatches shown below the color input. Pass [] to hide entirely. */
  presets?: string[]
  /** Hide the hex text field next to the color trigger. */
  hideHexInput?: boolean
  className?: string
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ value, onValueChange, disabled, presets = DEFAULT_PRESETS, hideHexInput = false, className }, ref) => {
    const swatches = presets ?? []
    // Native <input type="color"> only accepts #rrggbb — keep a safe value while typing free-form hex.
    const safeColorValue = /^#[0-9a-fA-F]{6}$/.test(value || '') ? (value as string) : '#ffffff'

    return (
      <div ref={ref} data-uipkge="" data-slot="color-picker" className={cn('space-y-3', className)}>
        {/* Color trigger + hex field */}
        <div className="flex items-center gap-2">
          <div
            className="border-input relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-xs"
            style={{ backgroundColor: value || '#ffffff' }}
          >
            <input
              type="color"
              value={safeColorValue}
              disabled={disabled}
              aria-label="Pick color"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              onInput={(e) => onValueChange?.((e.target as HTMLInputElement).value)}
            />
          </div>
          {!hideHexInput && (
            <input
              type="text"
              value={value || ''}
              placeholder="#000000"
              spellCheck={false}
              autoComplete="off"
              disabled={disabled}
              aria-label="Hex color"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 flex-1 rounded-md border px-3 text-sm uppercase shadow-xs outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => onValueChange?.(e.target.value)}
            />
          )}
        </div>

        {/* Preset swatches */}
        {swatches.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {swatches.map((color) => (
              <button
                type="button"
                key={color}
                disabled={disabled}
                aria-label={`Select ${color}`}
                style={{ backgroundColor: color }}
                className={cn(
                  'ring-offset-background focus-visible:ring-ring/40 size-6 shrink-0 rounded-md shadow-sm transition-transform outline-none hover:scale-110 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
                  value?.toLowerCase() === color.toLowerCase()
                    ? 'ring-foreground ring-2 ring-offset-2'
                    : 'ring-border/50 ring-1',
                  color.toLowerCase() === '#ffffff' && 'ring-border',
                )}
                onClick={() => onValueChange?.(color)}
              />
            ))}
          </div>
        )}
      </div>
    )
  },
)
ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'middle' | 'large'
  disabled?: boolean
}

const sizeClasses: Record<string, string> = {
  small: 'h-8 text-xs',
  middle: 'h-9 text-sm',
  large: 'h-11 text-base',
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, size = 'middle', disabled, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="input-group"
        data-size={size}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'group/input-group border-input bg-background relative flex w-full items-stretch rounded-md border shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:outline-none',
          '[&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:focus-within:ring-0',
          '[&_input]:h-full [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:focus-visible:ring-0',
          disabled && 'bg-muted/30 pointer-events-none cursor-not-allowed opacity-50',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

InputGroup.displayName = 'InputGroup'

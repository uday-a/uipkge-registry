'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  attached?: boolean
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', attached = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        data-uipkge=""
        data-slot="button-group"
        data-orientation={orientation}
        data-attached={attached ? '' : undefined}
        className={cn(
          'inline-flex items-center',
          orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row',
          attached && [
            '[&>[data-slot=button]]:relative [&>[data-slot=button]:focus-visible]:z-20 [&>[data-slot=button]:hover]:z-10',
            orientation === 'horizontal' && [
              '[&>[data-slot=button]]:rounded-none',
              'first:[&>[data-slot=button]]:rounded-l-md last:[&>[data-slot=button]]:rounded-r-md',
              '[&>[data-slot=button]:not(:first-child)]:-ml-px',
            ],
            orientation === 'vertical' && [
              '[&>[data-slot=button]]:rounded-none',
              'first:[&>[data-slot=button]]:rounded-t-md last:[&>[data-slot=button]]:rounded-b-md',
              '[&>[data-slot=button]:not(:first-child)]:-mt-px',
            ],
          ],
          !attached && (orientation === 'vertical' ? 'gap-1' : 'gap-1.5'),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ButtonGroup.displayName = 'ButtonGroup'

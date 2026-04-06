import * as React from 'react'
import { AlertCircle, CheckCircle, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { alertVariants, type AlertVariants } from './alert.variants'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, AlertVariants {
  icon?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  text?: string
}

const builtInIcons = {
  error: AlertCircle,
  success: CheckCircle,
  warning: TriangleAlert,
  info: Info,
} as const

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, title, text, children, ...props }, ref) => {
    const IconComp = icon ? builtInIcons[icon] : null

    return (
      <div
        ref={ref}
        role="alert"
        data-uipkge=""
        data-slot="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {/*
          Icons and composition children must be direct root descendants so the
          `[&>svg]` absolute layout in alertVariants can position and pad correctly.
        */}
        {IconComp ? <IconComp className="size-4" aria-hidden="true" /> : null}
        {title ? (
          <p data-uipkge="" data-slot="alert-title" className="mb-1 text-sm leading-none font-medium tracking-tight">
            {title}
          </p>
        ) : null}
        {text ? (
          <div
            data-uipkge=""
            data-slot="alert-description"
            className="text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed"
          >
            {text}
          </div>
        ) : null}
        {children}
      </div>
    )
  },
)
Alert.displayName = 'Alert'

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, as: Comp = 'h5', ...props }, ref) => (
    <Comp
      ref={ref}
      data-uipkge=""
      data-slot="alert-title"
      className={cn('mb-1 text-sm leading-none font-medium tracking-tight', className)}
      {...props}
    />
  ),
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="alert-description"
      className={cn('text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed', className)}
      {...props}
    />
  ),
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }

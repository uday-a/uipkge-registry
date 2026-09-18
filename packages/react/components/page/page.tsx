import * as React from 'react'
import { cn } from '@/lib/utils'

const Page = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-uipkge="" data-slot="page" className={cn('space-y-6', className)} {...props} />
))
Page.displayName = 'Page'

const PageBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-uipkge="" data-slot="page-body" className={cn('', className)} {...props} />
  ),
)
PageBody.displayName = 'PageBody'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Right-aligned action bar (buttons, menus). The Vue `#actions` slot. */
  actions?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, children, actions, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="page-header"
      className={cn('flex flex-col justify-between gap-4 sm:flex-row sm:items-center', className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {actions}
    </div>
  ),
)
PageHeader.displayName = 'PageHeader'

export interface PageHeaderHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

const PageHeaderHeading = React.forwardRef<HTMLDivElement, PageHeaderHeadingProps>(
  ({ className, title, description, ...props }, ref) => (
    <div ref={ref} data-uipkge="" data-slot="page-header-heading" className={cn('', className)} {...props}>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{description}</p>}
    </div>
  ),
)
PageHeaderHeading.displayName = 'PageHeaderHeading'

export { Page, PageBody, PageHeader, PageHeaderHeading }

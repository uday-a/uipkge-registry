'use client'

import * as React from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type AlertIcon = 'info' | 'warning' | 'error' | 'success'

export interface AlertModalProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Title rendered in the header. Override with the `title` node if you need markup. */
  title?: React.ReactNode
  /** Description rendered under the title. */
  description?: React.ReactNode
  /** Label for the primary action button. */
  actionLabel?: React.ReactNode
  /** Label for the cancel button. Pass null to hide. */
  cancelLabel?: React.ReactNode | null
  /** Visual tone — colors the icon and action button. */
  tone?: 'default' | 'destructive' | 'success' | 'warning'
  /** Quick icon shortcut, a custom icon component, or a rendered node. */
  icon?: AlertIcon | LucideIcon | React.ReactNode | null
  /** Show a spinner on the action button and disable both buttons. */
  loading?: boolean
  /** Disable the primary action without a spinner. */
  actionDisabled?: boolean
  className?: string
  onAction?: (event: React.MouseEvent) => void
  onCancel?: (event: React.MouseEvent) => void
  /** Element that opens the modal. Rendered as the trigger when provided. */
  trigger?: React.ReactNode
  /** Optional free-form body content between the header and the action row. */
  children?: React.ReactNode
  /** Replace the default action/cancel button row. */
  actions?: React.ReactNode
}

const builtInIcons: Record<AlertIcon, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
}

function isAlertIcon(value: unknown): value is AlertIcon {
  return value === 'info' || value === 'success' || value === 'warning' || value === 'error'
}

const iconColorClasses: Record<NonNullable<AlertModalProps['tone']>, string> = {
  destructive: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  default: 'text-muted-foreground',
}

const actionToneClasses: Record<NonNullable<AlertModalProps['tone']>, string> = {
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  default: '',
}

const AlertModal = ({
  open,
  onOpenChange,
  title = '',
  description = '',
  actionLabel = 'Continue',
  cancelLabel = 'Cancel',
  tone = 'default',
  icon = null,
  loading = false,
  actionDisabled = false,
  className,
  onAction,
  onCancel,
  trigger,
  children,
  actions,
}: AlertModalProps) => {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState<boolean>(open ?? false)
  const effectiveOpen = isControlled ? open : internalOpen

  function setOpen(value: boolean) {
    // Keep the dialog open while an async action is in flight.
    if (!value && loading) return
    if (!isControlled) setInternalOpen(value)
    onOpenChange?.(value)
  }

  const resolvedIcon = React.useMemo<React.ReactNode>(() => {
    if (!icon) return null
    if (isAlertIcon(icon)) {
      const IconComp = builtInIcons[icon]
      return <IconComp className="size-5" />
    }
    if (typeof icon === 'function') {
      const IconComp = icon as LucideIcon
      return <IconComp className="size-5" />
    }
    return icon
  }, [icon])

  function handleAction(e: React.MouseEvent) {
    if (loading || actionDisabled) {
      e.preventDefault()
      return
    }
    onAction?.(e)
  }

  function handleCancel(e: React.MouseEvent) {
    onCancel?.(e)
  }

  return (
    <Dialog open={effectiveOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        role="alertdialog"
        showCloseButton={false}
        className={cn(className)}
        // Alert dialogs must not soft-dismiss on outside click (WAI-ARIA).
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2 text-center sm:text-left">
          {resolvedIcon && (
            <div
              className={cn(
                'bg-muted mb-2 flex size-10 items-center justify-center rounded-full',
                iconColorClasses[tone],
              )}
            >
              {resolvedIcon}
            </div>
          )}
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground text-sm">{description}</DialogDescription>
          )}
        </div>

        {children && <div className="text-sm">{children}</div>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {actions ?? (
            <>
              {cancelLabel != null && (
                <DialogClose asChild>
                  <Button variant="outline" disabled={loading} onClick={handleCancel}>
                    {cancelLabel}
                  </Button>
                </DialogClose>
              )}
              <Button
                disabled={loading || actionDisabled}
                aria-busy={loading}
                className={actionToneClasses[tone]}
                onClick={handleAction}
              >
                {loading && (
                  <span
                    className="mr-2 inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                )}
                {actionLabel}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
AlertModal.displayName = 'AlertModal'

export { AlertModal }

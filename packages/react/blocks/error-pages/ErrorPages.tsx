'use client'

import type { ComponentProps, ReactNode } from 'react'
import { Clock, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type ErrorPagesVariant = '404' | '500' | '403' | 'maintenance'

export interface ErrorPagesProps {
  /** `'all'` renders the full gallery; a single variant renders just that screen. */
  variant?: ErrorPagesVariant | 'all'
  size?: 'sm' | 'default'
  className?: string
  title?: string
  description?: string
  /** Status numeral. Pass `''` to hide. */
  code?: string
  /** Eyebrow pill (maintenance ETA by default). Pass `''` to hide. */
  tag?: string
  /** Replaces the HTTP response panel on a single variant. Pass `''` to hide art. */
  image?: string
  imageAlt?: string
  primaryLabel?: string
  secondaryLabel?: string
  primaryHref?: string
  secondaryHref?: string
  showPrimary?: boolean
  showSecondary?: boolean
  primaryDisabled?: boolean
  secondaryDisabled?: boolean
  onHome?: () => void
  onSearch?: () => void
  onRetry?: () => void
  onStatus?: () => void
  onSwitchAccount?: () => void
  onRequestAccess?: () => void
  onSubscribe?: () => void
}

const copy = (fallback: string, override?: string) => (override === undefined ? fallback : override)

function Action({
  href,
  onClick,
  children,
  ...buttonProps
}: {
  href?: string
  onClick?: () => void
  children: ReactNode
} & Omit<ComponentProps<typeof Button>, 'onClick'>) {
  if (href) {
    return (
      <Button asChild {...buttonProps}>
        <a href={href} onClick={onClick}>
          {children}
        </a>
      </Button>
    )
  }
  return (
    <Button {...buttonProps} onClick={onClick}>
      {children}
    </Button>
  )
}

export function ErrorPages({
  variant = 'all',
  size = 'default',
  className,
  title,
  description,
  code,
  tag,
  image,
  imageAlt = '',
  primaryLabel,
  secondaryLabel,
  primaryHref,
  secondaryHref,
  showPrimary = true,
  showSecondary = true,
  primaryDisabled = false,
  secondaryDisabled = false,
  onHome,
  onSearch,
  onRetry,
  onStatus,
  onSwitchAccount,
  onRequestAccess,
  onSubscribe,
}: ErrorPagesProps) {
  const pick = (v: ErrorPagesVariant, fallback: string, override?: string) =>
    variant === v ? copy(fallback, override) : fallback

  const frameClass = cn(
    'border-border bg-card overflow-hidden rounded-xl border text-left',
    size === 'sm' && 'rounded-lg',
  )
  const imgClass = 'aspect-[16/10] w-full object-cover'
  const bodyClass = size === 'sm' ? 'p-5' : 'p-6'
  const codeClass = cn('font-semibold tracking-tighter', size === 'sm' ? 'text-2xl' : 'text-4xl')
  const titleClass = cn('mt-1.5 font-semibold tracking-tight', size === 'sm' ? 'text-base' : 'text-xl')
  const descClass = 'text-muted-foreground mt-2 max-w-sm text-sm'
  const actionsClass = cn('flex flex-wrap items-center gap-2', size === 'sm' ? 'mt-4' : 'mt-5')
  const actionSize = size === 'sm' ? ('xs' as const) : ('sm' as const)

  const show = (v: ErrorPagesVariant) => variant === 'all' || variant === v

  const title404 = pick('404', 'Page not found', title)
  const desc404 = pick(
    '404',
    "The page you're looking for doesn't exist or was moved. Check the URL or head back home.",
    description,
  )
  const code404 = pick('404', '404', code)
  const image404 = pick('404', '/illustrations/error-404.jpg', image)
  const primary404 = pick('404', 'Go home', primaryLabel)
  const secondary404 = pick('404', 'Search docs', secondaryLabel)

  const title500 = pick('500', 'Internal server error', title)
  const desc500 = pick(
    '500',
    'Something went wrong on our end. The team has been notified — try again in a moment.',
    description,
  )
  const code500 = pick('500', '500', code)
  const image500 = pick('500', '/illustrations/error-500.jpg', image)
  const primary500 = pick('500', 'Retry', primaryLabel)
  const secondary500 = pick('500', 'Status page', secondaryLabel)

  const title403 = pick('403', 'Access denied', title)
  const desc403 = pick(
    '403',
    "You don't have permission to view this page. Switch accounts or ask an admin to request access.",
    description,
  )
  const code403 = pick('403', '403', code)
  const image403 = pick('403', '/illustrations/error-403.jpg', image)
  const primary403 = pick('403', 'Request access', primaryLabel)
  const secondary403 = pick('403', 'Switch account', secondaryLabel)

  const title503 = pick('maintenance', 'Scheduled maintenance', title)
  const desc503 = pick(
    'maintenance',
    "We're upgrading our systems. The service will be back online shortly.",
    description,
  )
  const code503 = pick('maintenance', '503', code)
  const image503 = pick('maintenance', '/illustrations/error-maintenance.jpg', image)
  const tag503 = pick('maintenance', 'Back online around 14:00 UTC', tag)
  const primary503 = pick('maintenance', 'Subscribe for updates', primaryLabel)
  const secondary503 = variant === 'maintenance' ? (secondaryLabel ?? '') : (secondaryLabel ?? '')

  return (
    <div
      data-slot="error-pages"
      data-size={size}
      className={cn(variant === 'all' && 'grid gap-4 sm:grid-cols-2', className)}
    >
      {show('404') && (
        <article className={frameClass} data-slot="error-page" data-variant="404" role="status">
          {image404 ? (
            <img src={image404} alt={imageAlt} className={imgClass} />
          ) : image404 === undefined ? (
            <div className="border-border bg-muted/40 border-b font-mono" aria-hidden="true">
              <div className="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">
                GET /pricing/teams
              </div>
              <div className="space-y-1 p-3 text-xs leading-relaxed">
                <p>
                  <span className="text-muted-foreground">HTTP/1.1</span> {code404 || '404'} Not Found
                </p>
                <p className="text-muted-foreground">x-request-id: req_9k2e18</p>
              </div>
            </div>
          ) : null}
          <div className={bodyClass}>
            {code404 ? <p className={codeClass}>{code404}</p> : null}
            <h3 className={titleClass}>{title404}</h3>
            <p className={descClass}>{desc404}</p>
            {variant === '404' && tag ? (
              <p className="text-muted-foreground mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs">
                {tag}
              </p>
            ) : null}
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onHome}>
                    {primary404}
                  </Action>
                ) : null}
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={secondaryDisabled}
                    onClick={onSearch}
                  >
                    {secondary404}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('500') && (
        <article className={frameClass} data-slot="error-page" data-variant="500" role="alert">
          {image500 ? (
            <img src={image500} alt={imageAlt} className={imgClass} />
          ) : image500 === undefined ? (
            <div className="border-border bg-muted/40 border-b font-mono" aria-hidden="true">
              <div className="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">
                POST /api/v1/invoices
              </div>
              <div className="space-y-1 p-3 text-xs leading-relaxed">
                <p>
                  <span className="text-muted-foreground">HTTP/1.1</span>{' '}
                  <span className="text-destructive">{code500 || '500'} Internal Server Error</span>
                </p>
                <p className="text-muted-foreground">error: ECONNRESET at Worker.run:142</p>
              </div>
            </div>
          ) : null}
          <div className={bodyClass}>
            {code500 ? <p className={codeClass}>{code500}</p> : null}
            <h3 className={titleClass}>{title500}</h3>
            <p className={descClass}>{desc500}</p>
            {variant === '500' && tag ? (
              <p className="text-muted-foreground mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs">
                {tag}
              </p>
            ) : null}
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onRetry}>
                    <RotateCcw />
                    {primary500}
                  </Action>
                ) : null}
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="outline"
                    disabled={secondaryDisabled}
                    onClick={onStatus}
                  >
                    {secondary500}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('403') && (
        <article className={frameClass} data-slot="error-page" data-variant="403" role="alert">
          {image403 ? (
            <img src={image403} alt={imageAlt} className={imgClass} />
          ) : image403 === undefined ? (
            <div className="border-border bg-muted/40 border-b font-mono" aria-hidden="true">
              <div className="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">
                GET /admin/billing
              </div>
              <div className="space-y-1 p-3 text-xs leading-relaxed">
                <p>
                  <span className="text-muted-foreground">HTTP/1.1</span>{' '}
                  <span className="text-warning">{code403 || '403'} Forbidden</span>
                </p>
                <p className="text-muted-foreground">scope billing:read — denied for guest</p>
              </div>
            </div>
          ) : null}
          <div className={bodyClass}>
            {code403 ? <p className={codeClass}>{code403}</p> : null}
            <h3 className={titleClass}>{title403}</h3>
            <p className={descClass}>{desc403}</p>
            {variant === '403' && tag ? (
              <p className="text-muted-foreground mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs">
                {tag}
              </p>
            ) : null}
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="outline"
                    disabled={secondaryDisabled}
                    onClick={onSwitchAccount}
                  >
                    {secondary403}
                  </Action>
                ) : null}
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onRequestAccess}>
                    {primary403}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('maintenance') && (
        <article className={frameClass} data-slot="error-page" data-variant="maintenance" role="status">
          {image503 ? (
            <img src={image503} alt={imageAlt} className={imgClass} />
          ) : image503 === undefined ? (
            <div className="border-border bg-muted/40 border-b font-mono" aria-hidden="true">
              <div className="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /health</div>
              <div className="space-y-1 p-3 text-xs leading-relaxed">
                <p>
                  <span className="text-muted-foreground">HTTP/1.1</span>{' '}
                  <span className="text-warning">{code503 || '503'} Service Unavailable</span>
                </p>
                <p className="text-muted-foreground">Retry-After: 3600</p>
              </div>
            </div>
          ) : null}
          <div className={bodyClass}>
            {code503 ? <p className={codeClass}>{code503}</p> : null}
            <h3 className={titleClass}>{title503}</h3>
            <p className={descClass}>{desc503}</p>
            {tag503 ? (
              <p className="text-muted-foreground mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
                <Clock className="size-3.5" aria-hidden="true" />
                {tag503}
              </p>
            ) : null}
            {showPrimary || (showSecondary && secondary503) ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action
                    href={primaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={primaryDisabled}
                    onClick={onSubscribe}
                  >
                    {primary503}
                  </Action>
                ) : null}
                {showSecondary && secondary503 ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="outline"
                    disabled={secondaryDisabled}
                    onClick={onStatus}
                  >
                    {secondary503}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}
    </div>
  )
}

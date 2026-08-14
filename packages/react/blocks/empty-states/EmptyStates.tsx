'use client'

import type { ComponentProps, ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type EmptyStateVariant =
  | 'no-data'
  | 'no-search-results'
  | 'first-use'
  | 'error-recovery'
  | 'no-access'
  | 'sync-complete'

export interface EmptyStatesProps {
  /** `'all'` renders the full gallery; a single variant renders just that card. */
  variant?: EmptyStateVariant | 'all'
  size?: 'sm' | 'default'
  layout?: 'grid' | 'list'
  className?: string
  title?: string
  description?: string
  /** Replaces the response panel on a single variant. Pass `''` to hide art. */
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
  onPrimary?: () => void
  onSecondary?: () => void
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

function ResponsePanel({
  request,
  status,
  detail,
  tone,
}: {
  request: string
  status: string
  detail: string
  tone?: 'destructive' | 'warning'
}) {
  return (
    <div className="border-border bg-muted/40 border-b font-mono" aria-hidden="true">
      <div className="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">{request}</div>
      <div className="space-y-1 p-3 text-xs leading-relaxed">
        <p>
          <span className="text-muted-foreground">HTTP/1.1</span>{' '}
          {tone === 'destructive' ? (
            <span className="text-destructive">{status}</span>
          ) : tone === 'warning' ? (
            <span className="text-warning">{status}</span>
          ) : (
            <>{status}</>
          )}
        </p>
        <p className="text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}

export function EmptyStates({
  variant = 'all',
  size = 'default',
  layout = 'grid',
  className,
  title,
  description,
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
  onPrimary,
  onSecondary,
}: EmptyStatesProps) {
  const show = (v: EmptyStateVariant) => variant === 'all' || variant === v
  const pick = (v: EmptyStateVariant, fallback: string, override?: string) =>
    variant === v ? copy(fallback, override) : fallback
  const defaults: Record<EmptyStateVariant, string> = {
    'no-data': '/illustrations/empty-no-data.jpg',
    'no-search-results': '/illustrations/empty-no-search.jpg',
    'first-use': '/illustrations/empty-first-use.jpg',
    'error-recovery': '/illustrations/empty-error-recovery.jpg',
    'no-access': '/illustrations/empty-no-access.jpg',
    'sync-complete': '/illustrations/empty-sync-complete.jpg',
  }
  const art = (v: EmptyStateVariant) => (variant === v ? copy(defaults[v], image) : defaults[v])

  const cardClass = cn(
    'border-border bg-card overflow-hidden rounded-xl border text-left',
    size === 'sm' && 'rounded-lg',
    layout === 'list' && 'w-full max-w-md',
  )
  const imgClass = cn('w-full object-cover', size === 'sm' ? 'aspect-[16/9]' : 'aspect-[16/10]')
  const bodyClass = size === 'sm' ? 'p-5' : 'p-6'
  const titleClass = 'text-sm font-medium'
  const descClass = 'text-muted-foreground mt-1 max-w-xs text-sm'
  const actionsClass = cn('flex flex-wrap items-center gap-2', size === 'sm' ? 'mt-4' : 'mt-5')
  const actionSize = size === 'sm' ? ('xs' as const) : ('sm' as const)

  return (
    <div
      data-slot="empty-states"
      data-layout={layout}
      className={cn(
        layout === 'list' ? 'flex flex-col items-center gap-4' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
        className,
      )}
    >
      {show('no-data') && (
        <article className={cardClass} data-slot="empty-states-card" data-variant="no-data" role="status">
          {art('no-data') ? (
            <img src={art('no-data')} alt={imageAlt} className={imgClass} />
          ) : art('no-data') === undefined ? (
            <ResponsePanel request="GET /v1/projects" status="200 OK" detail='{ "data": [], "total": 0 }' />
          ) : null}
          <div className={bodyClass}>
            <h3 className={titleClass}>{pick('no-data', 'Nothing here yet', title)}</h3>
            <p className={descClass}>
              {pick(
                'no-data',
                'Your workspace is empty. Create your first project or import existing data to get started.',
                description,
              )}
            </p>
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onPrimary}>
                    {pick('no-data', 'Create', primaryLabel)}
                  </Action>
                ) : null}
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={secondaryDisabled}
                    onClick={onSecondary}
                  >
                    {pick('no-data', 'Import data', secondaryLabel)}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('no-search-results') && (
        <article className={cardClass} data-slot="empty-states-card" data-variant="no-search-results" role="status">
          {art('no-search-results') ? (
            <img src={art('no-search-results')} alt={imageAlt} className={imgClass} />
          ) : art('no-search-results') === undefined ? (
            <ResponsePanel request="GET /search?q=northwind" status="200 OK" detail='{ "hits": 0 }' />
          ) : null}
          <div className={bodyClass}>
            <h3 className={titleClass}>{pick('no-search-results', 'No matches', title)}</h3>
            <p className={descClass}>
              {pick(
                'no-search-results',
                'Nothing matched your current filters. Try different keywords or broaden the search.',
                description,
              )}
            </p>
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onPrimary}>
                    {pick('no-search-results', 'Clear filters', primaryLabel)}
                  </Action>
                ) : null}
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={secondaryDisabled}
                    onClick={onSecondary}
                  >
                    {pick('no-search-results', 'View all', secondaryLabel)}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('first-use') && (
        <article className={cardClass} data-slot="empty-states-card" data-variant="first-use" role="status">
          {art('first-use') ? (
            <img src={art('first-use')} alt={imageAlt} className={imgClass} />
          ) : art('first-use') === undefined ? (
            <ResponsePanel request="GET /v1/workspace" status="200 OK" detail='{ "onboarded": false }' />
          ) : null}
          <div className={bodyClass}>
            <h3 className={titleClass}>{pick('first-use', 'Welcome to Acme', title)}</h3>
            <p className={descClass}>
              {pick(
                'first-use',
                'This is your new dashboard. Set up your workspace and invite the team to start collaborating.',
                description,
              )}
            </p>
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onPrimary}>
                    {pick('first-use', 'Get started', primaryLabel)}
                  </Action>
                ) : null}
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={secondaryDisabled}
                    onClick={onSecondary}
                  >
                    {pick('first-use', 'Take a tour', secondaryLabel)}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('error-recovery') && (
        <article className={cardClass} data-slot="empty-states-card" data-variant="error-recovery" role="alert">
          {art('error-recovery') ? (
            <img src={art('error-recovery')} alt={imageAlt} className={imgClass} />
          ) : art('error-recovery') === undefined ? (
            <ResponsePanel
              request="GET /api/projects"
              status="500 Internal Server Error"
              detail="error: upstream_timeout"
              tone="destructive"
            />
          ) : null}
          <div className={bodyClass}>
            <h3 className={titleClass}>{pick('error-recovery', 'Something broke', title)}</h3>
            <p className={descClass}>
              {pick(
                'error-recovery',
                "We couldn't load your data. Your work is safe — check the connection and try again.",
                description,
              )}
            </p>
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onPrimary}>
                    <RotateCcw />
                    {pick('error-recovery', 'Retry', primaryLabel)}
                  </Action>
                ) : null}
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={secondaryDisabled}
                    onClick={onSecondary}
                  >
                    {pick('error-recovery', 'Contact support', secondaryLabel)}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('no-access') && (
        <article className={cardClass} data-slot="empty-states-card" data-variant="no-access" role="status">
          {art('no-access') ? (
            <img src={art('no-access')} alt={imageAlt} className={imgClass} />
          ) : art('no-access') === undefined ? (
            <ResponsePanel
              request="GET /settings/billing"
              status="403 Forbidden"
              detail="scope billing:read — missing"
              tone="warning"
            />
          ) : null}
          <div className={bodyClass}>
            <h3 className={titleClass}>{pick('no-access', 'Ask your admin', title)}</h3>
            <p className={descClass}>
              {pick(
                'no-access',
                "You don't have access to this workspace yet. Request permission and we'll notify you once it's granted.",
                description,
              )}
            </p>
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showPrimary ? (
                  <Action href={primaryHref} size={actionSize} disabled={primaryDisabled} onClick={onPrimary}>
                    {pick('no-access', 'Request access', primaryLabel)}
                  </Action>
                ) : null}
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={secondaryDisabled}
                    onClick={onSecondary}
                  >
                    {pick('no-access', 'Switch account', secondaryLabel)}
                  </Action>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      )}

      {show('sync-complete') && (
        <article className={cardClass} data-slot="empty-states-card" data-variant="sync-complete" role="status">
          {art('sync-complete') ? (
            <img src={art('sync-complete')} alt={imageAlt} className={imgClass} />
          ) : art('sync-complete') === undefined ? (
            <ResponsePanel request="POST /sync" status="200 OK" detail='{ "synced": 128, "lag_ms": 40 }' />
          ) : null}
          <div className={bodyClass}>
            <h3 className={titleClass}>{pick('sync-complete', 'Everything synced', title)}</h3>
            <p className={descClass}>
              {pick(
                'sync-complete',
                'All changes were uploaded a few seconds ago. We will keep syncing in the background.',
                description,
              )}
            </p>
            {showPrimary || showSecondary ? (
              <div className={actionsClass}>
                {showSecondary ? (
                  <Action
                    href={secondaryHref}
                    size={actionSize}
                    variant="ghost"
                    disabled={secondaryDisabled}
                    onClick={onSecondary}
                  >
                    {pick('sync-complete', 'View activity', secondaryLabel)}
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

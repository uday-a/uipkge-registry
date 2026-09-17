'use client'

import { ArrowLeft, LifeBuoy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface Error404Props {
  code?: string
  title?: string
  description?: string
  /** Replaces the HTTP response panel. Pass `''` to hide art entirely. */
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
  /** `'page'` fills the viewport; `'contained'` fits a preview or nested panel. */
  layout?: 'page' | 'contained'
  className?: string
}

const copy = (fallback: string, override?: string) => (override === undefined ? fallback : override)

export function Error404({
  code,
  title,
  description,
  image = '/illustrations/error-404.jpg',
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
  layout = 'page',
  className,
}: Error404Props) {
  const codeText = copy('404', code)
  const titleText = copy('Page not found', title)
  const descriptionText = copy(
    "The page you're looking for doesn't exist or may have been moved. Check the URL or head back home.",
    description,
  )
  const primaryText = copy('Back to home', primaryLabel)
  const secondaryText = copy('Contact support', secondaryLabel)

  return (
    <section
      data-slot="error-404"
      data-layout={layout}
      className={cn(
        'bg-background relative flex items-center overflow-hidden px-6 py-16',
        layout === 'page' ? 'min-h-svh' : 'min-h-[28rem]',
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          {codeText ? <p className="text-muted-foreground text-sm font-medium">HTTP {codeText}</p> : null}
          {codeText ? <p className="mt-3 text-6xl font-semibold tracking-tighter sm:text-7xl">{codeText}</p> : null}
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{titleText}</h1>
          {descriptionText ? <p className="text-muted-foreground mt-4 max-w-md text-base">{descriptionText}</p> : null}
          {showPrimary || showSecondary ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {showPrimary ? (
                primaryHref ? (
                  <Button asChild size="lg" disabled={primaryDisabled}>
                    <a href={primaryHref} onClick={onPrimary}>
                      <ArrowLeft />
                      {primaryText}
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled={primaryDisabled} onClick={onPrimary}>
                    <ArrowLeft />
                    {primaryText}
                  </Button>
                )
              ) : null}
              {showSecondary ? (
                secondaryHref ? (
                  <Button asChild size="lg" variant="outline" disabled={secondaryDisabled}>
                    <a href={secondaryHref} onClick={onSecondary}>
                      {secondaryText}
                      <LifeBuoy />
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" disabled={secondaryDisabled} onClick={onSecondary}>
                    {secondaryText}
                    <LifeBuoy />
                  </Button>
                )
              ) : null}
            </div>
          ) : null}
        </div>
        {image ? (
          <div className="border-border bg-muted overflow-hidden rounded-xl border">
            <img src={image} alt={imageAlt} className="aspect-[4/3] w-full object-cover" />
          </div>
        ) : image === undefined ? (
          <div className="border-border bg-muted/40 overflow-hidden rounded-xl border font-mono" aria-hidden="true">
            <div className="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">
              curl -i https://app.acme.dev/pricing/teams
            </div>
            <div className="space-y-1 p-4 text-xs leading-relaxed">
              <p>
                <span className="text-muted-foreground">HTTP/1.1</span> {codeText || '404'} Not Found
              </p>
              <p className="text-muted-foreground">content-type: application/json</p>
              <p className="text-muted-foreground">x-request-id: req_9k2e18</p>
              <p className="text-muted-foreground mt-3">{'{ "error": "not_found", "path": "/pricing/teams" }'}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

'use client'

import { LifeBuoy, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface Error500Props {
  code?: string
  title?: string
  description?: string
  /** Replaces the HTTP response panel. Pass `''` to hide art entirely. */
  image?: string
  imageAlt?: string
  primaryLabel?: string
  secondaryLabel?: string
  tertiaryLabel?: string
  primaryHref?: string
  secondaryHref?: string
  tertiaryHref?: string
  showPrimary?: boolean
  showSecondary?: boolean
  showTertiary?: boolean
  primaryDisabled?: boolean
  secondaryDisabled?: boolean
  tertiaryDisabled?: boolean
  onPrimary?: () => void
  onSecondary?: () => void
  onTertiary?: () => void
  /** `'page'` fills the viewport; `'contained'` fits a preview or nested panel. */
  layout?: 'page' | 'contained'
  className?: string
}

const copy = (fallback: string, override?: string) => (override === undefined ? fallback : override)

export function Error500({
  code,
  title,
  description,
  image = '/illustrations/error-500.jpg',
  imageAlt = '',
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
  primaryHref,
  secondaryHref,
  tertiaryHref,
  showPrimary = true,
  showSecondary = true,
  showTertiary = true,
  primaryDisabled = false,
  secondaryDisabled = false,
  tertiaryDisabled = false,
  onPrimary,
  onSecondary,
  onTertiary,
  layout = 'page',
  className,
}: Error500Props) {
  const codeText = copy('500', code)
  const titleText = copy('Something went wrong', title)
  const descriptionText = copy(
    'We hit an unexpected error on our side. Try again in a moment — if it keeps happening, our team is on it.',
    description,
  )
  const primaryText = copy('Try again', primaryLabel)
  const secondaryText = copy('Back to home', secondaryLabel)
  const tertiaryText = copy('Contact support', tertiaryLabel)

  return (
    <section
      data-slot="error-500"
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
          {showPrimary || showSecondary || showTertiary ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {showPrimary ? (
                primaryHref ? (
                  <Button asChild size="lg" disabled={primaryDisabled}>
                    <a href={primaryHref} onClick={onPrimary}>
                      <RefreshCcw />
                      {primaryText}
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled={primaryDisabled} onClick={onPrimary}>
                    <RefreshCcw />
                    {primaryText}
                  </Button>
                )
              ) : null}
              {showSecondary ? (
                secondaryHref ? (
                  <Button asChild size="lg" variant="outline" disabled={secondaryDisabled}>
                    <a href={secondaryHref} onClick={onSecondary}>
                      {secondaryText}
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" disabled={secondaryDisabled} onClick={onSecondary}>
                    {secondaryText}
                  </Button>
                )
              ) : null}
              {showTertiary ? (
                tertiaryHref ? (
                  <Button asChild size="lg" variant="ghost" disabled={tertiaryDisabled}>
                    <a href={tertiaryHref} onClick={onTertiary}>
                      {tertiaryText}
                      <LifeBuoy />
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" variant="ghost" disabled={tertiaryDisabled} onClick={onTertiary}>
                    {tertiaryText}
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
              POST /api/v1/invoices
            </div>
            <div className="space-y-1 p-4 text-xs leading-relaxed">
              <p>
                <span className="text-muted-foreground">HTTP/1.1</span>{' '}
                <span className="text-destructive">{codeText || '500'} Internal Server Error</span>
              </p>
              <p className="text-muted-foreground">error: ECONNRESET</p>
              <p className="text-muted-foreground">at: Worker.run:142</p>
              <p className="text-muted-foreground">x-request-id: req_8f3c2a</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

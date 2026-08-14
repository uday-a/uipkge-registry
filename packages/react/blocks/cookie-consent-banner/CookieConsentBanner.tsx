'use client'

import * as React from 'react'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export interface CookieConsentBannerProps {
  variant?: 'bottom-bar' | 'card'
  className?: string
}

export function CookieConsentBanner({ variant = 'bottom-bar', className }: CookieConsentBannerProps) {
  const [visible, setVisible] = React.useState(true)
  const [showPreferences, setShowPreferences] = React.useState(false)
  const [analytics, setAnalytics] = React.useState(true)
  const [marketing, setMarketing] = React.useState(false)

  const dismiss = () => setVisible(false)

  const preferences = (
    <>
      <Separator />
      <div className="flex items-center justify-between gap-4 py-1">
        <div>
          <p className="text-sm font-medium">Necessary</p>
          <p className="text-muted-foreground text-xs">Required for the site to function.</p>
        </div>
        <Switch checked disabled aria-label="Necessary cookies" />
      </div>
      <div className="flex items-center justify-between gap-4 py-1">
        <div>
          <p className="text-sm font-medium">Analytics</p>
          <p className="text-muted-foreground text-xs">Helps us understand usage patterns.</p>
        </div>
        <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Analytics cookies" />
      </div>
      <div className="flex items-center justify-between gap-4 py-1">
        <div>
          <p className="text-sm font-medium">Marketing</p>
          <p className="text-muted-foreground text-xs">Used to personalize campaigns.</p>
        </div>
        <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Marketing cookies" />
      </div>
    </>
  )

  if (!visible) return null

  return (
    <div
      data-slot="cookie-consent-banner"
      role="dialog"
      aria-label="Cookie consent"
      className={cn('animate-in fade-in duration-150', className)}
    >
      {variant === 'bottom-bar' ? (
        <div className="bg-card border-border w-full border-t px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                  <Cookie className="size-4" aria-hidden="true" />
                </span>
                <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                  We use cookies to improve your experience and analyze traffic. Read our{' '}
                  <a
                    href="#"
                    className="text-foreground focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-2"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowPreferences((v) => !v)}>
                  {showPreferences ? 'Hide preferences' : 'Customize'}
                </Button>
                <Button variant="outline" size="sm" onClick={dismiss}>
                  Reject
                </Button>
                <Button size="sm" onClick={dismiss}>
                  Accept all
                </Button>
              </div>
            </div>

            {showPreferences && (
              <div className="flex flex-col gap-3">
                {preferences}
                <div className="mt-1 flex justify-end">
                  <Button size="sm" onClick={dismiss}>
                    Save preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card border-border mx-auto max-w-md rounded-xl border p-6 shadow-xs">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                <Cookie className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">We value your privacy</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  We use cookies to improve your experience and analyze traffic. Read our{' '}
                  <a
                    href="#"
                    className="text-foreground focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-2"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            {showPreferences && preferences}

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowPreferences((v) => !v)}>
                {showPreferences ? 'Hide preferences' : 'Customize'}
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={dismiss}>
                  Reject
                </Button>
                <Button size="sm" onClick={dismiss}>
                  {showPreferences ? 'Save preferences' : 'Accept all'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
